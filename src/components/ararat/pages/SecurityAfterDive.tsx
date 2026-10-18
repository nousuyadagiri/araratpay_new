import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import "./security-dive.css";

const compliance = [
  ["SOC 2 Type II", "IN PROGRESS"],
] as const;
const principles = [
  { label: "01 / ONBOARDING", title: "Verify before go-live", copy: "Merchants complete KYB verification during onboarding." },
  { label: "02 / CERTIFICATIONS", title: "Say only what is true", copy: "Certifications show as In progress until issued." },
  { label: "03 / DOCUMENTATION", title: "Evidence on request", copy: "Security questionnaires and documentation are available on request." },
] as const;
const questions = [
  ["Can a customer reverse a crypto payment?", "No. On-chain payments are final, so there are 0% chargebacks."],
  ["Is AraratPay SOC 2 certified?", "The SOC 2 Type II audit is in progress. We are not certified yet."],
] as const;

export default function SecurityAfterDive() {
  return <>
    <section className="security-after" aria-labelledby="security-compliance-title"><div className="shell"><div className="security-after-head"><span className="security-after-eyebrow">COMPLIANCE</span><h2 id="security-compliance-title">Compliance, stated plainly.</h2><p>We verify businesses before they go live. We publish a certification only once it is true.</p></div><div className="security-status-board">{compliance.map(([name, status]) => <div key={name} className="security-status-row"><span>{name}</span><span className="security-status security-status--progress"><i aria-hidden="true"/>{status}</span></div>)}</div><div className="security-principles">{principles.map(item => <article key={item.title}><span className="security-after-eyebrow">{item.label}</span><h3>{item.title}</h3><p>{item.copy}</p>{item.label.startsWith("03") && <Button variant="link" asChild><Link to="/contact" search={{ interest: "Security inquiry" }}>Request documentation <ArrowRight size={16}/></Link></Button>}</article>)}</div><div className="security-compliance-contact"><p>Questions about verification or security? Talk with our team.</p><Button variant="glass" asChild><Link to="/contact" search={{ interest: "Security inquiry" }}>Contact security <ArrowRight size={16}/></Link></Button></div></div></section>
    <section className="security-after security-after--alt"><div className="shell security-report-grid"><article id="report" className="security-report-card" aria-labelledby="security-report-title"><span className="security-after-eyebrow">FOUND A BUG?</span><h2 id="security-report-title">Tell us first. We'll fix it with you.</h2><p>Use the contact page to share a security concern with the AraratPay team.</p><Button variant="glass" asChild><Link to="/contact" search={{ interest: "Security inquiry" }}>Contact security <ArrowRight size={16}/></Link></Button></article><div className="security-faq"><span className="security-after-eyebrow">QUESTIONS</span><h2>Security FAQ</h2><Accordion type="single" collapsible>{questions.map(([question, answer], index) => <AccordionItem key={question} value={`question-${index}`}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}<AccordionItem value="question-4"><AccordionTrigger>How do I report a security issue?</AccordionTrigger><AccordionContent>Use the contact page and choose Security inquiry.</AccordionContent></AccordionItem></Accordion></div></div></section>
    <section className="security-final"><div className="shell"><span className="security-after-eyebrow">ARARATPAY</span><h2>One platform. Four flows. Flat 1%.</h2><Button variant="brand" size="hero" asChild><Link to="/contact" search={{ interest: "Security" }}>Get your AraratPay account <ArrowRight size={18}/></Link></Button></div></section>
  </>;
}
