import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "../Ad/adTheme";

// Brand blue: readable on both the white pills and the black headline.
const BLUE = "#2f86f6";

// Screenshot on a white card, like a pasted dashboard crop.
const Shot: React.FC<{ src: string; left: number; top: number; width: number; aspect: number; rotate: number }> = ({
  src,
  left,
  top,
  width,
  aspect,
  rotate,
}) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      width,
      height: width / aspect,
      rotate: `${rotate}deg`,
      borderRadius: 16,
      padding: 10,
      background: "#fff",
      boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      boxSizing: "content-box",
    }}
  >
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", display: "block", borderRadius: 8 }} />
  </div>
);

const Pill: React.FC<{ left: number; top: number; lines: [string, string] }> = ({ left, top, lines }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      padding: "16px 26px",
      borderRadius: 20,
      background: "#fff",
      color: BLUE,
      fontSize: 40,
      fontWeight: 600,
      lineHeight: 1.12,
      textAlign: "center",
      letterSpacing: "-0.01em",
      boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
    }}
  >
    {lines[0]}
    <br />
    {lines[1]}
  </div>
);

// Curved hand-drawn style arrow from (x1,y1) to (x2,y2), bowing by `bend`.
const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; bend: number }> = ({ x1, y1, x2, y2, bend }) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const cx = mx - (dy / len) * bend;
  const cy = my + (dx / len) * bend;
  // Arrowhead along the curve's end tangent.
  const tx = x2 - cx;
  const ty = y2 - cy;
  const tl = Math.hypot(tx, ty);
  const ux = tx / tl;
  const uy = ty / tl;
  const h = 30;
  const w = 18;
  const head = `M${x2 - ux * h - uy * w} ${y2 - uy * h + ux * w} L${x2} ${y2} L${x2 - ux * h + uy * w} ${y2 - uy * h - ux * w}`;
  return (
    <>
      <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} fill="none" stroke={BLUE} strokeWidth={8} strokeLinecap="round" />
      <path d={head} fill="none" stroke={BLUE} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
};

// 4:5 client-result post: Alvolution x Happy Roofing, $1.2M in 70 days.
export const ResultPost: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: "Inter", color: "#fff", overflow: "hidden" }}>
    <Img src={staticFile("static/house.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.25))" }} />

    {/* Co-brand bar */}
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 46,
        translate: "-50% 0",
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "16px 28px",
        borderRadius: 18,
        background: "#0d0d0d",
        whiteSpace: "nowrap",
      }}
    >
      <Img src={staticFile("brand/av-logo-dark.png")} style={{ width: 62, height: 62 }} />
      <div style={{ fontWeight: 600, fontSize: 30, letterSpacing: "0.04em" }}>ALVOLUTION ENTERPRISES</div>
      <div style={{ fontSize: 40, fontWeight: 300 }}>×</div>
      <div style={{ height: 62, padding: "6px 12px", borderRadius: 10, background: "#95c241", display: "flex", alignItems: "center" }}>
        <Img src={staticFile("logos/happy.png")} style={{ height: "100%" }} />
      </div>
    </div>

    <Shot src="static/closed.jpg" left={392} top={178} width={620} aspect={798 / 413} rotate={1.5} />
    <Shot src="static/spend.jpg" left={48} top={560} width={760} aspect={928 / 264} rotate={-1.5} />

    <Pill left={48} top={250} lines={["$1,241,182", "in revenue"]} />
    <Pill left={826} top={700} lines={["$118K", "ad spend"]} />

    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {/* to the Combined $1,241,182 figure */}
      <Arrow x1={175} y1={374} x2={600} y2={508} bend={120} />
      {/* to the Total Meta ad spend $118,797.26 */}
      <Arrow x1={915} y1={692} x2={815} y2={622} bend={-30} />
    </svg>

    {/* Headline */}
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 822,
        padding: "30px 30px 36px",
        borderRadius: 34,
        background: "#0b0b0b",
        textAlign: "center",
        fontWeight: 800,
        fontSize: 80,
        lineHeight: 0.96,
        letterSpacing: "-0.035em",
      }}
    >
      OUR ROOFING
      <br />
      CLIENT MADE
      <br />
      <span style={{ color: BLUE }}>$1.2M</span>
      <br />
      IN 70 DAYS
    </div>

    {/* Call to action */}
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: 30,
        padding: "18px 24px",
        borderRadius: 20,
        background: BLUE,
        textAlign: "center",
        fontWeight: 700,
        fontSize: 34,
        whiteSpace: "nowrap",
        letterSpacing: "-0.01em",
        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
      }}
    >
      Want results like these? Get in touch with us today
    </div>
  </AbsoluteFill>
);
