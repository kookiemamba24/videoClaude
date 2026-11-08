---
name: tradie-ad-style
description: Edit a vertical talking-head ad in the "tradie" style (Paul / Tradie Content reference) — small chest captions, giant keywords behind the speaker, black topographic kinetic-type cards, sticker pops, punch-in jump cuts. Use when asked for this style, the "tradie style", or "the Paul style".
---

# Tradie ad style

Reference: a 70s vertical lead-form ad ("Hey tradies, listen up"). Fast,
loud, playful, readable on mute. Components live in `src/TradieStyle/kit.tsx`;
`src/TradieStyle/TradieDemo.tsx` is a worked example.

## The look, in order of importance

1. **Small chest captions** — `ChestCaptions`. 1–3 words, ALL CAPS,
   Montserrat 800, white with soft shadow, centred at chest height (just
   below the chin, never on the mouth). They pop in with a quick blur-scale.
   Hide them while a hook, black card or offer card owns the frame.
2. **Giant keywords behind the speaker** — `KeywordSlam` drawn *between*
   `PunchFootage` and `PersonLayer`. One or two words, Montserrat 900 at
   200–250px (or Barlow Condensed 800 italic for an accent word), white or
   yellow `#ffd21f`, near the top of frame so the head overlaps them. Use on
   the emotional/key word of a sentence ("BURNED", "YOUR MONEY", "BUT
   THEY'RE NOT"). Needs a person cut-out (see below).
3. **Black topographic cards** — `BlackCard`. Full-screen black with faint
   contour lines; 2–4 rows of mixed type that pop in word-by-word with a
   glow: small Montserrat label, big white Montserrat 900, yellow Montserrat
   900, condensed yellow italic, and a lowercase serif (Cormorant) for small
   joining words ("they", "you", "they need"). Use for the "problem" beats
   and contrasts ("THE PROBLEM ISN'T…", "OR", "AND TO MAKE THEM ACTUALLY
   WANT TO…"). Often one emoji/3D sticker under the words.
4. **Hook title** — `StackedHook`: yellow small line over a bigger white
   line, italic tag under; first 1–2 seconds, top of frame, in front of the
   speaker.
5. **Stickers** — `Sticker` (emoji / 3D icon) popping with overshoot and a
   gentle wobble next to the speaker: 🔥 💸 👻 👎 📈 🌍, social icons, a
   hard-hat cartoon. One at a time, beside the body, never over the face.
6. **Punch-in jump cuts** — `PunchFootage` + `PersonLayer` with the same
   `cuts` list: alternate 1.0× / ~1.14× at sentence or phrase boundaries,
   3-frame zoom-blur kick on each cut, plus a whoosh.
7. **Offer / lead-magnet card** — `OfferCard`: white card with heavy black
   title on a yellow highlighter stripe and a small italic subline, held at
   chest height. For the freebie, guarantee or headline proof.
8. **SFX** on every pop: whoosh on cuts, slap on keywords, pop on stickers,
   coins on money, error/fall on negatives, success on proof.

Pacing: something changes every 1–2 seconds. Roughly 60% talking head with
captions, 25% keyword slams/stickers, 15% black cards.

## Person cut-out (text behind the speaker)

`scripts/make-person-matte.py` runs MediaPipe selfie segmentation per frame
and writes a transparent VP9 WebM of just the person, used by `PersonLayer`.
Setup and usage are in the script's docstring. It is CPU-heavy (~30s of
compute per second of 30fps video), so only cut out the sections that
actually use keyword slams.

## Fonts

Bundled in `public/fonts`: Montserrat 700/800/900 (+800 italic), Barlow
Condensed 800 italic, Cormorant 600. Emoji use the system Noto Color Emoji.

## Brand

Alvolution brand blue (`T.accent`, `#4da3ff`) replaces the reference's
yellow everywhere — keyword accents, card highlights, caption highlights,
calendar fills. Keep it consistent with the other ads; don't reintroduce
yellow. Open on captions, not a title: the first chunk ("ROOFERS,") is shown
large in blue, then normal chest captions follow. Captions must match the
script; where the recording differs from the script, caption what was said
and flag it.
