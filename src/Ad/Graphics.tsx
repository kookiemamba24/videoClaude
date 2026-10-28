import React, { createContext, useContext } from "react";
import { Easing, Img, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, OUT, useProgress } from "../VSL/Glass";
import { accent, adTheme, negA } from "./adTheme";

const W = 1080;
const back = (s = 1.8) => Easing.out(Easing.back(s));

// Over the footage, graphics sit on the chest: the mouth drops as low as
// y≈900, so nothing starts above 1000 and the captions sit below.
const STAGE_TOP = 1000;
const STAGE_SCALE = 0.66;
// Inside a full-screen overlay there's no face to avoid, so go big.
const FULL_TOP = 560;
const FULL_SCALE = 1.12;

const FullContext = createContext(false);

// Full-screen cutaway: hides the footage (the voice carries on) and gives
// the graphic the whole frame.
export const FullOverlay: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: OUT });
  const out = interpolate(frame, [len - 5, len], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 90% 60% at 50% 18%, #0b47c9 0%, #072a7a 38%, #031029 72%, #01040c 100%)",
        opacity: inP * (1 - out),
        scale: String(1.06 - 0.06 * inP),
      }}
    >
      <FullContext.Provider value>{children}</FullContext.Provider>
    </div>
  );
};

// Centred stage for one graphic: pops in, and out before `len`. `top` nudges
// it relative to the default band position.
export const Stage: React.FC<{ len: number; top?: number; width: number; children: React.ReactNode }> = ({
  len,
  top = 600,
  width,
  children,
}) => {
  const frame = useCurrentFrame();
  const full = useContext(FullContext);
  const enter = useProgress(0, 12, back(1.4));
  const exit = interpolate(frame, [len - 8, len], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        left: (W - width) / 2,
        top: full ? FULL_TOP : STAGE_TOP + Math.max(0, top - 600) * 0.15,
        width,
        transformOrigin: "50% 0",
        fontFamily: adTheme.font,
        color: adTheme.text,
        opacity: Math.min(1, enter * 1.4) * (1 - exit),
        scale: String((full ? FULL_SCALE : STAGE_SCALE) * (0.8 + 0.2 * enter) * (1 - 0.1 * exit)),
        filter: `blur(${(1 - Math.min(1, enter)) * 8 + exit * 8}px)`,
      }}
    >
      {children}
    </div>
  );
};

export const Glass: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      borderRadius: 36,
      padding: 40,
      background:
        "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06)), rgba(10,14,22,0.78)",
      border: "1.5px solid rgba(255,255,255,0.2)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 30px 80px rgba(0,0,0,0.5)",
      backdropFilter: "blur(30px) saturate(140%)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Kicker: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = adTheme.accent }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color,
    }}
  >
    <div style={{ width: 10, height: 10, borderRadius: 5, background: color, boxShadow: `0 0 12px ${color}` }} />
    {children}
  </div>
);

