import { loadFont } from "@remotion/fonts";
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../VSL/Captions";

// "Tradie" ad style: punchy talking head with small chest captions, giant
// keywords that sit behind the speaker, mixed-font kinetic type on black
// topographic cards, cartoon/3D sticker pops, and punch-in jump cuts.

loadFont({ family: "Montserrat", url: staticFile("fonts/Montserrat-700.woff2"), weight: "700" });
loadFont({ family: "Montserrat", url: staticFile("fonts/Montserrat-800.woff2"), weight: "800" });
loadFont({ family: "Montserrat", url: staticFile("fonts/Montserrat-900.woff2"), weight: "900" });
loadFont({ family: "Montserrat", url: staticFile("fonts/Montserrat-800i.woff2"), weight: "800", style: "italic" });
loadFont({ family: "BarlowCond", url: staticFile("fonts/BarlowCond-800i.woff2"), weight: "800", style: "italic" });
loadFont({ family: "Cormorant", url: staticFile("fonts/Cormorant-600.woff2"), weight: "600" });

// Accent is Alvolution blue (the reference used yellow; `yellow` is kept as
// an alias so existing call sites keep working).
export const T = {
  accent: "#4da3ff",
  yellow: "#4da3ff",
  white: "#ffffff",
  sans: "Montserrat",
  cond: "BarlowCond",
  serif: "Cormorant",
  shadow: "0 4px 18px rgba(0,0,0,0.55), 0 2px 3px rgba(0,0,0,0.5)",
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const back = (s = 1.8) => Easing.out(Easing.back(s));

// Blur-and-scale entrance used by every text element in the style.
const useEnter = (at = 0, dur = 6) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: back(1.6) });
  return {
    opacity: Math.min(1, p * 1.6),
    scale: String(0.7 + 0.3 * p),
    filter: `blur(${(1 - Math.min(1, p)) * 14}px)`,
  } as React.CSSProperties;
};

// --- Talking head with punch-in jump cuts ----------------------------------

// Alternates framing between `wide` (1.0) and `tight` at each cut, with a
// 3-frame zoom-blur on the cut so it reads as an edit, not a glitch.
export const PunchFootage: React.FC<{ src: string; cuts: number[]; tight?: number; person?: React.ReactNode }> = ({
  src,
  cuts,
  tight = 1.14,
}) => {
  const frame = useCurrentFrame();
  const idx = cuts.filter((c) => frame >= c).length;
  const z = idx % 2 === 0 ? 1 : tight;
  const last = cuts.filter((c) => frame >= c).pop() ?? -99;
  const kick = interpolate(frame - last, [0, 3], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ scale: String(z * (1 + kick * 0.05)), transformOrigin: "50% 32%", filter: kick > 0 ? `blur(${kick * 6}px)` : undefined }}>
      <OffthreadVideo src={src} />
    </AbsoluteFill>
  );
};

// Speaker-only layer (transparent webm from scripts/make-person-matte.py),
// drawn above "behind" text so the words sit between background and person.
export const PersonLayer: React.FC<{ src: string; cuts: number[]; tight?: number }> = ({ src, cuts, tight = 1.14 }) => {
  const frame = useCurrentFrame();
  const idx = cuts.filter((c) => frame >= c).length;
  const z = idx % 2 === 0 ? 1 : tight;
  const last = cuts.filter((c) => frame >= c).pop() ?? -99;
  const kick = interpolate(frame - last, [0, 3], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ scale: String(z * (1 + kick * 0.05)), transformOrigin: "50% 32%" }}>
      <OffthreadVideo src={src} transparent muted />
    </AbsoluteFill>
  );
};

// --- Small chest captions ---------------------------------------------------

type Chunk = { text: string; from: number; to: number };

const chunkWords = (words: Word[], fps: number, max = 3): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const t = w.text.trim();
    if (!next || cur.length >= max || /[.,!?]$/.test(t) || next.startMs - w.endMs > 250) {
      out.push({
        text: cur.map((c) => c.text.trim()).join(" ").replace(/[.,!?]+$/g, ""),
        from: Math.round((cur[0].startMs / 1000) * fps),
        to: Math.round(((next ? next.startMs : w.endMs + 400) / 1000) * fps),
      });
      cur = [];
    }
  });
  return out;
};

const HIGHLIGHT = /^(roofers?|january|christmas|booked|guaranteed|free|homeowners|simple)$/i;

