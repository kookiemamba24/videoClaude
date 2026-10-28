import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../VSL/Captions";
import { makeCue } from "../VSL/cue";
import { BigCaptions } from "./BigCaptions";
import { Sfx, SfxEvent } from "./Sfx";
import captions from "./captions.json";
import {
  AdImage,
  BadAdsFan,
  CheapVsBest,
  CTA,
  FollowUpPhone,
  LeadsFleeFull,
  LogoRow,
  NoTyreKickers,
  FullOverlay,
  Offer,
  PremiumAd,
  ResultCard,
  SameRoofers,
  ScrollThenHaggle,
  Unpredictable,
  WebsiteForm,
} from "./Graphics";

const words = captions as Word[];

// public/footage/scaring-away-ads.mov is 76.95s.
export const AD_SCARING_FRAMES = 2308;

export type AdScaringProps = {
  // Screenshots of typical bad roofing ads. Parody mocks show if omitted.
  badAds?: AdImage[];
  // One of our premium ads, shown as a sponsored post in the phone.
  premiumAd?: string;
};

const logos = {
  happy: { src: staticFile("logos/happy.png"), bg: "#95c241" },
  action: { src: staticFile("logos/action.png"), bg: "#ffffff" },
  braga: { src: staticFile("logos/braga.png"), bg: "#1a1a18" },
};

const BAD_ADS: AdImage[] = [
  { src: staticFile("ads/bad-doors.png"), aspect: 1206 / 1165 },
  { src: staticFile("ads/bad-righton.png"), aspect: 399 / 501 },
  { src: staticFile("ads/bad-collage.png"), aspect: 1206 / 1184 },
];

// Fingertip position while pointing up during "...look like these".
const FINGER = { x: 830, y: 905 };

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

