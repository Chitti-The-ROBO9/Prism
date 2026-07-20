import { ImageResponse } from "next/og";

export const alt = "Prism decision workspace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", color: "#F9F9FF", background: "linear-gradient(135deg, #17172D 0%, #302C67 60%, #15515F 100%)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 34, fontWeight: 700 }}><div style={{ display: "flex", width: 34, height: 34, border: "4px solid #AFA9FF", borderRadius: 8, transform: "rotate(30deg)" }} /> Prism</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}><div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.04, letterSpacing: -4, fontWeight: 700 }}><span>Understand your decision</span><span>before you make it.</span></div><div style={{ display: "flex", fontSize: 28, color: "#D4D2EE" }}>A workspace for perspectives, trade-offs, and uncertainty.</div></div>
      <div style={{ display: "flex", gap: "16px", fontSize: 21, color: "#D8D5FF" }}><span>Structure, not verdicts</span><span>/</span><span>Reflection, not recommendation</span></div>
    </div>,
    size
  );
}
