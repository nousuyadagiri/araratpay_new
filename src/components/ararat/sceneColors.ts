// Three.js materials cannot resolve CSS custom properties; keep their palettes in one place.
// Scenes read the palette via useSceneColors(): a theme change only updates material colours in place.
// Maps directly to the SayBriefly creative sketchbook centralized design tokens:
// Forest Ink: #1A3300 | Cream Paper: #FCFAF5 | Highlighter Yellow: #FFE95C | Pencil Gray: #B6B6B6
import { useTheme } from "./theme";

export const sceneColors = {
  background: "#0F1707",
  surface: "#17240C",
  elevated: "#1F3010",
  teal: "#FFE95C",
  tealLight: "#D5F5C2",
  white: "#FCFAF5",
  secondary: "#A3B592",
  deepBlue: "#FFE95C",
};

export const sceneColorsLight: typeof sceneColors = {
  background: "#FCFAF5",
  surface: "#FCFAF5",
  elevated: "#F1F1F1",
  teal: "#1A3300",
  tealLight: "#FFE95C",
  white: "#1A3300",
  secondary: "#4D6038",
  deepBlue: "#122400",
};

export function useSceneColors() {
  return useTheme() === "light" ? sceneColorsLight : sceneColors;
}

// Section 07 roles mirror CSS and update materials without remounting.
export const coverageSceneColors = {
  light: { sphere: "#B6B6B6", dots: "#1A3300", marker: "#CB5521", sphereOpacity: 0.15, dotOpacity: 0.9, gridOpacity: 0.12 },
  dark: { sphere: "#17240C", dots: "#FFE95C", marker: "#D5F5C2", sphereOpacity: 1, dotOpacity: 0.85, gridOpacity: 0.18 },
};
