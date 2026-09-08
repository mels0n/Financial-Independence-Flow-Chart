import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Render a fractional rate as a percentage without float artifacts:
 * formatPercent(0.0765) -> "7.65%", formatPercent(0.035) -> "3.5%".
 */
export function formatPercent(fraction: number, maxDecimals = 2): string {
    const factor = 10 ** maxDecimals;
    return `${Math.round(fraction * 100 * factor) / factor}%`;
}
