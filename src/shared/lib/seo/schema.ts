import { glossaryTerms } from '@entities/glossary-term/model/data';

export function generateDefinedTermSchema() {
    const schema = {
        "@context": "https://schema.org/",
        "@type": "DefinedTermSet",
        "name": "Personal Finance Terminology",
        "hasDefinedTerm": Object.values(glossaryTerms).map(term => ({
            "@type": "DefinedTerm",
            "name": term.title,
            "description": term.definition
        }))
    };
    return schema;
}

export function generateFAQSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Why pay off high interest debt before investing?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "High interest debt typically grows faster than investment returns, making repayment a guaranteed high-return investment."
                }
            },
            // ... more items if needed, duplicating content from page is acceptable for schema
        ]
    };
    return schema;
}
