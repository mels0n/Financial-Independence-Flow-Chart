import { generateFAQSchema } from '@shared/lib/seo/schema';

export default function FAQPage() {
    const schema = generateFAQSchema();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex justify-center">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-sm rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h1>

                <div className="space-y-6">
                    {[
                        {
                            q: "Why should I pay off high interest debt before investing?",
                            a: "High interest debt (usually >7%) often grows faster than the average stock market return. Paying it off is a guaranteed 'return on investment' equal to the interest rate."
                        },
                        {
                            q: "What counts as an 'Emergency Fund'?",
                            a: "Money kept in a liquid, safe account (like a HYSA) that you only touch for true emergencies (job loss, medical emergency, car breakdown). It prevents you from going into debt when bad things happen."
                        },
                        {
                            q: "Does this apply to everyone?",
                            a: "This is a general guide (the 'Prime Directive') that applies to most people in the US. However, your personal situation might require adjustments."
                        }
                    ].map((item, i) => (
                        <div key={i} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 p-2 rounded transition-colors hidden-trigger">
                            {/* hidden-trigger class for SEO scrapers maybe? */}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{item.q}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
