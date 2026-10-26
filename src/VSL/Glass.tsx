import React from "react";
import { Easing, Img, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0→1 progress between two frames with the house ease-out.
export const useProgress = (start: number, dur: number, easing = OUT) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing });
};

// Frosted panel that slides, unblurs and scales in, and slides out before
// `exitAt` (frames, relative to its Sequence).
export const GlassPanel: React.FC<{
  exitAt: number;
  from?: "left" | "right" | "up";
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ exitAt, from = "right", style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = useProgress(0, 0.7 * fps);
  const exit = interpolate(frame, [exitAt - 0.4 * fps, exitAt], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const dir = from === "left" ? -1 : 1;
  const offset = (1 - enter) * 90 + exit * 60;
  return (
    <div
      style={{
        position: "absolute",
        borderRadius: 30,
        padding: 36,
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.05)), rgba(12,15,20,0.72)",
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.25), 0 30px 80px rgba(0,0,0,0.45)",
        backdropFilter: "blur(28px) saturate(140%)",
        color: theme.text,
        fontFamily: theme.font,
        opacity: Math.min(enter, 1 - exit),
        translate: from === "up" ? `0 ${-offset}px` : `${dir * offset}px 0`,
        scale: String(0.96 + 0.04 * enter),
        filter: `blur(${(1 - enter) * 10 + exit * 6}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Label: React.FC<{ children: React.ReactNode; start?: number }> = ({
  children,
  start = 6,
}) => {
  const p = useProgress(start, 14);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: theme.font,
        fontWeight: 600,
        fontSize: 24,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: theme.accent,
        opacity: p,
        translate: `${(1 - p) * -12}px 0`,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: theme.accent,
          boxShadow: `0 0 12px ${theme.accent}`,
        }}
      />
      {children}
    </div>
  );
};

// Client logos keep their own background so brand colors stay intact.
export const LogoPlate: React.FC<{
  src: string;
  bg: string;
  width?: number;
  height?: number;
  start?: number;
}> = ({ src, bg, width = 200, height = 104, start = 4 }) => {
  const p = useProgress(start, 18);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 18,
        background: bg,
        padding: 10,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        opacity: p,
        scale: String(0.85 + 0.15 * p),
      }}
    >
      <Img src={src} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
    </div>
  );
};

export const fmtMoney = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
