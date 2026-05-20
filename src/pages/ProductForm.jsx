import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Plus, Trash2, Settings2 } from 'lucide-react';
import API_ENDPOINTS from '../api';
import getImageUrl from '../utils/imageUtils';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        image: '',
        gallery: [],
        features: [],
        benefits: [],
        price: '',
        boxPrice: '',
        frontPageOptions: [],
        sizes: {
            Square: [],
            Portrait: [],
            Landscape: []
        },
        paperTypes: [],
        bindingTypes: [],
        boxFinishes: [],
        colors: [],
        specifications: []  // [{ spec: ObjectId, enabledOptions: [String] }]
    });
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState({
        categories: [],
        paperTypes: [],
        bindingTypes: [],
        boxFinishes: [],
        sizes: { Square: [], Portrait: [], Landscape: [] },
        masterSpecs: []
    });

    // Store file objects for deferred upload
    const [imageFile, setImageFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [colorGalleryFiles, setColorGalleryFiles] = useState({}); // { colorIndex: [File, File, ...] }

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
        fetchSuggestions();
    }, [id]);

    const fetchSuggestions = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.PRODUCTS);
            const products = await response.json();
            
            const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
            
            // Fetch Master Specs
            const masterSpecsRes = await fetch(API_ENDPOINTS.MASTER_SPECS);
            const masterSpecs = await masterSpecsRes.json();

            // Sync core suggestions from Master Specs
            const findSpecOptions = (name) => masterSpecs.find(s => s.name === name)?.options.map(o => o.label) || [];
            
            const papers = [...new Set([...findSpecOptions('paper_types'), ...products.flatMap(p => p.paperTypes || [])])].filter(Boolean);
            const bindings = [...new Set([...findSpecOptions('binding_types'), ...products.flatMap(p => p.bindingTypes || [])])].filter(Boolean);
            const finishes = [...new Set([...findSpecOptions('box_finishes'), ...products.flatMap(p => p.boxFinishes || [])])].filter(Boolean);
            
            const sizes = {
                Square: [...new Set([...findSpecOptions('square_sizes'), ...products.flatMap(p => p.sizes?.Square || [])])].filter(Boolean),
                Portrait: [...new Set([...findSpecOptions('portrait_sizes'), ...products.flatMap(p => p.sizes?.Portrait || [])])].filter(Boolean),
                Landscape: [...new Set([...findSpecOptions('landscape_sizes'), ...products.flatMap(p => p.sizes?.Landscape || [])])].filter(Boolean)
            };
            
            setSuggestions({ categories: cats, paperTypes: papers, bindingTypes: bindings, boxFinishes: finishes, sizes, masterSpecs });
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(id));
            const data = await response.json();
            setFormData({
                name: data.name || '',
                category: data.category || '',
                description: data.description || '',
                image: data.image || '',
                gallery: data.gallery || [],
                features: data.features || [],
                benefits: data.benefits || [],
                price: data.price || '',
                boxPrice: data.boxPrice || '',
                frontPageOptions: data.frontPageOptions || [],
                sizes: data.sizes || {
                    Square: [],
                    Portrait: [],
                    Landscape: []
                },
                paperTypes: data.paperTypes || [],
                bindingTypes: data.bindingTypes || [],
                boxFinishes: data.boxFinishes || [],
                colors: data.colors || [],
                specifications: data.specifications?.map(s => ({
                    spec: s.spec?._id || s.spec || s._id || s,
                    enabledOptions: s.enabledOptions || []
                })).filter(s => s.spec) || []
            });
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle image file selection (no upload yet)
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, image: previewUrl }));
    };

    // Handle gallery files selection (no upload yet)
    const handleGallerySelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setGalleryFiles(prev => [...prev, ...files]);

        // Create preview URLs
        const previewUrls = files.map(file => URL.createObjectURL(file));
        setFormData(prev => ({
            ...prev,
            gallery: [...prev.gallery, ...previewUrls]
        }));
    };

    const addTag = (field, value) => {
        if (!value.trim()) return;
        setFormData(prev => ({
            ...prev,
            [field]: [...new Set([...prev[field], value.trim()])]
        }));
    };

    const removeTag = (field, tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter(tag => tag !== tagToRemove)
        }));
    };

    const addSizeTag = (orientation, value) => {
        if (!value.trim()) return;
        setFormData(prev => ({
            ...prev,
            sizes: {
                ...prev.sizes,
                [orientation]: [...new Set([...prev.sizes[orientation], value.trim()])]
            }
        }));
    };

    const removeSizeTag = (orientation, tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            sizes: {
                ...prev.sizes,
                [orientation]: prev.sizes[orientation].filter(tag => tag !== tagToRemove)
            }
        }));
    };

    const addFrontPageOption = () => {
        const newOption = {
            id: Date.now().toString(),
            label: '',
            type: 'text',
            required: false
        };
        setFormData(prev => ({
            ...prev,
            frontPageOptions: [...prev.frontPageOptions, newOption]
        }));
    };

    const removeFrontPageOption = (id) => {
        setFormData(prev => ({
            ...prev,
            frontPageOptions: prev.frontPageOptions.filter(opt => opt.id !== id)
        }));
    };

    const updateFrontPageOption = (id, updates) => {
        setFormData(prev => ({
            ...prev,
            frontPageOptions: prev.frontPageOptions.map(opt => 
                opt.id === id ? { ...opt, ...updates } : opt
            )
        }));
    };

    const removeGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
    };

    // Helper for dynamic list fields (features, benefits)
    const handleListChange = (field, index, value) => {
        const newList = [...formData[field]];
        newList[index] = value;
        setFormData(prev => ({ ...prev, [field]: newList }));
    };

    const addListItem = (field) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
    };

    const removeListItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleFrontPageOptionChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            frontPageOptions: {
                ...prev.frontPageOptions,
                [field]: value
            }
        }));
    };

    // Color Management
    const addColor = () => {
        setFormData(prev => ({
            ...prev,
            colors: [...prev.colors, { name: '', hex: '#000000', gallery: [] }]
        }));
    };

    const removeColor = (index) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index)
        }));
        // Also remove associated files
        const newColorGalleryFiles = { ...colorGalleryFiles };
        delete newColorGalleryFiles[index];
        // Note: we might need to re-index colorGalleryFiles if we use indices
        // It's better to use something more stable, but let's try to keep it simple for now
    };

    const handleColorChange = (index, field, value) => {
        const newColors = [...formData.colors];
        newColors[index] = { ...newColors[index], [field]: value };
        setFormData(prev => ({ ...prev, colors: newColors }));
    };

    const handleColorGallerySelect = (index, e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setColorGalleryFiles(prev => ({
            ...prev,
            [index]: [...(prev[index] || []), ...files]
        }));

        // Create preview URLs
        const previewUrls = files.map(file => URL.createObjectURL(file));
        const newColors = [...formData.colors];
        newColors[index] = {
            ...newColors[index],
            gallery: [...newColors[index].gallery, ...previewUrls]
        };
        setFormData(prev => ({ ...prev, colors: newColors }));
    };

    const removeColorGalleryImage = (colorIndex, imageIndex) => {
        const newColors = [...formData.colors];
        const updatedGallery = newColors[colorIndex].gallery.filter((_, i) => i !== imageIndex);
        
        // Also need to handle the files if it was a newly selected file
        // This is getting complex because of index matching.
        // For now, let's just update the gallery. 
        // During submit, we'll filter out blob URLs that are no longer in the gallery.

        newColors[colorIndex] = { ...newColors[colorIndex], gallery: updatedGallery };
        setFormData(prev => ({ ...prev, colors: newColors }));
    };

    const isSpecSelected = (specId) => formData.specifications.some(s => s.spec === specId);
    const getEnabledOptions = (specId) => formData.specifications.find(s => s.spec === specId)?.enabledOptions || [];

    const toggleSpec = (specId, masterOptions) => {
        const selected = isSpecSelected(specId);
        setFormData(prev => ({
            ...prev,
            specifications: selected
                ? prev.specifications.filter(s => s.spec !== specId)
                : [...prev.specifications, { spec: specId, enabledOptions: masterOptions.map(o => o.label) }]
        }));
    };

    const toggleOption = (specId, optionLabel) => {
        setFormData(prev => ({
            ...prev,
            specifications: prev.specifications.map(s => {
                if (s.spec !== specId) return s;
                const has = s.enabledOptions.includes(optionLabel);
                return { ...s, enabledOptions: has ? s.enabledOptions.filter(o => o !== optionLabel) : [...s.enabledOptions, optionLabel] };
            })
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const url = isEditMode
            ? API_ENDPOINTS.PRODUCT_BY_ID(id)
            : API_ENDPOINTS.PRODUCTS;

        const method = isEditMode ? 'PUT' : 'POST';

        try {
            let uploadedImagePath = formData.image;
            let uploadedGalleryPaths = formData.gallery;

            // Upload main image if new file selected
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);

                const uploadRes = await fetch(API_ENDPOINTS.UPLOAD, {
                    method: 'POST',
                    body: imageFormData
                });
                const uploadData = await uploadRes.json();
                if (uploadRes.ok) {
                    uploadedImagePath = uploadData.imageUrl;
                } else {
                    alert('Failed to upload main image');
                    setLoading(false);
                    return;
                }
            }

            // Upload gallery images if new files selected
            if (galleryFiles.length > 0) {
                const uploadedPaths = [];
                for (const file of galleryFiles) {
                    const galleryFormData = new FormData();
                    galleryFormData.append('image', file);

                    const uploadRes = await fetch(API_ENDPOINTS.UPLOAD, {
                        method: 'POST',
                        body: galleryFormData
                    });
                    const uploadData = await uploadRes.json();
                    if (uploadRes.ok) {
                        uploadedPaths.push(uploadData.imageUrl);
                    }
                }

                // Merge with existing gallery images (filter out blob URLs)
                const existingImages = formData.gallery.filter(img => !img.startsWith('blob:'));
                uploadedGalleryPaths = [...existingImages, ...uploadedPaths];
            }

            // Upload Color Gallery images
            const updatedColors = await Promise.all(formData.colors.map(async (color, index) => {
                const files = colorGalleryFiles[index] || [];
                const uploadedPaths = [];

                if (files.length > 0) {
                    for (const file of files) {
                        // Only upload if it's still in the gallery (blob URL check)
                        // This is a bit rough but works for now
                        const galleryFormData = new FormData();
                        galleryFormData.append('image', file);

                        const uploadRes = await fetch(API_ENDPOINTS.UPLOAD, {
                            method: 'POST',
                            body: galleryFormData
                        });
                        const uploadData = await uploadRes.json();
                        if (uploadRes.ok) {
                            uploadedPaths.push(uploadData.imageUrl);
                        }
                    }
                }

                // Filter out blob URLs from existing gallery and merge with new uploads
                const existingImages = color.gallery.filter(img => !img.startsWith('blob:'));
                return {
                    ...color,
                    gallery: [...existingImages, ...uploadedPaths]
                };
            }));

            // Filter out empty strings from lists
            const cleanData = {
                ...formData,
                image: uploadedImagePath,
                gallery: uploadedGalleryPaths,
                colors: updatedColors,
                features: formData.features.filter(item => item.trim() !== ''),
                benefits: formData.benefits.filter(item => item.trim() !== '')
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanData)
            });

            if (response.ok) {
                navigate('/admin/products');
            } else {
                alert('Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout title={isEditMode ? 'Edit Product' : 'Add New Product'}>
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center gap-2 text-zg-secondary hover:text-zg-primary transition-colors mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Products</span>
            </button>

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div>
                                <label className="text-zg-secondary text-sm mb-2 block">Product Title</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-zg-secondary text-sm mb-2 block uppercase tracking-wider">Category / Series</label>
                                <input
                                    type="text"
                                    name="category"
                                    list="category-suggestions"
                                    required
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g. EVERWOOD SERIES"
                                    className="w-full px-4 py-3 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                                />
                                <datalist id="category-suggestions">
                                    {suggestions.categories.map(cat => (
                                        <option key={cat} value={cat} />
                                    ))}
                                </datalist>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="text-zg-secondary text-sm mb-2 block">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="text-zg-secondary text-sm mb-2 block">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>

                            {/* Box/PAD Price */}
                            <div>
                                <label className="text-zg-secondary text-sm mb-2 block">Box/PAD Price</label>
                                <input
                                    type="number"
                                    name="boxPrice"
                                    value={formData.boxPrice}
                                    onChange={handleChange}
                                    placeholder="Enter box price"
                                    className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>

                            {/* Features */}
                            <div className="md:col-span-2">
                                <label className="text-zg-secondary text-sm mb-2 block">Features</label>
                                <div className="space-y-3">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => handleListChange('features', index, e.target.value)}
                                                placeholder="Enter a feature"
                                                className="flex-1 px-4 py-2 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeListItem('features', index)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addListItem('features')}
                                        className="flex items-center gap-2 text-sm text-zg-accent hover:text-zg-accent-hover font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Feature
                                    </button>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="md:col-span-2">
                                <label className="text-zg-secondary text-sm mb-2 block">Benefits</label>
                                <div className="space-y-3">
                                    {formData.benefits.map((benefit, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={benefit}
                                                onChange={(e) => handleListChange('benefits', index, e.target.value)}
                                                placeholder="Enter a benefit"
                                                className="flex-1 px-4 py-2 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeListItem('benefits', index)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addListItem('benefits')}
                                        className="flex items-center gap-2 text-sm text-zg-accent hover:text-zg-accent-hover font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Benefit
                                    </button>
                                </div>
                            </div>

                            {/* Main Image */}
                            <div className="md:col-span-2">
                                <label className="text-zg-secondary text-sm mb-2 block">Main Image</label>
                                <div className="space-y-3">
                                    {/* Upload Option */}
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageSelect}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="w-full px-4 py-3 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-secondary flex items-center gap-2 hover:border-zg-accent transition-colors">
                                                    <Upload className="w-4 h-4" />
                                                    <span>{formData.image ? 'Change Image' : 'Upload Main Image'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {formData.image && (
                                            <div className="w-24 h-24 rounded-lg bg-zg-surface border border-zg-secondary/10 overflow-hidden flex-shrink-0 relative group">
                                                <img src={getImageUrl(formData.image)} alt="Main Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>

                            {/* Product Gallery */}
                            <div className="md:col-span-2">
                                <label className="text-zg-secondary text-sm mb-2 block">Product Gallery</label>
                                <div className="space-y-4">
                                    {/* Upload Option */}
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleGallerySelect}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-full px-4 py-8 rounded-lg bg-zg-surface border-2 border-dashed border-zg-secondary/20 text-zg-secondary flex flex-col items-center justify-center gap-2 hover:border-zg-accent hover:text-zg-primary transition-colors">
                                            <ImageIcon className="w-8 h-8 opacity-50" />
                                            <span className="font-medium">Click to upload gallery images</span>
                                            <span className="text-xs opacity-50">Supports multiple files</span>
                                        </div>
                                    </div>

                                    {/* Gallery Grid */}
                                    {formData.gallery.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {formData.gallery.map((img, index) => (
                                                <div key={index} className="relative aspect-square rounded-lg bg-zg-surface border border-zg-secondary/10 overflow-hidden group">
                                                    <img src={getImageUrl(img)} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(index)}
                                                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                    </div>
                </div>

                    {/* Dynamic Specifications Section */}
                    <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-heading font-bold">Product Specifications</h2>
                                <p className="text-sm text-zg-secondary">Select fields and choose which options apply to this product.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/master-specs')}
                                className="text-zg-accent text-sm font-bold flex items-center gap-1 hover:underline"
                            >
                                <Settings2 size={16} /> Manage Fields
                            </button>
                        </div>

                        {suggestions.masterSpecs.length === 0 ? (
                            <p className="text-sm text-zg-secondary/60 italic">No specification fields created yet. <button type="button" onClick={() => navigate('/admin/master-specs')} className="text-zg-accent hover:underline">Create one</button></p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {suggestions.masterSpecs.map(spec => {
                                    const isSelected = isSpecSelected(spec._id);
                                    const enabledOptions = getEnabledOptions(spec._id);
                                    return (
                                        <div
                                            key={spec._id}
                                            className={`rounded-xl border transition-all flex flex-col ${
                                                isSelected
                                                    ? 'bg-zg-accent/5 border-zg-accent'
                                                    : 'bg-zg-surface border-zg-secondary/10 hover:border-zg-secondary/30'
                                            }`}
                                        >
                                            {/* Header row — click to toggle spec on/off */}
                                            <div
                                                className="p-4 cursor-pointer flex justify-between items-center"
                                                onClick={() => toggleSpec(spec._id, spec.options)}
                                            >
                                                <span className="font-bold text-sm">{spec.label}</span>
                                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                                    isSelected ? 'bg-zg-accent border-zg-accent text-black' : 'border-zg-secondary/20'
                                                }`}>
                                                    {isSelected && <Save size={12} />}
                                                </div>
                                            </div>

                                            {/* Option checkboxes + custom input — only when spec is selected */}
                                            {isSelected && (
                                                <div className="px-4 pb-4 border-t border-zg-secondary/10 pt-3 space-y-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {/* Master spec options */}
                                                        {spec.options.map(opt => {
                                                            const isOptOn = enabledOptions.includes(opt.label);
                                                            return (
                                                                <button
                                                                    key={opt.label}
                                                                    type="button"
                                                                    onClick={() => toggleOption(spec._id, opt.label)}
                                                                    className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition-all ${
                                                                        isOptOn
                                                                            ? 'bg-zg-accent text-black border-zg-accent'
                                                                            : 'bg-zg-bg text-zg-secondary border-zg-secondary/20 hover:border-zg-secondary/50'
                                                                    }`}
                                                                >
                                                                    {opt.label}
                                                                    {opt.price > 0 && <span className="ml-1 opacity-70">+₹{opt.price}</span>}
                                                                </button>
                                                            );
                                                        })}
                                                        {/* Custom options added for this product */}
                                                        {enabledOptions.filter(lbl => !spec.options.find(o => o.label === lbl)).map(lbl => (
                                                            <button
                                                                key={lbl}
                                                                type="button"
                                                                onClick={() => toggleOption(spec._id, lbl)}
                                                                className="text-xs px-2.5 py-1 rounded-lg border font-bold bg-zg-accent text-black border-zg-accent flex items-center gap-1"
                                                            >
                                                                {lbl}
                                                                <X size={10} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {/* Add custom value input */}
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Add custom value..."
                                                            className="flex-1 text-xs bg-zg-bg border border-zg-secondary/20 rounded-lg px-3 py-1.5 focus:border-zg-accent outline-none transition-all"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    const val = e.target.value.trim();
                                                                    if (val && !enabledOptions.includes(val)) {
                                                                        toggleOption(spec._id, val);
                                                                    }
                                                                    e.target.value = '';
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                const input = e.currentTarget.previousSibling;
                                                                const val = input.value.trim();
                                                                if (val && !enabledOptions.includes(val)) {
                                                                    toggleOption(spec._id, val);
                                                                }
                                                                input.value = '';
                                                            }}
                                                            className="text-xs px-3 py-1.5 bg-zg-secondary/10 hover:bg-zg-accent hover:text-black rounded-lg font-bold transition-all flex items-center gap-1"
                                                        >
                                                            <Plus size={12} /> Add
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Product Colors Section */}
                    <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-heading font-bold">Product Colors & Galleries</h2>
                            <button
                                type="button"
                                onClick={addColor}
                                className="flex items-center gap-2 px-4 py-2 bg-zg-accent text-black rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20"
                            >
                                <Plus className="w-4 h-4" />
                                Add Color
                            </button>
                        </div>

                        <div className="space-y-8">
                            {formData.colors.map((color, colorIndex) => (
                                <div key={colorIndex} className="p-6 rounded-xl bg-zg-surface border border-zg-secondary/10 space-y-4 relative group">
                                    <button
                                        type="button"
                                        onClick={() => removeColor(colorIndex)}
                                        className="absolute top-4 right-4 p-2 text-zg-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-zg-secondary text-xs mb-1 block uppercase tracking-wider">Color Name</label>
                                            <input
                                                type="text"
                                                value={color.name}
                                                onChange={(e) => handleColorChange(colorIndex, 'name', e.target.value)}
                                                placeholder="e.g. Midnight Black"
                                                className="w-full px-4 py-2.5 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-zg-secondary text-xs mb-1 block uppercase tracking-wider">Hex Color (Optional)</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="color"
                                                    value={color.hex || '#000000'}
                                                    onChange={(e) => handleColorChange(colorIndex, 'hex', e.target.value)}
                                                    className="w-10 h-10 rounded bg-transparent border-none cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={color.hex}
                                                    onChange={(e) => handleColorChange(colorIndex, 'hex', e.target.value)}
                                                    placeholder="#000000"
                                                    className="flex-1 px-4 py-2 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent transition"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-zg-secondary text-xs mb-2 block uppercase tracking-wider">Color Specific Gallery</label>
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={(e) => handleColorGallerySelect(colorIndex, e)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="w-full px-4 py-6 rounded-lg bg-zg-surface border-2 border-dashed border-zg-secondary/20 text-zg-secondary flex flex-col items-center justify-center gap-2 hover:border-zg-accent hover:text-zg-primary transition-colors">
                                                    <Upload className="w-6 h-6 opacity-50" />
                                                    <span className="text-sm font-medium">Upload images for this color</span>
                                                </div>
                                            </div>

                                            {color.gallery.length > 0 && (
                                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                                    {color.gallery.map((img, imgIndex) => (
                                                        <div key={imgIndex} className="relative aspect-square rounded-lg bg-zg-surface border border-zg-secondary/10 overflow-hidden group/img">
                                                            <img src={getImageUrl(img)} alt={`${color.name} ${imgIndex}`} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeColorGalleryImage(colorIndex, imgIndex)}
                                                                className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-all"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {formData.colors.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-zg-secondary/10 rounded-2xl">
                                    <p className="text-zg-secondary text-sm">No colors added yet. Click "Add Color" to start.</p>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Front Page Customization Section */}
                    <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-heading font-bold">Front Page Customization</h2>
                                <p className="text-zg-secondary text-sm mt-1">Define what information customers should provide for the album cover</p>
                            </div>
                            <button
                                type="button"
                                onClick={addFrontPageOption}
                                className="flex items-center gap-2 px-4 py-2 bg-zg-accent/10 text-zg-accent rounded-lg hover:bg-zg-accent/20 transition-colors text-sm font-bold"
                            >
                                <Plus className="w-4 h-4" />
                                Add Option
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.frontPageOptions.map((option, index) => (
                                <div key={option.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-zg-bg/50 border border-zg-secondary/5 items-center">
                                    <div className="md:col-span-5">
                                        <input
                                            type="text"
                                            placeholder="Option Label (e.g. Wedding Date)"
                                            value={option.label}
                                            onChange={(e) => updateFrontPageOption(option.id, { label: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent transition text-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-3">
                                        <select
                                            value={option.type}
                                            onChange={(e) => updateFrontPageOption(option.id, { type: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent transition text-sm"
                                        >
                                            <option value="text">Text Input</option>
                                            <option value="date">Date Picker</option>
                                            <option value="image">Image Upload</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`req-${option.id}`}
                                            checked={option.required}
                                            onChange={(e) => updateFrontPageOption(option.id, { required: e.target.checked })}
                                            className="w-4 h-4 rounded border-zg-secondary/20 text-zg-accent focus:ring-zg-accent"
                                        />
                                        <label htmlFor={`req-${option.id}`} className="text-xs text-zg-secondary">Required</label>
                                    </div>
                                    <div className="md:col-span-2 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeFrontPageOption(option.id)}
                                            className="p-2 text-zg-secondary hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {formData.frontPageOptions.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-zg-secondary/10 rounded-xl">
                                    <p className="text-zg-secondary text-sm">No customization options added yet.</p>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="px-6 py-3 rounded-lg text-zg-secondary hover:text-zg-primary hover:bg-zg-secondary/10 transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-zg-accent text-black font-bold rounded-lg hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default ProductForm;
