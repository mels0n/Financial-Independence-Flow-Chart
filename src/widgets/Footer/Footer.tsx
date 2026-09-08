import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-6 text-center text-xs text-muted-foreground mt-auto w-full">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-2">
                <Link href="/howto" className="hover:text-primary transition-colors">How to Use</Link>
                <span className="text-border" aria-hidden>|</span>
                <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
                <span className="text-border" aria-hidden>|</span>
                <Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link>
                <span className="text-border" aria-hidden>|</span>
                <Link href="/sources" className="hover:text-primary transition-colors">Sources &amp; Methodology</Link>
            </div>
            <p className="text-muted-foreground/60">
                &copy; {new Date().getFullYear()} <Link href="https://chris.melson.us/" target="_blank" className="hover:text-primary transition-colors">Christopher Melson</Link>. All rights reserved.
            </p>
        </footer>
    );
}
