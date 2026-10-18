import { useSyncExternalStore } from "react";

export type Theme = "dark" | "light";
export const THEME_KEY = "ararat-theme";
export const THEME_COLORS: Record<Theme, string> = { dark: "#141413", light: "#f0eee6" };

/** Runs inline in <head> before first paint: sets data-theme + theme-color, no flash. */
export const THEME_BOOT = `try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='light'&&t!=='dark')t='light';document.documentElement.dataset["theme"]=t;if(t==='dark')document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');var m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='dark'?'${THEME_COLORS.dark}':'${THEME_COLORS.light}'}catch(e){document.documentElement.dataset["theme"]='light'}`;

const read = (): Theme => (document.documentElement.dataset["theme"] === "dark" ? "dark" : "light");

function subscribe(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  // Follow the system setting until the visitor makes an explicit choice.
  const media = matchMedia("(prefers-color-scheme: dark)");
  const onSystem = () => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch { /* storage blocked */ }
    if (!stored) applyTheme(media.matches ? "dark" : "light", false);
  };
  media.addEventListener("change", onSystem);
  return () => { observer.disconnect(); media.removeEventListener("change", onSystem); };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "light");
}

let animTimer: ReturnType<typeof setTimeout> | undefined;
export function applyTheme(theme: Theme, persist = true) {
  const root = document.documentElement;
  // Colour transition only while switching; never on page load.
  root.classList.add("theme-anim");
  clearTimeout(animTimer);
  animTimer = setTimeout(() => root.classList.remove("theme-anim"), 320);
  root.dataset["theme"] = theme;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
  if (persist) { try { localStorage.setItem(THEME_KEY, theme); } catch { /* storage blocked */ } }
}
