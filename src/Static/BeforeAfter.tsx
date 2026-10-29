import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import "../Ad/adTheme";

const BLUE = "#2f86f6";
// Panel edges in the 2000x2000 source collage.
const LEFT = { x0: 16, x1: 988 };
const RIGHT = { x0: 1007, x1: 1985 };

const Tag: React.FC<{ text: string; bg: string; cx: number; top: number }> = ({ text, bg, cx, top }) => (
  <div
    style={{
      position: "absolute",
      left: cx,
      top,
      translate: "-50% 0",
      padding: "18px 54px",
      borderRadius: 24,
      background: bg,
      color: "#fff",
      fontWeight: 900,
      fontSize: 110,
      letterSpacing: "0.02em",
      lineHeight: 1,
      boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
    }}
  >
    {text}
  </div>
);

const Line: React.FC<{
  children: React.ReactNode;
  cx: number;
  top: number;
  width: number;
  size: number;
  nowrap?: boolean;
}> = ({ children, cx, top, width, size, nowrap }) => (
  <div
    style={{
      position: "absolute",
      left: cx - width / 2,
      top,
      width,
      textAlign: "center",
      color: "#fff",
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1.02,
      letterSpacing: "-0.02em",
      whiteSpace: nowrap ? "nowrap" : undefined,
      textShadow: "0 4px 18px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.6)",
    }}
  >
    {children}
  </div>
);

export const BeforeAfter: React.FC = () => {
  const lc = (LEFT.x0 + LEFT.x1) / 2;
  const rc = (RIGHT.x0 + RIGHT.x1) / 2;
  return (
    <AbsoluteFill style={{ fontFamily: "Inter", background: "#fff" }}>
      <Img src={staticFile("static/before-after.jpg")} style={{ width: 2000, height: 2000 }} />

      {/* Bottom shade on the left so the caption reads over the bedding. */}
      <div
        style={{
          position: "absolute",
          left: LEFT.x0,
          width: LEFT.x1 - LEFT.x0,
          top: 1440,
          height: 1983 - 1440,
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.72) 55%)",
        }}
      />

      <Tag text="BEFORE" bg="#111" cx={lc} top={110} />
      <Line cx={lc} top={1600} width={900} size={96}>
        SICK AND TIRED OF BEING BURNED BY AGENCIES
      </Line>

      <Tag text="AFTER" bg={BLUE} cx={rc} top={110} />
      <Line cx={rc} top={290} width={960} size={100} nowrap>
        WORKING WITH US
      </Line>
    </AbsoluteFill>
  );
};
