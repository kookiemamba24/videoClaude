import React from "react";
import { Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const INK = "#ffffff";
const RED = "#ff5a4a";

// Simple stick person. `walk` is a phase in radians (0 = standing still).
const Figure: React.FC<{
  x: number;
  y: number;
  scale?: number;
  walk?: number;
  facing?: 1 | -1;
  shrug?: number;
  color?: string;
}> = ({ x, y, scale = 1, walk = 0, facing = 1, shrug = 0, color = INK }) => {
  const swing = Math.sin(walk) * 22;
  const armSwing = -Math.sin(walk) * 18;
  // Shrug lifts both forearms out and up.
  const ax = 22 + shrug * 14;
  const ay = 100 - shrug * 42;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * facing} ${scale})`} stroke={color} strokeWidth={7} strokeLinecap="round" fill="none">
      <circle cx={0} cy={-166} r={20} fill="#0a2a6b" />
      <path d={`M0 -146 L0 -72`} />
      <path d={`M0 -128 L${-ax + armSwing} ${ay - 186}`} />
      <path d={`M0 -128 L${ax - armSwing} ${ay - 186}`} />
      <path d={`M0 -72 L${-14 + swing} 0`} />
      <path d={`M0 -72 L${14 - swing} 0`} />
    </g>
  );
};

// Crowd of homeowners watching the panel above, then shrugging and walking
// off both sides. Landscape 1920x1080 coordinates; feet on y=GROUND.
const GROUND = 790;

export const WalkingCrowd: React.FC<{ leaveAt: number }> = ({ leaveAt }) => {
  const frame = useCurrentFrame();
  const people = Array.from({ length: 10 }, (_, i) => {
    const x = 420 + i * 120 + (random(`cx${i}`) - 0.5) * 40;
    const dir: 1 | -1 = x < 960 ? -1 : 1;
    return { x, dir, delay: Math.round(random(`cd${i}`) * 12), s: 0.86 + random(`cs${i}`) * 0.22, nah: i === 2 || i === 7 };
  });
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <line x1={260} x2={1660} y1={GROUND + 4} y2={GROUND + 4} stroke="rgba(255,255,255,0.25)" strokeWidth={3} strokeDasharray="10 12" />
      {people.map((p, i) => {
        const inP = interpolate(frame, [4 + i * 1.5, 14 + i * 1.5], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
        const start = leaveAt + p.delay;
        const shrug = interpolate(frame, [start - 10, start - 4, start + 2, start + 6], [0, 1, 1, 0], clamp);
        const t = Math.max(0, frame - start);
        const dx = p.dir * (t * 11 + t * t * 0.25);
        const nahP = interpolate(frame, [start - 10, start - 4, start + 8, start + 14], [0, 1, 1, 0], clamp);
        return (
          <g key={i} opacity={inP} transform={`translate(0 ${(1 - inP) * 40})`}>
            <Figure x={p.x + dx} y={GROUND} scale={p.s * 0.85} walk={t > 0 ? t * 0.55 : 0} facing={t > 0 ? p.dir : 1} shrug={shrug} />
            {p.nah ? (
              <text
                x={p.x + dx}
                y={GROUND - 190 * p.s}
                textAnchor="middle"
                fontFamily="Inter"
                fontWeight={900}
                fontSize={34}
                fill="#fff"
                opacity={nahP}
              >
                NAH.
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

const AD_IMAGES = [
  "ads/feed-trustbro.png",
  "ads/bad-righton.png",
  "ads/feed-winter.png",
  "ads/bad-doors.png",
  "ads/feed-leaks.png",
  "ads/bad-collage.png",
  "ads/feed-leaky.png",
];

// Full-screen gag: a stick figure spamming ads from his monitor while leads
// stay at zero, then raging on `rageAt`. Landscape 1920x1080 coordinates.
export const AdSpammer: React.FC<{ rageAt: number }> = ({ rageAt }) => {
  const frame = useCurrentFrame();
  const raging = frame >= rageAt;
  const rage = interpolate(frame, [rageAt, rageAt + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const shake = raging ? Math.sin(frame * 2.3) * 6 : 0;
  const typing = !raging && frame % 6 < 3;
  const spawnEvery = 3;
  const ads = Array.from({ length: Math.floor(Math.min(frame, rageAt) / spawnEvery) }, (_, k) => k);
  const launched = Math.floor(Math.min(frame, rageAt) * 0.75);
  const monX = 620;
  const monY = 390;
  return (
    <div style={{ position: "absolute", inset: 0, fontFamily: "Inter", color: "#fff" }}>
      {/* Flying ads */}
      {ads.map((k) => {
        const born = k * spawnEvery;
        const t = frame - born;
        const p = interpolate(t, [0, 26], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const tx = 1020 + random(`ax${k}`) * 760;
        const ty = 260 + random(`ay${k}`) * 480;
        const x = monX + 150 + (tx - monX - 150) * p;
        const y = monY + 90 + (ty - monY - 90) * p - Math.sin(p * Math.PI) * 120;
        const fade = interpolate(t, [30, 44], [1, 0], clamp);
        const src = AD_IMAGES[k % AD_IMAGES.length];
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x - 70,
              top: y - 80,
              width: 140,
              height: 160,
              borderRadius: 10,
              overflow: "hidden",
              border: "3px solid #fff",
              boxShadow: "0 10px 24px rgba(0,0,0,0.45)",
              rotate: `${(random(`ar${k}`) - 0.5) * 40 * p}deg`,
              scale: String(0.25 + 0.75 * p),
              opacity: fade * Math.min(1, t / 3),
            }}
          >
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        );
      })}

      {/* Counters */}
      <div
        style={{
          position: "absolute",
          right: 90,
          top: 70,
          padding: "22px 30px",
          borderRadius: 24,
          background: "rgba(10,14,22,0.82)",
          border: "1.5px solid rgba(255,255,255,0.2)",
          fontWeight: 800,
          fontSize: 34,
          lineHeight: 1.35,
          fontVariantNumeric: "tabular-nums",
          zIndex: 2,
        }}
      >
        <div>
          ADS LAUNCHED: <span style={{ color: "#4da3ff" }}>{launched}</span>
        </div>
        <div style={{ color: RED, scale: String(1 + rage * 0.18), transformOrigin: "0 50%" }}>LEADS: 0</div>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* Desk, chair, monitor */}
        <g stroke="#fff" strokeWidth={7} strokeLinecap="round" fill="none" transform={`translate(${shake * 0.4} 0)`}>
          <path d="M360 640 L1000 640 M410 640 L410 830 M950 640 L950 830" />
          <path d="M300 560 L300 830 M240 700 L360 700" />
          <rect x={monX} y={monY} width={300} height={190} rx={14} fill={raging ? RED : "#0d1830"} />
          <path d={`M${monX + 150} ${monY + 190} L${monX + 150} 640 M${monX + 100} 640 L${monX + 200} 640`} />
          <path d="M540 628 L760 628" strokeWidth={9} />
        </g>
        <text x={monX + 150} y={monY + 112} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={raging ? 54 : 40} fill="#fff">
          {raging ? "0 LEADS" : "POST AD"}
        </text>

        {/* The spammer */}
        <g stroke="#fff" strokeWidth={7} strokeLinecap="round" fill="none" transform={`translate(${shake} 0)`}>
          <circle cx={350} cy={430} r={26} fill={raging ? RED : "#0a2a6b"} />
          <path d="M352 456 L362 600" />
          {/* thigh + shin on the chair */}
          <path d="M362 600 L470 610 L470 760" />
          {raging ? (
            <>
              <path d={`M356 490 L${300 + shake} ${380 - rage * 20}`} />
              <path d={`M356 490 L${420 - shake} ${372 - rage * 20}`} />
            </>
          ) : (
            <>
              <path d={`M356 490 L470 ${560} L560 ${typing ? 616 : 606}`} />
              <path d={`M356 490 L450 ${575} L620 ${typing ? 606 : 616}`} />
            </>
          )}
        </g>

        {/* Rage scribble */}
        <g opacity={rage} transform={`translate(${350 + shake} ${250}) scale(${0.6 + 0.4 * rage})`}>
          <path
            d="M-120 0 L-90 -40 L-60 -10 L-30 -55 L0 -15 L30 -60 L60 -12 L90 -48 L120 0 L90 30 L60 5 L30 40 L0 8 L-30 42 L-60 6 L-90 34 Z"
            fill={RED}
            stroke="#fff"
            strokeWidth={5}
          />
          <text x={0} y={4} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={40} fill="#fff">
            #@$%!
          </text>
        </g>
      </svg>
    </div>
  );
};
