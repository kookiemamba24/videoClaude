"""Force-align script/vsl-transcript.txt to the voiceover and write word
timings for the captions.

  ffmpeg -i Hero_VSL.mp4 -ac 1 -ar 16000 -f s16le audio.raw
  pip install pocketsphinx
  python scripts/align-captions.py script/vsl-transcript.txt audio.raw src/VSL/captions.json

The transcript must match what was actually said; alignment fails if lines
were skipped or added.
"""
import json, re, sys
from pocketsphinx import Decoder

SPOKEN = {
    "$20,000": "twenty thousand dollars", "6-12": "six to twelve", "90": "ninety",
    "$190,000": "one hundred ninety thousand dollars", "$3,200": "three thousand two hundred dollars",
    "$1.2M": "one point two million", "70": "seventy", "$150,000": "one hundred fifty thousand dollars",
    "$96,000": "ninety six thousand dollars", "10": "ten", "30": "thirty", "$118,000": "one hundred eighteen thousand dollars", "60": "sixty",
}
EXTRA = {"braga": "B R AA G AH", "plateaued": "P L AE T OW D", "mid": "M IH D",
         "facebook": "F EY S B UH K", "website": "W EH B S AY T", "tyre": "T AY ER"}

transcript, raw_path, out_path = sys.argv[1:4]
paras = [p.split() for p in re.split(r"\n\s*\n", open(transcript).read()) if p.strip()]
tokens = []  # (display, [spoken words], paragraphEnd)
for words in paras:
    for i, w in enumerate(words):
        core = w.rstrip(".,!?")
        spoken = SPOKEN.get(core) or re.sub(r"[^a-z' ]", "", core.lower().replace("-", " "))
        tokens.append((w, spoken.split(), i == len(words) - 1))

dec = Decoder(samprate=16000, bestpath=False, beam=1e-120, wbeam=1e-100, pbeam=1e-120)
for w, ph in EXTRA.items():
    if dec.lookup_word(w) is None:
        dec.add_word(w, ph, update=True)
flat = [s for _, sp, _ in tokens for s in sp]
oov = sorted({s for s in flat if dec.lookup_word(s) is None})
if oov:
    sys.exit(f"OOV: {oov}")

dec.set_align_text(" ".join(flat))
dec.start_utt()
dec.process_raw(open(raw_path, "rb").read(), full_utt=True)
dec.end_utt()
segs = [s for s in dec.seg() if s.word not in ("<s>", "</s>", "<sil>") and not s.word.startswith("[")]
segs = [s for s in segs if s.word != "(NULL)"]
assert len(segs) == len(flat), (len(segs), len(flat))

out, k = [], 0
for disp, sp, pend in tokens:
    group = segs[k:k + len(sp)]; k += len(sp)
    start, end = group[0].start_frame * 10, (group[-1].end_frame + 1) * 10
    out.append({"text": (" " if out else "") + disp, "startMs": start, "endMs": end,
                "timestampMs": (start + end) // 2, "confidence": None, "paragraphEnd": pend})
json.dump(out, open(out_path, "w"), indent=1)
print(f"aligned {len(out)} words, last ends {out[-1]['endMs']/1000:.1f}s")
