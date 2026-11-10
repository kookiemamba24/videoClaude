import React, { useMemo } from "react";
import { Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { Check, Glass, Kicker, Phone, Stage } from "../Ad/Graphics";
import { T } from "../TradieStyle/kit";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const back = (s = 1.8) => Easing.out(Easing.back(s));
const RED = "#ff4d3d";

// Generic "lead" person: round head + shoulders, with a tiny tag.
const LeadPerson: React.FC<{ x: number; y: number; s: number; color: string; tag?: string }> = ({ x, y, s, color, tag }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-34} r={16} fill={color} />
    <path d="M-26 6 Q-26 -14 0 -14 Q26 -14 26 6 Z" fill={color} />
    {tag ? (
      <text x={0} y={-58} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={18} fill="#fff" opacity={0.9}>
        {tag}
      </text>
    ) : null}
  </g>
);

// Full-frame: a roofing business gets swarmed by ~100 leads, the counter
// climbs, booked jobs stay at 0, then a red cross slams over it all.
export const LeadSwarm: React.FC<{ len: number; crossAt: number }> = ({ len, crossAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = interpolate(frame, [len - 6, len], [1, 0], clamp);
  const cx = 540;
  const cy = 980;
  const people = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => {
        // Final spot: rings around the office.
        const ring = Math.floor(i / 25);
        const a = (i % 25) / 25 * Math.PI * 2 + ring * 0.3 + (random(`la${i}`) - 0.5) * 0.15;
        const r = 330 + ring * 70 + random(`lr${i}`) * 25;
        const tx = cx + Math.cos(a) * r;
        const ty = cy + Math.sin(a) * r * 0.78;
        // Start: off the frame edge in the same direction.
        const sx = cx + Math.cos(a) * 1200;
        const sy = cy + Math.sin(a) * 1200;
        return { tx, ty, sx, sy, delay: random(`ld${i}`) * 0.9 * fps, tag: ["?", "$?", "…", "💤"][i % 4] };
      }),
    [fps],
  );
  const arrived = people.filter((p) => frame > p.delay + 14).length;
  const cross = interpolate(frame, [crossAt, crossAt + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shake = frame >= crossAt && frame < crossAt + 8 ? Math.sin(frame * 3) * 14 : 0;
  const stuck = interpolate(frame, [crossAt + 8, crossAt + 16], [0, 1], { ...clamp, easing: back(2) });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out, translate: `${shake}px 0`, fontFamily: T.sans, color: "#fff" }}>
      {/* counters */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 40 }}>
        <div style={{ padding: "18px 30px", borderRadius: 22, background: "rgba(10,14,22,0.75)", border: "1.5px solid rgba(255,255,255,0.2)", textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)" }}>LEADS</div>
          <div style={{ fontWeight: 900, fontSize: 88, lineHeight: 1, color: T.accent, fontVariantNumeric: "tabular-nums" }}>{arrived}</div>
        </div>
        <div style={{ padding: "18px 30px", borderRadius: 22, background: "rgba(10,14,22,0.75)", border: `1.5px solid ${RED}`, textAlign: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)" }}>BOOKED JOBS</div>
          <div style={{ fontWeight: 900, fontSize: 88, lineHeight: 1, color: RED }}>0</div>
        </div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* the roofing business */}
        <g transform={`translate(${cx} ${cy})`}>
          <ellipse cx={0} cy={150} rx={210} ry={26} fill="rgba(0,0,0,0.4)" />
          <path d="M-200 -10 L0 -150 L200 -10 Z" fill="#2c3a50" stroke="#fff" strokeWidth={7} strokeLinejoin="round" />
          <rect x={-170} y={-12} width={340} height={160} rx={8} fill="#e9eef4" stroke="#fff" strokeWidth={6} />
          <rect x={-130} y={20} width={80} height={60} rx={5} fill="#1d2b40" />
          <rect x={40} y={40} width={80} height={108} rx={5} fill="#1d2b40" />
          <text x={0} y={-50} textAnchor="middle" fontWeight={900} fontSize={38} fill="#fff" fontFamily="Montserrat">
            YOUR ROOFING
          </text>
        </g>
        {/* the swarm */}
        {people.map((p, i) => {
          const t = interpolate(frame, [p.delay, p.delay + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const jitter = t >= 1 ? Math.sin((frame + i * 7) / 3) * 3 : 0;
          const x = p.sx + (p.tx - p.sx) * t + jitter;
          const y = p.sy + (p.ty - p.sy) * t;
          const col = cross > 0.5 ? RED : "rgba(200,212,228,0.92)";
          return <LeadPerson key={i} x={x} y={y} s={0.95} color={col} tag={i % 3 === 0 ? p.tag : undefined} />;
        })}
        {/* the cross */}
        <g opacity={cross > 0 ? 1 : 0} style={{ filter: `drop-shadow(0 0 30px rgba(255,77,61,0.7))` }}>
          <path
            d={`M${cx - 380} ${cy - 380} L${cx + 380} ${cy + 380}`}
            stroke={RED}
            strokeWidth={70}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - interpolate(cross, [0, 0.5], [0, 1], clamp)}
          />
          <path
            d={`M${cx + 380} ${cy - 380} L${cx - 380} ${cy + 380}`}
            stroke={RED}
            strokeWidth={70}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - interpolate(cross, [0.5, 1], [0, 1], clamp)}
          />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1440,
          textAlign: "center",
          fontWeight: 900,
          fontSize: 100,
          letterSpacing: "-0.02em",
          color: "#fff",
          textShadow: `0 0 40px rgba(255,77,61,0.6)`,
          scale: String(stuck),
        }}
      >
        STUCK <span style={{ color: RED }}>&amp;</span> BROKE
      </div>
    </div>
  );
};

