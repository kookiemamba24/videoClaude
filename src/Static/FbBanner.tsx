import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

loadFont({ family: "Cormorant", url: staticFile("fonts/Cormorant-600.woff2"), weight: "600" });
loadFont({ family: "Cormorant", url: staticFile("fonts/Cormorant-700.woff2"), weight: "700" });
loadFont({ family: "Barlow", url: staticFile("fonts/Barlow-600.woff2"), weight: "600" });
loadFont({ family: "Barlow", url: staticFile("fonts/Barlow-700.woff2"), weight: "700" });

const INK = "#f4f7fb";
const SOFT = "rgba(214,226,242,0.82)";
const BLUE = "#4da3ff";

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={52} height={52} viewBox="0 0 48 48" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {children}
  </svg>
);

const SERVICES: { icon: React.ReactNode; title: string; line: string }[] = [
  {
    // house with a star: brand
    icon: (
      <>
        <path d="M5 23 L24 7 L43 23" />
        <path d="M10 19 V41 H38 V19" />
        <path d="M24 20 l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />
      </>
    ),
    title: "BRAND & POSITIONING",
    line: "Look like the most trusted roofer in your area.",
  },
  {
    // camera: content
    icon: (
      <>
        <rect x={5} y={13} width={38} height={27} rx={4} />
        <path d="M16 13 l3-5 h10 l3 5" />
        <circle cx={24} cy={26.5} r={8} />
        <circle cx={24} cy={26.5} r={3.5} />
      </>
    ),
    title: "VIDEO ADS & WEBSITES",
    line: "Premium creative that showcases your work.",
  },
  {
    // calendar with check: bookings
    icon: (
      <>
        <rect x={6} y={10} width={36} height={32} rx={4} />
        <path d="M6 19 H42 M15 6 V13 M33 6 V13" />
        <path d="M17 30 l5 5 9-10" />
      </>
    ),
    title: "LEADS & BOOKED JOBS",
    line: "6–12 more booked jobs in 90 days, guaranteed.",
  },
  {
    // phone + stopwatch: follow-up
    icon: (
      <>
        <rect x={7} y={5} width={18} height={36} rx={3} />
        <path d="M13 36 H19" />
        <circle cx={34} cy={30} r={9} />
        <path d="M34 25 V30 L37.5 32.5 M32 18.5 H36" />
      </>
    ),
    title: "30-SECOND FOLLOW-UP",
    line: "Our customer service team + automated systems call every lead.",
  },
];

