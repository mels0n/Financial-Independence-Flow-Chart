import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Financial Quest",
    description: "A guided path to financial calm.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className + " min-h-screen bg-background flex flex-col"}>
                {children}
                <footer className="py-6 text-center text-xs text-muted-foreground mt-auto">
                    <div className="flex justify-center gap-6 mb-2">
                        <a href="/howto" className="hover:text-primary transition-colors">How to Use</a>
                        <span className="text-border">|</span>
                        <a href="/faq" className="hover:text-primary transition-colors">FAQ</a>
                    </div>
                    <p className="opacity-50">
                        Financial Quest &copy; {new Date().getFullYear()}
                    </p>
                </footer>
            </body>
        </html>
    );
}
