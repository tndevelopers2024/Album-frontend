import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('features');
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`https://zerogravity-backend.vercel.app/api/products/${productId}`);
            const data = await response.json();
            setProduct(data);
            setMainImage(data.image);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
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

    const allImages = [product.image, ...(product.gallery || [])].filter(Boolean);

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
                                <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zg-secondary">
                                    <ShoppingBag className="w-16 h-16 opacity-20" />
                                </div>
                            )}

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
                                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
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