// Facebook cover, 1640x624. Light brushed-steel look with the chrome AV
// badge as the centrepiece and a glass roofline behind it.
export const FbBanner: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "repeating-linear-gradient(92deg, rgba(255,255,255,0.018) 0 2px, rgba(0,0,0,0.02) 2px 4px), radial-gradient(ellipse 55% 95% at 56% 40%, #1d4f97 0%, #0f2f63 45%, #071733 80%, #040c1d 100%)",
      overflow: "hidden",
    }}
  >
    {/* Soft light sweeps */}
    <div style={{ position: "absolute", left: 560, top: -560, width: 920, height: 920, borderRadius: "50%", border: "50px solid rgba(120,170,255,0.08)", filter: "blur(3px)" }} />
    <div style={{ position: "absolute", left: -260, bottom: -380, width: 760, height: 520, rotate: "-18deg", background: "linear-gradient(100deg, rgba(255,255,255,0), rgba(140,185,255,0.12) 50%, rgba(255,255,255,0))" }} />

    <svg width={1640} height={624} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4da3ff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#4da3ff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="roofL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9d6e6" />
        </linearGradient>
        <linearGradient id="roofR" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e9f0f8" />
          <stop offset="1" stopColor="#9fb2c9" />
        </linearGradient>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f6fb" />
          <stop offset="1" stopColor="#c3d0df" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Rising market chart behind the roof */}
      {(() => {
        const x0 = 720;
        const x1 = 1190;
        const yb = 520;
        const gridYs = [140, 220, 300, 380, 460];
        const pts = [0.08, 0.14, 0.11, 0.22, 0.19, 0.3, 0.27, 0.4, 0.36, 0.5, 0.47, 0.6, 0.58, 0.72, 0.69, 0.86, 0.95];
        const xy = pts.map((v, i) => [x0 + ((x1 - x0) * i) / (pts.length - 1), yb - v * 400] as const);
        const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
        const [ex, ey] = xy[xy.length - 1];
        const [px, py] = xy[xy.length - 2];
        const ang = Math.atan2(ey - py, ex - px);
        const h = 26;
        return (
          <g>
            {gridYs.map((y) => (
              <line key={y} x1={x0} x2={x1} y1={y} y2={y} stroke="rgba(160,195,255,0.13)" strokeWidth={1.5} />
            ))}
            {xy.map(([x], i) =>
              i % 2 === 0 ? <line key={`v${i}`} x1={x} x2={x} y1={120} y2={yb} stroke="rgba(160,195,255,0.08)" strokeWidth={1.5} /> : null,
            )}
            {/* candles */}
            {xy.slice(1).map(([x, y], i) => {
              const up = y < xy[i][1];
              const top = Math.min(y, xy[i][1]);
              const hgt = Math.abs(y - xy[i][1]) + 6;
              return <rect key={`c${i}`} x={x - 8} y={top - 3} width={16} height={hgt} rx={2} fill={up ? "rgba(77,163,255,0.35)" : "rgba(255,255,255,0.18)"} />;
            })}
            <path d={`${line} L${x1} ${yb} L${x0} ${yb} Z`} fill="url(#area)" />
            <path d={line} fill="none" stroke={BLUE} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)" />
            <path
              d={`M${ex - Math.cos(ang - 0.5) * h} ${ey - Math.sin(ang - 0.5) * h} L${ex} ${ey} L${ex - Math.cos(ang + 0.5) * h} ${ey - Math.sin(ang + 0.5) * h}`}
              fill="none"
              stroke={BLUE}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          </g>
        );
      })()}

      {/* Premium white roof (gable, three-quarter view) */}
      <ellipse cx={905} cy={560} rx={250} ry={20} fill="rgba(0,0,0,0.45)" style={{ filter: "blur(12px)" }} />
      {/* gable end facing left, ridge running back to the right */}
      <path d="M700 552 L700 452 L790 380 L880 452 L880 552 Z" fill="url(#wall)" />
      <path d="M880 552 L880 452 L1110 452 L1110 552 Z" fill="#a9bbd0" />
      {/* main roof slope */}
      <path d="M790 372 L1020 372 L1128 462 L898 462 Z" fill="url(#roofL)" />
      {Array.from({ length: 11 }, (_, k) => {
        const t = (k + 1) / 12;
        return <line key={k} x1={790 + 230 * t} y1={372} x2={898 + 230 * t} y2={462} stroke="rgba(110,130,160,0.32)" strokeWidth={2} />;
      })}
      {/* eave fascia + gable verge trims */}
      <path d="M898 462 L1128 462 L1128 472 L898 472 Z" fill="#8fa4bd" />
      <path d="M684 466 L790 372 L898 466" fill="none" stroke="#ffffff" strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M790 372 L1020 372" stroke="#ffffff" strokeWidth={7} strokeLinecap="round" />
      {/* windows + door */}
      <rect x={770} y={470} width={40} height={34} rx={3} fill="#1d4f97" stroke="#fff" strokeWidth={3} />
      <rect x={930} y={482} width={46} height={34} rx={3} fill="#1d4f97" stroke="#fff" strokeWidth={3} />
      <rect x={1010} y={480} width={40} height={72} rx={3} fill="#21324a" />
    </svg>

    {/* Left: wordmark + headline */}
    <div style={{ position: "absolute", left: 110, top: 86, width: 660 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Img src={staticFile("brand/av-logo-dark.png")} style={{ width: 58, height: 58, mixBlendMode: "screen" }} />
        <div style={{ fontFamily: "Barlow", fontWeight: 700, fontSize: 22, letterSpacing: "0.32em", color: SOFT }}>ALVOLUTION ENTERPRISES</div>
      </div>
      <div style={{ width: 70, height: 2, background: BLUE, margin: "16px 0 18px" }} />
      <div style={{ fontFamily: "Cormorant", fontWeight: 600, fontSize: 57, lineHeight: 1, color: INK, letterSpacing: "0.005em", whiteSpace: "nowrap" }}>
        BUILDING PREMIUM
        <br />
        BRANDS FOR
        <br />
        ROOFING BUSINESSES.
      </div>
      <div style={{ fontFamily: "Barlow", fontWeight: 600, fontSize: 24, color: SOFT, marginTop: 20, lineHeight: 1.3 }}>
        Done-for-you growth systems that fill
        <br />
        your calendar with booked roofing jobs.
      </div>
    </div>

    {/* Right: services */}
    <div style={{ position: "absolute", left: 1222, top: 62, width: 380, display: "flex", flexDirection: "column", gap: 30 }}>
      {SERVICES.map((s) => (
        <div key={s.title} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <Icon>{s.icon}</Icon>
          <div>
            <div style={{ fontFamily: "Barlow", fontWeight: 700, fontSize: 21, letterSpacing: "0.06em", color: INK }}>{s.title}</div>
            <div style={{ fontFamily: "Barlow", fontWeight: 500, fontSize: 18, color: SOFT, marginTop: 6, lineHeight: 1.4, textWrap: "balance" } as React.CSSProperties}>{s.line}</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ position: "absolute", left: 110, bottom: 52, fontFamily: "Barlow", fontWeight: 700, fontSize: 19, letterSpacing: "0.2em", color: SOFT }}>
      WWW.ALVOLUTION.COM &nbsp;·&nbsp; +61 450 148 664
    </div>
  </AbsoluteFill>
);