// Phone: new-lead notifications pile up faster than you can reply; the
// oldest turns red "Went with another roofer".
export const LeadPileUp: React.FC<{ len: number; lostAt: number }> = ({ len, lostAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = ["New lead · Roof leak", "New lead · Quote request", "New lead · Gutters", "New lead · Full replacement", "New lead · Storm damage", "New lead · Re-roof"];
  const lost = interpolate(frame, [lostAt, lostAt + 8], [0, 1], { ...clamp, easing: back(1.6) });
  return (
    <Stage len={len} width={760} top={470}>
      <Phone height={860}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, #1f4fa8, #071023 75%)" }} />
        <div style={{ position: "absolute", top: 90, width: "100%", textAlign: "center", fontFamily: T.sans }}>
          <div style={{ fontSize: 110, fontWeight: 600, lineHeight: 1 }}>9:41</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>{Math.min(items.length, Math.floor(frame / (0.45 * fps)) + 1)} unanswered</div>
        </div>
        {items.map((t, i) => {
          const at = i * 0.45 * fps;
          const p = interpolate(frame, [at, at + 8], [0, 1], { ...clamp, easing: back(1.4) });
          const isLost = i === 0 && lost > 0;
          const mins = Math.max(1, Math.round((frame - at) / fps * 25));
          return (
            <div
              key={t}
              style={{
                position: "absolute",
                left: 18,
                right: 18,
                top: 270 + (items.length - 1 - i) * 92,
                padding: "14px 18px",
                borderRadius: 22,
                background: isLost ? `rgba(255,77,61,${0.25 + 0.6 * lost})` : "rgba(255,255,255,0.2)",
                border: isLost ? "2px solid #fff" : "none",
                fontFamily: T.sans,
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: p,
                translate: `0 ${(1 - p) * -40}px`,
              }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 12, background: isLost ? "#fff" : T.accent, color: isLost ? RED : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 26, flexShrink: 0 }}>
                {isLost ? "✕" : "🔔"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 22 }}>{isLost ? "Went with another roofer" : t}</div>
                <div style={{ fontWeight: 600, fontSize: 17, color: "rgba(255,255,255,0.75)" }}>{isLost ? "You replied too late" : `${mins} min ago · no reply`}</div>
              </div>
            </div>
          );
        })}
      </Phone>
    </Stage>
  );
};

// Who we put you in front of: three ticks timed to the words.
export const BuyerChecklist: React.FC<{ len: number; ats: number[] }> = ({ len, ats }) => {
  const frame = useCurrentFrame();
  const rows = ["Already looking for a roofer", "Already have the budget", "Ready to book"];
  return (
    <Stage len={len} width={960} top={600}>
      <Glass>
        <Kicker>Who we put you in front of</Kicker>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 26 }}>
          {rows.map((r, i) => {
            const p = interpolate(frame, [ats[i], ats[i] + 10], [0, 1], { ...clamp, easing: back(1.6) });
            return (
              <div
                key={r}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "20px 24px",
                  borderRadius: 20,
                  background: `rgba(77,163,255,${0.08 + 0.12 * p})`,
                  border: `2px solid rgba(77,163,255,${0.2 + 0.5 * p})`,
                  opacity: 0.35 + 0.65 * p,
                  scale: String(0.94 + 0.06 * p),
                  fontWeight: 800,
                  fontSize: 50,
                }}
              >
                <Check p={p} size={44} />
                {r}
              </div>
            );
          })}
        </div>
      </Glass>
    </Stage>
  );
};
