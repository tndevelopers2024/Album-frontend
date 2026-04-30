import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Section = ({ title, children }) => (
    <div className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-4 text-zg-primary">{title}</h2>
        <div className="text-zg-secondary text-sm leading-7 space-y-3">{children}</div>
    </div>
);

const PrivacyPolicy = () => {
    return (
        <div className="bg-zg-bg min-h-screen">
            <div className="bg-zg-surface border-b border-zg-secondary/10 py-16">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-zg-accent/10 flex items-center justify-center text-zg-accent mx-auto mb-6">
                        <Shield className="w-7 h-7" />
                    </div>
                    <h1 className="text-4xl font-heading font-bold mb-3">Privacy Policy</h1>
                    <p className="text-zg-secondary text-sm">Last updated: April 2025</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-16">
                <Section title="1. Introduction">
                    <p>Albums by Zero Gravity ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or place an order with us.</p>
                    <p>By using our website, you agree to the collection and use of information in accordance with this policy.</p>
                </Section>

                <Section title="2. Information We Collect">
                    <p>We may collect the following information:</p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li><strong className="text-zg-primary">Personal Identification:</strong> Name, email address, phone number, and delivery address when you register or place an order.</li>
                        <li><strong className="text-zg-primary">Order Information:</strong> Details about the products you order, including customisation preferences and uploaded photographs.</li>
                        <li><strong className="text-zg-primary">Usage Data:</strong> Information on how you access and use our website (pages visited, time spent, browser type).</li>
                        <li><strong className="text-zg-primary">Cookies:</strong> Small data files placed on your device to improve your browsing experience.</li>
                    </ul>
                </Section>

                <Section title="3. How We Use Your Information">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>Process and fulfil your orders</li>
                        <li>Send order confirmations and delivery updates via email</li>
                        <li>Respond to customer service requests</li>
                        <li>Improve our website and product offerings</li>
                        <li>Send promotional communications (only with your consent)</li>
                    </ul>
                </Section>

                <Section title="4. Photographs and Uploaded Content">
                    <p>Photographs you upload for album customisation are used solely for the purpose of creating your order. We do not share, sell, or use your images for any other purpose. Uploaded files are stored securely and deleted after your order is complete.</p>
                </Section>

                <Section title="5. Data Sharing">
                    <p>We do not sell or rent your personal data to third parties. We may share your information with:</p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li><strong className="text-zg-primary">Delivery Partners:</strong> To fulfil your order (name and address only).</li>
                        <li><strong className="text-zg-primary">Payment Processors:</strong> Secure third-party payment gateways. We do not store card details.</li>
                        <li><strong className="text-zg-primary">Legal Requirements:</strong> If required by law or to protect our legal rights.</li>
                    </ul>
                </Section>

                <Section title="6. Data Security">
                    <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
                </Section>

                <Section title="7. Cookies">
                    <p>We use cookies to enhance your experience on our website. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our website may not function properly without cookies.</p>
                </Section>

                <Section title="8. Your Rights">
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>Access the personal data we hold about you</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request deletion of your data, subject to legal obligations</li>
                        <li>Opt out of marketing communications at any time</li>
                    </ul>
                </Section>

                <Section title="9. Contact Us">
                    <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                    <p>
                        <strong className="text-zg-primary">Albums by Zero Gravity</strong><br />
                        40, Josier St, Tirumurthy Nagar, Nungambakkam, Chennai 600034<br />
                        Email: <a href="mailto:info@zerogravityalbums.com" className="text-zg-accent hover:underline">info@zerogravityalbums.com</a><br />
                        Phone: <a href="tel:+919884445100" className="text-zg-accent hover:underline">+91 988 4445 100</a>
                    </p>
                </Section>

                <div className="pt-8 border-t border-zg-secondary/10 flex flex-col sm:flex-row gap-4">
                    <Link to="/terms" className="text-sm text-zg-accent hover:underline">Terms &amp; Conditions →</Link>
                    <Link to="/contact" className="text-sm text-zg-accent hover:underline">Contact Us →</Link>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
