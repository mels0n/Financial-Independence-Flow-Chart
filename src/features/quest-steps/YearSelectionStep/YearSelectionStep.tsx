"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { getAvailableTaxYears } from "@/entities/financial/model/taxYearConfig";
import { ConversationalCard } from "@/shared/ui/ConversationalCard/ConversationalCard";
import { cn } from "@/shared/lib/utils";

export function YearSelectionStep() {
    const { selectedYear, setYear, nextStep } = useFinancialStore();

    const handleYearSelect = (year: string) => {
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
                {getAvailableTaxYears().map((yearInfo) => (
                    <button
                        key={yearInfo.year}
                        onClick={() => handleYearSelect(yearInfo.year)}
                        className={cn(
                            "p-6 rounded-2xl border-2 transition-all duration-200 text-left hover:scale-[1.02]",
                            selectedYear === yearInfo.year
                                ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                : "border-border bg-card hover:border-primary/50 text-card-foreground"
                        )}
                    >
                        <div className={cn(
                            "text-2xl font-bold",
                            selectedYear === yearInfo.year ? "text-primary" : "text-foreground"
                        )}>{yearInfo.label}</div>
                        <div className={cn(
                            "text-sm font-medium mt-1 inline-block px-2 py-0.5 rounded",
                            yearInfo.status === 'Official'
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                        )}>
                            {yearInfo.description}
                        </div>
                    </button>
                ))}
            </div>
        </ConversationalCard>
    );
}
