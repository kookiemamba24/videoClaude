import { loadFont } from "@remotion/fonts";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

// Variable fonts bundled in public/ so renders don't depend on Google Fonts.
const sans = "Inter";
const mono = "JetBrains Mono";
loadFont({ family: sans, url: staticFile("fonts/Inter.woff2"), weight: "100 900" });
loadFont({ family: mono, url: staticFile("fonts/JetBrainsMono.woff2"), weight: "100 800" });

export const clientResultSchema = z.object({
  name: z.string(),
  role: z.string(),
  before: z.array(z.string()),
  tookOver: z.array(z.string()),
  stat: z.number(),
  statSuffix: z.string(),
  statCaption: z.string(),
  days: z.number(),
});

type Props = z.infer<typeof clientResultSchema>;

const ACCENT = "#3ddc97";
const TEXT = "#f2f5f3";
const MUTED = "#8a948f";
const CARD_BG = "rgba(255,255,255,0.035)";
const CARD_BORDER = "rgba(255,255,255,0.08)";
const OUT = Easing.bezier(0.16, 1, 0.3, 1);

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Fade + rise, starting at frame `start` and lasting `dur` frames.
const useRise = (start: number, dur = 18, distance = 28) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    ...clamp,
    easing: OUT,
  });
  return {
    opacity: p,
    translate: `0px ${(1 - p) * distance}px`,
  } as const;
};

const Label: React.FC<{ text: string; start: number; color?: string }> = ({
  text,
  start,
  color = MUTED,
}) => {
  const frame = useCurrentFrame();
  const chars = Math.floor(
    interpolate(frame, [start, start + text.length * 0.8], [0, text.length], clamp),
  );
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: 19,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color,
      }}
    >
      {text.slice(0, chars)}
    </div>
  );
};

const Avatar: React.FC<{ letter: string; start: number }> = ({ letter, start }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [start, start + 22], [0, 1], {
    ...clamp,
    easing: OUT,
  });
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 84, height: 84 }}>
      <svg width={84} height={84} style={{ position: "absolute", rotate: "-90deg" }}>
        <circle
          cx={42}
          cy={42}
          r={r}
          fill="rgba(61,220,151,0.06)"
          stroke={ACCENT}
          strokeWidth={2}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - draw)}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 34,
          color: ACCENT,
          opacity: interpolate(frame, [start + 8, start + 20], [0, 1], clamp),
          scale: interpolate(frame, [start + 8, start + 22], [0.6, 1], {
            ...clamp,
            easing: OUT,
          }),
        }}
      >
        {letter}
      </div>
    </div>
  );
};

const Card: React.FC<{
  start: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ start, children, style }) => {
  const rise = useRise(start, 22, 40);
  return (
    <div
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 18,
        padding: "28px 30px",
        ...rise,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Bullet: React.FC<{ text: string; start: number }> = ({ text, start }) => {
  const rise = useRise(start, 16, 14);
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "baseline", ...rise }}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: MUTED,
          flexShrink: 0,
          translate: "0 -4px",
        }}
      />
      <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 28, color: TEXT, lineHeight: 1.3 }}>
        {text}
      </div>
    </div>
  );
};

const Check: React.FC<{ text: string; start: number }> = ({ text, start }) => {
  const frame = useCurrentFrame();
  const rise = useRise(start, 16, 14);
  const draw = interpolate(frame, [start + 4, start + 16], [0, 1], {
    ...clamp,
    easing: OUT,
  });
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center", ...rise }}>
      <svg width={24} height={24} viewBox="0 0 24 24">
        <path
          d="M4 12.5l5 5L20 6.5"
          fill="none"
          stroke={ACCENT}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
        />
      </svg>
      <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 28, color: TEXT }}>{text}</div>
    </div>
  );
};

