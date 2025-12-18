import Link from "next/link";

export function Footer() {
    return (
        <footer className="py-6 text-center text-xs text-muted-foreground mt-auto w-full">
            <div className="flex justify-center gap-6 mb-2">
                <Link href="/howto" className="hover:text-primary transition-colors">How to Use</Link>
                <span className="text-border">|</span>
                <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            </div>
            <p className="opacity-50">
                Financial Quest &copy; {new Date().getFullYear()}
            </p>
        </footer>
    );
}
