import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning' // 'warning', 'success', 'danger'
}) => {
    const typeStyles = {
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-yellow-500/10',
            iconColor: 'text-yellow-400',
            iconBorder: 'border-yellow-500/20',
            confirmBg: 'bg-yellow-500/10 hover:bg-yellow-500/20',
            confirmText: 'text-yellow-400',
            confirmBorder: 'border-yellow-500/20'
        },
        success: {
            icon: CheckCircle,
            iconBg: 'bg-green-500/10',
            iconColor: 'text-green-400',
            iconBorder: 'border-green-500/20',
            confirmBg: 'bg-green-500/10 hover:bg-green-500/20',
            confirmText: 'text-green-400',
            confirmBorder: 'border-green-500/20'
        },
        danger: {
            icon: XCircle,
            iconBg: 'bg-red-500/10',
            iconColor: 'text-red-400',
            iconBorder: 'border-red-500/20',
            confirmBg: 'bg-red-500/10 hover:bg-red-500/20',
            confirmText: 'text-red-400',
            confirmBorder: 'border-red-500/20'
        }
    };

    const style = typeStyles[type];
    const Icon = style.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-zg-surface border border-zg-secondary/10 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="relative p-6 pb-4">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-1.5 text-zg-secondary hover:text-zg-primary hover:bg-zg-secondary/10 rounded-lg transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${style.iconBg} border ${style.iconBorder}`}>
                                        <Icon className={`w-6 h-6 ${style.iconColor}`} />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h3 className="text-lg font-heading font-bold text-zg-primary mb-2">
                                            {title}
                                        </h3>
                                        <p className="text-sm text-zg-secondary leading-relaxed">
                                            {message}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 p-6 pt-2 bg-zg-secondary/5 border-t border-zg-secondary/10">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 bg-zg-secondary/10 hover:bg-zg-secondary/20 text-zg-primary rounded-xl text-sm font-medium transition-all"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 px-4 py-2.5 ${style.confirmBg} ${style.confirmText} rounded-xl text-sm font-bold uppercase tracking-wide transition-all border ${style.confirmBorder}`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
