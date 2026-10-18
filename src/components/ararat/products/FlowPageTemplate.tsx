import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { flatFeeRate, cardComparison } from '@/config/pricing';
import { PageShell } from '../pages/PageShell';
import { useMedia } from '../perf';
import { FlowMedia, type FlowFilm } from './FlowMedia';
import { products, type ProductSlug } from './productData';
import './flow.css';

type Method = { title: string; description: string; best: string; image: string; alt: string };
type GalleryItem = { title: string; subtitle: string; image: string; alt: string };
export type FlowContent = {
  slug: ProductSlug; number: string; name: string; title: string; sub: string;
  hero: FlowFilm; cta: FlowFilm; stats: [string, string][];
  waysTitle: string; methods: Method[]; journeyTitle: string; journey: { title: string; detail: string }[]; journeyCaption: string;
  whyTitle: string; whyCaption: string; visualTitle: string; galleryTitle: string; gallery: GalleryItem[];
  feed: string[]; faq: [string, string][]; ctaTitle: string;
  dashboard?: { title: string; description: string; metric: string; feedTitle: string; unit: string; statuses: string[]; amounts: number[] };
  calculator?: { title: string; description: string; input: string; fee: string; result: string; note: string; unit: string; mode: 'net' | 'total' };
  developerTitle?: string;
};

type SlotProps = { content: FlowContent };
export type FlowSlots = { Signature: ComponentType; Visual: ComponentType<SlotProps>; Why: ComponentType<SlotProps>; Developer: ComponentType<SlotProps> };

