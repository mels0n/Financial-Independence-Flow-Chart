import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Financial Quest - Path to Financial Independence";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

// Arcade-ledger world (DESIGN.md): teal-ink ground, faint grid, verdigris voice.
const GROUND = "#0c191d";
const GROUND_2 = "#12242a";
const GRID_LINE = "rgba(45, 212, 180, 0.08)";
const VERDIGRIS = "#2dd4b4";
const INK = "#e6efec";
const MUTED = "#8fa6a2";
const GROUND_ON_ACCENT = "#08211c";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: `linear-gradient(to bottom right, ${GROUND}, ${GROUND_2})`,
                    color: INK,
                    fontFamily: "sans-serif",
                }}
            >
                {/* Quest-board grid ground */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage:
                            `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
                        backgroundSize: "44px 44px",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            fontSize: 76,
                            fontWeight: 800,
                            letterSpacing: "-0.03em",
                            marginBottom: 18,
                            color: INK,
                            display: "flex",
                        }}
                    >
                        Financial Quest
                    </div>

                    <div
                        style={{
                            fontSize: 30,
                            color: MUTED,
                            marginBottom: 56,
                            fontWeight: 500,
                        }}
                    >
                        Every dollar gets a job. Every number shows its math.
                    </div>

                    <div
                        style={{
                            padding: "16px 48px",
                            backgroundColor: VERDIGRIS,
                            color: GROUND_ON_ACCENT,
                            fontSize: 28,
                            fontWeight: 700,
                            borderRadius: 16,
                            boxShadow: "0 16px 40px -12px rgba(45, 212, 180, 0.35)",
                        }}
                    >
                        Start the quest
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
