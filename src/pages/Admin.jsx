import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { Users, CheckCircle, XCircle, Clock, MoreVertical, Search, Filter, ChevronDown, SortAsc, X, Eye, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color }) => {
    const colorStyles = {
        blue: {
            bg: 'bg-blue-500/10',
            text: 'text-blue-500',
            border: 'border-blue-500/20',
            hoverBg: 'group-hover:bg-blue-500/20',
            glow: 'bg-blue-500/10'
        },
        green: {
            bg: 'bg-green-500/10',
            text: 'text-green-500',
            border: 'border-green-500/20',
            hoverBg: 'group-hover:bg-green-500/20',
            glow: 'bg-green-500/10'
        },
        yellow: {
            bg: 'bg-yellow-500/10',
            text: 'text-yellow-500',
            border: 'border-yellow-500/20',
            hoverBg: 'group-hover:bg-yellow-500/20',
            glow: 'bg-yellow-500/10'
        },
        red: {
            bg: 'bg-red-500/10',
            text: 'text-red-400',
            border: 'border-red-500/20',
            hoverBg: 'group-hover:bg-red-500/20',
            glow: 'bg-red-500/10'
        }
    };

    const styles = colorStyles[color] || colorStyles.blue;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zg-surface/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 ${styles.glow} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 ${styles.hoverBg} transition-colors duration-500`}></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${styles.bg} ${styles.text}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${styles.bg} ${styles.text} border ${styles.border}`}>
                        +2.5%
                    </span>
                </div>
                <h3 className="text-zg-secondary text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
                <p className="text-3xl font-heading font-bold text-zg-primary">{value}</p>
            </div>
        </motion.div>
    );
};

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, userId: null, action: null, userName: '' });
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://zerogravity-backend.vercel.app/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchUsers();
    }, [navigate]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showFilterDropdown && !event.target.closest('.filter-dropdown-container')) {
                setShowFilterDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showFilterDropdown]);

    const openConfirmModal = (userId, action, userName) => {
        setConfirmModal({ isOpen: true, userId, action, userName });
    };

    const handleVerify = async (userId, action) => {
        try {
            const response = await fetch('https://zerogravity-backend.vercel.app/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, action })
            });
            if (response.ok) {
                fetchUsers(); // Refresh list
            }
        } catch (error) {
            console.error('Error verifying user:', error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`https://zerogravity-backend.vercel.app/api/users/${userId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchUsers(); // Refresh list
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'approved').length,
        pending: users.filter(u => u.status === 'pending').length,
        rejected: users.filter(u => u.status === 'rejected').length
    };

    // Filter and sort users
    const filteredUsers = users
        .filter(user => {
            // Search filter
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.businessName.toLowerCase().includes(searchLower) ||
                user.gstNo.toLowerCase().includes(searchLower);

            // Status filter
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'email':
                    return a.email.localeCompare(b.email);
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'date':
                default:
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            }
        });

    return (
        <DashboardLayout title="User Management">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.total} icon={Users} color="blue" />
                <StatCard title="Active Users" value={stats.active} icon={CheckCircle} color="green" />
                <StatCard title="Pending Requests" value={stats.pending} icon={Clock} color="yellow" />
                <StatCard title="Rejected" value={stats.rejected} icon={XCircle} color="red" />
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zg-secondary" />
                        <input
                            type="text"
                            placeholder="Search by name, email, business, or GST..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zg-surface/50 border border-zg-secondary/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-zg-primary placeholder-zg-secondary/50 focus:outline-none focus:border-zg-accent/50 focus:ring-1 focus:ring-zg-accent/50 transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zg-secondary hover:text-zg-primary transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 w-full sm:w-auto">
                        {/* Status Filter Dropdown */}
                        <div className="relative flex-1 sm:flex-initial filter-dropdown-container">
                            <button
                                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                className="flex items-center justify-between gap-2 w-full sm:w-auto px-4 py-2.5 bg-zg-surface/50 border border-zg-secondary/10 rounded-xl text-sm font-medium text-zg-secondary hover:text-zg-primary hover:bg-zg-secondary/10 transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    <span>Filter</span>
                                    {statusFilter !== 'all' && (
                                        <span className="px-2 py-0.5 bg-zg-accent/20 text-zg-accent rounded-full text-xs font-bold">1</span>
                                    )}
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showFilterDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full mt-2 right-0 w-56 bg-zg-surface border border-zg-secondary/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                    >
                                        <div className="p-2">
                                            <div className="px-3 py-2 text-xs font-bold text-zg-secondary uppercase tracking-wider">Status</div>
                                            {[
                                                { value: 'all', label: 'All Users', icon: Users },
                                                { value: 'pending', label: 'Pending', icon: Clock },
                                                { value: 'approved', label: 'Approved', icon: CheckCircle },
                                                { value: 'rejected', label: 'Rejected', icon: XCircle }
                                            ].map(({ value, label, icon: Icon }) => (
                                                <button
                                                    key={value}
                                                    onClick={() => {
                                                        setStatusFilter(value);
                                                        setShowFilterDropdown(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${statusFilter === value
                                                        ? 'bg-zg-accent/10 text-zg-accent font-bold'
                                                        : 'text-zg-secondary hover:bg-zg-secondary/10 hover:text-zg-primary'
                                                        }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    <span>{label}</span>
                                                    {statusFilter === value && (
                                                        <CheckCircle className="w-4 h-4 ml-auto" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="border-t border-white/5 p-2">
                                            <div className="px-3 py-2 text-xs font-bold text-zg-secondary uppercase tracking-wider">Sort By</div>
                                            {[
                                                { value: 'date', label: 'Date Added' },
                                                { value: 'name', label: 'Name (A-Z)' },
                                                { value: 'email', label: 'Email' },
                                                { value: 'status', label: 'Status' }
                                            ].map(({ value, label }) => (
                                                <button
                                                    key={value}
                                                    onClick={() => {
                                                        setSortBy(value);
                                                        setShowFilterDropdown(false);
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${sortBy === value
                                                        ? 'bg-zg-accent/10 text-zg-accent font-bold'
                                                        : 'text-zg-secondary hover:bg-zg-secondary/10 hover:text-zg-primary'
                                                        }`}
                                                >
                                                    <SortAsc className="w-4 h-4" />
                                                    <span>{label}</span>
                                                    {sortBy === value && (
                                                        <CheckCircle className="w-4 h-4 ml-auto" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2.5 bg-zg-accent text-black rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20">
                            <Users className="w-4 h-4" />
                            <span className="hidden sm:inline">Add User</span>
                        </button>
                    </div>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || statusFilter !== 'all') && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-wrap items-center gap-2"
                    >
                        <span className="text-xs text-zg-secondary font-medium">Active filters:</span>
                        {searchTerm && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zg-surface/50 border border-zg-secondary/10 rounded-full text-xs text-zg-primary">
                                <Search className="w-3 h-3" />
                                "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="ml-1 hover:text-zg-accent transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {statusFilter !== 'all' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zg-surface/50 border border-zg-secondary/10 rounded-full text-xs text-zg-primary">
                                <Filter className="w-3 h-3" />
                                Status: {statusFilter}
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className="ml-1 hover:text-zg-accent transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                            }}
                            className="text-xs text-zg-secondary hover:text-zg-accent transition-colors font-medium"
                        >
                            Clear all
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Users Table */}
            <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl overflow-hidden">
                {/* Results Count */}
                <div className="px-6 py-3 border-b border-zg-secondary/10 bg-zg-secondary/5">
                    <p className="text-sm text-zg-secondary">
                        Showing <span className="text-zg-primary font-bold">{filteredUsers.length}</span> of <span className="text-zg-primary font-bold">{users.length}</span> users
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zg-secondary/10 bg-zg-secondary/5">
                                <th className="p-5 font-heading font-bold text-zg-secondary text-xs uppercase tracking-wider">User Details</th>
                                <th className="p-5 font-heading font-bold text-zg-secondary text-xs uppercase tracking-wider">Business Info</th>
                                <th className="p-5 font-heading font-bold text-zg-secondary text-xs uppercase tracking-wider">Status</th>
                                <th className="p-5 font-heading font-bold text-zg-secondary text-xs uppercase tracking-wider">Joined Date</th>
                                <th className="p-5 font-heading font-bold text-zg-secondary text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zg-secondary/10">
                            {filteredUsers.map((user, index) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group hover:bg-zg-secondary/5 transition-colors"
                                >
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zg-accent/20 to-purple-500/20 flex items-center justify-center text-zg-primary font-bold text-sm border border-zg-secondary/10">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-zg-primary text-sm">{user.name}</div>
                                                <div className="text-xs text-zg-secondary">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="text-sm text-zg-primary font-medium">{user.businessName}</div>
                                        <div className="text-xs text-zg-secondary font-mono mt-0.5">{user.gstNo}</div>
                                    </td>
                                    <td className="p-5">
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
                                    </td>
                                    <td className="p-5 text-sm text-zg-secondary">
                                        {new Date().toLocaleDateString()}
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            {user.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => openConfirmModal(user._id, 'approve', user.name)}
                                                        className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors border border-green-500/20"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openConfirmModal(user._id, 'reject', user.name)}
                                                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => navigate(`/admin/users/${user._id}`)}
                                                    className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openConfirmModal(user._id, 'delete', user.name)}
                                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
                                                title="Delete User"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="p-12 text-center flex flex-col items-center justify-center text-zg-secondary">
                        <div className="w-16 h-16 bg-zg-secondary/10 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="text-lg font-medium text-zg-primary">No users found</p>
                        <p className="text-sm mt-1">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your filters or search term.'
                                : 'Get started by adding a new user.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, userId: null, action: null, userName: '' })}
                onConfirm={() => {
                    if (confirmModal.action === 'delete') {
                        handleDelete(confirmModal.userId);
                    } else {
                        handleVerify(confirmModal.userId, confirmModal.action);
                    }
                }}
                title={
                    confirmModal.action === 'approve' ? 'Approve User' :
                        confirmModal.action === 'reject' ? 'Reject User' :
                            'Delete User'
                }
                message={
                    confirmModal.action === 'approve'
                        ? `Are you sure you want to approve ${confirmModal.userName}? They will gain access to the system.`
                        : confirmModal.action === 'reject'
                            ? `Are you sure you want to reject ${confirmModal.userName}? They will not be able to access the system.`
                            : `Are you sure you want to delete ${confirmModal.userName}? This action cannot be undone.`
                }
                confirmText={
                    confirmModal.action === 'approve' ? 'Approve' :
                        confirmModal.action === 'reject' ? 'Reject' :
                            'Delete'
                }
                type={
                    confirmModal.action === 'approve' ? 'success' :
                        confirmModal.action === 'reject' ? 'danger' :
                            'danger'
                }
            />
        </DashboardLayout>
    );
};

export default Admin;
