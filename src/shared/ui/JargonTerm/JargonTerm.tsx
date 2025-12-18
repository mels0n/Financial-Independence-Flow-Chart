"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";

interface JargonTermProps {
    term: string;
    definition: React.ReactNode;
    className?: string;
}

export function JargonTerm({ term, definition, className }: JargonTermProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <span className="relative inline-block">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "font-bold text-primary border-b-2 border-primary/30 hover:border-primary transition-colors cursor-help inline-flex items-center gap-1",
                    className
                )}
            >
                {term}
                <Info className="w-3 h-3 opacity-50" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 cursor-default"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-slate-900 text-slate-50 text-sm rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                        {definition}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                    </div>
                </>
            )}
        </span>
    );
}
