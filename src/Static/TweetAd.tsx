import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { z } from "zod";
import "../Ad/adTheme";

export const tweetAdSchema = z.object({
  jobs: z.string(),
  period: z.string(),
});

const BLUE = "#1d9bf0";
const MUTED = "#71767b";

const Icon: React.FC<{ d: string }> = ({ d }) => (
  <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

// Dark social-post style static ad, 1080x1080.
export const TweetAd: React.FC<z.infer<typeof tweetAdSchema>> = ({ jobs, period }) => (
  <AbsoluteFill style={{ background: "#0b0e13", alignItems: "center", justifyContent: "center", fontFamily: "Inter, 'Noto Color Emoji'" }}>
    <div
      style={{
        width: 980,
        borderRadius: 40,
        background: "#000",
        border: "2px solid #1f2329",
        padding: "56px 60px 40px",
        color: "#e7e9ea",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", right: 56, top: 52, fontSize: 52, fontWeight: 300, lineHeight: 1, color: "#e7e9ea" }}>✕</div>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ width: 132, height: 132, borderRadius: 66, background: "#111", border: "2px solid #2a2f36", overflow: "hidden", flexShrink: 0 }}>
          <Img src={staticFile("brand/av-logo.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 44 }}>
            Alvolution Enterprises
            <svg width={42} height={42} viewBox="0 0 24 24">
              <path
                fill={BLUE}
                d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.35 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"
              />
              <path d="M8 12.3l2.7 2.7 5.3-5.6" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ fontSize: 36, color: MUTED, marginTop: 4 }}>Roofing Growth Partner</div>
        </div>
      </div>

      <div style={{ fontWeight: 800, fontSize: 82, lineHeight: 1.12, letterSpacing: "-0.025em", marginTop: 54 }}>
        We'll get you <span style={{ color: BLUE }}>{jobs} new roofing jobs</span> {period} or we work for free until you hit it.
      </div>
      <div style={{ fontSize: 38, color: "#c4c7ca", marginTop: 36 }}>For roofing businesses doing over $20k/mo.</div>
      <div style={{ fontWeight: 700, fontSize: 56, marginTop: 40 }}>Click below to learn more 👇</div>

      <div style={{ height: 2, background: "#2f3336", margin: "40px 0 30px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
        <Icon d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-4-.9L3 20l1.1-4A8.4 8.4 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z" />
        <Icon d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" />
        <Icon d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
        <Icon d="M12 3v13M7 8l5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
      </div>
    </div>
  </AbsoluteFill>
);
