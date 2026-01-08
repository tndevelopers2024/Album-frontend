import React from 'react';
import getImageUrl from '../utils/imageUtils';

const OrderPrintTemplate = ({ order }) => {
    if (!order) return null;

    return (
        <div className="print-template" style={{ display: 'none' }}>
            <style>{`
                @media print {
                    @page { margin: 5mm; }
                    body * { visibility: hidden; }
                    .print-template, .print-template * { visibility: visible; }
                    .print-template {
                        display: block !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        padding: 0;
                        background: white;
                        color: black;
                        min-height: 100vh;
                    }
                    .no-print { display: none !important; }
                }
                
                .print-template {
                    font-family: 'Arial', sans-serif;
                    max-width: 210mm;
                    margin: 0 auto;
                    font-size: 10px;
                    line-height: 1.4;
                }
                
                .print-header {
                    border-bottom: 2px solid #000;
                    padding-bottom: 8px;
                    margin-bottom: 12px;
                }
                
                .print-logo {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 3px;
                }
                
                .print-subtitle {
                    font-size: 10px;
                    color: #666;
                }
                
                .print-section {
                    margin-bottom: 12px;
                }
                
                .print-section-title {
                    font-size: 12px;
                    font-weight: bold;
                    margin-bottom: 6px;
                    padding-bottom: 3px;
                    border-bottom: 1px solid #ddd;
                }
                
                .print-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                
                .print-grid-3 {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 8px;
                }
                
                .print-field {
                    margin-bottom: 5px;
                }
                
                .print-label {
                    font-size: 8px;
                    color: #666;
                    text-transform: uppercase;
                    font-weight: 600;
                    margin-bottom: 2px;
                }
                
                .print-value {
                    font-size: 10px;
                    color: #000;
                    line-height: 1.3;
                }
                
                .print-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 6px;
                }
                
                .print-table th {
                    background: #f5f5f5;
                    padding: 5px 8px;
                    text-align: left;
                    font-size: 9px;
                    border: 1px solid #ddd;
                }
                
                .print-table td {
                    padding: 5px 8px;
                    font-size: 9px;
                    border: 1px solid #ddd;
                    line-height: 1.4;
                }
                
                .print-total {
                    text-align: right;
                    margin-top: 12px;
                    padding-top: 8px;
                    border-top: 2px solid #000;
                }
                
                .print-total-label {
                    font-size: 12px;
                    font-weight: bold;
                }
                
                .print-total-value {
                    font-size: 16px;
                    font-weight: bold;
                    color: #000;
                }
                
                .print-footer {
                    margin-top: 15px;
                    padding-top: 8px;
                    border-top: 1px solid #ddd;
                    text-align: center;
                    font-size: 8px;
                    color: #666;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 3px 10px;
                    border-radius: 10px;
                    font-size: 8px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                
                .status-pending { background: #fff3cd; color: #856404; }
                .status-processing { background: #cfe2ff; color: #084298; }
                .status-completed { background: #d1e7dd; color: #0f5132; }
                .status-cancelled { background: #f8d7da; color: #842029; }
            `}</style>

            <div className="print-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <div className="print-logo">Zero Gravity Albums</div>
                        <div className="print-subtitle">Premium Custom Orders</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '15px', fontWeight: 'bold' }}>ORDER #{order._id.slice(-8).toUpperCase()}</div>
                        <div style={{ fontSize: '9px', color: '#666', marginTop: '3px' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>
                        <div style={{ marginTop: '4px' }}>
                            <span className={`status-badge status-${order.status}`}>{order.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer & Delivery Info - 3 Column */}
            <div className="print-grid-3" style={{ marginBottom: '12px' }}>
                <div className="print-section">
                    <div className="print-section-title">Customer</div>
                    <div className="print-field">
                        <div className="print-value" style={{ fontWeight: '600', fontSize: '11px' }}>{order.user?.name || 'N/A'}</div>
                    </div>
                    <div className="print-field">
                        <div className="print-value" style={{ fontSize: '9px' }}>{order.user?.email || 'N/A'}</div>
                    </div>
                    {order.user?.businessName && (
                        <div className="print-field">
                            <div className="print-label">Business</div>
                            <div className="print-value">{order.user.businessName}</div>
                        </div>
                    )}
                </div>

                <div className="print-section">
                    <div className="print-section-title">Delivery</div>
                    {order.deliveryAddress && (
                        <>
                            <div className="print-value" style={{ fontWeight: '600', fontSize: '10px' }}>{order.deliveryAddress.name}</div>
                            <div className="print-value" style={{ fontSize: '9px' }}>{order.deliveryAddress.phone}</div>
                            <div className="print-value" style={{ fontSize: '9px', lineHeight: '1.3', marginTop: '3px' }}>
                                {order.deliveryAddress.address}, {order.deliveryAddress.city}<br />
                                {order.deliveryAddress.state} {order.deliveryAddress.pincode}
                            </div>
                        </>
                    )}
                </div>

                <div className="print-section">
                    <div className="print-section-title">Order Info</div>
                    <div className="print-field">
                        <div className="print-label">Product</div>
                        <div className="print-value">{order.product?.name}</div>
                    </div>
                    <div className="print-field">
                        <div className="print-label">Quantity</div>
                        <div className="print-value">{order.quantity}</div>
                    </div>
                </div>
            </div>

            {/* Specifications - Compact */}
            <div className="print-section">
                <div className="print-section-title">Album Specifications</div>
                <div className="print-grid-3">
                    <div className="print-field">
                        <div className="print-label">Title</div>
                        <div className="print-value">{order.title}</div>
                    </div>
                    <div className="print-field">
                        <div className="print-label">Size</div>
                        <div className="print-value">{order.size}</div>
                    </div>
                    <div className="print-field">
                        <div className="print-label">Binding</div>
                        <div className="print-value">{order.bindingType}</div>
                    </div>
                    <div className="print-field">
                        <div className="print-label">Paper</div>
                        <div className="print-value">{order.paperType}</div>
                    </div>
                    <div className="print-field">
                        <div className="print-label">Sheets</div>
                        <div className="print-value">{order.sheetCount}</div>
                    </div>
                    {order.albumColor && (
                        <div className="print-field">
                            <div className="print-label">Color</div>
                            <div className="print-value">{order.albumColor}</div>
                        </div>
                    )}
                    <div className="print-field">
                        <div className="print-label">Box</div>
                        <div className="print-value">{order.boxType}</div>
                    </div>
                    {order.bagType && (
                        <div className="print-field">
                            <div className="print-label">Bag</div>
                            <div className="print-value">{order.bagType}</div>
                        </div>
                    )}
                    {order.calendarType && (
                        <div className="print-field">
                            <div className="print-label">Calendar</div>
                            <div className="print-value">{order.calendarType}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Customization & Extras */}
            {(order.frontPageCustomization?.fullNames || order.frontPageCustomization?.initials || order.acrylicCalendar || order.replicaEbook) && (
                <div className="print-section">
                    <div className="print-section-title">Customization & Extras</div>
                    <div className="print-grid-3">
                        {order.frontPageCustomization?.fullNames && (
                            <div className="print-field">
                                <div className="print-label">Names</div>
                                <div className="print-value">{order.frontPageCustomization.fullNames}</div>
                            </div>
                        )}
                        {order.frontPageCustomization?.initials && (
                            <div className="print-field">
                                <div className="print-label">Initials</div>
                                <div className="print-value">{order.frontPageCustomization.initials}</div>
                            </div>
                        )}
                        {order.frontPageCustomization?.date && (
                            <div className="print-field">
                                <div className="print-label">Date</div>
                                <div className="print-value">{new Date(order.frontPageCustomization.date).toLocaleDateString()}</div>
                            </div>
                        )}
                        {order.acrylicCalendar && (
                            <div className="print-field">
                                <div className="print-value">✓ Acrylic Calendar</div>
                            </div>
                        )}
                        {order.replicaEbook && (
                            <div className="print-field">
                                <div className="print-value">✓ Replica E-Book</div>
                            </div>
                        )}
                        {order.frontPageCustomization?.customText && (
                            <div className="print-field" style={{ gridColumn: '1 / -1' }}>
                                <div className="print-label">Custom Text</div>
                                <div className="print-value">{order.frontPageCustomization.customText}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Assets & Total - Combined */}
            <div className="print-grid" style={{ marginBottom: '12px' }}>
                {(order.imageLink || order.logo) && (
                    <div className="print-section">
                        <div className="print-section-title">Assets</div>
                        {order.imageLink && (
                            <div className="print-field">
                                <div className="print-label">Image Link</div>
                                <div className="print-value" style={{ fontSize: '8px', wordBreak: 'break-all' }}>{order.imageLink}</div>
                            </div>
                        )}
                        {order.logo && (
                            <div className="print-field">
                                <div className="print-value" style={{ fontSize: '8px' }}>✓ Logo Uploaded</div>
                            </div>
                        )}
                    </div>
                )}

                {order.calculatedPrice > 0 && (
                    <div className="print-section">
                        <div className="print-section-title">Payment</div>
                        <div className="print-total" style={{ textAlign: 'left', margin: 0, padding: 0, border: 'none' }}>
                            <div className="print-total-label">Total Amount</div>
                            <div className="print-total-value">₹{order.calculatedPrice?.toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="print-footer">
                <p style={{ margin: 0 }}>Thank you for your order! For queries: support@zerogravity.com</p>
            </div>
        </div>
    );
};

export default OrderPrintTemplate;
