import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('https://zerogravity-backend.vercel.app/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zg-bg text-zg-primary p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-heading font-bold mb-2">Shop</h1>
                        <p className="text-zg-secondary">Select a product to start your order.</p>
                    </div>
                    <button
                        onClick={() => navigate('/my-orders')}
                        className="flex items-center gap-2 px-6 py-3 bg-zg-surface border border-zg-secondary/10 rounded-xl hover:border-zg-accent transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span>My Orders</span>
                    </button>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zg-accent"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl overflow-hidden group hover:border-zg-accent/50 transition-all duration-300">
                                <div className="aspect-[4/3] overflow-hidden bg-zg-secondary/5 relative">
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zg-secondary">
                                            <ShoppingBag className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                        <button
                                            onClick={() => navigate(`/shop/${product._id}`)}
                                            className="w-full py-3 bg-zg-accent text-black font-bold rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-heading font-bold mb-2">{product.name}</h3>
                                    <p className="text-zg-secondary text-sm line-clamp-2">{product.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
