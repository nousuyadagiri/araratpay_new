import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, BadgeCheck, Blocks, CheckCheck, Fingerprint, Globe2, KeyRound, LockKeyhole, ScanSearch, ShieldCheck, Timer, UsersRound, Wallet, Waypoints } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useActiveInView, useMedia, useWebGLSlot } from "../perf";
import { smoothScrollTo } from "../SmoothScroll";
import "./security-dive.css";

const SecurityBlocksScene = lazy(() => import("./SecurityBlocksScene"));
const layers = [
  { eyebrow: "SECURITY · SURFACE", title: "Go inside AraratPay.", sub: "A clear view of the platform.", tiles: [{ label: "One connected account", icon: Fingerprint, state: "plain" }, { label: "Four payment flows", icon: UsersRound, state: "plain" }, { label: "Clear transaction status", icon: BadgeCheck, state: "plain" }] },
  { eyebrow: "LAYER 02 · VISIBILITY", title: "Know where money stands.", sub: "Follow each illustrative payment from request to finality.", tiles: [{ label: "Transaction status", icon: ScanSearch, state: "plain" }, { label: "Flow-level activity", icon: ShieldCheck, state: "plain" }, { label: "One connected view", icon: Waypoints, state: "plain" }] },
  { eyebrow: "LAYER 03 · SETTLEMENT", title: "Payments that stay paid.", sub: "Final on-chain. Fast. Across chains.", tiles: [{ label: "0% chargebacks", icon: CheckCheck, state: "live" }, { label: "<3 sec crypto-to-crypto", icon: Timer, state: "live" }, { label: "7+ chains supported", icon: Globe2, state: "live" }] },
  { eyebrow: "LAYER 04 · PLATFORM", title: "Built with care.", sub: "Security details are published only when verified.", tiles: [{ label: "Clear public status", icon: Wallet, state: "plain" }, { label: "No unverified claims", icon: KeyRound, state: "plain" }, { label: "Candid disclosure", icon: LockKeyhole, state: "plain" }] },
  { eyebrow: "THE CORE", title: "Trust is earned.", sub: "We only mark something live once it is true.", tiles: [{ label: "Confirmed claims only", icon: Blocks, state: "plain" }, { label: "SOC 2 Type II in progress", icon: ShieldCheck, state: "progress" }, { label: "Public progress", icon: Waypoints, state: "plain" }] },
] as const;

function PortalContent({ index, desktop = false, interactive = true }: { index: number; desktop?: boolean; interactive?: boolean }) {
  const layer = layers[index];
  if (!layer) return null;
  return <>
    <span className="security-layer-number" aria-hidden="true">0{index + 1}</span>
    <div className="security-portal-copy"><span className="security-portal-eyebrow">{layer.eyebrow}</span>
      {index === 0 ? <h1>{layer.title}</h1> : <h2>{layer.title}</h2>}
      <p>{layer.sub}</p>
    </div>
    <ul className="security-feature-grid">{layer.tiles.map(tile => <li key={tile.label} className={`security-feature security-feature--${tile.state}`}>
      <tile.icon size={25} strokeWidth={1.6} aria-hidden="true"/><span className="security-feature-label">{tile.label}</span>
    </li>)}</ul>
    {index === 0 && <div className="security-portal-actions"><Button variant="brand" asChild><Link to="/contact" search={{ interest: "Security" }} tabIndex={desktop && !interactive ? -1 : undefined}>Get your AraratPay account <ArrowRight size={15}/></Link></Button><Button variant="glass" asChild><a href="#report" tabIndex={desktop && !interactive ? -1 : undefined}>Report a vulnerability <ArrowDown size={15}/></a></Button></div>}
  </>;
}

export default function SecurityDive() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const portals = useRef<(HTMLDivElement | null)[]>([]);
  const velocity = useRef(0);
  const scrollStart = useRef(0);
  const scrollEnd = useRef(0);
  const [active, setActive] = useState(0);
  const desktop = useMedia("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const visible = useActiveInView(stageRef);
  const slot = useWebGLSlot(stageRef, desktop && visible);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!desktop || !sectionRef.current || !stageRef.current) return;
    const section = sectionRef.current;
    let disposed = false;
    let dispose = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: section, pin: section, start: "top top", end: "+=500%", scrub: true, pinSpacing: true,
        onRefresh: self => { scrollStart.current = self.start; scrollEnd.current = self.end; },
        onUpdate: self => {
          const s = self.progress * 4;
          velocity.current = Math.min(7, Math.abs(self.getVelocity()) / 700);
          const current = Math.min(4, Math.round(s));
          setActive(old => old === current ? old : current);
          portals.current.forEach((portal, i) => {
            if (!portal) return;
            const t = s - i;
            const scale = i === 4 && t > 0 ? 1 : t < 0 ? Math.pow(2.6, t) : Math.pow(4, t);
            const opacity = i === 4 && t > 0 ? 1 : t < 0 ? 1 + .9 * t : 1 - 1.8 * t;
            portal.style.transform = `scale(${scale})`;
            portal.style.opacity = String(Math.max(0, Math.min(1, opacity)));
            portal.style.visibility = opacity < .4 ? "hidden" : "visible";
            portal.style.zIndex = String(t > 0 && i !== 4 ? 6 - i : t < 0 ? 1 : 8);
          });
        },
      });
      scrollStart.current = trigger.start;
      scrollEnd.current = trigger.end;
      trigger.update();
      dispose = () => trigger.kill();
    });
    return () => { disposed = true; dispose(); };
  }, [desktop]);

  const jump = (index: number) => {
    if (!sectionRef.current || scrollEnd.current <= scrollStart.current) return;
    smoothScrollTo(scrollStart.current + (scrollEnd.current - scrollStart.current) * index / 4, false);
  };

  return <section id="top" ref={sectionRef} className="security-dive" aria-label="Explore five layers of platform security">
    <div ref={stageRef} className="security-dive-stage">
      {slot && <div className="security-blocks" aria-hidden="true"><Suspense fallback={null}><SecurityBlocksScene velocity={velocity}/></Suspense></div>}
      <div className="security-dive-center">{layers.map((layer, i) => <div key={layer.eyebrow} ref={el => { portals.current[i] = el; }} className={`security-portal security-portal--${i + 1} ${active === i ? "is-active is-interactive" : ""}`} aria-hidden={active !== i}>
        <PortalContent index={i} desktop interactive={active === i}/>
      </div>)}</div>
      <div className="security-dive-hud"><nav className="security-depth-rail" aria-label="Security depth">{layers.map((layer, i) => <Button variant="ghost" key={layer.eyebrow} onClick={() => jump(i)} className={active === i ? "is-active" : ""} aria-label={`Go to security layer ${i + 1}`} aria-current={active === i ? "step" : undefined}><span/></Button>)}</nav><div className="security-hud-bottom"><span>DEPTH 0{active + 1} / 05</span><span>{active === 4 ? "SCROLL ON ↓" : "SCROLL TO GO DEEPER ↓"}</span></div></div>
    </div>
    <div className="security-dive-mobile"><div className="shell security-mobile-inner">{layers.map((layer, i) => <motion.article key={layer.eyebrow} className="security-mobile-card" initial={reduce ? false : { opacity: 0, scale: .92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .45 }}><PortalContent index={i}/></motion.article>)}</div></div>
  </section>;
}
