import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Word } from "./Captions";
import { clamp, fmtMoney, GlassPanel, Label, LogoPlate, OUT, useProgress } from "./Glass";
import { accentA, theme } from "./theme";

const logos = {
  action: { src: staticFile("logos/action.png"), bg: "#ffffff" },
  happy: { src: staticFile("logos/happy.png"), bg: "#95c241" },
  braga: { src: staticFile("logos/braga.png"), bg: "#1a1a18" },
  vista: { src: staticFile("logos/vista.png"), bg: "#ffffff" },
};

const CARD: React.CSSProperties = { right: 90, top: 110, width: 640 };

const Header: React.FC<{ logo: keyof typeof logos; name: string; tag: string }> = ({
  logo,
  name,
  tag,
}) => {
  const p = useProgress(10, 18);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <Label>Client result · {tag}</Label>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <LogoPlate {...logos[logo]} />
        <div
          style={{
            fontWeight: 700,
            fontSize: 40,
            lineHeight: 1.05,
            opacity: p,
            translate: `${(1 - p) * 16}px 0`,
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
};

const BigNumber: React.FC<{
  value: number;
  format: (n: number) => string;
  start: number;
  caption: string;
}> = ({ value, format, start, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = useProgress(start, 1.3 * fps);
  const glow = interpolate(frame, [start + 1.2 * fps, start + 1.5 * fps, start + 2.4 * fps], [0, 1, 0.5], clamp);
  const cap = useProgress(start + 0.6 * fps, 16);
  return (
    <div style={{ marginTop: 30 }}>
      <div
        style={{
          fontWeight: 800,
          fontSize: 112,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: theme.accent,
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 ${50 * glow}px ${accentA(0.5 * glow)}`,
        }}
      >
        {format(value * count)}
      </div>
      <div
        style={{
          fontWeight: 600,
          fontSize: 30,
          color: "rgba(246,244,239,0.82)",
          marginTop: 10,
          opacity: cap,
        }}
      >
        {caption}
      </div>
    </div>
  );
};

const Divider = () => (
  <div style={{ height: 1, background: "rgba(255,255,255,0.14)", margin: "30px 0 26px" }} />
);

// Ad spend vs revenue bars — the gap is the story.
const SpendVsRevenue: React.FC<{ start: number }> = ({ start }) => {
  const { fps } = useVideoConfig();
  const rows = [
    { label: "Ad spend", value: 3200, width: 0.03, color: "rgba(246,244,239,0.55)" },
    { label: "Revenue added", value: 190000, width: 1, color: theme.accent },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {rows.map((r, i) => (
        <Bar key={r.label} {...r} start={start + i * 0.35 * fps} />
      ))}
    </div>
  );
};

const Bar: React.FC<{ label: string; value: number; width: number; color: string; start: number }> = ({
  label,
  value,
  width,
  color,
  start,
}) => {
  const { fps } = useVideoConfig();
  const p = useProgress(start, 1.1 * fps);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(246,244,239,0.7)",
          marginBottom: 10,
          opacity: Math.min(1, p * 3),
        }}
      >
        <span>{label}</span>
        <span style={{ color, fontVariantNumeric: "tabular-nums" }}>{fmtMoney(value * p)}</span>
      </div>
      <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.08)" }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(width, 0.015) * p * 100}%`,
            borderRadius: 7,
            background: color === theme.accent ? `linear-gradient(90deg, ${theme.accentDeep}, ${theme.accent})` : color,
            boxShadow: color === theme.accent ? `0 0 20px ${accentA(0.5)}` : undefined,
          }}
        />
      </div>
    </div>
  );
};

// Ring that fills as the day counter runs up.
const DaysRing: React.FC<{ days: number; start: number }> = ({ days, start }) => {
  const { fps } = useVideoConfig();
  const p = useProgress(start, 1.4 * fps);
  const r = 66;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ position: "relative", width: 160, height: 160 }}>
        <svg width={160} height={160} style={{ position: "absolute", rotate: "-90deg" }}>
          <circle cx={80} cy={80} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={10} />
          <circle
            cx={80}
            cy={80}
            r={r}
            fill="none"
            stroke={theme.accent}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - p)}
            style={{ filter: `drop-shadow(0 0 8px ${accentA(0.6)})` }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 52, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {Math.round(days * p)}
          </div>
          <div style={{ fontWeight: 600, fontSize: 20, letterSpacing: "0.16em", color: "rgba(246,244,239,0.6)" }}>
            DAYS
          </div>
        </div>
      </div>
      <div style={{ fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: "rgba(246,244,239,0.82)" }}>
        Revenue in
        <br />
        <span style={{ color: theme.text, fontWeight: 700 }}>just 70 days</span>
      </div>
    </div>
  );
};

