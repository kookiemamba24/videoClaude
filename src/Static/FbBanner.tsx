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

      {/* Premium modern home, three-quarter view, lit from the upper left */}
      <defs>
        <linearGradient id="gableFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d5e0ec" />
        </linearGradient>
        <linearGradient id="sideFace" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b9c9db" />
          <stop offset="1" stopColor="#8296ae" />
        </linearGradient>
        <linearGradient id="roofTop" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#e6edf5" />
          <stop offset="1" stopColor="#c2cfde" />
        </linearGradient>
        <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe3a8" />
          <stop offset="1" stopColor="#f39a3d" />
        </linearGradient>
        <linearGradient id="ao" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <radialGradient id="spill" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffb85c" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffb85c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground: shadow + warm light spill from the windows */}
      <ellipse cx={915} cy={566} rx={290} ry={26} fill="rgba(0,0,0,0.55)" style={{ filter: "blur(14px)" }} />
      <ellipse cx={985} cy={575} rx={180} ry={30} fill="url(#spill)" />
      <ellipse cx={790} cy={575} rx={110} ry={24} fill="url(#spill)" />

      {/* plinth */}
      <path d="M692 556 L908 556 L1130 556 L1130 568 L692 568 Z" fill="#2a3a52" />

      {/* gable wall (lit) */}
      <path d="M700 556 L700 440 L800 356 L900 440 L900 556 Z" fill="url(#gableFace)" />
      {/* tall gable glazing with warm interior glow */}
      <path d="M752 552 L752 446 L800 408 L848 446 L848 552 Z" fill="url(#warm)" />
      <path d="M752 552 L752 446 L800 408 L848 446 L848 552 Z" fill="none" stroke="#1b2a3f" strokeWidth={5} strokeLinejoin="round" />
      <path d="M800 410 L800 552 M752 498 L848 498" stroke="#1b2a3f" strokeWidth={4} />
      <path d="M760 452 L790 428 L790 470 L760 490 Z" fill="rgba(255,255,255,0.35)" />

      {/* side wall (in shade) */}
      <path d="M900 556 L900 440 L1120 440 L1120 556 Z" fill="url(#sideFace)" />
      {/* long ribbon window + door */}
      <rect x={930} y={468} width={118} height={52} rx={2} fill="url(#warm)" stroke="#1b2a3f" strokeWidth={4} />
      <path d="M969 468 V520 M1009 468 V520" stroke="#1b2a3f" strokeWidth={3} />
      <rect x={1066} y={478} width={36} height={78} rx={2} fill="#3b2a1e" stroke="#1b2a3f" strokeWidth={3} />
      <circle cx={1094} cy={518} r={2.5} fill="#e7c27d" />
      {/* shade under the eave + ambient occlusion at the base */}
      <path d="M900 440 L1120 440 L1120 462 L900 456 Z" fill="rgba(10,20,40,0.35)" />
      <rect x={700} y={520} width={420} height={36} fill="url(#ao)" />

      {/* sleek chimney */}
      <path d="M1040 318 L1066 318 L1066 380 L1040 380 Z" fill="#d7e1ec" />
      <path d="M1066 318 L1078 326 L1078 388 L1066 380 Z" fill="#8a9db4" />
      <path d="M1036 314 L1070 314 L1082 322 L1048 322 Z" fill="#ffffff" />

      {/* roof: slope surface, standing seams, thickness, crisp white trims */}
      <path d="M800 350 L1024 350 L1144 450 L920 450 Z" fill="url(#roofTop)" />
      {Array.from({ length: 13 }, (_, k) => {
        const t = (k + 1) / 14;
        const x1 = 800 + 224 * t;
        const x2 = 920 + 224 * t;
        return (
          <g key={k}>
            <line x1={x1} y1={350} x2={x2} y2={450} stroke="rgba(90,110,140,0.35)" strokeWidth={2} />
            <line x1={x1 + 2} y1={350} x2={x2 + 2} y2={450} stroke="rgba(255,255,255,0.8)" strokeWidth={1.2} />
          </g>
        );
      })}
      <path d="M920 450 L1144 450 L1144 462 L920 462 Z" fill="#7d91aa" />
      <path d="M680 456 L800 348 L920 456" fill="none" stroke="#ffffff" strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M686 466 L800 362 L914 466" fill="none" stroke="rgba(30,50,80,0.35)" strokeWidth={4} strokeLinejoin="round" />
      <path d="M800 348 L1026 348" stroke="#ffffff" strokeWidth={8} strokeLinecap="round" />
      {/* cool rim light from the blue backdrop */}
      <path d="M1026 348 L1146 450" stroke="rgba(140,190,255,0.9)" strokeWidth={3} strokeLinecap="round" />
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
