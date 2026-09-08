"use client";

import { Footer } from "@/widgets/Footer/Footer";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Sheet } from "@/shared/ui/Sheet/Sheet";
import { MobileHeader } from "@/widgets/MobileHeader/MobileHeader";
import { useFinancialStore } from "@/entities/financial/model/financialStore";

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
const MilestoneToast = dynamic(() => import("@/widgets/MilestoneToast/MilestoneToast").then((mod) => mod.MilestoneToast), {
    ssr: false,
});

export function HomeClient() {
    const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);
    const [isActionBoardOpen, setIsActionBoardOpen] = useState(false);
    const { actionItems } = useFinancialStore();

    const pendingActionItems = actionItems.filter(i => !i.completed).length;

    return (
        <main className="flex min-h-screen bg-background text-foreground pt-16 lg:pt-0">
            <MobileHeader
                onOpenQuestLog={() => setIsQuestLogOpen(true)}
                onOpenActionBoard={() => setIsActionBoardOpen(true)}
                actionItemsCount={pendingActionItems}
            />

            <Sheet isOpen={isQuestLogOpen} onClose={() => setIsQuestLogOpen(false)} side="left">
                <QuestBar className="flex w-full h-full border-none" />
            </Sheet>

            <Sheet isOpen={isActionBoardOpen} onClose={() => setIsActionBoardOpen(false)} side="right">
                <ActionBoard className="flex w-full h-full border-none" />
            </Sheet>

            <QuestBar />

            <div className="quest-ground flex-1 flex flex-col items-center justify-start pt-8 lg:pt-16 pb-12 px-4 overflow-y-auto">
                <header className="w-full max-w-2xl mx-auto mb-8 lg:mb-10 text-center">
                    <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-foreground [text-wrap:balance]">
                        Financial Quest
                    </h1>
                    <p className="mt-2 text-sm md:text-base text-muted-foreground">
                        Every dollar gets a job. Every number shows its math.
                    </p>
                </header>

                <QuestFlow />

                <div className="w-full max-w-2xl mx-auto my-8 rounded-xl border border-warning/30 bg-warning/10 p-4 text-center">
                    <p className="text-xs text-warning leading-relaxed">
                        <strong>Disclaimer:</strong> This application is for educational purposes only. It is not financial, legal, or tax advice.
                        The figures (tax brackets, limits) are based on official IRS data.
                        Consult a CPA or fiduciary for personalized advice.
                    </p>
                </div>

                <Footer />
            </div>

            <ActionBoard />
            <MilestoneToast />
        </main>
    );
}
