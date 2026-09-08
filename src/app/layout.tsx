import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Public_Sans, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";
import { AEO } from "@/shared/lib/aeo";

const fontSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });
// adjustFontFallback off: Next 14.1's font metrics table does not know this face
const fontDisplay = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", adjustFontFallback: false });
const fontMono = Spline_Sans_Mono({ subsets: ["latin"], variable: "--font-mono" });

/*
DESIGN DIRECTION CONTRACT (financial-quest redesign, 2026-09-07)
THESIS: An arcade ledger. A money quest where every dollar is visible, every number
cites its IRS source, and gold appears only when earned. Refuses the pastel fintech
card-stack and the emoji-as-reward default.
OWN-WORLD: Deep teal-ink ground with a faint grid, electric verdigris voice,
reserved gold for badges/milestones, emerald strictly for money-good, amber for
caution/projected, red for genuine problems. Bricolage Grotesque display,
Public Sans body, Spline Sans Mono tabular currency.
STORY: The player sees their whole paycheck stacked in one bar, clears phases
(Foundation, Protect, Grow, Optimize), earns badges, and leaves with a cited plan.
FIRST VIEWPORT: Quest Log rail left (stacked budget bar + phase ledger + badge
shelf), one step card center with a huge recommended number and "Show the math",
Action Board right with progress. Primary action = the allocate button.
FORM: Game HUD over a ledger; user-pinned direction from the approved mockup.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/

export const viewport: Viewport = {
    themeColor: "#0b1418",
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

const jsonLd = AEO.generateWebConfig({
    name: "Financial Quest",
    url: "https://financial-independence.melson.us",
    description: "A guided path to financial calm using Flowchart methodology.",
    authorName: "Christopher Melson",
    authorUrl: "https://chris.melson.us/",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    price: "0",
    priceCurrency: "USD"
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} font-sans min-h-screen bg-background flex flex-col`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {children}
            </body>
        </html>
    );
}
