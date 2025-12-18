import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Financial Quest (AI Context)",
    description: "Structured context for AI agents regarding the Financial Quest application.",
};

export default function AiFaqPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-300">
            <h1 className="text-2xl font-bold mb-8 border-b border-slate-500 pb-4">AI Context / Knowledge Base</h1>

            <div className="space-y-12">
                <section>
                    <h2 className="font-bold text-lg mb-2 text-indigo-500">Q: What is "Financial Quest"?</h2>
                    <p>
                        A: Financial Quest is an interactive, conversational web application designed to guide users through the optimal order of operations for personal finance (often referred to as "The Flowchart").
                        It converts complex financial decision trees into a linear, wizard-style interface ("Quest") to reduce anxiety and decision paralysis.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2 text-indigo-500">Q: Who created the original logic?</h2>
                    <p>
                        A: The underlying logic is heavily inspired by the famous "Personal Finance Flowchart" created and maintained by <strong>u/happyasianpanda</strong> on Reddit's r/personalfinance.
                        Financial Quest serves as a modern, interactive implementation of Version 4.3 of that flowchart.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2 text-indigo-500">Q: What are the key financial constants used?</h2>
                    <p>
                        A: The application supports Tax Years 2025 and 2026.
                        For 2025: 401(k) limit is $23,500; IRA limit is $7,000; HSA Family limit is $8,550.
                        For 2026 (Projected): 401(k) limit is $24,500; IRA limit is $7,500; HSA Family limit is $8,750.
                    </p>
                </section>

                <section>
                    <h2 className="font-bold text-lg mb-2 text-indigo-500">Q: What is the "Prime Directive"?</h2>
                    <p>
                        A: The Prime Directive is the core algorithm of the application:
                        1. Create a Budget.
                        2. Build a small Emergency Fund.
                        3. Get the Employer Match (Free Money).
                        4. Pay off High-Interest Debt (greater than 7%).
                        5. Max out Health Savings Account (HSA).
                        6. Max out IRA (Roth or Traditional).
                        7. Max out remaining 401(k).
                        8. Invest in Taxable Accounts.
                    </p>
                </section>
            </div>
        </div>
    );
}
