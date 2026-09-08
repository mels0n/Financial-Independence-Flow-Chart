export type TaxYear = "2026" | "2027";

export interface SourceRef {
    /** Short citation, e.g. "IRS Notice 2025-67" */
    label: string;
    /** Link to the official document */
    url: string;
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

const IRS_SOURCES_2026 = {
    k401: { label: "IRS Notice 2025-67", url: "https://www.irs.gov/pub/irs-drop/n-25-67.pdf" },
    ira: { label: "IRS Notice 2025-67", url: "https://www.irs.gov/pub/irs-drop/n-25-67.pdf" },
    hsa: { label: "IRS Rev. Proc. 2025-19", url: "https://www.irs.gov/pub/irs-drop/rp-25-19.pdf" },
    standardDeduction: { label: "IRS Rev. Proc. 2025-28", url: "https://www.irs.gov/pub/irs-drop/rp-25-28.pdf" },
} as const;

export const YEAR_META: Record<TaxYear, YearMeta> = {
    "2026": {
        status: "official",
        note: "Official IRS figures.",
        sources: IRS_SOURCES_2026,
    },
    "2027": {
        status: "projected",
        note: "Projected from inflation trends; the IRS announces official 2027 figures around November 2026. Update then.",
        // Projections extrapolate from the latest official documents.
        sources: IRS_SOURCES_2026,
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
            self: 4550, // Projected — inflation-based estimate
            family: 9050, // Projected — inflation-based estimate
            catchUp: 1000, // Fixed by law
            hdhpMinDeductibleSelf: 1700, // Projected — carried forward until IRS announces
            hdhpMinDeductibleFamily: 3400, // Projected — carried forward until IRS announces
        },
        standardDeduction: {
            single: 16550, // Projected — inflation-based estimate
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
        label: "Moderate-debt interest approximation",
        detail: "Payoff plans for 4-7% debt approximate simple interest at 5%.",
    },
    lowDebtRate: {
        value: 0.035,
        label: "Low-interest-debt approximation",
        detail: "Payoff plans for sub-4% debt approximate simple interest at 3.5%.",
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
