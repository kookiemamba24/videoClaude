import React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Sfx, SfxEvent } from "../Ad/Sfx";
import captions from "../AdBurned/captions.json";
import type { Word } from "../VSL/Captions";
import { makeCue } from "../VSL/cue";
import { BlackCard, ChestCaptions, KeywordSlam, OfferCard, PersonLayer, PunchFootage, StackedHook, Sticker, T } from "./kit";

const words = (captions as Word[]).filter((w) => w.startMs < 15000);

// 15s demo of the tradie style on the first lines of the burned-ad footage.
export const TRADIE_DEMO_FRAMES = 450;

export const TradieDemo: React.FC = () => {
  const { fps } = useVideoConfig();
  const { find, frameOf } = makeCue(words, fps);
  const at = (p: string, after = 0) => frameOf(find(p, after));

  const c = {
    burned: at("burned"),
    they: at("They promise"),
    take: at("take your money"),
    weak: at("weak"),
    ghost: at("and then they ghost"),
    well: at("Well the difference"),
    care: at("care"),
    results: at("our results"),
    twenty: at("20"),
  };
  // Jump-cut punch-ins at sentence/phrase boundaries.
  const cuts = [c.burned, c.they, c.take, c.weak, c.well, c.care, c.results, c.twenty];

  // Full-screen black cards replace the footage + captions while up.
  const cards: [number, number][] = [
    [c.they, c.take],
    [c.ghost, c.well],
  ];
  const behind: [number, number][] = [
    [c.burned, c.they],
    [c.take, c.weak],
    [c.well, c.care],
  ];

  const sfx: SfxEvent[] = [
    { at: 0, name: "whoosh" },
    ...cuts.map((f) => ({ at: f, name: "whoosh" as const, volume: 0.6 })),
    { at: c.burned + 4, name: "slap", volume: 1.1 },
    { at: c.they + 2, name: "pop" },
    { at: at("world") , name: "pop" },
    { at: c.take, name: "slap" },
    { at: c.take + 6, name: "coins" },
    { at: c.weak + 2, name: "error", volume: 0.7 },
    { at: c.ghost + 2, name: "pop" },
    { at: at("ghost"), name: "fall", volume: 0.8 },
    { at: c.well + 2, name: "slap" },
    { at: c.twenty, name: "success" },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <PunchFootage src={staticFile("footage/burned-ad.mp4")} cuts={cuts} />

      {/* Giant keywords that sit behind the speaker */}
      <Sequence from={behind[0][0]} durationInFrames={behind[0][1] - behind[0][0]} layout="none">
        <KeywordSlam lines={[{ text: "BURNED", size: 250 }]} />
      </Sequence>
      <Sequence from={behind[1][0]} durationInFrames={behind[1][1] - behind[1][0]} layout="none">
        <KeywordSlam lines={[{ text: "YOUR", size: 220 }, { text: "MONEY", color: T.yellow, size: 220 }]} />
      </Sequence>
      <Sequence from={behind[2][0]} durationInFrames={behind[2][1] - behind[2][0]} layout="none">
        <KeywordSlam lines={[{ text: "THE", size: 200 }, { text: "DIFFERENCE", size: 150, font: "cond", color: T.yellow }]} />
      </Sequence>

      {/* Speaker on top of the keywords */}
      <PersonLayer src={staticFile("footage/burned-ad-person.webm")} cuts={cuts} />

      {/* Hook over the opening line */}
      <Sequence from={0} durationInFrames={c.burned} layout="none">
        <StackedHook top="HEY ROOFERS" main="LISTEN UP" tag="been burned by agencies?" y={110} />
      </Sequence>

      {/* Stickers over the speaker */}
      <Sequence from={c.burned} durationInFrames={c.they - c.burned} layout="none">
        <Sticker emoji="🔥" x={830} y={1250} size={280} rotate={8} />
      </Sequence>
      <Sequence from={c.take} durationInFrames={c.weak - c.take} layout="none">
        <Sticker emoji="💸" x={250} y={1260} size={260} at={4} />
      </Sequence>
      <Sequence from={c.weak} durationInFrames={c.ghost - c.weak} layout="none">
        <Sticker emoji="👎" x={820} y={1240} size={240} />
      </Sequence>
      <Sequence from={c.twenty} durationInFrames={450 - c.twenty} layout="none">
        <OfferCard title={["20 ROOFING", "COMPANIES"]} sub="Real results, proven across 20 different roofing businesses." y={1130} />
      </Sequence>

      {/* Small chest captions, hidden while hook/keywords/cards are up */}
      <ChestCaptions words={words} y={1080} hide={[[0, c.burned], ...cards, [c.twenty, 450]]} />

      {/* Black kinetic cards */}
      <Sequence from={cards[0][0]} durationInFrames={cards[0][1] - cards[0][0]} layout="none">
        <BlackCard
          parts={[
            [{ text: "THEY PROMISE", style: "small" }],
            [{ text: "you", style: "script", at: 8 }, { text: "THE", style: "big", at: 8 }],
            [{ text: "WORLD", style: "yellow", at: at("world") - c.they }],
          ]}
          sticker={<div style={{ fontSize: 200, fontFamily: "'Noto Color Emoji'" }}>🌍</div>}
        />
      </Sequence>
      <Sequence from={cards[1][0]} durationInFrames={cards[1][1] - cards[1][0]} layout="none">
        <BlackCard
          parts={[
            [{ text: "AND THEN", style: "small" }],
            [{ text: "they", style: "script", at: 4 }, { text: "GHOST", style: "big", at: at("ghost") - c.ghost }],
            [{ text: "YOU", style: "cond", at: at("ghost") - c.ghost + 6 }],
          ]}
          sticker={<div style={{ fontSize: 220, fontFamily: "'Noto Color Emoji'" }}>👻</div>}
        />
      </Sequence>

      <Sfx events={sfx} />
    </AbsoluteFill>
  );
};
