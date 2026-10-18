import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SiteHeader from "../SiteHeader";
import { Reveal, SectionHeading, useSafeReducedMotion } from "../SectionBits";
import { products, type ProductContent, type ProductSlug } from "./productData";
import ProductDemo from "./ProductDemos";
import { useSiteAction } from "../pages/PageShell";

const ProductScene = lazy(() => import("./ProductScene"));
const SiteFooter = lazy(() => import("../SiteFooter"));
const FinalCTA = lazy(() => import("../ClosingSections").then(m => ({ default: m.FinalCTA })));

function HeroVisual({ product }: { product: ProductContent }) {
  const reduce = useSafeReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setDesktop(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return <div className="pp-hero-visual" aria-hidden="true">
    <div className={`pp-fallback pp-fallback--${product.slug}`}><span/><i/><i/></div>
    {desktop && <Suspense fallback={null}><div className="pp-canvas"><ProductScene slug={product.slug} reducedMotion={reduce}/></div></Suspense>}
  </div>;
}

export default function ProductPage({ product }: { product: ProductContent }) {
  const action = useSiteAction();
  return <>
    <SiteHeader onAction={action}/>
    <main>
      <section className="pp-hero" id="top">
        <div className="hero-grid" aria-hidden="true"/>
        <div className="shell pp-hero-inner">
          <Reveal className="pp-hero-copy">
            <span className="hero-eyebrow">FLOW {product.number} · PART OF THE ARARATPAY PLATFORM</span>
            <h1>{product.title} <span className="hero-word--gradient">{product.accent}</span></h1>
            <p className="hero-description">{product.subhead}</p>
            <div className="hero-actions"><Button variant="brand" size="hero" onClick={() => action("Get Started")}>Get Started <ArrowUpRight size={18}/></Button><Button variant="glass" size="hero" onClick={() => action("Talk to Sales")}>Talk to Sales</Button></div>
          </Reveal>
          <HeroVisual product={product}/>
        </div>
      </section>
      <nav className="flow-switcher" aria-label="AraratPay flows"><div className="shell flow-switcher-inner"><span>ONE ACCOUNT, FOUR FLOWS</span><div>{(Object.keys(products) as ProductSlug[]).map(slug => <Button key={slug} variant="ghost" size="sm" asChild><Link to="/platform/$slug" params={{ slug }} aria-current={slug === product.slug ? "page" : undefined}>{products[slug].name}</Link></Button>)}</div></div></nav>

      <section className="page-section"><div className="shell">
        <SectionHeading number="01" label="FEATURES" title={`Everything in ${product.name}.`}/>
        <div className="pp-feature-grid">{product.features.map((f, i) => <Reveal key={f.title} delay={(i % 4) * .06} className="pp-feature"><CheckCircle2 size={18}/><h3>{f.title}</h3><p>{f.copy}</p></Reveal>)}</div>
      </div></section>

      <section className="page-section pp-usecases"><div className="shell">
        <SectionHeading number="02" label="IN PRACTICE" title="How merchants use it."/>
        <div className="pp-usecase-grid">{product.useCases.map((u, i) => <Reveal key={u.title} delay={i * .06} className="pp-usecase"><span className="mono-label">0{i + 1}</span><h3>{u.title}</h3><p>{u.copy}</p><span className="pp-tag">{u.tag}</span></Reveal>)}</div>
      </div></section>

      <section className="page-section"><div className="shell pp-demo-layout">
        <div><SectionHeading number="03" label="INTERACTIVE ILLUSTRATIVE" title={product.demoTitle} description={product.demoCopy}/><span className="mono-label">ILLUSTRATIVE DATA · NO REAL FUNDS MOVE</span></div>
        <Reveal><ProductDemo slug={product.slug}/></Reveal>
      </div></section>

      <section className="page-section faq-section"><div className="shell faq-layout">
        <SectionHeading number="04" label="GOOD TO KNOW" title="Questions, answered."/>
        <Reveal className="faq-list"><Accordion type="single" collapsible>{product.faq.map(([q, a], i) => <AccordionItem value={`q-${i}`} key={q}><AccordionTrigger><span className="faq-index">0{i + 1}</span>{q}</AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>)}</Accordion>{product.footnote && <p className="pp-footnote">{product.footnote}</p>}</Reveal>
      </div></section>

      <Suspense fallback={null}>
        <FinalCTA onAction={action}/>
        <SiteFooter onAction={action}/>
      </Suspense>
    </main>
  </>;
}
