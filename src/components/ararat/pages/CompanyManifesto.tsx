import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompanyMedia } from './CompanyMedia';

const words = 'Money should move like a message. Fast, final, and fair.'.split(' ');
const accent = 'One platform. Four flows. One flat price.'.split(' ');

export default function CompanyManifesto() {
  const section = useRef<HTMLElement>(null);
  const copy = useRef<HTMLHeadingElement>(null);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const sync = () => setMobile(!query.matches);
    sync(); query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    if (mobile || !section.current || !copy.current) return;
    let killed = false;
    let cleanup = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (killed || !section.current || !copy.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const spans = Array.from(copy.current.querySelectorAll<HTMLElement>('.company-word'));
      const trigger = ScrollTrigger.create({ trigger: section.current, start: 'top top', end: '+=170%', pin: true, scrub: .5, invalidateOnRefresh: true,
        onUpdate: self => {
          const count = self.progress * (spans.length + 1);
          spans.forEach((span, i) => span.style.setProperty('--lit', String(Math.max(0, Math.min(1, count - i)))));
          section.current?.style.setProperty('--manifesto-progress', `${self.progress * 100}%`);
        },
      });
      cleanup = () => { trigger.kill(); spans.forEach(span => span.style.removeProperty('--lit')); section.current?.style.removeProperty('--manifesto-progress'); };
    });
    return () => { killed = true; cleanup(); };
  }, [mobile]);
  return <section id="top" ref={section} className={`company-manifesto ${mobile ? 'company-manifesto--static' : ''}`} data-theme="dark">
    <CompanyMedia name="manifesto" eager/>
    <div className="shell company-manifesto-content">
      <span className="company-kicker">COMPANY · OUR MANIFESTO</span>
      <h1 ref={copy}>{words.map((word, i) => <span className="company-word" key={`w${i}`}>{word} </span>)}<br/>{accent.map((word, i) => <span className="company-word company-word--accent" key={`a${i}`}>{word} </span>)}</h1>
      <div className="company-manifesto-actions"><Button variant="brand" asChild><Link to="/contact" search={{ interest: 'Company' }}>Get your AraratPay account <ArrowUpRight size={16}/></Link></Button><span className="company-manifesto-hint">SCROLL TO READ <ArrowDown size={15}/></span></div>
    </div>
    <div className="company-manifesto-progress"/>
  </section>;
}