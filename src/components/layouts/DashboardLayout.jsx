import React from 'react';
import Sidebar from '../admin/Sidebar';
import Header from '../admin/Header';

const DashboardLayout = ({ children, title = "Dashboard" }) => {
    return (
        <div className="flex min-h-screen bg-zg-bg text-zg-primary font-body selection:bg-zg-accent selection:text-black">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Background Elements */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-zg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <Header title={title} />

                <main className="flex-1 p-8 overflow-y-auto relative z-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
