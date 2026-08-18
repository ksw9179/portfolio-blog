"use client";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background: "#0a0d12",
          color: "#f1f5f9",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#22d3ee",
            margin: 0,
          }}
        >
          Error
        </p>
        <h1 style={{ fontSize: 40, fontWeight: 900, margin: 0 }}>
          Something Went Wrong
        </h1>
        <p style={{ color: "#8b95a3", margin: 0 }}>
          예기치 못한 오류가 발생했습니다.
        </p>
        <button
          onClick={() => retry()}
          style={{
            marginTop: 16,
            borderRadius: 999,
            border: "none",
            background: "#22d3ee",
            color: "#0a0d12",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 14,
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
