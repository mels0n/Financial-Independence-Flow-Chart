export interface TaxYearInfo {
    year: string;
    label: string;
    status: 'Official' | 'Projected';
    description: string;
}

// Known years are those where the IRS has released official contribution limits/brackets
// UPDATE THIS LIST ANNUALLY when new data is hardcoded into the app.
export const KNOWN_OFFICIAL_YEARS = [2025, 2026];

export const getTaxYearInfo = (year: number): TaxYearInfo => {
    const isKnown = KNOWN_OFFICIAL_YEARS.includes(year);

    return {
        year: year.toString(),
        label: year.toString(),
        status: isKnown ? 'Official' : 'Projected',
        description: isKnown
            ? 'Official Limits'
            : 'Projected (Full 12-Month Plan)'
    };
};

export const getAvailableTaxYears = (): TaxYearInfo[] => {
    const currentYear = new Date().getFullYear();
    // Always show Current Year and Next Year
    const relevantYears = [currentYear, currentYear + 1];

    return relevantYears.map(getTaxYearInfo);
};
