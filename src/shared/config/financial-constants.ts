export type TaxYear = "2025" | "2026";

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
    "2025": {
        k401: {
            limit: 23500,
            catchUp: 7500,
            totalLimit: 70000,
        },
        ira: {
            limit: 7000,
            catchUp: 1000,
        },
        hsa: {
            self: 4300,
            family: 8550,
            catchUp: 1000,
        },
        standardDeduction: {
            single: 15750,
            married: 31500,
            headOfHousehold: 23625,
        },
    },
    "2026": {
        k401: {
            limit: 24500,
            catchUp: 8000,
            totalLimit: 72000, // Projected
        },
        ira: {
            limit: 7500,
            catchUp: 1100,
        },
        hsa: {
            self: 4400,
            family: 8750,
            catchUp: 1000,
        },
        standardDeduction: {
            single: 16100,
            married: 32200,
            headOfHousehold: 24150,
        },
    },
};
