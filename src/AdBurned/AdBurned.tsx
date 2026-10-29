import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig } from "remotion";
import { BigCaptions } from "../Ad/BigCaptions";
import { CTA, FollowUpPhone, FullOverlay, ResultCard } from "../Ad/Graphics";
import { Sfx, SfxEvent } from "../Ad/Sfx";
import type { Word } from "../VSL/Captions";
import { makeCue } from "../VSL/cue";
import captions from "./captions.json";
import { AgencyChat, BurnedScene, CreativesShowcase, HighFive, SoccerKick, TwentyRoofers } from "./Scenes";

const words = captions as Word[];

// public/footage/burned-ad.mp4 is 51.94s.
export const AD_BURNED_FRAMES = 1558;

const logos = {
  happy: { src: staticFile("logos/happy.png"), bg: "#95c241" },
  vista: { src: staticFile("logos/vista.png"), bg: "#ffffff" },
  action: { src: staticFile("logos/action.png"), bg: "#ffffff" },
};
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

const Scene: React.FC<{ from: number; to: number; children: (len: number) => React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none">
    {children(to - from)}
  </Sequence>
);

const Full: React.FC<{ from: number; to: number; children: (len: number) => React.ReactNode }> = ({ from, to, children }) => (
  <Scene from={from} to={to}>
    {(len) => <FullOverlay len={len}>{children(len)}</FullOverlay>}
  </Scene>
);

export const AdBurned: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const { find, frameOf } = makeCue(words, fps);
  const at = (phrase: string, after = 0) => frameOf(find(phrase, after));
  const iEnd = find("So if you are");

  const c = {
    they: at("They promise"),
    well: at("Well the difference"),
    proven: at("our results are proven"),
    happy: at("Happy Roofing"),
    vista: at("Vista Roofing"),
    action: at("Action Roofing"),
    same: at("And they all"),
    high: at("High quality"),
    ours: at("Our customer service"),
    job: at("And all you gotta"),
    kickFrom: at("So you can finally"),
    kick: at("KICK THOSE"),
    kerb: at("kerb!"),
    guess: at("whether it works"),
    win: at("If you win"),
    wewin: at("WE WIN!"),
    sick: at("So if you are"),
    touch: at("get in touch", iEnd),
  };

  const sfx: SfxEvent[] = [
    { at: 0, name: "whoosh-big" },
    { at: at("burned"), name: "zap", volume: 0.9 },
    { at: at("burned") + 4, name: "error", volume: 0.7 },
    { at: c.they, name: "whoosh" },
    { at: at("promise"), name: "notify" },
    { at: at("money"), name: "coins" },
    { at: at("weak"), name: "notify" },
    { at: at("ghost"), name: "pop" },
    { at: at("ghost") + 8, name: "fall", volume: 0.8 },
    { at: c.proven, name: "whoosh-big" },
    ...Array.from({ length: 8 }, (_, k) => ({ at: at("20") - 6 + k * 3, name: "tick" as const, volume: 0.7 })),
    ...Array.from({ length: 12 }, (_, k) => ({ at: c.proven + 6 + k * 2, name: "pop" as const, volume: 0.5 })),
    { at: at("20") + 18, name: "confirm" },
    { at: c.happy, name: "whoosh-big" },
    ...[c.happy, c.vista, c.action].flatMap((f) => [
      { at: f, name: "whoosh" as const },
      { at: f + 43, name: "coins" as const, volume: 1.1 },
      { at: f + 50, name: "coins-stack" as const },
    ]),
    { at: c.high, name: "whoosh-big" },
    ...[0, 4, 8].map((d) => ({ at: c.high + d, name: "pop" as const, volume: 0.8 })),
    { at: c.high + 12, name: "confirm" },
    { at: c.ours, name: "whoosh" },
    { at: c.ours + 4, name: "notify" },
    ...[0, 6, 12].map((d) => ({ at: at("qualifying") + d, name: "pop" as const, volume: 0.8 })),
    { at: at("booked"), name: "success" },
    { at: c.kickFrom, name: "whoosh-big" },
    { at: c.kick - 5, name: "whoosh", volume: 1.2 },
    { at: c.kick, name: "stamp", volume: 1.4 },
    { at: c.kick + 1, name: "slap", volume: 1.1 },
    { at: c.kerb, name: "drop", volume: 1.3 },
    { at: c.kerb + 14, name: "success", volume: 1.1 },
    { at: c.win, name: "whoosh-big" },
    { at: c.wewin, name: "slap", volume: 1.1 },
    { at: c.wewin + 2, name: "success" },
    { at: c.touch - 8, name: "whoosh" },
    { at: c.touch, name: "pop" },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo src={staticFile("footage/burned-ad.mp4")} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 22%, rgba(0,0,0,0.16) 50%, rgba(0,0,0,0.3) 88%)" }} />

      <Full from={0} to={c.they}>{(len) => <BurnedScene len={len} burnAt={at("burned")} />}</Full>
      <Full from={c.they} to={c.well}>
        {(len) => (
          <AgencyChat
            len={len}
            promiseAt={at("promise") - c.they}
            moneyAt={at("money") - c.they}
            weakAt={at("weak") - c.they}
            ghostAt={at("ghost") - c.they}
          />
        )}
      </Full>
      <Full from={c.proven} to={c.happy}>{(len) => <TwentyRoofers len={len} countAt={at("20") - c.proven} />}</Full>

      {/* Results as one full-screen run */}
      <Full from={c.happy} to={c.same}>
        {() => (
          <>
            <Scene from={0} to={c.vista - c.happy}>
              {(len) => (
                <ResultCard len={len} logo={logos.happy.src} logoBg={logos.happy.bg} name="Happy Roofing" value={1.2} format={(n) => `$${n.toFixed(1)}M`} caption="in revenue in 70 days" />
              )}
            </Scene>
            <Scene from={c.vista - c.happy} to={c.action - c.happy}>
              {(len) => (
                <ResultCard len={len} logo={logos.vista.src} logoBg={logos.vista.bg} name="Vista Roofing" value={96000} format={money} caption="from just 3 jobs" days={30} />
              )}
            </Scene>
            <Scene from={c.action - c.happy} to={c.same - c.happy}>
              {(len) => (
                <ResultCard len={len} logo={logos.action.src} logoBg={logos.action.bg} name="Action Roofing" value={190000} format={money} caption="in revenue" days={90} />
              )}
            </Scene>
          </>
        )}
      </Full>

      <Full from={c.high} to={c.ours}>{(len) => <CreativesShowcase len={len} />}</Full>
      <Scene from={c.ours} to={c.job}>
        {(len) => <FollowUpPhone len={len} contactAt={6} qualifyAt={at("qualifying") - c.ours} bookedAt={at("booked") - c.ours} />}
      </Scene>
      <Full from={c.kickFrom} to={c.guess}>{(len) => <SoccerKick len={len} kickAt={c.kick - c.kickFrom} landAt={c.kerb - c.kickFrom} />}</Full>
      <Full from={c.win} to={c.sick}>{(len) => <HighFive len={len} clapAt={c.wewin - c.win} />}</Full>
      <Scene from={c.touch - 8} to={durationInFrames}>{(len) => <CTA len={len} badge={staticFile("brand/av-logo-dark.png")} />}</Scene>

      <BigCaptions words={words} />
      <Sfx events={sfx} />
    </AbsoluteFill>
  );
};
