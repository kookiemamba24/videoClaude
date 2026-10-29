import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "../Ad/adTheme";

const BLUE = "#2f86f6";
const INK = "#111";
// Hard offset shadow + thick ink border: the comic-panel look.
const inked = (shadow = 10): React.CSSProperties => ({
  border: `7px solid ${INK}`,
  boxShadow: `${shadow}px ${shadow}px 0 ${INK}`,
});

const Panel: React.FC<{
  src: string;
  left: number;
  rotate: number;
  label: string;
  labelBg: string;
  caption: string;
}> = ({ src, left, rotate, label, labelBg, caption }) => (
  <div style={{ position: "absolute", left, top: 70, width: 470, height: 860, rotate: `${rotate}deg` }}>
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#fff", ...inked(12) }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "70% 55%" }} />
    </div>
    {/* Label tab, comic "caption box" style */}
    <div
      style={{
        position: "absolute",
        left: -14,
        top: -26,
        padding: "12px 26px",
        background: labelBg,
        color: "#fff",
        fontWeight: 900,
        fontSize: 54,
        lineHeight: 1,
        letterSpacing: "0.02em",
        rotate: "-3deg",
        ...inked(7),
        borderWidth: 6,
      }}
    >
      {label}
    </div>
    {/* Narration box along the bottom */}
    <div
      style={{
        position: "absolute",
        left: 18,
        right: 18,
        bottom: 22,
        padding: "16px 18px",
        background: "#fff",
        color: INK,
        textAlign: "center",
        fontWeight: 900,
        fontSize: 38,
        lineHeight: 1.04,
        letterSpacing: "-0.015em",
        ...inked(7),
        borderWidth: 5,
      }}
    >
      {caption}
    </div>
  </div>
);

export const BeforeAfterComic: React.FC = () => (
  <AbsoluteFill
    style={{
      fontFamily: "Inter",
      // Comic-book blue: halftone dots over a radial burst of light.
      background:
        "radial-gradient(circle, rgba(255,255,255,0.28) 2.6px, transparent 3px) 0 0 / 20px 20px, radial-gradient(ellipse 80% 70% at 50% 40%, #5aa9ff 0%, #2f86f6 55%, #1c5fc4 100%)",
    }}
  >
    <Panel
      src="static/ba-before.jpg"
      left={42}
      rotate={-1.6}
      label="BEFORE"
      labelBg={INK}
      caption="SICK AND TIRED OF BEING BURNED BY AGENCIES"
    />
    <Panel src="static/ba-after.jpg" left={556} rotate={1.6} label="AFTER" labelBg={BLUE} caption="WORKING WITH US" />

    {/* Speech bubble from the mouth in the AFTER panel */}
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
      <g style={{ filter: "drop-shadow(8px 8px 0 #111)" }}>
        <path d="M806 318 L898 402 L842 310 Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
        <ellipse cx={745} cy={250} rx={170} ry={78} fill="#fff" stroke={INK} strokeWidth={7} />
        {/* Cover the tail's join so bubble and tail read as one shape */}
        <path d="M810 314 L894 394 L838 306 Z" fill="#fff" />
      </g>
    </svg>
    <div
      style={{
        position: "absolute",
        left: 745 - 170,
        top: 250 - 27,
        width: 340,
        textAlign: "center",
        fontWeight: 900,
        fontSize: 52,
        lineHeight: 1,
        letterSpacing: "-0.03em",
        color: INK,
        rotate: "-4deg",
      }}
    >
      OH <span style={{ color: BLUE }}>YEAH!!!</span>
    </div>

    {/* Guarantee banner */}
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: 1010,
        padding: "34px 30px 38px",
        background: "#fff",
        textAlign: "center",
        color: INK,
        rotate: "-0.8deg",
        ...inked(12),
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 70, lineHeight: 1, letterSpacing: "-0.03em" }}>
        <span style={{ color: BLUE }}>6–12</span> MORE BOOKED
        <br />
        JOBS GUARANTEED
      </div>
      <div style={{ fontWeight: 900, fontSize: 34, marginTop: 16, letterSpacing: "-0.01em" }}>
        (OR WE WORK FOR FREE UNTIL YOU HIT IT)
      </div>
    </div>
  </AbsoluteFill>
);
