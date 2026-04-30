import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Heart, Award, Users, MapPin, Phone, Mail } from 'lucide-react';
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

const values = [
    {
        icon: <BookOpen className="w-6 h-6" />,
        title: 'Craftsmanship',
        desc: 'Every album is assembled by hand using premium materials. We never cut corners on quality.'
    },
    {
        icon: <Heart className="w-6 h-6" />,
        title: 'Personal Touch',
        desc: 'Your memories are unique. We work closely with every client to bring their vision to life.'
    },
    {
        icon: <Award className="w-6 h-6" />,
        title: 'Excellence',
        desc: 'We hold ourselves to the highest standard — in materials, printing, binding, and service.'
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: 'Community',
        desc: 'We are a Chennai-born studio proud to serve families and photographers across India.'
    },
];

const AboutUs = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch(API_ENDPOINTS.PRODUCTS)
            .then(r => r.json())
            .then(data => setProducts(data))
            .catch(() => {});
    }, []);

    // Collect unique images from products (image + gallery)
    const albumImages = products.flatMap(p => {
        const imgs = [];
        if (p.image) imgs.push(p.image);
        if (p.gallery?.length) imgs.push(...p.gallery);
        return imgs;
    }).filter(Boolean).slice(0, 8);

    return (
        <div className="bg-zg-bg text-zg-primary">

            {/* ── Hero ── */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: `radial-gradient(circle at 70% 50%, var(--color-zg-accent) 0%, transparent 50%)` }}
                />
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text */}
                        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                            <p className="text-zg-accent text-sm font-bold uppercase tracking-widest mb-4">About Us</p>
                            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                                We Preserve the Moments<br />
                                <span className="text-zg-accent">That Matter Most</span>
                            </h1>
                            <p className="text-zg-secondary text-lg leading-relaxed">
                                Albums by Zero Gravity is a Chennai-based photo album studio dedicated to turning your photographs into timeless keepsakes. For over a decade, we have helped thousands of families, couples, and photographers preserve their most meaningful memories.
                            </p>
                        </motion.div>

                        {/* Hero image collage */}
                        {albumImages.length >= 2 && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeUp}
                                custom={1}
                                className="relative h-96 hidden lg:block"
                            >
                                <div className="absolute top-0 left-0 w-56 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-zg-bg z-10">
                                    <img src={getImageUrl(albumImages[0])} alt="Album" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute top-16 left-44 w-56 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-zg-bg z-20">
                                    <img src={getImageUrl(albumImages[1])} alt="Album" className="w-full h-full object-cover" />
                                </div>
                                {albumImages[2] && (
                                    <div className="absolute top-36 left-8 w-40 h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-zg-bg z-30">
                                        <img src={getImageUrl(albumImages[2])} alt="Album" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                {/* Accent dot */}
                                <div className="absolute bottom-8 right-0 w-24 h-24 rounded-full bg-zg-accent/10 border border-zg-accent/20" />
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Story ── */}
            <section className="py-20 bg-zg-surface/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Story text */}
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <p className="text-zg-accent text-sm font-bold uppercase tracking-widest mb-4">Our Story</p>
                            <h2 className="text-4xl font-heading font-bold mb-6">Born in Chennai,<br />Trusted Across India</h2>
                            <div className="space-y-5 text-zg-secondary leading-relaxed">
                                <p>Zero Gravity was founded with a simple belief: every photograph deserves a proper home. Digital photos fade from memory, but a beautifully crafted album lasts forever.</p>
                                <p>We started as a small studio in Nungambakkam, Chennai, serving local photographers and wedding clients. Word spread quickly — our attention to detail, material quality, and personalised service set us apart.</p>
                                <p>Today we serve clients across India, offering a range of fully customisable albums from wedding photo books to family portraits, corporate gifts, and graduation memories.</p>
                            </div>

                            {/* Stats inline */}
                            <div className="grid grid-cols-2 gap-4 mt-10">
                                {[
                                    { value: '5000+', label: 'Albums Delivered' },
                                    { value: '12+', label: 'Years in Business' },
                                    { value: '1000+', label: 'Happy Clients' },
                                    { value: '4.9★', label: 'Average Rating' },
                                ].map((s) => (
                                    <div key={s.label} className="bg-zg-surface border border-zg-secondary/10 rounded-xl p-5 text-center">
                                        <p className="text-2xl font-heading font-bold text-zg-accent mb-1">{s.value}</p>
                                        <p className="text-xs text-zg-secondary">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Story image grid */}
                        {albumImages.length >= 4 ? (
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={1}
                                className="grid grid-cols-2 gap-3"
                            >
                                <div className="space-y-3">
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zg-surface">
                                        <img src={getImageUrl(albumImages[3])} alt="Album" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="aspect-square rounded-2xl overflow-hidden bg-zg-surface">
                                        <img src={getImageUrl(albumImages[4] || albumImages[0])} alt="Album" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div className="space-y-3 pt-6">
                                    <div className="aspect-square rounded-2xl overflow-hidden bg-zg-surface">
                                        <img src={getImageUrl(albumImages[5] || albumImages[1])} alt="Album" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zg-surface">
                                        <img src={getImageUrl(albumImages[6] || albumImages[2])} alt="Album" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* Fallback if fewer images */
                            albumImages.slice(0, 2).map((img, i) => (
                                <motion.div
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeUp}
                                    custom={i + 1}
                                    className="rounded-2xl overflow-hidden aspect-[4/3] bg-zg-surface"
                                >
                                    <img src={getImageUrl(img)} alt="Album" className="w-full h-full object-cover" />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ── Gallery Strip ── */}
            {albumImages.length >= 4 && (
                <section className="py-16 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 mb-8">
                        <motion.p
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            className="text-zg-accent text-sm font-bold uppercase tracking-widest text-center"
                        >
                            Our Work
                        </motion.p>
                    </div>
                    <div className="flex gap-4 px-6 overflow-x-auto pb-2 scrollbar-hide max-w-7xl mx-auto">
                        {albumImages.map((img, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i * 0.5}
                                className="flex-shrink-0 w-52 h-64 rounded-2xl overflow-hidden bg-zg-surface border border-zg-secondary/10"
                            >
                                <img
                                    src={getImageUrl(img)}
                                    alt={`Album ${i + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </motion.div>
                        ))}
                        <div className="flex-shrink-0 w-52 h-64 rounded-2xl overflow-hidden bg-zg-surface border border-zg-accent/20 flex flex-col items-center justify-center gap-3">
                            <p className="text-sm font-bold text-zg-primary text-center px-4">See Our Full Collection</p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zg-accent text-black text-sm font-bold rounded-lg hover:bg-zg-accent-hover transition-all"
                            >
                                Shop Now <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Values ── */}
            <section className="py-24 bg-zg-surface/50">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
                        <p className="text-zg-accent text-sm font-bold uppercase tracking-widest mb-3">What We Stand For</p>
                        <h2 className="text-4xl font-heading font-bold">Our Values</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-8 hover:border-zg-accent/40 transition-all group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-zg-accent/10 flex items-center justify-center text-zg-accent mb-5 group-hover:bg-zg-accent group-hover:text-black transition-all">
                                    {v.icon}
                                </div>
                                <h3 className="font-heading font-bold text-lg mb-3">{v.title}</h3>
                                <p className="text-zg-secondary text-sm leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact Strip ── */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { icon: <MapPin className="w-5 h-5" />, label: 'Visit Us', value: '40, Josier St, Tirumurthy Nagar, Nungambakkam, Chennai 600034' },
                            { icon: <Phone className="w-5 h-5" />, label: 'Call Us', value: '+91 988 4445 100', href: 'tel:+919884445100' },
                            { icon: <Mail className="w-5 h-5" />, label: 'Email Us', value: 'info@zerogravityalbums.com', href: 'mailto:info@zerogravityalbums.com' },
                        ].map((c) => (
                            <div key={c.label} className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-8 flex gap-5 items-start">
                                <div className="w-12 h-12 rounded-xl bg-zg-accent/10 flex items-center justify-center text-zg-accent flex-shrink-0">
                                    {c.icon}
                                </div>
                                <div>
                                    <p className="text-xs text-zg-secondary uppercase tracking-widest font-bold mb-1">{c.label}</p>
                                    {c.href ? (
                                        <a href={c.href} className="text-zg-primary hover:text-zg-accent transition-colors text-sm">{c.value}</a>
                                    ) : (
                                        <p className="text-zg-primary text-sm">{c.value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <Link to="/shop" className="inline-flex items-center gap-2 px-10 py-4 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20">
                            Shop Our Albums <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default AboutUs;
