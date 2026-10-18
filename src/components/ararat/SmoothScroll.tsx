import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

/**
 * One Lenis instance driven by gsap.ticker; ScrollTrigger updates on Lenis scroll.
 * Disabled on touch / coarse pointers and for prefers-reduced-motion (native scroll).
 * Also owns the single debounced ScrollTrigger.refresh for load, resize, fonts and lazy content.
 */
export function SmoothScroll() {
  const pathname = useLocation({ select: location => location.pathname });
  useEffect(() => {
    // Touch / narrow devices use native scroll and have no scroll-scrubbed scenes: skip gsap + Lenis entirely.
    if (!window.matchMedia("(min-width: 768px) and (pointer: fine)").matches) return;
    let disposed = false;
    let cleanup = () => {};
    const start = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      let timer = 0;
      const refresh = () => { window.clearTimeout(timer); timer = window.setTimeout(() => ScrollTrigger.refresh(), 250); };
      window.addEventListener("resize", refresh, { passive: true });
      window.addEventListener("load", refresh);
      window.addEventListener("ararat:layout", refresh);
      void document.fonts?.ready.then(refresh);
      let lenisCleanup = () => {};
      /* Lenis smooth scrolling disabled / commented out:
         Uncomment this block in the future if you wish to re-enable Lenis smooth scrolling.
      const smooth = pathname !== "/" && window.matchMedia("(pointer: fine) and (hover: hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !("ontouchstart" in window);
      if (smooth) {
        const { default: Lenis } = await import("lenis");
        if (disposed) return;
        const lenis = new Lenis({ lerp: .1, duration: 1.1, smoothWheel: true });
        (window as unknown as { __lenis?: unknown }).__lenis = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        lenisCleanup = () => { gsap.ticker.remove(tick); lenis.destroy(); delete (window as unknown as { __lenis?: unknown }).__lenis; };
      }
      */
      cleanup = () => {
        window.clearTimeout(timer);
        window.removeEventListener("resize", refresh); window.removeEventListener("load", refresh); window.removeEventListener("ararat:layout", refresh);
        lenisCleanup();
      };
    };
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const handle = idle ? idle(() => void start(), { timeout: 1500 }) : window.setTimeout(() => void start(), 600);
    return () => { disposed = true; if (!idle) window.clearTimeout(handle); cleanup(); };
  }, [pathname]);
  return null;
}

/** Scroll that goes through Lenis when active (keeps it in sync), native otherwise. */
export function smoothScrollTo(top: number, instant: boolean) {
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: { immediate?: boolean }) => void } }).__lenis;
  if (lenis) lenis.scrollTo(top, { immediate: instant });
  else window.scrollTo({ top, behavior: instant ? "instant" : "smooth" });
}
