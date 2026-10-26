import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Roofing brand system: deep slate, trust-blue accent that pairs with the
// silver Alvolution badge, sturdy signage-style sans. Change accent +
// accentRgb together to rebrand.
export const theme = {
  bg: "#0e1116",
  panel: "rgba(12, 15, 20, 0.74)",
  border: "rgba(255, 255, 255, 0.10)",
  text: "#f6f4ef",
  muted: "rgba(246, 244, 239, 0.42)",
  accent: "#4da3ff",
  accentRgb: "77, 163, 255",
  accentDeep: "#2a6fd6",
  font: "Barlow",
} as const;

export const accentA = (alpha: number) => `rgba(${theme.accentRgb}, ${alpha})`;

for (const weight of ["600", "700", "800"]) {
  loadFont({
    family: theme.font,
    url: staticFile(`fonts/Barlow-${weight}.woff2`),
    weight,
  });
}
