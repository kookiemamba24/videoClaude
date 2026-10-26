// Builds placeholder word timings from script/vsl-script.txt so the caption
// design can be previewed before the voiceover exists. Replace the output with
// real Whisper timings once the audio is recorded.
//
// Usage: node scripts/estimate-captions.mjs [targetSeconds]
import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targetMs = Number(process.argv[2] ?? 210) * 1000;

const SENTENCE_PAUSE = 2.2; // in units of an average word
const PARAGRAPH_PAUSE = 4;

const paragraphs = readFileSync(resolve(root, "script/vsl-script.txt"), "utf8")
  .split(/\n\s*\n/)
  .map((p) => p.split(/\s+/).filter(Boolean))
  .filter((p) => p.length > 0);

// Weight each word by its length; pauses after sentences and paragraphs.
const tokens = [];
for (const words of paragraphs) {
  words.forEach((w, i) => {
    const isLast = i === words.length - 1;
    const endsSentence = /[.!?]$/.test(w);
    tokens.push({
      word: w,
      weight: 0.55 + w.replace(/[^\w$]/g, "").length * 0.09,
      pause: isLast ? PARAGRAPH_PAUSE : endsSentence ? SENTENCE_PAUSE : /,$/.test(w) ? 0.8 : 0,
    });
  });
}
// Attach standalone dashes to the previous word.
const merged = [];
for (const t of tokens) {
  if (t.word === "-" && merged.length) {
    merged[merged.length - 1].word += " -";
    merged[merged.length - 1].pause += 1;
  } else {
    merged.push(t);
  }
}

const avg = merged.reduce((s, t) => s + t.weight, 0) / merged.length;
const units = merged.reduce((s, t) => s + t.weight + t.pause * avg, 0);
const msPerUnit = targetMs / units;

let cursor = 0;
const captions = merged.map((t, i) => {
  const startMs = Math.round(cursor);
  cursor += t.weight * msPerUnit;
  const endMs = Math.round(cursor);
  cursor += t.pause * avg * msPerUnit;
  return {
    text: (i === 0 ? "" : " ") + t.word,
    startMs,
    endMs,
    timestampMs: Math.round((startMs + endMs) / 2),
    confidence: null,
    // Paragraph boundaries force a new caption page.
    paragraphEnd: t.pause === PARAGRAPH_PAUSE,
  };
});

const out = resolve(root, "src/VSL/captions.json");
writeFileSync(out, JSON.stringify(captions, null, 1));
console.log(
  `${captions.length} words, ${(cursor / 1000).toFixed(1)}s, ` +
    `${Math.round(captions.length / (cursor / 60000))} wpm -> ${out}`,
);