const StatCard: React.FC<{
  start: number;
  stat: number;
  suffix: string;
  caption: string;
  days: number;
}> = ({ start, stat, suffix, caption, days }) => {
  const frame = useCurrentFrame();
  const count = interpolate(frame, [start + 6, start + 46], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const glow = interpolate(frame, [start + 40, start + 52, start + 80], [0, 1, 0.55], clamp);
  return (
    <Card
      start={start}
      style={{
        padding: "34px 40px",
        background: "linear-gradient(135deg, rgba(61,220,151,0.13), rgba(61,220,151,0.03))",
        border: "1px solid rgba(61,220,151,0.22)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 700,
            fontSize: 128,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: ACCENT,
            fontVariantNumeric: "tabular-nums",
            textShadow: `0 0 ${40 * glow}px rgba(61,220,151,${0.45 * glow})`,
          }}
        >
          ${Math.round(stat * count)}
          {suffix}
        </div>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 500,
            fontSize: 26,
            color: "#c9d1cc",
            marginTop: 14,
            ...useRise(start + 30, 18, 10),
          }}
        >
          {caption}
        </div>
      </div>
      <div style={{ textAlign: "right", ...useRise(start + 38, 20, 16) }}>
        <div style={{ fontFamily: mono, fontSize: 17, letterSpacing: "0.14em", color: MUTED }}>IN</div>
        <div
          style={{
            fontFamily: sans,
            fontWeight: 600,
            fontSize: 52,
            color: "#d6dcd8",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(
            interpolate(frame, [start + 38, start + 70], [0, days], {
              ...clamp,
              easing: OUT,
            }),
          )}{" "}
          days
        </div>
      </div>
    </Card>
  );
};

// Stand-in for the talking-head footage; swap for <OffthreadVideo> later.
const SpeakerPlaceholder: React.FC = () => (
  <AbsoluteFill
    style={{
      width: "34%",
      background: "radial-gradient(ellipse at 50% 40%, #2a2f33 0%, #15181a 70%)",
      alignItems: "center",
      justifyContent: "center",
      borderRight: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 18, letterSpacing: "0.14em", color: "#5b6460" }}>
      SPEAKER FOOTAGE
    </div>
  </AbsoluteFill>
);

export const ClientResult: React.FC<Props> = ({
  name,
  role,
  before,
  tookOver,
  stat,
  statSuffix,
  statCaption,
  days,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const bgIn = interpolate(frame, [0, 0.6 * fps], [0, 1], clamp);
  // Slow push-in over the whole shot keeps the hold from feeling static.
  const drift = interpolate(frame, [0, durationInFrames], [1, 1.025]);

  const t = {
    label: 4,
    avatar: 10,
    name: 18,
    beforeCard: 1.3 * fps,
    tookCard: 1.6 * fps,
    stat: 3.4 * fps,
  };

  return (
    <AbsoluteFill style={{ background: "#0a0d0c" }}>
      <SpeakerPlaceholder />
      <AbsoluteFill
        style={{
          left: "34%",
          width: "66%",
          opacity: bgIn,
          background:
            "radial-gradient(ellipse 70% 45% at 55% -5%, rgba(61,220,151,0.16), transparent 70%), #0d1110",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "64px 72px",
            display: "flex",
            flexDirection: "column",
            gap: 30,
            scale: drift,
            transformOrigin: "50% 30%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: 5,
                background: ACCENT,
                boxShadow: `0 0 12px ${ACCENT}`,
                opacity: interpolate(frame % 40, [0, 20, 40], [1, 0.4, 1]),
              }}
            />
            <Label text="Client result" start={t.label} color={ACCENT} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Avatar letter={name[0]} start={t.avatar} />
            <div style={useRise(t.name, 20, 20)}>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 58, color: TEXT, lineHeight: 1.05 }}>
                {name}
              </div>
              <Label text={role} start={t.name + 6} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 24 }}>
            <Card start={t.beforeCard} style={{ flex: 1 }}>
              <Label text="Before" start={t.beforeCard + 6} />
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 22 }}>
                {before.map((b, i) => (
                  <Bullet key={b} text={b} start={t.beforeCard + 12 + i * 6} />
                ))}
              </div>
            </Card>
            <Card start={t.tookCard} style={{ flex: 1 }}>
              <Label text="What we took over · Full service" start={t.tookCard + 6} color={ACCENT} />
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 22 }}>
                {tookOver.map((b, i) => (
                  <Check key={b} text={b} start={t.tookCard + 14 + i * 6} />
                ))}
              </div>
            </Card>
          </div>

          <div style={{ marginTop: "auto" }}>
            <StatCard start={t.stat} stat={stat} suffix={statSuffix} caption={statCaption} days={days} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
