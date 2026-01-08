import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, CheckCircle, XCircle, IndianRupee, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import API_ENDPOINTS from '../api';
import getImageUrl from '../utils/imageUtils';

const OrderForm = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [pricing, setPricing] = useState(null);
    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const [priceBreakdown, setPriceBreakdown] = useState({ sheetCost: 0, coverBoxCost: 0, totalPrice: 0 });
    const [currentStep, setCurrentStep] = useState(0);
    const [toast, setToast] = useState({ show: false, message: '', type: '' }); // success, error, warning


    const [formData, setFormData] = useState({
        title: '',
        size: '',
        bindingType: 'NT',
        paperType: 'Glossy',
        sheetCount: 20,
        additionalPaper: '',
        albumColor: '',
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
        },
        frontPageCustomization: {
            fullNames: '',
            initials: '',
            coverImage: '',
            date: '',
            customText: ''
        }
    });

    // Define steps
    const steps = [
        { id: 0, name: 'Album Details', description: 'Title & Binding' },
        { id: 1, name: 'Specifications', description: 'Size & Color' },
        { id: 2, name: 'Cover & Customization', description: 'Cover, Box & Front Page' },
        { id: 3, name: 'Delivery', description: 'Address & Submit' }
    ];

    useEffect(() => {
        fetchProduct();
        fetchPricing();
    }, [productId]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [navigate, location]);

    // Auto-hide toast after 4 seconds
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                setToast({ show: false, message: '', type: '' });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    // Hide main header on mobile when scrolling
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const navbar = document.querySelector('nav');
            if (!navbar) return;

            // Only apply on mobile (screens smaller than 768px)
            if (window.innerWidth < 768) {
                if (window.scrollY > 50) {
                    navbar.style.transform = 'translateY(-100%)';
                    navbar.style.transition = 'transform 0.3s ease-in-out';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            } else {
                // Reset on desktop
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            // Reset navbar on unmount
            const navbar = document.querySelector('nav');
            if (navbar) {
                navbar.style.transform = 'translateY(0)';
            }
        };
    }, []);

    useEffect(() => {
        if (pricing && product) {
            calculatePrice();
        }
    }, [formData.bindingType, formData.paperType, formData.sheetCount, pricing, product]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(productId));
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPricing = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.ALBUM_PRICING);
            const data = await response.json();
            setPricing(data);
        } catch (error) {
            console.error('Error fetching pricing:', error);
        }
    };

    const calculatePrice = () => {
        if (!pricing) return;

        const { bindingType, paperType, sheetCount } = formData;
        let sheetCost = 0;
        let coverBoxCost = 0;

        // Calculate sheet cost
        if (bindingType === 'Layflat') {
            sheetCost = pricing.sheetTypes.Layflat.pricePerSheet * sheetCount;
        } else if (bindingType === 'NT' && paperType) {
            const paperPrice = pricing.sheetTypes.NT.paperTypes[paperType];
            if (paperPrice) {
                sheetCost = paperPrice * sheetCount;
            }
        }

        // Use product-specific box price
        if (product?.boxPrice) {
            coverBoxCost = product.boxPrice;
        }

        const totalPrice = sheetCost + coverBoxCost;

        setPriceBreakdown({ sheetCost, coverBoxCost, totalPrice });
        setCalculatedPrice(totalPrice);
    };

    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
    };

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
            const response = await fetch(API_ENDPOINTS.UPLOAD, {
                method: 'POST',
                body: uploadData
            });
            const data = await response.json();
            if (response.ok) {
                setFormData(prev => ({ ...prev, logo: data.imageUrl }));
            } else {
                showToast('Logo upload failed', 'error');
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            showToast('Error uploading logo', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleFrontPageChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            frontPageCustomization: {
                ...prev.frontPageCustomization,
                [field]: value
            }
        }));
    };

    const handleCoverImageUpload = async (e) => {
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
                handleFrontPageChange('coverImage', data.imageUrl);
            } else {
                showToast('Cover image upload failed', 'error');
            }
        } catch (error) {
            console.error('Error uploading cover image:', error);
            showToast('Error uploading cover image', 'error');
        } finally {
            setUploading(false);
        }
    };

    const validateStep = (step) => {
        switch (step) {
            case 0:
                return formData.title && formData.bindingType && (formData.bindingType === 'Layflat' || formData.paperType);
            case 1:
                return formData.size && formData.albumColor && formData.sheetCount >= 20 && formData.sheetCount <= 60;
            case 2:
                return formData.boxType && formData.imageLink;
            case 3:
                return formData.deliveryAddress.name && formData.deliveryAddress.phone &&
                    formData.deliveryAddress.address && formData.deliveryAddress.city &&
                    formData.deliveryAddress.state && formData.deliveryAddress.pincode;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showToast('Please fill in all required fields', 'warning');
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(3)) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        setSubmitting(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                showToast('Please login to place an order', 'warning');
                navigate('/login');
                return;
            }

            const orderData = {
                ...formData,
                userId: user.id,
                productId
            };

            const response = await fetch(API_ENDPOINTS.ORDERS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (response.ok) {
                showToast(`Order placed successfully! Total: ₹${result.order.calculatedPrice}`, 'success');
                navigate('/shop');
            } else {
                showToast(result.message || 'Failed to place order', 'error');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            showToast('Error placing order', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-zg-primary">Loading...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-zg-primary">Product not found</div>;

    // Selection Card Component
    const SelectionCard = ({ selected, onClick, children, className = "" }) => (
        <button
            type="button"
            onClick={onClick}
            className={`relative p-4 rounded-xl border-2 transition-all text-left ${selected
                ? 'border-zg-accent bg-zg-accent/5 shadow-lg shadow-zg-accent/20'
                : 'border-zg-secondary/10 hover:border-zg-secondary/30 bg-zg-surface'
                } ${className}`}
        >
            {selected && (
                <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 rounded-full bg-zg-accent flex items-center justify-center">
                        <Check className="w-4 h-4 text-black" />
                    </div>
                </div>
            )}
            {children}
        </button>
    );

    // Render step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Album Details
                return (
                    <div className="space-y-8">
                        {/* Title */}
                        <div className="space-y-3">
                            <label className="text-lg font-semibold text-zg-primary">Album Title *</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Romeo & Juliet"
                                className="w-full px-4 py-4 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30 text-lg"
                            />
                        </div>

                        {/* Binding Type */}
                        <div className="space-y-4">
                            <label className="text-lg font-semibold text-zg-primary">Binding Type *</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectionCard
                                    selected={formData.bindingType === 'NT'}
                                    onClick={() => setFormData(prev => ({ ...prev, bindingType: 'NT', paperType: 'Glossy' }))}
                                >
                                    <div className="pr-8">
                                        <h3 className="font-bold text-lg mb-1">NT (Normal Type)</h3>
                                        <p className="text-sm text-zg-secondary mb-2">Traditional binding with multiple paper options</p>
                                        <p className="text-zg-accent font-semibold">From ₹80/sheet</p>
                                    </div>
                                </SelectionCard>

                                <SelectionCard
                                    selected={formData.bindingType === 'Layflat'}
                                    onClick={() => setFormData(prev => ({ ...prev, bindingType: 'Layflat' }))}
                                >
                                    <div className="pr-8">
                                        <h3 className="font-bold text-lg mb-1">Layflat</h3>
                                        <p className="text-sm text-zg-secondary mb-2">Premium seamless binding</p>
                                        <p className="text-zg-accent font-semibold">₹120/sheet</p>
                                    </div>
                                </SelectionCard>
                            </div>
                        </div>

                        {/* Paper Type (Conditional for NT) */}
                        {formData.bindingType === 'NT' && pricing && (
                            <div className="space-y-4">
                                <label className="text-lg font-semibold text-zg-primary">Paper Type *</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {Object.entries(pricing.sheetTypes.NT.paperTypes).map(([type, price]) => (
                                        <SelectionCard
                                            key={type}
                                            selected={formData.paperType === type}
                                            onClick={() => setFormData(prev => ({ ...prev, paperType: type }))}
                                        >
                                            <div className="pr-8">
                                                <h3 className="font-semibold mb-1">{type}</h3>
                                                <p className="text-sm text-zg-accent font-medium">₹{price}/sheet</p>
                                            </div>
                                        </SelectionCard>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 1: // Specifications
                return (
                    <div className="space-y-8">
                        {/* Sheet Count */}
                        <div className="space-y-4">
                            <label className="text-lg font-semibold text-zg-primary">Number of Sheets (20-60) *</label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, sheetCount: Math.max(20, prev.sheetCount - 1) }))}
                                    className="w-12 h-12 rounded-xl bg-zg-surface border border-zg-secondary/10 hover:border-zg-accent transition-all flex items-center justify-center text-xl font-bold"
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    name="sheetCount"
                                    required
                                    min="20"
                                    max="60"
                                    value={formData.sheetCount}
                                    onChange={handleChange}
                                    className="flex-1 px-6 py-4 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all text-center text-2xl font-bold"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, sheetCount: Math.min(60, prev.sheetCount + 1) }))}
                                    className="w-12 h-12 rounded-xl bg-zg-surface border border-zg-secondary/10 hover:border-zg-accent transition-all flex items-center justify-center text-xl font-bold"
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-sm text-zg-secondary">
                                {formData.sheetCount} sheets × ₹
                                {formData.bindingType === 'Layflat'
                                    ? pricing?.sheetTypes.Layflat.pricePerSheet
                                    : pricing?.sheetTypes.NT.paperTypes[formData.paperType]}
                                = ₹{priceBreakdown.sheetCost.toLocaleString('en-IN')}
                            </p>
                        </div>

                        {/* Size & Orientation */}
                        <div className="space-y-4">
                            <label className="text-lg font-semibold text-zg-primary">Size & Orientation *</label>
                            {pricing && ['Square', 'Portrait', 'Landscape'].map(orientation => {
                                const sizes = pricing.sizes[orientation];
                                if (!sizes || sizes.length === 0) return null;

                                return (
                                    <div key={orientation} className="space-y-3">
                                        <h3 className="text-sm font-medium text-zg-secondary uppercase tracking-wider">{orientation}</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {sizes.map(size => (
                                                <SelectionCard
                                                    key={size}
                                                    selected={formData.size === size}
                                                    onClick={() => setFormData(prev => ({ ...prev, size }))}
                                                >
                                                    <div className="pr-8 text-center">
                                                        <p className="font-bold text-lg">{size}</p>
                                                    </div>
                                                </SelectionCard>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Album Color */}
                        <div className="space-y-4">
                            <label className="text-lg font-semibold text-zg-primary">Album Color *</label>
                            <div className="grid grid-cols-4 gap-3">
                                {pricing && pricing.colors.map((color) => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, albumColor: color.name }))}
                                        className={`group relative aspect-square rounded-xl border-2 transition-all ${formData.albumColor === color.name
                                            ? 'border-zg-accent shadow-lg shadow-zg-accent/20 scale-105'
                                            : 'border-zg-secondary/10 hover:border-zg-secondary/30'
                                            }`}
                                        title={color.name}
                                    >
                                        <div
                                            className="w-full h-full rounded-lg"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        {formData.albumColor === color.name && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <CheckCircle className="w-6 h-6 text-white drop-shadow-lg" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {formData.albumColor && (
                                <p className="text-sm text-zg-primary font-medium">Selected: {formData.albumColor}</p>
                            )}
                        </div>
                    </div>
                );

            case 2: // Cover & Box
                return (
                    <div className="space-y-8">

                        {/* Box Type */}
                        <div className="space-y-4">
                            <label className="text-lg font-semibold text-zg-primary">Box Finish *</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Regular', 'Matte', 'Glossy'].map(type => (
                                    <SelectionCard
                                        key={type}
                                        selected={formData.boxType === type}
                                        onClick={() => setFormData(prev => ({ ...prev, boxType: type }))}
                                    >
                                        <div className="text-center">
                                            <p className="font-semibold">{type}</p>
                                        </div>
                                    </SelectionCard>
                                ))}
                            </div>
                        </div >

                        {/* Image Upload Link */}
                        < div className="space-y-3 pt-6 border-t border-zg-secondary/10" >
                            <label className="text-lg font-semibold text-zg-primary">Image Upload Link *</label>
                            <p className="text-sm text-zg-secondary">WeTransfer or Google Drive link</p>
                            <input
                                type="url"
                                name="imageLink"
                                required
                                value={formData.imageLink}
                                onChange={handleChange}
                                placeholder="https://"
                                className="w-full px-4 py-4 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                            />
                        </div >

                        {/* Front Page Customization */}
                        {
                            product?.frontPageOptions && (product.frontPageOptions.showFullNames || product.frontPageOptions.showInitials || product.frontPageOptions.showImage || product.frontPageOptions.showDate || product.frontPageOptions.showCustomText) && (
                                <div className="space-y-6 pt-6 border-t border-zg-secondary/10">
                                    <h3 className="text-xl font-heading font-bold">Front Page Customization</h3>

                                    {product.frontPageOptions.showFullNames && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zg-secondary">Full Names (for cover)</label>
                                            <input
                                                type="text"
                                                value={formData.frontPageCustomization.fullNames}
                                                onChange={(e) => handleFrontPageChange('fullNames', e.target.value)}
                                                placeholder="e.g., John & Jane Doe"
                                                className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                                            />
                                        </div>
                                    )}

                                    {product.frontPageOptions.showInitials && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zg-secondary">Initials (for cover)</label>
                                            <input
                                                type="text"
                                                value={formData.frontPageCustomization.initials}
                                                onChange={(e) => handleFrontPageChange('initials', e.target.value)}
                                                placeholder="e.g., J & J"
                                                maxLength="10"
                                                className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                                            />
                                        </div>
                                    )}

                                    {product.frontPageOptions.showImage && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zg-secondary">Cover Image</label>
                                            <div className="flex gap-4 items-start">
                                                <div className="flex-1">
                                                    <div className="relative group">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleCoverImageUpload}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                            disabled={uploading}
                                                        />
                                                        <div className="w-full px-4 py-4 rounded-xl bg-zg-surface border-2 border-dashed border-zg-secondary/20 text-zg-secondary flex items-center justify-center gap-3 group-hover:border-zg-accent transition-all">
                                                            <Upload className="w-4 h-4" />
                                                            <span className="text-sm font-medium">
                                                                {uploading ? 'Uploading...' : formData.frontPageCustomization.coverImage ? 'Change' : 'Upload'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {formData.frontPageCustomization.coverImage && (
                                                    <div className="w-16 h-16 rounded-xl bg-zg-surface border border-zg-secondary/10 overflow-hidden flex-shrink-0 relative group">
                                                        <img src={getImageUrl(formData.frontPageCustomization.coverImage)} alt="Cover" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFrontPageChange('coverImage', '')}
                                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <XCircle className="w-5 h-5 text-white" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {product.frontPageOptions.showDate && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zg-secondary">Event Date</label>
                                            <input
                                                type="date"
                                                value={formData.frontPageCustomization.date}
                                                onChange={(e) => handleFrontPageChange('date', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all"
                                            />
                                        </div>
                                    )}

                                    {product.frontPageOptions.showCustomText && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zg-secondary">Custom Text (for cover)</label>
                                            <textarea
                                                value={formData.frontPageCustomization.customText}
                                                onChange={(e) => handleFrontPageChange('customText', e.target.value)}
                                                placeholder="Enter custom text"
                                                rows="2"
                                                maxLength="100"
                                                className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30 resize-none text-sm"
                                            />
                                            <p className="text-xs text-zg-secondary">
                                                {formData.frontPageCustomization.customText.length}/100
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )
                        }
                    </div >
                );

            case 3: // Delivery
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-heading font-bold">Delivery Address</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.deliveryAddress.name}
                                    onChange={handleAddressChange}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.deliveryAddress.phone}
                                    onChange={handleAddressChange}
                                    placeholder="Enter phone number"
                                    className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zg-secondary">Street Address *</label>
                            <textarea
                                name="address"
                                required
                                value={formData.deliveryAddress.address}
                                onChange={handleAddressChange}
                                placeholder="Enter complete address"
                                rows="3"
                                className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.deliveryAddress.city}
                                    onChange={handleAddressChange}
                                    placeholder="Enter city"
                                    className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">State *</label>
                                <input
                                    type="text"
                                    name="state"
                                    required
                                    value={formData.deliveryAddress.state}
                                    onChange={handleAddressChange}
                                    placeholder="Enter state"
                                    className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    required
                                    value={formData.deliveryAddress.pincode}
                                    onChange={handleAddressChange}
                                    placeholder="Enter pincode"
                                    className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zg-secondary">Country *</label>
                                <input
                                    type="text"
                                    name="country"
                                    required
                                    value={formData.deliveryAddress.country}
                                    onChange={handleAddressChange}
                                    placeholder="Enter country"
                                    className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-zg-bg pb-20 md:pb-32">
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-4 left-4 right-4 md:top-6 md:right-6 md:left-auto z-[100] animate-in slide-in-from-top-5 duration-300">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-xl border ${toast.type === 'success'
                        ? 'bg-green-500/90 border-green-400 text-white'
                        : toast.type === 'warning'
                            ? 'bg-yellow-500/90 border-yellow-400 text-white'
                            : 'bg-red-500/90 border-red-400 text-white'
                        }`}>
                        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === 'warning' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === 'error' && <XCircle className="w-5 h-5 flex-shrink-0" />}
                        <p className="font-medium text-sm max-w-md">{toast.message}</p>
                        <button
                            onClick={() => setToast({ show: false, message: '', type: '' })}
                            className="ml-2 hover:opacity-70 transition-opacity"
                        >
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="bg-zg-surface border-b border-zg-secondary/10 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-3 md:px-6 md:py-4">
                    <button
                        onClick={() => navigate(`/shop/${productId}`)}
                        className="flex items-center gap-2 text-zg-secondary hover:text-zg-primary transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Product</span>
                    </button>
                    <h1 className="text-xl md:text-2xl font-heading font-bold mt-2 md:mt-4">{product.name}</h1>

                    {/* Progress Indicator */}
                    <div className="mt-4 md:mt-6">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex-1 relative">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${index < currentStep
                                            ? 'bg-zg-accent text-black'
                                            : index === currentStep
                                                ? 'bg-zg-accent text-black ring-4 ring-zg-accent/20'
                                                : 'bg-zg-surface border-2 border-zg-secondary/20 text-zg-secondary'
                                            }`}>
                                            {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                                        </div>
                                        <div className="mt-2 text-center hidden md:block">
                                            <p className={`text-xs font-medium ${index === currentStep ? 'text-zg-primary' : 'text-zg-secondary'}`}>
                                                {step.name}
                                            </p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${index < currentStep ? 'bg-zg-accent' : 'bg-zg-secondary/20'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-sm text-zg-secondary mt-4 md:hidden">
                            {steps[currentStep].name}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Form */}
            <div className="max-w-4xl mx-auto px-4 py-4 md:px-6 md:py-8">
                <div className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-4 md:p-8">
                    <div className="mb-4 md:mb-6">
                        <h2 className="text-xl md:text-2xl font-heading font-bold">{steps[currentStep].name}</h2>
                        <p className="text-sm text-zg-secondary mt-1">{steps[currentStep].description}</p>
                    </div>

                    {renderStepContent()}
                </div>
            </div>

            {/* Navigation & Price Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-zg-surface border-t border-zg-secondary/10 shadow-2xl z-50">
                <div className="max-w-4xl mx-auto px-4 py-3 md:px-6 md:py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="text-xs text-zg-secondary uppercase tracking-wider mb-1">Total Price</p>
                            <div className="flex items-center gap-2">
                                <IndianRupee className="w-5 h-5 text-zg-accent" />
                                <span className="text-2xl font-bold text-zg-accent">{calculatedPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="mt-1 text-xs text-zg-secondary space-y-0.5">
                                <p>Sheets: ₹{priceBreakdown.sheetCost.toLocaleString('en-IN')}</p>
                                <p>PAD: ₹{priceBreakdown.coverBoxCost.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {currentStep > 0 && (
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 bg-zg-surface border border-zg-secondary/20 text-zg-primary font-semibold rounded-xl hover:bg-zg-bg transition-all flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back
                                </button>
                            )}

                            {currentStep < steps.length - 1 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-3 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20 flex items-center gap-2"
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-8 py-3 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
                                >
                                    {submitting ? 'Placing Order...' : 'Place Order'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;
