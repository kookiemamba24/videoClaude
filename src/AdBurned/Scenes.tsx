import React from "react";
import { Easing, Img, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame } from "remotion";
import { accent, adTheme } from "../Ad/adTheme";
import { Check, Kicker, Phone, Stage } from "../Ad/Graphics";
import { blend, POSES, StickFigure } from "./Poses";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const back = (s = 1.8) => Easing.out(Easing.back(s));
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const FLAME = ["#ff3b1f", "#ff7a00", "#ffc21a"];

// Shows rows [y0, y1] of a full-frame (1080x1920) layout, scaled by k and
// placed with its top at `top` — used to sit graphics on the chest, clear of
// the face. Fades in/out over `len`.
export const OnChest: React.FC<{ len: number; y0: number; y1: number; k: number; top: number; children: React.ReactNode }> = ({
  len,
  y0,
  y1,
  k,
  top,
  children,
}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: back(1.3) });
  const out = interpolate(frame, [len - 6, len], [1, 0], clamp);
  const w = 1080 * k;
  const h = (y1 - y0) * k;
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - w) / 2 - 24,
        top: top - 20,
        width: w + 48,
        height: h + 40,
        borderRadius: 32,
        background: "rgba(8,12,20,0.72)",
        border: "1.5px solid rgba(255,255,255,0.18)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        backdropFilter: "blur(24px)",
        overflow: "hidden",
        opacity: Math.min(1, inP * 1.3) * out,
        scale: String(0.9 + 0.1 * inP),
      }}
    >
      <div style={{ position: "absolute", left: 24, top: 20 - y0 * k, width: 1080, height: 1920, scale: String(k), transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
};

// Wobbling cartoon flame rooted at (x, y).
const Flame: React.FC<{ x: number; y: number; h: number; seed: number }> = ({ x, y, h, seed }) => {
  const frame = useCurrentFrame();
  return (
    <g>
      {FLAME.map((c, i) => {
        const k = 1 - i * 0.28;
        const w = 70 * k;
        const hh = h * k;
        const sway = Math.sin(frame / 3 + seed + i) * 12 * k;
        const tip = Math.sin(frame / 2.2 + seed * 2 + i) * 8;
        return (
          <path
            key={c}
            d={`M${x - w} ${y} Q${x - w * 1.1} ${y - hh * 0.5} ${x - w * 0.2 + sway} ${y - hh * 0.75} Q${x - w * 0.1} ${y - hh * 0.55} ${x + sway + tip} ${y - hh} Q${x + w * 0.5} ${y - hh * 0.6} ${x + w * 0.35 + sway} ${y - hh * 0.45} Q${x + w * 1.1} ${y - hh * 0.4} ${x + w} ${y} Z`}
            fill={c}
          />
        );
      })}
    </g>
  );
};

// Hook: roofers catching fire while a smug agency guy holds the match.
export const BurnedScene: React.FC<{ len: number; burnAt: number }> = ({ len, burnAt }) => {
  const frame = useCurrentFrame();
  const fire = interpolate(frame, [burnAt - 4, burnAt + 10], [0, 1], { ...clamp, easing: back(1.4) });
  const out = interpolate(frame, [len - 5, len], [1, 0], clamp);
  const roofers = [520, 720, 920];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: out }}>
      <line x1={40} x2={1040} y1={1330} y2={1330} stroke="rgba(255,255,255,0.3)" strokeWidth={4} />
      {/* Agency guy with a match */}
      <StickFigure pose={blend(POSES.stand, POSES.highFiveL, 0.35)} x={200} y={1206} scale={1.05} tie />
      <g transform={`translate(${200 + 100} ${1206 - 250}) rotate(20)`}>
        <rect x={-6} y={0} width={12} height={110} fill="#f1d7a6" stroke="#111" strokeWidth={3} />
        <circle cx={0} cy={-6} r={12} fill="#b5281c" />
        <Flame x={0} y={-10} h={70} seed={9} />
      </g>
      <text x={200} y={830} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={46} fill="#fff">
        AGENCY
      </text>
      <text x={200} y={880} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={30} fill="rgba(255,255,255,0.7)">
        "trust us bro"
      </text>
      {roofers.map((x, i) => {
        const jump = fire > 0.5 ? Math.abs(Math.sin((frame + i * 5) / 4)) * 30 : 0;
        return (
          <g key={x}>
            <StickFigure pose={blend(POSES.stand, POSES.alarmed, fire)} x={x} y={1206 - jump} scale={0.95} hardHat />
            <g opacity={fire}>
              <Flame x={x} y={1336} h={220 * fire + Math.sin(frame / 2 + i) * 14} seed={i * 3} />
            </g>
            <text x={x} y={820 - jump} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={56} fill="#fff" opacity={fire}>
              {["!!", "OUCH", "!!"][i]}
            </text>
          </g>
        );
      })}
      <text x={720} y={1450} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={44} fill="#fff" letterSpacing={2}>
        ROOFERS
      </text>
    </svg>
  );
};

