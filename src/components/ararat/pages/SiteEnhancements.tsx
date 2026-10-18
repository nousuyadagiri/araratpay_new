import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useSafeReducedMotion } from "../SectionBits";
import { SmoothScroll } from "../SmoothScroll";
import { SectionBands } from "../SectionBands";
export function SiteEnhancements() {
  const [choice, setChoice] = useState<string | null>(null);
 const [glow, setGlow] = useState(false);
 const glowRef = useRef<HTMLDivElement>(null);
 const reduce = useSafeReducedMotion();
 useEffect(() => { setChoice(window.localStorage.getItem("ararat-cookie-choice")); }, []);
 useEffect(() => {
  if (reduce || !window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;
  setGlow(true);
  let frame = 0, x = -500, y = -500;
  const paint = () => { frame = 0; const el = glowRef.current; if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`; };
  const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; if (!frame) frame = requestAnimationFrame(paint); };
  window.addEventListener("pointermove", move, { passive: true });
  return () => { cancelAnimationFrame(frame); window.removeEventListener("pointermove", move); setGlow(false); };
 }, [reduce]);
 const choose = (value: string) => { window.localStorage.setItem("ararat-cookie-choice", value); document.documentElement.classList.add("cookie-chosen"); setChoice(value); };
 return <><SectionBands/><SmoothScroll/>{!choice && <aside className="cookie-banner" aria-label="Cookie preferences"><strong>Your privacy matters.</strong><p>This preview uses essential browser storage for your cookie choice. Optional analytics are not active.</p><div className="cookie-actions"><Button variant="brand" onClick={() => choose("accept")}>Accept</Button><Button variant="glass" onClick={() => choose("essential")}>Essential only</Button><Button variant="ghost" asChild><Link to="/legal/$slug" params={{ slug: "cookies" }}>Policy</Link></Button></div></aside>}{glow && <div ref={glowRef} className="cursor-glow" aria-hidden="true" style={{ left: 0, top: 0, transform: "translate3d(-500px,-500px,0)" }}/>}</>;
}
