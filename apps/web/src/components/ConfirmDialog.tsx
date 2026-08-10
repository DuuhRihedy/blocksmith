"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning";
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    open,
    title = "Confirmação",
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
                <div className="confirm-overlay" onClick={onCancel}>
                    <motion.div
                        className="confirm-dialog"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <button
                            className="confirm-close"
                            onClick={onCancel}
                            type="button"
                        >
                            <X size={16} />
                        </button>

                        <div className={`confirm-icon confirm-icon--${variant}`}>
                            <AlertTriangle size={24} />
                        </div>

                        <h3 className="confirm-title">{title}</h3>
                        <p className="confirm-message">{message}</p>

                        <div className="confirm-actions">
                            <button
                                className="confirm-btn confirm-btn--cancel"
                                onClick={onCancel}
                                type="button"
                            >
                                {cancelText}
                            </button>
                            <button
                                className={`confirm-btn confirm-btn--${variant}`}
                                onClick={onConfirm}
                                type="button"
                                autoFocus
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