// Phone chat with an agency: promise, invoice, weak ad, then ghosted.
export const AgencyChat: React.FC<{ len: number; promiseAt: number; moneyAt: number; weakAt: number; ghostAt: number }> = ({
  len,
  promiseAt,
  moneyAt,
  weakAt,
  ghostAt,
}) => {
  const frame = useCurrentFrame();
  const pop = (at: number) => interpolate(frame, [at, at + 8], [0, 1], { ...clamp, easing: back(1.6) });
  const ghost = pop(ghostAt + 8);
  const bubble = (side: "l" | "r", p: number, children: React.ReactNode) => (
    <div
      style={{
        alignSelf: side === "l" ? "flex-start" : "flex-end",
        maxWidth: "82%",
        padding: "14px 18px",
        borderRadius: side === "l" ? "22px 22px 22px 6px" : "22px 22px 6px 22px",
        background: side === "l" ? "#2a2f38" : adTheme.accentDeep,
        fontSize: 24,
        fontWeight: 600,
        lineHeight: 1.25,
        opacity: p,
        scale: String(0.8 + 0.2 * p),
        transformOrigin: side === "l" ? "0 100%" : "100% 100%",
        display: p > 0 ? "block" : "none",
      }}
    >
      {children}
    </div>
  );
  return (
    <Stage len={len} width={760} top={470}>
      <Phone height={880}>
        <div style={{ position: "absolute", inset: 0, background: "#0b0e13", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "66px 20px 14px", borderBottom: "1px solid #222" }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, background: "#444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🚀</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>
              Growth Agency™
              <div style={{ fontSize: 16, fontWeight: 500, color: ghost > 0 ? "#ff5a4a" : "#8a929c" }}>{ghost > 0 ? "Last seen 3 weeks ago" : "online"}</div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12, padding: "16px 18px 26px" }}>
            {bubble("l", pop(promiseAt), "We'll get you 100 leads a WEEK 🚀🚀🚀")}
            {bubble(
              "l",
              pop(moneyAt),
              <span>
                Invoice #1042 · <b>$4,997</b> <span style={{ color: "#3ddc97" }}>✓ Paid</span>
              </span>,
            )}
            {bubble(
              "l",
              pop(weakAt),
              <div>
                <Img src={staticFile("ads/feed-winter.png")} style={{ width: "100%", height: 200, objectFit: "cover", objectPosition: "50% 0%", borderRadius: 10, display: "block" }} />
                <div style={{ marginTop: 8 }}>here's your new ad 🔥🔥</div>
              </div>,
            )}
            {bubble("r", pop(ghostAt), "Hey… where are the leads?")}
            <div style={{ alignSelf: "flex-end", fontSize: 16, color: "#8a929c", opacity: pop(ghostAt + 4) }}>Read 9:41</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "46%",
              translate: "-50% -50%",
              fontSize: 190,
              opacity: ghost * 0.95,
              scale: String(0.6 + 0.4 * ghost),
            }}
          >
            👻
          </div>
        </div>
      </Phone>
    </Stage>
  );
};

// "Proven with 20 roofing companies": counter + wall of client logos
// (full overlay layout).
const CLIENT_LOGOS = [
  { src: "logos/happy.png", bg: "#95c241" },
  { src: "logos/action.png", bg: "#ffffff" },
  { src: "logos/vista.png", bg: "#ffffff" },
  { src: "logos/braga.png", bg: "#1a1a18" },
  { src: "logos/allseasons.png", bg: "#ffffff" },
  { src: "logos/apex.png", bg: "#000000" },
  { src: "logos/bontrager.png", bg: "#ffffff" },
  { src: "logos/bumble.png", bg: "#ffffff" },
  { src: "logos/georgia.png", bg: "#ffffff" },
  { src: "logos/greencountry.png", bg: "#ffffff" },
  { src: "logos/roofco.png", bg: "#ffffff" },
  { src: "logos/dhkraft.png", bg: "#000000" },
  { src: "logos/trueworks.png", bg: "#ffffff" },
  { src: "logos/valiant.png", bg: "#ffffff" },
];

