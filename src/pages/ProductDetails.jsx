import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ShoppingBag, Heart } from 'lucide-react';
import API_ENDPOINTS from '../api';
import { getImageUrl } from '../utils/imageUtils';

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('features');
    const [mainImage, setMainImage] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const [productRes, favsRes] = await Promise.all([
                fetch(API_ENDPOINTS.PRODUCT_BY_ID(productId)),
                (user && user.id) ? fetch(API_ENDPOINTS.FAVORITES(user.id)) : Promise.resolve({ ok: true, json: () => [] })
            ]);

            const data = await productRes.json();
            const favs = user ? await favsRes.json() : [];

            setProduct(data);
            setIsFavorite(favs.some(f => f._id === productId));
            
            // Set default view
            if (data.colors && data.colors.length > 0) {
                const firstColor = data.colors[0];
                setSelectedColor(firstColor);
                setMainImage(firstColor.gallery && firstColor.gallery.length > 0 ? firstColor.gallery[0] : (data.image || ''));
            } else {
                setMainImage(data.image || (data.gallery && data.gallery[0]) || '');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(API_ENDPOINTS.TOGGLE_FAVORITE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, productId })
            });
            if (res.ok) {
                setIsFavorite(!isFavorite);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-zg-bg text-zg-primary">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zg-accent"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-zg-bg text-zg-primary">
            Product not found
        </div>
    );

    const colorImages = selectedColor ? (selectedColor.gallery || []) : [];
    const baseImages = [product.image, ...(product.gallery || [])].filter(Boolean);
    const allImages = colorImages.length > 0 ? colorImages : baseImages;

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        if (color.gallery && color.gallery.length > 0) {
            setMainImage(color.gallery[0]);
        } else {
            setMainImage(product.image || (product.gallery && product.gallery[0]) || '');
        }
    };

    return (
        <div className="min-h-screen bg-zg-bg text-zg-primary">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-zg-secondary">
                <Link to="/" className="hover:text-zg-primary transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/shop" className="hover:text-zg-primary transition-colors">Shop</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-zg-primary font-medium">{product.name}</span>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Gallery */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="aspect-[4/3] bg-zg-surface/50 rounded-2xl overflow-hidden border border-zg-secondary/10 relative group">
                            {mainImage ? (
                                <img src={getImageUrl(mainImage)} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zg-secondary">
                                    <ShoppingBag className="w-16 h-16 opacity-20" />
                                </div>
                            )}

                            {/* Favorite Toggle */}
                            <button
                                onClick={handleToggleFavorite}
                                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md border transition-all z-10 ${
                                    isFavorite
                                        ? 'bg-zg-accent text-black border-zg-accent shadow-lg shadow-zg-accent/20'
                                        : 'bg-black/20 text-white border-white/20 hover:bg-white/20'
                                }`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>

                            {/* Navigation Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => {
                                            const currentIndex = allImages.indexOf(mainImage);
                                            const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
                                            setMainImage(allImages[prevIndex]);
                                        }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentIndex = allImages.indexOf(mainImage);
                                            const nextIndex = (currentIndex + 1) % allImages.length;
                                            setMainImage(allImages[nextIndex]);
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMainImage(img)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${mainImage === img ? 'border-zg-accent' : 'border-transparent hover:border-zg-secondary/30'
                                            }`}
                                    >
                                        <img src={getImageUrl(img)} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-heading font-bold mb-4">{product.name}</h1>
                            <p className="text-zg-secondary leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="space-y-4 pt-6 border-t border-zg-secondary/10">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-zg-secondary">Select Color</h3>
                                <div className="flex flex-wrap gap-4">
                                    {product.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleColorSelect(color)}
                                            className={`group flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${selectedColor?.name === color.name ? 'border-zg-accent bg-zg-accent/5' : 'border-zg-secondary/10 hover:border-zg-secondary/30'}`}
                                        >
                                            <div 
                                                className="w-10 h-10 rounded-full border border-black/10 shadow-inner"
                                                style={{ backgroundColor: color.hex || '#ccc' }}
                                            />
                                            <span className={`text-xs font-medium ${selectedColor?.name === color.name ? 'text-zg-primary' : 'text-zg-secondary'}`}>{color.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-8 border-t border-zg-secondary/10 space-y-8">
                            <button
                                onClick={() => {
                                    const user = JSON.parse(localStorage.getItem('user'));
                                    if (user) {
                                        navigate(`/shop/${productId}/customize`);
                                    } else {
                                        navigate('/login', { state: { from: `/shop/${productId}/customize` } });
                                    }
                                }}
                                className="w-full py-4 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20 text-lg uppercase tracking-wide"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-20">
                    <div className="flex items-center gap-8 border-b border-zg-secondary/10 mb-8">
                        <button
                            onClick={() => setActiveTab('features')}
                            className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'features' ? 'text-zg-accent' : 'text-zg-secondary hover:text-zg-primary'
                                }`}
                        >
                            Features
                            {activeTab === 'features' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zg-accent"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('specifications')}
                            className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'specifications' ? 'text-zg-accent' : 'text-zg-secondary hover:text-zg-primary'
                                }`}
                        >
                            Specifications
                            {activeTab === 'specifications' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zg-accent"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('benefits')}
                            className={`pb-4 text-lg font-bold transition-colors relative ${activeTab === 'benefits' ? 'text-zg-accent' : 'text-zg-secondary hover:text-zg-primary'
                                }`}
                        >
                            Benefits
                            {activeTab === 'benefits' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-zg-accent"></div>
                            )}
                        </button>
                    </div>

                    <div className="text-zg-secondary leading-relaxed">
                        {activeTab === 'features' ? (
                            product.features && product.features.length > 0 ? (
                                <ul className="list-disc list-inside space-y-2">
                                    {product.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No features listed.</p>
                            )
                        ) : activeTab === 'specifications' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(product?.specifications || []).map(({ spec, enabledOptions }) => {
                                    if (!spec) return null;
                                    const visibleOptions = enabledOptions?.length > 0
                                        ? enabledOptions.map(lbl => spec.options.find(o => o.label === lbl) || { label: lbl, price: 0 })
                                        : spec.options;
                                    return (
                                        <div key={spec._id} className="flex flex-col gap-2">
                                            <span className="text-xs font-bold text-zg-secondary uppercase">{spec.label}</span>
                                            <div className="flex flex-wrap gap-1">
                                                {visibleOptions.map((opt, i) => (
                                                    <span key={i} className="text-sm text-zg-primary bg-zg-surface px-2 py-1 rounded border border-zg-secondary/5">
                                                        {opt.label}
                                                        {opt.price > 0 && <span className="ml-1 text-[10px] text-zg-accent font-bold">+₹{opt.price}</span>}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                                {(!product?.specifications || product.specifications.length === 0) && (
                                    <p className="col-span-full py-10 text-center">Standard product specifications apply.</p>
                                )}
                            </div>
                        ) : (
                            product.benefits && product.benefits.length > 0 ? (
                                <ul className="list-disc list-inside space-y-2">
                                    {product.benefits.map((benefit, index) => (
                                        <li key={index}>{benefit}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No benefits listed.</p>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
