import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
    themeColor: "#4f46e5",
    width: "device-width",
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL("https://financial-independence.melson.us"),
    title: {
        default: "Financial Quest | Path to Independence",
        template: "%s | Financial Quest",
    },
    description: "A guided interactive flow to financial calm. Visualize your path to financial independence with our step-by-step flowchart tool.",
    applicationName: "Financial Quest",
    authors: [{ name: "Christopher Melson", url: "https://chris.melson.us/" }],
    creator: "Christopher Melson",
    publisher: "Christopher Melson",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "Financial Quest | Path to Independence",
        description: "Visualize your path to financial independence. An interactive guide based on proven personal finance principles.",
        url: "https://financial-independence.melson.us",
        siteName: "Financial Quest",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Financial Quest | Path to Independence",
        description: "Visualize your path to financial independence.",
        creator: "@melson",
    },
    icons: {
        icon: "/icon.png",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Financial Quest",
    "url": "https://financial-independence.melson.us",
    "description": "A guided path to financial calm using Flowchart methodology.",
    "applicationCategory": "GenericApplication",
    "operatingSystem": "Any",
    "author": {
        "@type": "Person",
        "name": "Christopher Melson",
        "url": "https://chris.melson.us/"
    },
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className + " min-h-screen bg-background flex flex-col"}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {children}
            </body>
        </html>
    );
}
