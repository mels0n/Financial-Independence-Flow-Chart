// Removed import from "schema-dts" to avoid external dependency issues.
// We define strict interfaces here for zero-dependency type safety.

export type WithContext<T> = T & { "@context": "https://schema.org" };

export interface SoftwareApplication {
    "@type": "SoftwareApplication";
    name: string;
    url: string;
    description: string;
    applicationCategory: string;
    operatingSystem: string;
    author: {
        "@type": "Person";
        name: string;
        url: string;
    };
    offers: {
        "@type": "Offer";
        price: string;
        priceCurrency: string;
    };
}

export interface FAQPage {
    "@type": "FAQPage";
    mainEntity: Array<{
        "@type": "Question";
        name: string;
        acceptedAnswer: {
            "@type": "Answer";
            text: string;
        };
    }>;
}

// We use 'schema-dts' or manual types if the package isn't installed. 
// Given the environment, I'll define strict interfaces manually to avoid dependency issues 
// unless I see 'schema-dts' in package.json (I didn't checks deps, safer to define standard interfaces).

export type AEOContext = "https://schema.org";

export interface BaseSchema {
    "@context": AEOContext;
    "@type": string;
}

export interface SoftwareAppConfig {
    name: string;
    url: string;
    description: string;
    authorName: string;
    authorUrl: string;
    applicationCategory?: string;
    operatingSystem?: string;
    price?: string;
    priceCurrency?: string;
}

export interface FAQItem {
    question: string;
    answer: string; // HTML allowed in Schema.org but usually text is safer for simple snippeting
}

export const AEO = {
    /**
     * Generates the main SoftwareApplication Schema
     */
    generateWebConfig: (config: SoftwareAppConfig): WithContext<SoftwareApplication> => {
        return {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": config.name,
            "url": config.url,
            "description": config.description,
            "applicationCategory": config.applicationCategory || "FinanceApplication",
            "operatingSystem": config.operatingSystem || "Any",
            "author": {
                "@type": "Person",
                "name": config.authorName,
                "url": config.authorUrl
            },
            "offers": {
                "@type": "Offer",
                "price": config.price || "0",
                "priceCurrency": config.priceCurrency || "USD"
            }
        } as WithContext<SoftwareApplication>;
    },

    /**
     * Generates FAQPage Schema
     */
    generateFAQ: (items: FAQItem[]): WithContext<FAQPage> => {
        return {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": items.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        } as WithContext<FAQPage>;
    }
};
