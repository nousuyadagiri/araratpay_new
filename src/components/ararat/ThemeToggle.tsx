import { Moon, Sun } from "lucide-react";
import { applyTheme, useTheme } from "./theme";

export function ThemeToggle({ className = "", withLabel = false }: { className?: string; withLabel?: boolean }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return <button type="button" className={`theme-toggle ${withLabel ? "theme-toggle--label" : ""} ${className}`} onClick={() => applyTheme(next)} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`}>
    <span className="theme-toggle-icons" aria-hidden="true"><Sun className="theme-icon-sun" size={16}/><Moon className="theme-icon-moon" size={16}/></span>
    {withLabel && <span suppressHydrationWarning>{theme === "dark" ? "Light theme" : "Dark theme"}</span>}
  </button>;
}
