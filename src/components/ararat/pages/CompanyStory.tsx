import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { worldDots } from "../worldDots";

const events = [
  { time: 1.25, flow: "Crypto In", amount: "24.50 USDT", status: "PAID" },
  { time: 5.5, flow: "Cards", amount: "89.00 USDC", status: "SETTLED" },
  { time: 9.75, flow: "Fiat Out", amount: "1,240 USDT", status: "SENT" },
  { time: 14.25, flow: "Crypto Out", amount: "320.00 USDC", status: "SENT" },
  { time: 18.5, flow: "Crypto In", amount: "120.00 USDC", status: "PAID" },
  { time: 22.75, flow: "Cards", amount: "49.00 USDC", status: "SETTLED" },
] as const;

const principles = [
  { title: "Clarity", front: "One number.", back: "A flat 1% on every flow. No plans. No tiers." },
  {
    title: "Control",
    front: "One balance.",
    back: "Move value across four connected flows from one account.",
  },
  {
    title: "Compliance",
    front: "Built in.",
    back: "SOC 2 Type II is in progress, stated plainly.",
  },
  {
    title: "Speed",
    front: "Keep moving.",
    back: "Crypto-to-crypto settlement averages under three seconds.",
  },
] as const;

function Heading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="ledger-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function DayLedger() {
  const [hour, setHour] = useState(12);
  const reduce = useReducedMotion();
  const visible = events.filter((event) => event.time <= hour);
  const activeIndex = Math.max(0, visible.length - 1);
  const total = visible.reduce(
    (sum, event) => sum + Number(event.amount.replace(/[^0-9.]/g, "")),
    0,
  );
  const clock = `${String(Math.floor(hour)).padStart(2, "0")}:${String(Math.round((hour % 1) * 60)).padStart(2, "0")}`;
  return (
    <section className="ledger-section ledger-day" data-theme="">
      <div className="shell">
        <Heading
          eyebrow="01 · A DAY ON ARARATPAY"
          title="Value never clocks off."
          copy="Scrub through an illustrative day across all four flows."
        />
        <div className="ledger-day-stage">
          <div className="ledger-day-main">
            <div className="ledger-clock">
              <span>CURRENT TIME</span>
              <strong>{clock}</strong>
              <small>
                <i />
                ILLUSTRATIVE CLOCK · 24 HOURS
              </small>
            </div>
            <div className="ledger-events">
              {events.map((event, index) => {
                const parts = event.amount.split(" ");
                const isVisible = event.time <= hour;
                return (
                  <motion.div
                    key={event.time}
                    className={`${isVisible ? "is-visible" : ""} ${isVisible && index === activeIndex ? "is-current" : ""}`}
                    initial={false}
                    animate={{ opacity: isVisible ? 1 : 0.24, y: isVisible ? 0 : 6 }}
                    transition={{ duration: reduce ? 0 : 0.3 }}
                  >
                    <span>
                      {String(Math.floor(event.time)).padStart(2, "0")}:
                      {String(Math.round((event.time % 1) * 60)).padStart(2, "0")}
                    </span>
                    <b>{event.flow}</b>
                    <strong>
                      {parts[0]} <small>{parts[1]}</small>
                    </strong>
                    <em>{event.status}</em>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <label className="ledger-scrubber">
            <span>00:00</span>
            <input
              type="range"
              min="0"
              max="24"
              step=".25"
              value={hour}
              style={{ "--ledger-progress": `${(hour / 24) * 100}%` } as React.CSSProperties}
              onChange={(event) => setHour(Number(event.target.value))}
              aria-label="Scrub through the illustrative payment day"
            />
            <span>24:00</span>
          </label>
          <div className="ledger-running">
            <span>
              RUNNING TOTAL · ILLUSTRATIVE
              <i />
            </span>
            <div>
              <strong>{total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
              <small>MIXED ILLUSTRATIVE UNITS</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Counters() {
  const values = useMemo(
    () => [
      { value: "2,041", label: "ILLUSTRATIVE PAYMENTS" },
      { value: "4", label: "FLOWS" },
      { value: "<3 SEC", label: "ILLUSTRATIVE CRYPTO SPEED" },
      { value: "1%", label: "FLAT FEE" },
    ],
    [],
  );
  return (
    <section className="ledger-counters">
      <div className="shell">
        {values.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <strong>{item.value}</strong>
            <span>{item.label}</span>
            {(index === 0 || index === 2) && <small>ILLUSTRATIVE</small>}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FlowMap() {
  const routes = [
    "M230 145 Q360 20 500 118",
    "M500 118 Q625 40 720 145",
    "M400 205 Q520 95 650 220",
    "M190 115 Q330 250 540 245",
  ];
  return (
    <section className="ledger-section ledger-map">
      <div className="shell">
        <Heading
          eyebrow="02 · FLOW MAP"
          title="One ledger. Many directions."
          copy="An illustrative view of value moving between regions."
        />
        <div
          className="ledger-map-stage"
          role="img"
          aria-label="Illustrative global payment routes between five regions"
        >
          <svg viewBox="0 0 800 320" aria-hidden="true">
            <g className="ledger-world-dots">
              {worldDots.map(([x, y], index) => (
                <circle key={index} cx={x} cy={y} r=".8" />
              ))}
            </g>
            {routes.map((path, index) => (
              <g key={path}>
                <path d={path} />
                <circle r="4">
                  <animateMotion
                    dur={`${3.2 + index * 0.6}s`}
                    repeatCount="indefinite"
                    path={path}
                  />
                </circle>
              </g>
            ))}
          </svg>
          {[
            ["Americas", "15%", "40%"],
            ["Europe", "43%", "22%"],
            ["Middle East", "61%", "44%"],
            ["Africa", "50%", "68%"],
            ["Asia", "81%", "49%"],
          ].map(([name, left, top]) => (
            <span key={name} style={{ left, top }}>
              {name}
            </span>
          ))}
          <small>ILLUSTRATIVE ROUTES</small>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  const [open, setOpen] = useState(0);
  return (
    <section className="ledger-section ledger-principles">
      <div className="shell">
        <Heading eyebrow="03 · PRINCIPLES" title="The rules behind the rails." />
        <div className="ledger-principle-grid">
          {principles.map((principle, index) => (
            <Button
              variant="ghost"
              key={principle.title}
              className={`ledger-flip ${open === index ? "is-open" : ""}`}
              onClick={() => setOpen(open === index ? -1 : index)}
              aria-pressed={open === index}
            >
              <span className="ledger-flip-inner">
                <span className="ledger-flip-front">
                  <i>0{index + 1}</i>
                  <strong>{principle.title}</strong>
                  <em>{principle.front}</em>
                </span>
                <span className="ledger-flip-back">
                  <Check />
                  <strong>{principle.title}</strong>
                  <p>{principle.back}</p>
                </span>
              </span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustAndCareers() {
  return (
    <>
      <section className="ledger-trust">
        <div className="shell">
          <ShieldCheck />
          <div>
            <span>SECURITY, STATED PLAINLY</span>
            <strong>0% on-chain chargebacks · SOC 2 Type II in progress</strong>
          </div>
          <Button variant="glass" asChild>
            <Link to="/security">
              Explore security <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </section>
      <section className="ledger-section ledger-careers">
        <div className="shell">
          <article>
            <BriefcaseBusiness />
            <span>CAREERS</span>
            <h2>Build the rails with us.</h2>
            <p>We are always interested in people who want business payments to move better.</p>
            <Button variant="brand" asChild>
              <Link to="/contact" search={{ interest: "Careers" }}>
                Join us <ArrowUpRight />
              </Link>
            </Button>
          </article>
        </div>
      </section>
    </>
  );
}

function Closing() {
  return (
    <section className="ledger-closing">
      <div className="shell">
        <div>
          <span>ONE PLATFORM · FOUR FLOWS · FLAT 1%</span>
          <h2>Start accepting crypto today.</h2>
        </div>
        <div>
          <Button variant="glass" size="hero" asChild>
            <Link to="/contact" search={{ interest: "Get started" }}>
              Get started <ArrowUpRight />
            </Link>
          </Button>
          <Button variant="outline" size="hero" asChild>
            <Link to="/contact" search={{ interest: "Sales" }}>
              Talk to sales
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function CompanyStory() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.dataset["ready"] = "true";
  }, []);
  return (
    <div ref={ref} className="company-ledger">
      <DayLedger />
      <Counters />
      <FlowMap />
      <Principles />
      <TrustAndCareers />
      <Closing />
    </div>
  );
}
