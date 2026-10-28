import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../VSL/Captions";
import { makeCue } from "../VSL/cue";
import { BigCaptions } from "./BigCaptions";
import captions from "./captions.json";
import {
  BadAdsFan,
  CheapVsBest,
  CTA,
  FollowUpPhone,
  LeadsFlee,
  LogoRow,
  NoTyreKickers,
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
  // Screenshots of typical bad roofing ads (public/ paths). Parody mocks are
  // shown until these are supplied.
  badAds?: string[];
  // One of our premium ads, shown in the phone mockup.
  premiumAd?: string;
};

const logos = {
  happy: { src: staticFile("logos/happy.png"), bg: "#95c241" },
  action: { src: staticFile("logos/action.png"), bg: "#ffffff" },
  braga: { src: staticFile("logos/braga.png"), bg: "#1a1a18" },
};

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

export const AdScaring: React.FC<AdScaringProps> = ({ badAds, premiumAd }) => {
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

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Footage punches={[at("scaring"), at("cheapest"), at("beat"), at("The best one"), at("No tyre")]} />
      {/* Soft darkening behind the graphics band and captions. */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 22%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.32) 85%)" }} />

      <Scene from={0} to={c.flee}>{(len) => <BadAdsFan len={len} images={badAds} />}</Scene>
      <Scene from={c.flee} to={c.same}>{(len) => <LeadsFlee len={len} fleeAt={at("scaring") - c.flee} />}</Scene>
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
      <Scene from={c.offer} to={at("And just to")}>{(len) => <Offer len={len} freeAt={at("or we work for free") - c.offer} />}</Scene>
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
      <Scene from={c.unpred} to={c.changed}>{(len) => <Unpredictable len={len} secondAt={at("no predictable", iMid) - c.unpred} />}</Scene>
      <Scene from={c.premium} to={c.cheap}>{(len) => <PremiumAd len={len} trustAt={at("that is the roofer") - c.premium} image={premiumAd} />}</Scene>
      <Scene from={c.cheap} to={c.web}>{(len) => <CheapVsBest len={len} bestAt={at("The best one") - c.cheap} />}</Scene>
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
        {(len) => <NoTyreKickers len={len} secondAt={at("No time") - c.tyre} bookedAt={at("Just booked") - c.tyre} />}
      </Scene>
      <Scene from={c.cta} to={durationInFrames}>{(len) => <CTA len={len} badge={staticFile("brand/av-logo.png")} />}</Scene>

      <BigCaptions words={words} />
    </AbsoluteFill>
  );
};
