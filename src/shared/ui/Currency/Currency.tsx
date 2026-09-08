import { cn } from "@/shared/lib/utils";

interface CurrencyProps {
    value: number;
    /** Cadence suffix: "mo", "yr", or none for a flat amount */
    per?: "mo" | "yr";
    className?: string;
    /** Class for the suffix, defaults to a quiet muted style */
    perClassName?: string;
}

/**
 * The one way currency renders: mono, tabular figures, explicit cadence.
 * Keeps every dollar figure in the app visually comparable.
 */
export function Currency({ value, per, className, perClassName }: CurrencyProps) {
    const negative = value < 0;
    const formatted = Math.abs(Math.round(value)).toLocaleString("en-US");
    return (
        <span className={cn("font-mono tabular", className)}>
            {negative ? "−$" : "$"}{formatted}
            {per && <span className={cn("text-[0.62em] font-medium text-muted-foreground", perClassName)}>/{per}</span>}
        </span>
    );
}
