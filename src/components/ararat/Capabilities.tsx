import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Check, CreditCard, Landmark, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { products, type ProductSlug } from "./products/productData";
import { useSafeReducedMotion } from "./SectionBits";
import paidMp4 from "@/assets/videos/moments/gets-paid.mp4.asset.json";
import paidWebm from "@/assets/videos/moments/gets-paid.webm.asset.json";
import paidPoster from "@/assets/videos/moments/gets-paid.jpg.asset.json";
import suppliersMp4 from "@/assets/videos/moments/pays-suppliers.mp4.asset.json";
import suppliersWebm from "@/assets/videos/moments/pays-suppliers.webm.asset.json";
import suppliersPoster from "@/assets/videos/moments/pays-suppliers.jpg.asset.json";
import bankMp4 from "@/assets/videos/moments/cashes-out.mp4.asset.json";
import bankWebm from "@/assets/videos/moments/cashes-out.webm.asset.json";
import bankPoster from "@/assets/videos/moments/cashes-out.jpg.asset.json";
import cardMp4 from "@/assets/videos/moments/spends-on-card.mp4.asset.json";
import cardWebm from "@/assets/videos/moments/spends-on-card.webm.asset.json";
import cardPoster from "@/assets/videos/moments/spends-on-card.jpg.asset.json";

const cards: { slug: ProductSlug; story: string; caption: string; features: string[]; icon: typeof ArrowDownLeft; mp4: string; webm: string; poster: string }[] = [
  { slug: "crypto-in", story: "A customer pays 48 USDT at the counter — confirmed in seconds.", caption: "+48.50 USDT · Settled", features: ["Rate lock", "QR & wallet", "Webhooks"], icon: ArrowDownLeft, mp4: paidMp4.url, webm: paidWebm.url, poster: paidPoster.url },
  { slug: "crypto-out", story: "Suppliers and contractors get paid in stablecoins, in one batch.", caption: "Batch payout · 18,420 USDC", features: ["Batch payouts", "Multi-chain", "Approvals"], icon: Send, mp4: suppliersMp4.url, webm: suppliersWebm.url, poster: suppliersPoster.url },
  { slug: "fiat-out", story: "Crypto revenue converts and lands in the business bank account.", caption: "USDT → AED · Settled", features: ["180+ currencies", "SWIFT / IBAN", "Auto-settle"], icon: Landmark, mp4: bankMp4.url, webm: bankWebm.url, poster: bankPoster.url },
  { slug: "cards", story: "The team spends from the crypto balance with AraratPay cards.", caption: "Card spend · AED 36.00", features: ["Virtual & physical", "Spend controls", "Freeze"], icon: CreditCard, mp4: cardMp4.url, webm: cardWebm.url, poster: cardPoster.url },
];

