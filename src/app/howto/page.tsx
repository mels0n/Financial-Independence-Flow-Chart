import { ArrowRight, Calculator, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/widgets/Footer/Footer";

export default function HowToPage() {
    return (
        <main className="min-h-screen bg-background text-foreground p-8 max-w-4xl mx-auto">
            <header className="mb-12">
                <Link href="/" className="text-primary hover:underline mb-4 inline-block">&larr; Back to Quest</Link>
                <h1 className="text-4xl font-bold mb-4">How to Use This Tool</h1>
                <p className="text-xl text-muted-foreground">Mastering the Flowchart, one card at a time.</p>
            </header>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Calculator className="w-6 h-6" /></div>
                        1. Enter Your Numbers (Roughly)
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        You don't need penny-perfect accuracy. We use estimates (like the 50/30/20 rule) to get you started quickly.
                        You can always refine your specific "Monthly Expenses" later.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><ShieldCheck className="w-6 h-6" /></div>
                        2. Follow the Order
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        The "Prime Directive" (the flowchart this is based on) is mathematically ordered for the highest efficiency.
                        Do not skip steps. Getting an employer match (100% return) is mathematically better than paying off a 4% mortgage.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><CheckCircle2 className="w-6 h-6" /></div>
                        3. Complete Action Items
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        The sidebar tracks "Side Quests" (Action Items). These are real-world tasks like "Log into Vanguard" or "Call HR".
                        The tool is useless if you don't actually move the money!
                    </p>
                </section>

                <div className="mt-16 p-8 bg-secondary rounded-3xl text-center">
                    <h3 className="text-2xl font-bold mb-4">Ready to begin?</h3>
                    <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity">
                        Start the Quest <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}