// Short punch-ins on the footage at the jokes and the turn.
const Footage: React.FC<{ punches: number[] }> = ({ punches }) => {
  const frame = useCurrentFrame();
  const zoom = punches.reduce((z, at) => {
    const p = interpolate(frame, [at, at + 4, at + 40, at + 52], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return Math.max(z, 1 + 0.08 * p);
  }, 1);
  return (
    // Zoom about the face so it stays clear of the graphics band.
    <AbsoluteFill style={{ scale: String(zoom), transformOrigin: "50% 36%" }}>
      <OffthreadVideo src={staticFile("footage/scaring-away-ads.mov")} />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ from: number; to: number; children: (len: number) => React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none">
    {children(to - from)}
  </Sequence>
);

export const AdScaring: React.FC<AdScaringProps> = ({ badAds = BAD_ADS, premiumAd = staticFile("ads/premium-ad.jpg") }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { find, frameOf } = makeCue(words, fps);
  const at = (phrase: string, after = 0) => frameOf(find(phrase, after));
  const iMid = find("These were");

  const c = {
    flee: at("YOU are probably"),
    same: at("These type"),
    phone: at("And when they"),
    offer: at("Here is our"),
    happy: at("our client Happy"),
    action: at("Action Roofing"),
    braga: at("Even Braga"),
    logos: at("These were"),
    unpred: at("Not enough"),
    changed: at("Here is what we changed"),
    premium: at("We build YOU premium"),
    cheap: at("Not the cheapest"),
    web: at("Then we build"),
    follow: at("And then we put"),
    tyre: at("No tyre"),
    cta: at("Hit the button"),
  };

  // One cue per graphic beat, timed off the same spoken words as the visuals.
  const fan = at("look like these");
  const happyCount = c.happy + 10 + 33;
  const sfx: SfxEvent[] = [
    { at: fan, name: "card-fan" },
    ...[0, 3, 6].map((d) => ({ at: fan + d, name: "pop" as const, volume: 0.8 })),
    { at: c.flee, name: "whoosh-big" },
    { at: at("scaring") + 4, name: "fall", volume: 0.9 },
    { at: at("away"), name: "error", volume: 0.7 },
    { at: c.same, name: "whoosh" },
    ...[4, 7, 10, 13].map((d) => ({ at: c.same + d, name: "pop" as const, volume: 0.6 })),
    { at: at("cheapest"), name: "slap", volume: 1.2 },
    { at: c.phone, name: "whoosh" },
    { at: at("scroll past"), name: "scroll" },
    { at: at("or they call"), name: "notify" },
    { at: at("beat") - 6, name: "pop" },
    ...[0, 9, 18].map((d) => ({ at: at("beat") + d, name: "drop" as const })),
    { at: c.offer, name: "whoosh-big" },
    ...[0, 6, 12, 18, 24].map((d) => ({ at: c.offer + 8 + d, name: "tick" as const, volume: 0.7 })),
    { at: at("or we work for free"), name: "confirm" },
    ...[c.happy, c.action, c.braga].flatMap((from) => [
      { at: from, name: "whoosh" as const },
      { at: from + 43, name: "coins" as const, volume: 1.1 },
      { at: from + 50, name: "coins-stack" as const },
    ]),
    { at: happyCount, name: "tick", volume: 0.5 },
    ...[0, 4, 8].map((d) => ({ at: c.logos + d, name: "pop" as const, volume: 0.8 })),
    { at: c.unpred, name: "whoosh-big" },
    { at: c.unpred + 4, name: "error", volume: 0.6 },
    { at: at("no predictable", iMid), name: "error", volume: 0.6 },
    { at: c.premium, name: "whoosh" },
    { at: at("that is the roofer"), name: "confirm" },
    { at: c.cheap, name: "whoosh-big" },
    { at: c.cheap + 8, name: "zap", volume: 0.7 },
    { at: at("The best one") - 4, name: "fall", volume: 0.7 },
    { at: at("The best one"), name: "success" },
    { at: c.web, name: "whoosh" },
    // Typing into the three form fields.
    ...[10, 24, 38].flatMap((st) => [0, 2, 4, 6, 8, 10].map((d) => ({ at: c.web + st + d, name: "click" as const, volume: 1.4 }))),
    { at: at("does the selling") - 8, name: "click", volume: 2 },
    { at: at("does the selling"), name: "confirm" },
    { at: c.follow, name: "whoosh" },
    { at: at("contacts"), name: "notify" },
    ...[0, 6, 12].map((d) => ({ at: at("qualifying") + d, name: "pop" as const, volume: 0.8 })),
    { at: at("booked straight"), name: "success" },
    { at: c.tyre, name: "whoosh-big" },
    { at: c.tyre + 4, name: "stamp", volume: 1.1 },
    { at: at("No time"), name: "stamp", volume: 1.1 },
    { at: at("Just booked"), name: "success" },
    { at: c.cta, name: "whoosh" },
    { at: c.cta + 6, name: "pop" },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Footage punches={[at("cheapest"), at("beat"), at("The best one"), at("No tyre")]} />
      {/* Soft darkening behind the graphics band and captions. */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 22%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.32) 85%)" }} />

      <Scene from={at("look like these")} to={c.flee}>{(len) => <BadAdsFan len={len} images={badAds} anchor={FINGER} />}</Scene>
      <Scene from={c.same} to={c.phone}>{(len) => <SameRoofers len={len} stickerAt={at("cheapest") - c.same} />}</Scene>
      <Scene from={c.phone} to={c.offer}>
        {(len) => (
          <ScrollThenHaggle
            len={len}
            scrollAt={at("scroll past") - c.phone}
            callAt={at("or they call") - c.phone}
            beatAt={at("beat") - c.phone}
          />
        )}
      </Scene>
      <Scene from={c.offer} to={at("And just to")}>{(len) => (
          <FullOverlay len={len}>
            <Offer len={len} freeAt={at("or we work for free") - c.offer} />
          </FullOverlay>
        )}</Scene>
      <Scene from={c.happy} to={c.action}>
        {(len) => (
          <ResultCard
            len={len}
            logo={logos.happy.src}
            logoBg={logos.happy.bg}
            name="Happy Roofing"
            value={1.2}
            format={(n) => `$${n.toFixed(1)}M`}
            caption="revenue in 70 days"
            bars={[
              { label: "Ad spend", value: "$118,000", w: 118 / 1200 },
              { label: "Revenue", value: "$1,200,000", w: 1, strong: true },
            ]}
          />
        )}
      </Scene>
      <Scene from={c.action} to={c.braga}>
        {(len) => (
          <ResultCard
            len={len}
            logo={logos.action.src}
            logoBg={logos.action.bg}
            name="Action Roofing"
            value={190000}
            format={money}
            caption="raked in"
            bars={[
              { label: "Ad spend", value: "$3,200", w: 3.2 / 190 },
              { label: "Revenue", value: "$190,000", w: 1, strong: true },
            ]}
          />
        )}
      </Scene>
      <Scene from={c.braga} to={c.logos}>
        {(len) => (
          <ResultCard
            len={len}
            logo={logos.braga.src}
            logoBg={logos.braga.bg}
            name="Braga Brothers"
            value={150000}
            format={money}
            caption="in under 60 days"
            days={60}
          />
        )}
      </Scene>
      <Scene from={c.logos} to={c.unpred}>{(len) => <LogoRow len={len} logos={[logos.happy, logos.action, logos.braga]} />}</Scene>
      <Scene from={c.unpred} to={c.changed}>{(len) => (
          <FullOverlay len={len}>
            <Unpredictable len={len} secondAt={at("no predictable", iMid) - c.unpred} />
          </FullOverlay>
        )}</Scene>
      <Scene from={c.premium} to={c.cheap}>{(len) => <PremiumAd len={len} trustAt={at("that is the roofer") - c.premium} image={premiumAd} />}</Scene>
      <Scene from={c.cheap} to={c.web}>{(len) => (
          <FullOverlay len={len}>
            <CheapVsBest len={len} bestAt={at("The best one") - c.cheap} />
          </FullOverlay>
        )}</Scene>
      <Scene from={c.web} to={c.follow}>{(len) => <WebsiteForm len={len} sellAt={at("does the selling") - c.web} />}</Scene>
      <Scene from={c.follow} to={c.tyre}>
        {(len) => (
          <FollowUpPhone
            len={len}
            contactAt={at("contacts") - c.follow}
            qualifyAt={at("qualifying") - c.follow}
            bookedAt={at("booked straight") - c.follow}
          />
        )}
      </Scene>
      <Scene from={c.tyre} to={c.cta}>
        {(len) => (
          <FullOverlay len={len}>
            <NoTyreKickers len={len} secondAt={at("No time") - c.tyre} bookedAt={at("Just booked") - c.tyre} />
          </FullOverlay>
        )}
      </Scene>
      <Scene from={c.cta} to={durationInFrames}>{(len) => <CTA len={len} badge={staticFile("brand/av-logo.png")} />}</Scene>

      {/* Full-screen cutaway: the footage is hidden but the voice carries on. */}
      <Scene from={c.flee} to={c.same}>{(len) => <LeadsFleeFull len={len} fleeAt={at("scaring") - c.flee + 4} />}</Scene>

      <BigCaptions words={words} />
      <Sfx events={sfx} />
    </AbsoluteFill>
  );
};
