import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        gallery: [],
        features: [],
        benefits: [],
        price: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [galleryUploading, setGalleryUploading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`https://zerogravity-backend.vercel.app/api/products/${id}`);
            const data = await response.json();
            setFormData({
                name: data.name || '',
                description: data.description || '',
                image: data.image || '',
                gallery: data.gallery || [],
                features: data.features || [],
                benefits: data.benefits || [],
                price: data.price || ''
            });
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
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
                setFormData(prev => ({ ...prev, image: data.imageUrl }));
            } else {
                alert('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setGalleryUploading(true);
        try {
            const newImages = [];
            for (const file of files) {
                const uploadData = new FormData();
                uploadData.append('image', file);

                const response = await fetch('https://zerogravity-backend.vercel.app/api/upload', {
                    method: 'POST',
                    body: uploadData
                });
                const data = await response.json();
                if (response.ok) {
                    newImages.push(data.imageUrl);
                }
            }
            setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...newImages] }));
        } catch (error) {
            console.error('Error uploading gallery images:', error);
            alert('Error uploading gallery images');
        } finally {
            setGalleryUploading(false);
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const url = isEditMode
            ? `https://zerogravity-backend.vercel.app/api/products/${id}`
            : 'https://zerogravity-backend.vercel.app/api/products';

        const method = isEditMode ? 'PUT' : 'POST';

        // Filter out empty strings from lists
        const cleanData = {
            ...formData,
            features: formData.features.filter(item => item.trim() !== ''),
            benefits: formData.benefits.filter(item => item.trim() !== '')
        };

        try {
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
                            <div className="md:col-span-2">
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
                            <div className="md:col-span-2">
                                <label className="text-zg-secondary text-sm mb-2 block">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter product price"
                                    className="w-full px-4 py-3 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition"
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
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    disabled={uploading}
                                                />
                                                <div className="w-full px-4 py-3 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-secondary flex items-center gap-2 hover:border-zg-accent transition-colors">
                                                    <Upload className="w-4 h-4" />
                                                    <span>{uploading ? 'Uploading...' : formData.image ? 'Change Image' : 'Upload Main Image'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {formData.image && (
                                            <div className="w-24 h-24 rounded-lg bg-zg-surface border border-zg-secondary/10 overflow-hidden flex-shrink-0 relative group">
                                                <img src={formData.image} alt="Main Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>

                                    {/* URL Option */}
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zg-secondary text-xs">OR</div>
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            placeholder="Paste image URL here"
                                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition placeholder:text-zg-secondary/30"
                                        />
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
                                            onChange={handleGalleryUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            disabled={galleryUploading}
                                        />
                                        <div className="w-full px-4 py-8 rounded-lg bg-zg-surface border-2 border-dashed border-zg-secondary/20 text-zg-secondary flex flex-col items-center justify-center gap-2 hover:border-zg-accent hover:text-zg-primary transition-colors">
                                            <ImageIcon className="w-8 h-8 opacity-50" />
                                            <span className="font-medium">{galleryUploading ? 'Uploading...' : 'Click to upload gallery images'}</span>
                                            <span className="text-xs opacity-50">Supports multiple files</span>
                                        </div>
                                    </div>

                                    {/* URL Option */}
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zg-secondary text-xs">OR</div>
                                            <input
                                                type="url"
                                                id="galleryUrlInput"
                                                placeholder="Paste image URL and click Add"
                                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition placeholder:text-zg-secondary/30"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const input = document.getElementById('galleryUrlInput');
                                                const url = input.value.trim();
                                                if (url) {
                                                    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
                                                    input.value = '';
                                                }
                                            }}
                                            className="px-6 py-3 bg-zg-accent/10 text-zg-accent rounded-lg hover:bg-zg-accent/20 transition-colors font-medium whitespace-nowrap"
                                        >
                                            Add URL
                                        </button>
                                    </div>

                                    {/* Gallery Grid */}
                                    {formData.gallery.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {formData.gallery.map((img, index) => (
                                                <div key={index} className="relative aspect-square rounded-lg bg-zg-surface border border-zg-secondary/10 overflow-hidden group">
                                                    <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
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
