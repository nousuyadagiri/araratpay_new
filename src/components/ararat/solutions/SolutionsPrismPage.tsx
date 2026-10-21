import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Circle,
  Cloud,
  Gamepad2,
  Globe2,
  ShoppingCart,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import { useSiteAction } from "../pages/PageShell";
import { useMedia } from "../perf";
import { SolutionsMedia } from "./SolutionsMedia";
import { flowNames, flowSlugs, industries, type FlowName } from "./solutionsData";
import "./solutions.css";

const faq = [
  [
    "My industry isn't listed. Can I still use AraratPay?",
    "Yes. Any business can use the four flows. Talk to us.",
  ],
  ["Do industries pay different prices?", "No. Flat 1% on every transaction, for everyone."],
  ["Are there industries you can't serve?", "Eligibility is reviewed during onboarding."],
] as const;

const industryIcons = {
  "shopping-cart": ShoppingCart,
  cloud: Cloud,
  store: Store,
  globe: Globe2,
  gamepad: Gamepad2,
  briefcase: BriefcaseBusiness,
} as const;

function nextAngle(current: number, target: number) {
  const normalized = (((-current / 60) % 6) + 6) % 6;
  let delta = target - normalized;
  if (delta > 3) delta -= 6;
  if (delta < -3) delta += 6;
  return current - delta * 60;
}

