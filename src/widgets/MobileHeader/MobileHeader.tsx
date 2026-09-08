"use client";

import { Menu, ClipboardList } from "lucide-react";
import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { Currency } from "@/shared/ui/Currency/Currency";
import { cn } from "@/shared/lib/utils";

interface MobileHeaderProps {
    onOpenQuestLog: () => void;
    onOpenActionBoard: () => void;
    actionItemsCount?: number;
}

export function MobileHeader({ onOpenQuestLog, onOpenActionBoard, actionItemsCount = 0 }: MobileHeaderProps) {
    const { profile, getRemainingBudget } = useFinancialStore();
    const hasIncome = profile.monthlyIncome > 0;
    const remaining = getRemainingBudget();

    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/85 backdrop-blur-md border-b border-border z-40 px-4 flex items-center justify-between">
            <button
                onClick={onOpenQuestLog}
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                aria-label="Open Quest Log"
            >
                <Menu className="w-6 h-6" aria-hidden />
            </button>

            {hasIncome ? (
                <div className="text-center leading-tight">
                    <span className="block font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Free to allocate
                    </span>
                    <Currency
                        value={remaining}
                        per="mo"
                        className={cn("text-lg font-semibold", remaining < 0 ? "text-destructive" : "text-success")}
                    />
                </div>
            ) : (
                <span className="font-display font-bold text-lg text-foreground">
                    Financial Quest
                </span>
            )}

            <button
                onClick={onOpenActionBoard}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors relative"
                aria-label={`Open Action Board${actionItemsCount > 0 ? ` (${actionItemsCount} pending)` : ""}`}
            >
                <ClipboardList className="w-6 h-6" aria-hidden />
                {actionItemsCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-primary font-mono text-[9px] font-bold text-primary-foreground ring-2 ring-background">
                        {actionItemsCount}
                    </span>
                )}
            </button>
        </header>
    );
}
