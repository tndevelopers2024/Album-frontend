import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import ConfirmationModal from '../components/common/ConfirmationModal';
import {
    ArrowLeft, Mail, Phone, Building2, FileText, MapPin, Calendar,
    CheckCircle, XCircle, Clock, Edit, Trash2, Shield, Activity,
    User, CreditCard, Globe, Hash
} from 'lucide-react';
import { motion } from 'framer-motion';

const InfoCard = ({ icon: Icon, label, value, iconColor = "text-zg-accent" }) => (
    <div className="bg-zg-surface/30 border border-zg-secondary/10 rounded-xl p-4 hover:border-zg-secondary/20 transition-all">
        <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-zg-secondary/10 ${iconColor}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-zg-secondary uppercase tracking-wider mb-1">{label}</p>
                <p className="text-sm text-zg-primary font-medium break-words">{value || 'N/A'}</p>
            </div>
        </div>
    </div>
);

const ActivityItem = ({ action, timestamp, status }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-start gap-4 pb-4 last:pb-0"
    >
        <div className={`p-2 rounded-lg ${status === 'approved' ? 'bg-green-500/10 text-green-400' :
            status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                'bg-blue-500/10 text-blue-400'
            }`}>
            {status === 'approved' ? <CheckCircle className="w-4 h-4" /> :
                status === 'rejected' ? <XCircle className="w-4 h-4" /> :
                    <Activity className="w-4 h-4" />}
        </div>
        <div className="flex-1">
            <p className="text-sm text-zg-primary font-medium">{action}</p>
            <p className="text-xs text-zg-secondary mt-0.5">{timestamp}</p>
        </div>
    </motion.div>
);

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null });

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser || currentUser.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchUserDetails();
    }, [id, navigate]);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`https://zerogravity-backend.vercel.app/api/users/${id}`);
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                console.error('User not found');
                navigate('/admin/users');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const openConfirmModal = (action) => {
        setConfirmModal({ isOpen: true, action });
    };

    const handleVerify = async (action) => {
        try {
            const response = await fetch('https://zerogravity-backend.vercel.app/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: id, action })
            });
            if (response.ok) {
                fetchUserDetails();
            }
        } catch (error) {
            console.error('Error verifying user:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                const response = await fetch(`https://zerogravity-backend.vercel.app/api/users/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    navigate('/admin/users');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="User Details">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zg-accent"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!user) {
        return (
            <DashboardLayout title="User Details">
                <div className="text-center py-12">
                    <p className="text-zg-secondary">User not found</p>
                </div>
            </DashboardLayout>
        );
    }

    const activityLog = [
        { action: 'Account created', timestamp: new Date(user.createdAt).toLocaleString(), status: 'created' },
        {
            action: user.status === 'approved' ? 'Account approved' : user.status === 'rejected' ? 'Account rejected' : 'Pending approval',
            timestamp: new Date().toLocaleString(),
            status: user.status
        }
    ];

    return (
        <DashboardLayout title="User Details">
            {/* Back Button */}
            <button
                onClick={() => navigate('/admin/users')}
                className="flex items-center gap-2 text-zg-secondary hover:text-zg-primary transition-colors mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Users</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Profile Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl overflow-hidden"
                    >
                        {/* Cover */}
                        <div className="relative h-32 bg-gradient-to-br from-zg-accent/20 via-purple-500/10 to-blue-500/10">
                            <div className="absolute -bottom-12 left-8">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-zg-accent/30 to-purple-500/30 flex items-center justify-center text-zg-primary font-bold text-3xl border-4 border-zg-surface backdrop-blur-xl overflow-hidden">
                                    {user.logo ? (
                                        <img src={user.logo} alt={user.businessName} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name.charAt(0)
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="pt-16 px-8 pb-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="text-2xl font-heading font-bold text-zg-primary mb-2">{user.name}</h2>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border
                                            ${user.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                user.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'approved' ? 'bg-green-400' :
                                                user.status === 'rejected' ? 'bg-red-400' :
                                                    'bg-yellow-400'
                                                }`}></span>
                                            {user.status}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border bg-blue-500/10 text-blue-400 border-blue-500/20">
                                            <Shield className="w-3 h-3" />
                                            {user.role}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    {user.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => openConfirmModal('approve')}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-all border border-green-500/20 font-medium text-sm"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => openConfirmModal('reject')}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20 font-medium text-sm"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    <button className="p-2 bg-zg-secondary/10 hover:bg-zg-secondary/20 text-zg-secondary hover:text-zg-primary rounded-lg transition-all border border-zg-secondary/10">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-heading font-bold text-zg-primary mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-zg-accent" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoCard icon={Mail} label="Email Address" value={user.email} />
                            <InfoCard icon={Phone} label="Phone Number" value={user.phone} />
                            <InfoCard icon={Hash} label="User ID" value={user._id} iconColor="text-blue-400" />
                            <InfoCard icon={Calendar} label="Joined Date" value={new Date(user.createdAt).toLocaleDateString()} iconColor="text-purple-400" />
                        </div>
                    </motion.div>

                    {/* Business Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-heading font-bold text-zg-primary mb-4 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-zg-accent" />
                            Business Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoCard icon={Building2} label="Business Name" value={user.businessName} />
                            <InfoCard icon={FileText} label="GST Number" value={user.gstNo} />
                            <InfoCard icon={MapPin} label="Business Address" value={user.address} iconColor="text-green-400" />
                            <InfoCard icon={Globe} label="Website" value={user.website} iconColor="text-cyan-400" />
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-heading font-bold text-zg-primary mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-zg-accent" />
                            Quick Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-zg-secondary/10 rounded-lg">
                                <span className="text-sm text-zg-secondary">Total Orders</span>
                                <span className="text-lg font-bold text-zg-primary">0</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-zg-secondary/10 rounded-lg">
                                <span className="text-sm text-zg-secondary">Total Spent</span>
                                <span className="text-lg font-bold text-zg-accent">₹0</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-zg-secondary/10 rounded-lg">
                                <span className="text-sm text-zg-secondary">Last Order</span>
                                <span className="text-sm text-zg-primary">Never</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Activity Log */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-heading font-bold text-zg-primary mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-zg-accent" />
                            Activity Log
                        </h3>
                        <div className="space-y-4">
                            {activityLog.map((activity, index) => (
                                <ActivityItem
                                    key={index}
                                    action={activity.action}
                                    timestamp={activity.timestamp}
                                    status={activity.status}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Account Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6"
                    >
                        <h3 className="text-lg font-heading font-bold text-zg-primary mb-4">Account Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-zg-secondary/10 hover:bg-zg-secondary/20 text-zg-primary rounded-lg transition-all text-sm font-medium">
                                <Mail className="w-4 h-4" />
                                Send Email
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-zg-secondary/10 hover:bg-zg-secondary/20 text-zg-primary rounded-lg transition-all text-sm font-medium">
                                <Shield className="w-4 h-4" />
                                Reset Password
                            </button>
                            <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-all border border-yellow-500/20 text-sm font-medium">
                                <Clock className="w-4 h-4" />
                                Suspend Account
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, action: null })}
                onConfirm={() => handleVerify(confirmModal.action)}
                title={confirmModal.action === 'approve' ? 'Approve User' : 'Reject User'}
                message={
                    confirmModal.action === 'approve'
                        ? `Are you sure you want to approve ${user?.name}? They will gain access to the system.`
                        : `Are you sure you want to reject ${user?.name}? They will not be able to access the system.`
                }
                confirmText={confirmModal.action === 'approve' ? 'Approve' : 'Reject'}
                type={confirmModal.action === 'approve' ? 'success' : 'danger'}
            />
        </DashboardLayout>
    );
};

export default UserDetails;
