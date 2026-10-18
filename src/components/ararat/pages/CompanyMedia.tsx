import { useEffect, useRef, useState } from 'react';
import { useMedia } from '../perf';
import { companyVideos } from './companyMediaData';

type VideoName = keyof typeof companyVideos;
let currentVideo: HTMLVideoElement | null = null;

export function CompanyMedia({ name, eager = false }: { name: VideoName; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(eager);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const canPlay = useMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
  const media = companyVideos[name];
  useEffect(() => {
    const node = container.current;
    if (!node) return;
    const nearObserver = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setNear(true); }, { rootMargin: '90% 0px' });
    const viewObserver = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), { threshold: .25 });
    nearObserver.observe(node); viewObserver.observe(node);
    return () => { nearObserver.disconnect(); viewObserver.disconnect(); };
  }, []);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const sync = () => {
      if (visible && !document.hidden && canPlay) {
        if (currentVideo && currentVideo !== video) currentVideo.pause();
        currentVideo = video;
        void video.play().catch(() => undefined);
      } else { video.pause(); if (currentVideo === video) currentVideo = null; }
    };
    sync(); document.addEventListener('visibilitychange', sync);
    return () => { document.removeEventListener('visibilitychange', sync); video.pause(); if (currentVideo === video) currentVideo = null; };
  }, [canPlay, near, visible]);
  return <div className="company-media" ref={container} aria-hidden="true">
    <img src={media.poster} alt="" className="company-media-poster" fetchPriority={eager ? 'high' : undefined}/>
    {canPlay && near && <video ref={ref} className={ready ? 'is-ready' : ''} muted playsInline loop preload="none" poster={media.poster} onPlaying={() => setReady(true)}><source src={media.webm} type="video/webm"/><source src={media.mp4} type="video/mp4"/></video>}
    <div className="company-media-wash"/>
  </div>;
}