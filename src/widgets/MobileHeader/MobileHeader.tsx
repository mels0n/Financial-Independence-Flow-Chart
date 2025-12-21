"use client";

import { Menu, ClipboardList } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface MobileHeaderProps {
    onOpenQuestLog: () => void;
    onOpenActionBoard: () => void;
    actionItemsCount?: number;
}

export function MobileHeader({ onOpenQuestLog, onOpenActionBoard, actionItemsCount = 0 }: MobileHeaderProps) {
    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-40 px-4 flex items-center justify-between">
            <button
                onClick={onOpenQuestLog}
                className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                aria-label="Open Quest Log"
            >
                <Menu className="w-6 h-6" />
            </button>

            <span className="font-bold text-lg bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                Financial Quest
            </span>

            <button
                onClick={onOpenActionBoard}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors relative"
                aria-label="Open Action Board"
            >
                <ClipboardList className="w-6 h-6" />
                {actionItemsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-background" />
                )}
            </button>
        </header>
    );
}
