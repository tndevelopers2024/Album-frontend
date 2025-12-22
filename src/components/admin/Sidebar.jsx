import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Package,
    FileBarChart,
    Settings,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Reports', path: '/admin/reports', icon: FileBarChart },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        // Redirect to login page
        navigate('/login');
    };

    return (
        <aside className="w-72 bg-zg-surface/80 backdrop-blur-md border-r border-zg-secondary/10 flex flex-col h-screen sticky top-0 z-30">
            <div className="p-8">
                <Link to="/" className="block">
                    <h1 className="text-3xl font-heading font-bold bg-white text-white tracking-tighter p-3 rounded-xl">
                        <img src="/logo1.png" alt="logo" />
                    </h1>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2">
                <div className="px-4 mb-2">
                    <p className="text-xs font-bold text-zg-secondary/50 uppercase tracking-widest">Menu</p>
                </div>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="block relative group"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-zg-accent/10 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            <div className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 ${isActive ? 'text-zg-accent' : 'text-zg-secondary group-hover:text-zg-primary group-hover:bg-zg-secondary/10'
                                }`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                                <span className="font-heading font-medium text-sm tracking-wide">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="ml-auto"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 m-4 mt-auto rounded-2xl bg-gradient-to-br from-zg-secondary/10 to-transparent border border-zg-secondary/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-zg-accent flex items-center justify-center text-black font-bold text-sm shadow-lg shadow-zg-accent/20">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-zg-primary truncate">Admin User</p>
                        <p className="text-xs text-zg-secondary truncate">admin@zerogravity.com</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zg-secondary/10 hover:bg-zg-secondary/20 text-xs font-bold text-zg-primary uppercase tracking-wider transition-colors border border-zg-secondary/10 hover:border-zg-secondary/20"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
