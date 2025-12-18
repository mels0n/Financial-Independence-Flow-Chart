"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface ConversationalCardProps {
    title: string;
    description?: React.ReactNode;
    children?: React.ReactNode;
    mode?: "input" | "advice" | "summary";
    isActive?: boolean;
    className?: string;
}

export function ConversationalCard({
    title,
    description,
    children,
    mode = "input",
    isActive = true,
    className
}: ConversationalCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{
                opacity: isActive ? 1 : 0.6,
                y: 0,
                scale: isActive ? 1 : 0.98,
                filter: isActive ? "blur(0px)" : "blur(1px)"
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className={cn(
                "w-full max-w-2xl mx-auto mb-6 p-8 rounded-[2rem] transition-colors duration-200",
                mode === "advice"
                    ? "bg-primary/10 border-2 border-primary/20 dark:bg-primary/5 dark:border-primary/20"
                    : "bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50",
                "border border-slate-100 dark:border-slate-800",
                className
            )}
        >
            <div className="space-y-4">
                <motion.h2
                    className={cn(
                        "text-2xl md:text-3xl font-bold tracking-tight",
                        mode === "advice" ? "text-primary" : "text-slate-900 dark:text-white"
                    )}
                >
                    {title}
                </motion.h2>

                {description && (
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                )}

                <div className="mt-6 pt-2">
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
