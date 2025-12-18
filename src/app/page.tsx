"use client";

import { QuestFlow } from "@/widgets/QuestFlow/QuestFlow";
import { QuestBar } from "@/widgets/QuestBar/QuestBar";
import { ActionBoard } from "@/widgets/ActionBoard/ActionBoard";
import { Footer } from "@/widgets/Footer/Footer";

export default function Home() {
    return (
        <main className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
            <QuestBar />
            <div className="flex-1 flex flex-col items-center justify-start pt-12 lg:pt-24 pb-12 px-4 overflow-y-auto">
                <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex mb-8 lg:mb-12">
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