const House: React.FC<{ size?: number; color?: string; stroke?: number }> = ({ size = 44, color = "#fff", stroke = 3 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 44 40">
    <path
      d="M4 20 L22 5 L40 20 M9 16 V36 H35 V16"
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Check: React.FC<{ p: number; size?: number; color?: string }> = ({ p, size = 34, color = adTheme.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path
      d="M4 12.5l5 5L20 6.5"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  </svg>
);

// --- Bad ads ---------------------------------------------------------------

// Parody stand-ins until the real "bad ad" screenshots are supplied.
const MockBadAd: React.FC<{ v: number }> = ({ v }) => {
  if (v === 0)
    return (
      <div style={{ width: "100%", height: "100%", background: "#ffe600", padding: 18, fontFamily: "Impact, 'Arial Black', sans-serif", color: "#e00000", position: "relative" }}>
        <div style={{ fontSize: 52, lineHeight: 0.95, textShadow: "3px 3px 0 #000" }}>ROOF REPAIRS!!!</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <House size={120} color="#333" stroke={4} />
        </div>
        <div style={{ position: "absolute", right: -6, top: 150, width: 130, height: 130, borderRadius: 65, background: "#e00000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, rotate: "14deg", border: "4px dashed #fff" }}>CHEAP!</div>
        <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", fontSize: 30, color: "#000" }}>CALL 0400 000 000</div>
      </div>
    );
  if (v === 1)
    return (
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(#1c3fbf, #0b1f73)", padding: 18, fontFamily: "'Times New Roman', serif", color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: "#ffef00" }}>LOWEST QUOTE</div>
        <div style={{ fontSize: 34, marginTop: 4 }}>in town guaranteed!!</div>
        <div style={{ margin: "26px auto", width: 150, height: 110, background: "#9aa3ad", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid #fff" }}>
          <House size={80} color="#fff" />
        </div>
        <div style={{ fontSize: 28, background: "#ff0000", padding: 8 }}>FREE QUOTE*</div>
        <div style={{ fontSize: 16, marginTop: 10, opacity: 0.8 }}>*conditions apply</div>
      </div>
    );
  return (
    <div style={{ width: "100%", height: "100%", background: "#f2f2f2", padding: 18, fontFamily: "'Comic Sans MS', 'Comic Neue', cursive", color: "#222", textAlign: "center" }}>
      <div style={{ fontSize: 38, color: "#008a00" }}>We Do Roofs :)</div>
      <div style={{ margin: "20px auto", height: 150, background: "repeating-linear-gradient(45deg,#bbb 0 14px,#ccc 14px 28px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#666" }}>
        stock_photo_final(2).jpg
      </div>
      <div style={{ fontSize: 30 }}>Gutters • Roofs • Fences • Lawns</div>
      <div style={{ fontSize: 26, marginTop: 12, color: "#c00" }}>10% OFF THIS WEEK ONLY!!</div>
    </div>
  );
};

export type AdImage = { src: string; aspect: number };

// The bad ads burst out of the raised finger and fan out above it.
export const BadAdsFan: React.FC<{ len: number; images?: AdImage[]; anchor: { x: number; y: number } }> = ({
  len,
  images,
  anchor,
}) => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [len - 6, len], [0, 1], clamp);
  const cardW = 230;
  // Fanned just above the fingertip, kept inside the frame and off the face.
  const spots = [
    { dx: -115, dy: -200, rot: -11 },
    { dx: 0, dy: -250, rot: 0 },
    { dx: 110, dy: -200, rot: 11 },
  ];
  return (
    <>
      {spots.map((sp, i) => {
        const p = interpolate(frame, [i * 3, i * 3 + 12], [0, 1], { ...clamp, easing: back(1.7) });
        const bob = Math.sin((frame + i * 11) / 9) * 6;
        const img = images?.[i];
        const h = img ? cardW / img.aspect : 340;
        // Fly from the fingertip to the card's spot.
        const x = anchor.x + sp.dx * p - cardW / 2;
        const y = anchor.y + sp.dy * p - h / 2 + bob;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: cardW,
              height: h,
              borderRadius: 18,
              overflow: "hidden",
              border: "5px solid #fff",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              rotate: `${sp.rot * p + Math.sin((frame + i * 7) / 8) * 1.5}deg`,
              scale: String(Math.max(0.05, p) * (1 - 0.3 * exit)),
              opacity: Math.min(1, p * 2) * (1 - exit),
              zIndex: i === 1 ? 2 : 1,
              background: "#fff",
            }}
          >
            {img ? <Img src={img.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <MockBadAd v={i} />}
          </div>
        );
      })}
    </>
  );
};

// Full-screen cutaway: homeowners (houses) bolting out of the circle.
export const LeadsFleeFull: React.FC<{ len: number; fleeAt: number }> = ({ len, fleeAt }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 6], [0, 1], { ...clamp, easing: OUT });
  const out = interpolate(frame, [len - 5, len], [0, 1], clamp);
  const houses = Array.from({ length: 16 }, (_, i) => {
    const a = random(`fa${i}`) * Math.PI * 2;
    const r = 70 + Math.sqrt(random(`fr${i}`)) * 300;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r, a, lit: random(`fl${i}`) < 0.35 };
  });
  const left = houses.filter((_, i) => frame < fleeAt + i * 1.2).length;
  const cx = 540;
  const cy = 900;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 90% 60% at 50% 18%, #0b47c9 0%, #072a7a 38%, #031029 72%, #01040c 100%)",
        opacity: inP * (1 - out),
        fontFamily: adTheme.font,
        color: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: cx - 420,
          top: cy - 420,
          width: 840,
          height: 840,
          borderRadius: "50%",
          border: `3px dashed ${accent(0.7)}`,
          background: `radial-gradient(circle, ${accent(0.16)}, ${accent(0.05)} 70%)`,
          scale: String(0.9 + 0.1 * inP),
        }}
      />
      {houses.map((h, i) => {
        const t = Math.max(0, frame - fleeAt - i * 1.2);
        const run = t * t * 1.6;
        const jitter = frame < fleeAt ? Math.sin((frame + i * 5) / 2.2) * 2.5 : 0;
        const fleeing = t > 0;
        const col = fleeing ? adTheme.neg : h.lit ? adTheme.accent : "rgba(220,228,240,0.85)";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx + h.x + Math.cos(h.a) * run - 34 + jitter,
              top: cy + h.y + Math.sin(h.a) * run - 56,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              rotate: `${Math.min(35, t * 3) * (h.x > 0 ? 1 : -1)}deg`,
              opacity: interpolate(t, [0, 14], [1, 0], clamp),
              filter: h.lit && !fleeing ? `drop-shadow(0 0 10px ${accent(0.8)})` : undefined,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                border: `3px solid ${col}`,
                color: col,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 24,
                marginBottom: 6,
              }}
            >
              {fleeing ? "!" : "$"}
            </div>
            <House size={68} color={col} stroke={2.6} />
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: cy + 470,
          width: "100%",
          textAlign: "center",
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: "0.14em",
          color: left > 5 ? "#fff" : adTheme.neg,
        }}
      >
        LEADS: {left}
      </div>
    </div>
  );
};

