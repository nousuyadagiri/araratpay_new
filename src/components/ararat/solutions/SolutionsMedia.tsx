import { useEffect, useRef, useState } from 'react';
import { useMedia } from '../perf';
import type { Industry } from './solutionsData';

let currentIndustryVideo: HTMLVideoElement | null = null;

export function SolutionsMedia({ industry, eager = false }: { industry: Industry; eager?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(eager);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const canPlay = useMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
  useEffect(() => { setReady(false); }, [industry.id]);
  useEffect(() => {
    const node = box.current; if (!node) return;
    const nearObserver = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setNear(true); }, { rootMargin: '80% 0px' });
    const viewObserver = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), { threshold: .2 });
    nearObserver.observe(node); viewObserver.observe(node);
    return () => { nearObserver.disconnect(); viewObserver.disconnect(); };
  }, []);
  useEffect(() => {
    const node = video.current; if (!node) return;
    const sync = () => {
      if (visible && canPlay && !document.hidden) { if (currentIndustryVideo && currentIndustryVideo !== node) currentIndustryVideo.pause(); currentIndustryVideo = node; void node.play().catch(() => undefined); }
      else { node.pause(); if (currentIndustryVideo === node) currentIndustryVideo = null; }
    };
    sync(); document.addEventListener('visibilitychange', sync);
    return () => { document.removeEventListener('visibilitychange', sync); node.pause(); if (currentIndustryVideo === node) currentIndustryVideo = null; };
  }, [canPlay, industry.id, near, visible]);
  return <div ref={box} className="solutions-media" aria-hidden="true">
    <img key={`${industry.id}-poster`} src={industry.film.poster} alt="" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined}/>
    {canPlay && near && <video key={industry.id} ref={video} className={ready ? 'is-ready' : ''} muted loop playsInline preload="none" poster={industry.film.poster} onPlaying={() => setReady(true)}><source src={industry.film.webm} type="video/webm"/><source src={industry.film.mp4} type="video/mp4"/></video>}
    <span/>
  </div>;
}