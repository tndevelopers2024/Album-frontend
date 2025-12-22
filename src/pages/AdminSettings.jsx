import React, { useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { User, Bell, Shield, Mail, Lock, Globe, Save, Camera } from 'lucide-react';

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [settings, setSettings] = useState({
        // Profile Settings
        name: 'Admin User',
        email: 'admin@zerogravity.com',
        phone: '+91 98765 43210',
        avatar: '',

        // Notification Settings
        emailNotifications: true,
        orderNotifications: true,
        userNotifications: true,
        reportNotifications: false,

        // System Settings
        siteName: 'Albums by Zero Gravity',
        siteEmail: 'contact@zerogravity.com',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        maintenanceMode: false
    });

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // In a real app, this would save to backend
        alert('Settings saved successfully!');
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'system', label: 'System', icon: Shield }
    ];

    return (
        <DashboardLayout title="Settings">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-zg-surface/50 border border-zg-secondary/10 rounded-2xl p-4 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                        ? 'bg-zg-accent/10 text-zg-accent border border-zg-accent/20'
                                        : 'text-zg-secondary hover:bg-zg-secondary/10 hover:text-zg-primary'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3">
                    <div className="bg-zg-surface/50 border border-zg-secondary/10 rounded-2xl p-8">
                        {/* Profile Settings */}
                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-heading font-bold mb-2">Profile Settings</h2>
                                    <p className="text-zg-secondary text-sm">Manage your account information</p>
                                </div>

                                {/* Avatar Upload */}
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-zg-accent/20 to-purple-500/20 flex items-center justify-center text-zg-primary font-bold text-3xl border-2 border-zg-secondary/10">
                                        {settings.avatar ? (
                                            <img src={settings.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            settings.name.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-zg-accent/10 text-zg-accent rounded-lg hover:bg-zg-accent/20 transition-all border border-zg-accent/20">
                                            <Camera className="w-4 h-4" />
                                            Change Photo
                                        </button>
                                        <p className="text-xs text-zg-secondary mt-2">JPG, PNG or GIF. Max 2MB</p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zg-secondary flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zg-secondary flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zg-secondary flex items-center gap-2">
                                            <Lock className="w-4 h-4" />
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={settings.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Password Change */}
                                <div className="pt-6 border-t border-zg-secondary/10">
                                    <h3 className="text-lg font-heading font-bold mb-4">Change Password</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zg-secondary">Current Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zg-secondary">New Password</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notification Settings */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-heading font-bold mb-2">Notification Preferences</h2>
                                    <p className="text-zg-secondary text-sm">Choose what notifications you want to receive</p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about your account' },
                                        { key: 'orderNotifications', label: 'Order Updates', desc: 'Get notified when new orders are placed' },
                                        { key: 'userNotifications', label: 'User Activity', desc: 'Notifications about new user registrations' },
                                        { key: 'reportNotifications', label: 'Weekly Reports', desc: 'Receive weekly analytics reports via email' }
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-zg-bg border border-zg-secondary/10">
                                            <div>
                                                <p className="font-medium text-zg-primary">{item.label}</p>
                                                <p className="text-sm text-zg-secondary mt-1">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={settings[item.key]}
                                                    onChange={(e) => handleChange(item.key, e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-zg-secondary/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-zg-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zg-accent"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* System Settings */}
                        {activeTab === 'system' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-heading font-bold mb-2">System Configuration</h2>
                                    <p className="text-zg-secondary text-sm">Manage global system settings</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zg-secondary">Site Name</label>
                                        <input
                                            type="text"
                                            value={settings.siteName}
                                            onChange={(e) => handleChange('siteName', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zg-secondary">Contact Email</label>
                                        <input
                                            type="email"
                                            value={settings.siteEmail}
                                            onChange={(e) => handleChange('siteEmail', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zg-secondary flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Currency
                                        </label>
                                        <select
                                            value={settings.currency}
                                            onChange={(e) => handleChange('currency', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zg-secondary">Timezone</label>
                                        <select
                                            value={settings.timezone}
                                            onChange={(e) => handleChange('timezone', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                            <option value="America/New_York">America/New_York (EST)</option>
                                            <option value="Europe/London">Europe/London (GMT)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Maintenance Mode */}
                                <div className="pt-6 border-t border-zg-secondary/10">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-zg-bg border border-zg-secondary/10">
                                        <div>
                                            <p className="font-medium text-zg-primary">Maintenance Mode</p>
                                            <p className="text-sm text-zg-secondary mt-1">Temporarily disable public access to the site</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.maintenanceMode}
                                                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-zg-secondary/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-zg-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-zg-secondary/10 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-3 bg-zg-accent text-black rounded-xl font-bold uppercase tracking-wide hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminSettings;
