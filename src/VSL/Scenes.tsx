import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { Word } from "./Captions";
import { clamp, GlassPanel, Label, OUT, useProgress } from "./Glass";
import { accentA, theme } from "./theme";

const NEG = "#ff7a66";
const negA = (a: number) => `rgba(255, 122, 102, ${a})`;
const RIGHT: React.CSSProperties = { right: 56, top: 120, width: 580 };
const LEFT: React.CSSProperties = { left: 60, top: 120, width: 540 };

const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9$]/g, "");

// Finds a spoken phrase (one or more words) at or after word index `after`.
const makeCue = (words: Word[], fps: number) => {
  const find = (phrase: string, after = 0) => {
    const parts = phrase.split(" ").map(norm);
    for (let i = after; i < words.length - parts.length + 1; i++) {
      if (parts.every((p, k) => norm(words[i + k].text) === p)) return i;
    }
    throw new Error(`Phrase "${phrase}" not found in captions`);
  };
  const frameOf = (i: number) => Math.round((words[i].startMs / 1000) * fps);
  return { find, frameOf };
};

// --- Shared bits -----------------------------------------------------------

const Check: React.FC<{ p: number; size?: number; color?: string }> = ({ p, size = 26, color = theme.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path
      d="M4 12.5l5 5L20 6.5"
      fill="none"
      stroke={color}
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  </svg>
);

const Cross: React.FC<{ p: number; size?: number }> = ({ p, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    {["M6 6L18 18", "M18 6L6 18"].map((d, i) => (
      <path
        key={d}
        d={d}
        fill="none"
        stroke={NEG}
        strokeWidth={2.8}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - interpolate(p, [i * 0.5, i * 0.5 + 0.5], [0, 1], clamp)}
      />
    ))}
  </svg>
);

const Title: React.FC<{ children: React.ReactNode; start?: number; size?: number }> = ({
  children,
  start = 8,
  size = 40,
}) => {
  const p = useProgress(start, 16);
  return (
    <div
      style={{
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.1,
        marginTop: 14,
        opacity: p,
        translate: `0 ${(1 - p) * 12}px`,
      }}
    >
      {children}
    </div>
  );
};

// A row that appears at `at`, and is crossed out at `strikeAt` or marked as
// the answer if `good`.
const Row: React.FC<{ text: string; at: number; strikeAt?: number; good?: boolean; sub?: string }> = ({
  text,
  at,
  strikeAt,
  good,
  sub,
}) => {
  const frame = useCurrentFrame();
  const inP = useProgress(at, 14);
  const strike = strikeAt === undefined ? 0 : interpolate(frame, [strikeAt, strikeAt + 12], [0, 1], { ...clamp, easing: OUT });
  const goodP = useProgress(at + 6, 14);
  const mark = good ? goodP : strike;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "16px 20px",
        borderRadius: 16,
        background: good ? accentA(0.14 * inP) : "rgba(255,255,255,0.04)",
        border: `1px solid ${good ? accentA(0.5 * inP) : "rgba(255,255,255,0.08)"}`,
        boxShadow: good ? `0 0 30px ${accentA(0.25 * inP)}` : undefined,
        opacity: inP,
        translate: `0 ${(1 - inP) * 16}px`,
      }}
    >
      {good ? <Check p={mark} size={30} /> : strikeAt !== undefined ? <Cross p={mark} size={28} /> : null}
      <div style={{ position: "relative", flex: 1 }}>
        <div
          style={{
            fontWeight: good ? 700 : 600,
            fontSize: good ? 32 : 30,
            color: strike > 0 ? `rgba(246,244,239,${1 - 0.45 * strike})` : theme.text,
          }}
        >
          {text}
        </div>
        {sub ? (
          <div style={{ fontWeight: 600, fontSize: 22, color: "rgba(246,244,239,0.65)", marginTop: 4 }}>{sub}</div>
        ) : null}
        {strikeAt !== undefined ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 22,
              height: 3,
              borderRadius: 2,
              width: `${strike * 100}%`,
              background: NEG,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

const Stack: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 14 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap, marginTop: 24 }}>{children}</div>
);

