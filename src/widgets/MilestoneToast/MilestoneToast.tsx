"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useFinancialStore } from "@/entities/financial/model/financialStore";
import { getPhase, getPhaseSteps, type PhaseId } from "@/shared/config/flow";
import { Currency } from "@/shared/ui/Currency/Currency";
import { Map, Shield, Sparkles, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const PHASE_ICONS: Record<PhaseId, LucideIcon> = {
    foundation: Map,
    protect: Shield,
    grow: Sparkles,
    optimize: Rocket,
};

const TOAST_MS = 4500;

/**
 * The one gold moment: fires when a phase is cleared. A badge is minted on the
 * Quest Log shelf; this toast plus a one-second confetti burst announces it.
 */
export function MilestoneToast() {
    const { celebratingPhase, clearCelebration, allocations } = useFinancialStore();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        if (!celebratingPhase) return;
        const timer = setTimeout(clearCelebration, TOAST_MS);
        return () => clearTimeout(timer);
    }, [celebratingPhase, clearCelebration]);

    useEffect(() => {
        if (!celebratingPhase || reducedMotion) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const styles = getComputedStyle(document.documentElement);
        const hsl = (name: string) => `hsl(${styles.getPropertyValue(name).trim()})`;
        const colors = [hsl("--reward"), hsl("--primary"), hsl("--success")];

        const ox = canvas.width / 2;
        const oy = canvas.height * 0.35;
        const parts = Array.from({ length: 90 }, (_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 7;
            return {
                x: ox, y: oy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 4,
                size: 3 + Math.random() * 4,
                rot: Math.random() * Math.PI,
                vr: (Math.random() - 0.5) * 0.3,
                color: colors[i % colors.length],
            };
        });

        let raf = 0;
        const start = performance.now();
        const frame = (now: number) => {
            const t = (now - start) / 1000;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (t > 1.4) return;
            const fade = Math.max(0, 1 - t / 1.4);
            for (const p of parts) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.18;
                p.rot += p.vr;
                ctx.save();
                ctx.globalAlpha = fade;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            }
            raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);
        return () => {
            cancelAnimationFrame(raf);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, [celebratingPhase, reducedMotion]);

    const phase = celebratingPhase ? getPhase(celebratingPhase) : null;
    const phaseTotal = celebratingPhase
        ? getPhaseSteps(celebratingPhase).reduce((acc, s) => acc + (allocations[s.id] ?? 0), 0)
        : 0;
    const Icon = celebratingPhase ? PHASE_ICONS[celebratingPhase] : Map;

    return (
        <>
            <canvas
                ref={canvasRef}
                aria-hidden
                className="pointer-events-none fixed inset-0 z-[70]"
            />
            <AnimatePresence>
                {phase && (
                    <motion.div
                        key={phase.id}
                        role="status"
                        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.94 }}
                        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                        transition={{ type: "spring", stiffness: 380, damping: 26 }}
                        className="fixed bottom-6 left-1/2 z-[71] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3.5 rounded-2xl border border-reward/50 bg-card p-4 shadow-[0_20px_60px_-20px_hsl(var(--reward)/0.45)]"
                    >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-reward/50 bg-reward/15 text-reward">
                            <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div className="min-w-0">
                            <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-reward">
                                Phase cleared · badge earned
                            </span>
                            <span className="block font-display text-base font-bold text-foreground">
                                {phase.name}: {phase.badgeName}
                            </span>
                            {phaseTotal > 0 && (
                                <span className="block text-xs text-muted-foreground">
                                    <Currency value={phaseTotal} per="mo" className="text-xs text-foreground" /> locked into the plan
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