// --- Lookalikes + cheapest sticker ----------------------------------------

export const SameRoofers: React.FC<{ len: number; stickerAt: number }> = ({ len, stickerAt }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [stickerAt, stickerAt + 8], [0, 1], { ...clamp, easing: back(2.4) });
  const labels = ["Roofer", "Roofer", "YOU", "Roofer"];
  return (
    <Stage len={len} width={900} top={600}>
      <Glass style={{ padding: 32, position: "relative" }}>
        <Kicker>What homeowners see</Kicker>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 24 }}>
          {labels.map((l, i) => {
            const p = interpolate(frame, [4 + i * 3, 16 + i * 3], [0, 1], { ...clamp, easing: OUT });
            return (
              <div
                key={i}
                style={{
                  borderRadius: 20,
                  padding: 16,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  opacity: p,
                  scale: String(0.9 + 0.1 * p),
                }}
              >
                <div style={{ height: 110, borderRadius: 12, background: "linear-gradient(135deg,#555b63,#3a3e44)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <House size={56} color="rgba(255,255,255,0.55)" />
                </div>
                <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.25)", marginTop: 12, width: "80%" }} />
                <div style={{ fontWeight: 800, fontSize: 28, marginTop: 10, color: l === "YOU" ? "#fff" : "rgba(255,255,255,0.6)" }}>{l}</div>
              </div>
            );
          })}
        </div>
        {/* The tacky sticker slapped on top */}
        <div
          style={{
            position: "absolute",
            left: 240,
            top: 250,
            width: 420,
            height: 420,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: String(s),
            rotate: `${-12 + (1 - s) * 40}deg`,
            opacity: s > 0 ? 1 : 0,
          }}
        >
          <svg width={420} height={420} viewBox="0 0 100 100" style={{ position: "absolute", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))" }}>
            <polygon
              points={Array.from({ length: 32 }, (_, k) => {
                const r = k % 2 ? 40 : 50;
                const a = (k / 32) * Math.PI * 2;
                return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
              }).join(" ")}
              fill="#ffe600"
              stroke="#e00000"
              strokeWidth={2}
            />
          </svg>
          <div style={{ position: "relative", textAlign: "center", fontFamily: adTheme.font, fontWeight: 900, letterSpacing: "-0.03em", color: "#e00000", fontSize: 54, lineHeight: 0.95 }}>
            CHEAPEST
            <br />
            QUOTE IN
            <br />
            TOWN!!!
          </div>
        </div>
      </Glass>
    </Stage>
  );
};

// --- Phone: scroll past, then haggle --------------------------------------

export const Phone: React.FC<{ children: React.ReactNode; width?: number; height?: number }> = ({
  children,
  width = 420,
  height = 820,
}) => (
  <div
    style={{
      width,
      height,
      margin: "0 auto",
      borderRadius: 64,
      padding: 12,
      background: "linear-gradient(145deg, #9aa1ab, #3d434b)",
      boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
    }}
  >
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 54, overflow: "hidden", background: "#05070b" }}>
      {children}
      <div style={{ position: "absolute", top: 14, left: "50%", translate: "-50% 0", width: 120, height: 34, borderRadius: 17, background: "#000" }} />
    </div>
  </div>
);

