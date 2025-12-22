import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-zg-bg py-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Get In Touch</h1>
                    <p className="text-zg-secondary text-lg">We'd love to hear from you. Send us a message!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-heading font-bold mb-8">Contact Information</h2>

                        <div className="space-y-6">
                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-zg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-6 h-6 text-zg-accent" />
                                </div>
                                <div>
                                    <p className="text-zg-secondary text-sm mb-1">Email</p>
                                    <a href="mailto:info@zerogravityalbums.com" className="text-zg-primary hover:text-zg-accent transition-colors">
                                        info@zerogravityalbums.com
                                    </a>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-zg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-6 h-6 text-zg-accent" />
                                </div>
                                <div>
                                    <p className="text-zg-secondary text-sm mb-1">Phone</p>
                                    <a href="tel:+919884445100" className="text-zg-primary hover:text-zg-accent transition-colors">
                                        +91 988 4445 100
                                    </a>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-zg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-zg-accent" />
                                </div>
                                <div>
                                    <p className="text-zg-secondary text-sm mb-1">Address</p>
                                    <p className="text-zg-primary">
                                        40, Josier St,<br />
                                        Tirumurthy Nagar,<br />
                                        Nungambakkam,<br />
                                        Chennai, Tamil Nadu 600034
                                    </p>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="pt-6 border-t border-zg-secondary/10">
                                <p className="text-zg-secondary text-sm mb-4">Follow Us</p>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 bg-zg-accent/10 rounded-lg flex items-center justify-center hover:bg-zg-accent hover:text-black transition-all">
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-zg-accent/10 rounded-lg flex items-center justify-center hover:bg-zg-accent hover:text-black transition-all">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-zg-accent/10 rounded-lg flex items-center justify-center hover:bg-zg-accent hover:text-black transition-all">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-zg-accent/10 rounded-lg flex items-center justify-center hover:bg-zg-accent hover:text-black transition-all">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="mt-8 rounded-xl overflow-hidden border border-zg-secondary/10">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.6234567890123!2d80.2345678!3d13.0456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAyJzQ0LjQiTiA4MMKwMTQnMDQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-zg-surface border border-zg-secondary/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-heading font-bold mb-8">Send Message</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-zg-secondary mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-zg-secondary mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="You@Email.Com"
                                    className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-zg-secondary mb-2">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Let Us Know How We Can Help"
                                    className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-zg-secondary mb-2">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Write Your Message Here..."
                                    className="w-full px-4 py-3 rounded-lg bg-zg-bg border border-zg-secondary/10 text-zg-primary focus:outline-none focus:border-zg-accent focus:ring-1 focus:ring-zg-accent transition-all placeholder:text-zg-secondary/30 resize-none"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-4 bg-zg-accent text-black font-bold rounded-xl hover:bg-zg-accent-hover transition-all shadow-lg shadow-zg-accent/20 uppercase tracking-wide"
                            >
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
