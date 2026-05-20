import React from 'react';

const OrderPrintTemplate = ({ order }) => {
    if (!order) return null;

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toUpperCase();
    };

    return (
        <div className="print-template" style={{ display: 'none' }}>
            <style>{`
                @media print {
                    @page {
                        size: A4 portrait;
                        margin: 8mm;
                    }
                    body * { visibility: hidden !important; }
                    .print-template, .print-template * { visibility: visible !important; }
                    .print-template {
                        display: block !important;
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        background: white !important;
                        color: black !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 99999;
                        overflow: visible !important;
                    }
                    .no-print, .no-print * { display: none !important; }
                }

                .job-order-container {
                    width: 100%;
                    border: 1.5px solid #000;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    font-size: 10px;
                    line-height: 1.2;
                    background: #fff;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }

                th, td {
                    border: 1px solid #000;
                    padding: 4px 6px;
                    text-align: left;
                    vertical-align: top;
                    word-wrap: break-word;
                    overflow: hidden;
                }

                .header-table td {
                    width: 50%;
                }

                .label {
                    font-weight: normal;
                    color: #444;
                    display: inline-block;
                    width: 90px;
                }

                .value {
                    font-weight: bold;
                    color: #000;
                    text-transform: uppercase;
                }

                .main-spec-table th {
                    background-color: #f0f0f0;
                    text-align: center;
                    font-size: 7.5px;
                    font-weight: bold;
                    padding: 4px 2px;
                }

                .main-spec-table td {
                    text-align: center;
                    font-size: 9px;
                    padding: 6px 2px;
                }

                .sub-info {
                    font-size: 7px;
                    color: #0066cc;
                    margin-top: 2px;
                    line-height: 1;
                    font-weight: normal;
                }

                .job-done-header {
                    background-color: #f0f0f0;
                    text-align: center;
                    font-weight: bold;
                    text-transform: uppercase;
                    padding: 5px;
                    border-top: 1.5px solid #000;
                    border-bottom: 1px solid #000;
                }

                .job-done-table td {
                    height: 24px;
                }

                .billing-label {
                    text-align: right;
                    width: 80%;
                    font-weight: normal;
                }

                .billing-value {
                    width: 20%;
                    text-align: right;
                    font-weight: bold;
                }

                .remarks-section {
                    padding: 10px;
                    border-top: 1px solid #000;
                }

                .footer-sign {
                    display: flex;
                    justify-content: flex-end;
                    padding: 20px 40px;
                }
            `}</style>

            <div className="job-order-container">
                {/* Top Header */}
                <table className="header-table">
                    <tbody>
                        <tr>
                            <td><span className="label">Job Type :</span> <span className="value">Album</span></td>
                            <td><span className="label">Job Name :</span> <span className="value">{order.product?.name || 'N/A'}</span></td>
                        </tr>
                        <tr>
                            <td><span className="label">Order Date :</span> <span className="value">{formatDate(order.createdAt)}</span></td>
                            <td><span className="label">Order Number :</span> <span className="value">ZG{order._id.slice(-6).toUpperCase()}</span></td>
                        </tr>
                    </tbody>
                </table>

                {/* Customer & Delivery */}
                <table>
                    <tbody>
                        <tr>
                            <td style={{ width: '50%' }}>
                                <div><span className="label">Customer:</span> <span className="value">{order.user?.name}</span></div>
                                {order.user?.businessName && <div><span className="label">Business:</span> <span className="value">{order.user.businessName}</span></div>}
                                <div><span className="label">Address:</span> <span className="value">{order.deliveryAddress?.city || 'N/A'}</span></div>
                                <div><span className="label">Mobile:</span> <span className="value">{order.user?.phone || order.deliveryAddress?.phone || 'N/A'}</span></div>
                            </td>
                            <td style={{ width: '50%' }}>
                                <div><span className="label">Delivery Date:</span> <span className="value">{formatDate(order.createdAt)}</span></div>
                                <div><span className="label">Delivery Type:</span> <span className="value">COURIER B2B</span></div>
                                <div><span className="label">Address:</span> <span className="value">{order.deliveryAddress?.state || 'N/A'}</span></div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Main Spec Table */}
                <table className="main-spec-table">
                    <thead>
                        <tr>
                            <th style={{ width: '3%' }}>S.NO</th>
                            <th style={{ width: '10%' }}>SIZE</th>
                            <th style={{ width: '8%' }}>SHEET TYPE</th>
                            <th style={{ width: '10%' }}>PRINT MACHINE TYPE</th>
                            <th style={{ width: '10%' }}>LAMINATE TYPE</th>
                            <th style={{ width: '10%' }}>PAD TYPE</th>
                            <th style={{ width: '8%' }}>PAD COLOUR</th>
                            <th style={{ width: '8%' }}>BOX TYPE</th>
                            <th style={{ width: '8%' }}>BOX COLOUR</th>
                            <th style={{ width: '8%' }}>BAG</th>
                            <th style={{ width: '5%' }}>QTY</th>
                            <th style={{ width: '12%' }}>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td className="value">
                                {order.size}
                                <div className="sub-info">(Qty: 1)</div>
                            </td>
                            <td className="value">
                                {order.bindingType}
                                <div className="sub-info">(Qty: 1)</div>
                            </td>
                            <td className="value">
                                HP - INDIGO
                                <div className="sub-info">(Qty: 1)</div>
                            </td>
                            <td className="value">
                                {order.paperType}
                                <div className="sub-info">(Qty: {order.sheetCount})</div>
                                <div className="sub-info">Amt: {((order.calculatedPrice - (order.product?.boxPrice || 500)) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                            </td>
                            <td className="value">
                                {order.coverType || 'LEATHER PAD'}
                                <div className="sub-info">(Qty: 1)</div>
                                <div className="sub-info">Amt: {(order.product?.boxPrice || 500).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                            </td>
                            <td className="value">
                                {order.albumColor || 'BLUE'}
                                <div className="sub-info">(Qty: 1)</div>
                            </td>
                            <td className="value">
                                {order.boxType || 'LEATHER BOX'}
                                <div className="sub-info">(Qty: 1)</div>
                            </td>
                            <td className="value">
                                {order.albumColor || 'BLUE'}
                                <div className="sub-info">(Qty: 1)</div>
                            </td>
                            <td className="value">
                                {order.bagType || 'JUTE BAG'}
                                <div className="sub-info">(Qty: 1)</div>
                            </td>
                            <td className="value">{order.quantity}</td>
                            <td className="value" style={{ textAlign: 'right' }}>{order.calculatedPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Dynamic Specifications */}
                {order.dynamicSpecs && Object.keys(order.dynamicSpecs).length > 0 && (
                    <div style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000' }}>
                        <table className="main-spec-table" style={{ border: 'none' }}>
                            <thead>
                                <tr>
                                    {Object.keys(order.dynamicSpecs).map(key => (
                                        <th key={key} style={{ textTransform: 'uppercase' }}>{key.replace(/_/g, ' ')}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {Object.values(order.dynamicSpecs).map((value, i) => (
                                        <td key={i} className="value">{value}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Job Done Details */}
                <div className="job-done-header">Job Done Details</div>
                <table className="job-done-table">
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>Department</th>
                            <th style={{ width: '25%' }}>Staff Name</th>
                            <th style={{ width: '20%' }}>Signature</th>
                            <th style={{ width: '25%' }}>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {['CC/DESIGN', 'PRINT', 'LAMINATION', 'CAKE', 'WRAPPER', 'QC', 'DISPATCH'].map(dept => (
                            <tr key={dept}>
                                <td style={{ fontWeight: 'bold' }}>{dept}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Billing Summary */}
                <table>
                    <tbody>
                        <tr>
                            <td className="billing-label">Delivery Charges :</td>
                            <td className="billing-value">0.00</td>
                        </tr>
                        <tr>
                            <td className="billing-label">Order Amount :</td>
                            <td className="billing-value">{order.calculatedPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>
                        <tr>
                            <td className="billing-label">Advance :</td>
                            <td className="billing-value">0.00</td>
                        </tr>
                        <tr>
                            <td className="billing-label">Balance :</td>
                            <td className="billing-value">{order.calculatedPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Remarks & Footer */}
                <div className="remarks-section">
                    <span className="label" style={{ width: 'auto', marginRight: 5 }}>Remarks :</span>
                    <span className="fv">{order.title}</span>
                </div>

                <div className="footer-sign">
                    <div style={{ textAlign: 'right' }}>
                        <span className="label" style={{ width: 'auto' }}>Order Taken By :</span>
                        <span className="value" style={{ marginLeft: 10 }}>Admin</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPrintTemplate;