export default function SolutionsPrismPage() {
  const action = useSiteAction();
  const pin = useRef<HTMLDivElement>(null);
  const prismStage = useRef<HTMLDivElement>(null);
  const prism = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLElement>(null);
  const mobileTrack = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);
  const interacted = useRef(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [active, setActive] = useState(0);
  const [angle, setAngle] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  const [selectedFlows, setSelectedFlows] = useState<FlowName[]>([...industries[0].flows]);
  const desktop = useMedia("(min-width: 1024px) and (pointer: fine)");
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const current = industries[active] ?? industries[0];

  const choose = useCallback((index: number, updateHash = true) => {
    const safe = ((index % industries.length) + industries.length) % industries.length;
    setActive(safe);
    setAngle((previous) => nextAngle(previous, safe));
    const industry = industries[safe] ?? industries[0];
    setSelectedFlows([...industry.flows]);
    if (updateHash) history.replaceState(null, "", `#${industry.id}`);
  }, []);
  const interactChoose = useCallback(
    (index: number) => {
      interacted.current = true;
      choose(index);
    },
    [choose],
  );

  useEffect(() => {
    const fromHash = () => {
      const index = industries.findIndex((item) => `#${item.id}` === window.location.hash);
      if (index >= 0) {
        interacted.current = true;
        choose(index, false);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [choose]);

  useEffect(() => {
    const node = pin.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(!!entry?.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!heroVisible || reduce || interacted.current) return;
    const timer = window.setInterval(() => {
      if (!interacted.current) choose(active + 1, false);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [active, choose, heroVisible, reduce]);

  useEffect(() => {
    if (!desktop || reduce || !pin.current) return;
    let stopped = false;
    let cleanup = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { ScrollTrigger }]) => {
        if (stopped || !pin.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const trigger = ScrollTrigger.create({
          trigger: pin.current,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 3.5)}`,
          pin: true,
          scrub: 0.45,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (self.progress <= 0.01 && interacted.current) return;
            if (self.progress > 0.01) interacted.current = true;
            choose(Math.min(5, Math.floor(self.progress * 6)), false);
          },
        });
        cleanup = () => trigger.kill();
      },
    );
    return () => {
      stopped = true;
      cleanup();
    };
  }, [choose, desktop, reduce]);

  useEffect(() => {
    const stage = prismStage.current;
    const node = prism.current;
    if (!desktop || !stage || !node) return;
    const updateRadius = (width: number) =>
      stage.style.setProperty("--prism-radius", `${width * 0.8660254 + 2}px`);
    updateRadius(node.offsetWidth);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) updateRadius(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [desktop]);

  useEffect(() => {
    if (reduce) {
      setDemoStep(2);
      return;
    }
    setDemoStep(0);
    const one = window.setTimeout(() => setDemoStep(1), 750);
    const two = window.setTimeout(() => setDemoStep(2), 1900);
    return () => {
      window.clearTimeout(one);
      window.clearTimeout(two);
    };
  }, [active, reduce]);

  useEffect(() => {
    if (desktop || !mobileTrack.current) return;
    const track = mobileTrack.current;
    const onScroll = () => {
      const card = track.querySelector<HTMLElement>(".solutions-mobile-face");
      if (!card) return;
      const index = Math.round(track.scrollLeft / (card.offsetWidth + 12));
      if (index !== active && index >= 0 && index < industries.length) interactChoose(index);
    };
    track.addEventListener("scrollend", onScroll);
    return () => track.removeEventListener("scrollend", onScroll);
  }, [active, desktop, interactChoose]);

  useEffect(() => {
    if (desktop || !mobileTrack.current) return;
    const track = mobileTrack.current;
    const card = track.querySelector<HTMLElement>(".solutions-mobile-face");
    if (!card) return;
    const target = active * (card.offsetWidth + 12);
    if (Math.abs(track.scrollLeft - target) > 4)
      track.scrollTo({ left: target, behavior: reduce ? "auto" : "smooth" });
  }, [active, desktop, reduce]);

  const scrollToScene = () =>
    scene.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  const pickFromMatrix = (index: number) => {
    interactChoose(index);
    window.setTimeout(scrollToScene, 0);
  };
  const pickFromPhoto = (index: number) => {
    interactChoose(index);
    window.setTimeout(scrollToScene, 0);
  };
  const toggleFlow = (flow: FlowName, on: boolean) =>
    setSelectedFlows((previous) =>
      on ? [...new Set([...previous, flow])] : previous.filter((item) => item !== flow),
    );
  const hasFlow = (industry: (typeof industries)[number], flow: FlowName) =>
    (industry.flows as readonly FlowName[]).includes(flow);

  const faceContents = (industry: (typeof industries)[number], index: number) => {
    const Icon = industryIcons[industry.icon];
    return (
      <>
        <img src={industry.prismPhoto} alt="" />
        <div className="solutions-face-shade" />
        <span>0{index + 1}</span>
        <Icon className="solutions-face-icon" aria-hidden="true" />
        <strong>{industry.name}</strong>
        <small>{industry.tagline}</small>
      </>
    );
  };
  const facePosition = (index: number) => {
    const distance = Math.min(
      (index - active + industries.length) % industries.length,
      (active - index + industries.length) % industries.length,
    );
    return distance === 0 ? "is-active" : distance === 1 ? "is-neighbor" : "is-hidden";
  };

  return (
    <>
      <SiteHeader onAction={action} overHero />
      <main className="solutions-page">
        <div className="solutions-pinned" ref={pin}>
          <section id="top" className="solutions-hero">
            <div className="solutions-grid" aria-hidden="true" />
            <div className="shell solutions-hero-inner">
              <div className="solutions-hero-copy">
                <span className="solutions-kicker">SOLUTIONS · ONE PLATFORM, SIX SIDES</span>
                <h1>Turn it to your <mark className="headline-highlight">industry.</mark></h1>
                <p>
                  E-commerce, SaaS, marketplaces, remittance, gaming and freelance platforms. One
                  account, four flows, flat 1%.
                </p>
                <div className="solutions-chips" aria-label="Choose an industry">
                  {industries.map((industry, index) => (
                    <Button
                      key={industry.id}
                      variant="ghost"
                      className={active === index ? "is-active" : ""}
                      aria-pressed={active === index}
                      onClick={() => interactChoose(index)}
                    >
                      {industry.name}
                    </Button>
                  ))}
                </div>
                <div className="solutions-arrows">
                  <Button
                    variant="iconGlass"
                    size="icon"
                    aria-label="Previous industry"
                    onClick={() => interactChoose(active - 1)}
                  >
                    <ArrowLeft />
                  </Button>
                  <span>{String(active + 1).padStart(2, "0")} / 06</span>
                  <Button
                    variant="iconGlass"
                    size="icon"
                    aria-label="Next industry"
                    onClick={() => interactChoose(active + 1)}
                  >
                    <ArrowRight />
                  </Button>
                </div>
              </div>
              {desktop ? (
                <div
                  ref={prismStage}
                  className="solutions-prism-stage"
                  tabIndex={0}
                  aria-label="Industry prism. Use left and right arrow keys to turn."
                  style={{ "--prism-angle": `${angle}deg` } as React.CSSProperties}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") interactChoose(active - 1);
                    if (event.key === "ArrowRight") interactChoose(active + 1);
                  }}
                  onPointerDown={(event) => {
                    dragStart.current = event.clientX;
                  }}
                  onPointerUp={(event) => {
                    if (dragStart.current === null) return;
                    const distance = event.clientX - dragStart.current;
                    if (Math.abs(distance) > 35) interactChoose(active + (distance < 0 ? 1 : -1));
                    dragStart.current = null;
                  }}
                >
                  <div ref={prism} className="solutions-prism">
                    {industries.map((industry, index) => (
                      <Button
                        variant="ghost"
                        key={industry.id}
                        className={`solutions-prism-face solutions-prism-face-${index} ${facePosition(index)}`}
                        aria-label={`Show ${industry.name} solution`}
                        aria-pressed={active === index}
                        onClick={() => interactChoose(index)}
                      >
                        <div className="solutions-face-surface">
                          {faceContents(industry, index)}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div ref={mobileTrack} className="solutions-mobile-prism">
                  {industries.map((industry, index) => (
                    <Button
                      variant="ghost"
                      key={industry.id}
                      className={`solutions-mobile-face ${active === index ? "is-active" : ""}`}
                      aria-label={`Show ${industry.name} solution`}
                      aria-pressed={active === index}
                      onClick={() => interactChoose(index)}
                    >
                      {faceContents(industry, index)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </section>
          <section
            className="solutions-scene-band"
            aria-label={`${current.name}: ${current.tagline}`}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                className="solutions-scene-media"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.45 }}
              >
                <SolutionsMedia industry={current} eager />
              </motion.div>
            </AnimatePresence>
            <div className="shell">
              <span>0{active + 1} · INDUSTRY</span>
              <h2 aria-live="polite">{current.tagline}</h2>
            </div>
          </section>
        </div>

        <section ref={scene} id="industry-scene" className="solutions-sheet solutions-scene-detail">
          <div className="shell solutions-detail-grid">
            <div className="solutions-story">
              <article>
                <span>THE PROBLEM</span>
                <p>{current.problem}</p>
              </article>
              <article>
                <span>WITH ARARATPAY</span>
                <p>{current.answer}</p>
              </article>
              <div>
                <span>FLOWS THIS INDUSTRY USES</span>
                <div className="solutions-flow-chips">
                  {flowNames.map((flow) =>
                    hasFlow(current, flow) ? (
                      <Button key={flow} variant="glass" asChild>
                        <Link to="/platform/$slug" params={{ slug: flowSlugs[flow] }}>
                          <i>●</i>
                          {flow}
                        </Link>
                      </Button>
                    ) : (
                      <span key={flow}>
                        <i>○</i>
                        {flow}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="solutions-facts">
                {current.facts.map((fact) => (
                  <span key={fact}>{fact}</span>
                ))}
              </div>
            </div>
            <div
              className="solutions-phone"
              aria-label={`${current.name} illustrative payment preview`}
            >
              <div className="solutions-phone-top">
                <span>ILLUSTRATIVE</span>
                <i />
              </div>
              <div className="solutions-phone-screen">
                <small>{current.demo[0]}</small>
                <strong>{current.demo[1]}</strong>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${active}-${demoStep}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <span>
                      {demoStep === 0 ? (
                        "WAITING"
                      ) : demoStep === 1 ? (
                        "PROCESSING…"
                      ) : (
                        <>
                          <Check size={15} /> {current.demo[2]}
                        </>
                      )}
                    </span>
                  </motion.div>
                </AnimatePresence>
                <div className="solutions-demo-progress">
                  <i style={{ width: `${(demoStep + 1) * 33.34}%` }} />
                </div>
              </div>
              <small>ILLUSTRATIVE DATA</small>
            </div>
          </div>
        </section>

        <section className="solutions-sheet solutions-sheet-alt">
          <div className="shell">
            <div className="solutions-heading">
              <span>03 · AT A GLANCE</span>
              <h2>Six industries. Four connected flows.</h2>
            </div>
            <div className="solutions-matrix" role="table" aria-label="Industry and flow matrix">
              <div className="solutions-matrix-head" role="row">
                <span>INDUSTRY</span>
                {flowNames.map((flow) => (
                  <span key={flow}>{flow}</span>
                ))}
              </div>
              {industries.map((industry, index) => (
                <Button
                  variant="ghost"
                  key={industry.id}
                  className={`solutions-matrix-row ${active === index ? "is-active" : ""}`}
                  onClick={() => pickFromMatrix(index)}
                  role="row"
                  aria-label={`Select ${industry.name}`}
                >
                  <strong>{industry.name}</strong>
                  {flowNames.map((flow) => (
                    <span
                      key={flow}
                      aria-label={
                        hasFlow(industry, flow) ? `${flow} included` : `${flow} not included`
                      }
                    >
                      {hasFlow(industry, flow) ? "●" : "○"}
                      <small>{flow}</small>
                    </span>
                  ))}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="solutions-sheet">
          <div className="shell solutions-builder">
            <div>
              <span className="solutions-section-label">04 · BUILD YOUR SETUP</span>
              <h2>Your starting setup.</h2>
              <p>
                Pick an industry, get a starting setup. We switch on the flows your industry usually
                needs. Turn any on or off. It's all one account.
              </p>
              <div className="solutions-builder-chips">
                {industries.map((industry, index) => (
                  <Button
                    key={industry.id}
                    variant="ghost"
                    className={active === index ? "is-active" : ""}
                    onClick={() => interactChoose(index)}
                  >
                    {industry.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="solutions-toggle-panel">
              {flowNames.map((flow) => (
                <label key={flow}>
                  <span>
                    <Circle size={15} />
                    <strong>{flow}</strong>
                  </span>
                  <Switch
                    checked={selectedFlows.includes(flow)}
                    onCheckedChange={(checked) => toggleFlow(flow, checked)}
                    aria-label={`${checkedLabel(selectedFlows.includes(flow))} ${flow}`}
                  />
                </label>
              ))}
              <div className="solutions-builder-footer">
                <span>{selectedFlows.length} FLOWS · ONE ACCOUNT · FLAT 1%</span>
                <Button variant="brand" asChild>
                  <Link to="/contact" search={{ interest: "Industry setup" }}>
                    Get your AraratPay account <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="solutions-sheet solutions-sheet-alt">
          <div className="shell">
            <div className="solutions-heading">
              <span>05 · IN THE REAL WORLD</span>
              <h2>Turn the prism. See the fit.</h2>
            </div>
            <div className="solutions-photo-strip">
              {industries.map((industry, index) => (
                <Button
                  variant="ghost"
                  key={industry.id}
                  className={active === index ? "is-active" : ""}
                  onClick={() => pickFromPhoto(index)}
                  aria-label={`Select ${industry.name}`}
                >
                  <img
                    src={industry.photo}
                    alt={`${industry.name} illustrative stock scene`}
                    loading="lazy"
                  />
                  <span>
                    <strong>{industry.name}</strong>
                    <small>{industry.caption}</small>
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="solutions-sheet">
          <div className="shell solutions-faq">
            <div>
              <span className="solutions-section-label">06 · FAQ</span>
              <h2>The practical questions.</h2>
            </div>
            <Accordion type="single" collapsible>
              {faq.map(([question, answer], index) => (
                <AccordionItem value={`solutions-${index}`} key={question}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>{answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="solutions-final" data-theme="dark">
          <SolutionsMedia industry={industries[2]} />
          <div className="shell">
            <span>ONE PLATFORM · FOUR FLOWS</span>
            <h2>Every side runs on one flat 1%.</h2>
            <div>
              <Button variant="brand" asChild>
                <Link to="/contact" search={{ interest: "Get started" }}>
                  Get your AraratPay account <ArrowUpRight />
                </Link>
              </Button>
              <Button variant="glass" asChild>
                <Link to="/contact" search={{ interest: "Talk to us" }}>
                  Talk to us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter onAction={action} />
    </>
  );
}

function checkedLabel(checked: boolean) {
  return checked ? "Turn off" : "Turn on";
}
