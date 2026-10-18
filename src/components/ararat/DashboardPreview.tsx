import { flatFeeRate } from "@/config/pricing";
import { useTheme } from "./theme";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  Code2,
  CreditCard,
  Download,
  FileBarChart,
  Landmark,
  LayoutDashboard,
  Link2,
  Moon,
  Search,
  Settings2,
  ShieldCheck,
  Sun,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AraratMark } from "./AraratLogo";
import { SectionHeading, useSafeReducedMotion } from "./SectionBits";

const nav = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Transactions", icon: ArrowDownLeft },
  { name: "Payouts", icon: ArrowUpRight },
  { name: "Settlements", icon: Landmark },
  { name: "Cards", icon: CreditCard },
  { name: "Customers", icon: Users },
  { name: "Payment links & invoices", icon: Link2 },
  { name: "Reports", icon: FileBarChart },
  { name: "Developers", icon: Code2 },
  { name: "Settings", icon: Settings2 },
] as const;
type Tab = (typeof nav)[number]["name"];
type Range = "Today" | "7D" | "30D" | "90D";
type Currency = "USD" | "AED";
const ranges: Range[] = ["Today", "7D", "30D", "90D"];
const rangeFactors: Record<Range, number> = { Today: 0.036, "7D": 0.24, "30D": 1, "90D": 2.84 };
const assets = [
  // { name: "USDT", share: 46, balance: 18450, color: "var(--d-chart-1)" },
  { name: "USDT", share: 46, balance: 18450, color: "#3d3d41" },
  // { name: "USDC", share: 28, balance: 12800, color: "var(--d-chart-2)" },
  { name: "USDC", share: 28, balance: 12800, color: "#3d3d41" },
  { name: "BTC", share: 14, balance: 8240, color: "var(--d-chart-3)" },
  { name: "ETH", share: 9, balance: 3400.42, color: "var(--d-chart-4)" },
  { name: "Other", share: 3, balance: 0, color: "var(--d-chart-5)" },
];
const chains = [
  ["Tron", 34],
  ["Ethereum", 26],
  ["Solana", 16],
  ["Polygon", 11],
  ["BNB Chain", 7],
  ["Avalanche", 4],
  ["Bitcoin", 2],
] as const;
const methods = [
  ["Wallet connect", 38, "↑"],
  ["QR", 25, "↑"],
  ["Hosted checkout", 19, "→"],
  ["Payment links", 12, "↑"],
  ["Card", 6, "↓"],
] as const;
const countries = [
  ["AE", "UAE", 32],
  ["GB", "UK", 24],
  ["IN", "India", 18],
  ["NG", "Nigeria", 15],
  ["SG", "Singapore", 11],
] as const;
const transactions = [
  {
    hash: "0x8a2…f41b",
    customer: "Nova Studio",
    method: "Wallet",
    chain: "Ethereum",
    amount: 2500,
    fee: 2500 * flatFeeRate,
    status: "Settled",
    time: "2 min ago",
    type: "Incoming",
  },
  {
    hash: "0x1c9…a72d",
    customer: "Atlas Goods",
    method: "QR",
    chain: "Tron",
    amount: 850,
    fee: 850 * flatFeeRate,
    status: "Settled",
    time: "18 min ago",
    type: "Incoming",
  },
  {
    hash: "0xf73…d91e",
    customer: "Team payout",
    method: "Payout",
    chain: "Solana",
    amount: -1240,
    fee: 1240 * flatFeeRate,
    status: "Pending",
    time: "42 min ago",
    type: "Payouts",
  },
  {
    hash: "0x4b1…e08c",
    customer: "Bank ••• 2210",
    method: "Bank",
    chain: "—",
    amount: -5000,
    fee: 5000 * flatFeeRate,
    status: "Processing",
    time: "1 hr ago",
    type: "Fiat",
  },
  {
    hash: "0x95b…21a0",
    customer: "Studio Labs",
    method: "Card",
    chain: "—",
    amount: -36,
    fee: 36 * flatFeeRate,
    status: "Settled",
    time: "3 hrs ago",
    type: "Card",
  },
  {
    hash: "0x72d…984f",
    customer: "Mira & Co.",
    method: "Checkout",
    chain: "Polygon",
    amount: -120,
    fee: 120 * flatFeeRate,
    status: "Refunded",
    time: "Yesterday",
    type: "Incoming",
  },
] as const;
const approvals = [
  { id: "a", initials: "AK", name: "A. Khan", amount: 2400, chain: "USDC · Solana", by: "M. Chen" },
  { id: "b", initials: "JL", name: "J. Lee", amount: 1850, chain: "USDT · Tron", by: "S. Patel" },
  {
    id: "c",
    initials: "RM",
    name: "R. Malik",
    amount: 960,
    chain: "USDC · Ethereum",
    by: "M. Chen",
  },
];
const formats: Record<Currency, { symbol: string; factor: number }> = {
  USD: { symbol: "$", factor: 1 },
  AED: { symbol: "AED ", factor: 3.67 },
};
function money(value: number, currency: Currency, decimals = 0) {
  return (
    formats[currency].symbol +
    (value * formats[currency].factor).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}
function Panel({
  title,
  children,
  className = "",
  action,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <section className={`d-panel ${className}`}>
      <div className="d-panel-head">
        <h4>{title}</h4>
        {action}
      </div>
      {children}
    </section>
  );
}
function Segmented<T extends string>({
  values,
  value,
  set,
  label,
}: {
  values: readonly T[];
  value: T;
  set: (value: T) => void;
  label: string;
}) {
  return (
    <div className="d-segmented" role="group" aria-label={label}>
      {values.map((item) => (
        <Button
          key={item}
          type="button"
          variant="ghost"
          size="sm"
          aria-pressed={value === item}
          className={value === item ? "is-on" : ""}
          onClick={() => set(item)}
        >
          {item}
        </Button>
      ))}
    </div>
  );
}
function TinySpark({ values, good = true }: { values: number[]; good?: boolean }) {
  return (
    <div className={`d-spark ${good ? "" : "is-bad"}`} aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={values.map((v, i) => ({ i, v }))}>
          <Tooltip content={<ChartTooltip />} />
          <Area
            dataKey="v"
            stroke="var(--d-chart-1)"
            fill="var(--d-tint)"
            strokeWidth={1.5}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: readonly { name?: string; value?: number | string; color?: string }[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="d-tooltip">
      {label !== undefined && <strong>{label}</strong>}
      {payload.map((entry, i) => (
        <span key={`${entry.name}-${i}`}>
          {entry.name ?? "Value"}:{" "}
          {typeof entry.value === "number"
            ? entry.value.toLocaleString("en-US", { maximumFractionDigits: 1 })
            : entry.value}
        </span>
      ))}
    </div>
  );
}
function Kpis({ range, currency }: { range: Range; currency: Currency }) {
  const factor = rangeFactors[range];
  const values = [
    ["Total volume", money(1284560 * factor, currency), "▲ 18.4%", true],
    ["Net revenue", money(148250 * factor, currency), "▲ 12.8%", true],
    ["Payments settled", Math.round(8412 * factor).toLocaleString(), "▲ 9.1%", true],
    ["Avg settlement time", "2.4s", "▼ 0.3s", true],
    ["Success rate", "99.2%", "▲ 0.4%", true],
    ["Available balance", money(42890.42, currency, 2), "4 assets", true],
  ] as const;
  return (
    <div className="d-kpis">
      {values.map(([label, value, delta, good], i) => (
        <div className="d-kpi" key={label}>
          <span className="d-label">{label}</span>
          <strong key={`${range}-${currency}-${value}`} className="d-value-roll">
            {value}
          </strong>
          <div className="d-kpi-foot">
            <span className={good ? "d-delta" : "d-delta is-bad"}>{delta}</span>
            <TinySpark
              values={Array.from(
                { length: 10 },
                (_, j) => 28 + j * (i === 3 ? -1 : 2) + Math.sin(j * 2 + i) * 8,
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
function VolumeChart({
  range,
  currency,
  reduced,
}: {
  range: Range;
  currency: Currency;
  reduced: boolean;
}) {
  const [metric, setMetric] = useState<"Volume" | "Revenue" | "Count">("Volume");
  const data = useMemo(() => {
    const count = range === "Today" ? 8 : range === "7D" ? 7 : range === "90D" ? 12 : 10;
    const weights = Array.from(
      { length: count },
      (_, i) => 1 + 0.28 * Math.sin(i * 2.3) + 0.14 * Math.cos(i * 1.1),
    );
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    return Array.from({ length: count }, (_, i) => {
      const weight = 1 + 0.28 * Math.sin(i * 2.3) + 0.14 * Math.cos(i * 1.1);
      const volume = Math.round((1284560 * rangeFactors[range] * weight) / totalWeight);
      return {
        date:
          range === "Today"
            ? `${(i + 1) * 3}:00`
            : range === "7D"
              ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]
              : range === "90D"
                ? `W${i + 1}`
                : `${(i + 1) * 3} Sep`,
        Volume: Math.round(volume * formats[currency].factor),
        Revenue: Math.round(((volume * 148250) / 1284560) * formats[currency].factor),
        Count: Math.round((8412 * rangeFactors[range] * weight) / count),
        "Fiat settled": Math.round(volume * 0.68 * formats[currency].factor),
      };
    });
  }, [range, currency]);
  return (
    <Panel
      title="Volume & settlements"
      className="d-span-8 d-volume"
      action={
        <Segmented
          values={["Volume", "Revenue", "Count"]}
          value={metric}
          set={setMetric}
          label="Chart metric"
        />
      }
    >
      <div className="d-chart-note">
        {metric === "Count" ? "PAYMENTS" : currency} ·{" "}
        {range === "Today" ? "TODAY" : `LAST ${range}`}
      </div>
      <div className="d-volume-chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 2, bottom: 0, left: -22 }}>
            <CartesianGrid vertical={false} stroke="var(--d-grid)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--d-secondary)", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--d-secondary)", fontSize: 10 }}
              tickFormatter={(n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n))}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--d-tint)" }} />
            <Bar
              dataKey={metric}
              // fill="var(--d-fill)"
              fill="#3d3d41"
              radius={[3, 3, 0, 0]}
              maxBarSize={30}
              isAnimationActive={!reduced}
            />
            <Line
              dataKey="Fiat settled"
              stroke="var(--d-chart-2)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={!reduced}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="d-chart-key">
        <i /> {metric} <i /> Fiat settled
      </div>
    </Panel>
  );
}
function Assets({
  range,
  currency,
  reduced,
}: {
  range: Range;
  currency: Currency;
  reduced: boolean;
}) {
  const volume = 1284560 * rangeFactors[range];
  return (
    <Panel title="Payments by asset" className="d-span-4 d-assets">
      <div className="d-donut">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={assets}
              dataKey="share"
              nameKey="name"
              innerRadius="69%"
              outerRadius="89%"
              paddingAngle={2}
              stroke="none"
              isAnimationActive={!reduced}
            >
              {assets.map((a) => (
                <Cell key={a.name} fill={a.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="d-donut-center">
          <small>TOTAL VOLUME</small>
          <strong>{money(volume, currency)}</strong>
        </div>
      </div>
      <div className="d-asset-list">
        {assets.map((a) => (
          <div key={a.name}>
            <span>
              <i style={{ background: a.color }} />
              {a.name}
            </span>
            <span>
              {a.share}% <strong>{money((volume * a.share) / 100, currency)}</strong>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
function ChainPanel({ range, currency }: { range: Range; currency: Currency }) {
  return (
    <Panel title="Volume by chain" className="d-span-4 d-optional">
      <div className="d-bar-list">
        {chains.map(([name, share]) => (
          <div
            className="d-bar-line"
            key={name}
            title={`${name}: ${money((1284560 * rangeFactors[range] * share) / 100, currency)}`}
          >
            <span>{name}</span>
            <div className="d-track">
              <i style={{ width: `${(share / 34) * 100}%` }} />
            </div>
            <b>{share}%</b>
          </div>
        ))}
      </div>
    </Panel>
  );
}
function MethodsPanel() {
  return (
    <Panel title="Payment methods" className="d-span-4 d-optional">
      <div
        className="d-stack-bar"
        aria-label="Wallet connect 38%, QR 25%, Hosted checkout 19%, Payment links 12%, Card 6%"
      >
        {methods.map(([name, share], i) => (
          <div
            key={name}
            style={{ width: `${share}%`, background: `var(--d-chart-${i + 1})` }}
            title={`${name}: ${share}%`}
          />
        ))}
      </div>
      <div className="d-list">
        {methods.map(([name, share, trend], i) => (
          <div key={name}>
            <span>
              <i style={{ background: `var(--d-chart-${i + 1})` }} />
              {name}
            </span>
            <strong>
              {share}% <em>{trend}</em>
            </strong>
          </div>
        ))}
      </div>
    </Panel>
  );
}
function FunnelPanel() {
  const steps = [
    ["Checkout started", 10240],
    ["Wallet connected", 9110],
    ["Paid", 8530],
    ["Confirmed", 8412],
  ] as const;
  return (
    <Panel title="Checkout funnel" className="d-span-4 d-optional">
      <div className="d-funnel">
        {steps.map(([name, value], i) => (
          <div key={name}>
            <div className="d-funnel-label">
              <span>{name}</span>
              <strong>{value.toLocaleString()}</strong>
            </div>
            <div className="d-track">
              <i style={{ width: `${(value / 10240) * 100}%` }} />
            </div>
            {i > 0 && (
              <small>
                {((value / (steps[i - 1]?.[1] ?? value)) * 100).toFixed(1)}% from previous step
              </small>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}
function Treasury({ currency }: { currency: Currency }) {
  return (
    <Panel title="Treasury" className="d-span-5 d-optional">
      <div className="d-asset-list d-treasury-list">
        {assets.slice(0, 4).map((a, i) => (
          <div key={a.name}>
            <span>
              <i style={{ background: a.color }} />
              {a.name}
            </span>
            <strong>{money(a.balance, currency, 2)}</strong>
            <small className={i === 2 ? "d-negative" : "d-positive"}>
              {i === 2 ? "−0.8%" : `+${[0.2, 0.1, 0, 1.3][i]}%`}
            </small>
          </div>
        ))}
      </div>
      <div className="d-stack-bar">
        {assets.slice(0, 4).map((a, i) => (
          <div
            key={a.name}
            style={{
              width: `${(a.balance / 42890.42) * 100}%`,
              background: `var(--d-chart-${i + 1})`,
            }}
            title={`${a.name}: ${money(a.balance, currency, 2)}`}
          />
        ))}
      </div>
      <div className="d-inline-status">
        <Check size={13} /> Auto-convert active
      </div>
      <div className="d-fx">
        ILLUSTRATIVE FX <span>USDT→AED 3.67</span>
        <span>USDT→EUR 0.92</span>
        <span>BTC→USD [illustrative]</span>
      </div>
    </Panel>
  );
}
function Settlements({ currency }: { currency: Currency }) {
  return (
    <Panel title="Settlements" className="d-span-4 d-settlements">
      <span className="d-label">NEXT SCHEDULED · ILLUSTRATIVE</span>
      <strong className="d-large">{money(10000, currency)}</strong>
      <p>Today 18:00 · Bank ••• 2210</p>
      <div className="d-inline-status">
        <Check size={13} /> Daily · 80% to fiat
      </div>
      <div className="d-pipeline">
        <div>
          <b>3</b>
          <span>Pending</span>
        </div>
        <div>
          <b>1</b>
          <span>Processing</span>
        </div>
        <div>
          <b>42</b>
          <span>Settled this month</span>
        </div>
      </div>
    </Panel>
  );
}
function Countries({ range, currency }: { range: Range; currency: Currency }) {
  return (
    <Panel title="Top countries" className="d-span-3 d-optional">
      <div className="d-country-list">
        {countries.map(([initials, name, share]) => (
          <div key={name}>
            <span className="d-country-icon">{initials}</span>
            <div>
              <strong>{name}</strong>
              <div className="d-track">
                <i style={{ width: `${(share / 32) * 100}%` }} />
              </div>
            </div>
            <span>
              {money((1284560 * rangeFactors[range] * share) / 100, currency)}
              <small>{share}%</small>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
function Approvals({
  currency,
  approved,
  onApprove,
}: {
  currency: Currency;
  approved: string[];
  onApprove: (id: string) => void;
}) {
  const [reviewing, setReviewing] = useState<string | null>(null);
  return (
    <Panel
      title="Payout approvals"
      className="d-span-4 d-approvals"
      action={<span className="d-count">{3 - approved.length} pending</span>}
    >
      <div className="d-approval-list">
        {approvals.map((a) => (
          <div key={a.id}>
            <span className="d-avatar">{a.initials}</span>
            <div className="d-approval-info">
              <strong>{a.name}</strong>
              <small>
                {a.chain} · by {a.by}
              </small>
            </div>
            <div className="d-approval-actions">
              <b>{money(a.amount, currency)}</b>
              {approved.includes(a.id) ? (
                <span className="d-approved">
                  <Check size={12} /> Approved
                </span>
              ) : (
                <div>
                  <Button variant="ghost" size="sm" onClick={() => onApprove(a.id)}>
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReviewing(reviewing === a.id ? null : a.id)}
                  >
                    Review
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {reviewing && (
        <div className="d-review" role="status">
          Reviewing {approvals.find((a) => a.id === reviewing)?.name} · Illustrative payout details
          only.{" "}
          <Button variant="ghost" size="sm" onClick={() => setReviewing(null)}>
            Close
          </Button>
        </div>
      )}
    </Panel>
  );
}
function Cards({ currency }: { currency: Currency }) {
  return (
    <Panel title="Cards" className="d-span-4 d-cards d-optional">
      <div className="d-card-summary">
        <div>
          <span className="d-label">ACTIVE CARDS</span>
          <strong className="d-large">24</strong>
        </div>
        <div className="d-mini-card">
          <AraratMark />
          <span>•••• 4829</span>
        </div>
      </div>
      <div className="d-spend">
        <strong>{money(18420, currency)}</strong> of {money(30000, currency)} monthly limit
      </div>
      <div className="d-track">
        <i style={{ width: "61.4%" }} />
      </div>
      <div className="d-category">
        {[
          ["Software", 40],
          ["Travel", 29],
          ["Ads", 21],
          ["Meals", 10],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <div className="d-track">
              <i style={{ width: `${value}%` }} />
            </div>
            <b>{value}%</b>
          </div>
        ))}
      </div>
    </Panel>
  );
}
function Health() {
  return (
    <Panel title="Health & risk" className="d-span-4 d-optional">
      <div className="d-health">
        {[
          ["API uptime", "99.98%"],
          ["Webhook delivery", "99.9%"],
          ["AML alerts", "0 open"],
          ["Disputes", "0 · no chargebacks"],
          ["API calls today", "48,210"],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="d-health-spark">
        <span>WEBHOOK DELIVERY</span>
        <TinySpark values={[90, 95, 94, 97, 95, 99, 96, 100, 99, 100]} />
      </div>
    </Panel>
  );
}
function TransactionTable({
  filter,
  setFilter,
  currency,
  full = false,
  query = "",
  onViewAll,
}: {
  filter: string;
  setFilter: (f: string) => void;
  currency: Currency;
  full?: boolean;
  query?: string;
  onViewAll?: () => void;
}) {
  const filtered = transactions.filter(
    (t) =>
      (filter === "All" || t.type === filter) &&
      (!query || `${t.hash} ${t.customer} ${t.method}`.toLowerCase().includes(query)),
  );
  return (
    <Panel
      title="Recent transactions"
      className={`d-span-12 d-transactions ${full ? "d-transactions-full" : ""}`}
      action={
        !full && (
          <Button
            variant="ghost"
            size="sm"
            className="d-view-all"
            onClick={() => {
              setFilter("All");
              onViewAll?.();
            }}
          >
            View all <ArrowRight size={13} />
          </Button>
        )
      }
    >
      <div className="d-filters">
        <Segmented
          values={["All", "Incoming", "Payouts", "Fiat", "Card"]}
          value={filter}
          set={setFilter}
          label="Transaction type"
        />
      </div>
      <div className="d-table-wrap">
        <table className="d-table">
          <thead>
            <tr>
              {["Tx hash", "Customer", "Method", "Chain", "Amount", "Fee", "Status", "Time"].map(
                (h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.hash}>
                <td>{t.hash}</td>
                <td>{t.customer}</td>
                <td>{t.method}</td>
                <td>
                  <span className="d-chain-badge">{t.chain}</span>
                </td>
                <td className="d-amount">
                  {t.amount > 0 ? "+" : "−"}
                  {money(Math.abs(t.amount), currency, 2)}
                </td>
                <td>{money(t.fee, currency, 2)}</td>
                <td>
                  <span className={`d-status d-status-${t.status.toLowerCase()}`}>{t.status}</span>
                </td>
                <td>{t.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-mobile-transactions">
        {filtered.map((t) => (
          <div key={t.hash}>
            <span className="d-avatar">{t.customer.slice(0, 2).toUpperCase()}</span>
            <span>
              <strong>{t.customer}</strong>
              <small>
                {t.method} · {t.time}
              </small>
            </span>
            <span>
              <strong>
                {t.amount > 0 ? "+" : "−"}
                {money(Math.abs(t.amount), currency)}
              </strong>
              <small>{t.status}</small>
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
const cockpitTabs = ["Overview", "Transactions", "Settlements"] as const;
const activityEvents = [
  "+48.50 USDT settled — Cafe payment",
  "Payout batch sent — 5 wallets",
  "Invoice #1042 paid — 250.00 USDT",
  "Webhook delivered — 200 OK",
  "Settled to bank — AED",
];
export default function DashboardPreview() {
  const [tab, setTab] = useState<(typeof cockpitTabs)[number]>("Overview");
  const siteTheme = useTheme();
  const [dark, setDark] = useState(false);
  const reduced = useSafeReducedMotion();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    setDark(siteTheme === "dark");
  }, [siteTheme]);
  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setTick((value) => value + 1);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [reduced]);
  return (
    <section id="one-view" className="page-section cockpit-section">
      <div className="shell">
        <div className="section-heading cockpit-heading">
          <div className="section-kicker">03 / ONE VIEW</div>
          <h2>
            Every moving part. <span>In focus.</span>
          </h2>
          <p>Watch payments, payouts and settlements as they happen.</p>
        </div>
        <div className="cockpit-layout">
          <div className={`d-frame cockpit-dashboard ${dark ? "d-dark" : "d-light"}`}>
            <aside className="cockpit-sidebar">
              <AraratMark />
              <nav aria-label="Cockpit sidebar">
                {cockpitTabs.map((name, index) => {
                  const Icon = [LayoutDashboard, ArrowDownLeft, Landmark][index];
                  return (
                    <Button
                      key={name}
                      variant="ghost"
                      size="icon"
                      title={name}
                      aria-label={`Open ${name}`}
                      aria-pressed={tab === name}
                      onClick={() => setTab(name)}
                    >
                      {Icon && <Icon size={17} />}
                    </Button>
                  );
                })}
              </nav>
              <ShieldCheck size={17} />
            </aside>
            <div className="cockpit-main">
              <header className="cockpit-toolbar">
                <div role="tablist" aria-label="Cockpit views">
                  {cockpitTabs.map((name) => (
                    <Button
                      variant="ghost"
                      size="sm"
                      key={name}
                      role="tab"
                      id={`cockpit-tab-${name}`}
                      aria-controls="cockpit-view"
                      aria-selected={tab === name}
                      onClick={() => setTab(name)}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  title={dark ? "Light dashboard" : "Dark dashboard"}
                  aria-label={dark ? "Switch to light dashboard" : "Switch to dark dashboard"}
                  onClick={() => setDark((value) => !value)}
                >
                  {dark ? <Sun size={16} /> : <Moon size={16} />}
                </Button>
              </header>
              <div className="cockpit-context">
                <span>Araratpay / {tab}</span>
                <span>ILLUSTRATIVE · LAST 30 DAYS</span>
              </div>
              <div
                id="cockpit-view"
                role="tabpanel"
                aria-labelledby={`cockpit-tab-${tab}`}
                className="cockpit-view"
              >
                {tab === "Overview" ? (
                  <>
                    <div className="cockpit-kpis">
                      {[
                        ["Total volume", "$1.28M"],
                        ["Transactions", "8,412"],
                        ["Success rate", "99.2%"],
                        ["Avg settlement", "< 3 sec"],
                      ].map(([label, value], index) => (
                        <div key={label} className={index === 2 ? "is-success" : ""}>
                          <span>{label}</span>
                          <strong>{value}</strong>
                          {index === 3 && <small>crypto-to-crypto</small>}
                        </div>
                      ))}
                    </div>
                    <div className="cockpit-charts">
                      <VolumeChart range="30D" currency="USD" reduced={reduced} />
                      <Panel title="Payments by asset" className="cockpit-assets">
                        <div className="cockpit-donut">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={assets.slice(0, 3)}
                                dataKey="share"
                                nameKey="name"
                                innerRadius="65%"
                                outerRadius="90%"
                                stroke="none"
                                isAnimationActive={!reduced}
                              >
                                {assets.slice(0, 3).map((asset) => (
                                  <Cell key={asset.name} fill={asset.color} />
                                ))}
                              </Pie>
                              <Tooltip content={<ChartTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="cockpit-legend">
                          {assets.slice(0, 3).map((asset) => (
                            <span key={asset.name}>
                              <i style={{ background: asset.color }} />
                              {asset.name}
                            </span>
                          ))}
                        </div>
                      </Panel>
                    </div>
                  </>
                ) : tab === "Transactions" ? (
                  <div className="cockpit-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Payment</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.hash}>
                            <td>
                              {tx.hash}
                              <small>{tx.method}</small>
                            </td>
                            <td>{money(Math.abs(tx.amount), "USD", 2)}</td>
                            <td>{tx.status}</td>
                            <td>{tx.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="cockpit-settlements">
                    <h4>Bank settlements · Illustrative</h4>
                    {[
                      ["Bank ••• 2210", "AED 734.40", "Settled"],
                      ["Bank ••• 2210", "$5,000.00", "Processing"],
                      ["Bank ••• 2210", "$10,000.00", "Scheduled"],
                    ].map(([bank, amount, status], index) => (
                      <div key={index}>
                        <Landmark size={20} />
                        <span>
                          <strong>{bank}</strong>
                          <small>{status}</small>
                        </span>
                        <b>{amount}</b>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <aside className="cockpit-feed">
            <header>
              <span>
                <i /> LIVE ACTIVITY
              </span>
              <small>ILLUSTRATIVE</small>
            </header>
            <div className="cockpit-events">
              {Array.from({ length: 4 }, (_, index) => {
                const eventIndex = (tick + activityEvents.length - index) % activityEvents.length;
                return (
                  <div key={reduced ? index : tick - index} className="cockpit-event">
                    <span className="cockpit-event-icon">
                      {index === 0 ? <Check size={15} /> : <Activity size={15} />}
                    </span>
                    <div>
                      <p>{activityEvents[eventIndex]}</p>
                      <small>{index === 0 ? "just now" : `${Math.round(index * 3.6)}s ago`}</small>
                    </div>
                  </div>
                );
              })}
            </div>
            <footer>
              <Check size={13} /> Activity is illustrative, not live funds.
            </footer>
          </aside>
        </div>
        <div className="cockpit-features">
          {[
            "Real-time analytics",
            "Multi-currency reporting",
            "Export CSV",
            "Role-based access",
            "Webhook monitoring",
            "Audit trail",
          ].map((label) => (
            <span key={label}>
              <Check size={12} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
