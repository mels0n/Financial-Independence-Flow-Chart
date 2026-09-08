import { Footer } from "@/widgets/Footer/Footer";
import Link from "next/link";
import { ArrowLeft, ExternalLink, ScrollText, ShieldCheck, ListOrdered, FlaskConical, Database } from "lucide-react";
import { ASSUMPTIONS, FINANCIAL_CONSTANTS, TAX_YEARS, YEAR_META } from "@/shared/config/financial-constants";
import { FLOW_STEPS, PHASES, getPhaseSteps } from "@/shared/config/flow";
import { YourDataPanel } from "./YourDataPanel";
import { cn, formatPercent } from "@/shared/lib/utils";

export const metadata = {
    title: "Sources & Methodology | Financial Quest",
    description: "Every number in Financial Quest traced to its official IRS source, every assumption named, the step ordering explained, and exactly what data the app holds about you (nothing leaves your browser).",
    alternates: {
        canonical: "/sources",
    },
};

function StatusBadge({ status }: { status: "official" | "projected" }) {
    return (
        <span className={cn(
            "inline-block rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide",
            status === "official" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
        )}>
            {status}
        </span>
    );
}

export default function SourcesPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-3xl px-6 py-10">
                <header className="mb-12">
                    <Link href="/" className="text-primary hover:underline mb-6 inline-flex items-center gap-2 text-sm">
                        <ArrowLeft className="w-4 h-4" aria-hidden /> Back to the quest
                    </Link>
                    <h1 className="font-display text-4xl font-bold tracking-tight [text-wrap:balance] mb-3">
                        Sources &amp; Methodology
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-[62ch]">
                        Financial Quest runs on three kinds of information: official IRS figures, named
                        assumptions, and the numbers you type in. This page shows all three, so you can
                        check any recommendation the quest makes.
                    </p>
                </header>

                <div className="space-y-14">
                    {/* Your data */}
                    <section id="your-data" className="scroll-mt-20">
                        <h2 className="font-display text-2xl font-bold mb-2 flex items-center gap-2.5">
                            <Database className="h-5 w-5 text-primary" aria-hidden />
                            The data you give it
                        </h2>
                        <p className="text-muted-foreground mb-5 max-w-[62ch]">
                            There are no accounts, no analytics on your figures, and no server that ever
                            sees them. Everything below is read live from this browser tab, which is the
                            only place it exists.
                        </p>
                        <YourDataPanel />
                    </section>

                    {/* IRS dataset */}
                    <section id="irs-data" className="scroll-mt-20">
                        <h2 className="font-display text-2xl font-bold mb-2 flex items-center gap-2.5">
                            <ScrollText className="h-5 w-5 text-primary" aria-hidden />
                            The official numbers
                        </h2>
                        <p className="text-muted-foreground mb-5 max-w-[62ch]">
                            Every contribution limit in the quest comes from an IRS document, cited below.
                            Projected years are estimates until the IRS publishes official figures
                            (typically each November), and are labeled that way in the app too.
                        </p>

                        <div className="space-y-6">
                            {TAX_YEARS.map((year) => {
                                const meta = YEAR_META[year];
                                const limits = FINANCIAL_CONSTANTS[year];
                                const rows = [
                                    { label: "401(k)/403(b) employee limit", value: limits.k401.limit, source: meta.sources.k401 },
                                    { label: "401(k) catch-up (50+)", value: limits.k401.catchUp, source: meta.sources.k401 },
                                    ...(limits.k401.totalLimit ? [{ label: "401(k) total combined cap", value: limits.k401.totalLimit, source: meta.sources.k401 }] : []),
                                    { label: "IRA limit", value: limits.ira.limit, source: meta.sources.ira },
                                    { label: "IRA catch-up (50+)", value: limits.ira.catchUp, source: meta.sources.ira },
                                    { label: "HSA limit (self-only)", value: limits.hsa.self, source: meta.sources.hsa },
                                    { label: "HSA limit (family)", value: limits.hsa.family, source: meta.sources.hsa },
                                    { label: "HSA catch-up (55+)", value: limits.hsa.catchUp, source: meta.sources.hsa },
                                    { label: "HDHP minimum deductible (self)", value: limits.hsa.hdhpMinDeductibleSelf, source: meta.sources.hsa },
                                    { label: "HDHP minimum deductible (family)", value: limits.hsa.hdhpMinDeductibleFamily, source: meta.sources.hsa },
                                    { label: "Standard deduction (single)", value: limits.standardDeduction.single, source: meta.sources.standardDeduction },
                                    { label: "Standard deduction (married joint)", value: limits.standardDeduction.married, source: meta.sources.standardDeduction },
                                    { label: "Standard deduction (head of household)", value: limits.standardDeduction.headOfHousehold, source: meta.sources.standardDeduction },
                                ];

                                return (
                                    <div key={year} className="overflow-hidden rounded-2xl border border-border">
                                        <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/50 px-4 py-3">
                                            <h3 className="font-display text-lg font-bold font-mono tabular">{year}</h3>
                                            <StatusBadge status={meta.status} />
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                                                        <th scope="col" className="px-4 pt-3 pb-1 font-semibold">Figure</th>
                                                        <th scope="col" className="px-4 pt-3 pb-1 text-right font-semibold">Value</th>
                                                        <th scope="col" className="px-4 pt-3 pb-1 text-right font-semibold">Source</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {rows.map((row) => (
                                                        <tr key={row.label} className="border-t border-border/60">
                                                            <td className="px-4 py-2 text-foreground">{row.label}</td>
                                                            <td className="px-4 py-2 text-right font-mono tabular text-foreground">${row.value.toLocaleString()}</td>
                                                            <td className="px-4 py-2 text-right">
                                                                {row.source.projected && (
                                                                    <span className="mr-2 inline-block rounded bg-warning/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-warning">
                                                                        Projected
                                                                    </span>
                                                                )}
                                                                <a
                                                                    href={row.source.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2 hover:no-underline whitespace-nowrap"
                                                                >
                                                                    {row.source.label}
                                                                    <ExternalLink className="h-3 w-3" aria-hidden />
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="border-t border-border bg-secondary/30 px-4 py-2.5 text-xs text-muted-foreground">
                                            {meta.note}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Assumptions */}
                    <section id="assumptions" className="scroll-mt-20">
                        <h2 className="font-display text-2xl font-bold mb-2 flex items-center gap-2.5">
                            <FlaskConical className="h-5 w-5 text-primary" aria-hidden />
                            The assumptions
                        </h2>
                        <p className="text-muted-foreground mb-5 max-w-[62ch]">
                            When the quest estimates a payoff (like &quot;this saves you $1,300 in tax&quot;), the
                            estimate leans on the assumptions below. Each one also appears next to the number
                            it powers, behind the &quot;Show the math&quot; disclosure.
                        </p>
                        <dl className="divide-y divide-border rounded-2xl border border-border">
                            {Object.values(ASSUMPTIONS).map((a) => (
                                <div key={a.label} className="flex items-start justify-between gap-6 p-4">
                                    <div className="max-w-[46ch]">
                                        <dt className="text-sm font-semibold text-foreground">{a.label}</dt>
                                        <dd className="mt-1 text-sm text-muted-foreground">{a.detail}</dd>
                                    </div>
                                    <span className="shrink-0 font-mono tabular text-lg font-semibold text-primary">
                                        {a.value < 1 ? formatPercent(a.value) : a.value.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </dl>
                    </section>

                    {/* Methodology */}
                    <section id="why-this-order" className="scroll-mt-20">
                        <h2 className="font-display text-2xl font-bold mb-2 flex items-center gap-2.5">
                            <ListOrdered className="h-5 w-5 text-primary" aria-hidden />
                            Why the steps come in this order
                        </h2>
                        <p className="text-muted-foreground mb-5 max-w-[62ch]">
                            The ordering follows one rule: <strong className="text-foreground">guaranteed
                            returns first, then the most tax-advantaged space, then everything else.</strong>{" "}
                            An employer match (50-100% instant) beats paying 20% APR debt, which beats a
                            triple-tax-advantaged HSA, which beats an IRA, and so on down to the taxable
                            account. Each step below states its own case.
                        </p>

                        <div className="space-y-6">
                            {PHASES.map((phase) => (
                                <div key={phase.id}>
                                    <h3 className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                                        {phase.name} · {phase.tagline}
                                    </h3>
                                    <ol className="space-y-2">
                                        {getPhaseSteps(phase.id).map((step) => (
                                            <li key={step.id} className="rounded-xl border border-border bg-card p-3.5">
                                                <span className="block text-sm font-bold text-foreground">
                                                    {FLOW_STEPS.findIndex((s) => s.id === step.id) + 1}. {step.label}
                                                </span>
                                                <span className="mt-0.5 block text-sm text-muted-foreground">{step.whyNow}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Disclaimer */}
                    <section id="disclaimer" className="scroll-mt-20">
                        <h2 className="font-display text-2xl font-bold mb-2 flex items-center gap-2.5">
                            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
                            What this is and is not
                        </h2>
                        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-5 text-sm leading-relaxed text-foreground/90">
                            Financial Quest is an educational tool. It is not financial, legal, or tax advice,
                            and it does not know your full situation. The figures come from official IRS data
                            and the assumptions listed above; verify anything load-bearing against the cited
                            documents, and consult a CPA or fiduciary advisor for personalized guidance.
                        </div>
                    </section>
                </div>

                <Footer />
            </div>
        </main>
    );
}