export const ScrollThenHaggle: React.FC<{ len: number; scrollAt: number; callAt: number; beatAt: number }> = ({
  len,
  scrollAt,
  callAt,
  beatAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scroll = interpolate(frame, [scrollAt, scrollAt + 0.8 * fps], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const call = useProgress(callAt, 10);
  const prices = [14500, 11000, 8900];
  const step = Math.min(2, Math.max(0, Math.floor((frame - beatAt) / 9)));
  const haggle = frame >= beatAt;
  const bubble = useProgress(beatAt - 6, 10, back(2));
  return (
    <Stage len={len} width={760} top={500}>
      <Phone>
        {/* Feed flicking past your ad */}
        <div style={{ position: "absolute", inset: 0, translate: `0 ${-scroll * 1500}px`, filter: `blur(${Math.sin(scroll * Math.PI) * 6}px)`, opacity: 1 - call }}>
          {Array.from({ length: 9 }).map((_, i) =>
            i === 0 ? (
              <div key={i} style={{ margin: "66px 0 0", background: "#0d1117" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: "#555" }} />
                  <div style={{ fontSize: 20, fontWeight: 700 }}>
                    Local Roofer
                    <div style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.55)" }}>Sponsored</div>
                  </div>
                </div>
                <OffthreadVideo src={staticFile("ads/cheap-ad.mp4")} muted style={{ width: "100%", display: "block" }} />
              </div>
            ) : (
              <div key={i} style={{ margin: "70px 22px 0", borderRadius: 18, background: "#1a1f27", height: 300, padding: 16, color: "#888", fontFamily: adTheme.font, fontSize: 22 }}>
                Post
              </div>
            ),
          )}
        </div>
        {/* Incoming call */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#1b2433, #0a0d13)", opacity: call, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 110 }}>
          <div style={{ width: 120, height: 120, borderRadius: 60, background: "#3a4250", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <House size={60} color="#cfd6df" />
          </div>
          <div style={{ fontWeight: 700, fontSize: 40, marginTop: 20 }}>Homeowner</div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>calling about your quote…</div>
          <div style={{ marginTop: 60, textAlign: "center", opacity: haggle ? 1 : 0 }}>
            <div style={{ fontSize: 22, letterSpacing: "0.16em", color: "rgba(255,255,255,0.6)" }}>YOUR QUOTE</div>
            <div style={{ fontWeight: 800, fontSize: 84, color: step === 0 ? "#fff" : adTheme.neg, fontVariantNumeric: "tabular-nums" }}>
              ${prices[step].toLocaleString("en-US")}
            </div>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", fontSize: 26, color: "rgba(255,255,255,0.45)", textDecoration: "line-through" }}>
              {prices.slice(0, step).map((p) => (
                <span key={p}>${p.toLocaleString("en-US")}</span>
              ))}
            </div>
          </div>
        </div>
      </Phone>
      <div
        style={{
          position: "absolute",
          right: -10,
          top: 300,
          padding: "18px 26px",
          borderRadius: "28px 28px 6px 28px",
          background: "#fff",
          color: "#111",
          fontWeight: 800,
          fontSize: 34,
          boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
          scale: String(bubble),
          rotate: "4deg",
        }}
      >
        Can you do it
        <br />
        cheaper? 🙂
      </div>
    </Stage>
  );
};

// --- Offer -----------------------------------------------------------------

export const Offer: React.FC<{ len: number; freeAt: number }> = ({ len, freeAt }) => {
  const { fps } = useVideoConfig();
  const c = useProgress(8, fps);
  const f = useProgress(freeAt, 12, back(1.6));
  return (
    <Stage len={len} width={880} top={600}>
      <Glass>
        <Kicker>Our promise to you</Kicker>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginTop: 26 }}>
          <div style={{ fontWeight: 800, fontSize: 170, lineHeight: 0.85, color: adTheme.accent, letterSpacing: "-0.04em", textShadow: `0 0 50px ${accent(0.45)}`, whiteSpace: "nowrap" }}>
            {Math.round(6 * c)}–{Math.round(12 * c)}
          </div>
          <div style={{ fontWeight: 800, fontSize: 46, lineHeight: 1.05, paddingBottom: 12 }}>
            booked
            <br />
            jobs
          </div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 40, marginTop: 20 }}>in 90 days</div>
        <div
          style={{
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "22px 26px",
            borderRadius: 22,
            background: accent(0.16),
            border: `2px solid ${accent(0.6)}`,
            fontWeight: 800,
            fontSize: 38,
            opacity: f,
            scale: String(0.9 + 0.1 * f),
          }}
        >
          <Check p={f} size={44} />
          Or we work for free
        </div>
      </Glass>
    </Stage>
  );
};

// --- Results ---------------------------------------------------------------

