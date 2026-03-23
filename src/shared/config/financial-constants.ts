export type TaxYear = "2026" | "2027";

interface FinancialLimits {
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
    };
    standardDeduction: {
        single: number;
        married: number;
        headOfHousehold: number;
    };
}

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
        },
        standardDeduction: {
            single: 16550, // Projected — inflation-based estimate
            married: 33100, // Projected — inflation-based estimate
            headOfHousehold: 24900, // Projected — inflation-based estimate
        },
    },
};
// Helper to safely get constants, falling back to latest year for projections
export const getFinancialConstants = (year: string): FinancialLimits => {
    // If exact match exists and is not the interest rate constant
    if (year in FINANCIAL_CONSTANTS && year !== 'hsaInterestRate') {
        const val = FINANCIAL_CONSTANTS[year as keyof typeof FINANCIAL_CONSTANTS];
        if (typeof val === 'object') {
            return val as FinancialLimits;
        }
    }

    // Fallback: Return the latest known year (Projected logic)
    return FINANCIAL_CONSTANTS["2027"];
};
