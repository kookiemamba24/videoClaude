import type { Word } from "./Captions";

const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9$]/g, "");

// Finds a spoken phrase (one or more words) at or after word index `after`.
export const makeCue = (words: Word[], fps: number) => {
  const find = (phrase: string, after = 0) => {
    const parts = phrase.split(" ").map(norm);
    for (let i = after; i < words.length - parts.length + 1; i++) {
      if (parts.every((p, k) => norm(words[i + k].text) === p)) return i;
    }
    throw new Error(`Phrase "${phrase}" not found in captions`);
  };
  const frameOf = (i: number) => Math.round((words[i].startMs / 1000) * fps);
  return { find, frameOf };
};
