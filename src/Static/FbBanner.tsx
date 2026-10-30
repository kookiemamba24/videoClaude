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

      {/* Luxury home at dusk: curved two-storey pavilion with glass balconies,
          glazed centre block, gabled alfresco wing, warm interiors, pool. */}
      <defs>
        <linearGradient id="render" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9d3cb" />
          <stop offset="1" stopColor="#b7aea4" />
        </linearGradient>
        <linearGradient id="slab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3efe9" />
          <stop offset="1" stopColor="#c9c1b6" />
        </linearGradient>
        <linearGradient id="col" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9e958b" />
          <stop offset="0.45" stopColor="#ece6de" />
          <stop offset="1" stopColor="#a69d93" />
        </linearGradient>
        <linearGradient id="roofW" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfd8e3" />
        </linearGradient>
        <linearGradient id="interior" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1cf" />
          <stop offset="0.55" stopColor="#f6c27a" />
          <stop offset="1" stopColor="#d98e45" />
        </linearGradient>
        <linearGradient id="pool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fe0ff" />
          <stop offset="1" stopColor="#1590d6" />
        </linearGradient>
        <linearGradient id="glassRail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(220,240,255,0.45)" />
          <stop offset="1" stopColor="rgba(220,240,255,0.15)" />
        </linearGradient>
        <radialGradient id="spill" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffbf6b" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffbf6b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(108 52) scale(0.9)">
      {/* conifers behind the right wing */}
      <path d="M1060 452 L1092 300 L1124 452 Z" fill="#0b2a2a" />
      <path d="M1110 452 L1150 270 L1192 452 Z" fill="#0d3330" />
      <path d="M1000 380 L1024 300 L1048 380 Z" fill="#0b2a2a" />

      {/* ground shadow + warm spill */}
      <ellipse cx={920} cy={548} rx={300} ry={18} fill="rgba(0,0,0,0.5)" style={{ filter: "blur(10px)" }} />
      <ellipse cx={900} cy={540} rx={280} ry={26} fill="url(#spill)" />

      {/* ===== right wing: gabled alfresco ===== */}
      <rect x={960} y={444} width={220} height={86} fill="url(#render)" />
      <rect x={1040} y={452} width={124} height={70} fill="url(#interior)" />
      <path d="M1040 452 H1164 M1102 452 V522" stroke="rgba(120,80,40,0.45)" strokeWidth={2} />
      <rect x={1150} y={444} width={30} height={86} fill="#a99f94" />
      {/* hip roof of the wing */}
      <path d="M1026 444 L1056 412 L1170 412 L1192 444 Z" fill="url(#roofW)" />
      <path d="M1026 444 L1192 444 L1192 450 L1026 450 Z" fill="#9fb0c4" />
      {/* glazed gable */}
      <path d="M958 450 L1004 392 L1050 450 Z" fill="url(#roofW)" />
      <path d="M968 448 L1004 404 L1040 448 Z" fill="url(#interior)" opacity={0.9} />
      <path d="M1004 404 V448 M986 426 L1022 426" stroke="#e8e2da" strokeWidth={2} />
      <rect x={966} y={450} width={10} height={80} fill="url(#col)" />
      <rect x={1032} y={450} width={10} height={80} fill="url(#col)" />
      <rect x={978} y={456} width={52} height={66} fill="url(#interior)" opacity={0.85} />

      {/* ===== centre block: two storeys of glazing ===== */}
      <rect x={826} y={378} width={140} height={152} fill="url(#render)" />
      <rect x={840} y={388} width={112} height={58} fill="url(#interior)" />
      <rect x={840} y={460} width={112} height={62} fill="url(#interior)" />
      <path d="M868 388 V446 M896 388 V446 M924 388 V446 M840 416 H952 M868 460 V522 M896 460 V522 M924 460 V522" stroke="#e5ddd2" strokeWidth={2.5} />
      <rect x={826} y={446} width={140} height={8} fill="url(#slab)" />
      {/* hip roof */}
      <path d="M814 380 L846 348 L950 348 L980 380 Z" fill="url(#roofW)" />
      <path d="M814 380 L980 380 L980 386 L814 386 Z" fill="#9fb0c4" />
      <path d="M846 348 L950 348" stroke="#ffffff" strokeWidth={3} />

      {/* ===== left: curved two-storey pavilion ===== */}
      <rect x={672} y={388} width={150} height={56} fill="url(#interior)" opacity={0.95} />
      <rect x={672} y={462} width={150} height={60} fill="url(#interior)" />
      <path d="M700 388 V444 M760 388 V444 M700 462 V522 M760 462 V522" stroke="rgba(120,80,40,0.35)" strokeWidth={2} />
      {/* curved slabs (rounded left end reads as the curve) */}
      <rect x={656} y={444} width={176} height={12} rx={6} fill="url(#slab)" />
      <rect x={652} y={372} width={182} height={14} rx={7} fill="url(#slab)" />
      {/* columns */}
      {[664, 728, 792].map((x) => (
        <g key={x}>
          <rect x={x} y={386} width={14} height={58} fill="url(#col)" />
          <rect x={x} y={456} width={14} height={74} fill="url(#col)" />
        </g>
      ))}
      {/* glass balustrade on the upper balcony */}
      <rect x={656} y={418} width={170} height={26} fill="url(#glassRail)" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5} />
      {/* shallow curved roof */}
      <path d="M646 372 Q656 350 700 344 L812 344 L840 372 Z" fill="url(#roofW)" />
      <path d="M700 344 Q735 330 770 344" fill="url(#roofW)" />

      {/* lawn + pool fence */}
      <rect x={640} y={528} width={560} height={8} fill="#2f7d3a" />
      <rect x={640} y={524} width={560} height={14} fill="url(#glassRail)" opacity={0.6} />
      {Array.from({ length: 12 }, (_, k) => (
        <rect key={k} x={650 + k * 47} y={520} width={3} height={18} fill="#cfd8e3" />
      ))}

      {/* pool */}
      <path d="M640 546 L1200 546 L1212 580 L628 580 Z" fill="url(#pool)" />
      <path d="M640 546 L1200 546" stroke="#e9eef4" strokeWidth={5} />
      {[0, 1, 2, 3].map((k) => (
        <path key={k} d={`M${700 + k * 120} ${558 + (k % 2) * 8} q20 -4 40 0 t40 0`} stroke="rgba(255,255,255,0.55)" strokeWidth={2} fill="none" />
      ))}
      <rect x={860} y={552} width={70} height={22} fill="rgba(255,210,140,0.35)" style={{ filter: "blur(3px)" }} />
      </g>
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
