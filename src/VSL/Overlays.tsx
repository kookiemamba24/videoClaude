import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  FollowUpPhone,
  FullContext,
  LaptopSites,
  LeadsFleeFull,
  PremiumAd,
  SameRoofers,
  ScrollThenHaggle,
} from "../Ad/Graphics";
import type { Word } from "./Captions";
import { AdSpammer, WalkingCrowd } from "./StickFigures";
import { makeCue } from "./cue";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The ad's graphics are laid out on a 1080x1920 portrait canvas. Here that
// canvas is cropped to the rows [y0, y1] the graphic uses, scaled to fit
// above the caption box, and centred on a full-bleed blue cutaway.
const PortraitOverlay: React.FC<{
  len: number;
  y0: number;
  y1: number;
  // Optional fixed scale (e.g. to leave room below for a landscape layer).
  k?: number;
  landscape?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ len, y0, y1, k: kFixed, landscape, children }) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [0, 7], [0, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const out = interpolate(frame, [len - 6, len], [0, 1], clamp);
  const k = kFixed ?? Math.min(0.95, 850 / (y1 - y0));
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse 70% 80% at 50% 10%, #0b47c9 0%, #072a7a 40%, #031029 75%, #01040c 100%)",
        opacity: inP * (1 - out),
        scale: String(1.05 - 0.05 * inP),
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          left: (1920 - 1080 * k) / 2,
          top: 24 - y0 * k,
          scale: String(k),
          transformOrigin: "0 0",
        }}
      >
        <FullContext.Provider value>{children}</FullContext.Provider>
      </div>
      {landscape}
    </AbsoluteFill>
  );
};

const Cut: React.FC<{
  from: number;
  to: number;
  y0: number;
  y1: number;
  k?: number;
  landscape?: (len: number) => React.ReactNode;
  children?: (len: number) => React.ReactNode;
}> = ({ from, to, y0, y1, k, landscape, children }) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none">
    <PortraitOverlay len={to - from} y0={y0} y1={y1} k={k} landscape={landscape?.(to - from)}>
      {children?.(to - from)}
    </PortraitOverlay>
  </Sequence>
);

// Full-screen cutaways at the VSL's key beats, reusing the ad's graphics.
export const useOverlayCues = (words: Word[], fps: number) => {
  const { find, frameOf } = makeCue(words, fps);
  const at = (phrase: string, after = 0) => frameOf(find(phrase, after));
  const iEnd = find("The only question");
  return {
    at,
    brand: { from: at("It is based on how"), to: at("So you think"), sticker: at("every other roofer showing"), leave: at("showing up in front") },
    spam: { from: at("So you think"), to: at("The problem is"), rage: at("but it's NOT") },
    feed: { from: at("The problem is"), to: at("YOUR website looks"), scroll: at("running cheap") },
    premium: { from: at("First, we build"), to: at("Not another generic"), trust: at("obvious choice") },
    web: {
      from: at("Second,"),
      to: at("Third,"),
      sites: [at("Second,"), at("website that"), at("does the selling")],
      form: at("Built specifically"),
      submit: at("decision is already made"),
    },
    follow: { from: at("Third,"), to: at("Not an hour later"), contact: at("contacts"), qualify: at("within 30 seconds"), booked: at("filling out a form") },
    flee: { from: at("or whether they scroll", iEnd), to: at("We make sure"), run: at("scroll past", iEnd) },
  };
};

export const Overlays: React.FC<{ words: Word[]; fps: number }> = ({ words, fps }) => {
  const c = useOverlayCues(words, fps);
  return (
    <>
      <Cut
        from={c.brand.from}
        to={c.brand.to}
        y0={540}
        y1={1290}
        k={0.7}
        landscape={() => <WalkingCrowd leaveAt={c.brand.leave - c.brand.from} />}
      >
        {(len) => <SameRoofers len={len} stickerAt={c.brand.sticker - c.brand.from} />}
      </Cut>
      <Cut from={c.spam.from} to={c.spam.to} y0={0} y1={1920} landscape={() => <AdSpammer rageAt={c.spam.rage - c.spam.from} />} />
      <Cut from={c.feed.from} to={c.feed.to} y0={540} y1={1520}>
        {/* Scroll only: the call/haggle beat is pushed past the end. */}
        {(len) => <ScrollThenHaggle len={len} scrollAt={c.feed.scroll - c.feed.from} callAt={len + 999} beatAt={len + 999} />}
      </Cut>
      <Cut from={c.premium.from} to={c.premium.to} y0={540} y1={1520}>
        {(len) => <PremiumAd len={len} trustAt={c.premium.trust - c.premium.from} video={staticFile("ads/premium-ad.mp4")} />}
      </Cut>
      <Cut from={c.web.from} to={c.web.to} y0={130} y1={1420}>
        {(len) => (
          <LaptopSites
            len={len}
            siteAt={c.web.sites.map((f) => f - c.web.from)}
            formAt={c.web.form - c.web.from}
            submitAt={c.web.submit - c.web.from}
          />
        )}
      </Cut>
      <Cut from={c.follow.from} to={c.follow.to} y0={540} y1={1560}>
        {(len) => (
          <FollowUpPhone
            len={len}
            contactAt={c.follow.contact - c.follow.from}
            qualifyAt={c.follow.qualify - c.follow.from}
            bookedAt={c.follow.booked - c.follow.from}
          />
        )}
      </Cut>
      <Cut from={c.flee.from} to={c.flee.to} y0={450} y1={1420}>
        {(len) => <LeadsFleeFull len={len} fleeAt={c.flee.run - c.flee.from} />}
      </Cut>
    </>
  );
};
