import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Search, Eye, IndianRupee, CheckCircle2, XCircle, Clock } from 'lucide-react';
import API_ENDPOINTS from '../api';
import getImageUrl from '../utils/imageUtils';

const STATUS_CONFIG = {
    paid:            { label: 'Paid',            cls: 'bg-green-500/10 text-green-500 border-green-500/20' },
    payment_pending: { label: 'Pending',         cls: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
    failed:          { label: 'Failed',          cls: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

const PaymentBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.payment_pending;
    const Icon = status === 'paid' ? CheckCircle2 : status === 'failed' ? XCircle : Clock;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${cfg.cls}`}>
            <Icon className="w-3 h-3" />
            {cfg.label}
        </span>
    );
};

const AdminPayments = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('all');

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.ORDERS);
            setOrders(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const filtered = orders.filter(order => {
        const q = searchTerm.toLowerCase();
        const matchSearch =
            order._id.toLowerCase().includes(q) ||
            order.user?.name?.toLowerCase().includes(q) ||
            order.user?.email?.toLowerCase().includes(q) ||
            order.product?.name?.toLowerCase().includes(q) ||
            (order.razorpayOrderId || '').toLowerCase().includes(q) ||
            (order.razorpayPaymentId || '').toLowerCase().includes(q);
        const matchFilter = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
        return matchSearch && matchFilter;
    });

    const totalCollected = orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + (o.calculatedPrice || 0), 0);
    const totalPending = orders
        .filter(o => o.paymentStatus === 'payment_pending')
        .reduce((sum, o) => sum + (o.calculatedPrice || 0), 0);
    const totalFailed = orders.filter(o => o.paymentStatus === 'failed').length;

    return (
        <DashboardLayout title="Payments">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-heading font-bold flex items-center gap-3">
                        <IndianRupee className="text-zg-accent w-7 h-7" />
                        Payments
                    </h1>
                    <p className="text-zg-secondary mt-1">Track payment status for all orders.</p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-zg-surface/50 border border-zg-secondary/10 rounded-2xl p-5">
                        <p className="text-xs font-bold text-zg-secondary uppercase tracking-widest mb-2">Collected</p>
                        <p className="text-2xl font-black text-green-500">₹{totalCollected.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-zg-secondary mt-1">{orders.filter(o => o.paymentStatus === 'paid').length} paid orders</p>
                    </div>
                    <div className="bg-zg-surface/50 border border-zg-secondary/10 rounded-2xl p-5">
                        <p className="text-xs font-bold text-zg-secondary uppercase tracking-widest mb-2">Pending</p>
                        <p className="text-2xl font-black text-yellow-500">₹{totalPending.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-zg-secondary mt-1">{orders.filter(o => o.paymentStatus === 'payment_pending').length} awaiting payment</p>
                    </div>
                    <div className="bg-zg-surface/50 border border-zg-secondary/10 rounded-2xl p-5">
                        <p className="text-xs font-bold text-zg-secondary uppercase tracking-widest mb-2">Failed</p>
                        <p className="text-2xl font-black text-red-500">{totalFailed}</p>
                        <p className="text-xs text-zg-secondary mt-1">failed transactions</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zg-secondary/50" />
                        <input
                            type="text"
                            placeholder="Search by order, customer, or Razorpay ID..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-zg-surface border border-zg-secondary/10 rounded-xl text-sm focus:outline-none focus:border-zg-accent transition-all"
                        />
                    </div>
                    <select
                        value={paymentFilter}
                        onChange={e => setPaymentFilter(e.target.value)}
                        className="px-4 py-2.5 bg-zg-surface border border-zg-secondary/10 rounded-xl text-sm focus:outline-none focus:border-zg-accent transition-all"
                    >
                        <option value="all">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="payment_pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-zg-surface/50 border border-zg-secondary/10 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zg-accent" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center text-zg-secondary">No payments found.</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zg-secondary/10">
                                    {['Order ID', 'Customer', 'Product', 'Amount', 'Payment Status', 'Razorpay ID', 'Date', ''].map(h => (
                                        <th key={h} className="px-5 py-4 text-left text-xs font-bold text-zg-secondary uppercase tracking-widest whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zg-secondary/5">
                                {filtered.map(order => (
                                    <tr key={order._id} onClick={() => navigate(`/admin/orders/${order._id}`)} className="hover:bg-zg-secondary/5 transition-colors cursor-pointer">
                                        <td className="px-5 py-4 font-mono font-bold text-zg-accent">
                                            #{order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium">{order.user?.name || '—'}</p>
                                            <p className="text-xs text-zg-secondary">{order.user?.email}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {order.product?.image ? (
                                                    <img src={getImageUrl(order.product.image)} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-lg bg-zg-secondary/10 flex-shrink-0" />
                                                )}
                                                <span className="font-medium">{order.product?.name || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-bold">
                                            {order.calculatedPrice ? `₹${order.calculatedPrice.toLocaleString('en-IN')}` : '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <PaymentBadge status={order.paymentStatus} />
                                        </td>
                                        <td className="px-5 py-4 font-mono text-xs text-zg-secondary max-w-[160px]">
                                            {order.razorpayPaymentId ? (
                                                <span className="truncate block" title={order.razorpayPaymentId}>{order.razorpayPaymentId}</span>
                                            ) : (
                                                <span className="text-zg-secondary/40">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-zg-secondary whitespace-nowrap">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={e => { e.stopPropagation(); navigate(`/admin/orders/${order._id}`); }}
                                                className="p-2 text-zg-secondary hover:text-zg-accent hover:bg-zg-accent/10 rounded-lg transition-all"
                                                title="View order"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminPayments;
