import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, XCircle, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../api';
import getImageUrl from '../utils/imageUtils';

const Toast = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(onClose, toast.type === 'success' ? 3000 : 5000);
        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;

    const isSuccess = toast.type === 'success';
    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-start gap-3 px-5 py-4 rounded-xl shadow-2xl border min-w-[320px] max-w-md transition-all duration-300 ${isSuccess ? 'bg-green-950 border-green-500/40 text-green-300' : 'bg-red-950 border-red-500/40 text-red-300'}`}>
            {isSuccess
                ? <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-green-400" />
                : <XCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-400" />}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        businessName: '',
        gstNo: '',
        username: '',
        password: '',
        confirmPassword: '',
        logo: ''
    });

    const [toast, setToast] = useState(null);
    const [uploading, setUploading] = useState(false);

    const showToast = (message, type) => setToast({ message, type });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);
        try {
            const response = await fetch(API_ENDPOINTS.UPLOAD, {
                method: 'POST',
                body: uploadData
            });
            const data = await response.json();
            if (response.ok) {
                setFormData(prev => ({ ...prev, logo: data.imageUrl }));
            } else {
                showToast('Logo upload failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            showToast('Error uploading logo. Check your connection.', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            showToast('Passwords do not match. Please check and try again.', 'error');
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Registration successful! Redirecting to login...', 'success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    businessName: '',
                    gstNo: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                    logo: ''
                });
                setTimeout(() => navigate('/login'), 2500);
            } else {
                showToast(data.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            showToast('Server error. Please try again later.', 'error');
        }
    };

    return (
        <>
        <Toast toast={toast} onClose={() => setToast(null)} />
        <div className="bg-zg-bg flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-4xl bg-zg-surface border border-zg-secondary/10 rounded-2xl p-10 shadow-xl relative overflow-hidden">

                {/* BACKGROUND ACCENT GLOW */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-zg-accent/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-zg-accent/5 rounded-full blur-3xl"></div>

                {/* HEADER */}
                <div className="relative z-10 text-center mb-10">
                    <h1 className="text-4xl font-heading font-bold mb-3">Create Account</h1>
                    <p className="text-zg-secondary">Join us and start your journey</p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">

                    {/* Full Name */}
                    <div>
                        <label className="text-zg-secondary text-sm mb-2 block">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder=""
                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-zg-secondary text-sm mb-2 block">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder=""
                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-zg-secondary text-sm mb-2 block">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder=""
                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                        />
                    </div>

                    {/* Business Name */}
                    <div>
                        <label className="text-zg-secondary text-sm mb-2 block">Business Name</label>
                        <input
                            type="text"
                            name="businessName"
                            required
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder=""
                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                        />
                    </div>

                    {/* Company Logo */}
                    <div className="md:col-span-2">
                        <label className="text-zg-secondary text-sm mb-2 block">Company Logo</label>
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        disabled={uploading}
                                    />
                                    <div className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zg-secondary flex items-center gap-2 hover:border-zg-accent transition-colors">
                                        <Upload className="w-4 h-4" />
                                        <span>{uploading ? 'Uploading...' : formData.logo ? 'Logo Uploaded' : 'Upload Logo'}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-zg-secondary mt-1">Recommended size: 200x200px. Max 2MB.</p>
                            </div>
                            {formData.logo && (
                                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-700 overflow-hidden flex-shrink-0">
                                    <img
                                        src={getImageUrl(formData.logo)}
                                        alt="Logo Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GST */}
                    <div className="md:col-span-2">
                        <label className="text-zg-secondary text-sm mb-2 block">GST Number</label>
                        <input
                            type="text"
                            name="gstNo"
                            required
                            value={formData.gstNo}
                            onChange={handleChange}
                            placeholder=""
                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="text-zg-secondary text-sm mb-2 block">Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            placeholder=""
                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-zg-secondary text-sm mb-2 block">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder=""
                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="md:col-span-2">
                        <label className="text-zg-secondary text-sm mb-2 block">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder=""
                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            className="w-full py-3 bg-zg-accent text-black font-semibold rounded-lg hover:bg-zg-accent/90 transition-all shadow-lg shadow-zg-accent/30"
                        >
                            Register Account
                        </button>
                    </div>
                </form>

                <div className="w-full flex items-center justify-center">
                    <Link to='/login' className="text-center w-full text-zg-secondary text-sm">
                        Already have an account?{' '}
                        <span className="text-zg-accent hover:underline">
                            Login
                        </span>
                    </Link>
                </div>

            </div>
        </div>
        </>
    );
};

export default Register;
