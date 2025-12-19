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
            limit: 23500, // Source: IRS Notice 2024-80
            catchUp: 7500, // Source: IRS Notice 2024-80
            totalLimit: 70000, // Source: IRS Notice 2024-80
        },
        ira: {
            limit: 7000, // Source: IRS Notice 2024-80
            catchUp: 1000, // Source: IRS Notice 2024-80
        },
        hsa: {
            self: 4300, // Source: Rev. Proc. 2024-25
            family: 8550, // Source: Rev. Proc. 2024-25
            catchUp: 1000, // Fixed by law
        },
        standardDeduction: {
            single: 15750, // Source: Rev. Proc. 2024-40
            married: 31500, // Source: Rev. Proc. 2024-40
            headOfHousehold: 23625, // Source: Rev. Proc. 2024-40
        },
    },
    "2026": {
        k401: {
            limit: 24500, // Source: IRS Announcement Nov 2025
            catchUp: 8000, // Source: IRS Announcement Nov 2025
            totalLimit: 72000, // Source: IRS Announcement Nov 2025
        },
        ira: {
            limit: 7500, // Source: IRS Announcement Nov 2025
            catchUp: 1100, // Source: IRS Announcement Nov 2025
        },
        hsa: {
            self: 4400, // Source: Rev. Proc. 2025-19
            family: 8750, // Source: Rev. Proc. 2025-19
            catchUp: 1000,
        },
        standardDeduction: {
            single: 16100, // Source: IRS Projection / Inflation Adjustment
            married: 32200, // Source: IRS Projection / Inflation Adjustment
            headOfHousehold: 24150, // Source: IRS Projection / Inflation Adjustment
        },
    },
};
