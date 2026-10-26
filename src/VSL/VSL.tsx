import React from "react";
import { AbsoluteFill, CalculateMetadataFunction, useVideoConfig } from "remotion";
import { Captions, Word } from "./Captions";
import { LowerThird } from "./LowerThird";
import { Results } from "./Results";
import captions from "./captions.json";
import { theme } from "./theme";

const words = captions as Word[];

export const calculateVSLMetadata: CalculateMetadataFunction<Record<string, unknown>> = () => {
  const fps = 30;
  const lastMs = words[words.length - 1].endMs + 1500;
  return { fps, durationInFrames: Math.ceil((lastMs / 1000) * fps) };
};

// Stand-in for the talking-head footage until it's recorded; gives the glass
// caption box something to blur.
const FootagePlaceholder: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 40% 55% at 50% 45%, #3a3f47 0%, transparent 70%),
        radial-gradient(ellipse 30% 40% at 18% 30%, #3a4250 0%, transparent 70%),
        radial-gradient(ellipse 25% 35% at 85% 25%, #2f3c4d 0%, transparent 70%),
        linear-gradient(180deg, #23272e, ${theme.bg})`,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        fontFamily: theme.font,
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: "0.3em",
        color: "rgba(255,255,255,0.25)",
        marginBottom: 260,
      }}
    >
      SPEAKER FOOTAGE
    </div>
  </AbsoluteFill>
);

export const VSL: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <FootagePlaceholder />
      <Results words={words} />
      <LowerThird words={words} totalFrames={durationInFrames} />
      <Captions words={words} />
    </AbsoluteFill>
  );
};
