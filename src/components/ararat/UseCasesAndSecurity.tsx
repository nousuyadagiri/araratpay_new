import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, LockKeyhole, ShieldCheck, Snowflake, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading, useSafeReducedMotion } from "./SectionBits";
import { photos, productImages, industryPhotos } from "./useCaseImages";
import { useWebGLSlot, useActiveInView } from "./perf";
import { canAdvanceGallery, GALLERY_INTERVAL } from "./galleryRules";
const UseCaseGalleryScene = lazy(() => import("./UseCaseGalleryScene"));
const cases = [
  { title: "E-commerce", short: "E-commerce", slug: "e-commerce", pain: "Cross-border checkout friction", answer: "Accept crypto at checkout and settle the way you choose.", tags: ["Hosted checkout", "Rate lock"] },
  { title: "SaaS & Subscriptions", short: "SaaS", slug: "saas", pain: "Payments that stop at borders", answer: "Give global customers another way to pay for your product.", tags: ["Payment API", "Webhooks"] },
  { title: "Remittance & Payroll", short: "Remittance & Payroll", slug: "remittance", pain: "Slow international disbursements", answer: "Move funds across chains and pay out in batches.", tags: ["Mass payouts", "Fiat rails"] },
  { title: "Gaming & Digital Goods", short: "Gaming", slug: "gaming", pain: "Digital payments with unnecessary friction", answer: "Accept on-chain payments for digital-first experiences.", tags: ["Instant confirmation", "Multi-chain"] },
  { title: "Marketplaces", short: "Marketplaces", slug: "marketplaces", pain: "Complex multi-party payouts", answer: "Collect once and route value to your partners.", tags: ["Crypto Out", "Payout queue"] },
  { title: "Freelance / Gig Platforms", short: "Freelance", slug: "freelance", pain: "Paying talent around the world", answer: "Give independent workers flexible payout options.", tags: ["Bank settlement", "Crypto wallet"] },
];
export function UseCases() {
 const root=useRef<HTMLElement>(null), stage=useRef<HTMLDivElement>(null), pointer=useRef({x:0,y:0}), scroll=useRef(0), cursor=useRef<HTMLDivElement>(null), moveFrame=useRef(0), lastInteraction=useRef(-Infinity);
 const [active,setActive]=useState(0),[open,setOpen]=useState(false),[hover,setHover]=useState<number|null>(null),[paused,setPaused]=useState(false),[ready,setReady]=useState(false);
 const reduce=useSafeReducedMotion(), visible=useActiveInView(root), glOn=useWebGLSlot(stage,!reduce,"(min-width:768px) and (pointer:fine)");
 const onReady=useCallback(()=>setReady(true),[]);
 useEffect(()=>{if(!glOn||reduce)setReady(false);},[glOn,reduce]);
 useEffect(()=>{const update=()=>{const r=root.current?.getBoundingClientRect();if(r)scroll.current=Math.max(-1,Math.min(1,(innerHeight/2-r.top-r.height/2)/innerHeight));};window.addEventListener('scroll',update,{passive:true});return()=>{window.removeEventListener('scroll',update);cancelAnimationFrame(moveFrame.current);};},[]);
 useEffect(()=>{const timer=window.setInterval(()=>{if(canAdvanceGallery(visible,document.hidden,paused,reduce,Date.now(),lastInteraction.current))setActive(i=>(i+1)%cases.length);},GALLERY_INTERVAL);return()=>clearInterval(timer);},[visible,paused,reduce]);
 const select=(index:number)=>{setActive((index+cases.length)%cases.length);setOpen(true);lastInteraction.current=Date.now();};
 const current=cases[active];if(!current)return null;
 return <section id="industries" ref={root} className="use-gallery" data-open={open} aria-labelledby="use-gallery-title" onPointerEnter={e=>{if(e.pointerType==='mouse')setPaused(true);}} onPointerLeave={()=>{setPaused(false);setHover(null);pointer.current={x:0,y:0};}} onFocusCapture={()=>setPaused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setPaused(false);}} onPointerMove={e=>{if(reduce||e.pointerType!=='mouse'||moveFrame.current)return;const x=e.clientX,y=e.clientY,node=e.currentTarget;moveFrame.current=requestAnimationFrame(()=>{moveFrame.current=0;const r=node.getBoundingClientRect();pointer.current={x:(x-r.left)/r.width*2-1,y:(y-r.top)/r.height*2-1};if(cursor.current){cursor.current.style.left=`${x-r.left}px`;cursor.current.style.top=`${y-r.top}px`;}});}}>
 <div ref={stage} className="use-gallery-stage" data-ready={ready}>
 <div className="use-gallery-static" aria-hidden="true">{[0,1,2,3,4,5].map((slot)=><img key={slot} src={photos[industryPhotos(active)[slot%4]??0]} width={600} height={375} alt="" loading="lazy" decoding="async" className={`use-gallery-static-image use-gallery-static-image-${slot}`}/>)}</div>
  {glOn&&!reduce&&<div className="use-gallery-canvas" aria-hidden="true"><Suspense fallback={null}><UseCaseGalleryScene active={active} reducedMotion={reduce} pointer={pointer} scroll={scroll} onPick={select} onHover={setHover} onReady={onReady}/></Suspense></div>}
 <div className="use-gallery-mobile" aria-hidden="true">{[0,1,2].map(row=><div className={`use-gallery-mobile-row use-gallery-mobile-row-${row}`} key={row}><div className="use-gallery-mobile-track">{Array.from({length:20},(_,i)=><img key={i} src={i%5===4?productImages[(row+i)%4]:photos[(row*8+i%10)%photos.length]} alt="" loading="lazy" decoding="async" width={320} height={200}/>)}</div></div>)}</div>
 <div className="use-gallery-shade" aria-hidden="true"/>
 <div className="use-gallery-center"><div className="use-gallery-copy"><div className="section-kicker">04 / MADE FOR YOUR WORLD</div><h2 id="use-gallery-title">A better flow for<br/> <mark className="headline-highlight">every business.</mark></h2><div className="use-gallery-pills" aria-label="Industries">{cases.map((item,i)=><Button variant="ghost" size="sm" key={item.slug} className={`use-gallery-pill ${active===i?'is-active':''}`} aria-pressed={active===i} onClick={()=>select(i)}>{item.short}</Button>)}</div></div></div>
 {hover!==null&&<div ref={cursor} className="use-gallery-cursor" aria-hidden="true">{cases[hover]?.short}</div>}
 </div>
 <div className="use-gallery-bottom"><div className="use-gallery-controls"><span className="mono-label">EXPLORE INDUSTRIES / 0{active+1} — 06</span><div><Button variant="iconGlass" size="icon" aria-label="Previous use case" onClick={()=>select(active-1)}><ArrowLeft size={18}/></Button><Button variant="iconGlass" size="icon" aria-label="Next use case" onClick={()=>select(active+1)}><ArrowRight size={18}/></Button></div></div>
 {open&&<div className="use-gallery-detail" aria-live="polite"><div><span className="mono-label">0{active+1} / 06</span><h3>{current.title}</h3></div><div className="use-gallery-detail-copy"><div><span>THE CHALLENGE</span><p>{current.pain}</p></div><div><span>THE WAY FORWARD</span><p>{current.answer}</p></div></div><div className="use-gallery-detail-end"><div className="use-tags">{current.tags.map(tag=><span key={tag}>{tag}</span>)}</div><Link className="use-gallery-link" to="/solutions" hash={current.slug}>See solution <ArrowUpRight size={16}/></Link></div></div>}
 </div></section>;
}
export function SecurityTeaser({ onAction, hideNumber = false }: { onAction: (name: string) => void; hideNumber?: boolean }) {
 return <section id="security" className="page-section security-section"><div className="shell security-layout"><div className="security-art" aria-hidden="true"><div className="shield-css"><ShieldCheck size={150} strokeWidth={.5}/></div></div><div className="security-copy"><SectionHeading number={hideNumber ? "" : "08"} label="SECURITY BY DEFAULT" title={<>Trust, built into <mark className="headline-highlight">every transfer.</mark></>} description="Every transaction is recorded on-chain, secured by multi-sig custody, and monitored 24/7."/><Reveal><Button variant="glass" size="hero" onClick={() => onAction("Explore Security")}>Explore Security <ArrowUpRight size={17}/></Button></Reveal><div className="security-badges">{[[LockKeyhole, "Multi-sig custody"], [Snowflake, "Cold storage"], [ShieldCheck, "Smart contract audited"], [ScanSearch, "KYC/AML"]].map(([Icon, text]) => { const I = Icon as typeof LockKeyhole; return <Reveal key={text as string}><I size={15}/>{text as string}<Check size={12}/></Reveal>; })}</div></div></div></section>;
}
