import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "./theme";

export type Word = {
  text: string;
  startMs: number;
  endMs: number;
  paragraphEnd?: boolean;
};

type Page = { words: Word[]; startMs: number; endMs: number };

const MAX_WORDS = 7;
const LINGER_MS = 500;

// Split the word stream into short caption pages, breaking on sentence ends,
// paragraph ends, longer pauses, or when a page gets too long.
const toPages = (words: Word[]): Page[] => {
  const pages: Page[] = [];
  let current: Word[] = [];
  words.forEach((w, i) => {
    current.push(w);
    const next = words[i + 1];
    const t = w.text.trim();
    const breakHere =
      !next ||
      w.paragraphEnd ||
      current.length >= MAX_WORDS ||
      /[.!?]$/.test(t) ||
      (/[,-]$/.test(t) && current.length >= 4) ||
      next.startMs - w.endMs > 450;
    if (breakHere) {
      pages.push({
        words: current,
        startMs: current[0].startMs,
        endMs: next ? Math.min(next.startMs, w.endMs + LINGER_MS) : w.endMs + LINGER_MS,
      });
      current = [];
    }
  });
  return pages;
};

// ALL-CAPS words (YOU, YOUR, NOT) and figures get the accent color.
const isEmphasis = (t: string) =>
  /\d/.test(t) || (/^[A-Z]{2,}[^a-z]*$/.test(t) && t !== "M");

const display = (t: string) =>
  /^(YOU|YOUR|NOT)\b/.test(t.trim()) ? t.toLowerCase() : t;

const CaptionPage: React.FC<{ page: Page }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;
  const inP = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 72 }}>
      <div
        style={{
          maxWidth: 1240,
          padding: "22px 40px 26px",
          borderRadius: 24,
          background: theme.panel,
          border: `1px solid ${theme.border}`,
          backdropFilter: "blur(18px)",
          boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
          textAlign: "center",
          fontFamily: theme.font,
          fontWeight: 700,
          fontSize: 58,
          lineHeight: 1.16,
          letterSpacing: "-0.005em",
          opacity: inP,
          translate: `0 ${(1 - inP) * 16}px`,
        }}
      >
        {page.words.map((w, i) => {
          const spoken = nowMs >= w.startMs;
          const active = spoken && nowMs < w.endMs + 80;
          const emph = isEmphasis(w.text.trim());
          return (
            <span
              key={i}
              style={{
                color: spoken ? (emph ? theme.accent : theme.text) : theme.muted,
                textShadow: spoken && emph ? "0 0 22px rgba(245,165,36,0.45)" : undefined,
                display: "inline-block",
                whiteSpace: "pre",
                translate: active ? "0 -3px" : "0 0",
              }}
            >
              {display(i === 0 ? w.text.trimStart() : w.text)}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const { fps } = useVideoConfig();
  const pages = useMemo(() => toPages(words), [words]);
  return (
    <AbsoluteFill>
      {pages.map((p, i) => {
        const from = Math.round((p.startMs / 1000) * fps);
        const to = Math.round((p.endMs / 1000) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} layout="none">
            <CaptionPage page={p} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
