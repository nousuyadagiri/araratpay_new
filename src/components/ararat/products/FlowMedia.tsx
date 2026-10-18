import { useEffect, useRef, useState } from "react";
import { useMedia } from "../perf";

export type FlowFilm = {
  mp4: string;
  webm: string;
  poster: string;
  smallMp4?: string;
  smallWebm?: string;
};
let currentFilm: HTMLVideoElement | null = null;
export function FlowMedia({ film, eager = false }: { film: FlowFilm; eager?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(eager);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const canPlay = useMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
  useEffect(() => {
    if (!eager) return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = film.poster;
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
    return () => link.remove();
  }, [eager, film.poster]);
  useEffect(() => {
    if (!container.current) return;
    const node = container.current;
    const close = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setNear(true);
      },
      { rootMargin: "90% 0px" },
    );
    const view = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), {
      threshold: 0.25,
    });
    close.observe(node);
    view.observe(node);
    return () => {
      close.disconnect();
      view.disconnect();
    };
  }, []);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const sync = () => {
      if (visible && !document.hidden && canPlay) {
        if (currentFilm && currentFilm !== element) currentFilm.pause();
        currentFilm = element;
        void element.play().catch(() => undefined);
      } else {
        element.pause();
        if (currentFilm === element) currentFilm = null;
      }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      element.pause();
      if (currentFilm === element) currentFilm = null;
    };
  }, [visible, near, canPlay]);
  return (
    <div className="flow-film" ref={container} aria-hidden="true">
      <img
        src={film.poster}
        alt=""
        fetchPriority={eager ? "high" : undefined}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      {canPlay && near && (
        <video
          ref={video}
          className={ready ? "is-ready" : ""}
          muted
          loop
          playsInline
          preload="none"
          poster={film.poster}
          onPlaying={() => setReady(true)}
        >
          {film.smallWebm && (
            <source src={film.smallWebm} media="(max-width: 1279px)" type="video/webm" />
          )}
          {film.smallMp4 && (
            <source src={film.smallMp4} media="(max-width: 1279px)" type="video/mp4" />
          )}
          <source src={film.webm} type="video/webm" />
          <source src={film.mp4} type="video/mp4" />
        </video>
      )}
      <div className="flow-film-wash" />
    </div>
  );
}
