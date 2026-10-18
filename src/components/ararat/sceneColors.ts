// Three.js materials cannot resolve CSS custom properties; keep their palettes in one place.
// Scenes read the palette via useSceneColors(): a theme change only updates material colours in place.
// Maps directly to the Anthropic-inspired centralized design tokens:
// Slate Dark: #141413 | Ivory Medium: #f0eee6 | Ivory Light: #faf9f5 | Stone: #cccbc8 | Clay: #d97757
import { useTheme } from "./theme";

export const sceneColors = {
  background: "#141413",
  surface: "#1c1c1b",
  elevated: "#22211f",
  teal: "#d97757",
  tealLight: "#f5e3c7",
  white: "#faf9f5",
  secondary: "#b0aea5",
  deepBlue: "#c6613f",
};

export const sceneColorsLight: typeof sceneColors = {
  background: "#f0eee6",
  surface: "#faf9f5",
  elevated: "#e3dacc",
  teal: "#d97757",
  tealLight: "#f5e3c7",
  white: "#141413",
  secondary: "#87867f",
  deepBlue: "#c6613f",
};

export function useSceneColors() {
  return useTheme() === "light" ? sceneColorsLight : sceneColors;
}

// Section 07 roles mirror CSS and update materials without remounting.
export const coverageSceneColors = {
  light: { sphere: "#cccbc8", dots: "#d97757", marker: "#c6613f", sphereOpacity: 0.12, dotOpacity: 0.85, gridOpacity: 0.1 },
  dark: { sphere: "#1c1c1b", dots: "#d97757", marker: "#f5e3c7", sphereOpacity: 1, dotOpacity: 0.85, gridOpacity: 0.18 },
};
