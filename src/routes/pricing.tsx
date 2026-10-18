import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { flatFeeRate, flatFeeLabel, cardComparison } from "@/config/pricing";
import { PageShell, pageHead } from "@/components/ararat/pages/PageShell";
import { useSafeReducedMotion } from "@/components/ararat/SectionBits";

export const Route = createFileRoute("/pricing")({
  head: () =>
    pageHead(
      "Pricing — Flat 1%",
      "One flat 1% transaction fee across Crypto In, Crypto Out, Fiat Out and Cards. No plans, setup fees or monthly fees.",
      "/pricing",
    ),
  component: PricingPage,
});

const flows = [
  { name: "Crypto In", action: "per payment received", final: "You receive", add: false },
  { name: "Crypto Out", action: "per payout sent", final: "Total debited", add: true },
  { name: "Fiat Out", action: "per bank settlement", final: "Lands in your bank", add: false },
  { name: "Card spend", action: "per card transaction", final: "Charged to balance", add: true },
] as const;
const included = [
  "Dashboard & analytics",
  "REST API preview",
  "Payment links & invoicing",
  "7+ blockchains",
  "180+ fiat currencies",
  "One account",
  "Four connected flows",
];
const questions = [
  [
    "Is it really 1% for everything?",
    "Yes. The same 1% transaction fee applies to Crypto In, Crypto Out, Fiat Out and Cards.",
  ],
  [
    "Any setup, monthly or minimum fees?",
    "No. There are no setup, monthly or minimum-volume fees.",
  ],
  [
    "Are there chargebacks?",
    "No. On-chain payments are final and do not have card-network chargebacks.",
  ],
] as const;
const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
const compare =
  100000 * cardComparison.cardRate +
  cardComparison.cardFixedFee * cardComparison.estimatedTransactionsPerMonth +
  cardComparison.illustrativeChargebackCost * cardComparison.illustrativeChargebackCount;

