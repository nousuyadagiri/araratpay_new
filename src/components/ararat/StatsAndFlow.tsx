import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type TouchEvent } from "react";
import { ArrowRight, Check, CreditCard, Landmark, Wallet2 } from "lucide-react";
import { SectionHeading, useSafeReducedMotion } from "./SectionBits";
import { AraratMark } from "./AraratLogo";
import { Button } from "@/components/ui/button";

const steps = [
  { name: "Connect", copy: "Set up your merchant account and complete KYB verification.", features: ["KYB verification", "Sandbox access"] },
  { name: "Accept", copy: "Customer pays via wallet connect, QR code, or hosted checkout.", features: ["Payment links", "QR & wallet"] },
  { name: "Convert", copy: "Funds settle on-chain and auto-convert to stablecoin or fiat if selected.", features: ["Rate lock", "Auto-convert"] },
  { name: "Withdraw", copy: "Keep in crypto, cash out to bank, or load a card.", features: ["Bank settlement", "Card balance"] },
] as const;
const stats = [
  { value: "<3 sec", label: "Avg settlement", detail: "crypto-to-crypto" },
  { value: "180+", label: "Fiat currencies" },
  { value: "7+", label: "Blockchains" },
  { value: "0%", label: "Chargebacks" },
];
const qrRows = ["11111110101111111", "10000010101000001", "10111010101011101", "10111010001011101", "10111010111011101", "10000010001000001", "11111110101111111", "00000000000000000", "11010111110101011", "01101000101110100", "10111010111001011", "01001101100101100", "11111110101010111", "10000010110101001", "10111010101111101", "10000010100010101", "11111110110101111"];

function StatusPanel({ step }: { step: number }) {
  return <div key={step} className="invoice-status-panel mf-status" data-surface="light" aria-live="polite">
    {step === 0 && <><div className="invoice-panel-label">STEP 01 · MERCHANT SETUP</div><div className="invoice-setup-list">{["KYB approved · Your Business Ltd.", "API keys issued", "Sandbox ready · payment link created"].map(item => <div key={item}><span className="invoice-tick"><Check size={11}/></span>{item}</div>)}</div></>}
    {step === 1 && <><div className="invoice-panel-label">STEP 02 · CUSTOMER PAYS</div><div className="invoice-currencies">{["USDT", "USDC", "BTC", "ETH"].map((coin, i) => <span className={i === 0 ? "is-active" : ""} key={coin}>{coin}</span>)}</div><div className="invoice-pay-event"><div className="invoice-qr qr-tile" role="img" aria-label="Illustrative QR code, not scannable"><svg viewBox="0 0 17 17" shapeRendering="crispEdges" aria-hidden="true"><g className="qr-modules">{qrRows.flatMap((row, y) => [...row].flatMap((cell, x) => cell === "1" ? [<rect key={`${y}-${x}`} x={x} y={y} width={1} height={1}/>] : []))}</g></svg></div><div><strong><span aria-hidden="true">●</span> Received 250.00 USDT</strong><small>Paid in 2.1s · TRON · 12/12 confirmations</small></div></div></>}
    {step === 2 && <><div className="invoice-panel-label">STEP 03 · AUTO-CONVERT</div><div className="invoice-exchange"><span>250.00 USDT</span><ArrowRight size={17}/><strong>918.00 AED</strong></div><div className="invoice-progress"><span/></div><p className="invoice-panel-note">Rate locked · 3.67 (illustrative)</p><p className="invoice-panel-note">Fee 1% · $2.50 (illustrative)</p></>}
    {step === 3 && <><div className="invoice-panel-label">STEP 04 · SETTLE &amp; WITHDRAW</div><div className="invoice-destinations"><div><span className="invoice-destination-icon"><Landmark size={15}/></span><span><strong>Bank ••• 2210</strong><small>AED 734.40 · 80%</small></span><em><Check size={12}/> Settled</em></div><div><span className="invoice-destination-icon"><Wallet2 size={15}/></span><span><strong>Crypto wallet</strong><small>50.00 USDT · 20%</small></span><em><Check size={12}/> Kept</em></div><div><span className="invoice-destination-icon"><CreditCard size={15}/></span><span><strong>AraratPay Card</strong><small>Spend from balance</small></span><em>Ready</em></div></div></>}
  </div>;
}

