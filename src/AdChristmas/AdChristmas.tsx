import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CTA, FollowUpPhone, FullOverlay, Glass, Kicker, Offer, PremiumAd, ResultCard, Stage } from "../Ad/Graphics";
import { Sfx, SfxEvent } from "../Ad/Sfx";
import { BlackCard, ChestCaptions, KeywordSlam, PunchFootage, StackedHook, Sticker, T } from "../TradieStyle/kit";
import type { Word } from "../VSL/Captions";
import { makeCue } from "../VSL/cue";
import captions from "./captions.json";

const words = captions as Word[];

// public/footage/christmas.mov is 39.17s at 30fps.
export const AD_CHRISTMAS_FRAMES = 1175;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Speaker cut-out for one stretch, so a keyword can sit behind the head.
// `fileStart` is the frame the matte file starts at in the source clip.
const PersonClip: React.FC<{ src: string; fileStart: number; from: number; to: number; cuts: number[] }> = ({ src, fileStart, from, to, cuts }) => (
  <Sequence from={from} durationInFrames={to - from} layout="none">
    <PersonZoom src={src} trim={from - fileStart} from={from} cuts={cuts} />
  </Sequence>
);

const PersonZoom: React.FC<{ src: string; trim: number; from: number; cuts: number[] }> = ({ src, trim, from, cuts }) => {
  const abs = from + useCurrentFrame();
  const idx = cuts.filter((c) => abs >= c).length;
  const last = cuts.filter((c) => abs >= c).pop() ?? -99;
  const kick = interpolate(abs - last, [0, 3], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ scale: String((idx % 2 === 0 ? 1 : 1.14) * (1 + kick * 0.05)), transformOrigin: "50% 32%" }}>
      <OffthreadVideo src={src} trimBefore={trim} transparent muted />
    </AbsoluteFill>
  );
};

// January calendar filling up as "booked out" is said.
const JanuaryBooked: React.FC<{ len: number; fillAt: number }> = ({ len, fillAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Stage len={len} width={860} top={600}>
      <Glass>
        <Kicker>January</Kicker>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12, marginTop: 24 }}>
          {"MTWTFSS".split("").map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontWeight: 800, fontSize: 30, color: "rgba(255,255,255,0.6)" }}>
              {d}
            </div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const t = fillAt + random(`jan${i}`) * 1.2 * fps;
            const p = interpolate(frame, [t, t + 6], [0, 1], clamp);
            const day = i - 2;
            return (
              <div
                key={i}
                style={{
                  height: 70,
                  borderRadius: 12,
                  background: day < 1 || day > 31 ? "transparent" : p > 0 ? `rgba(255,210,31,${0.35 + 0.6 * p})` : "rgba(255,255,255,0.08)",
                  color: p > 0.5 ? "#111" : "#fff",
                  fontWeight: 800,
                  fontSize: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: String(1 + 0.12 * Math.sin(p * Math.PI)),
                }}
              >
                {day >= 1 && day <= 31 ? day : ""}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 22, fontWeight: 900, fontSize: 52, color: T.yellow, textAlign: "center", opacity: interpolate(frame, [fillAt + fps, fillAt + fps + 8], [0, 1], clamp) }}>
          BOOKED OUT ✓
        </div>
      </Glass>
    </Stage>
  );
};

const Scene: React.FC<{ from: number; to: number; children: (len: number) => React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none">
    {children(to - from)}
  </Sequence>
);

