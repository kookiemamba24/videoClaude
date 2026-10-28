import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Vertical social ad: same blue accent as the VSL, Inter for the punchy
// TikTok-style captions.
export const adTheme = {
  font: "Inter",
  accent: "#4da3ff",
  accentDeep: "#2a6fd6",
  accentRgb: "77, 163, 255",
  neg: "#ff5a4a",
  text: "#f6f4ef",
  // Vertical centre of the caption line (frame is 1080x1920).
  captionY: 1615,
} as const;

export const accent = (a: number) => `rgba(${adTheme.accentRgb}, ${a})`;
export const negA = (a: number) => `rgba(255, 90, 74, ${a})`;

loadFont({ family: adTheme.font, url: staticFile("fonts/Inter.woff2"), weight: "100 900" });
