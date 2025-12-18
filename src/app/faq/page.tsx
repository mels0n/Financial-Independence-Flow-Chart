import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { Footer } from "@/widgets/Footer/Footer";

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-background text-foreground p-8 max-w-3xl mx-auto">
            <header className="mb-12">
                <Link href="/" className="text-primary hover:underline mb-4 inline-block">&larr; Back to Quest</Link>
                <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            </header>

            <div className="space-y-8">
                <div className="p-6 bg-card border border-border rounded-2xl">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-muted-foreground" />
                        Is this financial advice?
                    </h3>
                    <p className="text-muted-foreground">
                        <strong>No.</strong> This is an educational tool based on the <Link href="https://imgur.com/lSoyGJE" target="_blank" className="text-primary underline">flowchart by u/happyasianpanda</Link> from r/personalfinance.
                        It visualizes general principles. We do not know your specific tax situation, dependents, or local laws.
                        Consult a CPA or fiduciary for personalized advice.
                    </p>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-muted-foreground" />
                        Why 2025/2026 Limits?
                    </h3>
                    <p className="text-muted-foreground">
                        We default to forward-looking limits so you can plan your upcoming year.
                        Tax limits (like 401k max) often change slightly each year due to inflation adjustments.
                    </p>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-muted-foreground" />
                        Where is my data stored?
                    </h3>
                    <p className="text-muted-foreground">
                        <strong>Nowhere.</strong> Everything is stored locally in your browser/memory state while you run the session.
                        If you refresh, it resets (unless we add local storage features later). We do not send your data to any server.
                    </p>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-muted-foreground" />
                        What is "FSD"?
                    </h3>
                    <p className="text-muted-foreground">
                        Feature-Sliced Design. It's the architectural pattern used to build this codebase, ensuring it remains scalable and modular.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
