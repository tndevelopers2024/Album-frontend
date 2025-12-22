import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, XCircle } from 'lucide-react';

const OrderForm = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        size: '',
        bindingType: 'Layflat',
        paperType: '',
        additionalPaper: '',
        coverType: '',
        boxType: 'Regular',
        bagType: '',
        calendarType: '',
        acrylicCalendar: false,
        replicaEbook: false,
        imageLink: '',
        quantity: 1,
        logo: '',
        deliveryAddress: {
            name: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        }
    });

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`https://zerogravity-backend.vercel.app/api/products/${productId}`);
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [navigate, location]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            deliveryAddress: {
                ...prev.deliveryAddress,
                [name]: value
            }
        }));
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setUploading(true);
        try {
            const response = await fetch('https://zerogravity-backend.vercel.app/api/upload', {
                method: 'POST',
                body: uploadData
            });
            const data = await response.json();
            if (response.ok) {
                setFormData(prev => ({ ...prev, logo: data.imageUrl }));
            } else {
                alert('Logo upload failed');
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Error uploading logo');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Please login to place an order');
                navigate('/login');
                return;
            }

            const orderData = {
                ...formData,
                userId: user.id,
                productId
            };

            const response = await fetch('https://zerogravity-backend.vercel.app/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                alert('Order placed successfully!');
                navigate('/shop');
            } else {
                alert('Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-zg-primary">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-zg-primary">Product not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <button
                onClick={() => navigate(`/shop/${productId}`)}
                className="flex items-center gap-2 text-zg-secondary hover:text-zg-primary transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Product</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-6 sticky top-32">
                        <h2 className="text-xl font-heading font-bold mb-6">Order Summary</h2>
                        <div className="aspect-square rounded-xl bg-zg-secondary/10 overflow-hidden mb-6">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold text-lg mb-3">{product.name}</h3>
                        <p className="text-zg-secondary text-sm leading-relaxed mb-6">{product.description}</p>
                        <div className="pt-6 border-t border-zg-secondary/10">
                            <p className="text-xs text-zg-secondary uppercase tracking-wider mb-1">Base Price</p>
                            <p className="text-xl font-bold text-zg-accent">Contact for Quote</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customization Form */}
                <div className="lg:col-span-2">
                    <div className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-heading font-bold mb-8">Customize Your Order</h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Title / Couple Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Title / Couple Name</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Romeo & Juliet"
                                    className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>

                            {/* Size */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Size</label>
                                <div className="relative">
                                    <select
                                        name="size"
                                        required
                                        value={formData.size}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Size</option>
                                        <option value="12X18 L">12X18 L</option>
                                        <option value="12X15 L">12X15 L</option>
                                        <option value="12X12 S">12X12 S</option>
                                        <option value="12X18 P">12X18 P</option>
                                        <option value="12X15 P">12X15 P</option>
                                        <option value="12X16 L">12X16 L</option>
                                        <option value="12X16 P">12X16 P</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zg-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Binding Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Binding Type</label>
                                <div className="relative">
                                    <select
                                        name="bindingType"
                                        required
                                        value={formData.bindingType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Layflat">Layflat</option>
                                        <option value="Absolute Layflat">Absolute Layflat</option>
                                        <option value="V-Cut">V-Cut</option>
                                        <option value="Book">Book</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zg-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Paper Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Main Paper Type & Total Pages</label>
                                <div className="relative">
                                    <select
                                        name="paperType"
                                        required
                                        value={formData.paperType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Paper Type</option>
                                        <option value="Matte - 40 Pages">Matte - 40 Pages</option>
                                        <option value="Glossy - 40 Pages">Glossy - 40 Pages</option>
                                        <option value="Silk - 40 Pages">Silk - 40 Pages</option>
                                        <option value="Matte - 60 Pages">Matte - 60 Pages</option>
                                        <option value="Glossy - 60 Pages">Glossy - 60 Pages</option>
                                        <option value="Silk - 60 Pages">Silk - 60 Pages</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zg-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Paper */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Additional Paper Options</label>
                                <div className="relative">
                                    <select
                                        name="additionalPaper"
                                        value={formData.additionalPaper}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">None</option>
                                        <option value="Extra Matte Page">Extra Matte Page</option>
                                        <option value="Extra Glossy Page">Extra Glossy Page</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zg-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Cover & Cover Jacket Type</label>
                                <div className="relative">
                                    <select
                                        name="coverType"
                                        required
                                        value={formData.coverType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Cover Type</option>
                                        <option value="Hardcover">Hardcover</option>
                                        <option value="Softcover">Softcover</option>
                                        <option value="Leather Jacket">Leather Jacket</option>
                                        <option value="Acrylic Cover">Acrylic Cover</option>
                                        <option value="Canvas Cover">Canvas Cover</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zg-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Box Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Box Type and Finish</label>
                                <div className="relative">
                                    <select
                                        name="boxType"
                                        required
                                        value={formData.boxType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Regular">Regular</option>
                                        <option value="Matte">Matte</option>
                                        <option value="Glossy">Glossy</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zg-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Bag Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Bag Type</label>
                                <div className="relative">
                                    <select
                                        name="bagType"
                                        value={formData.bagType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">None</option>
                                        <option value="Canvas Bag">Canvas Bag</option>
                                        <option value="Premium Paper Bag">Premium Paper Bag</option>
                                        <option value="Jute Bag">Jute Bag</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zg-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Type */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Calendar Type</label>
                                <div className="relative">
                                    <select
                                        name="calendarType"
                                        value={formData.calendarType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">None</option>
                                        <option value="Wall Calendar">Wall Calendar</option>
                                        <option value="Desk Calendar">Desk Calendar</option>
                                        <option value="Pocket Calendar">Pocket Calendar</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zg-secondary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.acrylicCalendar ? 'bg-zg-accent/10 border-zg-accent' : 'bg-zg-bg border-zg-secondary/10 hover:border-zg-accent/50'}`}>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${formData.acrylicCalendar ? 'border-zg-accent bg-zg-accent text-black' : 'border-zg-secondary/30'}`}>
                                        {formData.acrylicCalendar && <CheckCircle className="w-4 h-4" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="acrylicCalendar"
                                        checked={formData.acrylicCalendar}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className="font-medium">Include Acrylic Calendar</span>
                                </label>

                                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.replicaEbook ? 'bg-zg-accent/10 border-zg-accent' : 'bg-zg-bg border-zg-secondary/10 hover:border-zg-accent/50'}`}>
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${formData.replicaEbook ? 'border-zg-accent bg-zg-accent text-black' : 'border-zg-secondary/30'}`}>
                                        {formData.replicaEbook && <CheckCircle className="w-4 h-4" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        name="replicaEbook"
                                        checked={formData.replicaEbook}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className="font-medium">Include Replica & E-Book</span>
                                </label>
                            </div>

                            {/* Image Link */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Image Upload Link (WeTransfer / Google Drive)</label>
                                <input
                                    type="url"
                                    name="imageLink"
                                    required
                                    value={formData.imageLink}
                                    onChange={handleChange}
                                    placeholder="https://"
                                    className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    required
                                    min="1"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all"
                                />
                            </div>

                            {/* Logo Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Optional Logo Upload</label>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                disabled={uploading}
                                            />
                                            <div className="w-full px-4 py-4 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-secondary flex items-center justify-center gap-3 group-hover:border-zg-accent transition-all border-dashed border-2">
                                                <Upload className="w-5 h-5" />
                                                <span className="font-medium">{uploading ? 'Uploading...' : formData.logo ? 'Change Logo' : 'Click to Upload Logo'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {formData.logo && (
                                        <div className="w-16 h-16 rounded-lg bg-zg-bg border border-zg-secondary/10 overflow-hidden flex-shrink-0 relative group">
                                            <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <XCircle className="w-6 h-6 text-white" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Delivery Address Section */}
                            <div className="pt-8 border-t border-zg-secondary/10">
                                <h3 className="text-xl font-heading font-bold mb-6">Delivery Address</h3>

                                <div className="space-y-6">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zg-secondary">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.deliveryAddress.name}
                                            onChange={handleAddressChange}
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zg-secondary">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.deliveryAddress.phone}
                                            onChange={handleAddressChange}
                                            placeholder="Enter your phone number"
                                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zg-secondary">Street Address</label>
                                        <textarea
                                            name="address"
                                            required
                                            value={formData.deliveryAddress.address}
                                            onChange={handleAddressChange}
                                            placeholder="Enter your complete address"
                                            rows="3"
                                            className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30 resize-none"
                                        />
                                    </div>

                                    {/* City and State */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zg-secondary">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                value={formData.deliveryAddress.city}
                                                onChange={handleAddressChange}
                                                placeholder="Enter city"
                                                className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zg-secondary">State</label>
                                            <input
                                                type="text"
                                                name="state"
                                                required
                                                value={formData.deliveryAddress.state}
                                                onChange={handleAddressChange}
                                                placeholder="Enter state"
                                                className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30"
                                            />
                                        </div>
                                    </div>

                                    {/* Pincode and Country */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zg-secondary">Pincode</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                required
                                                value={formData.deliveryAddress.pincode}
                                                onChange={handleAddressChange}
                                                placeholder="Enter pincode"
                                                className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zg-secondary">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                required
                                                value={formData.deliveryAddress.country}
                                                onChange={handleAddressChange}
                                                placeholder="Enter country"
                                                className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-wide"
                                >
                                    {submitting ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
