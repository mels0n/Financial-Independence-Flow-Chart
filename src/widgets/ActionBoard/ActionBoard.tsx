"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { cn } from "@/shared/lib/utils";
import { useState, useEffect } from "react";
import { ClipboardList, CheckSquare, Square } from "lucide-react";

export function ActionBoard() {
    const { actionItems, toggleActionItem } = useFinancialStore();

    if (actionItems.length === 0) return null;

    return (
        <div className="hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-background border-l border-border p-6 overflow-y-auto">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-6">
                <ClipboardList className="w-6 h-6 text-blue-500" />
                Action Board
            </h3>

            <div className="space-y-3">
                {actionItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => toggleActionItem(item.id)}
                        className={cn(
                            "w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all group",
                            item.completed
                                ? "bg-secondary/30 opacity-60"
                                : "bg-card border-2 border-border hover:border-blue-200 dark:hover:border-blue-900 shadow-sm hover:shadow-md"
                        )}
                    >
                        <div className={cn(
                            "mt-0.5 shrink-0 transition-colors",
                            item.completed ? "text-emerald-500" : "text-muted-foreground group-hover:text-blue-500"
                        )}>
                            {item.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </div>
                        <div className="space-y-1">
                            <span className={cn(
                                "text-sm font-semibold leading-tight block",
                                item.completed ? "line-through text-muted-foreground" : "text-foreground"
                            )}>
                                {item.label}
                            </span>
                            {!item.completed && (
                                <span className="text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to mark done
                                </span>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {actionItems.every(i => i.completed) && actionItems.length > 0 && (
                <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 rounded-xl text-center text-sm font-medium animate-in fade-in duration-500 cursor-default">
                    🎉 All caught up! Amazing work.
                </div>
            )}
        </div>
    );
}
