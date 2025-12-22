import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Package, Calendar, Clock } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`https://zerogravity-backend.vercel.app/api/orders/my-orders/${user.id}`);
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-zg-bg text-zg-primary p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/shop')}
                        className="p-2 rounded-lg hover:bg-zg-secondary/10 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-bold">My Orders</h1>
                        <p className="text-zg-secondary">Track your past purchases</p>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zg-accent"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-zg-secondary/10 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="w-8 h-8 opacity-50 text-zg-secondary" />
                        </div>
                        <p className="text-lg font-medium text-zg-primary mb-2">No orders found</p>
                        <p className="text-sm text-zg-secondary mb-6">
                            You haven't placed any orders yet.
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-6 py-3 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6 hover:border-zg-accent/30 transition-all">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Product Image */}
                                    <div className="w-full md:w-32 h-32 bg-zg-secondary/10 rounded-xl overflow-hidden flex-shrink-0">
                                        {order.product?.image ? (
                                            <img src={order.product.image} alt={order.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-8 h-8 text-zg-secondary/50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Details */}
                                    <div className="flex-1">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">{order.title}</h3>
                                                <p className="text-sm text-zg-secondary">Order ID: {order._id}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-zg-secondary mb-1">Product</p>
                                                <p className="font-medium">{order.product?.name || 'Unknown Product'}</p>
                                            </div>
                                            <div>
                                                <p className="text-zg-secondary mb-1">Size</p>
                                                <p className="font-medium">{order.size}</p>
                                            </div>
                                            <div>
                                                <p className="text-zg-secondary mb-1">Quantity</p>
                                                <p className="font-medium">{order.quantity}</p>
                                            </div>
                                            <div>
                                                <p className="text-zg-secondary mb-1">Date</p>
                                                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
