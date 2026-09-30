import { ImageResponse } from "next/og";

export const alt = "EarnPouch: Make your money go further";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "#f8fafc", color: "#0f172a", padding: "72px", flexDirection: "column", justifyContent: "space-between", border: "18px solid #d1fae5" }}><div style={{ display: "flex", alignItems: "center", gap: "14px", color: "#0f172a", fontSize: 38, fontWeight: 700 }}>EarnPouch<span style={{ width: 14, height: 14, borderRadius: "50%", background: "#16a34a" }} /></div><div style={{ display: "flex", flexDirection: "column", maxWidth: "900px" }}><div style={{ color: "#2563eb", fontSize: 20, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>Everyday money, made more manageable</div><div style={{ marginTop: 24, fontSize: 74, lineHeight: 1.05, fontWeight: 700 }}>Make your money go further.</div><div style={{ marginTop: 25, color: "#475569", fontSize: 26 }}>Reward apps · Side hustles · Smarter budgets · Remote work</div></div><div style={{ color: "#15803d", fontSize: 22, fontWeight: 600 }}>earnpouch.com</div></div>, size);
}