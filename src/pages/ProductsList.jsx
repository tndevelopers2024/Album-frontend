import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Package, Search, Plus, Edit, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`https://zerogravity-backend.vercel.app/api/products/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchProducts();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout title="Products Management">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zg-secondary" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-zg-surface/50 border border-zg-secondary/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-zg-primary placeholder-zg-secondary/50 focus:outline-none focus:border-zg-accent/50 focus:ring-1 focus:ring-zg-accent/50 transition-all"
                        />
                    </div>

                    <button
                        onClick={() => navigate('/admin/products/new')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-zg-accent text-black rounded-xl text-sm font-bold uppercase tracking-wide hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Product</span>
                    </button>
                </div>
            </div>

            {/* Products List */}
            <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-zg-secondary/10 border-b border-zg-secondary/10">
                    <div className="col-span-8 text-xs font-bold text-zg-secondary uppercase tracking-wider">Product</div>
                    <div className="col-span-4 text-xs font-bold text-zg-secondary uppercase tracking-wider text-right">Actions</div>
                </div>

                <div className="divide-y divide-zg-secondary/10">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-zg-secondary/10 transition-all duration-200 group"
                        >
                            <div className="col-span-8 flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-zg-secondary/10 flex items-center justify-center text-zg-primary font-bold text-sm flex-shrink-0 overflow-hidden">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="w-6 h-6 text-zg-secondary" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-zg-primary truncate">{product.name}</h3>
                                    <p className="text-xs text-zg-secondary truncate max-w-[300px]">{product.description}</p>
                                    {product.gallery && product.gallery.length > 0 && (
                                        <p className="text-xs text-zg-accent mt-1">{product.gallery.length} images in gallery</p>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-4 flex items-center justify-end gap-2">
                                <button
                                    onClick={() => navigate(`/admin/products/${product._id}`)}
                                    className="p-2 text-zg-secondary hover:text-zg-primary hover:bg-zg-secondary/10 rounded-lg transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="p-2 text-zg-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            {filteredProducts.length === 0 && !loading && (
                <div className="bg-zg-surface/50 backdrop-blur-xl border border-zg-secondary/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center mt-6">
                    <div className="w-16 h-16 bg-zg-secondary/10 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag className="w-8 h-8 opacity-50 text-zg-secondary" />
                    </div>
                    <p className="text-lg font-medium text-zg-primary mb-2">No products found</p>
                    <p className="text-sm text-zg-secondary">
                        Get started by adding a new product.
                    </p>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ProductsList;