function PricingPage() {
  const [amount, setAmount] = useState(10000);
  const [flow, setFlow] = useState(0);
  const reduce = useSafeReducedMotion();
  const fee = Math.round(amount * flatFeeRate * 100) / 100;
  const chosen = flows[flow] ?? flows[0];
  const result = chosen.add ? amount + fee : amount - fee;
  return (
    <PageShell cta={false}>
      <section className="price-hero">
        <div className="shell price-hero-grid">
          <div className="price-intro">
            <span className="mono-label">PRICING / ONE PLATFORM · FOUR FLOWS</span>
            <h1>
              Here's the whole bill.
              <br />
              <em>It's short.</em>
            </h1>
            <p>
              No plans, no tiers, no fine print. One flat 1% fee on every transaction, across every
              flow.
            </p>
            <div className="price-controls">
              <label htmlFor="price-amount">
                Amount <strong>{money(amount)}</strong>
              </label>
              <input
                id="price-amount"
                type="range"
                min="100"
                max="1000000"
                step="100"
                value={amount}
                onInput={(e) => setAmount(Number(e.currentTarget.value))}
                onChange={(e) => setAmount(Number(e.target.value))}
                aria-valuetext={money(amount)}
              />
              <div className="price-range">
                <span>$100</span>
                <span>$1,000,000</span>
              </div>
              <span className="mono-label price-flow-label">CHOOSE A FLOW</span>
              <div className="price-chips" role="group" aria-label="Choose a flow">
                {flows.map((item, i) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    type="button"
                    aria-pressed={flow === i}
                    onClick={() => setFlow(i)}
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="price-actions">
              <Button variant="brand" size="hero" asChild>
                <Link to="/contact" search={{ interest: "Pricing" }}>
                  Get started <ArrowRight size={17} />
                </Link>
              </Button>
              <Button variant="glass" size="hero" asChild>
                <Link to="/contact" search={{ interest: "Talk to sales" }}>
                  Talk to sales <ArrowUpRight size={17} />
                </Link>
              </Button>
            </div>
          </div>
          <div className="price-receipt-stage">
            <div className="price-printer" aria-hidden="true" />
            <div
              className={`price-receipt ${reduce ? "price-static" : ""}`}
              aria-label="Illustrative pricing receipt"
            >
              <div className="price-receipt-head">
                <strong>ARARATPAY · PRICING</strong>
                <span>
                  RECEIPT #0001
                  <br />
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="price-dash" />
              <div className="price-lines">
                {[
                  ["Setup fee", "$0.00"],
                  ["Monthly fee", "$0.00"],
                  ["Minimum volume", "$0.00"],
                  ["Chargebacks", "$0.00"],
                  ["Hidden fees", "$0.00"],
                  ["Per transaction", flatFeeLabel],
                ].map(([label, value], i) => (
                  <div
                    className="price-line"
                    style={{ animationDelay: reduce ? "0s" : `${0.28 + i * 0.105}s` }}
                    key={label}
                  >
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="price-dash" />
              <div className="price-line price-total">
                <span>Fee on {money(amount)}</span>
                <strong key={`fee-${fee}`} className="price-roll">
                  {money(fee)}
                </strong>
              </div>
              <div className="price-line price-final">
                <span>{chosen.final}</span>
                <strong key={`${flow}-${result}`} className="price-roll">
                  {money(result)}
                </strong>
              </div>
              <div className="price-receipt-end">THANK YOU · THAT'S ALL</div>
              <div className="price-barcode" aria-hidden="true" />
              <small>0001 0001 0001 0001</small>
            </div>
            <p>Illustrative receipt · flat AraratPay fee only</p>
          </div>
        </div>
      </section>
      <section className="price-band">
        <div className="shell">
          <span className="mono-label">01 / ONE FEE, EVERY FLOW</span>
          <h2>One percentage. Every direction.</h2>
          <div className="price-flow-grid">
            {flows.map((item, i) => (
              <article key={item.name}>
                <span>
                  FLOW 0{i + 1} / {item.name.toUpperCase()}
                </span>
                <strong>1%</strong>
                <p>{item.action}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="price-band price-band-alt">
        <div className="shell">
          <span className="mono-label">02 / EVERYTHING INCLUDED</span>
          <h2>All the infrastructure. None of the tiers.</h2>
          <div className="price-included">
            {included.map((text) => (
              <div key={text}>
                <Check size={17} aria-hidden="true" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="price-band">
        <div className="shell price-compare-grid">
          <div>
            <span className="mono-label">03 / ON A $100,000 MONTH</span>
            <h2>See the difference.</h2>
            <p>
              Comparison uses typical published card-processing rates, illustrative. Assumes{" "}
              {cardComparison.estimatedTransactionsPerMonth} transactions and{" "}
              {cardComparison.illustrativeChargebackCount} chargebacks; shows the AraratPay
              transaction fee only.
            </p>
          </div>
          <div className="price-bars">
            <div>
              <div className="price-bar-title">
                <span>Typical card processing · 2.9% + $0.30 + chargebacks</span>
                <strong>{money(compare)}</strong>
              </div>
              <div className="price-bar-track">
                <span style={{ width: "100%" }} />
              </div>
            </div>
            <div>
              <div className="price-bar-title">
                <span>AraratPay · flat 1%</span>
                <strong>{money(100000 * flatFeeRate)}</strong>
              </div>
              <div className="price-bar-track price-bar-ours">
                <span style={{ width: `${((100000 * flatFeeRate) / compare) * 100}%` }} />
              </div>
            </div>
            <p>
              Keep ~{money(compare - 100000 * flatFeeRate)} more every month{" "}
              <small>Illustrative comparison, not a quote.</small>
            </p>
          </div>
        </div>
      </section>
      <section className="price-band price-band-alt">
        <div className="shell price-faq-grid">
          <div>
            <span className="mono-label">04 / PRICING FAQ</span>
            <h2>Nothing between the lines.</h2>
          </div>
          <Accordion type="single" collapsible>
            {questions.map(([q, a], i) => (
              <AccordionItem key={q} value={`price-${i}`}>
                <AccordionTrigger>{q}</AccordionTrigger>
                <AccordionContent>{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
      <section className="price-end">
        <div className="shell">
          <span className="mono-label">ONE ACCOUNT · FOUR FLOWS</span>
          <h2>
            Start at 1%.
            <br />
            Scale without surprises.
          </h2>
          <Button variant="brand" size="hero" asChild>
            <Link to="/contact" search={{ interest: "Pricing" }}>
              Get started <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
