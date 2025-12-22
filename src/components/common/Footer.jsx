import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zg-surface border-t border-zg-secondary/10 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2 group">

                            <div className="flex flex-col w-40 bg-white p-2 rounded-xl">
                                <img src="/logo1.png" alt="Logo" />
                            </div>
                        </Link>
                        <p className="text-zg-secondary text-sm leading-relaxed">
                            Capturing moments that defy gravity. Premium photography services and custom photo albums designed to preserve your memories forever.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-zg-bg border border-zg-secondary/10 flex items-center justify-center text-zg-secondary hover:text-zg-accent hover:border-zg-accent transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-zg-bg border border-zg-secondary/10 flex items-center justify-center text-zg-secondary hover:text-zg-accent hover:border-zg-accent transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-zg-bg border border-zg-secondary/10 flex items-center justify-center text-zg-secondary hover:text-zg-accent hover:border-zg-accent transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-heading font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-zg-secondary hover:text-zg-accent transition-colors text-sm">Home</Link></li>
                            <li><Link to="/shop" className="text-zg-secondary hover:text-zg-accent transition-colors text-sm">Shop Albums</Link></li>
                            <li><Link to="/about" className="text-zg-secondary hover:text-zg-accent transition-colors text-sm">About Us</Link></li>
                            <li><Link to="/contact" className="text-zg-secondary hover:text-zg-accent transition-colors text-sm">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-heading font-bold text-lg mb-6">Services</h3>
                        <ul className="space-y-4">
                            <li><Link to="#" className="text-zg-secondary hover:text-zg-accent transition-colors text-sm">Wedding Photography</Link></li>
                            <li><Link to="#" className="text-zg-secondary hover:text-zg-accent transition-colors text-sm">Portrait Sessions</Link></li>
                            <li><Link to="#" className="text-zg-secondary hover:text-zg-accent transition-colors text-sm">Event Coverage</Link></li>
                            <li><Link to="#" className="text-zg-secondary hover:text-zg-accent transition-colors text-sm">Custom Photo Books</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-heading font-bold text-lg mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-zg-secondary">
                                <MapPin className="w-5 h-5 text-zg-accent shrink-0" />
                                <span>40, Josier St, Tirumurthy Nagar, Nungambakkam, Chennai 600034</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-zg-secondary">
                                <Phone className="w-5 h-5 text-zg-accent shrink-0" />
                                <a href="tel:+919884445100" className="hover:text-zg-accent transition-colors">+91 988 4445 100</a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-zg-secondary">
                                <Mail className="w-5 h-5 text-zg-accent shrink-0" />
                                <a href="mailto:info@zerogravityalbums.com" className="hover:text-zg-accent transition-colors">info@zerogravityalbums.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-zg-secondary/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-zg-secondary">
                        © {new Date().getFullYear()} Albums by Zero Gravity. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-zg-secondary">
                        <Link to="#" className="hover:text-zg-primary transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-zg-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
