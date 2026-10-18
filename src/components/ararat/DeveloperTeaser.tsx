import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Code2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading, useSafeReducedMotion } from "./SectionBits";
const snippets = {
 "Node.js": `const payment = await araratpay.paymentIntents.create({\n  amount: 25000,\n  currency: 'USD',\n  payment_method: 'crypto',\n  settlement: 'USDT'\n});`,
 "Python": `payment = araratpay.payment_intents.create(\n    amount=25000,\n    currency='USD',\n    payment_method='crypto',\n    settlement='USDT'\n)`,
 "cURL": `curl -X POST https://api.araratpay.com/v1/payment_intents \\\n  -H 'Content-Type: application/json' \\\n  -d '{"amount":25000,"currency":"USD",\n       "payment_method":"crypto"}'`,
};
type Language = keyof typeof snippets;
export default function DeveloperTeaser({ onAction, hideNumber = false }: { onAction: (name: string) => void; hideNumber?: boolean }) {
 const [language, setLanguage] = useState<Language>("Node.js"); const [length, setLength] = useState(0); const [copied, setCopied] = useState(false); const reduce = useSafeReducedMotion();
 useEffect(() => { if (reduce) { setLength(snippets[language].length); return; } setLength(0); const id = window.setInterval(() => setLength(n => { if (n >= snippets[language].length) { clearInterval(id); return n; } return n + 2; }), 22); return () => clearInterval(id); }, [language, reduce]);
 const copy = async () => { try { await navigator.clipboard.writeText(snippets[language]); setCopied(true); window.setTimeout(() => setCopied(false), 2000); } catch { setCopied(false); } };
 return <section id="developers" className="page-section developer-section"><div className="shell developer-layout"><div className="developer-copy"><SectionHeading number={hideNumber ? "" : "08"} label="FOR THE BUILDERS" title="Built API-first." description="Free sandbox, no credit card required. Everything you need to go from your first request to your first payment."/><Reveal><Button variant="brand" size="hero" onClick={() => onAction("Read the Docs")}>Read the Docs <ArrowUpRight size={17}/></Button></Reveal></div><Reveal className="code-window"><div className="code-top"><div className="code-tabs">{(Object.keys(snippets) as Language[]).map(item => <Button key={item} variant="ghost" size="sm" className={language === item ? "is-selected" : ""} onClick={() => setLanguage(item)}>{item}</Button>)}</div><Button variant="ghost" size="icon" aria-label={copied ? "Code copied" : "Copy code"} title="Copy code" onClick={copy}>{copied ? <Check size={15}/> : <Copy size={15}/>}</Button></div><div className="code-file"><Code2 size={14}/> create-payment-intent.{language === "Python" ? "py" : language === "cURL" ? "sh" : "js"}</div><pre><code>{snippets[language].slice(0, length)}</code><span className="typing-cursor"/></pre><div className="code-response"><span>RESPONSE <span className="success-text">● 201 CREATED</span></span><pre>{`{\n  "id": "pi_illustrative_8x72",\n  "status": "pending",\n  "amount": 25000,\n  "currency": "USD"\n}`}</pre></div></Reveal></div></section>;
}
