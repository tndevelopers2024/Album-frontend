import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { ArrowLeft, Package, Calendar, User, Mail, FileText, Box, Layers, BookOpen, Image as ImageIcon } from 'lucide-react';

const AdminOrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            // Since we don't have a specific single order endpoint for admin yet (we used /my-orders/:id for users or filtered from all orders),
            // we might need to fetch all and find, OR ideally implement GET /api/orders/:id on backend.
            // For now, let's assume GET /api/orders/:id works or we fetch all.
            // Actually, looking at previous steps, we didn't explicitly make a single order endpoint for admin.
            // But usually GET /api/orders/:id should exist. Let's try it.
            // If it fails, I'll fallback to fetching all and finding (not efficient but works for now).
            // Wait, I see I implemented GET /api/orders for all.
            // I'll try fetching all and filtering for now to be safe without backend changes, 
            // OR I can quickly add the backend route if needed. 
            // Let's try to fetch all and filter first as it's safer without backend access right now.
            // Actually, I can check if I can just use the existing GET /api/orders and filter client side?
            // Yes, let's do that for simplicity unless performance is an issue (it's not for this demo).

            const response = await fetch('https://zerogravity-backend.vercel.app/api/orders');
            const data = await response.json();
            const foundOrder = data.find(o => o._id === orderId);
            setOrder(foundOrder);
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <DashboardLayout title="Order Details">
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zg-accent"></div>
            </div>
        </DashboardLayout>
    );

    if (!order) return (
        <DashboardLayout title="Order Details">
            <div className="text-center py-20 text-zg-secondary">Order not found</div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout title={`Order #${order._id.slice(-6).toUpperCase()}`}>
            <button
                onClick={() => navigate('/admin/orders')}
                className="flex items-center gap-2 text-zg-secondary hover:text-zg-primary transition-colors mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Orders</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Product & Status Card */}
                    <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-48 h-48 bg-zg-secondary/10 rounded-xl overflow-hidden flex-shrink-0">
                                {order.product?.image ? (
                                    <img src={order.product.image} alt={order.product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package className="w-12 h-12 text-zg-secondary/50" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">{order.title}</h2>
                                        <p className="text-zg-secondary">{order.product?.name}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                        order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                            order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-zg-surface border border-zg-secondary/10 rounded-lg p-3">
                                        <p className="text-zg-secondary text-xs mb-1">Size</p>
                                        <p className="font-medium">{order.size}</p>
                                    </div>
                                    <div className="bg-zg-surface border border-zg-secondary/10 rounded-lg p-3">
                                        <p className="text-zg-secondary text-xs mb-1">Quantity</p>
                                        <p className="font-medium">{order.quantity}</p>
                                    </div>
                                    <div className="bg-zg-surface border border-zg-secondary/10 rounded-lg p-3">
                                        <p className="text-zg-secondary text-xs mb-1">Order Date</p>
                                        <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-zg-surface border border-zg-secondary/10 rounded-lg p-3">
                                        <p className="text-zg-secondary text-xs mb-1">Order Time</p>
                                        <p className="font-medium">{new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customization Details */}
                    <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-zg-accent" />
                            Customization Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-zg-secondary text-sm">Binding Type</p>
                                <p className="font-medium">{order.bindingType}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-zg-secondary text-sm">Paper Type</p>
                                <p className="font-medium">{order.paperType}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-zg-secondary text-sm">Cover Type</p>
                                <p className="font-medium">{order.coverType}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-zg-secondary text-sm">Box Type</p>
                                <p className="font-medium">{order.boxType}</p>
                            </div>
                            {order.additionalPaper && (
                                <div className="space-y-1">
                                    <p className="text-zg-secondary text-sm">Additional Paper</p>
                                    <p className="font-medium">{order.additionalPaper}</p>
                                </div>
                            )}
                            {order.bagType && (
                                <div className="space-y-1">
                                    <p className="text-zg-secondary text-sm">Bag Type</p>
                                    <p className="font-medium">{order.bagType}</p>
                                </div>
                            )}
                            {order.calendarType && (
                                <div className="space-y-1">
                                    <p className="text-zg-secondary text-sm">Calendar Type</p>
                                    <p className="font-medium">{order.calendarType}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-zg-secondary/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${order.acrylicCalendar ? 'bg-green-500/20 text-green-500' : 'bg-zg-secondary/20 text-zg-secondary'}`}>
                                    {order.acrylicCalendar ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                </div>
                                <span className="text-sm font-medium">Acrylic Calendar</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${order.replicaEbook ? 'bg-green-500/20 text-green-500' : 'bg-zg-secondary/20 text-zg-secondary'}`}>
                                    {order.replicaEbook ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                </div>
                                <span className="text-sm font-medium">Replica E-Book</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Assets */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-zg-accent" />
                            Customer Info
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zg-secondary/10 flex items-center justify-center text-zg-primary font-bold">
                                    {order.user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-medium">{order.user?.name || 'Unknown User'}</p>
                                    <p className="text-xs text-zg-secondary">Customer</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-zg-surface border border-zg-secondary/10 rounded-lg">
                                <Mail className="w-4 h-4 text-zg-secondary" />
                                <span className="text-sm">{order.user?.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Assets */}
                    <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-zg-accent" />
                            Assets
                        </h3>
                        <div className="space-y-4">
                            {order.imageLink && (
                                <div>
                                    <p className="text-zg-secondary text-xs mb-2">Image Upload Link</p>
                                    <a
                                        href={order.imageLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full p-3 bg-zg-surface border border-zg-secondary/10 rounded-lg text-sm text-zg-accent hover:border-zg-accent transition-colors truncate"
                                    >
                                        {order.imageLink}
                                    </a>
                                </div>
                            )}
                            {order.logo && (
                                <div>
                                    <p className="text-zg-secondary text-xs mb-2">Uploaded Logo</p>
                                    <div className="w-full aspect-video bg-zg-surface border border-zg-secondary/10 rounded-lg overflow-hidden flex items-center justify-center">
                                        <img src={order.logo} alt="Order Logo" className="max-w-full max-h-full object-contain" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

// Helper icons
const CheckCircle = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);

const XCircle = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
);

export default AdminOrderDetails;
