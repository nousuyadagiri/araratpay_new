import { AraratMark } from "./AraratLogo";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "./SectionBits";
const questions = [
 ["Which coins can I accept?", "AraratPay supports payments across 7+ blockchains."],
 ["What if the price moves before confirmation?", "The checkout illustrative shows an illustrative rate-lock flow."],
 ["Is there a minimum transaction amount?", "Payment details are shown during the transaction flow."],
 ["How fast is settlement?", "Average crypto-to-crypto settlement is under 3 seconds."],
 ["What are the fees?", "One flat 1% AraratPay fee on every transaction across all four flows."],
 ["Which countries support fiat payout?", "AraratPay supports 180+ fiat currencies."],
 ["Where are cards available?", "The Cards page shows an illustrative card experience."],
 ["What KYC or KYB checks are required?", "Verification is part of onboarding."],
];
export function FAQ() { return <section id="faq" className="page-section faq-section"><div className="shell faq-layout"><SectionHeading number="09" label="GOOD TO KNOW" title="Questions, answered."/><Reveal className="faq-list"><Accordion type="single" collapsible>{questions.map(([q, a], i) => <AccordionItem value={`q-${i}`} key={q}><AccordionTrigger><span className="faq-index">0{i + 1}</span>{q}</AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>)}</Accordion></Reveal></div></section>; }
export function FinalCTA({ onAction }: { onAction: (name: string) => void }) { return <section className="final-cta"><div className="final-grid" aria-hidden="true"/><div className="shell final-inner"><Reveal><span className="section-kicker">10 / YOUR NEXT MOVE</span><h2>Ready to accept your first crypto payment?</h2><div className="final-actions"><Button variant="brand" size="hero" onClick={() => onAction("Get Started Free")}>Get Started Free <ArrowUpRight size={18}/></Button><Button variant="glass" size="hero" onClick={() => onAction("Talk to sales")}>Talk to sales <ArrowRight size={18}/></Button></div></Reveal><div className="final-peak" aria-hidden="true"><span><AraratMark/></span><i/><i/><i/></div></div></section>; }
