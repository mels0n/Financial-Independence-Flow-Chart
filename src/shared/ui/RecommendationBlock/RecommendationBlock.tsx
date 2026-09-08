"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Currency } from "@/shared/ui/Currency/Currency";
import { useProposalStore } from "@/shared/model/proposalStore";
import { Plus, Minus, ExternalLink } from "lucide-react";

export interface MathRow {
    label: string;
    value: string;
    /** Renders with a top rule and primary color: the line the math resolves to */
    total?: boolean;
}

export interface SourceLine {
    label: string;
    url?: string;
    projected?: boolean;
}

interface RecommendationBlockProps {
    /** Small caps label above the number, defaults to "Recommended" */
    label?: string;
    amount: number;
    /** "once" renders a flat amount with no cadence suffix */
    per?: "mo" | "yr" | "once";
    /** The payoff, stated next to the number, e.g. "≈ $1,304 less tax this year" */
    benefit?: React.ReactNode;
    /** Arithmetic behind the number; renders behind a "Show the math" disclosure */
    math?: MathRow[];
    /** Named assumptions the math leans on, shown inside the disclosure */
    assumptions?: string;
    /** Official citation for any limit used */
    source?: SourceLine;
    children?: React.ReactNode;
    className?: string;
}

/**
 * The standard shape of every recommendation in the quest: the number huge and
 * unmissable, the benefit beside it, the arithmetic one click away, the source cited.
 */
export function RecommendationBlock({
    label = "Recommended",
    amount,
    per = "mo",
    benefit,
    math,
    assumptions,
    source,
    children,
    className,
}: RecommendationBlockProps) {
    const [open, setOpen] = React.useState(false);
    const mathId = React.useId();

    // Publish the proposal so the Quest Log's budget bar can show this decision
    // as a striped "this step" segment. Lump sums ("once") do not consume the
    // monthly budget, so they stay off the bar.
    const setProposedAmount = useProposalStore((s) => s.setProposedAmount);
    React.useEffect(() => {
        if (per === "mo") setProposedAmount(Math.max(0, amount));
        return () => setProposedAmount(null);
    }, [amount, per, setProposedAmount]);

    return (
        <div className={cn("rounded-2xl border border-primary/25 bg-secondary/60 p-5", className)}>
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
                        {label}
                    </div>
                    <Currency
                        value={amount}
                        per={per === "once" ? undefined : per}
                        className="text-[2.6rem] leading-none font-semibold text-primary"
                    />
                </div>
                {benefit && (
                    <div className="text-right text-sm text-muted-foreground max-w-[16rem]">
                        {benefit}
                    </div>
                )}
            </div>

            {(math?.length || assumptions || source) && (
                <div className="mt-4 border-t border-dashed border-border pt-3">
                    {math?.length ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setOpen((v) => !v)}
                                aria-expanded={open}
                                aria-controls={mathId}
                                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-primary hover:underline underline-offset-4 rounded"
                            >
                                {open ? <Minus className="h-3.5 w-3.5" aria-hidden /> : <Plus className="h-3.5 w-3.5" aria-hidden />}
                                Show the math
                            </button>
                            <div id={mathId} hidden={!open} className="pt-3">
                                <table className="w-full font-mono tabular text-xs text-muted-foreground">
                                    <tbody>
                                        {math.map((row) => (
                                            <tr key={row.label} className={cn(row.total && "text-primary font-semibold")}>
                                                <td className={cn("py-1 pr-4", row.total && "border-t border-border pt-2")}>{row.label}</td>
                                                <td className={cn("py-1 text-right", row.total ? "border-t border-border pt-2" : "text-foreground")}>{row.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {assumptions && (
                                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{assumptions}</p>
                                )}
                                {source && <SourceFootnote source={source} />}
                            </div>
                        </>
                    ) : (
                        <>
                            {assumptions && <p className="text-xs text-muted-foreground leading-relaxed">{assumptions}</p>}
                            {source && <SourceFootnote source={source} />}
                        </>
                    )}
                </div>
            )}

            {children && <div className="mt-5 flex flex-col gap-2">{children}</div>}
        </div>
    );
}

export function SourceFootnote({ source }: { source: SourceLine }) {
    return (
        <p className="mt-2 text-xs text-muted-foreground">
            Source:{" "}
            {source.url ? (
                <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-foreground"
                >
                    {source.label}
                    <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
            ) : (
                source.label
            )}
            {source.projected && (
                <span className="ml-2 inline-block rounded bg-warning/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-warning">
                    Projected
                </span>
            )}
        </p>
    );
}