// Tiny mock of a roofing ad: photo block + text lines. `standout` makes it
// the premium one.
const AdTile: React.FC<{ label: string; at: number; standout?: boolean; dim?: boolean; web?: boolean }> = ({
  label,
  at,
  standout,
  dim,
  web,
}) => {
  const p = useProgress(at, 16);
  const glowP = useProgress(at + 10, 20);
  const glow = standout ? glowP : 0;
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 16,
        padding: 12,
        background: standout ? "linear-gradient(160deg, #1d2a3d, #0f1622)" : "rgba(255,255,255,0.06)",
        border: `${standout ? 2 : 1}px solid ${standout ? accentA(0.4 + 0.5 * glow) : "rgba(255,255,255,0.1)"}`,
        boxShadow: standout ? `0 0 ${40 * glow}px ${accentA(0.45 * glow)}` : undefined,
        opacity: p * (dim ? 0.5 : 1),
        translate: `0 ${(1 - p) * 20}px`,
        scale: String(standout ? 1 + 0.06 * glow : 1),
      }}
    >
      {web ? (
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: 4, background: "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      ) : null}
      <div
        style={{
          height: 74,
          borderRadius: 10,
          background: standout
            ? `linear-gradient(135deg, ${theme.accentDeep}, ${theme.accent})`
            : "linear-gradient(135deg, #4a4f57, #33373d)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={40} height={36} viewBox="0 0 44 40">
          <path
            d="M4 20 L22 5 L40 20 M9 16 V36 H35 V16"
            fill="none"
            stroke={standout ? "#fff" : "rgba(255,255,255,0.5)"}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div style={{ height: 8, borderRadius: 4, marginTop: 10, width: "85%", background: "rgba(255,255,255,0.25)" }} />
      <div style={{ height: 8, borderRadius: 4, marginTop: 6, width: "60%", background: "rgba(255,255,255,0.15)" }} />
      <div
        style={{
          marginTop: 10,
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: standout ? theme.accent : "rgba(246,244,239,0.6)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const Scene: React.FC<{ from: number; to: number; children: (len: number) => React.ReactNode }> = ({
  from,
  to,
  children,
}) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none">
    {children(to - from)}
  </Sequence>
);

// --- Scenes ----------------------------------------------------------------

const OfferCard: React.FC<{ len: number; freeAt: number; finale?: boolean; guaranteeAt?: number }> = ({
  len,
  freeAt,
  finale,
  guaranteeAt,
}) => {
  const exitAt = finale ? len + 30 : len;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const count = useProgress(10, fps);
  const free = useProgress(freeAt, 16);
  const seal =
    guaranteeAt === undefined
      ? 0
      : interpolate(frame, [guaranteeAt, guaranteeAt + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const lo = Math.round(6 * count);
  const hi = Math.round(12 * count);
  return (
    <GlassPanel exitAt={exitAt} from={finale ? "left" : "right"} style={finale ? LEFT : RIGHT}>
      <Label>{finale ? "Our guarantee" : "The offer"}</Label>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginTop: 26 }}>
        <div
          style={{
            fontWeight: 800,
            fontSize: finale ? 108 : 132,
            lineHeight: 0.9,
            whiteSpace: "nowrap",
            color: theme.accent,
            textShadow: `0 0 40px ${accentA(0.4)}`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {lo}–{hi}
        </div>
        <div style={{ fontWeight: 700, fontSize: 34, lineHeight: 1.1, paddingBottom: 10 }}>
          more booked
          <br />
          jobs
        </div>
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
        <Pill at={18} text="In 90 days" />
        <Pill at={24} text="Into your calendar" />
      </div>
      <div
        style={{
          marginTop: 22,
          padding: "18px 22px",
          borderRadius: 16,
          background: accentA(0.14),
          border: `1px solid ${accentA(0.5)}`,
          fontWeight: 700,
          fontSize: 30,
          opacity: free,
          translate: `0 ${(1 - free) * 14}px`,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Check p={free} size={30} />
        Or we work for free until you hit it
      </div>
      {guaranteeAt !== undefined ? (
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -54,
            width: 124,
            height: 124,
            borderRadius: 62,
            background: `radial-gradient(circle at 35% 30%, ${theme.accent}, ${theme.accentDeep})`,
            border: "4px solid rgba(255,255,255,0.85)",
            boxShadow: `0 0 40px ${accentA(0.6)}, 0 14px 30px rgba(0,0,0,0.4)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            rotate: `${-14 + (1 - seal) * -40}deg`,
            scale: String(seal),
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1,
          }}
        >
          <div style={{ fontSize: 17, letterSpacing: "0.12em" }}>100%</div>
          <div style={{ fontSize: 16, letterSpacing: "0.02em", marginTop: 3 }}>GUARANTEED</div>
        </div>
      ) : null}
    </GlassPanel>
  );
};

const Pill: React.FC<{ at: number; text: string }> = ({ at, text }) => {
  const p = useProgress(at, 14);
  return (
    <div
      style={{
        padding: "10px 18px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.16)",
        fontWeight: 600,
        fontSize: 24,
        opacity: p,
        scale: String(0.9 + 0.1 * p),
      }}
    >
      {text}
    </div>
  );
};

// Homeowner's path to choosing a roofer, ending in the 10-second judgement.
const Journey: React.FC<{ len: number; steps: { text: string; sub?: string; at: number }[]; tenAt: number }> = ({
  len,
  steps,
  tenAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ring = interpolate(frame, [tenAt, tenAt + 1.6 * fps], [0, 1], clamp);
  const ringIn = useProgress(tenAt, 14);
  const r = 58;
  const c = 2 * Math.PI * r;
  return (
    <GlassPanel exitAt={len} style={RIGHT}>
      <Label>How homeowners choose a roofer</Label>
      <div style={{ position: "relative", marginTop: 26 }}>
        {steps.map((s, i) => {
          const p = interpolate(frame, [s.at, s.at + 14], [0, 1], { ...clamp, easing: OUT });
          const next = steps[i + 1];
          const line = next ? interpolate(frame, [next.at - 6, next.at + 4], [0, 1], clamp) : 0;
          return (
            <div key={s.text} style={{ display: "flex", gap: 20, opacity: p, translate: `${(1 - p) * 20}px 0` }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    border: `2px solid ${theme.accent}`,
                    background: accentA(0.15),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 22,
                    color: theme.accent,
                  }}
                >
                  {i + 1}
                </div>
                {next ? (
                  <div style={{ width: 2, height: 34, background: "rgba(255,255,255,0.12)", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, height: `${line * 100}%`, background: theme.accent }} />
                  </div>
                ) : null}
              </div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 30 }}>{s.text}</div>
                {s.sub ? (
                  <div style={{ fontWeight: 600, fontSize: 22, color: "rgba(246,244,239,0.65)" }}>{s.sub}</div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          marginTop: 18,
          paddingTop: 22,
          borderTop: "1px solid rgba(255,255,255,0.14)",
          opacity: ringIn,
        }}
      >
        <div style={{ position: "relative", width: 136, height: 136, flexShrink: 0 }}>
          <svg width={136} height={136} style={{ position: "absolute", rotate: "-90deg" }}>
            <circle cx={68} cy={68} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={9} />
            <circle
              cx={68}
              cy={68}
              r={r}
              fill="none"
              stroke={theme.accent}
              strokeWidth={9}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * ring}
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
            <div style={{ fontWeight: 800, fontSize: 50, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {Math.max(0, Math.ceil(10 * (1 - ring)))}
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, letterSpacing: "0.16em", color: "rgba(246,244,239,0.6)" }}>
              SECONDS
            </div>
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 30, lineHeight: 1.2 }}>
          to decide who looks
          <br />
          <span style={{ color: theme.accent }}>trustworthy</span>
        </div>
      </div>
    </GlassPanel>
  );
};

const Lineup: React.FC<{ len: number; label: string; title: string; tiles: string[]; at: number; standout?: number; web?: boolean; footer?: { text: string; at: number } }> = ({
  len,
  label,
  title,
  tiles,
  at,
  standout,
  web,
  footer,
}) => {
  const f = useProgress(footer?.at ?? 0, 14);
  return (
    <GlassPanel exitAt={len} style={RIGHT}>
      <Label>{label}</Label>
      <Title>{title}</Title>
      <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
        {tiles.map((t, i) => (
          <AdTile
            key={t}
            label={t}
            at={at + i * 5}
            web={web}
            standout={standout === i}
            dim={standout !== undefined && standout !== i}
          />
        ))}
      </div>
      {footer ? (
        <div
          style={{
            marginTop: 22,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontWeight: 700,
            fontSize: 28,
            opacity: f,
            translate: `0 ${(1 - f) * 10}px`,
          }}
        >
          <Check p={f} size={28} />
          {footer.text}
        </div>
      ) : null}
    </GlassPanel>
  );
};

const LeakRow: React.FC<{ what: string; status: string; at: number }> = ({ what, status, at }) => {
  const p = useProgress(at, 14);
  const s = useProgress(at + 8, 14);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        opacity: p,
        translate: `0 ${(1 - p) * 14}px`,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 30 }}>{what}</div>
      <div
        style={{
          padding: "8px 16px",
          borderRadius: 999,
          background: negA(0.15),
          border: `1px solid ${negA(0.55)}`,
          color: NEG,
          fontWeight: 700,
          fontSize: 22,
          opacity: s,
          scale: String(0.85 + 0.15 * s),
        }}
      >
        {status}
      </div>
    </div>
  );
};

const Leaks: React.FC<{ len: number; ads: number; web: number; follow: number; lost: number }> = ({
  len,
  ads,
  web,
  follow,
  lost,
}) => {
  const l = useProgress(lost, 16);
  return (
    <GlassPanel exitAt={len} style={RIGHT}>
      <Label>Where the jobs are leaking</Label>
      <Stack>
        <LeakRow what="Your ads" status="Same as everyone" at={ads} />
        <LeakRow what="Your website" status="Same as everyone" at={web} />
        <LeakRow what="Your follow-up" status="Hours, sometimes days" at={follow} />
      </Stack>
      <div
        style={{
          marginTop: 20,
          padding: "18px 22px",
          borderRadius: 16,
          background: negA(0.12),
          border: `1px solid ${negA(0.45)}`,
          fontWeight: 700,
          fontSize: 28,
          lineHeight: 1.25,
          opacity: l,
          translate: `0 ${(1 - l) * 14}px`,
        }}
      >
        The homeowner calls the roofer
        <br />
        who <span style={{ color: NEG }}>looked more put together</span>
      </div>
    </GlassPanel>
  );
};

// The three-part system, built up as each part is introduced.
const System: React.FC<{ len: number; steps: { title: string; sub: string; at: number }[]; doneAt: number }> = ({
  len,
  steps,
  doneAt,
}) => {
  const frame = useCurrentFrame();
  const done = useProgress(doneAt, 18);
  const active = steps.reduce((a, s, i) => (frame >= s.at ? i : a), -1);
  return (
    <GlassPanel exitAt={len} from="left" style={LEFT}>
      <Label start={4}>The Alvolution system</Label>
      <div style={{ marginTop: 24 }}>
        {steps.map((s, i) => {
          const p = interpolate(frame, [s.at, s.at + 16], [0, 1], { ...clamp, easing: OUT });
          const isActive = i === active && frame < doneAt;
          const isDone = i < active || frame >= doneAt;
          return (
            <div key={s.title}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "18px 20px",
                  borderRadius: 18,
                  background: isActive ? accentA(0.16) : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? accentA(0.6) : "rgba(255,255,255,0.1)"}`,
                  boxShadow: isActive ? `0 0 34px ${accentA(0.3)}` : undefined,
                  opacity: 0.25 + 0.75 * p,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    flexShrink: 0,
                    background: p > 0 ? theme.accent : "rgba(255,255,255,0.1)",
                    color: "#0b1220",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 28,
                  }}
                >
                  {isDone ? <Check p={1} size={30} color="#0b1220" /> : i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 30, lineHeight: 1.1 }}>{p > 0 ? s.title : "· · ·"}</div>
                  <div style={{ fontWeight: 600, fontSize: 22, color: "rgba(246,244,239,0.65)", marginTop: 4, opacity: p }}>
                    {s.sub}
                  </div>
                </div>
              </div>
              <Arrow p={i < steps.length - 1 ? interpolate(frame, [steps[i + 1].at - 4, steps[i + 1].at + 8], [0, 1], clamp) : interpolate(frame, [doneAt - 4, doneAt + 8], [0, 1], clamp)} />
            </div>
          );
        })}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            padding: "20px",
            borderRadius: 18,
            background: `linear-gradient(135deg, ${theme.accentDeep}, ${theme.accent})`,
            boxShadow: `0 0 ${50 * done}px ${accentA(0.6 * done)}`,
            fontWeight: 800,
            fontSize: 34,
            color: "#fff",
            opacity: done,
            scale: String(0.9 + 0.1 * done),
          }}
        >
          Booked jobs on your calendar
        </div>
      </div>
    </GlassPanel>
  );
};