export const TwentyRoofers: React.FC<{ len: number; countAt: number }> = ({ len, countAt }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [len - 6, len], [1, 0], clamp);
  const n = Math.round(interpolate(frame, [countAt - 6, countAt + 18], [0, 20], clamp));
  const head = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: back(1.4) });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out, fontFamily: adTheme.font, color: "#fff" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", opacity: head, scale: String(0.85 + 0.15 * head) }}>
        <div style={{ display: "inline-block" }}>
          <Kicker>Proven with</Kicker>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 22, marginTop: 10 }}>
          <div style={{ fontWeight: 900, fontSize: 200, lineHeight: 0.85, color: adTheme.accent, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums", textShadow: `0 0 50px ${accent(0.5)}`, width: 230, textAlign: "right" }}>{n}</div>
          <div style={{ fontWeight: 900, fontSize: 64, lineHeight: 1, paddingBottom: 14, textAlign: "left" }}>
            ROOFING
            <br />
            COMPANIES
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 690, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[...CLIENT_LOGOS, null].map((l, i) => {
          const p = interpolate(frame, [6 + i * 2, 18 + i * 2], [0, 1], { ...clamp, easing: back(1.8) });
          return (
            <div
              key={i}
              style={{
                height: 118,
                borderRadius: 20,
                background: l ? l.bg : `linear-gradient(135deg, ${adTheme.accentDeep}, ${adTheme.accent})`,
                border: "3px solid rgba(255,255,255,0.8)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
                padding: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: p,
                scale: String(p),
                fontWeight: 900,
                fontSize: 40,
              }}
            >
              {l ? <Img src={staticFile(l.src)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} /> : "+6 MORE"}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Our three ad creatives playing side by side (full overlay layout).
export const CreativesShowcase: React.FC<{ len: number }> = ({ len }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [len - 6, len], [1, 0], clamp);
  const clips = [
    { src: "ads/creative-valiant1.mp4", x: 250, rot: -9, d: 4 },
    { src: "ads/creative-valiant2.mp4", x: 830, rot: 9, d: 8 },
    { src: "ads/creative-braga.mp4", x: 540, rot: 0, d: 0 },
  ];
  const badge = interpolate(frame, [10, 22], [0, 1], { ...clamp, easing: back(1.8) });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out, fontFamily: adTheme.font, color: "#fff" }}>
      {clips.map((c) => {
        const p = interpolate(frame, [c.d, c.d + 14], [0, 1], { ...clamp, easing: back(1.4) });
        return (
          <div
            key={c.src}
            style={{
              position: "absolute",
              left: c.x - 210,
              top: 440,
              width: 420,
              rotate: `${c.rot * p}deg`,
              scale: String(0.74 * (0.7 + 0.3 * p) * (c.rot === 0 ? 1.08 : 1)),
              transformOrigin: "50% 30%",
              opacity: p,
              translate: `0 ${(1 - p) * 200}px`,
            }}
          >
            <Phone>
              <OffthreadVideo src={staticFile(c.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Phone>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 1310,
          translate: "-50% 0",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "20px 34px",
          borderRadius: 999,
          background: `linear-gradient(135deg, ${adTheme.accentDeep}, ${adTheme.accent})`,
          boxShadow: `0 0 50px ${accent(0.5)}`,
          fontWeight: 900,
          fontSize: 40,
          whiteSpace: "nowrap",
          scale: String(badge),
        }}
      >
        <Check p={badge} size={40} color="#fff" />
        FILMED IN PERSON · EDITED IN-HOUSE
      </div>
    </div>
  );
};

// Ronaldo-style kick: power stance, run-up, huge strike, ball labelled
// "another marketing agency" rockets into the back of the net, then SIUUU.
export const SoccerKick: React.FC<{ len: number; kickAt: number; landAt: number }> = ({ len, kickAt, landAt }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [len - 6, len], [1, 0], clamp);
  const GROUND = 1330;
  const ballStart: [number, number] = [600, GROUND - 86];
  // Where the ball ends up: inside the goal.
  const net: [number, number] = [905, GROUND + 4];

  // Player pose + position over time.
  const runStart = 10;
  const windAt = kickAt - 5;
  let pose = POSES.power;
  let px = 230;
  let py = GROUND - 124 * 1.3;
  if (frame < runStart) {
    // chest-out breathing in the power stance
    py += Math.sin(frame / 2.5) * 4;
  } else if (frame < windAt) {
    const t = (frame - runStart) / Math.max(1, windAt - runStart);
    px = 230 + t * 220;
    pose = blend(POSES.runA, POSES.runB, (Math.sin((frame - runStart) * 1.1) + 1) / 2);
    py -= Math.abs(Math.sin((frame - runStart) * 1.1)) * 14;
  } else if (frame < kickAt) {
    px = 450 + (frame - windAt) * 6;
    pose = blend(POSES.runB, POSES.windup, (frame - windAt) / (kickAt - windAt));
  } else if (frame < landAt + 2) {
    px = 480;
    pose = blend(POSES.windup, POSES.kick, interpolate(frame, [kickAt, kickAt + 4], [0, 1], clamp));
  } else {
    // SIUUU: spin jump, then land in the wide-arms pose.
    const t = frame - (landAt + 2);
    const jumpH = interpolate(t, [0, 7, 14], [0, 140, 0], clamp);
    px = 480;
    py -= jumpH;
    pose = t < 14 ? POSES.jump : POSES.siu;
  }
  const spinFlip = frame >= landAt + 2 && frame < landAt + 16 ? Math.floor((frame - landAt) / 3) % 2 === 0 : false;

  // Ball flight: a rising rocket straight into the top of the net.
  const flight = interpolate(frame, [kickAt, landAt], [0, 1], clamp);
  const bx = (1 - flight) ** 2 * ballStart[0] + 2 * (1 - flight) * flight * 780 + flight ** 2 * net[0];
  const by = (1 - flight) ** 2 * ballStart[1] + 2 * (1 - flight) * flight * (GROUND - 330) + flight ** 2 * (net[1] - 200);
  const settled = frame >= landAt;
  const bounce = settled ? Math.abs(Math.sin((frame - landAt) / 2.2)) * Math.max(0, 40 - (frame - landAt) * 4) : 0;
  // After hitting the net it drops to the grass inside the goal.
  const drop = settled ? interpolate(frame, [landAt, landAt + 8], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }) : 0;
  const ballPos: [number, number] = frame < kickAt ? ballStart : settled ? [net[0] + 20 * drop, net[1] - 200 + drop * 126 - bounce] : [bx, by];
  const bulge = interpolate(frame, [landAt - 1, landAt + 2, landAt + 12], [0, 1, 0.2], clamp);
  const spin = frame < kickAt ? 0 : (frame - kickAt) * 38;
  const ballScale = settled ? 0.8 : 1 - flight * 0.2;
  const trail = !settled && frame >= kickAt;

  const impact = interpolate(frame, [kickAt, kickAt + 2, kickAt + 10], [0, 1, 0], clamp);
  const shake = impact * Math.sin(frame * 3) * 18;
  const siu = interpolate(frame, [landAt + 14, landAt + 20], [0, 1], { ...clamp, easing: back(2.2) });

  return (
    <div style={{ position: "absolute", inset: 0, opacity: out, translate: `${shake}px ${shake * 0.6}px` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* Pitch */}
        <rect x={0} y={GROUND} width={1080} height={20} fill="rgba(255,255,255,0.18)" />
        <line x1={0} x2={1080} y1={GROUND} y2={GROUND} stroke="#fff" strokeWidth={5} />

        {/* Soccer goal, three-quarter view: white posts + crossbar in front,
            net box receding behind, bulging on impact. */}
        <g>
          {(() => {
            const L = 720;
            const R = 1050;
            const T = GROUND - 400;
            const dx = 40 + bulge * 26;
            const dy = 70;
            const bL = L + dx;
            const bR = R + dx;
            const bT = T + dy * 0.55;
            const bG = GROUND - dy;
            const net = "rgba(255,255,255,0.5)";
            const lines: React.ReactNode[] = [];
            // back face grid
            for (let k = 0; k <= 10; k++) {
              const x = bL + ((bR - bL) * k) / 10;
              lines.push(<line key={`bv${k}`} x1={x} y1={bT} x2={x} y2={bG} stroke={net} strokeWidth={2.5} />);
            }
            for (let k = 0; k <= 6; k++) {
              const y = bT + ((bG - bT) * k) / 6;
              lines.push(<line key={`bh${k}`} x1={bL} y1={y} x2={bR} y2={y} stroke={net} strokeWidth={2.5} />);
            }
            // roof + side nets joining front frame to back
            for (let k = 0; k <= 10; k++) {
              const t = k / 10;
              lines.push(<line key={`r${k}`} x1={L + (R - L) * t} y1={T} x2={bL + (bR - bL) * t} y2={bT} stroke={net} strokeWidth={2.5} />);
            }
            for (let k = 0; k <= 6; k++) {
              const t = k / 6;
              lines.push(<line key={`sl${k}`} x1={L} y1={T + (GROUND - T) * t} x2={bL} y2={bT + (bG - bT) * t} stroke={net} strokeWidth={2.5} />);
              lines.push(<line key={`sr${k}`} x1={R} y1={T + (GROUND - T) * t} x2={bR} y2={bT + (bG - bT) * t} stroke={net} strokeWidth={2.5} />);
            }
            return (
              <>
                {/* pitch markings: goal line + six-yard box */}
                <path d={`M${L - 60} ${GROUND + 18} L${R + 60} ${GROUND + 18}`} stroke="#fff" strokeWidth={4} opacity={0.7} />
                {lines}
                <path d={`M${bL} ${bG} L${bL} ${bT} L${bR} ${bT} L${bR} ${bG}`} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={4} />
                <path d={`M${L} ${GROUND} L${bL} ${bG} M${R} ${GROUND} L${bR} ${bG}`} stroke="rgba(255,255,255,0.75)" strokeWidth={4} />
                {/* posts and crossbar */}
                <path d={`M${L} ${GROUND} L${L} ${T} L${R} ${T} L${R} ${GROUND}`} fill="none" stroke="#111" strokeWidth={22} strokeLinejoin="round" />
                <path d={`M${L} ${GROUND} L${L} ${T} L${R} ${T} L${R} ${GROUND}`} fill="none" stroke="#fff" strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
              </>
            );
          })()}
        </g>

        {/* Speed lines during the run-up */}
        {frame >= runStart && frame < kickAt
          ? [0, 1, 2].map((i) => (
              <line key={i} x1={px - 140 - i * 30} x2={px - 70 - i * 30} y1={py - 120 + i * 60} y2={py - 120 + i * 60} stroke="rgba(255,255,255,0.6)" strokeWidth={6} strokeLinecap="round" />
            ))
          : null}

        <StickFigure pose={pose} x={px} y={py} scale={1.3} flip={spinFlip} stroke={10} />
        <text x={px} y={py - 380} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={40} fill="#fff" opacity={frame < runStart + 4 ? 1 : 0}>
          *deep breath*
        </text>

        {/* Ball trail */}
        {trail
          ? Array.from({ length: 6 }, (_, k) => {
              const f2 = interpolate(frame - (k + 1) * 1.5, [kickAt, landAt], [0, 1], clamp);
              const tx = (1 - f2) ** 2 * ballStart[0] + 2 * (1 - f2) * f2 * 780 + f2 ** 2 * net[0];
              const ty = (1 - f2) ** 2 * ballStart[1] + 2 * (1 - f2) * f2 * (GROUND - 330) + f2 ** 2 * (net[1] - 200);
              return <circle key={k} cx={tx} cy={ty} r={80 * ballScale * (1 - k * 0.12)} fill="#fff" opacity={0.22 - k * 0.03} />;
            })
          : null}

        {/* Impact burst */}
        <g opacity={impact} transform={`translate(${ballStart[0]} ${ballStart[1]}) scale(${0.6 + impact})`}>
          <polygon
            points={Array.from({ length: 24 }, (_, k) => {
              const r = k % 2 ? 70 : 150;
              const a = (k / 24) * Math.PI * 2;
              return `${Math.cos(a) * r},${Math.sin(a) * r}`;
            }).join(" ")}
            fill="#ffd400"
            stroke="#111"
            strokeWidth={6}
          />
          <text x={0} y={16} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={52} fill="#111">
            BOOM!
          </text>
        </g>
      </svg>

      {/* The ball */}
      <div
        style={{
          position: "absolute",
          left: ballPos[0] - 86,
          top: ballPos[1] - 86,
          width: 172,
          height: 172,
          borderRadius: 86,
          background: "radial-gradient(circle at 35% 30%, #fff, #e6e9ee 70%, #b9c0ca)",
          border: "6px solid #111",
          scale: String(ballScale),
          boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, rotate: `${spin}deg` }}>
          {[0, 72, 144, 216, 288].map((a) => (
            <div key={a} style={{ position: "absolute", left: 86 + Math.cos((a * Math.PI) / 180) * 62 - 16, top: 86 + Math.sin((a * Math.PI) / 180) * 62 - 16, width: 32, height: 32, background: "#111", borderRadius: 8, rotate: "45deg" }} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            inset: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontFamily: adTheme.font,
            fontWeight: 900,
            fontSize: 22,
            lineHeight: 1.02,
            color: "#e3161b",
            rotate: `${spin * 0.15}deg`,
          }}
        >
          ANOTHER MARKETING AGENCY
        </div>
      </div>
      {settled ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 560,
            textAlign: "center",
            fontFamily: adTheme.font,
            fontWeight: 900,
            fontSize: 120,
            color: "#ffd400",
            WebkitTextStroke: "7px #111",
            paintOrder: "stroke fill",
            textShadow: "8px 8px 0 #111",
            scale: String(interpolate(frame, [landAt, landAt + 5], [0, 1], { ...clamp, easing: back(2.4) })),
            opacity: interpolate(frame, [landAt + 12, landAt + 16], [1, 0], clamp),
            rotate: "4deg",
          }}
        >
          GOAL!
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 520,
          textAlign: "center",
          fontFamily: adTheme.font,
          fontWeight: 900,
          fontSize: 170,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: "#fff",
          WebkitTextStroke: "8px #111",
          paintOrder: "stroke fill",
          textShadow: "10px 10px 0 #111",
          scale: String(siu),
          rotate: "-6deg",
        }}
      >
        SIUUU!
      </div>
    </div>
  );
};

// "If you win, we win": roofer and us high-five.
export const HighFive: React.FC<{ len: number; clapAt: number }> = ({ len, clapAt }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [len - 5, len], [1, 0], clamp);
  const approach = interpolate(frame, [0, clapAt], [0, 1], { ...clamp, easing: OUT });
  const clap = interpolate(frame, [clapAt, clapAt + 3, clapAt + 12], [0, 1, 0.6], clamp);
  const jump = Math.abs(Math.sin(Math.max(0, frame - clapAt) / 3)) * 26 * (frame > clapAt ? 1 : 0);
  const G = 1330;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={60} x2={1020} y1={G} y2={G} stroke="rgba(255,255,255,0.3)" strokeWidth={4} />
        <StickFigure pose={POSES.highFiveL} x={180 + approach * 240} y={G - 124 * 1.2 - jump} scale={1.2} hardHat />
        <StickFigure pose={POSES.highFiveL} x={900 - approach * 240} y={G - 124 * 1.2 - jump} scale={1.2} flip headFill={adTheme.accentDeep} />
        <text x={180 + approach * 240} y={G + 70} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={44} fill="#fff">
          YOU
        </text>
        <text x={900 - approach * 240} y={G + 70} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={44} fill={adTheme.accent}>
          US
        </text>
        <g opacity={clap} transform={`translate(540 ${G - 124 * 1.2 - 300 * 1.2 - jump}) scale(${0.5 + clap * 0.7})`}>
          <polygon
            points={Array.from({ length: 20 }, (_, k) => {
              const r = k % 2 ? 50 : 120;
              const a = (k / 20) * Math.PI * 2;
              return `${Math.cos(a) * r},${Math.sin(a) * r}`;
            }).join(" ")}
            fill="#ffd400"
            stroke="#111"
            strokeWidth={5}
          />
        </g>
        {Array.from({ length: 10 }, (_, k) => {
          const a = random(`cf${k}`) * Math.PI * 2;
          const d = Math.max(0, frame - clapAt) * (10 + random(`cd${k}`) * 10);
          return (
            <rect
              key={k}
              x={540 + Math.cos(a) * d}
              y={G - 560 + Math.sin(a) * d + Math.max(0, frame - clapAt) ** 2 * 0.6}
              width={18}
              height={10}
              fill={[adTheme.accent, "#ffd400", "#fff", "#ff5a4a"][k % 4]}
              opacity={frame > clapAt ? 1 : 0}
              transform={`rotate(${frame * 20 + k * 40} ${540 + Math.cos(a) * d} ${G - 560 + Math.sin(a) * d})`}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 470,
          textAlign: "center",
          fontFamily: adTheme.font,
          fontWeight: 900,
          fontSize: 130,
          lineHeight: 1,
          color: "#fff",
          WebkitTextStroke: "7px #111",
          paintOrder: "stroke fill",
          textShadow: "9px 9px 0 #111",
          scale: String(interpolate(frame, [clapAt, clapAt + 6], [0, 1], { ...clamp, easing: back(2) })),
          rotate: "-4deg",
        }}
      >
        WE WIN!
      </div>
    </div>
  );
};
