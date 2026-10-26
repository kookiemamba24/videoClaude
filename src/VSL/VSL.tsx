import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig } from "remotion";
import { Captions, Word } from "./Captions";
import { LowerThird } from "./LowerThird";
import { Results } from "./Results";
import captions from "./captions.json";
import { theme } from "./theme";

const words = captions as Word[];

// Length of public/footage/hero-vsl.mp4 (ffprobe: 203.83s at 30fps).
export const VSL_DURATION_FRAMES = 6115;

// Light grade + vignette: a touch more contrast and focus on the speaker so
// the bright room reads as deliberate rather than flat.
const Footage: React.FC = () => (
  <AbsoluteFill>
    <OffthreadVideo
      src={staticFile("footage/hero-vsl.mp4")}
      style={{ filter: "contrast(1.07) saturate(1.06) brightness(0.97)" }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse 75% 85% at 50% 42%, transparent 55%, rgba(8,10,14,0.38) 100%)",
      }}
    />
  </AbsoluteFill>
);

export const VSL: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <Footage />
      <Results words={words} />
      <LowerThird words={words} totalFrames={durationInFrames} />
      <Captions words={words} />
    </AbsoluteFill>
  );
};
