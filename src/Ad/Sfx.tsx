import { Audio } from "@remotion/media";
import React from "react";
import { Sequence, staticFile } from "remotion";

// Kenney CC0 sounds + generated whooshes in public/sfx (see README there).
export type SfxName =
  | "whoosh"
  | "whoosh-big"
  | "pop"
  | "drop"
  | "card-fan"
  | "card"
  | "slap"
  | "stamp"
  | "coins"
  | "coins-stack"
  | "confirm"
  | "success"
  | "error"
  | "fall"
  | "zap"
  | "tick"
  | "click"
  | "scroll"
  | "notify";

export type SfxEvent = { at: number; name: SfxName; volume?: number };

// Kept well under the voice so the effects punctuate rather than compete.
const BASE = 0.45;

export const Sfx: React.FC<{ events: SfxEvent[] }> = ({ events }) => (
  <>
    {events.map((e, i) => (
      <Sequence key={i} from={Math.max(0, Math.round(e.at))} durationInFrames={45} layout="none">
        <Audio src={staticFile(`sfx/${e.name}.wav`)} volume={BASE * (e.volume ?? 1)} />
      </Sequence>
    ))}
  </>
);
