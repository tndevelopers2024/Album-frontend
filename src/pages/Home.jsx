import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Truck, Palette, ChevronRight, BookOpen, Heart } from 'lucide-react';
import API_ENDPOINTS from '../api';
import { getImageUrl } from '../utils/imageUtils';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
    })
};

const features = [
    {
        icon: <BookOpen className="w-7 h-7" />,
        title: 'Premium Craftsmanship',
        desc: 'Every album is handcrafted with archival-quality materials built to last generations.'
    },
    {
        icon: <Palette className="w-7 h-7" />,
        title: 'Fully Customisable',
        desc: 'Choose your size, cover, layout, and finish. Each album is uniquely yours.'
    },
    {
        icon: <Truck className="w-7 h-7" />,
        title: 'Pan-India Delivery',
        desc: 'Carefully packed and delivered across India. Your memories arrive safely, every time.'
    },
    {
        icon: <Shield className="w-7 h-7" />,
        title: 'Quality Guaranteed',
        desc: 'We stand behind every product. If you\'re not happy, we make it right.'
    },
];

const testimonials = [
    {
        name: 'Priya Sharma',
        location: 'Chennai',
        text: 'The wedding album Zero Gravity made for us is absolutely stunning. Every page tells our story perfectly.',
        rating: 5,
    },
    {
        name: 'Arjun & Meera',
        location: 'Bangalore',
        text: 'We ordered a custom photo book for our anniversary — the quality is unmatched. Worth every rupee.',
        rating: 5,
    },
    {
        name: 'Kavitha Rajan',
        location: 'Mumbai',
        text: 'From ordering to delivery, the experience was seamless. The album exceeded all our expectations.',
        rating: 5,
    },
];

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(API_ENDPOINTS.PRODUCTS)
            .then(r => r.json())
            .then(data => setFeaturedProducts(data.slice(0, 12)))
            .catch(() => {});
    }, []);

    return (
        <div className="bg-zg-bg text-zg-primary overflow-x-hidden">

            {/* ── Hero ── */}
            <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-zg-bg via-zg-surface to-zg-bg" />
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, var(--color-zg-accent) 0%, transparent 50%),
                                          radial-gradient(circle at 80% 20%, var(--color-zg-accent) 0%, transparent 40%)`
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={0}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zg-accent/30 bg-zg-accent/5 text-zg-accent text-sm font-medium mb-8"
                    >
                        <Star className="w-4 h-4 fill-zg-accent" />
                        Chennai's Premier Photo Album Studio
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={1}
                        className="text-5xl md:text-7xl font-heading font-bold leading-tight mb-6"
                    >
                        Memories That
                        <br />
                        <span className="text-zg-accent">Defy Gravity</span>
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={2}
                        className="text-lg md:text-xl text-zg-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Premium custom photo albums crafted to preserve your most treasured moments forever.
                        Weddings, portraits, milestones — beautifully bound.
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={3}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20 text-base"
                        >
                            Explore Albums
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/about"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-zg-surface border border-zg-secondary/20 text-zg-primary font-bold rounded-xl hover:border-zg-accent transition-all text-base"
                        >
                            Our Story
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </motion.div>

                    {/* Stats strip */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={5}
                        className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
                    >
                        {[
                            { value: '5000+', label: 'Albums Created' },
                            { value: '12+', label: 'Years Experience' },
                            { value: '4.9★', label: 'Customer Rating' },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <p className="text-2xl md:text-3xl font-heading font-bold text-zg-accent">{s.value}</p>
                                <p className="text-xs text-zg-secondary mt-1">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Why Zero Gravity ── */}
            <section className="py-24 bg-zg-surface/50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="text-center mb-16"
                    >
                        <p className="text-zg-accent text-sm font-bold uppercase tracking-widest mb-3">Why Choose Us</p>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold">Built Different,<br />Made to Last</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-8 hover:border-zg-accent/40 transition-all group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-zg-accent/10 flex items-center justify-center text-zg-accent mb-6 group-hover:bg-zg-accent group-hover:text-black transition-all">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-heading font-bold mb-3">{f.title}</h3>
                                <p className="text-zg-secondary text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Products ── */}
            {featuredProducts.length > 0 && (
                <section className="py-24">
                    {/* Header */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="max-w-7xl mx-auto px-6 flex items-end justify-between mb-10"
                    >
                        <div>
                            <p className="text-zg-accent text-sm font-bold uppercase tracking-widest mb-3">Our Collection</p>
                            <h2 className="text-4xl font-heading font-bold">Featured Albums</h2>
                        </div>
                        <Link
                            to="/shop"
                            className="flex items-center gap-2 text-sm font-bold text-zg-accent hover:gap-3 transition-all"
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    {/* Horizontal scroll track */}
                    <div className="flex gap-6 overflow-x-auto px-6 pb-4 max-w-7xl mx-auto"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {featuredProducts.map((product, i) => (
                            <motion.div
                                key={product._id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-50px' }}
                                variants={fadeUp}
                                custom={i * 0.5}
                                className="flex-shrink-0 w-72 group cursor-pointer"
                                onClick={() => navigate(`/shop/${product._id}`)}
                            >
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zg-surface mb-4 relative">
                                    {product.image || (product.gallery && product.gallery[0]) ? (
                                        <img
                                            src={getImageUrl(product.image || product.gallery[0])}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zg-secondary">
                                            <BookOpen className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                                        <span className="text-white font-bold text-sm">View Details →</span>
                                    </div>
                                </div>
                                <h3 className="font-heading font-bold text-base mb-1 group-hover:text-zg-accent transition-colors line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="text-zg-secondary text-sm line-clamp-2 leading-relaxed">{product.description}</p>
                            </motion.div>
                        ))}

                        {/* End card — View All */}
                        <div className="flex-shrink-0 w-56 flex flex-col items-center justify-center gap-4 bg-zg-surface border border-zg-accent/20 rounded-2xl p-8 text-center">
                            <p className="font-heading font-bold text-zg-primary text-sm leading-snug">See Our Full Collection</p>
                            <Link
                                to="/shop"
                                onClick={e => e.stopPropagation()}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zg-accent text-black text-sm font-bold rounded-xl hover:bg-zg-accent-hover transition-all"
                            >
                                Shop Now <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Testimonials ── */}
            <section className="py-24 bg-zg-surface/50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="text-center mb-16"
                    >
                        <p className="text-zg-accent text-sm font-bold uppercase tracking-widest mb-3">Testimonials</p>
                        <h2 className="text-4xl font-heading font-bold">Loved by Families<br />Across India</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-8"
                            >
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: t.rating }).map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-zg-accent text-zg-accent" />
                                    ))}
                                </div>
                                <p className="text-zg-secondary text-sm leading-relaxed mb-6">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zg-accent/20 flex items-center justify-center text-zg-accent font-bold">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{t.name}</p>
                                        <p className="text-xs text-zg-secondary">{t.location}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                        className="bg-zg-surface border border-zg-accent/20 rounded-3xl p-12 md:p-16 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 opacity-5"
                            style={{
                                backgroundImage: `radial-gradient(circle at 50% 50%, var(--color-zg-accent) 0%, transparent 70%)`
                            }}
                        />
                        <div className="relative">
                            <Heart className="w-10 h-10 text-zg-accent mx-auto mb-6" />
                            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                                Ready to Preserve<br />Your Story?
                            </h2>
                            <p className="text-zg-secondary mb-10 text-lg">
                                Browse our collection of premium albums and start your custom order today.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 px-10 py-4 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20 text-base"
                            >
                                Shop Albums <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default Home;
