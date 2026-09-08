"use client";

import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { FLOW_STEPS, INVESTMENT_STEP_IDS } from "@/shared/config/flow";
import { Currency } from "@/shared/ui/Currency/Currency";
import { cn } from "@/shared/lib/utils";

interface PlanLedgerProps {
    className?: string;
}

/**
 * The final character sheet: every allocated dollar by step, monthly and
 * annualized, with the savings rate the plan achieves.
 */
export function PlanLedger({ className }: PlanLedgerProps) {
    const { allocations, profile } = useFinancialStore();

    const rows = FLOW_STEPS
        .map((step) => ({ step, amount: allocations[step.id] ?? 0 }))
        .filter((r) => r.amount > 0);

    const income = profile.monthlyIncome;
    const totalAllocated = rows.reduce((acc, r) => acc + r.amount, 0);
    const totalInvesting = rows
        .filter((r) => INVESTMENT_STEP_IDS.has(r.step.id))
        .reduce((acc, r) => acc + r.amount, 0);
    // Same definition as the taxable step: investing / income (debt payoff and
    // emergency savings are not "savings rate").
    const savingsRate = income > 0 ? Math.round((totalInvesting / income) * 100) : 0;

    if (rows.length === 0) return null;

    return (
        <div className={cn("rounded-2xl border border-border bg-secondary/40 text-left", className)}>
            <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
                <div className="p-4">
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Wealth engine</div>
                    <Currency value={totalInvesting} per="mo" className="text-2xl font-semibold text-success" />
                </div>
                <div className="p-4">
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Savings rate</div>
                    <div className="font-mono tabular text-2xl font-semibold text-primary">{savingsRate}%</div>
                </div>
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        <th scope="col" className="px-4 pt-3 pb-1 font-semibold">Step</th>
                        <th scope="col" className="px-4 pt-3 pb-1 text-right font-semibold">Monthly</th>
                        <th scope="col" className="px-4 pt-3 pb-1 text-right font-semibold">Yearly</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ step, amount }) => (
                        <tr key={step.id} className="border-t border-border/60">
                            <td className="px-4 py-2 text-foreground">{step.label}</td>
                            <td className="px-4 py-2 text-right">
                                <Currency value={amount} className="text-sm" />
                            </td>
                            <td className="px-4 py-2 text-right">
                                <Currency value={amount * 12} className="text-sm text-muted-foreground" />
                            </td>
                        </tr>
                    ))}
                    <tr className="border-t border-border">
                        <td className="px-4 py-2.5 font-semibold text-foreground">Total</td>
                        <td className="px-4 py-2.5 text-right">
                            <Currency value={totalAllocated} className="text-sm font-semibold text-primary" />
                        </td>
                        <td className="px-4 py-2.5 text-right">
                            <Currency value={totalAllocated * 12} className="text-sm font-semibold text-primary" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
