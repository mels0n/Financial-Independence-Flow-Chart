import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Financial Quest - Path to Financial Independence";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

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
                    backgroundImage: "linear-gradient(to bottom right, #1e1b4b, #312e81)",
                    color: "white",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Background Pattern */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage:
                            "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)",
                        backgroundSize: "100px 100px",
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
                            fontSize: 72,
                            fontWeight: 900,
                            letterSpacing: "-0.05em",
                            marginBottom: 20,
                            background: "linear-gradient(to right, #818cf8, #c7d2fe)",
                            backgroundClip: "text",
                            color: "transparent",
                            display: "flex",
                        }}
                    >
                        Financial Quest
                    </div>

                    <div
                        style={{
                            fontSize: 32,
                            color: "#a5b4fc",
                            marginBottom: 60,
                            fontWeight: 500,
                        }}
                    >
                        Path to Independence
                    </div>

                    <div
                        style={{
                            padding: "16px 48px",
                            backgroundColor: "#4f46e5",
                            color: "white",
                            fontSize: 28,
                            fontWeight: 600,
                            borderRadius: 999,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        Gain Financial Independence
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