export const AdChristmas: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const { find, frameOf } = makeCue(words, fps);
  const at = (p: string, after = 0) => frameOf(find(p, after));
  const iEnd = find("So if you're");

  const c = {
    empty: at("empty"),
    because: at("because everything"),
    dries: at("and the job dries"),
    well: at("Well here's"),
    promise: at("We'll promise"),
    money: at("or you'll get"),
    way: at("And the way"),
    putYou: at("We put you"),
    looking: at("actively looking"),
    makeSure: at("and we make sure"),
    budget: at("right budget"),
    through: at("gets through"),
    then: at("Then your whole"),
    soBy: at("So by the time"),
    xmas: at("Christmas break"),
    calendar: at("your calendar is"),
    booked: at("booked out for"),
    exact: at("And that's the exact"),
    soIf: at("So if you're"),
    bookedEnd: at("booked out before", iEnd),
    touch: at("get in touch"),
  };
  const cuts = [c.empty, c.because, c.dries, c.well, c.way, c.putYou, c.makeSure, c.then, c.soBy, c.calendar, c.exact, c.soIf, c.touch];

  // Stretches where something else owns the frame, so chest captions hide.
  const busy: [number, number][] = [
    [0, c.empty],
    [c.because, c.dries],
    [c.promise, c.way],
    [c.putYou, c.then],
    [c.then, c.soBy],
    [c.calendar, c.soIf],
    [c.touch, durationInFrames],
  ];

  const A = staticFile("footage/christmas-person-a.webm");
  const B = staticFile("footage/christmas-person-b.webm");

  const sfx: SfxEvent[] = [
    { at: 0, name: "whoosh-big" },
    { at: 4, name: "pop" },
    ...cuts.map((f) => ({ at: f, name: "whoosh" as const, volume: 0.55 })),
    { at: c.empty + 3, name: "slap", volume: 1.1 },
    { at: c.empty + 6, name: "pop" },
    { at: c.because, name: "whoosh-big" },
    { at: at("Christmas"), name: "pop" },
    { at: c.dries + 3, name: "slap" },
    { at: at("dries"), name: "fall", volume: 0.8 },
    { at: c.well + 3, name: "slap" },
    { at: c.promise, name: "whoosh-big" },
    ...[0, 6, 12, 18, 24].map((d) => ({ at: c.promise + 8 + d, name: "tick" as const, volume: 0.7 })),
    { at: c.money, name: "confirm" },
    { at: at("completely"), name: "stamp", volume: 1.1 },
    { at: c.way + 3, name: "slap" },
    { at: c.putYou, name: "whoosh" },
    { at: c.looking, name: "confirm" },
    { at: c.makeSure, name: "whoosh" },
    { at: c.makeSure + 6, name: "notify" },
    ...[0, 6, 12].map((d) => ({ at: c.budget + d, name: "pop" as const, volume: 0.8 })),
    { at: c.through, name: "success" },
    { at: c.then, name: "whoosh-big" },
    { at: at("seven"), name: "zap", volume: 0.8 },
    { at: c.xmas, name: "pop" },
    { at: c.calendar, name: "whoosh" },
    ...Array.from({ length: 10 }, (_, k) => ({ at: c.booked + k * 3.5, name: "tick" as const, volume: 0.6 })),
    { at: c.booked + fps, name: "success" },
    { at: c.exact, name: "whoosh-big" },
    { at: c.exact + 43, name: "coins", volume: 1.1 },
    { at: c.exact + 50, name: "coins-stack" },
    { at: c.soIf + 3, name: "slap" },
    { at: c.touch, name: "whoosh" },
    { at: c.touch + 6, name: "pop" },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <PunchFootage src={staticFile("footage/christmas.mov")} cuts={cuts} />

      {/* Keywords behind the speaker */}
      <Scene from={c.empty} to={c.because}>
        {() => <KeywordSlam top={170} lines={[{ text: "EMPTY", size: 250 }, { text: "CALENDAR?", font: "cond", color: T.yellow, size: 150 }]} />}
      </Scene>
      <Scene from={c.dries} to={c.well}>
        {() => <KeywordSlam top={190} lines={[{ text: "DRIES", size: 240 }, { text: "UP", color: T.yellow, size: 240 }]} />}
      </Scene>
      <Scene from={c.well} to={c.promise}>
        {() => <KeywordSlam top={200} lines={[{ text: "MY", size: 200 }, { text: "PROMISE", color: T.yellow, size: 210 }]} />}
      </Scene>
      <Scene from={c.way} to={c.putYou}>
        {() => <KeywordSlam top={70} lines={[{ text: "IT'S", size: 110 }, { text: "SIMPLE", color: T.yellow, size: 230 }]} />}
      </Scene>
      <Scene from={c.soIf} to={c.touch}>
        {() => <KeywordSlam top={70} lines={[{ text: "BOOKED", size: 230 }, { text: "out before christmas", font: "cond", color: T.yellow, size: 96 }]} />}
      </Scene>

      <PersonClip src={A} fileStart={0} from={c.empty} to={c.because} cuts={cuts} />
      <PersonClip src={A} fileStart={0} from={c.dries} to={c.promise} cuts={cuts} />
      <PersonClip src={A} fileStart={0} from={c.way} to={c.putYou} cuts={cuts} />
      <PersonClip src={B} fileStart={35 * fps} from={c.soIf} to={c.touch} cuts={cuts} />

      {/* Hook, in front of the speaker */}
      <Scene from={0} to={c.empty}>{() => <StackedHook top="HEY ROOFERS" main="EMPTY JANUARY?" tag="read this before Christmas" y={150} />}</Scene>

      {/* Stickers beside the speaker */}
      <Scene from={c.empty} to={c.because}>{() => <Sticker emoji="📅" x={850} y={1230} size={240} rotate={8} />}</Scene>
      <Scene from={c.dries} to={c.well}>{() => <Sticker emoji="📉" x={230} y={1240} size={240} />}</Scene>
      <Scene from={c.way} to={c.putYou}>{() => <Sticker emoji="🛠️" x={850} y={1250} size={220} rotate={10} />}</Scene>
      <Scene from={c.soBy} to={c.calendar}>{() => <Sticker emoji="🎄" x={850} y={1230} size={260} at={c.xmas - c.soBy} rotate={6} />}</Scene>
      <Scene from={c.soIf} to={c.touch}>{() => <Sticker emoji="🎅" x={230} y={1240} size={240} />}</Scene>

      {/* Chest-level graphics over the footage */}
      <Scene from={c.putYou} to={c.makeSure}>{(len) => <PremiumAd len={len} trustAt={c.looking - c.putYou} video={staticFile("ads/premium-ad.mp4")} />}</Scene>
      <Scene from={c.makeSure} to={c.then}>
        {(len) => <FollowUpPhone len={len} contactAt={6} qualifyAt={c.budget - c.makeSure} bookedAt={c.through - c.makeSure} />}
      </Scene>
      <Scene from={c.calendar} to={c.exact}>{(len) => <JanuaryBooked len={len} fillAt={c.booked - c.calendar} />}</Scene>

      <ChestCaptions words={words} y={1060} hide={busy} />

      {/* Full-screen beats */}
      <Scene from={c.because} to={c.dries}>
        {() => (
          <BlackCard
            parts={[
              [{ text: "EVERYTHING", style: "small" }],
              [{ text: "shuts", style: "script", at: at("shuts") - c.because }, { text: "DOWN", style: "big", at: at("down") - c.because }],
              [{ text: "over", style: "script", at: at("over") - c.because }, { text: "CHRISTMAS", style: "yellow", at: at("Christmas") - c.because }],
            ]}
            sticker={<div style={{ fontSize: 200, fontFamily: "'Noto Color Emoji'" }}>🎄</div>}
          />
        )}
      </Scene>
      <Scene from={c.promise} to={c.way}>
        {(len) => (
          <FullOverlay len={len}>
            <Offer len={len} freeAt={c.money - c.promise} period="right after Christmas" freeText="Or your money back" />
          </FullOverlay>
        )}
      </Scene>
      <Scene from={c.then} to={c.soBy}>
        {() => (
          <BlackCard
            parts={[
              [{ text: "SET UP BY US", style: "small" }],
              [{ text: "live in", style: "script", at: at("live") - c.then }, { text: "UNDER", style: "big", at: at("under") - c.then }],
              [{ text: "7 DAYS", style: "yellow", at: at("seven") - c.then }],
            ]}
            sticker={<div style={{ fontSize: 200, fontFamily: "'Noto Color Emoji'" }}>⚡</div>}
          />
        )}
      </Scene>
      <Scene from={c.exact} to={c.soIf}>
        {(len) => (
          <FullOverlay len={len}>
            <ResultCard
              len={len}
              logo={staticFile("logos/happy.png")}
              logoBg="#95c241"
              name="Happy Roofing"
              value={1.2}
              format={(n) => `$${n.toFixed(1)}M`}
              caption="before they closed for the season"
              bars={[
                { label: "Ad spend", value: "$118,000", w: 118 / 1200 },
                { label: "Revenue", value: "$1,200,000", w: 1, strong: true },
              ]}
            />
          </FullOverlay>
        )}
      </Scene>
      <Scene from={c.touch - 6} to={durationInFrames}>{(len) => <CTA len={len} badge={staticFile("brand/av-logo-dark.png")} />}</Scene>

      <Sfx events={sfx} />
    </AbsoluteFill>
  );
};
