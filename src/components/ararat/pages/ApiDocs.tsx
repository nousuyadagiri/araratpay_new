import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, Copy, Menu, Play, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { docs, errors, type Doc } from "./docsData";

type Language = "cURL" | "Node.js" | "Python" | "PHP";
const languages: Language[] = ["cURL", "Node.js", "Python", "PHP"];
const groups = [...new Set(docs.map(d => d.group))];
const exampleBody = (doc: Doc) => {
  if (doc.id === "create-payment") return { amount: 25000, asset: "USDT", chain: "tron", settle_to: "USD", metadata: { order_id: "illustrative_1042" }, success_url: "https://example.test/success" };
  if (doc.id === "create-payout") return { amount: 25000, asset: "USDT", chain: "tron", destination: "T_ILLUSTRATIVE_NOT_A_WALLET" };
  if (doc.id === "batch-payouts") return { items: [{ amount: 25000, asset: "USDT", destination: "ILLUSTRATIVE_ONLY" }] };
  if (doc.id === "create-conversion") return { amount: 25000, from_asset: "USDT", to_asset: "USD" };
  if (doc.id === "create-payment-link") return { amount: 25000, asset: "USDT", description: "Illustrative order" };
  if (doc.id === "settlement-rules") return { currency: "USD", destination_id: "dest_illustrative_01" };
  if (doc.id === "create-card") return { holder_id: "holder_illustrative_01", type: "virtual" };
  if (doc.id === "update-card") return { frozen: true, limit: 50000 };
  return {};
};
function responseFor(doc: Doc, error = false) {
  if (error) return JSON.stringify({ error: { code: "invalid_request", message: "Required field 'amount' is missing (illustrative)." } }, null, 2);
  if (doc.method === "EVT") return JSON.stringify({ id: "evt_illustrative_001", type: doc.path, data: { id: "obj_illustrative_001", status: "completed" } }, null, 2);
  if (!doc.method) return JSON.stringify({ preview: true, message: "Illustrative documentation only" }, null, 2);
  const kind = doc.group === "Payments" ? "payment" : doc.group === "Cards" ? "card" : doc.group === "Payouts" ? "payout" : doc.group === "Conversions" ? "conversion" : doc.group === "Settlements" ? "settlement" : doc.group === "Balances" ? "balance" : "payment_link";
  return JSON.stringify({ id: `${kind}_illustrative_8x72`, object: kind, status: doc.method === "POST" ? "pending" : "completed", ...(doc.group === "Payments" ? { amount: 25000, asset: "USDT", checkout_url: "https://checkout.example.test/illustrative" } : {}), ...(doc.method === "GET" && doc.path?.endsWith("s") ? { data: [], next_cursor: null } : {}) }, null, 2);
}
function requestFor(doc: Doc, language: Language) {
  const method = doc.method === "EVT" ? "POST" : doc.method || "GET";
  const path = doc.method === "EVT" ? "/your-webhook-endpoint" : doc.path || "/v1/payments";
  const url = doc.method === "EVT" ? `https://example.test${path}` : `https://api.araratpay.com${path.replace(":id", "payment_illustrative_8x72")}`;
  const body = JSON.stringify(exampleBody(doc), null, 2);
  if (language === "Node.js") return `// Illustrative — do not send this request\nconst response = await fetch('${url}', {\n  method: '${method}',\n  headers: { Authorization: 'Bearer sk_test_…',\n    'Content-Type': 'application/json' },${method !== "GET" ? `\n  body: JSON.stringify(${body})` : ""}\n});\nconst data = await response.json();`;
  if (language === "Python") return `# Illustrative — no live endpoint\nimport requests\n\nresponse = requests.${method.toLowerCase()}(\n  '${url}',\n  headers={'Authorization': 'Bearer sk_test_…'},${method !== "GET" ? `\n  json=${body.replace(/"([^\"]+)":/g, "'$1':")},` : ""}\n)\ndata = response.json()`;
  if (language === "PHP") return `<?php\n// Illustrative — no live endpoint\n$ch = curl_init('${url}');\ncurl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${method}');\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n  'Authorization: Bearer sk_test_…',\n  'Content-Type: application/json'\n]);${method !== "GET" ? `\ncurl_setopt($ch, CURLOPT_POSTFIELDS, '${JSON.stringify(exampleBody(doc))}');` : ""}\n$response = curl_exec($ch);`;
  return `# Illustrative — no live endpoint\ncurl -X ${method} '${url}' \\\n  -H 'Authorization: Bearer sk_test_…' \\\n  -H 'Content-Type: application/json'${method !== "GET" ? ` \\\n  -d '${JSON.stringify(exampleBody(doc))}'` : ""}`;
}
// Small inline tokenizer, no runtime highlighting dependency or HTML injection.
function Highlight({ code }: { code: string }) {
  const lines = code.split("\n");
  const rx = /("(?:[^"\\]|\\.)*"(?=\s*:)|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:const|await|fetch|return|import|from|curl|requests|response|json|headers|method|true|false|null|None)\b|\b\d+(?:\.\d+)?\b|(?:#|\/\/)[^\n]*)/g;
  return <pre className="api-code-pre"><code>{lines.map((line, i) => <span className="api-code-line" key={i}><span className="api-line-no" aria-hidden="true">{i + 1}</span><span>{line.split(rx).filter(Boolean).map((part, j) => <span key={j} className={part.startsWith("#") || part.startsWith("//") ? "api-syn-comment" : /^['"]/.test(part) ? /^".*"$/.test(part) && line.includes(`${part}:`) ? "api-syn-key" : "api-syn-string" : /^\d/.test(part) ? "api-syn-number" : /^(true|false|null|None)$/.test(part) ? "api-syn-number" : /^(const|await|fetch|return|import|from|curl|requests|response|json|headers|method)$/.test(part) ? "api-syn-keyword" : undefined}>{part}</span>)}</span></span>)}</code></pre>;
}
function CodePanel({ doc, language, setLanguage }: { doc: Doc; language: Language; setLanguage: (l: Language) => void }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { setResult(""); setStreaming(false); setLoading(false); if (timer.current) clearTimeout(timer.current); }, [doc.id]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (!streaming) return; const target = responseFor(doc, simulateError); if (result.length >= target.length) { setStreaming(false); return; } timer.current = setTimeout(() => setResult(target.slice(0, result.length + 9)), 18); return () => { if (timer.current) clearTimeout(timer.current); }; }, [streaming, result, doc, simulateError]);
  const request = requestFor(doc, language);
  const copy = async () => { try { await navigator.clipboard.writeText(request); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } };
  const tryIt = () => { if (timer.current) clearTimeout(timer.current); setResult(""); setStreaming(false); setLoading(true); timer.current = setTimeout(() => { setLoading(false); setStreaming(true); }, 400); };
  return <aside className="api-code-panel" aria-label={`Code examples for ${doc.title}`}>
    <div className="api-code-head"><span>REQUEST <span className="api-code-dot"/> {doc.title}</span><span className="api-code-preview">ILLUSTRATIVE ENVIRONMENT</span></div>
    <div className="api-code-base">https://api.araratpay.com/v1 <span>(illustrative)</span></div>
    <div className="api-code-tabs" role="tablist" aria-label="Code language">{languages.map(l => <Button type="button" variant="ghost" size="sm" role="tab" aria-selected={language === l} className={language === l ? "is-active" : ""} key={l} onClick={() => setLanguage(l)}>{l}</Button>)}</div>
    <div className="api-code-toolbar"><span>REQUEST / {language}</span><Button variant="ghost" size="sm" onClick={copy} aria-label="Copy request code">{copied ? <Check/> : <Copy/>}{copied ? "Copied" : "Copy"}</Button></div>
    <div className="api-code-scroll"><Highlight code={request}/></div>
    <div className="api-code-actions"><Button variant="brand" size="sm" onClick={tryIt} disabled={loading}><Play size={13}/>{loading ? "Running illustrative…" : "Try it"}</Button><label className="api-error-toggle"><input type="checkbox" checked={simulateError} onChange={e => setSimulateError(e.target.checked)}/> Simulate error</label></div>
    <div className="api-code-toolbar api-response-heading"><span>RESPONSE / JSON</span>{result && <span className={simulateError ? "api-result-error" : "api-result-ok"}>{simulateError ? "400 ERROR" : "200 OK"} · 184ms (illustrative)</span>}</div>
    <div className="api-code-scroll api-response"><Highlight code={result || responseFor(doc)}/></div>
    <div className="api-code-foot">Examples only · no network request is sent</div>
  </aside>;
}
function ReferenceBlock({ doc, active, language, setLanguage }: { doc: Doc; active: boolean; language: Language; setLanguage: (l: Language) => void }) {
  const blockRef = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => { const el = blockRef.current; if (!el) return; const observer = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) { setNear(true); observer.disconnect(); } }, { rootMargin: "800px 0px" }); observer.observe(el); return () => observer.disconnect(); }, []);
  return <section ref={blockRef} className="api-reference-block" id={doc.id} data-doc-id={doc.id} aria-label={doc.title}>
    <div className="api-reference-inner"><div className="api-path">{doc.method && <span className={`api-method method-${doc.method.toLowerCase()}`}>{doc.method}</span>}<code>{doc.path || doc.group.toUpperCase()}</code></div><h2>{doc.title}</h2><p>{doc.description}</p>
      {doc.note && <div className="api-inline-note"><code>{doc.note}</code></div>}
      {doc.id === "errors" && <><h3>Error codes</h3><div className="api-table-wrap"><table><thead><tr><th>Code</th><th>HTTP</th><th>Meaning</th></tr></thead><tbody>{errors.map(e => <tr key={e[0]}><td><code>{e[0]}</code></td><td>{e[1]}</td><td>{e[2]}</td></tr>)}</tbody></table></div></>}
      {doc.params && <><h3>Parameters</h3>{doc.params.length ? <div className="api-table-wrap"><table><thead><tr><th>Name</th><th>Type</th><th>Requirement</th><th>Description</th></tr></thead><tbody>{doc.params.map(p => <tr key={p[0]}><td><code>{p[0]}</code></td><td>{p[1]}</td><td><span className={`api-required ${p[2] === "required" ? "is-required" : ""}`}>{p[2]}</span></td><td>{p[3]}</td></tr>)}</tbody></table></div> : <p className="api-no-params">No parameters.</p>}</>}
      {doc.returns && <div className="api-returns"><h3>Returns</h3><p>{doc.returns}</p>{doc.fields && <details><summary>Response fields <ChevronDown size={15}/></summary><div className="api-table-wrap"><table><tbody>{doc.fields.map(f => <tr key={f[0]}><td><code>{f[0]}</code></td><td>{f[1]}</td><td>{f[3]}</td></tr>)}</tbody></table></div></details>}</div>}
    </div><div className="api-inline-code">{near && <CodePanel doc={doc} language={language} setLanguage={setLanguage}/>}</div>
  </section>;
}
const tools = [["Node.js", "npm install @araratpay/sdk"], ["Python", "pip install araratpay"], ["PHP", "composer require araratpay/sdk"], ["Java", "Java library · planned"], ["Shopify", "Commerce integration · planned"], ["WooCommerce", "Commerce integration · planned"]];
export default function ApiDocs() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("introduction");
  const [language, setLanguage] = useState<Language>("cURL");
  const [menuOpen, setMenuOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const manualUntil = useRef(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => docs.filter(d => `${d.title} ${d.group} ${d.method || ""} ${d.path || ""}`.toLowerCase().includes(search.toLowerCase())), [search]);
  useEffect(() => { try { const saved = sessionStorage.getItem("ararat-doc-language") as Language; if (languages.includes(saved)) setLanguage(saved); } catch { /* unavailable */ } }, []);
  const changeLanguage = (l: Language) => { setLanguage(l); try { sessionStorage.setItem("ararat-doc-language", l); } catch { /* unavailable */ } };
  useEffect(() => { const key = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchRef.current?.focus(); } }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, []);
  useEffect(() => {
    const root = container.current;
    if (!root) return;
    const blocks = [...root.querySelectorAll<HTMLElement>(".api-reference-block")];
    let raf = 0;
    const update = () => { raf = 0; if (Date.now() < manualUntil.current) return; const top = window.matchMedia("(min-width: 1100px)").matches ? 110 : 160; const nearest = blocks.filter(el => el.getBoundingClientRect().top <= top + 90).at(-1) || blocks[0]; if (nearest?.dataset["docId"]) setActive(nearest.dataset["docId"]); };
    const observer = new IntersectionObserver(() => { if (!raf) raf = requestAnimationFrame(update); }, { rootMargin: "-100px 0px -65% 0px", threshold: [0, .25, .5, 1] });
    blocks.forEach(el => observer.observe(el)); update();
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  const jump = (doc: Doc) => { manualUntil.current = Date.now() + 2000; setActive(doc.id); setMenuOpen(false); history.replaceState(null, "", `#${doc.id}`); document.getElementById(doc.id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); };
  const nav = <nav className="api-nav-list" aria-label="API reference navigation">{groups.map(group => { const items = filtered.filter(d => d.group === group); return items.length ? <div className="api-nav-group" key={group}><div className="api-nav-title">{group}</div>{items.map(d => <Button variant="ghost" className={`api-nav-item ${active === d.id ? "is-active" : ""}`} key={d.id} onClick={() => jump(d)} aria-current={active === d.id ? "location" : undefined}><span className="api-nav-label">{d.title}</span>{d.method && <span className={`api-method method-${d.method.toLowerCase()}`}>{d.method}</span>}</Button>)}</div> : null})}{!filtered.length && <p className="api-empty">No matching docs.</p>}</nav>;
  const current = docs.find(d => d.id === active) || docs[0];
  return <div className="api-docs">
    <header className="api-page-header"><div className="api-head-main"><div><span className="mono-label">DEVELOPERS</span><h1>Built API-first, for builders who move fast.</h1><p>Accept, pay out, convert and issue cards with one REST API.</p></div><div className="api-head-controls"><label className="api-search"><Search size={17}/><input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search docs…" aria-label="Search docs"/><kbd>⌘K</kbd></label><div className="api-head-buttons"><Button variant="brand" asChild><Link to="/contact" search={{ interest: "Sandbox keys" }}>Get sandbox keys <ArrowRight/></Link></Button><Button variant="outline" onClick={() => jump(docs.find(d => d.id === "changelog") ?? docs[docs.length - 1] as Doc)}>View changelog</Button></div></div></div><div className="api-preview-pill">● Preview docs · endpoints and SDKs are illustrative until launch</div></header>
    <div className="api-mobile-controls"><Button variant="outline" className="api-drawer-trigger" onClick={() => setMenuOpen(true)}><Menu/> Docs menu</Button><label className="api-mobile-select-label">On this page <select aria-label="On this page" value={active} onChange={e => { const doc = docs.find(d => d.id === e.target.value); if (doc) jump(doc); }}>{docs.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}</select></label></div>
    {menuOpen && <div className="api-drawer-backdrop" onClick={() => setMenuOpen(false)}><div className="api-drawer" onClick={e => e.stopPropagation()}><div className="api-drawer-head">DOCS MENU <Button variant="ghost" size="icon" aria-label="Close docs menu" onClick={() => setMenuOpen(false)}><X/></Button></div><label className="api-search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search docs…" aria-label="Search docs in menu"/></label>{nav}</div></div>}
    <div className="api-layout"><aside className="api-left"><div className="api-left-top">CONTENTS <span>{docs.length} ENTRIES</span></div>{nav}</aside><div className="api-reference" ref={container}>{docs.map(d => <ReferenceBlock key={d.id} doc={d} active={active === d.id} language={language} setLanguage={changeLanguage}/>)}</div><div className="api-right">{current && <CodePanel doc={current} language={language} setLanguage={changeLanguage}/>}</div></div>
    <div className="api-extras"><section id="sdk-resources" className="api-extra-section"><div className="api-extra-heading"><span className="mono-label">RESOURCES / 01</span><h2>SDKs & tools.</h2><p>Planned integrations. Commands below are examples, not installable packages.</p></div><div className="api-tool-grid">{tools.map(([name, command]) => <article key={name} className="api-tool"><div><span className="api-tool-icon">{name?.slice(0, 2).toUpperCase()}</span><span className="api-availability">PLANNED</span></div><h3>{name}</h3><code>{command}</code></article>)}</div></section>
      <section id="webhook-guide" className="api-extra-section api-extra-split"><div><span className="mono-label">RESOURCES / 02</span><h2>Webhooks.</h2><p>Handle signed events asynchronously. This is a preview specification and must not be used in production.</p><ul className="api-event-list">{docs.filter(d => d.method === "EVT").map(d => <li key={d.id}><span className="api-method method-evt">EVT</span><code>{d.path}</code></li>)}</ul></div><div className="api-extra-code"><span>EXAMPLE PAYLOAD · ILLUSTRATIVE</span><Highlight code={JSON.stringify({ id: "evt_illustrative_001", type: "payment.confirmed", data: { payment_id: "payment_illustrative_8x72" } }, null, 2)}/><span>SIGNATURE VERIFICATION · PSEUDOCODE</span><Highlight code={"// Preview only — do not use in production\nconst signature = request.headers.get('X-Araratpay-Signature');\nverifySignature(rawBody, signature, webhookSecret);"}/></div></section>
      <section id="sandbox-guide" className="api-extra-section api-extra-split"><div><span className="mono-label">RESOURCES / 03</span><h2>Sandbox.</h2><p>Free test mode, no card required. Access and test behavior are planned, not available yet.</p><div className="api-small-grid"><div><strong>Test wallet (fake)</strong><code>ILLUSTRATIVE_WALLET_NOT_VALID</code></div><div><strong>Test key (fake)</strong><code>sk_test_…</code></div></div></div><div className="api-extra-code"><span>ILLUSTRATIVE TEST CASES</span><div className="api-test-row"><code>amount: 25000</code><span>→ success (illustrative)</span></div><div className="api-test-row"><code>amount: 40000</code><span>→ invalid_request (illustrative)</span></div><p>These amounts do not trigger real sandbox responses.</p></div></section>
      <section id="status-guide" className="api-extra-section api-extra-split"><div><span className="mono-label">RESOURCES / 04</span><h2>Status & limits.</h2><p>No live uptime monitoring or production rate limits are connected to this preview.</p></div><div className="api-status"><span>UPTIME · ILLUSTRATIVE PLACEHOLDER</span><strong>—</strong><span>No live status page</span><Button variant="link" asChild><Link to="/contact" search={{ interest: "Status page" }}>Request status updates <ArrowRight/></Link></Button></div></section>
      <section id="changelog-guide" className="api-extra-section"><span className="mono-label">RESOURCES / 05</span><h2>Changelog.</h2><p>Preview milestones only · not production release notes.</p><div className="api-change-list">{[["2026-09-30", "v0.1 preview", "Illustrative payments reference"], ["2026-09-23", "v0.0.3 preview", "Planned payout and conversion flows"], ["2026-09-16", "v0.0.2 preview", "Webhook event examples"], ["2026-09-09", "v0.0.1 preview", "First documentation outline"]].map(([date, version, text]) => <div key={version}><time>{date} · PREVIEW</time><strong>{version}</strong><span>{text}</span></div>)}</div></section>
      <section className="api-extra-cta"><div><span className="mono-label">NEXT STEP</span><h2>Ready to build?</h2><p>Talk with the team about early access to the planned sandbox.</p></div><div><Button variant="brand" asChild><Link to="/contact" search={{ interest: "Sandbox keys" }}>Get sandbox keys <ArrowRight/></Link></Button><Button variant="outline" asChild><Link to="/contact" search={{ interest: "Talk to an engineer" }}>Talk to an engineer</Link></Button></div></section>
    </div>
  </div>;
}
