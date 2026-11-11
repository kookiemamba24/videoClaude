import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BookedCalendarIcon } from "../AdChristmas/AdChristmas";
import { T } from "../TradieStyle/kit";

// 4:5 static ad. Photo sits low so the hero title has sky above the head;
// offer on the right beside the vest, perks bottom-left on dark glass.
const PHOTO_TOP = -190;

const Perk: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, fontWeight: 800, fontSize: 31, lineHeight: 1.15, whiteSpace: "nowrap" }}>
    <svg width={40} height={40} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <circle cx={12} cy={12} r={11} fill={T.accent} />
      <path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {text}
  </div>
);

export const XmasStatic: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a1730", fontFamily: T.sans, color: "#fff", overflow: "hidden" }}>
    <Img src={staticFile("static/xmas-gutter.jpg")} style={{ position: "absolute", left: 0, top: PHOTO_TOP, width: 1080 }} />
    {/* Navy fade from the top so the title reads over sky, and a soft fade at the bottom for the perks */}
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #0a1730 0%, #0a1730 16%, rgba(10,23,48,0.7) 28%, rgba(10,23,48,0) 38%), linear-gradient(0deg, rgba(5,12,26,0.85) 0%, rgba(5,12,26,0) 34%)",
      }}
    />

    {/* Hero title above the head */}
    <div style={{ position: "absolute", left: 50, right: 50, top: 46, textAlign: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 62, letterSpacing: "0.04em", color: T.accent, textShadow: "0 4px 20px rgba(0,0,0,0.45)" }}>ROOFERS:</div>
      <div style={{ fontWeight: 900, fontSize: 86, lineHeight: 0.98, letterSpacing: "-0.02em", textShadow: "0 6px 24px rgba(0,0,0,0.5)", marginTop: 6 }}>
        WORRIED ABOUT NO WORK AFTER <span style={{ color: T.accent }}>CHRISTMAS?</span>
      </div>
    </div>

    {/* Offer, right of the vest */}
    <div
      style={{
        position: "absolute",
        right: 36,
        top: 655,
        width: 540,
        padding: "34px 34px 38px",
        borderRadius: 28,
        background: "rgba(8,16,32,0.82)",
        border: `2px solid ${T.accent}`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        <div style={{ flex: 1, fontWeight: 900, fontSize: 48, lineHeight: 1.06, letterSpacing: "-0.01em" }}>
          Get <span style={{ color: T.accent }}>booked out</span> in jobs before Christmas
        </div>
        {/* Christmas tree with presents in the spare corner */}
        <div style={{ position: "relative", width: 140, height: 190, flexShrink: 0, fontFamily: "'Noto Color Emoji'" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center", fontSize: 128, lineHeight: 1 }}>🎄</div>
          <div style={{ position: "absolute", left: -6, bottom: 0, fontSize: 48, lineHeight: 1, rotate: "-8deg" }}>🎁</div>
          <div style={{ position: "absolute", right: -4, bottom: 2, fontSize: 42, lineHeight: 1, rotate: "10deg" }}>🎁</div>
          <div style={{ position: "absolute", left: 46, bottom: -4, fontSize: 38, lineHeight: 1 }}>🎁</div>
        </div>
      </div>
      <div
        style={{
          marginTop: 22,
          padding: "12px 18px",
          textAlign: "center",
          borderRadius: 14,
          background: T.accent,
          fontWeight: 900,
          fontSize: 27,
          lineHeight: 1.15,
        }}
      >
        or your money back, guaranteed
      </div>
    </div>

    {/* Booked-out calendar sitting on top of the offer */}
    <div style={{ position: "absolute", inset: 0, scale: "0.8", transformOrigin: "774px 640px" }}>
      <BookedCalendarIcon x={774} y={515} at={-30} />
    </div>

    {/* Perks, lower left */}
    <div
      style={{
        position: "absolute",
        left: 40,
        bottom: 36,
        padding: "28px 34px",
        borderRadius: 26,
        background: "rgba(8,16,32,0.82)",
        border: "1.5px solid rgba(255,255,255,0.18)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
        backdropFilter: "blur(10px)",
      }}
    >
      <Perk text="No ad spend — we cover it" />
      <Perk text="No lock-in contract" />
      <Perk text="Live and running in under 7 days" />
    </div>

    {/* Brand mark, bottom right */}
    <div style={{ position: "absolute", right: 44, bottom: 60, display: "flex", alignItems: "center", gap: 14 }}>
      <Img src={staticFile("brand/av-logo-dark.png")} style={{ width: 70, height: 70, mixBlendMode: "screen" }} />
      <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", lineHeight: 1.2 }}>
        ALVOLUTION
        <br />
        ENTERPRISES
      </div>
    </div>
  </AbsoluteFill>
);
