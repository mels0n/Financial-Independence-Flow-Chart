export type TaxYear = "2026" | "2027";

export interface SourceRef {
    /** Short citation, e.g. "IRS Notice 2025-67" */
    label: string;
    /** Link to the official document */
    url: string;
    /** True while the figure is an estimate awaiting the IRS announcement */
    projected?: boolean;
}

export interface FinancialLimits {
    k401: {
        limit: number;
        catchUp: number;
        totalLimit?: number;
    };
    ira: {
        limit: number;
        catchUp: number;
    };
    hsa: {
        self: number;
        family: number;
        catchUp: number;
        /** Minimum annual deductible for a plan to count as an HDHP (HSA-eligible) */
        hdhpMinDeductibleSelf: number;
        hdhpMinDeductibleFamily: number;
    };
    standardDeduction: {
        single: number;
        married: number;
        headOfHousehold: number;
    };
}

export interface YearMeta {
    status: "official" | "projected";
    /** Human note shown wherever the year's numbers appear */
    note: string;
    sources: {
        k401: SourceRef;
        ira: SourceRef;
        hsa: SourceRef;
        standardDeduction: SourceRef;
    };
}

export const YEAR_META: Record<TaxYear, YearMeta> = {
    "2026": {
        status: "official",
        note: "Official IRS figures.",
        sources: {
            k401: { label: "IRS Notice 2025-67", url: "https://www.irs.gov/pub/irs-drop/n-25-67.pdf" },
            ira: { label: "IRS Notice 2025-67", url: "https://www.irs.gov/pub/irs-drop/n-25-67.pdf" },
            hsa: { label: "IRS Rev. Proc. 2025-19", url: "https://www.irs.gov/pub/irs-drop/rp-25-19.pdf" },
            standardDeduction: { label: "IRS Rev. Proc. 2025-32", url: "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf" },
        },
    },
    "2027": {
        status: "projected",
        note: "Mixed year: HSA and HDHP figures are OFFICIAL per Rev. Proc. 2026-24 (May 2026). 401(k), IRA, and standard deduction figures are inflation projections until the IRS announces them (~Nov 2026). Update then.",
        sources: {
            k401: { label: "IRS Notice 2025-67 (2026 baseline)", url: "https://www.irs.gov/pub/irs-drop/n-25-67.pdf", projected: true },
            ira: { label: "IRS Notice 2025-67 (2026 baseline)", url: "https://www.irs.gov/pub/irs-drop/n-25-67.pdf", projected: true },
            hsa: { label: "IRS Rev. Proc. 2026-24", url: "https://www.irs.gov/pub/irs-drop/rp-26-24.pdf" },
            standardDeduction: { label: "IRS Rev. Proc. 2025-32 (2026 baseline)", url: "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf", projected: true },
        },
    },
};

export const FINANCIAL_CONSTANTS: Record<TaxYear, FinancialLimits> & { hsaInterestRate: number } = {
    hsaInterestRate: 0.042, // 4.2% Conservative HYSA average
    "2026": {
        k401: {
            limit: 24500, // Source: IRS Notice 2025-67
            catchUp: 8000, // Source: IRS Notice 2025-67
            totalLimit: 72000, // Source: IRS Notice 2025-67
        },
        ira: {
            limit: 7500, // Source: IRS Notice 2025-67
            catchUp: 1100, // Source: IRS Notice 2025-67
        },
        hsa: {
            self: 4400, // Source: Rev. Proc. 2025-19
            family: 8750, // Source: Rev. Proc. 2025-19
            catchUp: 1000, // Fixed by law
            hdhpMinDeductibleSelf: 1700, // Source: Rev. Proc. 2025-19
            hdhpMinDeductibleFamily: 3400, // Source: Rev. Proc. 2025-19
        },
        standardDeduction: {
            single: 16100, // Source: IRS Rev. Proc. 2025-28
            married: 32200, // Source: IRS Rev. Proc. 2025-28
            headOfHousehold: 24150, // Source: IRS Rev. Proc. 2025-28
        },
    },
    "2027": {
        k401: {
            limit: 25500, // Projected — inflation-based estimate; update when IRS announces (~Nov 2026)
            catchUp: 8000, // Projected — no change expected
            totalLimit: 73500, // Projected — inflation-based estimate
        },
        ira: {
            limit: 7500, // Projected — IRS frequently holds IRA limit unchanged
            catchUp: 1100, // Projected — no change expected
        },
        hsa: {
            self: 4500, // OFFICIAL — Rev. Proc. 2026-24 (May 2026)
            family: 9000, // OFFICIAL — Rev. Proc. 2026-24
            catchUp: 1000, // Fixed by law
            hdhpMinDeductibleSelf: 1750, // OFFICIAL — Rev. Proc. 2026-24
            hdhpMinDeductibleFamily: 3500, // OFFICIAL — Rev. Proc. 2026-24
        },
        standardDeduction: {
            single: 16550, // Projected — inflation-based estimate (Rev. Proc. 2025-32 is the 2026 baseline)
            married: 33100, // Projected — inflation-based estimate
            headOfHousehold: 24900, // Projected — inflation-based estimate
        },
    },
};

