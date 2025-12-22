import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Check user login status
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-zg-bg/80 backdrop-blur-md border-b border-zg-secondary/10 py-4' : 'bg-transparent py-6'
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">

                    <div className="flex flex-col w-40 bg-white p-2 rounded-xl">
                        <img src="/logo1.png" alt="Logo" />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="text-sm font-medium text-zg-secondary hover:text-zg-primary transition-colors">Home</Link>
                    <Link to="/shop" className="text-sm font-medium text-zg-secondary hover:text-zg-primary transition-colors">Shop</Link>
                    <Link to="/contact" className="text-sm font-medium text-zg-secondary hover:text-zg-primary transition-colors">Contact</Link>
                    {user && (
                        <Link to="/my-orders" className="text-sm font-medium text-zg-secondary hover:text-zg-primary transition-colors">My Orders</Link>
                    )}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-zg-secondary/10 text-zg-secondary hover:text-zg-primary transition-colors"
                    >
                        {theme === 'dark' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                        )}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 pl-4 border-l border-zg-secondary/20">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-bold text-zg-primary">{user.name}</p>
                                    <p className="text-xs text-zg-secondary">{user.role}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-zg-secondary/10 flex items-center justify-center text-zg-primary font-bold border border-zg-secondary/20">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-zg-secondary hover:text-red-500 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-6 py-2.5 bg-zg-surface border border-zg-secondary/20 rounded-xl text-sm font-bold hover:border-zg-accent hover:text-zg-accent transition-all"
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-zg-primary"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-zg-bg border-b border-zg-secondary/10 p-6 space-y-4 shadow-2xl">
                    <Link to="/" className="block text-lg font-medium text-zg-primary" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/shop" className="block text-lg font-medium text-zg-primary" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                    {user && (
                        <Link to="/my-orders" className="block text-lg font-medium text-zg-primary" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
                    )}
                    <div className="pt-4 border-t border-zg-secondary/10">
                        {user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zg-secondary/10 flex items-center justify-center text-zg-primary font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-zg-primary">{user.name}</p>
                                        <p className="text-xs text-zg-secondary">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full py-3 bg-red-500/10 text-red-500 font-bold rounded-xl"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="block w-full py-3 bg-zg-accent text-black font-bold text-center rounded-xl"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
