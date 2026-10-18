import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Check, ScanLine } from 'lucide-react';
import { useMedia } from '../perf';

const stages = ['SCAN TO PAY', 'DETECTED', 'CONFIRMING…', 'PAID · FINAL'] as const;
export default function CryptoInSignature() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMedia('(prefers-reduced-motion: reduce)');
  useEffect(() => { if (!ref.current) return; const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: .2 }); io.observe(ref.current); return () => io.disconnect(); }, []);
  useEffect(() => { if (!visible || reduce) return; const id = window.setInterval(() => { if (!document.hidden) setStep(s => (s + 1) % stages.length); }, 2300); return () => clearInterval(id); }, [visible, reduce]);
  const current = reduce ? 3 : step;
  return <div className="flow-signature" ref={ref} aria-label="Illustrative QR payment from scan to final confirmation">
    
    <motion.div className="flow-phone" initial={false} animate={reduce ? {} : { y: [0, -7, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
      <div className="flow-phone-notch"/><div className="flow-phone-top"><span>ARARATPAY / CRYPTO IN</span><ScanLine size={17}/></div>
      <div className="flow-phone-content"><span className="flow-phone-kicker">PAY ARARAT CAFE</span><strong>24.50 <small>USDT</small></strong><div className="flow-qr qr-tile" role="img" aria-label="Illustrative QR code, not scannable"><QRCodeSVG value="araratpay:illustrative:ararat-cafe:24.50-USDT" size={138} marginSize={0} fgColor="var(--qr-ink)" bgColor="var(--qr-paper)" shapeRendering="crispEdges" aria-hidden="true"/></div><span className="flow-qr-caption">ILLUSTRATIVE PAYMENT · NOT A LIVE ADDRESS</span></div>
      <div className={`flow-phone-status ${current === 3 ? 'is-final' : ''}`} aria-live="polite"><span>{current === 3 ? <Check size={14}/> : <i/>}{stages[current]}</span><div className="flow-status-track"><motion.i initial={false} animate={{ width: `${(current + 1) * 25}%` }} transition={{ duration: reduce ? 0 : .5 }}/></div></div>
    </motion.div>
    <div className="flow-signature-side"><span>01 / 04</span><strong>PAYMENT<br/>CONFIRMED</strong><small>One balance. Four flows.</small></div>
  </div>;
}