export function Label({ children }: { children: ReactNode }) { return <span className="flow-label">{children}</span>; }
function Heading({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) { return <div className="flow-heading"><Label>{kicker}</Label><h2>{title}</h2>{children && <p>{children}</p>}</div>; }
function Sheet({ children, shade = false, className = '' }: { children: ReactNode; shade?: boolean; className?: string }) { return <section className={`flow-sheet ${shade ? 'flow-sheet-shade' : ''} ${className}`}><div className="shell">{children}</div></section>; }

function Ways({ content }: SlotProps) {
  const [active, setActive] = useState(0); const [touched, setTouched] = useState(false);
  const [visible, setVisible] = useState(false); const ref = useRef<HTMLDivElement>(null);
  const reduce = useMedia('(prefers-reduced-motion: reduce)');
  useEffect(() => { if (!ref.current) return; const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: .15 }); io.observe(ref.current); return () => io.disconnect(); }, []);
  useEffect(() => { if (!visible || touched || reduce) return; const id = window.setInterval(() => { if (!document.hidden) setActive(i => (i + 1) % content.methods.length); }, 5000); return () => clearInterval(id); }, [visible, touched, reduce, content.methods.length]);
  const method = content.methods[active];
  if (!method) return null;
  return <Sheet shade><div ref={ref}><Heading kicker="01 / THE WAYS" title={content.waysTitle}/><div className="flow-method-tabs" role="group" aria-label="Flow methods">{content.methods.map((item, i) => <Button key={item.title} type="button" variant="ghost" className={active === i ? 'is-active' : ''} aria-pressed={active === i} onClick={() => { setActive(i); setTouched(true); }}><span>0{i + 1}</span>{item.title}</Button>)}</div><div className="flow-method-stage"><div className="flow-method-photo" key={method.title}><img src={method.image} alt={method.alt} loading="lazy" decoding="async"/></div><div className="flow-method-info" aria-live="polite"><Label>METHOD / 0{active + 1} — 0{content.methods.length}</Label><h3>{method.title}</h3><p>{method.description}</p><span className="flow-best">BEST FOR / {method.best}</span></div></div></div></Sheet>;
}
function Journey({ content }: SlotProps) {
  return <Sheet><Heading kicker="02 / THE JOURNEY" title={content.journeyTitle}/><div className="flow-journey" role="img" aria-label={content.journey.map(item => item.title).join(' to ')}><svg viewBox="0 0 1200 170" preserveAspectRatio="none" aria-hidden="true"><path className="flow-journey-line" d="M 60 85 H 1140"/><circle className="flow-travel" r="5"><animateMotion dur="4s" repeatCount="indefinite" path="M 60 85 H 1140"/></circle></svg>{content.journey.map((item, i) => <div className="flow-journey-node" key={item.title}><span className={i === content.journey.length - 1 ? 'is-balance' : ''}>{i === content.journey.length - 1 ? <Check size={18}/> : String(i + 1).padStart(2, '0')}</span><strong>{item.title}</strong><small>{item.detail}</small></div>)}</div><div className="flow-branches"><span>OTHER FLOWS / SAME BALANCE</span>{(Object.keys(products) as ProductSlug[]).filter(slug => slug !== content.slug).map(slug => <Button variant="ghost" size="sm" asChild key={slug}><Link to="/platform/$slug" params={{ slug }}>{products[slug].name}<ChevronRight size={14}/></Link></Button>)}</div><p className="flow-caption">{content.journeyCaption}</p></Sheet>;
}
function Gallery({ content }: SlotProps) { return <Sheet shade><Heading kicker="05 / IN THE WILD" title={content.galleryTitle}/><div className="flow-gallery">{content.gallery.map((item, i) => <figure key={item.title} className={i === 0 ? 'flow-gallery-large' : ''}><img src={item.image} alt={item.alt} loading="lazy" decoding="async"/><figcaption><span>{item.title}</span><strong>{item.subtitle}</strong></figcaption></figure>)}</div></Sheet>; }
const demoAmounts = [24.5, 89.9, 12, 245, 36.25];
function Dashboard({ content }: SlotProps) {
  const [count, setCount] = useState(3); const [visible, setVisible] = useState(false); const ref = useRef<HTMLDivElement>(null);
  const reduce = useMedia('(prefers-reduced-motion: reduce)');
  useEffect(() => { if (!ref.current) return; const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: .2 }); io.observe(ref.current); return () => io.disconnect(); }, []);
  useEffect(() => { if (!visible || reduce) return; const id = window.setInterval(() => { if (!document.hidden) setCount(i => i >= 5 ? 3 : i + 1); }, 3400); return () => clearInterval(id); }, [visible, reduce]);
  const n = reduce ? 5 : count; const rows = content.feed.slice(0, n);
  const amounts = content.dashboard?.amounts ?? demoAmounts; const total = amounts.slice(0, n).reduce((a, b) => a + b, 0);
  const unit = content.dashboard?.unit ?? 'USDT';
  return <Sheet><Heading kicker="06 / ONE VIEW" title={content.dashboard?.title ?? 'Every payment, in one place.'}>{content.dashboard?.description ?? 'An illustrative view of your incoming payments.'}</Heading><div className="flow-dash" ref={ref}><div className="flow-dash-bar"><span>ARARATPAY / {content.name.toUpperCase()}</span><Label>ILLUSTRATIVE DATA</Label></div><div className="flow-dash-grid"><div className="flow-dash-total"><span>{content.dashboard?.metric ?? 'TODAY / INCOMING'}</span><strong>{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <small>{unit}</small></strong><svg viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 59 L35 47 L60 52 L92 30 L127 41 L156 18 L194 26 L229 10 L266 21 L300 4"/></svg><small>Illustrative activity · not live funds</small></div><div className="flow-dash-feed"><span>{content.dashboard?.feedTitle ?? 'RECENT PAYMENTS'}</span>{rows.map((row, i) => <motion.div initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} key={row}><span><i/> {row}</span><strong>{amounts[i]?.toFixed(2)} {unit}</strong><small>{content.dashboard?.statuses[i] ?? '✓ FINAL'}</small></motion.div>)}</div></div></div></Sheet>;
}
function Calculator({ content }: SlotProps) {
  const [amount, setAmount] = useState(500); const fee = amount * flatFeeRate;
  const calc = content.calculator; const unit = calc?.unit ?? 'USDT';
  return <Sheet shade><div className="flow-two"><div><Heading kicker="07 / ONE NUMBER" title={calc?.title ?? 'One flat fee. Clear from the start.'}>{calc?.description ?? 'Slide to see what a payment leaves in your balance.'}</Heading><label className="flow-slider-label" htmlFor="flow-amount">{calc?.input ?? 'Customer pays'} <strong>{amount.toLocaleString('en-US')} {unit}</strong></label><input id="flow-amount" className="flow-slider" type="range" min="10" max="10000" step="10" value={amount} onChange={e => setAmount(Number(e.target.value))}/><div className="flow-slider-ends"><span>10 {unit}</span><span>10,000 {unit}</span></div></div><div className="flow-receipt"><Label>ESTIMATED RECEIPT / {content.name.toUpperCase()}</Label><div><span>{calc?.input ?? 'Customer pays'}</span><strong>{amount.toFixed(2)} {unit}</strong></div><div><span>{calc?.fee ?? 'AraratPay fee (1%)'}</span><strong>{calc?.mode === 'total' ? '+' : '−'}{fee.toFixed(2)} {unit}</strong></div><div className="flow-receipt-net"><span>{calc?.result ?? 'You receive'}</span><strong>{(calc?.mode === 'total' ? amount + fee : amount - fee).toFixed(2)} {unit}</strong></div><small>ILLUSTRATIVE ESTIMATE</small></div></div></Sheet>;
}
function FAQAndFlows({ content }: SlotProps) { return <Sheet><div className="flow-faq-layout"><div><Heading kicker="09 / GOOD TO KNOW" title="Questions, answered."/><Accordion type="single" collapsible className="flow-faq">{content.faq.map(([q, a], i) => <AccordionItem value={`faq-${i}`} key={q}><AccordionTrigger><span>0{i + 1}</span>{q}</AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>)}</Accordion></div><div className="flow-other"><Label>ONE PLATFORM / FOUR FLOWS</Label><h3>Same account, three more flows.</h3>{(Object.keys(products) as ProductSlug[]).filter(slug => slug !== content.slug).map(slug => <Button variant="ghost" asChild key={slug}><Link to="/platform/$slug" params={{ slug }}><span>{products[slug].name}</span><ArrowUpRight size={18}/></Link></Button>)}</div></div></Sheet>; }
function EndCTA({ content }: SlotProps) { return <section className="flow-end" data-theme="dark"><FlowMedia film={content.cta}/><div className="shell"><Label>YOUR NEXT MOVE / {content.name.toUpperCase()}</Label><h2>{content.ctaTitle}</h2><Button variant="brand" size="hero" asChild><Link to="/contact" search={{ interest: content.name }}>Get your AraratPay account <ArrowUpRight size={18}/></Link></Button></div></section>; }

