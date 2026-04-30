import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, CheckCircle, XCircle, IndianRupee, Check, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';
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
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

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
        frontPageCustomization: {}
    });

    const steps = [
        { id: 0, name: 'Album Details', description: 'Title & binding type', icon: '01' },
        { id: 1, name: 'Specifications', description: 'Size, sheets & color', icon: '02' },
        { id: 2, name: 'Cover & Customisation', description: 'Box, images & front page', icon: '03' },
        { id: 3, name: 'Delivery', description: 'Address & place order', icon: '04' },
    ];

    useEffect(() => { fetchProduct(); fetchPricing(); }, [productId]);

    useEffect(() => {
        let storedUser = null;
        try { storedUser = JSON.parse(localStorage.getItem('user')); } catch {}
        if (!storedUser) navigate('/login', { state: { from: location.pathname } });
    }, [navigate, location]);

    useEffect(() => {
        if (toast.show) {
            const t = setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
            return () => clearTimeout(t);
        }
    }, [toast.show]);

    useEffect(() => { if (pricing && product) calculatePrice(); }, [formData.bindingType, formData.paperType, formData.sheetCount, pricing, product]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(productId));
            const data = await res.json();
            setProduct(data);
            if (data.paperTypes?.length > 0) setFormData(prev => ({ ...prev, paperType: data.paperTypes[0] }));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchPricing = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.ALBUM_PRICING);
            setPricing(await res.json());
        } catch (e) { console.error(e); }
    };

    const calculatePrice = () => {
        if (!pricing) return;
        const { bindingType, paperType, sheetCount } = formData;
        let sheetCost = 0;
        if (bindingType === 'Layflat') {
            sheetCost = pricing.sheetTypes.Layflat.pricePerSheet * sheetCount;
        } else if (bindingType === 'NT' && paperType) {
            sheetCost = (pricing.sheetTypes.NT.paperTypes[paperType] || 80) * sheetCount;
        }
        const coverBoxCost = product?.boxPrice || 0;
        const totalPrice = sheetCost + coverBoxCost;
        setPriceBreakdown({ sheetCost, coverBoxCost, totalPrice });
        setCalculatedPrice(totalPrice);
    };

    const showToast = (message, type = 'error') => setToast({ show: true, message, type });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, deliveryAddress: { ...prev.deliveryAddress, [name]: value } }));
    };

    const handleCustomizationChange = (id, value) => {
        setFormData(prev => ({ ...prev, frontPageCustomization: { ...prev.frontPageCustomization, [id]: value } }));
    };

    const handleDynamicCoverImageUpload = async (id, e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('image', file);
        try {
            const res = await fetch(API_ENDPOINTS.UPLOAD, { method: 'POST', body: fd });
            const data = await res.json();
            handleCustomizationChange(id, data.imageUrl || data.url);
        } catch { showToast('Failed to upload image'); }
        finally { setUploading(false); }
    };

    const validateStep = (step) => {
        switch (step) {
            case 0: return formData.title && formData.bindingType && (formData.bindingType === 'Layflat' || formData.paperType);
            case 1: {
                const hasColors = product?.colors?.length > 0;
                return formData.size && (!hasColors || formData.albumColor) && formData.sheetCount >= 20 && formData.sheetCount <= 60;
            }
            case 2: {
                if (!formData.boxType || !formData.imageLink) return false;
                if (product?.frontPageOptions) {
                    for (const o of product.frontPageOptions) {
                        if (o.required && !formData.frontPageCustomization[o.id]) return false;
                    }
                }
                return true;
            }
            case 3: return ['name', 'phone', 'address', 'city', 'state', 'pincode'].every(f => formData.deliveryAddress[f]);
            default: return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) { setCurrentStep(p => Math.min(p + 1, 3)); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        else showToast('Please fill in all required fields', 'warning');
    };

    const prevStep = () => { setCurrentStep(p => Math.max(p - 1, 0)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(3)) { showToast('Please fill in all required fields', 'warning'); return; }
        setSubmitting(true);
        try {
            let user = null;
            try { user = JSON.parse(localStorage.getItem('user')); } catch {}
            if (!user) { showToast('Please login to place an order', 'warning'); navigate('/login'); return; }
            const res = await fetch(API_ENDPOINTS.ORDERS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userId: user.id, productId, calculatedPrice })
            });
            const result = await res.json();
            if (res.ok) { showToast('Order placed successfully!', 'success'); setTimeout(() => navigate('/my-orders'), 1500); }
            else showToast(result.message || 'Failed to place order', 'error');
        } catch { showToast('Error placing order', 'error'); }
        finally { setSubmitting(false); }
    };

    const SelectionCard = ({ selected, onClick, children, className = '' }) => (
        <button type="button" onClick={onClick}
            className={`relative p-4 rounded-xl border-2 transition-all text-left w-full ${selected ? 'border-zg-accent bg-zg-accent/5' : 'border-zg-secondary/10 hover:border-zg-secondary/30 bg-zg-surface'} ${className}`}
        >
            {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-zg-accent flex items-center justify-center">
                    <Check className="w-3 h-3 text-black" />
                </div>
            )}
            {children}
        </button>
    );

    const inputCls = "w-full px-4 py-3 rounded-xl bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent/30 transition-all placeholder:text-zg-secondary/40 text-sm";
    const labelCls = "block text-sm font-semibold text-zg-primary mb-2";

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return (
                <div className="space-y-8">
                    <div>
                        <label className={labelCls}>Album Title <span className="text-zg-accent">*</span></label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange}
                            placeholder="e.g., Romeo & Juliet" className={inputCls} />
                    </div>

                    <div>
                        <label className={labelCls}>Binding Type <span className="text-zg-accent">*</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {((product?.bindingTypes?.length > 0) ? product.bindingTypes : ['NT', 'Layflat']).map(type => (
                                <SelectionCard key={type} selected={formData.bindingType === type}
                                    onClick={() => setFormData(prev => ({ ...prev, bindingType: type, paperType: type === 'NT' ? (product?.paperTypes?.[0] || 'Glossy') : '' }))}>
                                    <div className="pr-6">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-bold">{type === 'NT' ? 'NT (Normal Type)' : 'Layflat'}</p>
                                            {type === 'Layflat' && <span className="text-[10px] px-1.5 py-0.5 bg-zg-accent/20 text-zg-accent rounded font-bold tracking-wider">Premium</span>}
                                        </div>
                                        <p className="text-xs text-zg-secondary">{type === 'NT' ? 'Traditional binding with multiple paper options' : 'Premium seamless binding'}</p>
                                    </div>
                                </SelectionCard>
                            ))}
                        </div>
                    </div>

                    {formData.bindingType === 'NT' && (
                        <div>
                            <label className={labelCls}>Paper Type <span className="text-zg-accent">*</span></label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {((product?.paperTypes?.length > 0) ? product.paperTypes : ['Glossy', 'Matte', 'Lustre', 'Metallic']).map(type => (
                                    <SelectionCard key={type} selected={formData.paperType === type}
                                        onClick={() => setFormData(prev => ({ ...prev, paperType: type }))}>
                                        <p className="font-semibold text-sm text-center w-full">{type}</p>
                                    </SelectionCard>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );

            case 1: return (
                <div className="space-y-8">
                    <div>
                        <label className={labelCls}>Number of Sheets <span className="text-xs text-zg-secondary font-normal">(20–60)</span> <span className="text-zg-accent">*</span></label>
                        <div className="flex items-center gap-4 mt-2">
                            <button type="button" onClick={() => setFormData(p => ({ ...p, sheetCount: Math.max(20, p.sheetCount - 1) }))}
                                className="w-11 h-11 rounded-xl bg-zg-surface border border-zg-secondary/10 hover:border-zg-accent transition-all flex items-center justify-center text-xl font-bold flex-shrink-0">−</button>
                            <input type="number" name="sheetCount" min="20" max="60" value={formData.sheetCount} onChange={handleChange}
                                className="flex-1 px-4 py-3 rounded-xl bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent transition-all text-center text-2xl font-bold" />
                            <button type="button" onClick={() => setFormData(p => ({ ...p, sheetCount: Math.min(60, p.sheetCount + 1) }))}
                                className="w-11 h-11 rounded-xl bg-zg-surface border border-zg-secondary/10 hover:border-zg-accent transition-all flex items-center justify-center text-xl font-bold flex-shrink-0">+</button>
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Size & Orientation <span className="text-zg-accent">*</span></label>
                        {['Square', 'Portrait', 'Landscape'].map(orientation => {
                            const sizes = product?.sizes?.[orientation] || [];
                            if (!sizes.length) return null;
                            return (
                                <div key={orientation} className="mb-4">
                                    <p className="text-xs font-bold text-zg-secondary uppercase tracking-widest mb-2">{orientation}</p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {sizes.map(size => (
                                            <SelectionCard key={size} selected={formData.size === size}
                                                onClick={() => setFormData(p => ({ ...p, size }))}>
                                                <p className="font-bold text-sm text-center w-full">{size}</p>
                                            </SelectionCard>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {product?.colors?.length > 0 && (
                        <div>
                            <label className={labelCls}>Album Color <span className="text-zg-accent">*</span></label>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {product.colors.map(color => (
                                    <button key={color.name} type="button" title={color.name}
                                        onClick={() => setFormData(p => ({ ...p, albumColor: color.name }))}
                                        className={`w-9 h-9 rounded-full border-2 transition-all ${formData.albumColor === color.name ? 'border-zg-accent scale-110 shadow-lg shadow-zg-accent/30' : 'border-transparent hover:border-zg-secondary/30'}`}
                                        style={{ backgroundColor: color.hex }}
                                    >
                                        {formData.albumColor === color.name && <CheckCircle className="w-4 h-4 text-white drop-shadow m-auto" />}
                                    </button>
                                ))}
                            </div>
                            {formData.albumColor && <p className="text-xs text-zg-secondary mt-2">Selected: <span className="text-zg-primary font-medium">{formData.albumColor}</span></p>}
                        </div>
                    )}
                </div>
            );

            case 2: return (
                <div className="space-y-8">
                    <div>
                        <label className={labelCls}>Box Finish <span className="text-zg-accent">*</span></label>
                        <div className="grid grid-cols-3 gap-3">
                            {(product?.boxFinishes || ['Regular', 'Matte', 'Glossy']).map(type => (
                                <SelectionCard key={type} selected={formData.boxType === type}
                                    onClick={() => setFormData(p => ({ ...p, boxType: type }))}>
                                    <p className="font-semibold text-sm text-center w-full">{type}</p>
                                </SelectionCard>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Image Upload Link <span className="text-zg-accent">*</span></label>
                        <p className="text-xs text-zg-secondary mb-2">WeTransfer or Google Drive link</p>
                        <input type="url" name="imageLink" value={formData.imageLink} onChange={handleChange}
                            placeholder="https://" className={inputCls} />
                    </div>

                    {product?.frontPageOptions?.length > 0 && (
                        <div className="pt-6 border-t border-zg-secondary/10">
                            <h3 className="text-base font-bold mb-5">Front Page Customisation</h3>
                            <div className="space-y-5">
                                {product.frontPageOptions.map(option => (
                                    <div key={option.id}>
                                        <label className={labelCls}>{option.label} {option.required && <span className="text-zg-accent">*</span>}</label>
                                        {option.type === 'text' && (
                                            <input type="text" value={formData.frontPageCustomization[option.id] || ''} onChange={e => handleCustomizationChange(option.id, e.target.value)}
                                                placeholder={`Enter ${option.label.toLowerCase()}`} className={inputCls} />
                                        )}
                                        {option.type === 'date' && (
                                            <input type="date" value={formData.frontPageCustomization[option.id] || ''} onChange={e => handleCustomizationChange(option.id, e.target.value)} className={inputCls} />
                                        )}
                                        {option.type === 'image' && (
                                            <div className="flex gap-3 items-center">
                                                <div className="flex-1 relative group">
                                                    <input type="file" accept="image/*" onChange={e => handleDynamicCoverImageUpload(option.id, e)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploading} />
                                                    <div className="w-full px-4 py-3 rounded-xl bg-zg-bg border-2 border-dashed border-zg-secondary/20 text-zg-secondary flex items-center justify-center gap-2 group-hover:border-zg-accent transition-all text-sm">
                                                        <Upload className="w-4 h-4" />
                                                        {uploading ? 'Uploading...' : formData.frontPageCustomization[option.id] ? 'Change Image' : 'Upload Image'}
                                                    </div>
                                                </div>
                                                {formData.frontPageCustomization[option.id] && (
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-zg-secondary/10 flex-shrink-0 relative group">
                                                        <img src={getImageUrl(formData.frontPageCustomization[option.id])} alt="" className="w-full h-full object-cover" />
                                                        <button type="button" onClick={() => handleCustomizationChange(option.id, '')}
                                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <XCircle className="w-5 h-5 text-white" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );

            case 3: return (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Full Name <span className="text-zg-accent">*</span></label>
                            <input type="text" name="name" value={formData.deliveryAddress.name} onChange={handleAddressChange} placeholder="Full Name" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Phone Number <span className="text-zg-accent">*</span></label>
                            <input type="tel" name="phone" value={formData.deliveryAddress.phone} onChange={handleAddressChange} placeholder="Phone Number" className={inputCls} />
                        </div>
                    </div>
                    <div>
                        <label className={labelCls}>Street Address <span className="text-zg-accent">*</span></label>
                        <textarea name="address" rows="3" value={formData.deliveryAddress.address} onChange={handleAddressChange}
                            placeholder="Street Address" className={`${inputCls} resize-none`} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className={labelCls}>City <span className="text-zg-accent">*</span></label>
                            <input type="text" name="city" value={formData.deliveryAddress.city} onChange={handleAddressChange} placeholder="City" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>State <span className="text-zg-accent">*</span></label>
                            <input type="text" name="state" value={formData.deliveryAddress.state} onChange={handleAddressChange} placeholder="State" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Pincode <span className="text-zg-accent">*</span></label>
                            <input type="text" name="pincode" value={formData.deliveryAddress.pincode} onChange={handleAddressChange} placeholder="Pincode" className={inputCls} />
                        </div>
                    </div>
                </div>
            );
            default: return null;
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-zg-bg">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-zg-accent" />
        </div>
    );
    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-zg-bg text-zg-secondary">Product not found</div>
    );

    return (
        <div className="min-h-screen bg-zg-bg text-zg-primary flex">

            {/* ── Left Sidebar ── */}
            <aside className="hidden lg:flex flex-col w-80 xl:w-96 flex-shrink-0 bg-zg-surface border-r border-zg-secondary/10 sticky top-0 h-screen overflow-y-auto">
                <div className="p-8 flex flex-col h-full">
                    {/* Back */}
                    <button onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-zg-secondary hover:text-zg-accent transition-colors text-sm font-medium group mb-8">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Product
                    </button>

                    {/* Product card */}
                    <div className="flex items-center gap-4 p-4 bg-zg-bg rounded-2xl border border-zg-secondary/10 mb-8">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-zg-surface flex-shrink-0">
                            {product.image || product.gallery?.[0] ? (
                                <img src={getImageUrl(product.image || product.gallery[0])} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-zg-secondary/30" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-zg-secondary uppercase tracking-widest font-bold mb-0.5">Ordering</p>
                            <p className="font-heading font-bold text-base truncate">{product.name}</p>
                        </div>
                    </div>

                    {/* Step list */}
                    <div className="space-y-2 flex-1">
                        <p className="text-xs text-zg-secondary uppercase tracking-widest font-bold mb-4">Steps</p>
                        {steps.map((step, idx) => {
                            const isCompleted = idx < currentStep;
                            const isActive = idx === currentStep;
                            return (
                                <div key={step.id} className={`flex items-start gap-4 p-4 rounded-xl transition-all ${isActive ? 'bg-zg-accent/8 border border-zg-accent/20' : 'border border-transparent'}`}>
                                    {/* Step circle */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${isCompleted ? 'bg-zg-accent text-black' : isActive ? 'bg-zg-accent text-black' : 'bg-zg-secondary/10 text-zg-secondary'}`}>
                                        {isCompleted ? <Check className="w-4 h-4" /> : step.icon}
                                    </div>
                                    <div className="min-w-0 pt-0.5">
                                        <p className={`text-sm font-bold leading-tight ${isActive ? 'text-zg-primary' : isCompleted ? 'text-zg-primary' : 'text-zg-secondary'}`}>
                                            {step.name}
                                        </p>
                                        <p className="text-xs text-zg-secondary mt-0.5">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Price Summary */}
                    <div className="mt-8 pt-6 border-t border-zg-secondary/10">
                        <p className="text-xs text-zg-secondary uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                            <IndianRupee className="w-3.5 h-3.5 text-zg-accent" /> Price Summary
                        </p>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zg-secondary">Base Price</span>
                                <span className="font-medium text-zg-primary">Included</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zg-secondary">{formData.sheetCount} Sheets ({formData.bindingType})</span>
                                <span className="font-medium text-zg-primary">₹{priceBreakdown.sheetCost.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zg-secondary">Box & Cover</span>
                                <span className="font-medium text-zg-primary">₹{priceBreakdown.coverBoxCost.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="pt-3 border-t border-zg-secondary/10 flex justify-between items-center">
                                <span className="font-bold">Total</span>
                                <span className="text-2xl font-black text-zg-accent">₹{priceBreakdown.totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-[10px] text-zg-secondary uppercase tracking-widest text-right">Inclusive of all taxes</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Right Content ── */}
            <main className="flex-1 min-h-screen flex flex-col">
                {/* Mobile top bar */}
                <div className="lg:hidden flex items-center justify-between px-5 pt-6 pb-4 border-b border-zg-secondary/10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zg-secondary hover:text-zg-accent transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <span className="text-sm font-bold text-zg-accent">{steps[currentStep].name}</span>
                </div>

                <div className="flex-1 px-8 md:px-14 xl:px-20 py-10 w-full">
                    {/* Step heading */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-bold text-zg-accent uppercase tracking-widest">Step {currentStep + 1} of {steps.length}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-zg-primary">{steps[currentStep].name}</h1>
                        <p className="text-zg-secondary mt-1">{steps[currentStep].description}</p>

                        {/* Mobile progress bar */}
                        <div className="lg:hidden flex gap-1.5 mt-4">
                            {steps.map((_, i) => (
                                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= currentStep ? 'bg-zg-accent' : 'bg-zg-secondary/20'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Form content */}
                    <div className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-6 md:p-8">
                        {renderStepContent()}
                    </div>

                    {/* Mobile price strip */}
                    <div className="lg:hidden mt-6 bg-zg-surface border border-zg-secondary/10 rounded-2xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-zg-secondary">Total</p>
                            <p className="text-xl font-black text-zg-accent">₹{priceBreakdown.totalPrice.toLocaleString('en-IN')}</p>
                        </div>
                        <p className="text-xs text-zg-secondary">{formData.sheetCount} sheets · {formData.bindingType}</p>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-zg-secondary/10">
                        <button type="button" onClick={prevStep} disabled={currentStep === 0}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-zg-secondary hover:text-zg-primary hover:bg-zg-secondary/10 transition-all font-bold text-sm disabled:opacity-0">
                            <ArrowLeft className="w-4 h-4" /> Previous
                        </button>

                        {currentStep === steps.length - 1 ? (
                            <button onClick={handleSubmit} disabled={submitting}
                                className="flex items-center gap-2 px-8 py-3.5 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20 disabled:opacity-50 text-sm uppercase tracking-wide">
                                {submitting ? 'Placing Order...' : <><CheckCircle2 className="w-5 h-5" /> Place Order</>}
                            </button>
                        ) : (
                            <button type="button" onClick={nextStep}
                                className="flex items-center gap-2 px-8 py-3.5 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20 text-sm uppercase tracking-wide">
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </main>

            {/* Toast */}
            {toast.show && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-bold ${
                        toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                        toast.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                        'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                        {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {toast.message}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderForm;
