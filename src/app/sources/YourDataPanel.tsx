"use client";

import { useEffect, useState } from "react";
import { useFinancialStore, resetFinancialQuest } from "@/entities/financial/model/financialStore";
import { getFlowStep } from "@/shared/config/flow";
import type { StepId } from "@/shared/config/flow";
import { Currency } from "@/shared/ui/Currency/Currency";
import { Trash2 } from "lucide-react";

/**
 * Live transparency panel: renders exactly what the quest currently holds about
 * the visitor, straight from the store. Everything shown lives in this browser
 * tab's sessionStorage and nowhere else.
 */
export function YourDataPanel() {
    // Avoid hydration mismatch: the store reads sessionStorage on the client only.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const { profile, allocations, actionItems, selectedYear, currentStep } = useFinancialStore();

    if (!mounted) {
        return <div className="h-40 animate-pulse rounded-2xl bg-secondary/50" aria-hidden />;
    }

    const hasData = profile.monthlyIncome > 0 || actionItems.length > 0 || Object.keys(allocations).length > 0;

    if (!hasData) {
        return (
            <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
                Nothing yet. Start the quest and this panel will list every value it holds about you,
                live. It all stays in this browser tab and vanishes when the tab closes.
            </div>
        );
    }

    const rows: Array<{ label: string; value: React.ReactNode }> = [
        { label: "Tax year", value: <span className="font-mono tabular">{selectedYear}</span> },
        { label: "Filing status", value: profile.filingStatus === "married_joint" ? "Married filing jointly" : "Single" },
        { label: "Monthly take-home income", value: <Currency value={profile.monthlyIncome} className="text-sm" /> },
        { label: "Monthly expenses", value: <Currency value={profile.monthlyExpenses} className="text-sm" /> },
        { label: "Emergency fund saved", value: <Currency value={profile.emergencyFundAmount} className="text-sm" /> },
        { label: "Current step", value: getFlowStep(currentStep as StepId)?.label ?? currentStep },
    ];

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.label} className="border-b border-border/60 last:border-b-0">
                            <th scope="row" className="px-4 py-2.5 text-left font-medium text-muted-foreground w-1/2">{row.label}</th>
                            <td className="px-4 py-2.5 text-right text-foreground">{row.value}</td>
                        </tr>
                    ))}
                    {Object.entries(allocations).map(([stepId, amount]) => (
                        <tr key={stepId} className="border-b border-border/60 last:border-b-0">
                            <th scope="row" className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                                Allocation: {getFlowStep(stepId as StepId)?.label ?? stepId}
                            </th>
                            <td className="px-4 py-2.5 text-right">
                                <Currency value={amount} per="mo" className="text-sm" />
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <th scope="row" className="px-4 py-2.5 text-left font-medium text-muted-foreground">Action items</th>
                        <td className="px-4 py-2.5 text-right font-mono tabular text-foreground">{actionItems.length}</td>
                    </tr>
                </tbody>
            </table>
            <div className="border-t border-border p-3 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                    Stored in this tab&apos;s sessionStorage only. Closing the tab erases it.
                </p>
                <button
                    onClick={resetFinancialQuest}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
                >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden /> Erase now
                </button>
            </div>
        </div>
    );
}
