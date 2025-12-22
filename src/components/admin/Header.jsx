import React from 'react';
import { Search, Bell, HelpCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ title }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <header className="bg-zg-bg/50 backdrop-blur-xl border-b border-zg-secondary/10 sticky top-0 z-20 px-8 py-5">
            <div className="flex justify-between items-center gap-8">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-zg-primary tracking-tight">{title}</h2>
                    <p className="text-sm text-zg-secondary mt-1">Welcome back to your dashboard</p>
                </div>

                <div className="flex items-center gap-6 flex-1 justify-end">
                    {/* Search Bar */}
                    <div className="relative w-full max-w-md hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zg-secondary" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full bg-zg-surface border border-zg-secondary/10 rounded-xl py-3 pl-12 pr-4 text-zg-primary placeholder-zg-secondary/50 focus:outline-none focus:border-zg-accent/50 focus:ring-1 focus:ring-zg-accent/50 transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                            <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-zg-secondary/10 border border-zg-secondary/20 text-[10px] font-bold text-zg-secondary uppercase tracking-wider">⌘ K</kbd>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl text-zg-secondary hover:text-zg-primary hover:bg-zg-secondary/10 transition-all relative group"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zg-surface border border-zg-secondary/10 rounded text-[10px] text-zg-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                            </span>
                        </button>

                        <button className="p-2.5 rounded-xl text-zg-secondary hover:text-zg-primary hover:bg-zg-secondary/10 transition-all relative group">
                            <HelpCircle className="w-5 h-5" />
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zg-surface border border-zg-secondary/10 rounded text-[10px] text-zg-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Help Center</span>
                        </button>

                        <button className="p-2.5 rounded-xl text-zg-secondary hover:text-zg-primary hover:bg-zg-secondary/10 transition-all relative group">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-zg-accent rounded-full ring-2 ring-zg-bg"></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
