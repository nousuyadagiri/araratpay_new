import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import AraratLogo from "@/components/ararat/AraratLogo";
import film from "@/assets/hero-review/hero-review-crisp-v11.mp4.asset.json";
import webm from "@/assets/hero-review/hero-review-crisp-v11.webm.asset.json";
import small from "@/assets/hero-review/hero-review-crisp-v11-small.mp4.asset.json";
import smallWebm from "@/assets/hero-review/hero-review-crisp-v11-small.webm.asset.json";
import poster from "@/assets/hero-review/hero-review-crisp-v11-poster.webp.asset.json";
import { FilmScreens } from "@/components/ararat/FilmScreens";
import "@/components/ararat/hero-film-review.css";

export const Route = createFileRoute("/hero-film-review")({
  head: () => ({ meta: [
    { title: "Hero film review — Araratpay" },
    { name: "description", content: "Review the four-scene Araratpay cinematic payment film before approval." },
    { name: "robots", content: "noindex, nofollow, noarchive" },
    { property: "og:title", content: "Hero film review — Araratpay" },
    { property: "og:description", content: "A separate creative review of the Araratpay payment film." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HeroFilmReview,
});

const shots = [
  ["00:00–00:07.5", "Boutique", "Wide → locked shoulder shot, phone invoice · +100.00 USDT received"],
  ["00:07.5–00:15", "At home", "Wide → locked shoulder shot, phone invoice · 100.00 USDC sent"],
  ["00:15–00:22.5", "Café", "Wide → locked shoulder shot, laptop invoice · +89.00 USDC received"],
  ["00:22.5–00:30", "Restaurant", "Wide → locked shoulder shot, phone invoice · 100.00 USDT sent"],
];

function HeroFilmReview() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [failed, setFailed] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    // Video source media attributes are not consistently honored by browsers.
    setCompact(window.matchMedia("(max-width: 700px)").matches);
  }, []);
  const toggle = async () => {
    const element = video.current;
    if (!element) return;
    if (!element.paused) { element.pause(); return; }
    try { await element.play(); setFailed(false); } catch { setFailed(true); }
  };
  const restart = () => {
    const element = video.current;
    if (!element) return;
    element.currentTime = 0;
    setTime(0);
  };
  return <main className="hero-film-review">
    <div className="hero-film-review__inner">
      <header className="hero-film-review__header"><AraratLogo/><span className="hero-film-review__status">CUT 11 · AWAITING REVIEW</span></header>
      <h1>Hero film review</h1>
      <div className="hero-film-review__film">
        <video key={compact ? "compact" : "full"} ref={video} muted loop playsInline preload="metadata" poster={poster.url} aria-label="Four-scene Araratpay payment film" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onError={() => setFailed(true)}>
          <source src={compact ? smallWebm.url : webm.url} type="video/webm"/>
          <source src={compact ? small.url : film.url} type="video/mp4"/>
        </video>
        <FilmScreens video={video}/>
      </div>
      <div className="hero-film-review__controls">
        <Button variant="outline" onClick={() => void toggle()} aria-label={playing ? "Pause film" : "Play film"}>{playing ? <Pause/> : <Play/>}{playing ? "Pause" : "Play"}</Button>
        <Button variant="ghost" onClick={restart} aria-label="Restart film"><RotateCcw/>Restart</Button>
        <output aria-label="Playback position">{Math.floor(time / 60).toString().padStart(2,"0")}:{Math.floor(time % 60).toString().padStart(2,"0")} / 00:30</output>
      </div>
      {failed && <p role="alert" className="hero-film-review__error">The film could not play. Please try Play again.</p>}
      <p>Review only; the homepage is unchanged. Invoice details are sample records. Silent film. Scenes change with hard cuts.</p>
      <ol className="hero-film-review__shots">{shots.map(([timing, name, detail]) => <li key={name}><span>{timing}</span><strong>{name}</strong><small>{detail}</small></li>)}</ol>
    </div>
  </main>;
}