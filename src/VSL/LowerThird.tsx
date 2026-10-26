import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useVideoConfig } from "remotion";
import type { Word } from "./Captions";
import { GlassPanel, useProgress } from "./Glass";
import { theme } from "./theme";

const NameTag: React.FC<{ exitAt: number }> = ({ exitAt }) => {
  const badge = useProgress(4, 22);
  const text = useProgress(10, 18);
  return (
    <GlassPanel
      from="left"
      exitAt={exitAt}
      style={{ left: 60, bottom: 210, padding: "18px 30px 18px 18px", borderRadius: 999 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Img
          src={staticFile("brand/av-logo.png")}
          style={{
            width: 76,
            height: 76,
            rotate: `${(1 - badge) * -90}deg`,
            scale: String(0.7 + 0.3 * badge),
            opacity: badge,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
          }}
        />
        <div style={{ opacity: text, translate: `${(1 - text) * -14}px 0` }}>
          <div style={{ fontWeight: 700, fontSize: 38, lineHeight: 1.05 }}>Alan Vo</div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: "0.16em",
              color: "rgba(246,244,239,0.7)",
              marginTop: 4,
            }}
          >
            ALVOLUTION ENTERPRISES
          </div>
        </div>
      </div>
    </GlassPanel>
  );
};

// Name tag on the opening hook and again on the closing call to action.
export const LowerThird: React.FC<{ words: Word[]; totalFrames: number }> = ({ words, totalFrames }) => {
  const { fps } = useVideoConfig();
  const introFrom = Math.round(0.6 * fps);
  const introLen = Math.round(7 * fps);
  const book = words.findIndex((w) => w.text.trim() === "Book");
  const ctaFrom = book === -1 ? totalFrames : Math.round((words[book].startMs / 1000) * fps) - 10;
  return (
    <AbsoluteFill style={{ fontFamily: theme.font, color: theme.text }}>
      <Sequence from={introFrom} durationInFrames={introLen} layout="none">
        <NameTag exitAt={introLen} />
      </Sequence>
      <Sequence from={ctaFrom} durationInFrames={totalFrames - ctaFrom} layout="none">
        <NameTag exitAt={totalFrames - ctaFrom + fps} />
      </Sequence>
    </AbsoluteFill>
  );
};
