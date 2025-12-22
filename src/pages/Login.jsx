import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('https://zerogravity-backend.vercel.app/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));

                // Navigate based on user role
                if (data.user.role === 'admin') {
                    navigate('/admin');
                } else {
                    const from = location.state?.from || '/shop';
                    navigate(from);
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="bg-zg-bg flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-md bg-zg-surface border border-zg-secondary/10 rounded-2xl p-10 shadow-xl relative overflow-hidden">

                {/* BACKGROUND ACCENT GLOW */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-zg-accent/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-zg-accent/5 rounded-full blur-3xl"></div>

                {/* HEADER */}
                <div className="relative z-10 text-center mb-8">
                    <h1 className="text-3xl font-heading font-bold mb-2">Welcome Back</h1>
                    <p className="text-zg-secondary">Sign in to your account</p>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6 relative z-99">
                    {/* Username */}
                    <div>
                        <label className="text-zg-secondary text-sm mb-2 block">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-zg-secondary text-sm mb-2 block">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all"
                        />
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-zg-accent text-black font-semibold rounded-lg hover:bg-zg-accent/90 transition-all shadow-lg shadow-zg-accent/30 mb-6"
                    >
                        Login
                    </button>
                </form>

                {/* EXTRA */}
                <div className="w-full flex items-center justify-center">
                    <a href='/' className="text-center w-full  text-zg-secondary text-sm ">
                        Don't have an account?{' '}
                        <span className="text-zg-accent cursor-pointer hover:underline">
                            Sign Up
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
