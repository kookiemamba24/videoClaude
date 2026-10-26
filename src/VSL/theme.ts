import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Roofing brand system: deep slate, warm amber accent (safety gear, sunlit
// shingles), sturdy condensed-feel sans. Change ACCENT once to rebrand.
export const theme = {
  bg: "#0e1116",
  panel: "rgba(14, 17, 22, 0.62)",
  border: "rgba(255, 255, 255, 0.10)",
  text: "#f6f4ef",
  muted: "rgba(246, 244, 239, 0.42)",
  accent: "#f5a524",
  font: "Barlow",
} as const;

for (const weight of ["600", "700", "800"]) {
  loadFont({
    family: theme.font,
    url: staticFile(`fonts/Barlow-${weight}.woff2`),
    weight,
  });
}
