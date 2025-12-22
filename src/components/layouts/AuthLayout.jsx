import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AuthLayout = () => {
    return (
        <>
            <nav className="py-6 border-b border-white/5 bg-zg-bg/80 backdrop-blur-md fixed w-full top-0 z-50 ">
                <div className="custom-container flex justify-between items-center ">
                    <Link to="/" className="flex items-center gap-3 group">
                        {/* Logo placeholder if image fails, or use the image */}
                        <img src="/logo.png" alt="Albums by Zero Gravity" className="h-12 object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <div className="flex gap-8 text-white">
                        <Link to="/" className="nav-link">Register</Link>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/admin" className="nav-link">Admin</Link>
                    </div>
                </div>
            </nav>
            <Outlet />
        </>
    );
};

export default AuthLayout;