export default function Capabilities() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(2);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 90, damping: 24 }), sy = useSpring(y, { stiffness: 90, damping: 24 });
  const photoX = useTransform(sx, value => -value * 1.5), photoY = useTransform(sy, value => -value * 1.5);
    const reduce = useSafeReducedMotion();
  useEffect(() => {
    const media = matchMedia("(max-width: 1023px)");
    const sync = () => setMobile(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const nearObserver = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) { setNear(true); nearObserver.disconnect(); } }, { rootMargin: "100% 0px" });
    const viewObserver = new IntersectionObserver(([entry]) => setVisible(!!entry?.isIntersecting), { threshold: .08 });
    nearObserver.observe(element); viewObserver.observe(element);
    return () => { nearObserver.disconnect(); viewObserver.disconnect(); };
  }, []);
  useEffect(() => {
    if (!mobile || !track.current) return;
    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => ratios.set(entry.target, entry.intersectionRatio));
      const mostVisible = [...ratios].sort((a, b) => b[1] - a[1])[0];
      if (mostVisible && mostVisible[1] > 0) setActive(Number((mostVisible[0] as HTMLElement).dataset["index"] ?? 0));
    }, { root: track.current, threshold: [.25, .5, .75] });
    track.current.querySelectorAll(".platform-card").forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, [mobile]);
  useEffect(() => {
    const sync = () => videos.current.forEach((video, index) => {
      if (!video) return;
      const shouldPlay = near && visible && !reduce && !document.hidden && index === active;
      if (shouldPlay) void video.play().catch(() => {});
      else video.pause();
    });
    sync(); document.addEventListener("visibilitychange", sync);
    return () => { document.removeEventListener("visibilitychange", sync); videos.current.forEach(video => video?.pause()); };
  }, [near, visible, active, reduce]);
  const highlighted = reduce ? 2 : active;
  return <section id="platform" ref={section} className="page-section capabilities platform-section p2-section" data-visible={visible}><div className="shell">
    <div className="section-heading platform-heading"><div className="section-kicker">02 / THE PLATFORM</div><h2>One platform. <span>Four flows.</span></h2><p>One AraratPay account covers the full cycle: take payments, pay out, cash out and spend.</p></div>
    <div className="platform-frame"><div className="platform-frame-top"><span>ONE ARARATPAY ACCOUNT · ONE BALANCE · ONE DASHBOARD · ONE API</span><span className="platform-frame-balance"><i/> Balance 42,890.42 USDT (illustrative)</span></div>
    <div className="p2-stage" onPointerMove={event => { if (reduce || mobile || !matchMedia("(pointer: fine)").matches) return; const rect = event.currentTarget.getBoundingClientRect(); x.set(((event.clientX - rect.left) / rect.width - .5) * 10); y.set(((event.clientY - rect.top) / rect.height - .5) * 8); }} onPointerLeave={() => { x.set(0); y.set(0); if (!section.current?.contains(document.activeElement)) setActive(2); }}>
    <div className="p2-routes" aria-hidden="true"><svg viewBox="0 0 1000 160" preserveAspectRatio="none">{[125,375,625,875].map(end => <path key={end} d={`M500 0 Q500 90 ${end} 155`}/>)}</svg>{[125,375,625,875].map((end,index) => <span key={end} className={`p2-coin p2-coin--${index}`} style={{ offsetPath: `path('M500 0 Q500 90 ${end} 155')` }}>$</span>)}</div>
    <div className="platform-grid" ref={track} aria-label="AraratPay flows">{cards.map((card, index) => {
      const Icon = card.icon;
      return <motion.article className="platform-card" data-index={index} data-active={highlighted === index} key={card.slug} onMouseEnter={() => { if (!mobile && !reduce) setActive(index); }} onFocus={() => { if (!reduce) setActive(index); }} style={{ x: reduce || mobile ? 0 : sx, y: reduce || mobile ? 0 : sy }}>
        <div className="platform-media"><motion.video width={640} height={400} style={{ x: reduce || mobile ? 0 : photoX, y: reduce || mobile ? 0 : photoY }} ref={node => { videos.current[index] = node; }} muted loop playsInline preload="none" poster={card.poster} aria-hidden="true" tabIndex={-1}>{near && !reduce && <><source src={card.webm} type="video/webm"/><source src={card.mp4} type="video/mp4"/></>}</motion.video><span className="platform-demo">ILLUSTRATIVE · {card.caption}</span></div>
        <div className="platform-body"><div className="platform-meta"><span className="platform-icon"><Icon size={20} strokeWidth={1.6}/></span><span>{["FLOW 01 · MONEY IN", "FLOW 02 · MONEY OUT", "FLOW 03 · TO YOUR BANK", "FLOW 04 · SPEND"][index]}</span></div><h3>{products[card.slug].name}</h3><p>{products[card.slug].subhead}</p><ul>{card.features.map(feature => <li key={feature}><Check size={13}/>{feature}</li>)}</ul><Button asChild variant="ghost" className="platform-link"><Link to="/platform/$slug" params={{ slug: card.slug }}>See how it works <ArrowUpRight size={16}/><span className="sr-only">{products[card.slug].name}</span></Link></Button></div>
      </motion.article>;
    })}</div></div>
    <div className="platform-dots" role="group" aria-label="Choose a flow">{cards.map((card, index) => <Button key={card.slug} type="button" variant="ghost" size="icon" aria-label={`Show ${products[card.slug].name}`} aria-pressed={highlighted === index} onClick={() => { setActive(index); const node = track.current?.querySelector<HTMLElement>(`[data-index="${index}"]`); if (node && track.current) track.current.scrollTo({ left: node.offsetLeft - track.current.offsetLeft, behavior: reduce ? "instant" : "smooth" }); }}><span/></Button>)}</div>
    <div className="platform-frame-bottom"><span className="p2-sequence">{["IN", "BALANCE", "OUT", "BANK", "CARD"].map((word,index) => <span key={word}>{index > 0 && (index < 3 ? " → " : " · ")}<b style={{ animationDelay: `${index * 1.2}s` }}>{word}</b></span>)}</span><Button variant="ghost" asChild><Link to="/solutions">See how the platform works <ArrowUpRight size={16}/></Link></Button></div></div>
    <div className="platform-trust" aria-label="Platform facts"><span>&lt;3 sec settlement</span><span>180+ fiat currencies</span><span>7+ blockchains</span><span>0% chargebacks</span></div>
  </div></section>;
}
