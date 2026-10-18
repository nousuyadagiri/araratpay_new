import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSafeReducedMotion } from "./SectionBits";
// Previous hero section video assets:
// import heroMp4 from "@/assets/videos/client-clear1080.mp4.asset.json";
// import heroWebm from "@/assets/videos/client-clear1080.webm.asset.json";
// import heroSmallMp4 from "@/assets/videos/client-clear720.mp4.asset.json";
// import heroSmallWebm from "@/assets/videos/client-clear720.webm.asset.json";
import heroPoster from "@/assets/videos/client-clear-poster.webp.asset.json";

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
        <section id="top" ref={heroRef} className="cinema-hero" data-theme="dark">
          <div className="cinema-media" aria-hidden="true">
            {/* <img className={`cinema-poster ${videoReady && showVideo ? "is-hidden" : ""}`} src={heroPoster.url} alt="" fetchPriority="high" decoding="async" width={1920} height={1080}/> */}
            {/* Previous hero section video:
        {showVideo && <video key={mobile ? "720" : "1080"} ref={videoRef} className={`cinema-video ${videoReady ? "is-ready" : ""}`} autoPlay muted loop playsInline preload="auto" poster={heroPoster.url} onLoadedData={() => setVideoReady(true)} onPlaying={() => setVideoReady(true)} onError={() => { setVideoReady(false); setVideoFailed(true); }}>
          <source src={mobile ? heroSmallWebm.url : heroWebm.url} type="video/webm"/>
          <source src={mobile ? heroSmallMp4.url : heroMp4.url} type="video/mp4"/>
        </video>}
        */}

            <div className="absolute inset-0 bg-blue-500/10 z-10 pointer-events-none" />

            {/* Updated hero section video */}
            {showVideo && (
              <video
                ref={videoRef}
                className={`cinema-video ${videoReady ? "is-ready" : ""}`}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={heroPoster.url}
                onLoadedData={() => setVideoReady(true)}
                onPlaying={() => setVideoReady(true)}
                onError={() => {
                  setVideoReady(false);
                  setVideoFailed(true);
                }}
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
              </video>
            )}
            <div className="cinema-shade" />
          </div>
          <div className="shell cinema-content">
            <div className="cinema-pill" {...rise(reducedMotion, 0)}>
              One platform · four flows <span>Flat 1%</span>
            </div>
            <h1 {...rise(reducedMotion, 0.08)}>
              Business payments,
              <br />
              powered by crypto.
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
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