const ChestLine: React.FC<{ text: string; y: number; size?: number }> = ({ text, y, size = 46 }) => {
  const enter = useEnter(0, 4);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        textAlign: "center",
        fontFamily: T.sans,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.01em",
        color: T.white,
        textTransform: "uppercase",
        textShadow: T.shadow,
        ...enter,
      }}
    >
      {text.split(" ").map((w, i) => {
        const hot = /\d/.test(w) || HIGHLIGHT.test(w.replace(/[^a-z]/gi, ""));
        return (
          <span key={i} style={{ color: hot ? T.accent : T.white }}>
            {i ? " " : ""}
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Small, centred, 1-3 word captions at chest height. `hide` frame ranges
// (e.g. while a keyword slam or black card is up) suppress them.
export const ChestCaptions: React.FC<{ words: Word[]; y?: number; hide?: [number, number][] }> = ({ words, y = 1060, hide = [] }) => {
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => chunkWords(words, fps), [words, fps]);
  return (
    <>
      {chunks
        .filter((c) => !hide.some(([a, b]) => c.from < b && c.to > a))
        .map((c, i) => (
          <Sequence key={i} from={c.from} durationInFrames={Math.max(1, c.to - c.from)} layout="none">
            <ChestLine text={c.text} y={i === 0 ? y - 30 : y} size={i === 0 ? 96 : 46} />
          </Sequence>
        ))}
    </>
  );
};

// --- Giant keywords ---------------------------------------------------------

// Huge heavy words stacked near the top of frame; render this *between*
// PunchFootage and PersonLayer so the speaker's head overlaps them.
export const KeywordSlam: React.FC<{
  lines: { text: string; color?: string; size?: number; font?: "sans" | "cond" }[];
  top?: number;
  stagger?: number;
}> = ({ lines, top = 150, stagger = 4 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center" }}>
    {lines.map((l, i) => (
      <SlamLine key={i} {...l} at={i * stagger} />
    ))}
  </div>
);

const SlamLine: React.FC<{ text: string; color?: string; size?: number; font?: "sans" | "cond"; at: number }> = ({
  text,
  color = T.white,
  size = 230,
  font = "sans",
  at,
}) => {
  const enter = useEnter(at, 6);
  return (
    <div
      style={{
        fontFamily: font === "cond" ? T.cond : T.sans,
        fontStyle: font === "cond" ? "italic" : "normal",
        fontWeight: font === "cond" ? 800 : 900,
        fontSize: size,
        lineHeight: 0.86,
        letterSpacing: "-0.03em",
        color,
        textShadow: "0 10px 40px rgba(0,0,0,0.35)",
        ...enter,
      }}
    >
      {text}
    </div>
  );
};

// Hook title: small yellow line over a bigger white line, italic tag below.
export const StackedHook: React.FC<{ top: string; main: string; tag?: string; y?: number }> = ({ top, main, tag, y = 330 }) => {
  const a = useEnter(0, 6);
  const b = useEnter(3, 6);
  const c = useEnter(7, 6);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", textShadow: T.shadow }}>
      <div style={{ fontFamily: T.sans, fontWeight: 900, fontSize: 92, lineHeight: 1, color: T.yellow, ...a }}>{top}</div>
      <div style={{ fontFamily: T.sans, fontWeight: 900, fontSize: 118, lineHeight: 1, color: T.white, ...b }}>{main}</div>
      {tag ? (
        <div style={{ fontFamily: T.sans, fontStyle: "italic", fontWeight: 800, fontSize: 40, color: T.white, marginTop: 6, ...c }}>{tag}</div>
      ) : null}
    </div>
  );
};

// --- Black topographic cards ------------------------------------------------

const Topo: React.FC = () => {
  const rings = useMemo(
    () =>
      Array.from({ length: 6 }, (_, c) => {
        const cx = 80 + random(`tx${c}`) * 920;
        const cy = 120 + random(`ty${c}`) * 1680;
        return Array.from({ length: 8 }, (_, k) => {
          const r = 40 + k * 62;
          const n = 14;
          const pts = Array.from({ length: n }, (_, j) => {
            const a = (j / n) * Math.PI * 2;
            const wob = 1 + (random(`w${c}-${j}`) - 0.5) * 0.45 + (random(`v${c}-${k}-${j}`) - 0.5) * 0.08;
            return [cx + Math.cos(a) * r * wob, cy + Math.sin(a) * r * wob * 0.82] as const;
          });
          // Closed Catmull-Rom → cubic Bézier for smooth contours.
          let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
          for (let j = 0; j < n; j++) {
            const p0 = pts[(j - 1 + n) % n];
            const p1 = pts[j];
            const p2 = pts[(j + 1) % n];
            const p3 = pts[(j + 2) % n];
            d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
          }
          return <path key={`${c}-${k}`} d={d} fill="none" stroke="rgba(150,190,255,0.16)" strokeWidth={2.2} />;
        });
      }),
    [],
  );
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {rings}
    </svg>
  );
};

export type CardPart = { text: string; at?: number; style: "big" | "yellow" | "script" | "small" | "cond" };

const PART_STYLE: Record<CardPart["style"], React.CSSProperties> = {
  big: { fontFamily: T.sans, fontWeight: 900, fontSize: 168, color: T.white, letterSpacing: "-0.02em" },
  yellow: { fontFamily: T.sans, fontWeight: 900, fontSize: 176, color: T.yellow, letterSpacing: "-0.02em" },
  cond: { fontFamily: T.cond, fontStyle: "italic", fontWeight: 800, fontSize: 160, color: T.yellow },
  script: { fontFamily: T.serif, fontWeight: 600, fontSize: 108, color: T.white, letterSpacing: "0" },
  small: { fontFamily: T.sans, fontWeight: 800, fontSize: 64, color: T.white },
};

// Full-screen black card with faint contour lines and mixed-font kinetic
// type; each part pops in (with glow) at its own frame.
export const BlackCard: React.FC<{ parts: CardPart[][]; sticker?: React.ReactNode }> = ({ parts, sticker }) => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(ellipse 80% 55% at 50% 45%, #0c2552 0%, #06101f 55%, #030509 100%)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Topo />
    <div style={{ textAlign: "center", lineHeight: 0.98, position: "relative", width: 980 }}>
      {parts.map((row, r) => (
        <div key={r} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline", columnGap: 18 }}>
          {row.map((p, i) => (
            <CardWord key={i} p={p} />
          ))}
        </div>
      ))}
      {sticker ? <div style={{ marginTop: 40 }}>{sticker}</div> : null}
    </div>
  </AbsoluteFill>
);

const CardWord: React.FC<{ p: CardPart }> = ({ p }) => {
  const enter = useEnter(p.at ?? 0, 6);
  const base = PART_STYLE[p.style];
  // Heavy caps run ~0.8em per glyph; shrink long words so they never clip.
  const fit = p.style === "script" ? (base.fontSize as number) : Math.min(base.fontSize as number, Math.floor(940 / (p.text.length * 0.8)));
  const glow = p.style === "yellow" || p.style === "cond" ? "0 0 30px rgba(77,163,255,0.55)" : "0 0 26px rgba(255,255,255,0.35)";
  return <span style={{ ...base, fontSize: fit, textShadow: glow, display: "inline-block", ...enter }}>{p.text}</span>;
};

// --- Stickers ----------------------------------------------------------------

// Emoji / 3D icon sticker that pops in with overshoot and a slight wobble.
export const Sticker: React.FC<{ emoji: string; x: number; y: number; size?: number; at?: number; rotate?: number }> = ({
  emoji,
  x,
  y,
  size = 260,
  at = 0,
  rotate = -8,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 8], [0, 1], { ...clamp, easing: back(2.4) });
  const wob = Math.sin((frame - at) / 5) * 4;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        fontSize: size * 0.82,
        lineHeight: 1,
        textAlign: "center",
        fontFamily: "'Noto Color Emoji'",
        scale: String(p),
        rotate: `${rotate + wob}deg`,
        filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.45))",
      }}
    >
      {emoji}
    </div>
  );
};

// White card held up in frame, e.g. a lead magnet / offer.
export const OfferCard: React.FC<{ title: string[]; sub: string; y?: number }> = ({ title, sub, y = 1020 }) => {
  const enter = useEnter(0, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: 290,
        width: 500,
        top: y,
        padding: "40px 34px",
        borderRadius: 26,
        background: "#fff",
        textAlign: "center",
        boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
        ...enter,
      }}
    >
      {title.map((t) => (
        <div key={t} style={{ fontFamily: T.sans, fontWeight: 900, fontSize: 50, lineHeight: 1.08, color: "#111" }}>
          <span style={{ background: `linear-gradient(transparent 55%, ${T.yellow} 55%)`, padding: "0 6px" }}>{t}</span>
        </div>
      ))}
      <div style={{ fontFamily: T.sans, fontStyle: "italic", fontWeight: 800, fontSize: 24, color: "#444", marginTop: 18, lineHeight: 1.3 }}>{sub}</div>
    </div>
  );
};
