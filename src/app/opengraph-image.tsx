import { ImageResponse } from "next/og";

export const alt = "SW makes Vision — 김선우(Seonwoo Kim)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0d12",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          <span style={{ color: "#22d3ee" }}>SW</span>
          <span style={{ color: "#f1f5f9", margin: "0 24px" }}>makes</span>
          <span style={{ color: "#22d3ee" }}>Vision</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: "#8b95a3",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
          }}
        >
          김선우(Seonwoo Kim)
        </div>
      </div>
    ),
    { ...size }
  );
}
