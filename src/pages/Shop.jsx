import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, ArrowRight, BookOpen, SlidersHorizontal, X, Heart } from 'lucide-react';
import API_ENDPOINTS from '../api';
import { getImageUrl } from '../utils/imageUtils';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' }
    })
};

const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'name_asc', label: 'Name: A → Z' },
    { value: 'name_desc', label: 'Name: Z → A' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
];

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('featured');
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        
        const fetchInitialData = async () => {
            try {
                const [productsRes, favsRes] = await Promise.all([
                    fetch(API_ENDPOINTS.PRODUCTS),
                    (user && user.id) ? fetch(API_ENDPOINTS.FAVORITES(user.id)) : Promise.resolve({ ok: true, json: () => [] })
                ]);
                
                const productsData = await productsRes.json();
                const favsData = user ? await favsRes.json() : [];
                
                setProducts(productsData);
                setFavorites(favsData.map(f => f._id));
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleToggleFavorite = async (e, productId) => {
        e.stopPropagation();
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
            const data = await res.json();
            if (res.ok) {
                setFavorites(data.favorites);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Pre-select category from URL param (e.g. /shop?category=Premium+Series)
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) {
            setActiveCategory(cat);
            setShowFilters(true);
        }
    }, [searchParams]);

    const categories = useMemo(() => {
        const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
        return ['All', ...cats];
    }, [products]);

    const filtered = useMemo(() => {
        let result = products.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                (p.description || '').toLowerCase().includes(search.toLowerCase());
            const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
            return matchesSearch && matchesCategory;
        });

        switch (sortBy) {
            case 'name_asc':
                result = [...result].sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                result = [...result].sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price_asc':
                result = [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
                break;
            case 'price_desc':
                result = [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
                break;
            case 'newest':
                result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                break;
        }

        return result;
    }, [products, search, activeCategory, sortBy]);

    const hasActiveFilters = search !== '' || activeCategory !== 'All' || sortBy !== 'featured';

    const clearFilters = () => {
        setSearch('');
        setActiveCategory('All');
        setSortBy('featured');
    };

    return (
        <div className="min-h-screen bg-zg-bg text-zg-primary">

            {/* Hero Banner */}
            <section className="relative bg-zg-surface border-b border-zg-secondary/10 py-16 md:py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: `radial-gradient(circle at 80% 50%, var(--color-zg-accent) 0%, transparent 50%)` }}
                />
                <div className="relative max-w-7xl mx-auto px-6">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                        <p className="text-zg-accent text-sm font-bold uppercase tracking-widest mb-3">Our Collection</p>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Shop Albums</h1>
                        <p className="text-zg-secondary text-lg max-w-xl">
                            Browse our range of premium custom photo albums. Select a product to begin your personalised order.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters Bar */}
            <div className="max-w-7xl mx-auto px-6 py-6 border-b border-zg-secondary/10">
                {/* Row: Search + Filter icon + Sort */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    {/* Search */}
                    <div className="relative flex-1 sm:max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zg-secondary pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search albums..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-zg-surface border border-zg-secondary/10 rounded-xl text-zg-primary text-sm placeholder:text-zg-secondary/50 focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                        {/* Filter toggle icon */}
                        {!loading && categories.length > 1 && (
                            <button
                                onClick={() => setShowFilters(v => !v)}
                                title="Toggle category filters"
                                className={`relative p-2.5 rounded-xl border transition-all ${
                                    showFilters || activeCategory !== 'All'
                                        ? 'bg-zg-accent text-black border-zg-accent'
                                        : 'bg-zg-surface border-zg-secondary/10 text-zg-secondary hover:border-zg-accent/50 hover:text-zg-primary'
                                }`}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                {activeCategory !== 'All' && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-zg-accent border-2 border-zg-bg" />
                                )}
                            </button>
                        )}

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="py-2.5 pl-3 pr-8 bg-zg-surface border border-zg-secondary/10 rounded-xl text-zg-primary text-sm focus:outline-none focus:border-zg-accent transition-all cursor-pointer appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
                        >
                            {SORT_OPTIONS.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>

                        {/* Clear all */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-zg-secondary hover:text-red-500 hover:bg-red-500/10 border border-zg-secondary/10 hover:border-red-500/20 transition-all"
                            >
                                <X className="w-3.5 h-3.5" />
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Category chips — visible only when showFilters is true */}
                {showFilters && !loading && categories.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-zg-secondary/10"
                    >
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                                    activeCategory === cat
                                        ? 'bg-zg-accent text-black border-zg-accent'
                                        : 'bg-zg-surface border-zg-secondary/10 text-zg-secondary hover:border-zg-accent/50 hover:text-zg-primary'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* Result count */}
                {!loading && (
                    <p className="text-xs text-zg-secondary mt-3">
                        {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
                        {activeCategory !== 'All' && <span className="ml-1">in <span className="text-zg-accent font-medium">{activeCategory}</span></span>}
                    </p>
                )}
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-6 py-10 pb-24">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-zg-surface border border-zg-secondary/10 rounded-2xl overflow-hidden animate-pulse">
                                <div className="aspect-[4/3] bg-zg-secondary/10" />
                                <div className="p-6 space-y-3">
                                    <div className="h-5 bg-zg-secondary/10 rounded w-2/3" />
                                    <div className="h-4 bg-zg-secondary/10 rounded w-full" />
                                    <div className="h-4 bg-zg-secondary/10 rounded w-4/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <BookOpen className="w-16 h-16 text-zg-secondary/20 mx-auto mb-6" />
                        <h3 className="text-xl font-heading font-bold mb-2">No products found</h3>
                        <p className="text-zg-secondary text-sm mb-6">
                            {search
                                ? `No results for "${search}".`
                                : activeCategory !== 'All'
                                ? `No products in "${activeCategory}".`
                                : 'No products available right now.'}
                        </p>
                        {hasActiveFilters && (
                            <button onClick={clearFilters} className="text-sm text-zg-accent hover:underline">
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map((product, i) => (
                            <motion.div
                                key={product._id}
                                initial="hidden"
                                animate="visible"
                                variants={fadeUp}
                                custom={i}
                                className="group bg-zg-surface border border-zg-secondary/10 rounded-2xl overflow-hidden hover:border-zg-accent/50 hover:shadow-xl hover:shadow-zg-accent/5 transition-all duration-300 cursor-pointer"
                                onClick={() => navigate(`/shop/${product._id}`)}
                            >
                                <div className="aspect-[4/3] overflow-hidden bg-zg-secondary/5 relative">
                                    {product.image || (product.gallery && product.gallery[0]) ? (
                                        <img
                                            src={getImageUrl(product.image || product.gallery[0])}
                                            alt={product.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag className="w-12 h-12 text-zg-secondary opacity-20" />
                                        </div>
                                    )}
                                    {product.category && (
                                        <div className="absolute top-3 left-3">
                                            <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                                {product.category}
                                            </span>
                                        </div>
                                    )}
                                    {/* Favorite Toggle */}
                                    <button
                                        onClick={(e) => handleToggleFavorite(e, product._id)}
                                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all z-10 ${
                                            favorites.includes(product._id)
                                                ? 'bg-zg-accent text-black border-zg-accent shadow-lg shadow-zg-accent/20'
                                                : 'bg-black/20 text-white border-white/20 hover:bg-white/20'
                                        }`}
                                    >
                                        <Heart className={`w-4 h-4 ${favorites.includes(product._id) ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                                <div className="p-6">
                                    {product.category && (
                                        <p className="text-xs uppercase tracking-widest text-zg-accent font-bold mb-2">{product.category}</p>
                                    )}
                                    <h3 className="text-lg font-heading font-bold mb-2 group-hover:text-zg-accent transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-zg-secondary text-sm line-clamp-2 leading-relaxed">
                                        {product.description || 'Premium custom photo album crafted to preserve your memories.'}
                                    </p>
                                    <div className="mt-5 flex items-center justify-end">
                                        <div className="w-8 h-8 rounded-full bg-zg-accent/10 flex items-center justify-center text-zg-accent group-hover:bg-zg-accent group-hover:text-black transition-all">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
