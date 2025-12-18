"use client";

import { Footer } from "@/widgets/Footer/Footer";
import dynamic from "next/dynamic";

const QuestFlow = dynamic(() => import("@/widgets/QuestFlow/QuestFlow").then((mod) => mod.QuestFlow), {
    ssr: false,
    loading: () => <div className="w-full h-[600px] animate-pulse bg-muted/10 rounded-3xl" />
});
const QuestBar = dynamic(() => import("@/widgets/QuestBar/QuestBar").then((mod) => mod.QuestBar), {
    ssr: false,
    loading: () => <div className="hidden lg:flex flex-col w-80 h-screen sticky top-0 bg-background/50 border-r border-border p-6" />
});
const ActionBoard = dynamic(() => import("@/widgets/ActionBoard/ActionBoard").then((mod) => mod.ActionBoard), {
    ssr: false,
    loading: () => <div className="hidden xl:flex flex-col w-80 h-screen sticky top-0 bg-background/50 border-l border-border p-6" />
});

export default function Home() {
    return (
        <main className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
            <QuestBar />
            <div className="flex-1 flex flex-col items-center justify-start pt-12 lg:pt-24 pb-12 px-4 overflow-y-auto">
                <div className="w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex mb-8 lg:mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-center bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
                        Financial Quest
                    </h1>
                </div>

                <QuestFlow />
                <Footer />
            </div>
            <ActionBoard />
        </main>
    );
}
