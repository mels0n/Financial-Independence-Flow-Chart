
"use client";

import { FINANCIAL_CONSTANTS } from "@/shared/config/financial-constants";
import { ExternalLink } from "lucide-react";
import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { getFinancialConstants } from "@/shared/config/financial-constants";
import { getAvailableTaxYears } from "@/entities/financial/model/taxYearConfig";
import { cn } from "@/shared/lib/utils";

export function FinancialLimits() {
    const { selectedYear, setYear } = useFinancialStore();
    const data = getFinancialConstants(selectedYear);
    const availableYears = getAvailableTaxYears();

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
                    Financial Limits & Constants
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Official tax limits, contribution maximums, and standard deductions used in this application.
                </p>
            </header>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="flex gap-2 p-1 bg-muted rounded-lg overflow-x-auto max-w-full">
                    {availableYears.map((yearInfo) => (
                        <button
                            key={yearInfo.year}
                            onClick={() => setYear(yearInfo.year)}
                            className={cn(
                                "py-2 px-4 text-sm font-medium rounded-md transition-all whitespace-nowrap",
                                selectedYear === yearInfo.year
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-background/50"
                            )}
                        >
                            {yearInfo.label} {yearInfo.status === 'Official' ? "(Official)" : "(Projected)"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Retirement Accounts */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* 401k Card */}
                    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="text-2xl font-semibold leading-none tracking-tight">401(k) / 403(b)</h3>
                            <p className="text-sm text-muted-foreground">Employer-sponsored retirement plans</p>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <tbody className="[&_tr:last-child]:border-0">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">Employee Limit</td>
                                            <td className="p-4 align-middle text-right font-mono text-emerald-600 dark:text-emerald-400">
                                                ${data.k401.limit.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">Catch-up (50+)</td>
                                            <td className="p-4 align-middle text-right font-mono text-emerald-600 dark:text-emerald-400">
                                                ${data.k401.catchUp.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">Total Limit (Emp + match)</td>
                                            <td className="p-4 align-middle text-right font-mono text-emerald-600 dark:text-emerald-400">
                                                ${data.k401.totalLimit?.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* IRA Card */}
                    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="text-2xl font-semibold leading-none tracking-tight">IRA (Roth & Traditional)</h3>
                            <p className="text-sm text-muted-foreground">Individual Retirement Arrangements</p>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <tbody className="[&_tr:last-child]:border-0">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">Contribution Limit</td>
                                            <td className="p-4 align-middle text-right font-mono text-emerald-600 dark:text-emerald-400">
                                                ${data.ira.limit.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">Catch-up (50+)</td>
                                            <td className="p-4 align-middle text-right font-mono text-emerald-600 dark:text-emerald-400">
                                                ${data.ira.catchUp.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health & Taxes */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* HSA Card */}
                    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="text-2xl font-semibold leading-none tracking-tight">HSA (Health Savings Account)</h3>
                            <p className="text-sm text-muted-foreground">Triple-tax advantaged health savings</p>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <tbody className="[&_tr:last-child]:border-0">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">Self-only</td>
                                            <td className="p-4 align-middle text-right font-mono text-emerald-600 dark:text-emerald-400">
                                                ${data.hsa.self.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">Family</td>
                                            <td className="p-4 align-middle text-right font-mono text-emerald-600 dark:text-emerald-400">
                                                ${data.hsa.family.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">Catch-up (55+)</td>
                                            <td className="p-4 align-middle text-right font-mono text-emerald-600 dark:text-emerald-400">
                                                ${data.hsa.catchUp.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Standard Deduction Card */}
                    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="text-2xl font-semibold leading-none tracking-tight">Standard Deduction</h3>
                            <p className="text-sm text-muted-foreground">Federal standard audit-proof deduction</p>
                        </div>
                        <div className="p-6 pt-0">
                            <div className="w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <tbody className="[&_tr:last-child]:border-0">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">Single</td>
                                            <td className="p-4 align-middle text-right font-mono text-emerald-600 dark:text-emerald-400">
                                                ${data.standardDeduction.single.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">Married Filing Jointly</td>
                                            <td className="p-4 align-middle text-right font-mono text-emerald-600 dark:text-emerald-400">
                                                ${data.standardDeduction.married.toLocaleString()}
                                            </td>
                                        </tr>
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle font-medium">Head of Household</td>
                                            <td className="p-4 align-middle text-right font-mono text-emerald-600 dark:text-emerald-400">
                                                ${data.standardDeduction.headOfHousehold.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" /> Official Sources
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>
                        Official IRS notices and inflation adjustments.
                    </li>
                </ul>
            </div>
        </div>
    );
}
