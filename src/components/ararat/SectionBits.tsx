import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export function useSafeReducedMotion() {
  const preferred = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated && !!preferred;
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useSafeReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .6, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}
export function SectionHeading({ number, label, title, description }: { number: string; label: string; title: string; description?: string }) {
  return <Reveal className="section-heading"><div className="section-kicker">{number && <><span>{number}</span> / </>}{label}</div><h2>{title}</h2>{description && <p>{description}</p>}</Reveal>;
}
