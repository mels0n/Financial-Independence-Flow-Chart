"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import type { LucideIcon } from "lucide-react";

interface ConversationalCardProps {
    title: string;
    description?: React.ReactNode;
    children?: React.ReactNode;
    mode?: "input" | "advice" | "summary";
    /** Step icon drawn in the card header; replaces the old emoji-in-title habit */
    icon?: LucideIcon;
    isActive?: boolean;
    className?: string;
}

export function ConversationalCard({
    title,
    description,
    children,
    mode = "input",
    icon: Icon,
    isActive = true,
    className
}: ConversationalCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{
                opacity: isActive ? 1 : 0.6,
                y: 0,
                scale: 1,
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className={cn(
                "w-full max-w-2xl mx-auto mb-6 p-6 sm:p-8 rounded-3xl border",
                mode === "advice"
                    ? "bg-card border-primary/30 shadow-[0_16px_48px_-16px_hsl(var(--primary)/0.25)]"
                    : "bg-card border-border shadow-[0_16px_48px_-24px_hsl(var(--background))]",
                className
            )}
        >
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    {Icon && (
                        <span
                            aria-hidden
                            className={cn(
                                "mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border",
                                mode === "advice"
                                    ? "border-primary/40 bg-primary/10 text-primary"
                                    : "border-border bg-secondary text-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" strokeWidth={2.25} />
                        </span>
                    )}
                    <div className="space-y-2 min-w-0">
                        <h2
                            className={cn(
                                "font-display text-2xl md:text-[2rem] font-bold leading-tight tracking-tight [text-wrap:balance]",
                                mode === "advice" ? "text-primary" : "text-foreground"
                            )}
                        >
                            {title}
                        </h2>
                        {description && (
                            <div className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                {description}
                            </div>
                        )}
                    </div>
                </div>

                {children && <div className="pt-2">{children}</div>}
            </div>
        </motion.div>
    );
}