export default function FlowPageTemplate({ content, slots }: { content: FlowContent; slots: FlowSlots }) {
  const { Signature, Visual, Why, Developer } = slots;
  return <PageShell overHero cta={false}><div className="flow-page"><section className="flow-hero" id="top" data-theme="dark"><FlowMedia film={content.hero} eager/><div className="shell flow-hero-inner"><div className="flow-hero-copy"><Label>PLATFORM · FLOW {content.number} · {content.name.toUpperCase()}</Label><h1>{content.title}</h1><p>{content.sub}</p><div className="flow-hero-actions"><Button variant="brand" size="hero" asChild><Link to="/contact" search={{ interest: content.name }}>Get your AraratPay account <ArrowUpRight size={18}/></Link></Button><Button variant="glass" size="hero" asChild><Link to="/developers">See it in the API <ArrowRight size={17}/></Link></Button></div><div className="flow-hero-stats">{content.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></div><Signature/></div></section>
    <Ways content={content}/><Journey content={content}/><Sheet shade><Heading kicker="03 / THE DIFFERENCE" title={content.whyTitle}/><Why content={content}/><p className="flow-caption">{content.whyCaption}</p></Sheet><Sheet><Heading kicker="04 / THE NETWORK" title={content.visualTitle}/><Visual content={content}/></Sheet><Gallery content={content}/><Dashboard content={content}/><Calculator content={content}/><Sheet><Heading kicker="08 / BUILT TO CONNECT" title={content.developerTitle ?? 'A payment starts with a request.'}>Illustrative API shape. Explore the preview reference for more examples.</Heading><Developer content={content}/><Button variant="ghost" asChild><Link to="/developers">Explore API reference <ArrowUpRight size={17}/></Link></Button></Sheet><FAQAndFlows content={content}/><EndCTA content={content}/></div></PageShell>;
}

export function CryptoInWhy() {
  const reduce = useMedia('(prefers-reduced-motion: reduce)');
  const fees = 10000 * flatFeeRate;
  const cards = 10000 * cardComparison.cardRate;
  return <div className="flow-why-grid"><motion.article whileInView={{ opacity: 1, y: 0 }} initial={reduce ? false : { opacity: 0, y: 22 }} viewport={{ once: true }}><Label>01 / THE FEE</Label><h3>More of the sale stays yours.</h3><div className="flow-bars"><div><span>AraratPay</span><i><motion.b initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} style={{ width: `${fees / cards * 100}%` }}/></i><strong>${fees}</strong></div><div><span>Typical card*</span><i><motion.b initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: .12 }} className="is-card"/></i><strong>~${cards}</strong></div></div><small>On 10,000 in payments · card rate illustrative</small></motion.article><motion.article whileInView={{ opacity: 1, y: 0 }} initial={reduce ? false : { opacity: 0, y: 22 }} viewport={{ once: true }}><Label>02 / FINALITY</Label><div className="flow-ring"><motion.svg viewBox="0 0 140 140" aria-hidden="true"><motion.circle cx="70" cy="70" r="62" fill="none" stroke="currentColor" strokeWidth="11" initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.3 }}/></motion.svg><strong>0%</strong></div><h3>Payments stay paid.</h3><p>Payments are final on-chain. No card-network chargebacks.</p></motion.article><motion.article whileInView={{ opacity: 1, y: 0 }} initial={reduce ? false : { opacity: 0, y: 22 }} viewport={{ once: true }}><Label>03 / SPEED</Label><h3>Time back in your hands.</h3><div className="flow-time"><strong>&lt;3 sec</strong><span>CRYPTO-TO-CRYPTO</span><strong>1–3 days*</strong><span>TYPICAL CARD SETTLEMENT</span></div><small>* Illustrative industry range</small></motion.article></div>;
}
export function CryptoInVisual() { const coins = ['USDT', 'USDC', 'BTC', 'ETH', 'TRX', 'SOL', 'BNB']; return <div className="flow-orbit"><div className="flow-orbit-core"><strong>7+</strong><span>CHAINS</span></div>{coins.map((coin, i) => <div key={coin} className={`flow-orbit-coin flow-orbit-coin-${i}`}><span>{coin}</span></div>)}<span className="flow-orbit-caption">ILLUSTRATIVE ASSET EXAMPLES</span></div>; }
export function CryptoInDeveloper() { return <div className="flow-code"><div><span>REQUEST · ILLUSTRATIVE</span><code>POST /v1/payments</code><pre>{`{\n  "amount": 24.50,\n  "currency": "USDT",\n  "chain": "ethereum",\n  "order_id": "order_2041"\n}`}</pre></div><div><span>RESPONSE · ILLUSTRATIVE</span><code>201 Created</code><pre>{`{\n  "status": "awaiting_payment"\n}`}</pre></div></div>; }