/**
 * Every assumption a recommendation leans on, in one place.
 * Anything shown to the user as "estimated savings" must trace back to a row here,
 * and the /sources page renders this list verbatim.
 */
export const ASSUMPTIONS = {
    marginalFederalRate: {
        value: 0.22,
        label: "Assumed federal marginal tax bracket",
        detail: "Tax-savings estimates for HSA contributions assume the 22% federal bracket. Your actual bracket may differ.",
    },
    marginalFederalRateHigh: {
        value: 0.24,
        label: "Assumed bracket for 401(k) max estimates",
        detail: "People with room to max a 401(k) typically sit in the 24% bracket, so those estimates use 24%.",
    },
    ficaRate: {
        value: 0.0765,
        label: "FICA payroll tax rate",
        detail: "7.65% (6.2% Social Security + 1.45% Medicare). Payroll HSA contributions also avoid FICA.",
    },
    hysaRate: {
        value: FINANCIAL_CONSTANTS.hsaInterestRate,
        label: "Assumed HYSA interest rate",
        detail: "A conservative 4.2% APY average across major high-yield savings accounts.",
    },
    expenseEstimateRatio: {
        value: 0.8,
        label: "Expense estimate when you have no budget",
        detail: "If you do not track expenses, the quest starts from 80% of take-home pay (the 50/30/20 rule's needs + wants).",
    },
    moderateDebtRate: {
        value: 0.05,
        label: "Moderate-debt interest assumption",
        detail: "Payoff plans for 4-7% debt assume a 5% APR, amortized monthly. Only the extra payment above your existing minimum is allocated, since minimums already live in your expense budget.",
    },
    lowDebtRate: {
        value: 0.035,
        label: "Low-interest-debt assumption",
        detail: "Payoff plans for sub-4% debt assume a 3.5% APR, amortized monthly. Only the extra payment above your existing minimum is allocated.",
    },
} as const;

const LATEST_YEAR: TaxYear = "2026";

/** Safely get a year's limits, falling back to the latest known year. */
export const getFinancialConstants = (year: string): FinancialLimits => {
    if (year in FINANCIAL_CONSTANTS && year !== "hsaInterestRate") {
        const val = FINANCIAL_CONSTANTS[year as keyof typeof FINANCIAL_CONSTANTS];
        if (typeof val === "object") {
            return val as FinancialLimits;
        }
    }
    return FINANCIAL_CONSTANTS[LATEST_YEAR];
};

/** Metadata (official vs projected, citations) for a year, with the same fallback. */
export const getYearMeta = (year: string): YearMeta => {
    if (year in YEAR_META) return YEAR_META[year as TaxYear];
    return { ...YEAR_META[LATEST_YEAR], status: "projected", note: "Figures carried forward from the latest official year." };
};

export const TAX_YEARS: TaxYear[] = ["2026", "2027"];
