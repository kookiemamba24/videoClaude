import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

loadFont({ family: "Cormorant", url: staticFile("fonts/Cormorant-600.woff2"), weight: "600" });
loadFont({ family: "Cormorant", url: staticFile("fonts/Cormorant-700.woff2"), weight: "700" });
loadFont({ family: "Barlow", url: staticFile("fonts/Barlow-600.woff2"), weight: "600" });
loadFont({ family: "Barlow", url: staticFile("fonts/Barlow-700.woff2"), weight: "700" });

const INK = "#1b2838";
const SOFT = "#3d4b5c";

const Icon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={64} height={64} viewBox="0 0 48 48" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
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
    line: "6–12 more booked jobs in 90 days.",
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
    line: "Every lead contacted and qualified, fast.",
  },
];

// Facebook cover, 1640x624. Light brushed-steel look with the chrome AV
// badge as the centrepiece and a glass roofline behind it.
export const FbBanner: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "repeating-linear-gradient(92deg, rgba(255,255,255,0.05) 0 2px, rgba(0,0,0,0.012) 2px 4px), radial-gradient(ellipse 60% 90% at 52% 45%, #f7f9fc 0%, #e3eaf2 45%, #c9d5e1 100%)",
      overflow: "hidden",
    }}
  >
    {/* Soft sweeping light arcs */}
    <div style={{ position: "absolute", left: 560, top: -520, width: 900, height: 900, borderRadius: "50%", border: "60px solid rgba(255,255,255,0.45)", filter: "blur(2px)" }} />
    <div style={{ position: "absolute", left: -260, bottom: -380, width: 760, height: 520, rotate: "-18deg", background: "linear-gradient(100deg, rgba(255,255,255,0.0), rgba(255,255,255,0.55) 50%, rgba(255,255,255,0))" }} />

    {/* Glass roofline behind the badge */}
    <svg width={1640} height={624} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#dbe6f1" stopOpacity="0.35" />
          <stop offset="1" stopColor="#a9bccf" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="glass2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#9fb3c8" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* left and right roof slabs, with thickness */}
      <path d="M640 470 L930 150 L960 178 L688 480 Z" fill="url(#glass)" stroke="rgba(255,255,255,0.9)" strokeWidth={2} />
      <path d="M640 470 L688 480 L688 500 L640 490 Z" fill="#b8c7d6" opacity={0.8} />
      <path d="M930 150 L1220 470 L1172 480 L900 178 Z" fill="url(#glass2)" stroke="rgba(255,255,255,0.9)" strokeWidth={2} />
      <path d="M1220 470 L1172 480 L1172 500 L1220 490 Z" fill="#a9bacb" opacity={0.8} />
      {/* contact shadow */}
      <ellipse cx={930} cy={548} rx={260} ry={22} fill="rgba(40,60,85,0.22)" style={{ filter: "blur(10px)" }} />
    </svg>

    {/* Chrome AV badge; multiply drops its white field into the background */}
    <Img
      src={staticFile("brand/av-logo.png")}
      style={{ position: "absolute", left: 930 - 165, top: 205, width: 330, height: 333, mixBlendMode: "multiply" }}
    />

    {/* Left: wordmark + headline */}
    <div style={{ position: "absolute", left: 110, top: 86, width: 660 }}>
      <div style={{ fontFamily: "Barlow", fontWeight: 700, fontSize: 22, letterSpacing: "0.32em", color: SOFT }}>ALVOLUTION ENTERPRISES</div>
      <div style={{ width: 70, height: 2, background: SOFT, margin: "16px 0 18px", opacity: 0.6 }} />
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
    <div style={{ position: "absolute", left: 1205, top: 74, width: 400, display: "flex", flexDirection: "column", gap: 24 }}>
      {SERVICES.map((s) => (
        <div key={s.title} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
          <Icon>{s.icon}</Icon>
          <div>
            <div style={{ fontFamily: "Barlow", fontWeight: 700, fontSize: 22, letterSpacing: "0.04em", color: INK }}>{s.title}</div>
            <div style={{ fontFamily: "Barlow", fontWeight: 600, fontSize: 20, color: SOFT, marginTop: 3, lineHeight: 1.25 }}>{s.line}</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{ position: "absolute", left: 110, bottom: 52, fontFamily: "Barlow", fontWeight: 700, fontSize: 19, letterSpacing: "0.2em", color: SOFT }}>
      WWW.ALVOLUTION.COM &nbsp;·&nbsp; +61 450 148 664
    </div>
  </AbsoluteFill>
);
