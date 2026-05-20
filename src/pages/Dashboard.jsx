import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Package, Heart, LogOut, Settings, 
    ChevronRight, MapPin, Phone, Mail, Building2,
    Calendar, ArrowRight, ShoppingBag, BookOpen
} from 'lucide-react';
import API_ENDPOINTS from '../api';
import { getImageUrl } from '../utils/imageUtils';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        businessName: '',
        gstNo: ''
    });
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            if (!storedUser || !storedUser.id) {
                setLoading(false);
                return;
            }
            try {
                // Fetch Profile
                const profileRes = await fetch(API_ENDPOINTS.PROFILE(storedUser.id));
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setUser(profileData);
                    setEditForm({
                        name: profileData.name,
                        phone: profileData.phone,
                        businessName: profileData.businessName,
                        gstNo: profileData.gstNo
                    });
                }

                // Fetch Orders
                const ordersRes = await fetch(API_ENDPOINTS.MY_ORDERS(storedUser.id));
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData);
                }

                // Fetch Favorites
                const favsRes = await fetch(API_ENDPOINTS.FAVORITES(storedUser.id));
                if (favsRes.ok) {
                    const favsData = await favsRes.json();
                    setFavorites(favsData);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleToggleFavorite = async (productId) => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const res = await fetch(API_ENDPOINTS.TOGGLE_FAVORITE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: storedUser.id, productId })
            });
            if (res.ok) {
                setFavorites(prev => prev.filter(p => p._id !== productId));
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const res = await fetch(API_ENDPOINTS.UPDATE_PROFILE(storedUser.id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                // Update localStorage with new name if it changed
                const updatedStoredUser = { ...storedUser, name: data.user.name };
                localStorage.setItem('user', JSON.stringify(updatedStoredUser));
                setIsEditing(false);
            } else {
                alert(data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setUpdating(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zg-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-zg-accent border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const tabs = [
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'favorites', label: 'Favorites', icon: Heart },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-zg-bg text-zg-primary pb-20">
            {/* Header */}
            <div className="bg-zg-surface border-b border-zg-secondary/10 pt-10 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-2xl bg-zg-accent/10 border border-zg-accent/20 flex items-center justify-center overflow-hidden">
                                {user?.logo ? (
                                    <img src={getImageUrl(user.logo)} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-zg-accent" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-heading font-bold mb-1">Welcome, {user?.name}</h1>
                                <p className="text-zg-secondary flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    {user?.businessName}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <div className="bg-zg-surface border border-zg-secondary/10 rounded-2xl overflow-hidden sticky top-24">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all relative ${
                                            activeTab === tab.id 
                                            ? 'bg-zg-accent/5 text-zg-accent font-bold' 
                                            : 'text-zg-secondary hover:bg-zg-secondary/5'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <motion.div 
                                                layoutId="activeTab" 
                                                className="absolute left-0 top-0 bottom-0 w-1 bg-zg-accent" 
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'orders' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold">Recent Orders</h2>
                                            <span className="text-sm text-zg-secondary">{orders.length} total</span>
                                        </div>
                                        {orders.length === 0 ? (
                                            <div className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-12 text-center">
                                                <Package className="w-12 h-12 text-zg-secondary/20 mx-auto mb-4" />
                                                <p className="text-zg-secondary mb-6">You haven't placed any orders yet.</p>
                                                <button 
                                                    onClick={() => navigate('/shop')}
                                                    className="px-6 py-2 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all"
                                                >
                                                    Browse Shop
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                {orders.map(order => (
                                                    <div 
                                                        key={order._id}
                                                        className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-5 hover:border-zg-accent/30 transition-all cursor-pointer group"
                                                        onClick={() => navigate(`/my-orders`)} 
                                                    >
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div className="flex gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-zg-secondary/10 flex items-center justify-center">
                                                                    <BookOpen className="w-6 h-6 text-zg-secondary" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold group-hover:text-zg-accent transition-colors">{order.title}</h3>
                                                                    <p className="text-xs text-zg-secondary">Order #{order._id.slice(-6).toUpperCase()}</p>
                                                                </div>
                                                            </div>
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                                order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                                order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                                'bg-yellow-500/10 text-yellow-500'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm pt-4 border-t border-zg-secondary/5">
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-zg-secondary">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                                <span className="font-bold">₹{order.calculatedPrice?.toLocaleString()}</span>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-zg-secondary group-hover:translate-x-1 transition-transform" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'favorites' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold">My Favorites</h2>
                                            <span className="text-sm text-zg-secondary">{favorites.length} items</span>
                                        </div>
                                        {favorites.length === 0 ? (
                                            <div className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-12 text-center">
                                                <Heart className="w-12 h-12 text-zg-secondary/20 mx-auto mb-4" />
                                                <p className="text-zg-secondary mb-6">No favorite albums yet.</p>
                                                <button 
                                                    onClick={() => navigate('/shop')}
                                                    className="px-6 py-2 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all"
                                                >
                                                    Explore Collections
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {favorites.map(item => (
                                                    <div 
                                                        key={item._id}
                                                        className="bg-zg-surface border border-zg-secondary/10 rounded-2xl overflow-hidden group"
                                                    >
                                                        <div className="aspect-video relative overflow-hidden">
                                                            <img 
                                                                src={getImageUrl(item.image || (item.gallery && item.gallery[0]))} 
                                                                alt={item.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleFavorite(item._id);
                                                                }}
                                                                className="absolute top-3 right-3 p-2 bg-white/10 backdrop-blur-md rounded-full text-zg-accent border border-white/20 hover:bg-zg-accent hover:text-black transition-all"
                                                            >
                                                                <Heart className="w-4 h-4 fill-current" />
                                                            </button>
                                                        </div>
                                                        <div className="p-4">
                                                            <h3 className="font-bold mb-1">{item.name}</h3>
                                                            <p className="text-xs text-zg-secondary mb-4 line-clamp-1">{item.category}</p>
                                                            <button 
                                                                onClick={() => navigate(`/shop/${item._id}`)}
                                                                className="w-full py-2 bg-zg-surface border border-zg-secondary/10 rounded-lg text-sm font-bold hover:border-zg-accent transition-all flex items-center justify-center gap-2"
                                                            >
                                                                Order Now
                                                                <ArrowRight className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'profile' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold">Profile Details</h2>
                                            {!isEditing && (
                                                <button 
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-4 py-2 bg-zg-accent/10 text-zg-accent rounded-lg font-bold text-sm hover:bg-zg-accent hover:text-black transition-all"
                                                >
                                                    Edit Profile
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-8">
                                            {isEditing ? (
                                                <form onSubmit={handleProfileUpdate} className="space-y-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="text-xs text-zg-secondary uppercase font-bold tracking-wider block mb-2">Full Name</label>
                                                                <input 
                                                                    type="text" name="name" value={editForm.name} onChange={handleInputChange}
                                                                    className="w-full bg-zg-bg border border-zg-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-zg-accent transition-all"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-zg-secondary uppercase font-bold tracking-wider block mb-2">Phone Number</label>
                                                                <input 
                                                                    type="text" name="phone" value={editForm.phone} onChange={handleInputChange}
                                                                    className="w-full bg-zg-bg border border-zg-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-zg-accent transition-all"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="text-xs text-zg-secondary uppercase font-bold tracking-wider block mb-2">Business Name</label>
                                                                <input 
                                                                    type="text" name="businessName" value={editForm.businessName} onChange={handleInputChange}
                                                                    className="w-full bg-zg-bg border border-zg-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-zg-accent transition-all"
                                                                    required
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs text-zg-secondary uppercase font-bold tracking-wider block mb-2">GST Number</label>
                                                                <input 
                                                                    type="text" name="gstNo" value={editForm.gstNo} onChange={handleInputChange}
                                                                    className="w-full bg-zg-bg border border-zg-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-zg-accent transition-all"
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end gap-4 pt-8 border-t border-zg-secondary/10">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setIsEditing(false)}
                                                            className="px-6 py-2.5 bg-zg-bg text-zg-secondary rounded-xl font-bold text-sm hover:text-zg-primary transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button 
                                                            type="submit"
                                                            disabled={updating}
                                                            className="px-8 py-2.5 bg-zg-accent text-black rounded-xl font-bold text-sm hover:bg-zg-accent-hover transition-all disabled:opacity-50"
                                                        >
                                                            {updating ? 'Saving...' : 'Save Changes'}
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className="text-xs text-zg-secondary uppercase font-bold tracking-wider block mb-2">Personal Information</label>
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-4 p-4 bg-zg-bg rounded-xl border border-zg-secondary/5">
                                                                    <User className="w-5 h-5 text-zg-accent" />
                                                                    <div>
                                                                        <p className="text-xs text-zg-secondary">Full Name</p>
                                                                        <p className="font-medium">{user?.name}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4 p-4 bg-zg-bg rounded-xl border border-zg-secondary/5">
                                                                    <Mail className="w-5 h-5 text-zg-accent" />
                                                                    <div>
                                                                        <p className="text-xs text-zg-secondary">Email Address</p>
                                                                        <p className="font-medium">{user?.email}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4 p-4 bg-zg-bg rounded-xl border border-zg-secondary/5">
                                                                    <Phone className="w-5 h-5 text-zg-accent" />
                                                                    <div>
                                                                        <p className="text-xs text-zg-secondary">Phone Number</p>
                                                                        <p className="font-medium">{user?.phone}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-6">
                                                        <div>
                                                            <label className="text-xs text-zg-secondary uppercase font-bold tracking-wider block mb-2">Business Details</label>
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-4 p-4 bg-zg-bg rounded-xl border border-zg-secondary/5">
                                                                    <Building2 className="w-5 h-5 text-zg-accent" />
                                                                    <div>
                                                                        <p className="text-xs text-zg-secondary">Business Name</p>
                                                                        <p className="font-medium">{user?.businessName}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4 p-4 bg-zg-bg rounded-xl border border-zg-secondary/5">
                                                                    <Settings className="w-5 h-5 text-zg-accent" />
                                                                    <div>
                                                                        <p className="text-xs text-zg-secondary">GST Number</p>
                                                                        <p className="font-medium">{user?.gstNo}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4 p-4 bg-zg-bg rounded-xl border border-zg-secondary/5">
                                                                    <Calendar className="w-5 h-5 text-zg-accent" />
                                                                    <div>
                                                                        <p className="text-xs text-zg-secondary">Member Since</p>
                                                                        <p className="font-medium">{new Date(user?.createdAt).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
