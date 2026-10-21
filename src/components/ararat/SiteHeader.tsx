import { AraratLogo, AraratMark } from "./AraratLogo";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, ChevronDown, CreditCard, Landmark, Menu, X } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { productNameToSlug } from "./products/productData";

const flows = [
  { name: "Crypto In", description: "Take crypto payments", icon: ArrowDownLeft },
  { name: "Crypto Out", description: "Pay out in crypto", icon: ArrowUpRight },
  { name: "Fiat Out", description: "Cash out to your bank", icon: Landmark },
  { name: "Cards", description: "Spend from your balance", icon: CreditCard },
];
export function PeakMark({ className = "" }: { className?: string }) {
  return <AraratMark className={className}/>;
}

export default function SiteHeader({ onAction, overHero = false }: { onAction: (name: string) => void; overHero?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<"Platform" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = overHero ? document.getElementById("top") : null;
      const boxedHero = hero?.parentElement?.classList.contains("cinema-stage");
      setScrolled(boxedHero ? window.scrollY > 8 || window.matchMedia("(prefers-reduced-motion: reduce)").matches : hero ? hero.getBoundingClientRect().bottom <= 94 : window.scrollY > 28);
    };
    update(); window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [overHero]);
  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [mobileOpen]);

  const navigate = useNavigate();
  const openAction = (name: string) => { setActive(null); setMobileOpen(false); const slug = productNameToSlug[name]; if (slug) navigate({ to: "/platform/$slug", params: { slug } }); else onAction(name); };
  return <header className={`site-header ${overHero ? "site-header--over-hero" : ""} ${scrolled ? "site-header--scrolled" : ""}`}>
    <div className="shell header-inner">
      <Link to="/" className="brand" aria-label="AraratPay home" onClick={() => { setMobileOpen(false); setActive(null); }}><AraratLogo markClassName="brand-mark"/></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <Button variant="nav" onClick={() => setActive(active === "Platform" ? null : "Platform")} aria-expanded={active === "Platform"} aria-haspopup="true">Platform<ChevronDown className={`nav-chevron ${active === "Platform" ? "rotated" : ""}`}/></Button>
        <Button variant="nav" asChild><Link to="/solutions" onClick={() => setActive(null)}>Solutions</Link></Button>
        <Button variant="nav" asChild><Link to="/developers" onClick={() => setActive(null)}>Developers</Link></Button>
        <Button variant="nav" asChild><Link to="/pricing" onClick={() => setActive(null)}>Pricing</Link></Button>
        <Button variant="nav" asChild><Link to="/security" onClick={() => setActive(null)}>Security</Link></Button>
        <Button variant="nav" asChild><Link to="/company" onClick={() => setActive(null)}>Company</Link></Button>
      </nav>
      <div className="header-actions"><ThemeToggle/><Button variant="nav" className="login-link" asChild><Link to="/contact" search={{ interest: "Log In" }}>Log In</Link></Button><Button variant="brand" size="nav" className="header-cta" asChild><Link to="/contact" search={{ interest: "Get Started" }}>Get Started <ArrowRight /></Link></Button></div>
      <Button variant="iconGlass" size="icon" className="mobile-menu-trigger" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen}>{mobileOpen ? <X /> : <Menu />}</Button>
    </div>
    <AnimatePresence>
      {active && <motion.div className="mega-wrap" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .2 }}>
        <div className="mega-menu shell"><div className="mega-intro"><span className="eyebrow-text">EXPLORE PLATFORM</span><p>One platform,<br/>four flows.</p><span className="mega-decoration"><PeakMark /></span></div><div className="mega-links">{flows.map(({ name, description, icon: Icon }) => { const slug = productNameToSlug[name]; return slug ? <Link key={name} to="/platform/$slug" params={{ slug }} className="menu-item flex items-center" onClick={() => { setActive(null); setMobileOpen(false); }}><span className="mega-icon"><Icon size={20}/></span><span className="mega-copy"><strong>{name}</strong><small>{description}</small></span><ArrowUpRight className="mega-arrow" size={16}/></Link> : <button key={name} type="button" className="menu-item flex items-center" onClick={() => openAction(name)}><span className="mega-icon"><Icon size={20}/></span><span className="mega-copy"><strong>{name}</strong><small>{description}</small></span><ArrowUpRight className="mega-arrow" size={16}/></button>; })}</div></div>
      </motion.div>}
    </AnimatePresence>
    <AnimatePresence>{mobileOpen && <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
      <div className="mobile-nav-content"><span className="eyebrow-text">EXPLORE</span>{[{ label: "Platform" }, { label: "Solutions", to: "/solutions" }, { label: "Developers", to: "/developers" }, { label: "Pricing", to: "/pricing" }, { label: "Security", to: "/security" }, { label: "Company", to: "/company" }].map(item => <div key={item.label}>{"to" in item && item.to ? <Button variant="mobileNav" asChild><Link to={item.to} onClick={() => { setMobileOpen(false); setActive(null); }}>{item.label}<ArrowUpRight/></Link></Button> : <Button variant="mobileNav" onClick={() => item.label === "Platform" ? setActive(active === "Platform" ? null : "Platform") : openAction(item.label)}>{item.label}{item.label === "Platform" ? <ChevronDown className={active === "Platform" ? "rotated" : ""}/> : <ArrowUpRight/>}</Button>}{active === item.label && item.label === "Platform" && <div className="mobile-subnav">{flows.map(f => { const slug = productNameToSlug[f.name]; return slug ? <Link key={f.name} to="/platform/$slug" params={{ slug }} className="mobile-subnav-button flex items-center justify-between" onClick={() => { setMobileOpen(false); setActive(null); }}><span>{f.name}</span><ArrowRight size={16}/></Link> : <button key={f.name} type="button" className="mobile-subnav-button flex items-center justify-between" onClick={() => openAction(f.name)}><span>{f.name}</span><ArrowRight size={16}/></button>; })}</div>}</div>)}<div className="mobile-nav-actions"><ThemeToggle withLabel/><Button variant="glass" asChild><Link to="/contact" search={{ interest: "Log In" }} onClick={() => setMobileOpen(false)}>Log In</Link></Button><Button variant="brand" asChild><Link to="/contact" search={{ interest: "Get Started" }} onClick={() => setMobileOpen(false)}>Get Started <ArrowRight/></Link></Button></div></div>
    </motion.nav>}</AnimatePresence>
  </header>;
}