function Invoice({ step }: { step: number }) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [paperSize, setPaperSize] = useState({ width: 0, height: 0 });
  const [outlineDrawn, setOutlineDrawn] = useState(step >= 1);
  useEffect(() => {
    if (step >= 1) { setOutlineDrawn(true); return; }
    const timer = window.setTimeout(() => setOutlineDrawn(false), 300);
    return () => window.clearTimeout(timer);
  }, [step]);
  useEffect(() => {
    const paper = paperRef.current;
    if (!paper) return;
    const measure = () => setPaperSize({ width: paper.clientWidth, height: paper.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(paper);
    return () => observer.disconnect();
  }, []);
  const inset = 1.25;
  const radius = 7;
  const rectWidth = Math.max(0, paperSize.width - inset * 2);
  const rectHeight = Math.max(0, paperSize.height - inset * 2);
  const curve = Math.min(radius, rectWidth / 2, rectHeight / 2);
  const perimeter = 2 * (rectWidth + rectHeight - 4 * curve) + 2 * Math.PI * curve;
  return <article className="invoice-object mf-paper-card" data-surface="light" aria-label={`Illustrative invoice 1042, ${steps[step]?.name} payment status`}>
    <div ref={paperRef} className="invoice-paper" data-paid={step >= 1}>
      <div className="invoice-head"><div className="invoice-brand"><AraratMark/><span>ARARATPAY <small>/ INVOICING</small></span></div><span className="invoice-demo">#1042</span></div>
      <div className="invoice-title"><div><span className="invoice-overline">ISSUED INVOICE</span><h3>Invoice <span>#1042</span></h3></div><span className="invoice-date">ISSUED<br/>01 SEP 2026</span></div>
      <div className="invoice-parties"><div><span>FROM</span><strong>Your Business Ltd.</strong><small className="invoice-verified"><Check size={11}/> KYB verified</small></div><div><span>BILL TO</span><strong>Customer</strong><small>wallet 0x8a2…f41b</small></div></div>
      <div className="invoice-table"><div className="invoice-table-head"><span>DESCRIPTION</span><span>AMOUNT</span></div><div className="invoice-row"><span>Design retainer <small>· Sep</small></span><strong>200.00 USDT</strong></div><div className="invoice-row"><span>Hosting &amp; support</span><strong>50.00 USDT</strong></div></div>
      <div className="invoice-total"><span>Total due</span><strong>250.00 <small>USDT</small></strong></div>
      <div className="invoice-paper-foot"><span>POWERED BY ARARATPAY</span><span>ILLUSTRATIVE · NOT PAYABLE</span></div>
      <div className="invoice-stamp" aria-hidden="true"><span>PAID</span><small>CONFIRMED · 2.1s</small></div>
      {paperSize.width > 0 && paperSize.height > 0 && <svg className="invoice-paid-outline" viewBox={`0 0 ${paperSize.width} ${paperSize.height}`} preserveAspectRatio="none" aria-hidden="true"><rect x={inset} y={inset} width={rectWidth} height={rectHeight} rx={curve} ry={curve} strokeDasharray={perimeter} strokeDashoffset={outlineDrawn ? 0 : perimeter}/></svg>}
    </div>
    
  </article>;
}

const paymentPills = [
  ["KYB approved", "Payment link ready", "Sandbox ready"],
  ["USDT received", "Paid in 2.1s", "250.00 USDT"],
  ["Rate locked", "Auto-converting", "918.00 AED"],
  ["Bank AED 734 settled", "Card ready", "Crypto wallet · 50 USDT"],
] as const;

export const invoiceStepInterval = 1600;

export function MoneyFlow() {
  const sectionRef = useRef<HTMLElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const interacting = useRef(false);
  const touchStart = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [path, setPath] = useState("");
  const reduce = useSafeReducedMotion();
  const shown = reduce ? 3 : active;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 22 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 22 });
  const rotateY = useTransform(smoothX, [-1, 1], [-14, -2]);
  const rotateX = useTransform(smoothY, [-1, 1], [10, -2]);
  const pillX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const pillY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (reduce || !inView) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const focusedStep = document.activeElement?.closest(".mf-step-card");
      const hoveredStep = sectionRef.current?.querySelector(".mf-step-card:hover");
      if (!interacting.current && !focusedStep && !hoveredStep) setActive(value => (value + 1) % 4);
    }, invoiceStepInterval);
    return () => window.clearInterval(timer);
  }, [reduce, inView]);
  useEffect(() => {
    const layout = layoutRef.current;
    const invoice = invoiceRef.current;
    if (!layout || !invoice) return;
    const measure = () => {
      const card = layout.querySelector<HTMLElement>(`[data-step-card="${shown}"]`);
      if (!card) return;
      const base = layout.getBoundingClientRect();
      const left = card.getBoundingClientRect();
      const right = invoice.getBoundingClientRect();
      const x = left.right - base.left - 10;
      const y = left.top + left.height / 2 - base.top;
      const endX = right.left - base.left + 25;
      const endY = right.top + right.height / 2 - base.top;
      setPath(`M ${x} ${y} C ${x + 85} ${y}, ${endX - 100} ${endY}, ${endX} ${endY}`);
    };
    const timer = window.setTimeout(measure, 380);
    const observer = new ResizeObserver(measure);
    observer.observe(layout);
    return () => { window.clearTimeout(timer); observer.disconnect(); };
  }, [shown]);
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || !window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)));
    pointerY.set(Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)));
  };
  const onSwipeEnd = (event: TouchEvent<HTMLElement>) => {
    const endX = event.changedTouches[0]?.clientX;
    const distance = touchStart.current === null || endX === undefined ? 0 : endX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) > 55 && !reduce) setActive(Math.max(0, Math.min(3, active + (distance < 0 ? 1 : -1))));
  };
  return <section ref={sectionRef} id="money-flow" className="invoice-section mf-section" data-step={shown} data-reduced={reduce} aria-label="How value moves" onTouchStart={event => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={onSwipeEnd}>
    <div className="shell invoice-shell">
      <div className="invoice-intro"><SectionHeading number="01" label="HOW VALUE MOVES" title="From payment to possibility."/><p>One connected flow. Every way to move money.</p></div>
      <div ref={layoutRef} className="mf-layout">
        <div className="mf-left"><div className="mf-staircase" role="group" aria-label="Payment journey steps">{steps.map((step, index) => <div className="mf-step-position" key={step.name} data-index={index}>
          <Button variant="ghost" type="button" className="mf-step-card" data-step-card={index} data-status={index < shown ? "done" : index === shown ? "active" : "upcoming"} data-surface={index === shown ? "light" : undefined} aria-pressed={shown === index} disabled={reduce} onPointerEnter={() => { interacting.current = true; }} onPointerLeave={() => { interacting.current = false; }} onPointerDown={() => { interacting.current = true; }} onPointerUp={event => { interacting.current = event.currentTarget.matches(":hover, :focus"); }} onPointerCancel={() => { interacting.current = false; }} onFocus={() => { interacting.current = true; }} onBlur={() => { interacting.current = false; }} onClick={() => setActive(index)}>
            <span className="mf-step-badge">{index < shown ? <Check size={17}/> : `0${index + 1}`}</span><span className="mf-step-copy"><span className="mf-step-top"><strong>{step.name}.</strong><span>0{index + 1} / 04</span></span><span className="mf-step-description">{step.copy}</span><span className="mf-step-chips">{step.features.map(feature => <span key={feature}>{feature}</span>)}</span></span>
          </Button></div>)}</div>
          <div className="invoice-stats mf-stats" aria-label="AraratPay platform figures">{stats.map(stat => <div className="invoice-stat" data-surface="light" key={stat.label}><strong>{stat.value}</strong><div><span>{stat.label}</span>{"detail" in stat && <small>{stat.detail}</small>}</div></div>)}</div>
        </div>
        {!reduce && path && <div className="mf-transfer" aria-hidden="true"><svg><path d={path}/></svg><div key={shown} className="mf-coins" style={{ offsetPath: `path('${path}')` } as CSSProperties}><span>$</span></div><div key={`teal-${shown}`} className="mf-coins mf-coins--teal" style={{ offsetPath: `path('${path}')` } as CSSProperties}><span>T</span></div></div>}
        <div className="mf-invoice-stage" onPointerMove={onPointerMove} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}>
          <div className="invoice-stage-heading"><span>INVOICE GETS PAID</span><span>01 — 04 / ILLUSTRATIVE</span></div>
          <div className="mf-invoice-scene">
            <motion.div ref={invoiceRef} className="mf-invoice-tilt" style={reduce ? {} : { rotateX, rotateY }}>
              <div className="mf-invoice-float"><div className="mf-stack-layer mf-stack-layer--back"/><div className="mf-stack-layer"/><Invoice step={shown}/></div>
            </motion.div>
            <motion.div className="mf-pills" style={reduce ? {} : { x: pillX, y: pillY }} aria-live="polite">{paymentPills[shown]?.map((label, index) => <div className={`mf-pill mf-pill--${index}`} data-surface={index === 1 ? undefined : "light"} key={`${index}-${label}`}><span className="mf-pill-dot"/>{label}</div>)}</motion.div>
          </div>
          <div className="mf-progress" aria-label={`Payment progress: ${steps[shown]?.name}`}>{steps.map((step, index) => <span data-current={index === shown} data-complete={index < shown} key={step.name}><i>{index < shown ? <Check size={10}/> : index + 1}</i>{step.name}</span>)}</div>
          <StatusPanel step={shown}/>
        </div>
      </div>
    </div>
  </section>;
}
