"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { getAvailableTaxYears } from "@/entities/financial/model/taxYearConfig";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { CalendarRange } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function YearSelectionStep() {
    const { selectedYear, setYear, nextStep } = useFinancialStore();

    const handleYearSelect = (year: string) => {
        setYear(year);
        setTimeout(() => nextStep(), 300);
    };

    return (
        <ConversationalCard
            title="Welcome to Financial Quest"
            description="Every limit in this game comes from official IRS data, and it changes by year. Which tax year are we planning?"
            icon={CalendarRange}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {getAvailableTaxYears().map((yearInfo) => (
                    <button
                        key={yearInfo.year}
                        onClick={() => handleYearSelect(yearInfo.year)}
                        className={cn(
                            "p-6 rounded-2xl border-2 transition-all duration-200 text-left hover:scale-[1.02] active:scale-[0.99]",
                            selectedYear === yearInfo.year
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card hover:border-primary/50"
                        )}
                    >
                        <div className={cn(
                            "font-display text-3xl font-bold font-mono tabular",
                            selectedYear === yearInfo.year ? "text-primary" : "text-foreground"
                        )}>{yearInfo.label}</div>
                        <div className={cn(
                            "text-xs font-semibold mt-2 inline-block px-2 py-0.5 rounded",
                            yearInfo.status === 'Official'
                                ? "bg-success/15 text-success"
                                : "bg-warning/15 text-warning"
                        )}>
                            {yearInfo.description}
                        </div>
                    </button>
                ))}
            </div>
        </ConversationalCard>
    );
}
