import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 46,
        borderRadius: 180,
        background: "#071b2c",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 470,
          height: 470,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 235,
          background: "linear-gradient(135deg, #22c55e 0%, #14b8a6 100%)",
          color: "#ffffff",
          fontFamily: "Georgia, serif",
          fontSize: 340,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        $
      </div>
      <div
        style={{
          color: "#ffffff",
          fontFamily: "Georgia, serif",
          fontSize: 100,
          fontWeight: 700,
        }}
      >
        EarnPouch
      </div>
    </div>,
    {
      width: 1000,
      height: 1000,
      headers: { "Content-Disposition": "attachment; filename=earnpouch-logo.png" },
    },
  );
}