// Calendar going from sparse to booked out.
const CalendarFill: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cells = Array.from({ length: 35 });
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 8 }}>
        {days.map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 20, fontWeight: 600, color: "rgba(246,244,239,0.5)" }}>
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
        {cells.map((_, i) => {
          const weekend = i % 7 >= 5;
          const booked = !weekend && random(`cal-${i}`) < 0.92;
          const at = start + random(`cal-t-${i}`) * 1.6 * fps;
          const p = booked ? interpolate(frame, [at, at + 8], [0, 1], { ...clamp, easing: OUT }) : 0;
          return (
            <div
              key={i}
              style={{
                height: 30,
                borderRadius: 7,
                background: p > 0 ? accentA(0.25 + 0.6 * p) : "rgba(255,255,255,0.07)",
                boxShadow: p > 0.5 ? `0 0 14px ${accentA(0.35)}` : undefined,
                scale: String(1 + 0.15 * Math.sin(p * Math.PI)),
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Three job tiles that land one by one.
const ThreeJobs: React.FC<{ start: number }> = ({ start }) => {
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {[0, 1, 2].map((i) => (
        <JobTile key={i} n={i + 1} start={start + i * 0.3 * fps} />
      ))}
    </div>
  );
};

const JobTile: React.FC<{ n: number; start: number }> = ({ n, start }) => {
  const p = useProgress(start, 16);
  return (
    <div
      style={{
        flex: 1,
        height: 120,
        borderRadius: 18,
        background: accentA(0.12),
        border: `1px solid ${accentA(0.35)}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: p,
        translate: `0 ${(1 - p) * 24}px`,
      }}
    >
      <svg width={44} height={40} viewBox="0 0 44 40">
        <path
          d="M4 20 L22 5 L40 20 M9 16 V36 H35 V16"
          fill="none"
          stroke={theme.accent}
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      </svg>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.14em" }}>JOB {n}</div>
    </div>
  );
};

const ResultCard: React.FC<{ exitAt: number; children: React.ReactNode }> = ({ exitAt, children }) => (
  <GlassPanel exitAt={exitAt} style={CARD}>
    {children}
  </GlassPanel>
);

// Recap row: all four results side by side while the VO generalizes.
const Recap: React.FC<{ exitAt: number }> = ({ exitAt }) => {
  const { fps } = useVideoConfig();
  const items = [
    { logo: "action" as const, figure: "$190K", note: "in 90 days" },
    { logo: "happy" as const, figure: "$1.2M", note: "in 70 days" },
    { logo: "braga" as const, figure: "$150K", note: "in 2 months" },
    { logo: "vista" as const, figure: "$96K", note: "in month one" },
  ];
  return (
    <>
      {items.map((it, i) => (
        <Sequence key={it.logo} from={Math.round(i * 0.18 * fps)} layout="none">
          <GlassPanel
            from="up"
            exitAt={exitAt - Math.round(i * 0.18 * fps)}
            style={{ top: 70, left: 150 + i * 420, width: 360, padding: 26 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <LogoPlate {...logos[it.logo]} width={120} height={72} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 48, lineHeight: 1, color: theme.accent }}>{it.figure}</div>
                <div style={{ fontWeight: 600, fontSize: 24, color: "rgba(246,244,239,0.8)", marginTop: 6 }}>
                  {it.note}
                </div>
              </div>
            </div>
          </GlassPanel>
        </Sequence>
      ))}
    </>
  );
};

const findWord = (words: Word[], text: string, after = 0) => {
  const i = words.findIndex((w, idx) => idx >= after && w.text.trim() === text);
  if (i === -1) throw new Error(`Word "${text}" not found in captions`);
  return i;
};

// Cards are cued off the caption timings, so they re-sync automatically once
// the real voiceover timings replace the estimates.
export const Results: React.FC<{ words: Word[] }> = ({ words }) => {
  const { fps } = useVideoConfig();
  const iAction = findWord(words, "Action");
  const iHappy = findWord(words, "Happy", iAction);
  const iBraga = findWord(words, "Braga", iHappy);
  const iVista = findWord(words, "Vista", iBraga);
  const iThese = findWord(words, "These", iVista);
  const iSo = findWord(words, "So", iThese);
  const f = (i: number) => Math.round((words[i].startMs / 1000) * fps) - 6;
  const cues = [f(iAction), f(iHappy), f(iBraga), f(iVista), f(iThese), f(iSo)];
  const len = (k: number) => cues[k + 1] - cues[k];

  return (
    <AbsoluteFill>
      <Sequence from={cues[0]} durationInFrames={len(0)} layout="none">
        <ResultCard exitAt={len(0)}>
          <Header logo="action" name="Action Roofing" tag="90 days" />
          <BigNumber value={190000} format={fmtMoney} start={18} caption="added in 90 days" />
          <Divider />
          <SpendVsRevenue start={34} />
        </ResultCard>
      </Sequence>
      <Sequence from={cues[1]} durationInFrames={len(1)} layout="none">
        <ResultCard exitAt={len(1)}>
          <Header logo="happy" name="Happy Roofing" tag="70 days" />
          <BigNumber value={1.2} format={(n) => `$${n.toFixed(1)}M`} start={18} caption="in revenue generated" />
          <Divider />
          <DaysRing days={70} start={30} />
        </ResultCard>
      </Sequence>
      <Sequence from={cues[2]} durationInFrames={len(2)} layout="none">
        <ResultCard exitAt={len(2)}>
          <Header logo="braga" name="Braga Brothers Contracting" tag="2 months" />
          <BigNumber value={150000} format={fmtMoney} start={18} caption="in booked jobs in two months" />
          <Divider />
          <CalendarFill start={28} />
        </ResultCard>
      </Sequence>
      <Sequence from={cues[3]} durationInFrames={len(3)} layout="none">
        <ResultCard exitAt={len(3)}>
          <Header logo="vista" name="Vista Roofing" tag="Month one" />
          <BigNumber value={96000} format={fmtMoney} start={18} caption="in their very first month" />
          <Divider />
          <ThreeJobs start={30} />
        </ResultCard>
      </Sequence>
      <Sequence from={cues[4]} durationInFrames={len(4)} layout="none">
        <Recap exitAt={len(4)} />
      </Sequence>
    </AbsoluteFill>
  );
};
