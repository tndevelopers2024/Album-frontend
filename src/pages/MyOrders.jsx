import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Package, RefreshCw } from 'lucide-react';
import API_ENDPOINTS from '../api';
import getImageUrl from '../utils/imageUtils';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [retrying, setRetrying] = useState(null);
    const navigate = useNavigate();

    const handleRetryPayment = async (order) => {
        setRetrying(order._id);
        try {
            const res = await fetch(API_ENDPOINTS.PAYMENT_RETRY(order._id), { method: 'POST' });
            const data = await res.json();
            if (!res.ok) { alert(data.message || 'Failed to retry payment'); return; }

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: 'Zero Gravity Albums',
                description: order.title,
                order_id: data.razorpayOrderId,
                prefill: {
                    name: order.deliveryAddress?.name || '',
                    contact: order.deliveryAddress?.phone || '',
                },
                theme: { color: '#D4AF37' },
                handler: async (response) => {
                    const verifyRes = await fetch(API_ENDPOINTS.PAYMENT_VERIFY, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            dbOrderId: order._id
                        })
                    });
                    if (verifyRes.ok) {
                        setOrders(prev => prev.map(o => o._id === order._id ? { ...o, paymentStatus: 'paid' } : o));
                    } else {
                        alert('Payment verification failed. Contact support.');
                    }
                },
                modal: { ondismiss: () => setRetrying(null) }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch {
            alert('Error retrying payment');
        } finally {
            setRetrying(null);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(API_ENDPOINTS.MY_ORDERS(user.id));
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
                                            <img src={getImageUrl(order.product.image)} alt={order.product.name} className="w-full h-full object-cover" />
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
                                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                                {order.paymentStatus === 'payment_pending' ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500">
                                                        Payment Pending
                                                    </span>
                                                ) : order.paymentStatus === 'paid' ? (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-500">
                                                        Paid
                                                    </span>
                                                ) : null}
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                    order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                                            'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
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

                                        {order.paymentStatus === 'payment_pending' && (
                                            <div className="mt-4 pt-4 border-t border-zg-secondary/10 flex items-center justify-between">
                                                <p className="text-sm text-orange-400">Payment incomplete. Complete payment to confirm your order.</p>
                                                <button
                                                    onClick={() => handleRetryPayment(order)}
                                                    disabled={retrying === order._id}
                                                    className="flex items-center gap-2 px-5 py-2 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all text-sm disabled:opacity-50"
                                                >
                                                    <RefreshCw className={`w-4 h-4 ${retrying === order._id ? 'animate-spin' : ''}`} />
                                                    {retrying === order._id ? 'Opening...' : 'Retry Payment'}
                                                </button>
                                            </div>
                                        )}
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
