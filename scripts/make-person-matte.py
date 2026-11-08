"""Cut the speaker out of a clip so text can sit *behind* them.

Writes a transparent WebM (VP9 + alpha) containing only the person, frame-
aligned with the source, for use as a top layer in Remotion:

  <OffthreadVideo src={staticFile("footage/x-person.webm")} transparent />

Setup (once):
  python3 -m venv .venv-matte && .venv-matte/bin/pip install mediapipe
  curl -L -o selfie_multiclass.tflite https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite
  (Linux needs libegl1: apt-get install -y libegl1)

Usage:
  .venv-matte/bin/python scripts/make-person-matte.py MODEL IN.mp4 OUT.webm [start_s] [duration_s]
"""
import os
import subprocess
import sys
import tempfile

import mediapipe as mp
import numpy as np
from mediapipe.tasks.python import BaseOptions, vision
from PIL import Image, ImageFilter

model, src, out = sys.argv[1:4]
start = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
dur = float(sys.argv[5]) if len(sys.argv) > 5 else None

fps = subprocess.check_output(
    ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", src],
    text=True,
).strip()

seg = vision.ImageSegmenter.create_from_options(
    vision.ImageSegmenterOptions(base_options=BaseOptions(model_asset_path=model), output_confidence_masks=True)
)

with tempfile.TemporaryDirectory() as tmp:
    cmd = ["ffmpeg", "-v", "error", "-ss", str(start), "-i", src]
    if dur:
        cmd += ["-t", str(dur)]
    subprocess.run(cmd + [os.path.join(tmp, "f%05d.png")], check=True)
    frames = sorted(f for f in os.listdir(tmp) if f.endswith(".png"))
    prev = None
    for name in frames:
        path = os.path.join(tmp, name)
        r = seg.segment(mp.Image.create_from_file(path))
        person = 1 - np.squeeze(r.confidence_masks[0].numpy_view())
        # Light temporal smoothing keeps the edge from shimmering.
        if prev is not None:
            person = 0.65 * person + 0.35 * prev
        prev = person
        alpha = Image.fromarray((np.clip((person - 0.3) / 0.4, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
        rgba = Image.open(path).convert("RGBA")
        rgba.putalpha(alpha)
        rgba.save(path)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-framerate", fps, "-i", os.path.join(tmp, "f%05d.png"),
         "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "4M", "-auto-alt-ref", "0", out],
        check=True,
    )
print(f"wrote {out} ({len(frames)} frames)")
