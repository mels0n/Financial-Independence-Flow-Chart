import { TAX_YEARS, YEAR_META } from "@/shared/config/financial-constants";

export interface TaxYearInfo {
    year: string;
    label: string;
    status: 'Official' | 'Projected';
    description: string;
}

/**
 * Selectable tax years, derived from the one source of truth in
 * financial-constants.ts. A year is only offered when real data exists for it,
 * and its official/projected label comes from the same record as the figures,
 * so the two can never disagree.
 */
export const getAvailableTaxYears = (): TaxYearInfo[] => {
    return TAX_YEARS.map((year) => {
        const meta = YEAR_META[year];
        const official = meta.status === 'official';
        return {
            year,
            label: year,
            status: official ? 'Official' : 'Projected',
            description: official ? 'Official Limits' : 'Partly projected limits',
        };
    });
};
