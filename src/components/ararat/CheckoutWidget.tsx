import { useEffect, useState } from "react";
import { ArrowDownLeft, Check, CreditCard, Landmark, LockKeyhole, Wallet2 } from "lucide-react";
import { AraratMark } from "./AraratLogo";

export const payoutNames = ["Crypto", "Bank", "Card"] as const;
export function CheckoutWidget({ step, payoutIndex = 0 }: { step: number; payoutIndex?: number }) {
  const verified = step === 0;
  return <div className={`checkout-widget flow-checkout ${verified ? "is-verified" : ""}`} aria-label={verified ? "Illustrative: merchant verified, KYB approved" : `Illustrative transaction, ${step === 3 ? "settled" : step === 2 ? "converting" : "received"}`}>
    <div className="widget-top"><div className="widget-brand"><span className="widget-logo"><AraratMark/></span><span>Ararat<span>pay</span></span></div><span className="widget-live"><span/> LIVE TRANSACTION</span></div>
    <div className="widget-rule"/>
    <div className="widget-payment"><div className="widget-payment-icon">{verified ? <Check size={22}/> : <ArrowDownLeft size={22}/>}</div><div><span className="widget-label">{verified ? "MERCHANT VERIFIED" : step === 3 ? "SETTLEMENT COMPLETE" : "PAYMENT RECEIVED"}</span><div className={`widget-amount ${step === 3 ? "flow-complete" : ""}`}>{verified ? <>KYB <span>APPROVED</span></> : step === 3 ? <>$250.00 <span>SETTLED</span></> : <>250.00 <span>USDT</span></>}</div></div></div>
    <div className="widget-sequence">
      <div className={`sequence-step ${step >= 1 ? "is-active" : ""}`}><span className="step-node"><Check size={12}/></span><span>Customer paid <strong>250 USDT</strong></span><span className="step-time">{step >= 1 ? "JUST NOW" : "UP NEXT"}</span></div>
      <div className={`sequence-step ${step >= 2 ? "is-active" : ""}`}><span className="step-node"><LockKeyhole size={11}/></span><span>Smart-contract settlement</span></div>
      <div className={`sequence-step ${step >= 3 ? "is-active is-complete" : ""}`}><span className="step-node"><Check size={12}/></span><span>Settled <strong>$250.00</strong></span>{step === 3 && <span className="step-success">COMPLETE</span>}</div>
    </div>
    <div className="widget-footer"><span>PAYOUT TO</span><div className="payout-options"><span className={step === 3 && payoutIndex === 0 ? "is-selected" : ""}><Wallet2 size={12}/> Crypto</span><span className={step === 3 && payoutIndex === 1 ? "is-selected" : ""}><Landmark size={12}/> Bank</span><span className={step === 3 && payoutIndex === 2 ? "is-selected" : ""}><CreditCard size={12}/> Card</span></div></div>
    <span className="flow-demo-label">ILLUSTRATIVE</span>
  </div>;
}

export function usePayoutCycle(active: boolean, reducedMotion: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!active || reducedMotion) { setIndex(0); return; }
    const timer = window.setInterval(() => setIndex(i => (i + 1) % payoutNames.length), 2300);
    return () => window.clearInterval(timer);
  }, [active, reducedMotion]);
  return index;
}