export const ResultCard: React.FC<{
  len: number;
  logo: string;
  logoBg: string;
  name: string;
  value: number;
  format: (n: number) => string;
  caption: string;
  bars?: { label: string; value: string; w: number; strong?: boolean }[];
  days?: number;
}> = ({ len, logo, logoBg, name, value, format, caption, bars, days }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = useProgress(10, 1.1 * fps);
  const glow = interpolate(frame, [10 + 1.1 * fps, 16 + 1.1 * fps, 40 + 1.1 * fps], [0, 1, 0.5], clamp);
  return (
    <Stage len={len} width={900} top={560}>
      <Glass>
        <Kicker>Client result</Kicker>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 22 }}>
          <div style={{ width: 210, height: 110, borderRadius: 20, background: logoBg, padding: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
            <Img src={logo} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 46, lineHeight: 1.05 }}>{name}</div>
        </div>
        <div style={{ fontWeight: 800, fontSize: 150, lineHeight: 1, marginTop: 26, color: adTheme.accent, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", textShadow: `0 0 ${50 * glow}px ${accent(0.55 * glow)}` }}>
          {format(value * c)}
        </div>
        <div style={{ fontWeight: 700, fontSize: 38, marginTop: 6, color: "rgba(246,244,239,0.85)" }}>{caption}</div>
        {bars ? (
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 20 }}>
            {bars.map((b, i) => {
              const p = interpolate(frame, [22 + i * 8, 22 + i * 8 + fps], [0, 1], { ...clamp, easing: OUT });
              return (
                <div key={b.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 30, marginBottom: 10 }}>
                    <span style={{ color: "rgba(246,244,239,0.7)" }}>{b.label}</span>
                    <span style={{ color: b.strong ? adTheme.accent : "#fff" }}>{b.value}</span>
                  </div>
                  <div style={{ height: 18, borderRadius: 9, background: "rgba(255,255,255,0.1)" }}>
                    <div style={{ height: "100%", width: `${Math.max(b.w, 0.02) * p * 100}%`, borderRadius: 9, background: b.strong ? `linear-gradient(90deg, ${adTheme.accentDeep}, ${adTheme.accent})` : "rgba(255,255,255,0.55)", boxShadow: b.strong ? `0 0 20px ${accent(0.6)}` : undefined }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
        {days ? <DaysBar days={days} /> : null}
      </Glass>
    </Stage>
  );
};

const DaysBar: React.FC<{ days: number }> = ({ days }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [22, 22 + 1.2 * fps], [0, 1], { ...clamp, easing: OUT });
  const cells = 8;
  return (
    <div style={{ marginTop: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 30, marginBottom: 12 }}>
        <span style={{ color: "rgba(246,244,239,0.7)" }}>Calendar</span>
        <span style={{ color: adTheme.accent }}>Under {days} days</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cells}, 1fr)`, gap: 10 }}>
        {Array.from({ length: cells * 2 }).map((_, i) => {
          const on = p * cells * 2 > i;
          return <div key={i} style={{ height: 34, borderRadius: 8, background: on ? accent(0.85) : "rgba(255,255,255,0.08)", boxShadow: on ? `0 0 12px ${accent(0.4)}` : undefined }} />;
        })}
      </div>
    </div>
  );
};

export const LogoRow: React.FC<{ len: number; logos: { src: string; bg: string }[] }> = ({ len, logos }) => {
  const frame = useCurrentFrame();
  return (
    <Stage len={len} width={980} top={640}>
      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        {logos.map((l, i) => {
          const p = interpolate(frame, [i * 4, i * 4 + 12], [0, 1], { ...clamp, easing: back(1.8) });
          return (
            <div key={l.src} style={{ width: 300, height: 170, borderRadius: 26, background: l.bg, padding: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.45)", opacity: p, scale: String(p), border: "3px solid rgba(255,255,255,0.7)" }}>
              <Img src={l.src} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

export const Unpredictable: React.FC<{ len: number; secondAt: number }> = ({ len, secondAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pts = [0.5, 0.15, 0.6, 0.25, 0.7, 0.1, 0.55, 0.2];
  const w = 760;
  const h = 220;
  const d = pts.map((v, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * w} ${h - v * h}`).join(" ");
  const draw = interpolate(frame, [6, 6 + 1.2 * fps], [0, 1], clamp);
  const s2 = useProgress(secondAt, 12, back(1.6));
  return (
    <Stage len={len} width={880} top={600}>
      <Glass>
        <Kicker color={adTheme.neg}>Where they were</Kicker>
        <svg width={w} height={h + 10} style={{ marginTop: 26, overflow: "visible" }}>
          <path d={d} fill="none" stroke={adTheme.neg} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{ filter: `drop-shadow(0 0 8px ${negA(0.6)})` }} />
        </svg>
        <div style={{ display: "flex", gap: 16, marginTop: 26, flexWrap: "wrap" }}>
          <Chip text="Not enough leads" p={useProgress(4, 12, back(1.6))} />
          <Chip text="No predictable income" p={s2} />
        </div>
      </Glass>
    </Stage>
  );
};

