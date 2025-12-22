import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-zg-bg text-zg-primary font-body">
            <Navbar />
            <main className="flex-grow pt-24">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
