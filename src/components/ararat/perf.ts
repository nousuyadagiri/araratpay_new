import { useEffect, useState, type RefObject } from "react";

/** WebGL is only allowed on wide, fine-pointer devices (no touch/tablet/phone). */
export const GL_QUERY = "(min-width: 1024px) and (pointer: fine)";

export function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const q = window.matchMedia(query);
    const sync = () => setMatch(q.matches);
    sync(); q.addEventListener("change", sync);
    return () => q.removeEventListener("change", sync);
  }, [query]);
  return match;
}

/** True while the element is within `margin` of the viewport. */
export function useNearView(ref: RefObject<Element | null>, margin = "100% 0px", once = false) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => {
      const hit = !!e?.isIntersecting;
      setNear(hit);
      if (hit && once) io.disconnect();
    }, { rootMargin: margin });
    io.observe(node);
    return () => io.disconnect();
  }, [ref, margin, once]);
  return near;
}

/* ---------- Single active WebGL canvas across the whole page ---------- */
type Slot = { el: Element; near: boolean; set: (v: boolean) => void };
const slots = new Set<Slot>();
let current: Slot | null = null;
let scheduled = 0;
function elect() {
  scheduled = 0;
  const mid = window.innerHeight / 2;
  let best: Slot | null = null, bestD = Infinity;
  for (const s of slots) {
    if (!s.near) continue;
    const r = s.el.getBoundingClientRect();
    const d = Math.abs(r.top + r.height / 2 - mid);
    if (d < bestD) { bestD = d; best = s; }
  }
  if (best === current) return;
  current?.set(false);
  current = best;
  best?.set(true);
}
const schedule = () => { if (!scheduled) scheduled = requestAnimationFrame(elect); };

/**
 * Returns true only for the single nearest registered scene that is within ~1 viewport,
 * and only on desktop fine-pointer devices. All other scenes stay unmounted.
 */
export function useWebGLSlot(ref: RefObject<Element | null>, enabled = true, query = GL_QUERY) {
  const allowed = useMedia(query);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed || !enabled) { setOn(false); return; }
    const slot: Slot = { el, near: false, set: setOn };
    slots.add(slot);
    const io = new IntersectionObserver(([e]) => { slot.near = !!e?.isIntersecting; schedule(); }, { rootMargin: "100% 0px", threshold: [0, .25, .5, .75, 1] });
    const tight = new IntersectionObserver(schedule, { threshold: [0, .25, .5, .75, 1] });
    io.observe(el); tight.observe(el);
    return () => {
      io.disconnect(); tight.disconnect(); slots.delete(slot);
      if (current === slot) { current = null; schedule(); }
      setOn(false);
    };
  }, [ref, allowed, enabled]);
  return on;
}

/** True when the element is on screen and the tab is visible — gate timers with this. */
export function useActiveInView(ref: RefObject<Element | null>, margin = "0px") {
  const near = useNearView(ref, margin);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    sync(); document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);
  return near && visible;
}

/** Ask ScrollTrigger (via SmoothScroll) for a debounced refresh after layout changes. */
export const requestLayoutRefresh = () => { if (typeof window !== "undefined") window.dispatchEvent(new Event("ararat:layout")); };
