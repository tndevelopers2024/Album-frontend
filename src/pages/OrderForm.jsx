import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, CheckCircle, XCircle, IndianRupee, Check, AlertCircle, CheckCircle2, BookOpen, Minus, Plus, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../datepicker.css';
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
        frontPageCustomization: {},
        dynamicSpecs: {}
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

    useEffect(() => { if (pricing && product) calculatePrice(); }, [formData.bindingType, formData.paperType, formData.sheetCount, formData.dynamicSpecs, pricing, product]);

    // Clear binding type and size selections when NT or Layflat is chosen (not applicable)
    useEffect(() => {
        if (!product) return;
        const paperSpec = (product.specifications || []).find(
            ({ spec }) => spec?.label?.toLowerCase().includes('paper')
        );
        if (!paperSpec) return;
        const selectedPaper = formData.dynamicSpecs[paperSpec.spec._id];
        if (selectedPaper !== 'Layflat') return;
        const bindingSpecIds = (product.specifications || [])
            .filter(({ spec }) => (spec?.label?.toLowerCase().includes('binding') || spec?.label?.toLowerCase().includes('laminate')))
            .map(({ spec }) => spec._id);
        const specsToRemove = [...bindingSpecIds];
        const hasAny = specsToRemove.some(id => formData.dynamicSpecs[id] !== undefined);
        if (!hasAny) return;
        setFormData(p => {
            const updatedDynamic = { ...p.dynamicSpecs };
            specsToRemove.forEach(id => { delete updatedDynamic[id]; });
            return { ...p, dynamicSpecs: updatedDynamic };
        });
    }, [formData.dynamicSpecs, product]);

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
        if (!pricing || !product) return;

        // Paper spec (label 'paper') now has NT/Layflat — drives sheet pricing
        const paperSpecEntry = (product.specifications || []).find(
            ({ spec }) => spec?.label?.toLowerCase().includes('paper')
        );
        // Binding spec (label 'binding') now has Glossy/Matte/etc. — flat add-on cost
        const bindingSpecEntry = (product.specifications || []).find(
            ({ spec }) => (spec?.label?.toLowerCase().includes('binding') || spec?.label?.toLowerCase().includes('laminate'))
        );
        const paperSpecId = paperSpecEntry?.spec?._id;
        const bindingSpecId = bindingSpecEntry?.spec?._id;

        const paperType = (paperSpecId ? formData.dynamicSpecs[paperSpecId] : null) || formData.paperType;
        const bindingType = (bindingSpecId ? formData.dynamicSpecs[bindingSpecId] : null) || formData.bindingType;
        const sheetCount = formData.sheetCount;

        // Helper: get effective price for an option (product override > master spec price)
        const getEffectivePrice = (specEntry, label, fallback = 0) => {
            const productSpec = (product.specifications || []).find(
                s => (s.spec?._id || s.spec) === specEntry?.spec?._id
            );
            const enabledOpt = productSpec?.enabledOptions?.find(o =>
                typeof o === 'string' ? o === label : o.label === label
            );
            if (enabledOpt && typeof enabledOpt === 'object' && enabledOpt.price !== null && enabledOpt.price !== undefined) {
                return enabledOpt.price;
            }
            return specEntry?.spec?.options?.find(o => o.label === label)?.price ?? fallback;
        };

        let sheetCost = 0;
        if (paperType === 'Layflat') {
            const layfllatPrice = getEffectivePrice(paperSpecEntry, 'Layflat', pricing.sheetTypes?.Layflat?.pricePerSheet || 0);
            sheetCost = layfllatPrice * sheetCount;
        } else if (paperType === 'NT' && bindingType) {
            const bindingPrice = getEffectivePrice(bindingSpecEntry, bindingType, 0);
            sheetCost = bindingPrice * sheetCount;
        }

        const coverBoxCost = product?.boxPrice || 0;

        // Sizes → sizeCost (Box & Pad). Everything else → individual addOnItems line in summary.
        let sizeCost = 0;
        const addOnItems = []; // { label, value, price } — one per selected non-paper/non-laminate/non-size spec

        if (product?.specifications) {
            product.specifications.forEach(({ spec, enabledOptions: specEnabledOpts }) => {
                if (!spec) return;
                if (spec._id === paperSpecId || spec._id === bindingSpecId) return;
                const selectedOptionLabel = formData.dynamicSpecs[spec._id];
                if (!selectedOptionLabel) return;
                // Use product-level override if available, else master spec price
                const enabledOpt = (specEnabledOpts || []).find(o =>
                    typeof o === 'string' ? o === selectedOptionLabel : o.label === selectedOptionLabel
                );
                const overridePrice = enabledOpt && typeof enabledOpt === 'object' && enabledOpt.price !== null && enabledOpt.price !== undefined
                    ? enabledOpt.price : null;
                const price = overridePrice !== null ? overridePrice : (spec.options?.find(o => o.label === selectedOptionLabel)?.price || 0);

                if (spec.label?.toLowerCase().includes('size')) {
                    sizeCost += price;
                } else {
                    addOnItems.push({ label: spec.label, value: selectedOptionLabel, price });
                }
            });
        }

        const dynamicSpecsCost = sizeCost + addOnItems.reduce((s, i) => s + i.price, 0);
        const subTotal = sheetCost + dynamicSpecsCost;
        const tax = Math.round(subTotal * 0.18);
        const totalPrice = subTotal + tax;
        setPriceBreakdown({ sheetCost, coverBoxCost, sizeCost, addOnItems, dynamicSpecsCost, subTotal, tax, totalPrice, bindingType, paperType });
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
            case 0:
                if (!formData.title.trim()) { showToast('Please enter an album title'); return false; }
                if (product?.colors?.length > 0 && !formData.albumColor) { showToast('Please select an album color'); return false; }
                return true;
            case 1: {
                const specs = product?.specifications || [];

                // Paper type (NT/Layflat) is the primary required selection
                const paperSpecEntry = specs.find(({ spec }) => spec?.label?.toLowerCase().includes('paper'));
                const selectedPaper = paperSpecEntry
                    ? formData.dynamicSpecs[paperSpecEntry.spec._id]
                    : formData.paperType;

                if (!selectedPaper) { showToast('Please select a paper type'); return false; }

                // Layflat only hides Laminate Type — size is required for both
                if (selectedPaper !== 'Layflat') {
                    // Laminate type required for NT
                    const bindingSpecEntry = specs.find(({ spec }) => (spec?.label?.toLowerCase().includes('binding') || spec?.label?.toLowerCase().includes('laminate')));
                    if (bindingSpecEntry && !formData.dynamicSpecs[bindingSpecEntry.spec._id]) {
                        showToast('Please select a laminate type'); return false;
                    }
                }

                // Size required for both NT and Layflat
                const sizeSpecIds = specs
                    .filter(({ spec }) => spec?.label?.toLowerCase().includes('size'))
                    .map(({ spec }) => spec._id);
                const hasSize = sizeSpecIds.some(id => formData.dynamicSpecs[id]);
                if (sizeSpecIds.length > 0 && !hasSize) {
                    showToast('Please select a size'); return false;
                }

                return true;
            }
            case 2:
                if (!formData.imageLink.trim()) { showToast('Please provide an image upload link'); return false; }
                // Validate required front page customization
                if (product?.frontPageOptions) {
                    for (const opt of product.frontPageOptions) {
                        if (opt.required && !formData.frontPageCustomization[opt.id]) {
                            showToast(`Please provide ${opt.label}`);
                            return false;
                        }
                    }
                }
                return true;
            case 3:
                const { name, phone, address, city, state, pincode } = formData.deliveryAddress;
                if (!name || !phone || !address || !city || !state || !pincode) {
                    showToast('Please fill all delivery details');
                    return false;
                }
                return true;
            default: return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) { 
            setCurrentStep(p => Math.min(p + 1, 3)); 
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }
    };

    const prevStep = () => { setCurrentStep(p => Math.max(p - 1, 0)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const openRazorpay = (paymentData, user) => {
        const options = {
            key: paymentData.keyId,
            amount: paymentData.amount,
            currency: paymentData.currency,
            name: 'Zero Gravity Albums',
            description: formData.title,
            order_id: paymentData.razorpayOrderId,
            prefill: {
                name: formData.deliveryAddress.name,
                contact: formData.deliveryAddress.phone,
            },
            theme: { color: '#D4AF37' },
            handler: async (response) => {
                try {
                    const verifyRes = await fetch(API_ENDPOINTS.PAYMENT_VERIFY, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            dbOrderId: paymentData.dbOrderId
                        })
                    });
                    if (verifyRes.ok) {
                        showToast('Payment successful! Order placed.', 'success');
                        setTimeout(() => navigate('/my-orders'), 1500);
                    } else {
                        showToast('Payment verification failed. Contact support.', 'error');
                    }
                } catch {
                    showToast('Error verifying payment. Contact support.', 'error');
                } finally {
                    setSubmitting(false);
                }
            },
            modal: {
                ondismiss: () => {
                    showToast('Payment cancelled. Your order is saved — retry from My Orders.', 'error');
                    setSubmitting(false);
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', () => {
            showToast('Payment failed. Your order is saved — retry from My Orders.', 'error');
            setSubmitting(false);
        });
        rzp.open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(3)) return;
        setSubmitting(true);
        try {
            let user = null;
            try { user = JSON.parse(localStorage.getItem('user')); } catch {}
            if (!user) { showToast('Please login to place an order', 'warning'); navigate('/login'); return; }

            const res = await fetch(API_ENDPOINTS.PAYMENT_CREATE_ORDER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userId: user.id, productId, calculatedPrice })
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.message || 'Failed to initiate payment', 'error'); setSubmitting(false); return; }

            openRazorpay(data, user);
        } catch {
            showToast('Error initiating payment', 'error');
            setSubmitting(false);
        }
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
        const labelCls = "text-sm font-bold text-zg-secondary uppercase tracking-wider mb-2 block";
        const inputCls = "w-full px-5 py-4 rounded-xl bg-zg-bg border border-zg-secondary/20 text-zg-primary focus:outline-none focus:border-zg-accent transition-all shadow-inner placeholder:text-zg-secondary/30";

        switch (currentStep) {
            case 0: return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <label className={labelCls}>Album Title <span className="text-zg-accent">*</span></label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange}
                            placeholder="e.g. Rahul & Priya's Wedding" className={inputCls} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className={labelCls}>Sheet Count <span className="text-zg-accent">*</span></label>
                            <p className="text-[10px] text-zg-secondary mb-3 uppercase font-bold tracking-tighter">Min 20 - Max 60 sheets</p>
                            <div className="flex items-center gap-6 p-4 bg-zg-bg rounded-2xl border border-zg-secondary/10">
                                <button type="button" onClick={() => setFormData(p => ({ ...p, sheetCount: Math.max(20, p.sheetCount - 1) }))}
                                    className="w-12 h-12 rounded-xl bg-zg-surface flex items-center justify-center hover:bg-zg-accent hover:text-black transition-all shadow-lg active:scale-95 border border-zg-secondary/5">
                                    <Minus className="w-5 h-5" />
                                </button>
                                <div className="flex-1 text-center">
                                    <span className="text-3xl font-black text-zg-accent">{formData.sheetCount}</span>
                                    <span className="ml-2 text-zg-secondary text-xs font-bold uppercase">Sheets</span>
                                </div>
                                <button type="button" onClick={() => setFormData(p => ({ ...p, sheetCount: Math.min(60, p.sheetCount + 1) }))}
                                    className="w-12 h-12 rounded-xl bg-zg-surface flex items-center justify-center hover:bg-zg-accent hover:text-black transition-all shadow-lg active:scale-95 border border-zg-secondary/5">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {product?.colors?.length > 0 && (
                            <div>
                                <label className={labelCls}>Album Color <span className="text-zg-accent">*</span></label>
                                <p className="text-[10px] text-zg-secondary mb-3 uppercase font-bold tracking-tighter">Select from available variants</p>
                                <div className="flex flex-wrap gap-3 p-4 bg-zg-bg rounded-2xl border border-zg-secondary/10">
                                    {product.colors.map((color, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, albumColor: color.name }))}
                                            className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center shadow-md ${formData.albumColor === color.name ? 'border-zg-accent ring-2 ring-zg-accent/20 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                            {formData.albumColor === color.name && <Check className="w-5 h-5 text-white drop-shadow" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );

            case 1: return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {[...(product?.specifications || [])].sort((a, b) => {
                        const aIsPaper = a.spec?.label?.toLowerCase().includes('paper') ? -1 : 0;
                        const bIsPaper = b.spec?.label?.toLowerCase().includes('paper') ? -1 : 0;
                        return aIsPaper - bIsPaper;
                    }).map(({ spec, enabledOptions }) => {
                        if (!spec) return null;

                        // Determine selected paper type (NT/Layflat) from dynamicSpecs
                        const paperSpecEntry = (product?.specifications || []).find(
                            ({ spec: s }) => s?.label?.toLowerCase().includes('paper')
                        );
                        const selectedPaper = paperSpecEntry
                            ? formData.dynamicSpecs[paperSpecEntry.spec._id]
                            : formData.paperType;

                        // Hide binding type and size sections when NT or Layflat is selected
                        const isSizeSpec = spec.label?.toLowerCase().includes('size');
                        const isPaperSpec = spec.label?.toLowerCase().includes('paper');
                        const isBindingSpec = spec.label?.toLowerCase().includes('binding') || spec.label?.toLowerCase().includes('laminate');
                        if (selectedPaper === 'Layflat' && isBindingSpec) return null;

                        // Collect all size spec IDs so selecting one clears the others
                        const allSizeSpecIds = (product?.specifications || [])
                            .filter(({ spec: s }) => s?.label?.toLowerCase().includes('size'))
                            .map(({ spec: s }) => s._id);

                        const visibleOptions = enabledOptions?.length > 0
                            ? enabledOptions.map(opt => {
                                const label = typeof opt === 'string' ? opt : opt.label;
                                const overridePrice = typeof opt === 'object' && opt.price !== null && opt.price !== undefined ? opt.price : null;
                                const masterOpt = spec.options.find(o => o.label === label) || { label, price: 0 };
                                return overridePrice !== null ? { ...masterOpt, price: overridePrice } : masterOpt;
                            })
                            : spec.options;
                        return (
                            <div key={spec._id} className="space-y-4">
                                <label className={labelCls}>{spec.label?.toLowerCase().includes('binding') ? 'Laminate Type' : spec.label}</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {visibleOptions.map((opt) => {
                                        // Layflat (in paper spec) shows per-sheet price; binding options show flat add-on
                                        const layflantPerSheet = isPaperSpec && opt.label === 'Layflat' ? pricing?.sheetTypes?.Layflat?.pricePerSheet : null;
                                        const priceLabel = layflantPerSheet ? `₹${layflantPerSheet}/sheet` : opt.price > 0 ? `+ ₹${opt.price}` : null;
                                        return (
                                            <SelectionCard
                                                key={opt.label}
                                                selected={formData.dynamicSpecs[spec._id] === opt.label}
                                                onClick={() => setFormData(p => {
                                                    const updated = { ...p.dynamicSpecs };
                                                    // Clear all other size specs before selecting this one
                                                    if (isSizeSpec) {
                                                        allSizeSpecIds.forEach(id => { delete updated[id]; });
                                                    }
                                                    updated[spec._id] = opt.label;
                                                    return { ...p, dynamicSpecs: updated };
                                                })}
                                            >
                                                <div className="flex flex-col items-center gap-1 w-full py-1">
                                                    <span className="font-bold text-sm text-center line-clamp-2">{opt.label}</span>
                                                    {priceLabel && (
                                                        <span className="text-[10px] text-zg-accent font-black bg-zg-accent/10 px-2 py-0.5 rounded">{priceLabel}</span>
                                                    )}
                                                </div>
                                            </SelectionCard>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    {(!product?.specifications || product.specifications.length === 0) && (
                        <div className="py-20 text-center">
                            <p className="text-zg-secondary">No additional specifications for this product.</p>
                        </div>
                    )}
                </div>
            );

            case 2: return (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <label className={labelCls}>Image Upload Link <span className="text-zg-accent">*</span></label>
                        <p className="text-xs text-zg-secondary mb-3">Please provide a Google Drive, WeTransfer, or Dropbox link containing your photos.</p>
                        <div className="relative">
                            <input type="url" name="imageLink" value={formData.imageLink} onChange={handleChange}
                                placeholder="https://" className={`${inputCls} pl-12`} />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zg-secondary">
                                <Upload className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Company Logo — optional */}
                    <div className="pt-8 border-t border-zg-secondary/10">
                        <div className="mb-4">
                            <label className={labelCls}>Company Logo <span className="text-xs font-normal text-zg-secondary normal-case tracking-normal">(optional)</span></label>
                            <p className="text-xs text-zg-secondary mb-3">Upload your studio or company logo to be printed on the album.</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="flex-1 relative group">
                                <input type="file" accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setUploading(true);
                                        const fd = new FormData();
                                        fd.append('image', file);
                                        try {
                                            const res = await fetch(API_ENDPOINTS.UPLOAD, { method: 'POST', body: fd });
                                            const data = await res.json();
                                            setFormData(p => ({ ...p, logo: data.imageUrl || data.url }));
                                        } catch { showToast('Failed to upload logo'); }
                                        finally { setUploading(false); }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploading} />
                                <div className="w-full px-5 py-4 rounded-xl bg-zg-bg border-2 border-dashed border-zg-secondary/20 text-zg-secondary flex items-center justify-center gap-3 group-hover:border-zg-accent transition-all text-sm font-bold">
                                    {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-zg-accent" /> : <Upload className="w-4 h-4" />}
                                    {uploading ? 'Uploading...' : formData.logo ? 'Replace Logo' : 'Upload Logo'}
                                </div>
                            </div>
                            {formData.logo && (
                                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-zg-accent/20 shrink-0 relative group shadow-lg">
                                    <img src={getImageUrl(formData.logo)} alt="Logo" className="w-full h-full object-contain bg-white p-1" />
                                    <button type="button" onClick={() => setFormData(p => ({ ...p, logo: '' }))}
                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <XCircle className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {product?.frontPageOptions?.length > 0 && (
                        <div className="pt-8 border-t border-zg-secondary/10">
                            <div className="mb-6">
                                <h3 className="text-xl font-heading font-bold text-zg-primary">Front Page Customisation</h3>
                                <p className="text-sm text-zg-secondary">Provide details to be printed on the album cover.</p>
                            </div>
                            <div className="space-y-6">
                                {product.frontPageOptions.map(option => (
                                    <div key={option.id} className="space-y-3">
                                        <label className={labelCls}>{option.label} {option.required && <span className="text-zg-accent">*</span>}</label>
                                        {option.type === 'text' && (
                                            <input type="text" value={formData.frontPageCustomization[option.id] || ''} onChange={e => handleCustomizationChange(option.id, e.target.value)}
                                                placeholder={`Enter ${option.label.toLowerCase()}`} className={inputCls} />
                                        )}
                                        {option.type === 'date' && (
                                            <div className="relative">
                                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zg-secondary pointer-events-none z-10" />
                                                <DatePicker
                                                    selected={formData.frontPageCustomization[option.id] ? new Date(formData.frontPageCustomization[option.id]) : null}
                                                    onChange={(date) => handleCustomizationChange(option.id, date ? date.toISOString().split('T')[0] : '')}
                                                    dateFormat="dd MMM yyyy"
                                                    placeholderText="Select a date"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    yearDropdownItemNumber={50}
                                                    scrollableYearDropdown
                                                    className={`${inputCls} pl-12 cursor-pointer`}
                                                    wrapperClassName="w-full"
                                                    popperPlacement="bottom-start"
                                                />
                                            </div>
                                        )}
                                        {option.type === 'image' && (
                                            <div className="flex gap-4 items-center">
                                                <div className="flex-1 relative group">
                                                    <input type="file" accept="image/*" onChange={e => handleDynamicCoverImageUpload(option.id, e)}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploading} />
                                                    <div className="w-full px-5 py-4 rounded-xl bg-zg-bg border-2 border-dashed border-zg-secondary/20 text-zg-secondary flex items-center justify-center gap-3 group-hover:border-zg-accent transition-all text-sm font-bold">
                                                        {uploading ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-zg-accent" />
                                                        ) : (
                                                            <Upload className="w-4 h-4" />
                                                        )}
                                                        {uploading ? 'Uploading...' : formData.frontPageCustomization[option.id] ? 'Replace Image' : 'Upload Artwork'}
                                                    </div>
                                                </div>
                                                {formData.frontPageCustomization[option.id] && (
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-zg-accent/20 flex-shrink-0 relative group shadow-lg">
                                                        <img src={getImageUrl(formData.frontPageCustomization[option.id])} alt="" className="w-full h-full object-cover" />
                                                        <button type="button" onClick={() => handleCustomizationChange(option.id, '')}
                                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <XCircle className="w-6 h-6 text-white" />
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

            {/* ── Right Sidebar ── */}
            <aside className="hidden lg:flex flex-col w-80 xl:w-96 flex-shrink-0 bg-zg-surface border-l border-zg-secondary/10 sticky top-0 h-screen overflow-y-auto order-last">
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
                                <span className="text-zg-secondary">
                                    {formData.sheetCount} Sheets
                                    {priceBreakdown.paperType ? ` (${priceBreakdown.paperType}${priceBreakdown.paperType !== 'NT' && priceBreakdown.paperType !== 'Layflat' && priceBreakdown.bindingType ? ` · ${priceBreakdown.bindingType}` : ''})` : ''}
                                </span>
                                <span className="font-medium text-zg-primary">₹{(priceBreakdown.sheetCost || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zg-secondary">Box & Pad</span>
                                <span className="font-medium text-zg-primary">₹{(priceBreakdown.sizeCost || 0).toLocaleString('en-IN')}</span>
                            </div>
                            {(priceBreakdown.addOnItems || []).map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-zg-secondary">{item.label}: <span className="text-zg-primary/70">{item.value}</span></span>
                                    <span className="font-medium text-zg-primary">₹{item.price.toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                            <div className="flex justify-between text-sm pt-2 border-t border-zg-secondary/10">
                                <span className="text-zg-secondary">GST (18%)</span>
                                <span className="font-medium text-zg-primary">₹{(priceBreakdown.tax || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="pt-3 border-t border-zg-secondary/10 flex justify-between items-center">
                                <span className="font-bold">Total</span>
                                <span className="text-2xl font-black text-zg-accent">₹{(priceBreakdown.totalPrice || 0).toLocaleString('en-IN')}</span>
                            </div>
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
                        <p className="text-xs text-zg-secondary">{formData.sheetCount} sheets · {priceBreakdown.paperType || formData.paperType}{priceBreakdown.paperType !== 'NT' && priceBreakdown.paperType !== 'Layflat' && priceBreakdown.bindingType ? ` · ${priceBreakdown.bindingType}` : ''}</p>
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
                                {submitting ? 'Processing...' : <><CheckCircle2 className="w-5 h-5" /> Pay & Place Order</>}
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
