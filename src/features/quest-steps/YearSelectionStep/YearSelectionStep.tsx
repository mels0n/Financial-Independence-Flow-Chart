"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { cn } from "@/shared/lib/utils";

export function YearSelectionStep() {
    const { selectedYear, setYear, nextStep } = useFinancialStore();

    const handleYearSelect = (year: "2025" | "2026") => {
        setYear(year);
        // Auto advance after short delay for better UX
        setTimeout(() => nextStep(), 300);
    };

    return (
        <ConversationalCard
            title="Welcome to Financial Quest."
            description="To give you the most accurate information, which tax year are we planning for?"
        >
            <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                    onClick={() => handleYearSelect("2025")}
                    className={cn(
                        "p-6 rounded-2xl border-2 transition-all duration-200 text-left hover:scale-[1.02]",
                        selectedYear === "2025"
                            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                            : "border-border bg-card hover:border-primary/50 text-card-foreground"
                    )}
                >
                    <div className={cn(
                        "text-2xl font-bold",
                        selectedYear === "2025" ? "text-primary" : "text-foreground"
                    )}>2025</div>
                    <div className="text-sm text-muted-foreground mt-1">Official Limits</div>
                </button>

                <button
                    onClick={() => handleYearSelect("2026")}
                    className={cn(
                        "p-6 rounded-2xl border-2 transition-all duration-200 text-left hover:scale-[1.02]",
                        selectedYear === "2026"
                            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                            : "border-border bg-card hover:border-primary/50 text-card-foreground"
                    )}
                >
                    <div className={cn(
                        "text-2xl font-bold",
                        selectedYear === "2026" ? "text-primary" : "text-foreground"
                    )}>2026</div>
                    <div className="text-sm text-muted-foreground mt-1">Projected (Full 12-Month Plan)</div>
                </button>
            </div>
        </ConversationalCard>
    );
}