const Arrow: React.FC<{ p: number }> = ({ p }) => (
  <div style={{ display: "flex", justifyContent: "center", height: 30, alignItems: "center" }}>
    <svg width={24} height={26} viewBox="0 0 24 26" style={{ opacity: 0.3 + 0.7 * p }}>
      <path
        d="M12 2 V22 M5 15 L12 22 L19 15"
        fill="none"
        stroke={p > 0.5 ? theme.accent : "rgba(255,255,255,0.4)"}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// Response-time comparison: 30 seconds vs the usual hour / next morning.
const Speed: React.FC<{ len: number; at: number; hourAt: number; morningAt: number }> = ({ len, at, hourAt, morningAt }) => {
  const rows = [
    { label: "With us", value: "30 seconds", w: 0.04, at, good: true },
    { label: "Typical roofer", value: "An hour later", w: 0.45, at: hourAt },
    { label: "Typical roofer", value: "Next morning", w: 1, at: morningAt },
  ];
  return (
    <GlassPanel exitAt={len} style={RIGHT}>
      <Label>Speed to lead</Label>
      <Title>Who calls the homeowner first?</Title>
      <Stack gap={22}>
        {rows.map((r) => (
          <SpeedRow key={r.value} {...r} />
        ))}
      </Stack>
    </GlassPanel>
  );
};

const SpeedRow: React.FC<{ label: string; value: string; w: number; at: number; good?: boolean }> = ({
  label,
  value,
  w,
  at,
  good,
}) => {
  const { fps } = useVideoConfig();
  const p = useProgress(at, 0.8 * fps);
  const color = good ? theme.accent : NEG;
  return (
    <div style={{ opacity: Math.min(1, p * 3) }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 26, marginBottom: 10 }}>
        <span style={{ color: "rgba(246,244,239,0.75)" }}>{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div style={{ height: 16, borderRadius: 8, background: "rgba(255,255,255,0.08)" }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(w, 0.03) * p * 100}%`,
            borderRadius: 8,
            background: good ? `linear-gradient(90deg, ${theme.accentDeep}, ${theme.accent})` : negA(0.7),
            boxShadow: good ? `0 0 18px ${accentA(0.6)}` : undefined,
          }}
        />
      </div>
    </div>
  );
};

// Revenue line: jagged before, steady climb after.
const BeforeAfter: React.FC<{ len: number; afterAt: number }> = ({ len, afterAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const W = 500;
  const H = 220;
  const before = [0.45, 0.2, 0.55, 0.15, 0.5, 0.25];
  const after = [0.3, 0.42, 0.52, 0.64, 0.76, 0.9];
  const pts = [...before, ...after].map((v, i, a) => [(i / (a.length - 1)) * W, H - v * H] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const p1 = interpolate(frame, [12, 12 + 1.2 * fps], [0, 0.5], clamp);
  const p2 = interpolate(frame, [afterAt, afterAt + 1.4 * fps], [0, 0.5], { ...clamp, easing: OUT });
  const draw = p1 + p2;
  const after2 = useProgress(afterAt, 16);
  return (
    <GlassPanel exitAt={len} style={RIGHT}>
      <Label>Monthly booked revenue</Label>
      <svg width={W} height={H + 20} style={{ marginTop: 30, overflow: "visible" }}>
        <line x1={W / 2} x2={W / 2} y1={0} y2={H} stroke="rgba(255,255,255,0.18)" strokeDasharray="6 6" />
        <path d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={5} strokeLinejoin="round" />
        <path
          d={d}
          fill="none"
          stroke={theme.accent}
          strokeWidth={5}
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          style={{ filter: `drop-shadow(0 0 8px ${accentA(0.6)})` }}
        />
      </svg>
      <div style={{ display: "flex", marginTop: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 20, letterSpacing: "0.14em", color: NEG }}>BEFORE</div>
          <div style={{ fontWeight: 700, fontSize: 28, marginTop: 4 }}>Inconsistent months</div>
        </div>
        <div style={{ flex: 1, opacity: after2 }}>
          <div style={{ fontWeight: 600, fontSize: 20, letterSpacing: "0.14em", color: theme.accent }}>AFTER</div>
          <div style={{ fontWeight: 700, fontSize: 28, marginTop: 4 }}>Booked weeks ahead</div>
        </div>
      </div>
    </GlassPanel>
  );
};

const CTA: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bob = Math.sin((frame / fps) * Math.PI * 2 * 0.9) * 8;
  return (
    <GlassPanel exitAt={len + fps} style={{ ...RIGHT, top: 300 }}>
      <Label>Next step</Label>
      <Title size={48}>Book a free meeting</Title>
      <div style={{ fontWeight: 600, fontSize: 26, color: "rgba(246,244,239,0.75)", marginTop: 10 }}>
        My team will reach out to you directly.
      </div>
      <div
        style={{
          marginTop: 26,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          padding: "22px",
          borderRadius: 18,
          background: `linear-gradient(135deg, ${theme.accentDeep}, ${theme.accent})`,
          boxShadow: `0 0 40px ${accentA(0.5)}`,
          fontWeight: 800,
          fontSize: 32,
          color: "#fff",
        }}
      >
        Book below
        <svg width={28} height={30} viewBox="0 0 24 26" style={{ translate: `0 ${bob}px` }}>
          <path d="M12 2 V22 M5 15 L12 22 L19 15" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </GlassPanel>
  );
};

// --- Timeline --------------------------------------------------------------

// Every graphic is cued from the spoken words, so they stay in sync if the
// captions are re-aligned.
export const Scenes: React.FC<{ words: Word[]; totalFrames: number }> = ({ words, totalFrames }) => {
  const { fps } = useVideoConfig();
  const { find, frameOf } = makeCue(words, fps);
  const at = (phrase: string, after = 0) => frameOf(find(phrase, after));
  const rel = (abs: number, start: number) => abs - start;

  // 1. Offer
  const offerFrom = at("We will get");
  const offerTo = at("And before I");
  // 2. What held them back
  const heldFrom = at("So what was");
  const heldTo = at("When a homeowner");
  // 3. Homeowner journey
  const jFrom = at("When a homeowner");
  const jTo = at("That decision is");
  // 4. Not reviews / years — compared side by side
  const cmpFrom = at("That decision is");
  const cmpTo = at("So you think");
  // 5. Leaks
  const leakFrom = at("The problem is");
  const leakTo = at("And that's the real reason");
  // 6. System + side cards
  const sysFrom = at("And we do it three ways");
  const sysDone = at("That is the system");
  const iSys = find("That is the system");
  const sysTo = at("That is what took", iSys);
  const standFrom = at("Not another generic");
  const standTo = at("Second,");
  const webFrom = at("Built specifically");
  const webTo = at("Third,");
  const speedFrom = at("within 30 seconds");
  const speedTo = at("And because YOUR brand");
  // 7. Before / after
  const baFrom = sysTo;
  const baTo = at("And here is the thing", iSys);
  // 8. Guarantee finale
  const iEnd = find("We make sure they choose");
  const gFrom = at("6-12 more booked", iEnd);
  const gTo = totalFrames;
  // 9. CTA
  const ctaFrom = at("Book a free meeting");

  return (
    <AbsoluteFill style={{ fontFamily: theme.font, color: theme.text }}>
      <Scene from={offerFrom} to={offerTo}>
        {(len) => <OfferCard len={len} freeAt={rel(at("or we work for free"), offerFrom)} />}
      </Scene>

      <Scene from={heldFrom} to={heldTo}>
        {(len) => (
          <GlassPanel exitAt={len} style={RIGHT}>
            <Label start={2}>What was holding them back?</Label>
            <Stack>
              <Row text="Their pricing" at={rel(at("It was not the pricing"), heldFrom)} strikeAt={rel(at("pricing."), heldFrom) + 6} />
              <Row text="The quality of their work" at={rel(at("It was not the quality"), heldFrom)} strikeAt={rel(at("work.", find("It was not the quality")), heldFrom)} />
              <Row text="Their ads" at={rel(at("It was not even ads"), heldFrom)} strikeAt={rel(at("ads.", find("It was not even")), heldFrom) + 4} />
              <Row
                text="They looked like every other roofer"
                at={rel(at("It was that they looked"), heldFrom)}
                good
              />
            </Stack>
          </GlassPanel>
        )}
      </Scene>

      <Scene from={jFrom} to={jTo}>
        {(len) => (
          <Journey
            len={len}
            tenAt={rel(at("And within about 10 seconds"), jFrom)}
            steps={[
              { text: "A roofing problem", sub: "Leak · storm damage · replacement", at: 6 },
              { text: "They compare a few options", at: rel(at("They look at a few"), jFrom) },
              { text: "They scroll Facebook", at: rel(at("They scroll through"), jFrom) },
              { text: "They check your website", at: rel(at("They check a website"), jFrom) },
            ]}
          />
        )}
      </Scene>

      <Scene from={cmpFrom} to={cmpTo}>
        {(len) => (
          <GlassPanel exitAt={len} style={RIGHT}>
            <Label start={2}>What they decide on</Label>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <MiniStrike text="Reviews" at={4} />
              <MiniStrike text="Years in business" at={rel(at("It is not based on how long"), cmpFrom)} />
            </div>
            <LineupInline at={rel(at("It is based on how"), cmpFrom)} />
          </GlassPanel>
        )}
      </Scene>

      <Scene from={leakFrom} to={leakTo}>
        {(len) => (
          <Leaks
            len={len}
            ads={6}
            web={rel(at("YOUR website looks"), leakFrom)}
            follow={rel(at("YOUR follow up"), leakFrom)}
            lost={rel(at("They call the roofer"), leakFrom)}
          />
        )}
      </Scene>

      <Scene from={sysFrom} to={baTo}>
        {(len) => (
          <System
            len={len}
            doneAt={rel(sysDone, sysFrom)}
            steps={[
              { title: "Premium video ads", sub: "Stop the scroll in your area", at: rel(at("First,"), sysFrom) },
              { title: "A website that sells", sub: "Decision made before the call", at: rel(at("Second,"), sysFrom) },
              { title: "30-second follow-up", sub: "Automation + our rep team", at: rel(at("Third,"), sysFrom) },
            ]}
          />
        )}
      </Scene>
      <Scene from={standFrom} to={standTo}>
        {(len) => (
          <Lineup
            len={len}
            label="Your video ads"
            title="The one that stands out"
            tiles={["Roofer A", "You", "Roofer B"]}
            at={6}
            standout={1}
          />
        )}
      </Scene>
      <Scene from={webFrom} to={webTo}>
        {(len) => (
          <Lineup
            len={len}
            label="Your website"
            title="Compared against 3 other roofers"
            tiles={["Roofer A", "Roofer B", "You", "Roofer C"]}
            at={6}
            web
            standout={2}
            footer={{ text: "Decision already made", at: rel(at("By the time they finish"), webFrom) }}
          />
        )}
      </Scene>
      <Scene from={speedFrom} to={speedTo}>
        {(len) => (
          <Speed
            len={len}
            at={4}
            hourAt={rel(at("Not an hour later"), speedFrom)}
            morningAt={rel(at("Not the next morning"), speedFrom)}
          />
        )}
      </Scene>

      <Scene from={baFrom} to={baTo}>
        {(len) => <BeforeAfter len={len} afterAt={rel(at("to predictable,", iSys), baFrom)} />}
      </Scene>

      <Scene from={gFrom} to={gTo}>
        {(len) => (
          <OfferCard
            len={len}
            finale
            freeAt={rel(at("Or we work for free", iEnd), gFrom)}
            guaranteeAt={rel(at("And that is a guarantee"), gFrom)}
          />
        )}
      </Scene>

      <Scene from={ctaFrom} to={totalFrames}>
        {(len) => <CTA len={len} />}
      </Scene>
    </AbsoluteFill>
  );
};

const MiniStrike: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  const p = useProgress(at, 12);
  const s = interpolate(frame, [at + 10, at + 22], [0, 1], { ...clamp, easing: OUT });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.14)",
        fontWeight: 700,
        fontSize: 24,
        opacity: p,
        color: `rgba(246,244,239,${1 - 0.4 * s})`,
      }}
    >
      <Cross p={s} size={22} />
      {text}
    </div>
  );
};

// Three near-identical ads: what the homeowner sees side by side.
const LineupInline: React.FC<{ at: number }> = ({ at }) => {
  const p = useProgress(at, 14);
  return (
    <div style={{ marginTop: 26, opacity: p }}>
      <div style={{ fontWeight: 700, fontSize: 30, lineHeight: 1.2 }}>
        Your brand <span style={{ color: theme.accent }}>vs.</span> every roofer in their feed
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
        {["Roofer A", "You", "Roofer B"].map((t, i) => (
          <AdTile key={t} label={t} at={at + 6 + i * 5} />
        ))}
      </div>
    </div>
  );
};
