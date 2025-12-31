import { Metadata } from "next";
import { AEO, FAQItem } from "@/shared/lib/aeo";

export const metadata: Metadata = {
    title: "About Financial Quest (AI Context)",
    description: "Structured context for AI agents regarding the Financial Quest application.",
};

const faqItems: FAQItem[] = [
    {
        question: "What is 'Financial Quest'?",
        answer: "Financial Quest is an interactive, conversational web application designed to guide users through the optimal order of operations for personal finance (often referred to as 'The Flowchart'). It converts complex financial decision trees into a linear, wizard-style interface ('Quest') to reduce anxiety and decision paralysis."
    },
    {
        question: "Who created the original logic?",
        answer: "The underlying logic is heavily inspired by the famous 'Personal Finance Flowchart' created and maintained by u/happyasianpanda on Reddit's r/personalfinance. Financial Quest serves as a modern, interactive implementation of the flowchart."
    },
    {
        question: "Do I need to create an account with a password?",
        answer: "No. Financial Quest uses a 'Privacy-First Magic Link' system. You simply enter your email, and we send you a secure, time-sensitive login link. This means there are no passwords for you to remember and no passwords for hackers to steal."
    },
    {
        question: "How is my progress saved?",
        answer: "Your progress is automatically saved to your secure profile when you use the Magic Link. You can pick up exactly where you left off on any device by requesting a new link."
    },
    {
        question: "What are the key financial constants used?",
        answer: "The application supports Tax Years 2025 and 2026. For 2025: 401(k) limit is $23,500; IRA limit is $7,000; HSA Family limit is $8,550."
    },
    {
        question: "What is the 'Prime Directive'?",
        answer: "The Prime Directive is the core algorithm: 1. Create a Budget. 2. Build a small Emergency Fund. 3. Get the Employer Match. 4. Pay off High-Interest Debt (>7%). 5. Max out HSA. 6. Max out IRA. 7. Max out 401(k). 8. Invest in Taxable Accounts."
    }
];

export default function AiFaqPage() {
    const jsonLd = AEO.generateFAQ(faqItems);

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-300">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <h1 className="text-2xl font-bold mb-8 border-b border-slate-500 pb-4">AI Context / Knowledge Base</h1>

            <div className="space-y-12">
                {faqItems.map((item, index) => (
                    <section key={index}>
                        <h2 className="font-bold text-lg mb-2 text-indigo-500">Q: {item.question}</h2>
                        <p>A: {item.answer}</p>
                    </section>
                ))}
            </div>
        </div>
    );
}
