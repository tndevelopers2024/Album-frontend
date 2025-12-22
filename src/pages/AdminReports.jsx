import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Download, Calendar, Filter, DollarSign, ShoppingBag, Clock, X } from 'lucide-react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../datepicker.css';

const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorStyles = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20' },
        green: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' },
        yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20' }
    };

    const styles = colorStyles[color] || colorStyles.blue;

    return (
        <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 p-6 rounded-2xl flex items-center gap-4">
            <div className={`p-3 rounded-xl ${styles.bg} ${styles.text}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-zg-secondary text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <p className="text-2xl font-heading font-bold text-zg-primary">{value}</p>
            </div>
        </div>
    );
};

const AdminReports = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, startDate, endDate, statusFilter]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('https://zerogravity-backend.vercel.app/api/orders');
            const data = await response.json();
            setOrders(data);
            setFilteredOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let result = orders;

        // Date Filter
        if (startDate) {
            result = result.filter(order => new Date(order.createdAt) >= new Date(startDate));
        }
        if (endDate) {
            // Set end date to end of day
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            result = result.filter(order => new Date(order.createdAt) <= end);
        }

        // Status Filter
        if (statusFilter !== 'all') {
            result = result.filter(order => order.status === statusFilter);
        }

        setFilteredOrders(result);
    };

    const handleExportCSV = () => {
        if (filteredOrders.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Product', 'Size', 'Quantity', 'Status', 'Date'];
        const csvContent = [
            headers.join(','),
            ...filteredOrders.map(order => [
                order._id,
                `"${order.user?.name || 'Unknown'}"`,
                order.user?.email,
                `"${order.title}"`,
                order.size,
                order.quantity,
                order.status,
                new Date(order.createdAt).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const stats = {
        totalOrders: filteredOrders.length,
        totalRevenue: filteredOrders.length * 1500, // Mock revenue: 1500 per order
        pendingOrders: filteredOrders.filter(o => o.status === 'pending').length,
        completedOrders: filteredOrders.filter(o => o.status === 'completed').length
    };

    return (
        <DashboardLayout title="Reports & Analytics">
            {/* Filters */}
            <div className="bg-zg-surface/50 border border-zg-secondary/10 rounded-2xl p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="w-full md:w-auto">
                        <label className="block text-xs font-bold text-zg-secondary uppercase tracking-wider mb-2">Date Range</label>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zg-secondary z-10 pointer-events-none" />
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    placeholderText="Start Date"
                                    dateFormat="MMM dd, yyyy"
                                    className="bg-zg-bg border border-zg-secondary/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent w-40"
                                />
                            </div>
                            <span className="text-zg-secondary">-</span>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zg-secondary z-10 pointer-events-none" />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    placeholderText="End Date"
                                    dateFormat="MMM dd, yyyy"
                                    className="bg-zg-bg border border-zg-secondary/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent w-40"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        <label className="block text-xs font-bold text-zg-secondary uppercase tracking-wider mb-2">Status</label>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zg-secondary" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full md:w-48 bg-zg-bg border border-zg-secondary/10 rounded-xl py-2.5 pl-10 pr-8 text-sm text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent appearance-none cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zg-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1"></div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setStartDate(null);
                                setEndDate(null);
                                setStatusFilter('all');
                            }}
                            className="px-4 py-2.5 border border-zg-secondary/10 rounded-xl text-sm font-medium text-zg-secondary hover:text-zg-primary hover:bg-zg-secondary/10 transition-all"
                        >
                            Clear Filters
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-6 py-2.5 bg-zg-accent text-black rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} color="blue" />
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
                <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Clock} color="yellow" />
                <StatCard title="Completed" value={stats.completedOrders} icon={Filter} color="purple" />
            </div>

            {/* Preview Table */}
            <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-zg-secondary/10 bg-zg-secondary/5 flex justify-between items-center">
                    <h3 className="font-heading font-bold text-lg">Report Preview</h3>
                    <span className="text-sm text-zg-secondary">Showing {filteredOrders.length} records</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zg-secondary/10 bg-zg-secondary/5">
                                <th className="p-4 text-xs font-bold text-zg-secondary uppercase tracking-wider">Order ID</th>
                                <th className="p-4 text-xs font-bold text-zg-secondary uppercase tracking-wider">Date</th>
                                <th className="p-4 text-xs font-bold text-zg-secondary uppercase tracking-wider">Customer</th>
                                <th className="p-4 text-xs font-bold text-zg-secondary uppercase tracking-wider">Product</th>
                                <th className="p-4 text-xs font-bold text-zg-secondary uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-zg-secondary uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zg-secondary/10">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.slice(0, 10).map((order) => (
                                    <tr key={order._id} className="hover:bg-zg-secondary/5 transition-colors">
                                        <td className="p-4 text-sm font-mono text-zg-secondary">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="p-4 text-sm text-zg-secondary">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-sm font-medium text-zg-primary">{order.user?.name || 'Unknown'}</td>
                                        <td className="p-4 text-sm text-zg-primary">{order.title}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-zg-primary text-right">₹1,500</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-zg-secondary">No orders found for the selected criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length > 10 && (
                    <div className="p-4 text-center border-t border-zg-secondary/10 text-xs text-zg-secondary">
                        Showing first 10 records. Export to CSV to view all.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminReports;
