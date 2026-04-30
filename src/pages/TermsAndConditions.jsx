import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

const Section = ({ title, children }) => (
    <div className="mb-10">
        <h2 className="text-xl font-heading font-bold mb-4 text-zg-primary">{title}</h2>
        <div className="text-zg-secondary text-sm leading-7 space-y-3">{children}</div>
    </div>
);

const TermsAndConditions = () => {
    return (
        <div className="bg-zg-bg min-h-screen">
            <div className="bg-zg-surface border-b border-zg-secondary/10 py-16">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-zg-accent/10 flex items-center justify-center text-zg-accent mx-auto mb-6">
                        <FileText className="w-7 h-7" />
                    </div>
                    <h1 className="text-4xl font-heading font-bold mb-3">Terms &amp; Conditions</h1>
                    <p className="text-zg-secondary text-sm">Last updated: April 2025</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-16">
                <Section title="1. Acceptance of Terms">
                    <p>By accessing our website and placing orders with Albums by Zero Gravity ("we", "us", "our"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
                </Section>

                <Section title="2. Products and Customisation">
                    <p>All albums are custom-made to order. By placing an order, you confirm that:</p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>You own the rights to all photographs submitted for printing.</li>
                        <li>The images do not contain unlawful, offensive, or infringing content.</li>
                        <li>Customisation options (size, cover, layout) are as selected during checkout.</li>
                    </ul>
                    <p>Minor colour variations between digital preview and printed output may occur due to screen calibration differences. This does not constitute a defect.</p>
                </Section>

                <Section title="3. Pricing and Payment">
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes.</li>
                        <li>Prices are subject to change without prior notice. Orders confirmed before a price change will be honoured at the original price.</li>
                        <li>Payment must be made in full at the time of order unless otherwise agreed.</li>
                        <li>We accept major debit/credit cards and UPI payments through our secure payment gateway.</li>
                    </ul>
                </Section>

                <Section title="4. Order Processing and Production">
                    <p>Production begins after payment confirmation and receipt of all required photographs and customisation details. Estimated production times are provided at checkout and are indicative, not guaranteed.</p>
                    <p>We will notify you by email if there are any delays due to unforeseen circumstances.</p>
                </Section>

                <Section title="5. Shipping and Delivery">
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>We ship pan-India via reputed courier partners.</li>
                        <li>Shipping charges (if any) are displayed at checkout.</li>
                        <li>Delivery timelines are estimates and may vary by location.</li>
                        <li>Risk of loss passes to you upon dispatch. We are not responsible for delays caused by the courier.</li>
                    </ul>
                </Section>

                <Section title="6. Cancellations and Refunds">
                    <p>Because all products are custom-made, we generally cannot accept cancellations once production has begun. However:</p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>Cancellations requested within 24 hours of order placement (and before production starts) are eligible for a full refund.</li>
                        <li>If your album arrives damaged or defective, contact us within 48 hours of delivery with photographic evidence. We will replace or refund at our discretion.</li>
                        <li>Refunds (if approved) are processed within 7–10 business days to your original payment method.</li>
                    </ul>
                </Section>

                <Section title="7. Intellectual Property">
                    <p>All content on this website including text, graphics, logos, and design is the property of Albums by Zero Gravity and protected by applicable intellectual property laws. You may not reproduce or distribute any content without our written permission.</p>
                </Section>

                <Section title="8. Limitation of Liability">
                    <p>To the maximum extent permitted by law, Albums by Zero Gravity is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the amount paid for the specific order in question.</p>
                </Section>

                <Section title="9. Governing Law">
                    <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.</p>
                </Section>

                <Section title="10. Contact">
                    <p>For any questions regarding these Terms, contact us at:</p>
                    <p>
                        <strong className="text-zg-primary">Albums by Zero Gravity</strong><br />
                        40, Josier St, Tirumurthy Nagar, Nungambakkam, Chennai 600034<br />
                        Email: <a href="mailto:info@zerogravityalbums.com" className="text-zg-accent hover:underline">info@zerogravityalbums.com</a><br />
                        Phone: <a href="tel:+919884445100" className="text-zg-accent hover:underline">+91 988 4445 100</a>
                    </p>
                </Section>

                <div className="pt-8 border-t border-zg-secondary/10 flex flex-col sm:flex-row gap-4">
                    <Link to="/privacy-policy" className="text-sm text-zg-accent hover:underline">Privacy Policy →</Link>
                    <Link to="/contact" className="text-sm text-zg-accent hover:underline">Contact Us →</Link>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
