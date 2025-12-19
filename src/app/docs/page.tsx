import { FINANCIAL_CONSTANTS } from "@/shared/config/financial-constants";
import { Footer } from "@/widgets/Footer/Footer";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ScrollText } from "lucide-react";

export const metadata = {
    title: "Financial Documentation & Limits | Financial Quest",
    description: "Official 2025/2026 contribution limits, income thresholds, and rules for IRAs, 401(k)s, and HSAs.",
};

export default function DocsPage() {
    const years = ["2025", "2026"] as const;

    return (
        <main className="min-h-screen bg-background text-foreground p-8 max-w-4xl mx-auto">
            <header className="mb-12">
                <Link href="/" className="text-primary hover:underline mb-4 inline-flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Quest
                </Link>
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <ScrollText className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Financial Documentation</h1>
                        <p className="text-muted-foreground">Official Limits, Rules & Sources</p>
                    </div>
                </div>
            </header>

            <div className="space-y-12">
                {/* 1. Spousal IRA Section (High Priority) */}
                <section id="spousal-ira" className="scroll-mt-20">
                    <div className="p-6 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-2xl">
                        <h2 className="text-2xl font-bold mb-4 text-purple-900 dark:text-purple-100 flex items-center gap-2">
                            💍 Spousal IRA Rules
                        </h2>
                        <div className="space-y-4 text-purple-900/80 dark:text-purple-200/80 leading-relaxed">
                            <p>
                                <strong>The Rule:</strong> Typically, you can only contribute to an IRA if you have "Earned Income" (wages, salary).
                                However, there is a special exception for married couples filing jointly.
                            </p>
                            <p>
                                If your spouse does not work (or earns very little), you can contribute to a <strong>Spousal IRA</strong> for them,
                                provided the <strong>household</strong> earned income is enough to cover contributions for both of you.
                            </p>
                            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl text-sm italic">
                                "Kay Bailey Hutchison Spousal IRA Limit. For 2023, if you file a joint return and your taxable compensation is less than that of your spouse, the limit on your IRA contributions is the smaller of: $6,500 ($7,500 if 50 or older), or The total compensation includible in the gross income of both you and your spouse for the year..."
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium pt-2">
                                <ExternalLink className="w-4 h-4" />
                                <a
                                    href="https://www.irs.gov/publications/p590a#en_US_2023_publink1000230412"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-purple-700 dark:hover:text-purple-300"
                                >
                                    Source: IRS Publication 590-A (Contributions to IRAs)
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Limits Tables */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-border pb-2">Contribution Limits & Thresholds</h2>
                    <p className="text-muted-foreground">
                        We use official IRS data for 2025 and projections for 2026 based on inflation data.
                    </p>

                    {/* 401(k) / 403(b) */}
                    <div className="overflow-hidden border border-border rounded-xl">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary text-secondary-foreground font-semibold">
                                <tr>
                                    <th className="p-4">401(k) / 403(b) / 457</th>
                                    {years.map(y => <th key={y} className="p-4">{y}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr>
                                    <td className="p-4 font-medium">Employee Contribution Limit</td>
                                    {years.map(y => <td key={y} className="p-4">${FINANCIAL_CONSTANTS[y].k401.limit.toLocaleString()}</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-muted-foreground">Catch-Up Contribution (Age 50+)</td>
                                    {years.map(y => <td key={y} className="p-4">+${FINANCIAL_CONSTANTS[y].k401.catchUp.toLocaleString()}</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-muted-foreground">Total Limit (Employee + Employer)</td>
                                    {years.map(y => <td key={y} className="p-4">${FINANCIAL_CONSTANTS[y].k401.totalLimit?.toLocaleString()}</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* IRA */}
                    <div className="overflow-hidden border border-border rounded-xl">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary text-secondary-foreground font-semibold">
                                <tr>
                                    <th className="p-4">IRA (Roth & Traditional)</th>
                                    {years.map(y => <th key={y} className="p-4">{y}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr>
                                    <td className="p-4 font-medium">Contribution Limit</td>
                                    {years.map(y => <td key={y} className="p-4">${FINANCIAL_CONSTANTS[y].ira.limit.toLocaleString()}</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-muted-foreground">Catch-Up Contribution (Age 50+)</td>
                                    {years.map(y => <td key={y} className="p-4">+${FINANCIAL_CONSTANTS[y].ira.catchUp.toLocaleString()}</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* HSA */}
                    <div className="overflow-hidden border border-border rounded-xl">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary text-secondary-foreground font-semibold">
                                <tr>
                                    <th className="p-4">Health Savings Account (HSA)</th>
                                    {years.map(y => <th key={y} className="p-4">{y}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr>
                                    <td className="p-4 font-medium">Self-Only Coverage</td>
                                    {years.map(y => <td key={y} className="p-4">${FINANCIAL_CONSTANTS[y].hsa.self.toLocaleString()}</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium">Family Coverage</td>
                                    {years.map(y => <td key={y} className="p-4">${FINANCIAL_CONSTANTS[y].hsa.family.toLocaleString()}</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium text-muted-foreground">Catch-Up Contribution (Age 55+)</td>
                                    {years.map(y => <td key={y} className="p-4">+${FINANCIAL_CONSTANTS[y].hsa.catchUp.toLocaleString()}</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Standard Deduction */}
                    <div className="overflow-hidden border border-border rounded-xl">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary text-secondary-foreground font-semibold">
                                <tr>
                                    <th className="p-4">Standard Deduction</th>
                                    {years.map(y => <th key={y} className="p-4">{y}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                <tr>
                                    <td className="p-4 font-medium">Single</td>
                                    {years.map(y => <td key={y} className="p-4">${FINANCIAL_CONSTANTS[y].standardDeduction.single.toLocaleString()}</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium">Married Filing Jointly</td>
                                    {years.map(y => <td key={y} className="p-4">${FINANCIAL_CONSTANTS[y].standardDeduction.married.toLocaleString()}</td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 font-medium">Head of Household</td>
                                    {years.map(y => <td key={y} className="p-4">${FINANCIAL_CONSTANTS[y].standardDeduction.headOfHousehold.toLocaleString()}</td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 3. Important Notes & Links */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold border-b border-border pb-2">Official Sources & Notes</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>
                            <strong>Roth IRA Income Limits:</strong> High earners may not be eligible to contribute directly.
                            <a href="https://www.irs.gov/retirement-plans/amount-of-roth-ira-contributions-that-you-can-make-for-2024" className="text-primary hover:underline ml-1" target="_blank">Check IRS Limits</a>.
                            If you are over the limit, search for "Backdoor Roth IRA".
                        </li>
                        <li>
                            <strong>401(k) Limits:</strong> The limit applies to your pre-tax AND Roth 401(k) contributions combined. Employer matches do not count towards the $23,500 limit (for 2025), but do count towards the total $70,000 limit.
                        </li>
                        <li>
                            <strong>Tax Year Validity:</strong> You can typically contribute to an IRA or HSA for the previous tax year until Tax Day (April 15).
                        </li>
                    </ul>
                </section>
            </div>

            <Footer />
        </main>
    );
}