const Chip: React.FC<{ text: string; p: number }> = ({ text, p }) => (
  <div style={{ padding: "14px 22px", borderRadius: 999, background: negA(0.15), border: `2px solid ${negA(0.6)}`, color: "#fff", fontWeight: 800, fontSize: 32, opacity: p, scale: String(0.8 + 0.2 * p) }}>
    ✕&nbsp; {text}
  </div>
);

// --- Premium ad, cheapest vs best -----------------------------------------

const PremiumPost: React.FC<{ image: string }> = ({ image }) => (
  <div style={{ position: "absolute", inset: 0, background: "#000", paddingTop: 66 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px" }}>
      <div style={{ width: 44, height: 44, borderRadius: 22, background: `linear-gradient(135deg, ${adTheme.accent}, #9be7b0)` }} />
      <div style={{ fontSize: 20, fontWeight: 700 }}>
        Your Roofing Co.
        <div style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.55)" }}>Sponsored</div>
      </div>
    </div>
    <Img src={image} style={{ width: "100%", display: "block" }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: adTheme.accentDeep, fontWeight: 800, fontSize: 22 }}>
      Book a free inspection <span>›</span>
    </div>
    <div style={{ padding: "12px 16px", fontSize: 20, fontWeight: 700 }}>
      ♥ 1,284 &nbsp; 💬 96
      <div style={{ fontWeight: 500, fontSize: 18, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>“Best roofers we've ever used.”</div>
    </div>
  </div>
);

export const PremiumAd: React.FC<{ len: number; trustAt: number; image: string }> = ({ len, trustAt, image }) => {
  const t = useProgress(trustAt, 12, back(2));
  return (
    <Stage len={len} width={760} top={480}>
      <Phone>
        <PremiumPost image={image} />
      </Phone>
      <div style={{ position: "absolute", left: -40, top: 330, padding: "18px 26px", borderRadius: "28px 28px 28px 6px", background: "#fff", color: "#111", fontWeight: 800, fontSize: 34, boxShadow: "0 16px 40px rgba(0,0,0,0.45)", scale: String(t), rotate: "-4deg", display: "flex", alignItems: "center", gap: 10 }}>
        <Check p={t} size={36} color={adTheme.accentDeep} />
        That's the roofer
        <br />I trust
      </div>
    </Stage>
  );
};

export const CheapVsBest: React.FC<{ len: number; bestAt: number }> = ({ len, bestAt }) => {
  const frame = useCurrentFrame();
  const cross = interpolate(frame, [8, 18], [0, 1], { ...clamp, easing: OUT });
  const drop = interpolate(frame, [bestAt - 4, bestAt + 12], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const best = useProgress(bestAt, 12, back(2.2));
  return (
    <Stage len={len} width={900} top={640}>
      <div style={{ position: "relative", height: 460 }}>
        <div style={{ position: "absolute", left: 120, top: 40 + drop * 700, rotate: `${-8 + drop * 40}deg`, padding: "26px 36px", background: "#ffe600", border: "6px solid #e00000", fontFamily: adTheme.font, fontWeight: 900, letterSpacing: "-0.03em", fontSize: 72, color: "#e00000", boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}>
          THE CHEAPEST
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
            <path d="M5 5 L95 35 M95 5 L5 35" stroke="#111" strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cross} fill="none" />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 90, right: 90, top: 120, padding: "34px", borderRadius: 30, background: `linear-gradient(135deg, ${adTheme.accentDeep}, ${adTheme.accent})`, border: "3px solid rgba(255,255,255,0.8)", boxShadow: `0 0 60px ${accent(0.6)}, 0 20px 50px rgba(0,0,0,0.45)`, textAlign: "center", fontWeight: 900, fontSize: 84, letterSpacing: "-0.02em", color: "#fff", scale: String(best), rotate: `${(1 - best) * 10}deg` }}>
          THE BEST ONE
        </div>
      </div>
    </Stage>
  );
};

// --- Website + follow-up ---------------------------------------------------

export const WebsiteForm: React.FC<{ len: number; sellAt: number }> = ({ len, sellAt }) => {
  const frame = useCurrentFrame();
  const fields = [
    { icon: "user", text: "Sarah Mitchell" },
    { icon: "pin", text: "14 Oak St, Riverside" },
    { icon: "$", text: "Full roof replacement" },
  ];
  const toast = useProgress(sellAt, 12, back(1.8));
  const press = interpolate(frame, [sellAt - 8, sellAt - 3, sellAt + 2], [1, 0.94, 1], clamp);
  return (
    <Stage len={len} width={760} top={560}>
      <div style={{ borderRadius: 30, overflow: "hidden", background: "linear-gradient(170deg, #121b2c, #070a10)", border: "2px solid rgba(255,255,255,0.18)", boxShadow: "0 40px 90px rgba(0,0,0,0.55)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.3)" }} />
          ))}
          <div style={{ flex: 1, height: 22, borderRadius: 11, background: "rgba(255,255,255,0.08)", marginLeft: 12 }} />
        </div>
        <div style={{ padding: "34px 40px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <House size={70} color={adTheme.accent} />
          <div style={{ fontWeight: 800, fontSize: 40, marginTop: 14 }}>Your trusted local roofer</div>
          <div style={{ color: "#ffd84d", fontSize: 26, marginTop: 6, letterSpacing: 3 }}>★★★★★ 200+ reviews</div>
          <div style={{ width: "100%", marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
            {fields.map((f, i) => {
              const st = 10 + i * 14;
              const n = Math.floor(interpolate(frame, [st, st + 12], [0, f.text.length], clamp));
              return (
                <div key={f.text} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", borderRadius: 16, border: `2px solid ${frame >= st && frame < st + 14 ? adTheme.accent : "rgba(255,255,255,0.15)"}`, background: "rgba(255,255,255,0.04)", fontSize: 30, fontWeight: 600 }}>
                  <span style={{ width: 30, textAlign: "center", color: adTheme.accent, fontWeight: 800 }}>{f.icon === "user" ? "●" : f.icon === "pin" ? "◆" : "$"}</span>
                  {f.text.slice(0, n)}
                  <span style={{ opacity: frame >= st && frame < st + 14 && frame % 10 < 5 ? 1 : 0 }}>|</span>
                </div>
              );
            })}
          </div>
          <div style={{ width: "100%", marginTop: 22, padding: "22px", borderRadius: 18, background: `linear-gradient(135deg, ${adTheme.accentDeep}, ${adTheme.accent})`, textAlign: "center", fontWeight: 800, fontSize: 34, scale: String(press) }}>
            Get my free quote
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: -50, translate: "-50% 0", display: "flex", alignItems: "center", gap: 14, padding: "18px 28px", borderRadius: 999, background: "#fff", color: "#111", fontWeight: 800, fontSize: 32, boxShadow: "0 16px 40px rgba(0,0,0,0.45)", scale: String(toast), whiteSpace: "nowrap" }}>
        <Check p={toast} size={36} color={adTheme.accentDeep} />
        Sold before the call
      </div>
    </Stage>
  );
};

