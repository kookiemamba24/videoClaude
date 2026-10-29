import React from "react";
import { useVideoConfig } from "remotion";
import { Sfx, SfxEvent } from "../Ad/Sfx";
import type { Word } from "./Captions";
import { useOverlayCues } from "./Overlays";

// One cue per graphic beat, timed off the same spoken words as the visuals
// in Results, Scenes, LowerThird and Overlays.
export const VslSfx: React.FC<{ words: Word[] }> = ({ words }) => {
  const { fps } = useVideoConfig();
  const o = useOverlayCues(words, fps);
  const { at } = o;
  const s = (sec: number) => Math.round(sec * fps);

  const iSys = words.findIndex((w) => w.text.trim() === "system.");
  const results = ["Action Roofing", "Happy Roofing", "Braga Contracting", "Vista Roofing"].map((p) => at(p) - 6);
  const recap = at("These were real") - 6;
  const ten = at("And within about 10 seconds");

  const events: SfxEvent[] = [
    // Name tag + offer
    { at: s(0.6), name: "whoosh", volume: 0.7 },
    { at: at("We will get"), name: "whoosh" },
    ...[0, 6, 12, 18, 24].map((d) => ({ at: at("We will get") + 10 + d, name: "tick" as const, volume: 0.7 })),
    { at: at("or we work for free"), name: "confirm" },

    // Client results: card in, number lands, then the bars / ring / calendar
    ...results.flatMap((from) => [
      { at: from, name: "whoosh" as const },
      { at: from + 57, name: "coins" as const, volume: 1.1 },
      { at: from + 64, name: "coins-stack" as const },
    ]),
    ...[0, 1, 2, 3].map((i) => ({ at: recap + s(0.18 * i), name: "pop" as const, volume: 0.8 })),

    // What held them back: three strikes, then the real reason
    { at: at("So what was"), name: "whoosh" },
    { at: at("pricing.") + 6, name: "error", volume: 0.7 },
    { at: at("work.") , name: "error", volume: 0.7 },
    { at: at("ads.") + 4, name: "error", volume: 0.7 },
    { at: at("It was that they looked"), name: "success" },

    // Homeowner journey + 10-second countdown
    { at: at("When a homeowner"), name: "whoosh" },
    { at: at("They look at a few"), name: "pop" },
    { at: at("They scroll through"), name: "pop" },
    { at: at("They check a website"), name: "pop" },
    ...Array.from({ length: 10 }, (_, k) => ({ at: ten + k * 4.8, name: "tick" as const, volume: 0.8 })),

    // Not reviews / years
    { at: at("That decision is"), name: "whoosh" },
    { at: at("That decision is") + 14, name: "error", volume: 0.6 },
    { at: at("It is not based on how long") + 10, name: "error", volume: 0.6 },

    // Overlay: lookalike roofers + sticker
    { at: o.brand.from, name: "whoosh-big" },
    ...[4, 7, 10, 13].map((d) => ({ at: o.brand.from + d, name: "pop" as const, volume: 0.6 })),
    { at: o.brand.sticker, name: "slap", volume: 1.2 },

    // Overlay: feed of bad ads, then the leak list
    { at: o.feed.from, name: "whoosh-big" },
    { at: o.feed.scroll, name: "scroll" },
    { at: o.feed.to, name: "whoosh" },
    { at: o.feed.to + 8, name: "error", volume: 0.6 },
    { at: at("YOUR follow up") + 8, name: "error", volume: 0.6 },
    { at: at("They call the roofer"), name: "fall", volume: 0.8 },

    // The system diagram + its steps
    { at: at("And we do it three ways"), name: "whoosh" },
    { at: o.premium.from, name: "whoosh-big" },
    { at: o.premium.trust, name: "confirm" },
    { at: at("Not another generic"), name: "whoosh" },
    { at: at("Not another generic") + 16, name: "success", volume: 0.8 },
    { at: o.web.from, name: "whoosh-big" },
    { at: o.web.sites[1], name: "whoosh", volume: 0.8 },
    { at: o.web.sites[2], name: "whoosh", volume: 0.8 },
    { at: o.web.form, name: "card" },
    ...Array.from({ length: 22 }, (_, k) => ({ at: o.web.form + 8 + k * 3, name: "click" as const, volume: 1.4 })),
    { at: o.web.submit, name: "click", volume: 2.2 },
    { at: o.web.submit + 3, name: "success" },
    { at: o.follow.from, name: "whoosh-big" },
    { at: o.follow.contact, name: "notify" },
    ...[0, 6, 12].map((d) => ({ at: o.follow.qualify + d, name: "pop" as const, volume: 0.8 })),
    { at: o.follow.booked, name: "success" },
    { at: o.follow.to, name: "whoosh" },
    { at: at("Not an hour later"), name: "drop" },
    { at: at("Not the next morning"), name: "drop" },
    ...(iSys >= 0 ? [{ at: at("That is the system"), name: "success" as const }] : []),

    // Before / after chart
    { at: at("That is what took"), name: "whoosh" },
    { at: at("to predictable,"), name: "success", volume: 0.8 },

    // Overlay: leads flee
    { at: o.flee.from, name: "whoosh-big" },
    { at: o.flee.run + 2, name: "fall", volume: 0.9 },
    { at: o.flee.to - 6, name: "error", volume: 0.6 },

    // Guarantee seal + CTA
    { at: at("6-12 more booked", words.findIndex((w) => w.text.trim() === "choose")), name: "whoosh" },
    { at: at("And that is a guarantee"), name: "stamp", volume: 1.1 },
    { at: at("Book a free meeting") - 10, name: "whoosh" },
    { at: at("Book a free meeting"), name: "pop" },
  ];

  return <Sfx events={events} />;
};
