import React from 'react';

const OrderPrintTemplate = ({ order }) => {
    if (!order) return null;

    const specs = [
        { label: 'Size', value: order.size },
        { label: 'Binding', value: order.bindingType },
        { label: 'Paper', value: order.paperType },
        { label: 'Sheets', value: order.sheetCount },
        { label: 'Box', value: order.boxType },
        order.albumColor && { label: 'Color', value: order.albumColor },
        order.bagType && { label: 'Bag', value: order.bagType },
        order.calendarType && { label: 'Calendar', value: order.calendarType },
        order.coverType && { label: 'Cover', value: order.coverType },
        order.additionalPaper && { label: 'Add. Paper', value: order.additionalPaper },
    ].filter(Boolean);

    const customization = order.frontPageCustomization || {};
    const hasCustomization = customization.fullNames || customization.initials || customization.date || customization.customText;
    const hasExtras = order.acrylicCalendar || order.replicaEbook;

    return (
        <div className="print-template" style={{ display: 'none' }}>
            <style>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 12mm 14mm;
                    }
                    body * { visibility: hidden; }
                    .print-template, .print-template * { visibility: visible; }
                    .print-template {
                        display: block !important;
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white;
                        color: black;
                    }
                    .no-print { display: none !important; }
                }

                .print-template {
                    font-family: Arial, sans-serif;
                    max-width: 182mm;
                    margin: 0 auto;
                    font-size: 9px;
                    line-height: 1.4;
                    color: #111;
                    background: white;
                }

                .ph { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 10px; }
                .ph-logo { font-size: 18px; font-weight: 900; letter-spacing: -0.5px; }
                .ph-sub { font-size: 8px; color: #555; margin-top: 2px; }
                .ph-right { text-align: right; }
                .ph-order { font-size: 14px; font-weight: 800; }
                .ph-date { font-size: 8px; color: #555; margin-top: 2px; }
                .ph-status { display: inline-block; margin-top: 4px; padding: 2px 8px; border-radius: 8px; font-size: 7px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
                .status-pending { background: #fff3cd; color: #856404; }
                .status-processing { background: #cfe2ff; color: #084298; }
                .status-completed { background: #d1e7dd; color: #0f5132; }
                .status-cancelled { background: #f8d7da; color: #842029; }

                .row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; }
                .row3-cell { padding: 7px 9px; border-right: 1px solid #ddd; }
                .row3-cell:last-child { border-right: none; }
                .cell-title { font-size: 7px; font-weight: 700; text-transform: uppercase; color: #666; margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 3px; }
                .field { margin-bottom: 4px; }
                .fl { font-size: 7px; color: #777; text-transform: uppercase; font-weight: 600; }
                .fv { font-size: 9px; color: #111; }

                .section { margin-bottom: 8px; }
                .section-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-bottom: 6px; }

                .specs-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px 8px; }
                .spec-item { }

                .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }

                .custom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 10px; }

                .price-box { border: 1.5px solid #111; border-radius: 4px; padding: 7px 10px; display: flex; justify-content: space-between; align-items: center; }
                .price-label { font-size: 9px; font-weight: 700; text-transform: uppercase; }
                .price-value { font-size: 18px; font-weight: 900; }

                .asset-link { font-size: 7.5px; color: #1a56db; word-break: break-all; margin-top: 2px; }

                .extras-row { display: flex; gap: 16px; margin-top: 3px; }
                .extra-item { display: flex; align-items: center; gap: 4px; font-size: 8.5px; }
                .check { display: inline-block; width: 10px; height: 10px; border: 1px solid #aaa; border-radius: 2px; text-align: center; line-height: 10px; font-size: 8px; }
                .check.yes { background: #0f5132; border-color: #0f5132; color: white; }

                .footer { margin-top: 10px; padding-top: 6px; border-top: 1px solid #ddd; text-align: center; font-size: 7.5px; color: #777; }
            `}</style>

            {/* Header */}
            <div className="ph">
                <div>
                    <div className="ph-logo">Zero Gravity Albums</div>
                    <div className="ph-sub">Premium Custom Orders</div>
                </div>
                <div className="ph-right">
                    <div className="ph-order">ORDER #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="ph-date">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div>
                        <span className={`ph-status status-${order.status}`}>{order.status}</span>
                    </div>
                </div>
            </div>

            {/* Customer / Delivery / Order Info */}
            <div className="row3">
                <div className="row3-cell">
                    <div className="cell-title">Customer</div>
                    <div className="fv" style={{ fontWeight: 700 }}>{order.user?.name || 'N/A'}</div>
                    <div className="fv" style={{ fontSize: '8px', color: '#555' }}>{order.user?.email || ''}</div>
                    {order.user?.businessName && <div className="fv" style={{ fontSize: '8px', marginTop: 3 }}>{order.user.businessName}</div>}
                    {order.user?.phone && <div className="fv" style={{ fontSize: '8px', color: '#555' }}>{order.user.phone}</div>}
                </div>
                <div className="row3-cell">
                    <div className="cell-title">Delivery</div>
                    {order.deliveryAddress ? (
                        <>
                            <div className="fv" style={{ fontWeight: 700 }}>{order.deliveryAddress.name}</div>
                            <div className="fv" style={{ fontSize: '8px', color: '#555' }}>{order.deliveryAddress.phone}</div>
                            <div className="fv" style={{ fontSize: '8px', marginTop: 3 }}>
                                {order.deliveryAddress.address},<br />
                                {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}
                            </div>
                        </>
                    ) : <div className="fv" style={{ color: '#999' }}>Not provided</div>}
                </div>
                <div className="row3-cell">
                    <div className="cell-title">Order Info</div>
                    <div className="field">
                        <div className="fl">Product</div>
                        <div className="fv">{order.product?.name || 'N/A'}</div>
                    </div>
                    <div className="field">
                        <div className="fl">Quantity</div>
                        <div className="fv">{order.quantity}</div>
                    </div>
                    <div className="field">
                        <div className="fl">Album Title</div>
                        <div className="fv">{order.title}</div>
                    </div>
                </div>
            </div>

            {/* Album Specifications */}
            <div className="section">
                <div className="section-title">Album Specifications</div>
                <div className="specs-grid">
                    {specs.map(({ label, value }) => (
                        <div className="spec-item" key={label}>
                            <div className="fl">{label}</div>
                            <div className="fv">{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Customization / Extras / Assets / Price */}
            <div className="row2">
                <div>
                    {(hasCustomization || hasExtras) && (
                        <div className="section">
                            <div className="section-title">Customization & Extras</div>
                            {hasCustomization && (
                                <div className="custom-grid">
                                    {customization.fullNames && (
                                        <div className="field"><div className="fl">Names</div><div className="fv">{customization.fullNames}</div></div>
                                    )}
                                    {customization.initials && (
                                        <div className="field"><div className="fl">Initials</div><div className="fv">{customization.initials}</div></div>
                                    )}
                                    {customization.date && (
                                        <div className="field"><div className="fl">Event Date</div><div className="fv">{new Date(customization.date).toLocaleDateString('en-IN')}</div></div>
                                    )}
                                    {customization.customText && (
                                        <div className="field" style={{ gridColumn: '1/-1' }}><div className="fl">Custom Text</div><div className="fv">{customization.customText}</div></div>
                                    )}
                                </div>
                            )}
                            {hasExtras && (
                                <div className="extras-row" style={{ marginTop: hasCustomization ? 6 : 0 }}>
                                    <div className="extra-item">
                                        <span className={`check ${order.acrylicCalendar ? 'yes' : ''}`}>{order.acrylicCalendar ? '✓' : ''}</span>
                                        Acrylic Calendar
                                    </div>
                                    <div className="extra-item">
                                        <span className={`check ${order.replicaEbook ? 'yes' : ''}`}>{order.replicaEbook ? '✓' : ''}</span>
                                        Replica E-Book
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    {(order.imageLink || order.logo) && (
                        <div className="section">
                            <div className="section-title">Assets</div>
                            {order.imageLink && (
                                <div className="field">
                                    <div className="fl">Image Link</div>
                                    <div className="asset-link">{order.imageLink}</div>
                                </div>
                            )}
                            {order.logo && (
                                <div className="field" style={{ marginTop: 4 }}>
                                    <div className="fl">Logo</div>
                                    <div className="fv">✓ Logo uploaded</div>
                                </div>
                            )}
                        </div>
                    )}

                    {order.calculatedPrice > 0 && (
                        <div className="price-box">
                            <div className="price-label">Total Amount</div>
                            <div className="price-value">₹{order.calculatedPrice?.toLocaleString('en-IN')}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="footer">
                Thank you for your order! &nbsp;|&nbsp; For queries: support@zerogravity.com
            </div>
        </div>
    );
};

export default OrderPrintTemplate;
