import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import type { Word } from "../VSL/Captions";
import { adTheme } from "./adTheme";

type Page = { words: Word[]; startMs: number; endMs: number };

const MAX_WORDS = 3;

// Short punchy pages (≤3 words) for vertical social video.
const toPages = (words: Word[]): Page[] => {
  const pages: Page[] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const t = w.text.trim();
    if (!next || w.paragraphEnd || cur.length >= MAX_WORDS || /[.,!?:]$/.test(t) || next.startMs - w.endMs > 300) {
      pages.push({
        words: cur,
        startMs: cur[0].startMs,
        endMs: next ? Math.min(next.startMs, w.endMs + 400) : w.endMs + 600,
      });
      cur = [];
    }
  });
  return pages;
};

const isEmphasis = (t: string) => /\d/.test(t) || /^[A-Z]{2,}[^a-z]*$/.test(t);
const display = (t: string) => (/^(YOU|YOUR)\b/.test(t.trim()) ? t.toLowerCase() : t);

const PageView: React.FC<{ page: Page }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;
  return (
    <AbsoluteFill style={{ alignItems: "center", top: adTheme.captionY - 960 }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            maxWidth: 940,
            textAlign: "center",
            fontFamily: adTheme.font,
            fontWeight: 800,
            fontSize: 92,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
          }}
        >
          {page.words.map((w, i) => {
            // Each word pops in as it's spoken.
            const local = ((w.startMs - page.startMs) / 1000) * fps;
            const p = interpolate(frame, [local - 1, local + 4], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.back(2)),
            });
            const emph = isEmphasis(w.text.trim());
            const text = display(i === 0 ? w.text.trimStart() : w.text);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  color: emph ? adTheme.accent : "#fff",
                  opacity: nowMs >= w.startMs - 40 ? Math.min(1, p * 1.5) : 0,
                  scale: String(0.75 + 0.25 * p),
                  textShadow: "0 4px 20px rgba(0,0,0,0.55), 0 2px 4px rgba(0,0,0,0.4)",
                }}
              >
                {text}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const BigCaptions: React.FC<{ words: Word[] }> = ({ words }) => {
  const { fps } = useVideoConfig();
  const pages = useMemo(() => toPages(words), [words]);
  return (
    <AbsoluteFill>
      {pages.map((p, i) => {
        const from = Math.round((p.startMs / 1000) * fps);
        const to = Math.round((p.endMs / 1000) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} layout="none">
            <PageView page={p} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
