import React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { CTA, FullOverlay, NoTyreKickers, Offer, ResultCard, SameRoofers } from "../Ad/Graphics";
import { Sfx, SfxEvent } from "../Ad/Sfx";
import { GuaranteeStamp, PersonClip } from "../AdChristmas/AdChristmas";
import { TwentyRoofers } from "../AdBurned/Scenes";
import { BlackCard, ChestCaptions, KeywordSlam, PunchFootage, Sticker, T } from "../TradieStyle/kit";
import type { Word } from "../VSL/Captions";
import { makeCue } from "../VSL/cue";
import captions from "./captions.json";
import { BuyerChecklist, LeadPileUp, LeadSwarm } from "./Scenes";

const words = captions as Word[];

// public/footage/leads.mov is 73.87s at 30fps.
export const AD_LEADS_FRAMES = 2216;

const Scene: React.FC<{ from: number; to: number; children: (len: number) => React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none">
    {children(to - from)}
  </Sequence>
);

const emoji = (e: string, size = 200) => <div style={{ fontSize: size, fontFamily: "'Noto Color Emoji'" }}>{e}</div>;

export const AdLeads: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const { find, frameOf } = makeCue(words, fps);
  const at = (p: string, after = 0) => frameOf(find(p, after));

  const c = {
    that: at("That is exactly why"),
    most: at("Most roofers think"),
    dont: at("They don't"),
    need: at("They need more actual"),
    because: at("Because here's"),
    leadsMean: at("Leads mean"),
    hundred: at("You can have 100"),
    calendar: at("empty calendar"),
    chase: at("And when you chase"),
    endUp: at("You end up"),
    cheapest: at("cheapest"),
    hours: at("You're spending hours"),
    evenIf: at("And even if"),
    next: at("next guy"),
    moreLeads: at("More leads do not"),
    better: at("A better system"),
    what: at("What actually moves"),
    looking: at("already looking"),
    budget: at("already have the budget"),
    ready: at("ready to book"),
    not: at("Not tyre kickers"),
    window2: at("or window shoppers"),
    actual: at("Actual paying customers"),
    build: at("And that is exactly what we build"),
    seven: at("And we do it"),
    system: at("That's exactly the system"),
    vista: at("Vista Roofing"),
    eighteen: at("and 18 other"),
    guarantee: at("And we'll guarantee"),
    completely: at("completely guaranteed"),
    soIf: at("So if you want"),
    touch: at("get in touch"),
  };
  const cuts = [c.that, c.most, c.need, c.because, c.hundred, c.chase, c.endUp, c.hours, c.evenIf, c.moreLeads, c.better, c.what, c.build, c.soIf, c.touch];

  // Frames where a card / graphic owns the frame (captions hide).
  const busy: [number, number][] = [
    [c.leadsMean, c.hundred],
    [c.hundred, c.chase],
    [c.endUp, c.hours],
    [c.evenIf, c.better],
    [c.what, c.build],
    [c.build, c.soIf],
    [c.touch, durationInFrames],
  ];

  const A = staticFile("footage/leads-person-a.webm");
  const B = staticFile("footage/leads-person-b.webm");
  const C = staticFile("footage/leads-person-c.webm");

  const sfx: SfxEvent[] = [
    { at: 0, name: "whoosh-big" },
    ...cuts.map((f) => ({ at: f, name: "whoosh" as const, volume: 0.55 })),
    { at: at("leads?") , name: "slap" },
    { at: at("stuck."), name: "stamp", volume: 1.1 },
    { at: c.dont, name: "slap", volume: 1.1 },
    { at: c.need + 6, name: "coins", volume: 0.9 },
    { at: c.leadsMean, name: "whoosh-big" },
    { at: at("ghost"), name: "pop" },
    { at: at("waste"), name: "pop" },
    { at: at("expensive."), name: "error", volume: 0.7 },
    { at: c.hundred, name: "whoosh-big" },
    ...Array.from({ length: 16 }, (_, k) => ({ at: c.hundred + 4 + k * 2, name: "pop" as const, volume: 0.35 })),
    { at: c.calendar, name: "stamp", volume: 1.3 },
    { at: c.calendar + 2, name: "error", volume: 0.8 },
    { at: c.endUp, name: "whoosh" },
    ...[4, 7, 10, 13].map((d) => ({ at: c.endUp + d, name: "pop" as const, volume: 0.6 })),
    { at: c.cheapest, name: "slap", volume: 1.2 },
    { at: c.hours + 4, name: "pop" },
    { at: c.evenIf, name: "whoosh" },
    ...Array.from({ length: 6 }, (_, k) => ({ at: c.evenIf + Math.round(k * 0.45 * fps), name: "notify" as const, volume: 0.6 })),
    { at: c.next, name: "error", volume: 0.9 },
    { at: c.next + 2, name: "fall", volume: 0.7 },
    { at: c.moreLeads, name: "whoosh-big" },
    { at: c.better, name: "slap", volume: 1.1 },
    { at: c.what, name: "whoosh" },
    { at: c.looking, name: "confirm" },
    { at: c.budget, name: "confirm" },
    { at: c.ready, name: "success" },
    { at: c.not, name: "whoosh-big" },
    { at: c.not + 4, name: "stamp", volume: 1.1 },
    { at: c.window2, name: "stamp", volume: 1.1 },
    { at: c.actual, name: "success" },
    { at: c.build, name: "whoosh-big" },
    { at: at("7"), name: "zap", volume: 0.8 },
    { at: c.system, name: "whoosh-big" },
    ...[c.system, c.vista].flatMap((f) => [
      { at: f + 43, name: "coins" as const, volume: 1.1 },
      { at: f + 50, name: "coins-stack" as const },
    ]),
    { at: c.vista, name: "whoosh" },
    { at: c.eighteen, name: "whoosh" },
    ...Array.from({ length: 15 }, (_, k) => ({ at: c.eighteen + 6 + k * 2, name: "pop" as const, volume: 0.45 })),
    { at: c.guarantee, name: "whoosh-big" },
    ...[0, 6, 12, 18, 24].map((d) => ({ at: c.guarantee + 8 + d, name: "tick" as const, volume: 0.7 })),
    { at: at("or your money"), name: "confirm" },
    { at: c.completely, name: "stamp", volume: 1.2 },
    { at: c.soIf + 3, name: "slap" },
    { at: at("dead"), name: "fall", volume: 0.8 },
    { at: c.touch, name: "whoosh" },
    { at: c.touch + 6, name: "pop" },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <PunchFootage src={staticFile("footage/leads.mov")} cuts={cuts} />

      {/* Keywords behind the speaker */}
      <Scene from={at("more leads?")} to={c.that}>{() => <KeywordSlam top={30} lines={[{ text: "more", font: "cond", size: 110 }, { text: "LEADS?", color: T.accent, size: 220 }]} />}</Scene>
      <Scene from={c.that} to={c.most}>{() => <KeywordSlam top={70} lines={[{ text: "STUCK.", size: 250 }]} />}</Scene>
      <Scene from={c.dont} to={c.need}>{() => <KeywordSlam top={30} lines={[{ text: "they", font: "cond", size: 110 }, { text: "DON'T", color: T.accent, size: 230 }]} />}</Scene>
      <Scene from={c.need} to={c.leadsMean}>{() => <KeywordSlam top={30} lines={[{ text: "actual", font: "cond", color: T.accent, size: 110 }, { text: "PAYING", size: 220 }]} />}</Scene>
      <Scene from={c.better} to={c.what}>{() => <KeywordSlam top={30} lines={[{ text: "a better", font: "cond", color: T.accent, size: 110 }, { text: "SYSTEM", size: 220 }]} />}</Scene>
      <Scene from={at("dead")} to={c.touch}>{() => <KeywordSlam top={30} lines={[{ text: "no more", font: "cond", color: T.accent, size: 110 }, { text: "DEAD LEADS", size: 128 }]} />}</Scene>

      <PersonClip src={A} fileStart={0} from={at("more leads?")} to={c.leadsMean} cuts={cuts} />
      <PersonClip src={B} fileStart={Math.round(35.5 * fps)} from={c.better} to={c.what} cuts={cuts} />
      <PersonClip src={C} fileStart={Math.round(69.5 * fps)} from={at("dead")} to={c.touch} cuts={cuts} />

      {/* Stickers beside the speaker */}
      <Scene from={c.that} to={c.most}>{() => <Sticker emoji="😩" x={860} y={1240} size={230} rotate={8} />}</Scene>
      <Scene from={c.need} to={c.leadsMean}>{() => <Sticker emoji="💵" x={220} y={1250} size={230} at={4} />}</Scene>
      <Scene from={c.chase} to={c.endUp}>{() => <Sticker emoji="🏃" x={860} y={1250} size={230} rotate={6} />}</Scene>
      <Scene from={c.hours} to={c.evenIf}>
        {() => (
          <>
            <Sticker emoji="🛍️" x={220} y={1250} size={230} at={at("window") - c.hours} />
            <Sticker emoji="⏳" x={860} y={1250} size={220} at={4} rotate={8} />
          </>
        )}
      </Scene>
      <Scene from={c.soIf} to={at("dead")}>{() => <Sticker emoji="💰" x={860} y={1250} size={230} rotate={8} />}</Scene>

      {/* Chest graphics */}
      <Scene from={c.endUp} to={c.hours}>{(len) => <SameRoofers len={len} stickerAt={c.cheapest - c.endUp} />}</Scene>
      <Scene from={c.evenIf} to={c.moreLeads}>{(len) => <LeadPileUp len={len} lostAt={c.next - c.evenIf} />}</Scene>
      <Scene from={c.what} to={c.not}>{(len) => <BuyerChecklist len={len} ats={[c.looking - c.what, c.budget - c.what, c.ready - c.what]} />}</Scene>

      <ChestCaptions words={words} y={1060} hide={busy} />

      {/* Full-screen beats */}
      <Scene from={c.leadsMean} to={c.hundred}>
        {() => (
          <BlackCard
            parts={[
              [{ text: "LEADS MEAN", style: "small" }],
              [{ text: "NOTHING", style: "yellow", at: 4 }],
              [{ text: "if they", style: "script", at: at("ghost") - c.leadsMean - 4 }, { text: "GHOST", style: "big", at: at("ghost") - c.leadsMean }],
              [{ text: "or say", style: "script", at: at("tell") - c.leadsMean }, { text: "TOO PRICEY", style: "cond", at: at("expensive.") - c.leadsMean }],
            ]}
            sticker={emoji("👻")}
          />
        )}
      </Scene>
      <Scene from={c.hundred} to={c.chase}>
        {(len) => (
          <FullOverlay len={len}>
            <LeadSwarm len={len} crossAt={c.calendar - c.hundred} />
          </FullOverlay>
        )}
      </Scene>
      <Scene from={c.moreLeads} to={c.better}>
        {() => (
          <BlackCard
            parts={[
              [{ text: "MORE LEADS", style: "big" }],
              [{ text: "do not", style: "script", at: at("do not") - c.moreLeads }, { text: "FIX IT", style: "yellow", at: at("fix") - c.moreLeads }],
            ]}
            sticker={emoji("🚫")}
          />
        )}
      </Scene>
      <Scene from={c.not} to={c.build}>
        {(len) => (
          <FullOverlay len={len}>
            <NoTyreKickers len={len} secondAt={c.window2 - c.not} bookedAt={c.actual - c.not} />
          </FullOverlay>
        )}
      </Scene>
      <Scene from={c.build} to={c.system}>
        {() => (
          <BlackCard
            parts={[
              [{ text: "BUILT FOR YOU", style: "small" }],
              [{ text: "in under", style: "script", at: at("under") - c.build }, { text: "7 DAYS", style: "yellow", at: at("7") - c.build }],
            ]}
            sticker={emoji("⚡")}
          />
        )}
      </Scene>
      <Scene from={c.system} to={c.vista}>
        {(len) => (
          <FullOverlay len={len}>
            <ResultCard len={len} logo={staticFile("logos/happy.png")} logoBg="#95c241" name="Happy Roofing" value={1.2} format={(n) => `$${n.toFixed(1)}M`} caption="in 70 days" />
          </FullOverlay>
        )}
      </Scene>
      <Scene from={c.vista} to={c.eighteen}>
        {(len) => (
          <FullOverlay len={len}>
            <ResultCard len={len} logo={staticFile("logos/vista.png")} logoBg="#ffffff" name="Vista Roofing" value={96000} format={(n) => "$" + Math.round(n).toLocaleString("en-US")} caption="from just 3 roof replacements" days={30} />
          </FullOverlay>
        )}
      </Scene>
      <Scene from={c.eighteen} to={c.guarantee}>
        {(len) => (
          <FullOverlay len={len}>
            <TwentyRoofers len={len} countAt={8} />
          </FullOverlay>
        )}
      </Scene>
      <Scene from={c.guarantee} to={c.soIf}>
        {(len) => (
          <FullOverlay len={len}>
            <Offer len={len} freeAt={at("or your money") - c.guarantee} period="added to your calendar" freeText="Or your money back" />
            <GuaranteeStamp at={c.completely - c.guarantee} />
          </FullOverlay>
        )}
      </Scene>
      <Scene from={c.touch - 6} to={durationInFrames}>{(len) => <CTA len={len} badge={staticFile("brand/av-logo-dark.png")} />}</Scene>

      <Sfx events={sfx} />
    </AbsoluteFill>
  );
};
