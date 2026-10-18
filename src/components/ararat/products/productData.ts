export type ProductSlug = "crypto-in" | "crypto-out" | "fiat-out" | "cards";

export type ProductContent = {
  slug: ProductSlug;
  name: string;
  number: string;
  eyebrow: string;
  title: string;
  accent: string;
  subhead: string;
  metaDescription: string;
  features: { title: string; copy: string }[];
  useCases: { title: string; copy: string; tag: string }[];
  demoTitle: string;
  demoCopy: string;
  faq: [string, string][];
  footnote?: string;
};

export const productNameToSlug: Record<string, ProductSlug> = {
  "Crypto In": "crypto-in",
  "Crypto Out": "crypto-out",
  "Fiat Out": "fiat-out",
  Cards: "cards",
};

export const products: Record<ProductSlug, ProductContent> = {
  "crypto-in": {
    slug: "crypto-in", name: "Crypto In", number: "01", eyebrow: "ACCEPT PAYMENTS",
    title: "Accept Crypto Payments From", accent: "Anyone, Anywhere",
    subhead: "Let customers pay in the crypto they already hold — you receive settled value, not volatility risk.",
    metaDescription: "Accept BTC, ETH, USDT, USDC and more with hosted checkout, rate lock, auto-conversion and instant webhooks.",
    features: [
      { title: "Multi-chain, multi-token", copy: "Accept BTC, ETH, USDT, USDC and more across supported chains." },
      { title: "Checkout your way", copy: "Hosted checkout, embeddable widget, or a wallet-connect button." },
      { title: "QR payments for POS", copy: "Show a QR code at the counter and get paid in seconds." },
      { title: "Real-time rate lock", copy: "Quotes are held for a [X]-minute window while the customer pays." },
      { title: "Optional auto-conversion", copy: "Convert incoming crypto to stablecoin or fiat automatically." },
      { title: "Instant confirmation", copy: "On-chain confirmation plus webhooks to update your systems." },
      { title: "Payment links & invoicing", copy: "Send no-code payment links and invoices in a few clicks." },
      { title: "Recurring crypto billing", copy: "Charge subscribers on a schedule in crypto." },
    ],
    useCases: [
      { title: "E-commerce checkout", copy: "Add crypto as a payment option next to cards at checkout.", tag: "Hosted checkout" },
      { title: "Freelancer & agency invoices", copy: "Send a payment link and get paid by clients worldwide.", tag: "Payment links" },
      { title: "SaaS subscriptions", copy: "Bill customers monthly or yearly in the crypto they prefer.", tag: "Recurring billing" },
      { title: "Donations & crowdfunding", copy: "Accept contributions from supporters anywhere.", tag: "QR & widget" },
    ],
    demoTitle: "Try the checkout", demoCopy: "Pick a coin, watch the rate lock, and complete an illustrative payment.",
    faq: [
      ["Which coins are supported?", "AraratPay supports payments across 7+ blockchains."],
      ["What if the price moves before confirmation?", "The checkout preview shows an illustrative rate-lock flow."],
      ["Is there a minimum transaction size?", "Payment details are shown during the transaction flow."],
      ["How fast is settlement?", "Average crypto-to-crypto settlement is under 3 seconds."],
    ],
  },
  "crypto-out": {
    slug: "crypto-out", name: "Crypto Out", number: "02", eyebrow: "SEND PAYOUTS",
    title: "Send Crypto Payouts", accent: "at Scale",
    subhead: "Pay vendors, contractors, affiliates, or your own treasury — directly on-chain.",
    metaDescription: "Single or batch crypto payouts across chains with gas optimization, approvals, whitelisting and multi-sig.",
    features: [
      { title: "Single or batch payouts", copy: "Send one payment or thousands via CSV upload or API." },
      { title: "Multi-chain, gas-optimized", copy: "Route payouts across chains with network-fee optimization." },
      { title: "Scheduled & recurring", copy: "Set payouts to run automatically on your schedule." },
      { title: "Whitelists & approvals", copy: "Only pay approved addresses, with approval workflows built in." },
      { title: "Real-time status", copy: "Track every transfer with block explorer links." },
      { title: "Multi-sig for large payouts", copy: "Require multiple approvers above thresholds you configure." },
    ],
    useCases: [
      { title: "Stablecoin contractor payroll", copy: "Pay a global team in USDT or USDC on the same day.", tag: "Batch CSV" },
      { title: "Affiliate commissions", copy: "Automate commission runs to partner wallets.", tag: "Scheduled" },
      { title: "DAO treasury disbursement", copy: "Disburse grants with multi-sig approval.", tag: "Multi-sig" },
      { title: "Cross-border B2B settlement", copy: "Settle with suppliers without waiting on bank wires.", tag: "Multi-chain" },
    ],
    demoTitle: "Run an illustrative batch", demoCopy: "Load a sample CSV and watch each payout move to Completed.",
    faq: [
      ["Who pays the network fees?", "The AraratPay transaction fee is a flat 1% per transfer."],
      ["Are there approval limits?", "The payout illustrative shows an illustrative approval flow."],
      ["How does address whitelisting work?", "Add payout addresses to a whitelist; payouts to other addresses are blocked or require extra approval."],
      ["What is the maximum batch size?", "The illustrative shows a multi-recipient batch."],
    ],
  },
  "fiat-out": {
    slug: "fiat-out", name: "Fiat Out", number: "03", eyebrow: "BANK SETTLEMENT",
    title: "Turn Crypto Revenue Into", accent: "Cash in Your Bank",
    subhead: "Automatically convert incoming crypto to your local currency and settle directly to your business bank account.",
    metaDescription: "Convert crypto to 180+ fiat currencies and settle via SWIFT, ACH/IBAN and regional rails with transparent FX.",
    features: [
      { title: "180+ fiat currencies", copy: "Settle in the currency your business runs on." },
      { title: "Global bank rails", copy: "SWIFT, ACH/IBAN, and regional rails." },
      { title: "Same-day or T+1", copy: "Illustrative settlement journey." },
      { title: "Auto-settlement rules", copy: "Settle 100%, 50%, or a custom share of incoming crypto." },
      { title: "Transparent FX & fees", copy: "A clear FX and fee breakdown for every transaction." },
      { title: "Multi-currency virtual accounts", copy: "Hold balances in several currencies [if applicable]." },
    ],
    useCases: [
      { title: "E-commerce local payouts", copy: "Accept crypto, keep your books in local currency.", tag: "Auto-settle" },
      { title: "Marketplaces paying sellers", copy: "Pay sellers to their bank accounts in their own currency.", tag: "Global rails" },
      { title: "Avoiding crypto exposure", copy: "Convert on arrival so crypto never sits on your balance sheet.", tag: "100% rule" },
    ],
    demoTitle: "Build a settlement rule", demoCopy: "Adjust the split and see what settles to your bank versus stays in crypto.",
    faq: [
      ["What is the FX spread?", "The AraratPay transaction fee is a flat 1%."],
      ["Which countries and banks are supported?", "AraratPay supports 180+ fiat currencies."],
      ["How long does settlement take?", "The page shows an illustrative settlement flow."],
      ["Is there a minimum payout?", "Payment details are shown during the flow."],
    ],
  },
  cards: {
    slug: "cards", name: "Cards", number: "04", eyebrow: "CRYPTO-FUNDED CARDS",
    title: "Spend Your Crypto Balance", accent: "Anywhere",
    subhead: "Issue virtual and physical cards funded directly from your crypto or converted balance.",
    metaDescription: "Issue virtual and physical cards funded from crypto balances, with spend controls and team issuance.",
    features: [
      { title: "Instant virtual cards", copy: "Create a card and start spending in moments." },
      { title: "Physical branded cards", copy: "Illustrative card experience." },
      { title: "Auto-conversion at POS", copy: "Crypto converts at the moment of purchase." },
      { title: "Spend controls", copy: "Limits, merchant category restrictions, freeze and unfreeze." },
      { title: "Synced card history", copy: "Every transaction appears in your dashboard." },
      { title: "Multi-card for teams", copy: "Issue cards to team members with their own limits." },
    ],
    useCases: [
      { title: "Founder daily spend", copy: "Pay everyday costs straight from treasury.", tag: "Virtual card" },
      { title: "Employee expense cards", copy: "Give each teammate a card with its own limit.", tag: "Spend controls" },
      { title: "Customer rewards cards", copy: "Reward customers with a spendable balance.", tag: "Multi-card" },
      { title: "Prepaid marketplace payouts", copy: "Pay sellers onto a prepaid card they can use right away.", tag: "Prepaid" },
    ],
    demoTitle: "Control an illustrative card", demoCopy: "Flip it, freeze it, and set a spend limit.",
    faq: [
      ["Where are cards accepted?", "The page presents an illustrative card experience."],
      ["Are there load or spend fees?", "The AraratPay transaction fee is a flat 1% on card spend."],
      ["Is there a monthly card fee?", "No monthly fee."],
      ["Is KYC required?", "Yes. Cardholders and businesses complete verification before cards are issued."],
    ],
    footnote: "Cards issued in partnership with [Issuer Partner].",
  },
};
