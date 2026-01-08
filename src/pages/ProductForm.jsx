import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import API_ENDPOINTS from '../api';
import getImageUrl from '../utils/imageUtils';

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
        price: '',
        boxPrice: '',
        frontPageOptions: {
            showFullNames: false,
            showInitials: false,
            showImage: false,
            showDate: false,
            showCustomText: false
        }
    });
    const [loading, setLoading] = useState(false);

    // Store file objects for deferred upload
    const [imageFile, setImageFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.PRODUCT_BY_ID(id));
            const data = await response.json();
            setFormData({
                name: data.name || '',
                description: data.description || '',
                image: data.image || '',
                gallery: data.gallery || [],
                features: data.features || [],
                benefits: data.benefits || [],
                price: data.price || '',
                boxPrice: data.boxPrice || '',
                frontPageOptions: data.frontPageOptions || {
                    showFullNames: false,
                    showInitials: false,
                    showImage: false,
                    showDate: false,
                    showCustomText: false
                }
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

            // Filter out empty strings from lists
            const cleanData = {
                ...formData,
                image: uploadedImagePath,
                gallery: uploadedGalleryPaths,
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
                            <div>
                                <label className="text-zg-secondary text-sm mb-2 block">Price *</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                    className="w-full px-4 py-3 rounded-xl bg-zg-surface border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-2 focus:ring-zg-accent/20 transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>

                            {/* Box/PAD Price */}
                            <div>
                                <label className="text-zg-secondary text-sm mb-2 block">Box/PAD Price *</label>
                                <input
                                    type="number"
                                    name="boxPrice"
                                    required
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
                                            onChange={handleGallerySelect}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-full px-4 py-8 rounded-lg bg-zg-surface border-2 border-dashed border-zg-secondary/20 text-zg-secondary flex flex-col items-center justify-center gap-2 hover:border-zg-accent hover:text-zg-primary transition-colors">
                                            <ImageIcon className="w-8 h-8 opacity-50" />
                                            <span className="font-medium">Click to upload gallery images</span>
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

                    {/* Front Page Customization Options */}
                    <div className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-8">
                        <h2 className="text-xl font-heading font-bold mb-6">Front Page Customization Options</h2>
                        <p className="text-sm text-zg-secondary mb-6">
                            Select which customization options customers can use for the album cover
                        </p>

                        <div className="space-y-6">
                            {/* Customization Checkboxes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="flex items-center gap-3 p-4 rounded-lg border border-zg-secondary/10 hover:border-zg-accent/30 cursor-pointer transition-all">
                                    <input
                                        type="checkbox"
                                        checked={formData.frontPageOptions.showFullNames}
                                        onChange={(e) => handleFrontPageOptionChange('showFullNames', e.target.checked)}
                                        className="w-5 h-5 rounded border-zg-secondary/20 text-zg-accent focus:ring-zg-accent focus:ring-offset-0"
                                    />
                                    <div>
                                        <div className="font-medium text-zg-primary">Full Names</div>
                                        <div className="text-xs text-zg-secondary">Allow customers to add full names on cover</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 rounded-lg border border-zg-secondary/10 hover:border-zg-accent/30 cursor-pointer transition-all">
                                    <input
                                        type="checkbox"
                                        checked={formData.frontPageOptions.showInitials}
                                        onChange={(e) => handleFrontPageOptionChange('showInitials', e.target.checked)}
                                        className="w-5 h-5 rounded border-zg-secondary/20 text-zg-accent focus:ring-zg-accent focus:ring-offset-0"
                                    />
                                    <div>
                                        <div className="font-medium text-zg-primary">Initials</div>
                                        <div className="text-xs text-zg-secondary">Allow customers to add initials on cover</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 rounded-lg border border-zg-secondary/10 hover:border-zg-accent/30 cursor-pointer transition-all">
                                    <input
                                        type="checkbox"
                                        checked={formData.frontPageOptions.showImage}
                                        onChange={(e) => handleFrontPageOptionChange('showImage', e.target.checked)}
                                        className="w-5 h-5 rounded border-zg-secondary/20 text-zg-accent focus:ring-zg-accent focus:ring-offset-0"
                                    />
                                    <div>
                                        <div className="font-medium text-zg-primary">Cover Image</div>
                                        <div className="text-xs text-zg-secondary">Allow customers to upload cover image</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 rounded-lg border border-zg-secondary/10 hover:border-zg-accent/30 cursor-pointer transition-all">
                                    <input
                                        type="checkbox"
                                        checked={formData.frontPageOptions.showDate}
                                        onChange={(e) => handleFrontPageOptionChange('showDate', e.target.checked)}
                                        className="w-5 h-5 rounded border-zg-secondary/20 text-zg-accent focus:ring-zg-accent focus:ring-offset-0"
                                    />
                                    <div>
                                        <div className="font-medium text-zg-primary">Event Date</div>
                                        <div className="text-xs text-zg-secondary">Allow customers to add event date</div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 rounded-lg border border-zg-secondary/10 hover:border-zg-accent/30 cursor-pointer transition-all">
                                    <input
                                        type="checkbox"
                                        checked={formData.frontPageOptions.showCustomText}
                                        onChange={(e) => handleFrontPageOptionChange('showCustomText', e.target.checked)}
                                        className="w-5 h-5 rounded border-zg-secondary/20 text-zg-accent focus:ring-zg-accent focus:ring-offset-0"
                                    />
                                    <div>
                                        <div className="font-medium text-zg-primary">Custom Text</div>
                                        <div className="text-xs text-zg-secondary">Allow customers to add custom text</div>
                                    </div>
                                </label>
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
