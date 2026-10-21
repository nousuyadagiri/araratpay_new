import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSafeReducedMotion } from "./SectionBits";

export const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4";
export const HERO_POSTER_URL =
  "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp";

const rise = (_reduce: boolean, delay: number) => ({
  "data-rise": "",
  style: { "--rise-delay": `${delay}s` } as React.CSSProperties,
});

export default function HeroSection({ onAction }: { onAction: (name: string) => void }) {
  const reducedMotion = useSafeReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1279px)");
    const sync = () => setMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    setMounted(true);
    return () => query.removeEventListener("change", sync);
  }, []);
  const showVideo = mounted && !reducedMotion && !videoFailed;
  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!stage || !showVideo || !video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !document.hidden) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(stage);
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (observer) void video.play().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
    };
  }, [showVideo, mobile]);
  useEffect(() => {
    const stage = stageRef.current;
    const hero = heroRef.current;
    if (!stage || !hero || reducedMotion) return;
    let disposed = false;
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          const inset = () => (window.innerWidth < 768 ? 12 : window.innerWidth >= 1600 ? 32 : 24);
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: "top top",
              end: () => `+=${window.innerHeight * 0.7}`,
              pin: stage,
              pinSpacing: true,
              scrub: 0.25,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .to(
              hero,
              {
                clipPath: () =>
                  `inset(80px ${inset()}px 0px round ${window.innerWidth < 768 ? 20 : 28}px)`,
                ease: "none",
              },
              0,
            )
            .to(".cinema-content", { x: () => inset(), ease: "none" }, 0)
            .to(
              ".cinema-content h1",
              { scale: 0.9, transformOrigin: "left bottom", ease: "none" },
              0,
            );
        }, stage);
        cleanup = () => context.revert();
        window.dispatchEvent(new Event("ararat:layout"));
      },
    );
    return () => {
      disposed = true;
      cleanup();
    };
  }, [reducedMotion]);
  return (
    <>
      <div ref={stageRef} className="cinema-stage">
        <section id="top" ref={heroRef} className="cinema-hero">
          <div className="cinema-media" aria-hidden="true">
            <img
              src={HERO_POSTER_URL}
              alt=""
              className={`cinema-poster ${videoReady ? "is-hidden" : ""}`}
              loading="eager"
            />
            {showVideo && (
              <video
                ref={videoRef}
                className={`cinema-video ${videoReady ? "is-ready" : ""}`}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={HERO_POSTER_URL}
                onLoadedData={() => setVideoReady(true)}
                onPlaying={() => setVideoReady(true)}
                onError={() => {
                  setVideoReady(false);
                  setVideoFailed(true);
                }}
              >
                <source src={HERO_VIDEO_URL} type="video/mp4" />
              </video>
            )}
            <div className="cinema-shade" />
          </div>
          <div className="shell cinema-content">
            <div className="cinema-pill" {...rise(reducedMotion, 0)}>
              <span>One platform · four flows</span> <strong>Flat 1%</strong>
            </div>
            <h1 {...rise(reducedMotion, 0.08)}>
              Business payments,
              <br />
              powered by <mark className="headline-highlight">crypto</mark>.
            </h1>
            <p className="cinema-description" {...rise(reducedMotion, 0.18)}>
              Accept crypto, settle to your bank — all from one platform.
            </p>
            <div className="cinema-actions" {...rise(reducedMotion, 0.26)}>
              <Button
                variant="brand"
                size="hero"
                onClick={() => onAction("Start Accepting Payments")}
              >
                Start accepting payments <ArrowRight className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="hero"
                onClick={() => onAction("Explore Solutions")}
              >
                Explore solutions →
              </Button>
            </div>
            <p className="cinema-reassurance">
              No monthly subscription · Flat 1% processing fee · Instant setup
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
