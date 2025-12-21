"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { createPortal } from "react-dom";

interface SheetProps {
    isOpen: boolean;
    onClose: () => void;
    side?: "left" | "right";
    children: React.ReactNode;
    className?: string;
}

export function Sheet({ isOpen, onClose, side = "left", children, className }: SheetProps) {
    // Prevent body scroll when sheet is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    // We use a portal to ensure the sheet is always on top of everything
    // But we need to make sure we're on the client
    const mounted = typeof window !== 'undefined';
    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ x: side === "left" ? "-100%" : "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: side === "left" ? "-100%" : "100%" }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className={cn(
                            "fixed top-0 bottom-0 z-50 w-[85%] max-w-sm bg-background shadow-xl lg:hidden",
                            side === "left" ? "left-0 border-r" : "right-0 border-l",
                            className
                        )}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="h-full w-full overflow-hidden">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