export const FollowUpPhone: React.FC<{ len: number; contactAt: number; qualifyAt: number; bookedAt: number }> = ({
  len,
  contactAt,
  qualifyAt,
  bookedAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n1 = useProgress(contactAt, 12, back(1.4));
  const q = ["Budget", "Timeline", "Ready to buy"];
  const n3 = useProgress(bookedAt, 12, back(1.4));
  const secs = Math.min(30, Math.max(0, Math.floor(((frame - contactAt) / fps) * 22)));
  return (
    <Stage len={len} width={760} top={470}>
      <Phone height={860}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, #1f4fa8, #071023 75%)" }} />
        <div style={{ position: "absolute", top: 100, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>Tuesday 14 May</div>
          <div style={{ fontSize: 120, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.03em" }}>9:41</div>
        </div>
        <Notif top={320} p={n1} title="New lead contacted" body={`Called back in 0:${String(secs).padStart(2, "0")} ✓`} />
        <div style={{ position: "absolute", top: 470, left: 22, right: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {q.map((x, i) => {
            const p = interpolate(frame, [qualifyAt + i * 6, qualifyAt + i * 6 + 10], [0, 1], { ...clamp, easing: back(2) });
            return (
              <div key={x} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 999, background: "rgba(255,255,255,0.16)", border: `1.5px solid ${accent(0.7)}`, fontWeight: 700, fontSize: 26, scale: String(p), opacity: p }}>
                <Check p={p} size={26} />
                {x}
              </div>
            );
          })}
        </div>
        <Notif top={610} p={n3} title="Job booked" body="Roof replacement · Thu 9:00 AM" calendar />
      </Phone>
    </Stage>
  );
};

const Notif: React.FC<{ top: number; p: number; title: string; body: string; calendar?: boolean }> = ({ top, p, title, body, calendar }) => (
  <div style={{ position: "absolute", top, left: 18, right: 18, padding: "18px 20px", borderRadius: 26, background: "rgba(255,255,255,0.22)", backdropFilter: "blur(20px)", display: "flex", gap: 16, alignItems: "center", opacity: p, translate: `0 ${(1 - p) * -40}px`, scale: String(0.9 + 0.1 * p) }}>
    <div style={{ width: 58, height: 58, borderRadius: 14, background: calendar ? "#fff" : adTheme.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: calendar ? "#e33" : "#fff", fontWeight: 800, fontSize: calendar ? 26 : 30 }}>
      {calendar ? "14" : "✆"}
    </div>
    <div>
      <div style={{ fontWeight: 800, fontSize: 26 }}>{title}</div>
      <div style={{ fontWeight: 600, fontSize: 23, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{body}</div>
    </div>
  </div>
);

// --- Rejections + CTA -------------------------------------------------------

const Stamp: React.FC<{ text: string; at: number; tilt: number }> = ({ text, at, tilt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const shake = frame >= at && frame < at + 6 ? Math.sin(frame * 3) * 6 : 0;
  return (
    <div style={{ position: "relative", padding: "26px 36px", borderRadius: 24, background: "rgba(10,14,22,0.78)", border: "2px solid rgba(255,255,255,0.18)", fontWeight: 900, fontSize: 64, letterSpacing: "-0.01em", opacity: Math.min(1, p * 2), translate: `${shake}px 0` }}>
      {text}
      <div style={{ position: "absolute", right: -30, top: -26, padding: "8px 20px", border: `6px solid ${adTheme.neg}`, borderRadius: 12, color: adTheme.neg, fontSize: 40, fontWeight: 900, letterSpacing: "0.08em", rotate: `${tilt}deg`, scale: String(2.2 - 1.2 * p), opacity: p, background: "rgba(10,14,22,0.6)" }}>
        REJECTED
      </div>
    </div>
  );
};

export const NoTyreKickers: React.FC<{ len: number; secondAt: number; bookedAt: number }> = ({ len, secondAt, bookedAt }) => {
  const b = useProgress(bookedAt, 12, back(2));
  return (
    <Stage len={len} width={880} top={600}>
      <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
        <Stamp text="Tyre kickers" at={4} tilt={-10} />
        <Stamp text="Time wasters" at={secondAt} tilt={8} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "24px 40px", borderRadius: 999, background: `linear-gradient(135deg, ${adTheme.accentDeep}, ${adTheme.accent})`, boxShadow: `0 0 50px ${accent(0.6)}`, fontWeight: 900, fontSize: 52, scale: String(b), opacity: b }}>
          <Check p={b} size={52} color="#fff" />
          Just booked jobs
        </div>
      </div>
    </Stage>
  );
};

export const CTA: React.FC<{ len: number; badge: string }> = ({ len, badge }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bob = Math.sin((frame / fps) * Math.PI * 2) * 12;
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 2) * 0.025;
  return (
    <Stage len={len + 30} width={860} top={620}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 26px 14px 14px", borderRadius: 999, background: "rgba(10,14,22,0.78)", border: "1.5px solid rgba(255,255,255,0.2)" }}>
          <Img src={badge} style={{ width: 70, height: 70 }} />
          <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: "0.08em" }}>ALVOLUTION ENTERPRISES</div>
        </div>
        <div style={{ width: "100%", padding: "34px", borderRadius: 30, background: `linear-gradient(135deg, ${adTheme.accentDeep}, ${adTheme.accent})`, boxShadow: `0 0 70px ${accent(0.6)}, 0 20px 50px rgba(0,0,0,0.45)`, textAlign: "center", fontWeight: 900, fontSize: 64, scale: String(pulse), border: "3px solid rgba(255,255,255,0.7)" }}>
          Book your free call
        </div>
        <svg width={90} height={100} viewBox="0 0 24 26" style={{ translate: `0 ${bob}px`, filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.5))" }}>
          <path d="M12 2 V22 M5 15 L12 22 L19 15" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Stage>
  );
};
