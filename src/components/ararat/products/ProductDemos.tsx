import { useEffect, useState } from "react";
import { Check, Loader2, Lock, RefreshCw, RotateCcw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { ProductSlug } from "./productData";

const coins = [
  { sym: "BTC", name: "Bitcoin", rate: 0.0000041 },
  { sym: "ETH", name: "Ethereum", rate: 0.000095 },
  { sym: "USDT", name: "Tether · TRON", rate: 0.9999 },
  { sym: "USDC", name: "USD Coin", rate: 1 },
];

function CheckoutDemo() {
  const [coin, setCoin] = useState(coins[2]!);
  const [left, setLeft] = useState(180);
  const [stage, setStage] = useState<"idle" | "paying" | "done">("idle");
  useEffect(() => {
    if (stage !== "idle") return;
    const t = setInterval(() => setLeft(s => (s <= 1 ? 180 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [stage]);
  const pay = () => { setStage("paying"); setTimeout(() => setStage("done"), 1600); };
  const reset = () => { setStage("idle"); setLeft(180); };
  const amount = (250 * coin.rate).toFixed(coin.sym === "BTC" ? 6 : coin.sym === "ETH" ? 5 : 2);
  return <div className="pp-demo-card">
    <div className="mini-header"><span>ILLUSTRATIVE CHECKOUT · $250.00</span><span className="text-primary"><Lock size={11}/> RATE LOCK · {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}</span></div>
    {stage === "done" ? <div className="pp-confirm"><span className="pp-check"><Check size={28}/></span><strong>Payment confirmed</strong><small>{amount} {coin.sym} · settled on-chain</small><Button variant="glass" onClick={reset}><RotateCcw size={14}/> Try again</Button></div> : <>
      <div className="pp-coin-grid" role="radiogroup" aria-label="Choose a coin">{coins.map(c => <button key={c.sym} role="radio" aria-checked={coin.sym === c.sym} className={`pp-coin ${coin.sym === c.sym ? "is-active" : ""}`} onClick={() => setCoin(c)} disabled={stage === "paying"}><strong>{c.sym}</strong><small>{c.name}</small></button>)}</div>
      <div className="mini-row"><span>Amount due</span><strong>{amount} {coin.sym}</strong></div>
      <div className="mini-row"><span>Rate (illustrative)</span><strong>1 USD = {coin.rate} {coin.sym}</strong></div>
      <Button variant="brand" size="hero" className="pp-full" onClick={pay} disabled={stage === "paying"}>{stage === "paying" ? <><Loader2 className="animate-spin" size={16}/> Confirming on-chain…</> : <>Pay {amount} {coin.sym}</>}</Button>
    </>}
  </div>;
}

const payoutRows = [
  ["0x8f3a…21c9", "1,250.00 USDT", "TRON"], ["0x4b7e…9a02", "840.00 USDC", "Ethereum"], ["bc1q…7xk4", "0.0150 BTC", "Bitcoin"],
  ["0x1d9c…e5f0", "2,400.00 USDT", "Polygon"], ["0x77aa…03bd", "0.45 ETH", "Ethereum"],
];
function BatchDemo() {
  const [loaded, setLoaded] = useState(false);
  const [done, setDone] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (done >= payoutRows.length) { setRunning(false); return; }
    const t = setTimeout(() => setDone(d => d + 1), 700);
    return () => clearTimeout(t);
  }, [running, done]);
  return <div className="pp-demo-card">
    <div className="mini-header"><span>payouts_batch.csv</span><span>{done}/{payoutRows.length} COMPLETED</span></div>
    {!loaded ? <button className="pp-drop" onClick={() => setLoaded(true)}><Upload size={22}/><strong>Load sample CSV</strong><small>5 illustrative rows · no real transfers</small></button> : <>
      <div className="pp-table">{payoutRows.map((r, i) => { const status = i < done ? "Completed" : running && i === done ? "Processing" : "Queued"; return <div className="pp-table-row" key={r[0]}><span className="mono">{r[0]}</span><span>{r[2]}</span><strong>{r[1]}</strong><em className={status === "Completed" ? "success-text" : status === "Processing" ? "warning-text" : ""}>{status === "Processing" && <Loader2 className="animate-spin" size={11}/>}{status === "Completed" && <Check size={11}/>}{status}</em></div>; })}</div>
      <div className="pp-demo-actions">{done >= payoutRows.length ? <Button variant="glass" onClick={() => { setDone(0); setLoaded(false); }}><RotateCcw size={14}/> Reset</Button> : <Button variant="brand" onClick={() => setRunning(true)} disabled={running}>{running ? "Sending…" : "Send batch"}</Button>}</div>
    </>}
  </div>;
}

function SettlementDemo() {
  const [pct, setPct] = useState(50);
  const [volume, setVolume] = useState(20000);
  const bank = volume * pct / 100, crypto = volume - bank;
  const fmt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return <div className="pp-demo-card">
    <div className="mini-header"><span>AUTO-SETTLEMENT RULE</span><span>ILLUSTRATIVE</span></div>
    <div className="pp-presets">{[100, 50].map(p => <Button key={p} variant={pct === p ? "brand" : "glass"} size="sm" onClick={() => setPct(p)}>{p}% to bank</Button>)}<Button variant={pct !== 100 && pct !== 50 ? "brand" : "glass"} size="sm" onClick={() => setPct(30)}>Custom</Button></div>
    <label className="pp-slider"><span>Monthly incoming crypto <strong>${fmt(volume)}</strong></span><Slider min={1000} max={100000} step={1000} value={[volume]} onValueChange={v => setVolume(v[0] ?? volume)} aria-label="Monthly incoming crypto"/></label>
    <label className="pp-slider"><span>Share settled to bank <strong>{pct}%</strong></span><Slider min={0} max={100} step={5} value={[pct]} onValueChange={v => setPct(v[0] ?? pct)} aria-label="Share settled to bank"/></label>
    <div className="pp-split"><span style={{ width: `${pct}%` }} className="pp-split-bank"/><span style={{ width: `${100 - pct}%` }} className="pp-split-crypto"/></div>
    <div className="pp-split-legend"><div><small>TO BANK ACCOUNT</small><strong>${fmt(bank)}</strong></div><div><small>STAYS IN CRYPTO</small><strong>${fmt(crypto)}</strong></div></div>
    <div className="mini-row"><span>AraratPay transaction fee</span><strong>1%</strong></div>
  </div>;
}

function CardDemo() {
  const [flipped, setFlipped] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [limit, setLimit] = useState(2500);
  return <div className="pp-demo-card">
    <div className="mini-header"><span>ILLUSTRATIVE VIRTUAL CARD</span><span className={frozen ? "warning-text" : "success-text"}>{frozen ? "FROZEN" : "ACTIVE"}</span></div>
    <button className={`pp-card3d ${flipped ? "is-flipped" : ""} ${frozen ? "is-frozen" : ""}`} onClick={() => setFlipped(f => !f)} aria-label="Flip illustrative card">
      <span className="pp-card-face pp-card-front"><span className="pp-card-top"><span>ARARAT<b>PAY</b></span><span>◈</span></span><span className="card-chip">▦</span><span className="pp-card-bottom"><span>•••• •••• •••• 4829</span><span>VIRTUAL</span></span></span>
      <span className="pp-card-face pp-card-back"><span className="pp-card-stripe"/><span className="pp-card-cvv">CVV •••</span><span className="pp-card-limit">Limit ${limit.toLocaleString()}/mo</span></span>
    </button>
    <div className="pp-demo-actions"><Button variant="glass" size="sm" onClick={() => setFlipped(f => !f)}><RefreshCw size={13}/> Flip</Button><label className="freeze-row"><span><Lock size={14}/> Freeze</span><Switch checked={frozen} onCheckedChange={setFrozen} aria-label="Freeze illustrative card"/></label></div>
    <label className="pp-slider"><span>Monthly spend limit <strong>${limit.toLocaleString()}</strong></span><Slider min={100} max={10000} step={100} value={[limit]} onValueChange={v => setLimit(v[0] ?? limit)} aria-label="Monthly spend limit"/></label>
  </div>;
}

export default function ProductDemo({ slug }: { slug: ProductSlug }) {
  if (slug === "crypto-in") return <CheckoutDemo/>;
  if (slug === "crypto-out") return <BatchDemo/>;
  if (slug === "fiat-out") return <SettlementDemo/>;
  return <CardDemo/>;
}
