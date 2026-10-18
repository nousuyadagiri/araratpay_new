import type { FlowContent } from "./FlowPageTemplate";
import { cryptoOutHero, fiatOutHero, cardsHero } from "./flowHeroFilms";
import cryptoMp4 from "@/assets/flows/shared/crypto-out.mp4.asset.json";
import cryptoWebm from "@/assets/flows/shared/crypto-out.webm.asset.json";
import cryptoPoster from "@/assets/flows/shared/crypto-out.webp.asset.json";
import fiatMp4 from "@/assets/flows/shared/fiat-out.mp4.asset.json";
import fiatWebm from "@/assets/flows/shared/fiat-out.webm.asset.json";
import fiatPoster from "@/assets/flows/shared/fiat-out.webp.asset.json";
import cardsMp4 from "@/assets/flows/shared/cards.mp4.asset.json";
import cardsWebm from "@/assets/flows/shared/cards.webm.asset.json";
import cardsPoster from "@/assets/flows/shared/cards.webp.asset.json";
import team from "@/assets/flows/shared/team.webp.asset.json";
import market from "@/assets/flows/shared/market.webp.asset.json";
import office from "@/assets/flows/shared/office.webp.asset.json";
import finance from "@/assets/flows/shared/finance.webp.asset.json";
import travel from "@/assets/flows/shared/travel.webp.asset.json";
import store from "@/assets/flows/shared/store.webp.asset.json";
import laptop from "@/assets/flows/shared/laptop.webp.asset.json";
import code from "@/assets/flows/shared/code.webp.asset.json";
import cardPhoto from "@/assets/flows/shared/cards.webp.asset.json";
const film = (mp4: { url: string }, webm: { url: string }, poster: { url: string }) => ({
  mp4: mp4.url,
  webm: webm.url,
  poster: poster.url,
});
const cryptoFilm = film(cryptoMp4, cryptoWebm, cryptoPoster);
const fiatFilm = film(fiatMp4, fiatWebm, fiatPoster);
const cardFilm = film(cardsMp4, cardsWebm, cardsPoster);

export const cryptoOut: FlowContent = {
  slug: "crypto-out",
  number: "02",
  name: "Crypto Out",
  title: "Pay anyone, anywhere, in crypto.",
  sub: "Send one payout or thousands at once to suppliers, sellers, creators and staff.",
  hero: cryptoOutHero,
  cta: cryptoFilm,
  stats: [
    ["1%", "FLAT"],
    ["7+", "CHAINS"],
    ["ONE BATCH", "MANY WALLETS"],
  ],
  waysTitle: "Many ways out. One balance.",
  methods: [
    {
      title: "Single payout",
      description: "Send a one-off payment to a wallet.",
      best: "ONE-OFF SUPPLIER BILLS",
      image: finance.url,
      alt: "Business owner reviewing payments on a laptop",
    },
    {
      title: "Batch by CSV",
      description: "Prepare a group of payouts in one run.",
      best: "MARKETPLACES PAYING SELLERS",
      image: market.url,
      alt: "Marketplace team working around a desk",
    },
    {
      title: "Scheduled payouts",
      description: "Plan payout activity from one connected workspace.",
      best: "PAYROLL",
      image: team.url,
      alt: "Remote team collaborating at a table",
    },
    {
      title: "API payouts",
      description: "Build payout requests into your platform.",
      best: "PLATFORMS",
      image: code.url,
      alt: "Developer working at a laptop",
    },
    {
      title: "Payout links",
      description: "Prepare a simple payout request for a recipient.",
      best: "WHEN YOU DO NOT HAVE THE ADDRESS",
      image: laptop.url,
      alt: "Team reviewing information together on a laptop",
    },
  ],
  journeyTitle: "From your balance to many wallets.",
  journey: [
    { title: "Your balance", detail: "One source" },
    { title: "AraratPay", detail: "Check · approve · 1%" },
    { title: "Blockchain", detail: "7+ chains" },
    { title: "Recipient wallets", detail: "Many destinations" },
  ],
  journeyCaption: "Illustrative payout journey.",
  whyTitle: "Faster payouts. Clear status. One price.",
  whyCaption: "The batch comparison is illustrative.",
  visualTitle: "One origin. A world of wallets.",
  galleryTitle: "Pay the people behind your business.",
  gallery: [
    {
      title: "Marketplaces",
      subtitle: "Pay every seller at once",
      image: market.url,
      alt: "Team running an online marketplace",
    },
    {
      title: "Creator platforms",
      subtitle: "Make every payout count",
      image: laptop.url,
      alt: "Creators working together with a laptop",
    },
    {
      title: "Global suppliers",
      subtitle: "Keep work moving",
      image: finance.url,
      alt: "Business finance workspace",
    },
    {
      title: "Remote teams",
      subtitle: "Many people, one batch",
      image: team.url,
      alt: "Remote colleagues collaborating",
    },
    {
      title: "Affiliates",
      subtitle: "Reward the network",
      image: office.url,
      alt: "Shared office workspace",
    },
  ],
  feed: [
    "Seller · 0x8f…a21c",
    "Creator · 0x20…b462",
    "Supplier · 0xc1…94a7",
    "Team · 0x11…2ef1",
    "Affiliate · 0x98…bc03",
  ],
  dashboard: {
    title: "Every payout, accounted for.",
    description: "An illustrative outgoing feed with line-by-line status.",
    metric: "PAID OUT TODAY",
    feedTitle: "OUTGOING PAYOUTS",
    unit: "USDT",
    amounts: [320, 150, 720, 425, 80],
    statuses: ["✓ SENT", "✓ SENT", "SENDING", "✓ SENT", "SENDING"],
  },
  calculator: {
    title: "One rate for every payout.",
    description: "Estimate a batch before network fees.",
    input: "Payout batch",
    fee: "AraratPay fee (1%)",
    result: "Total cost",
    unit: "USDT",
    note: "Network fees",
    mode: "total",
  },
  developerTitle: "Send a batch with one request.",
  faq: [
    [
      "Can I prepare several payouts together?",
      "Yes. The illustrative shows a batch payout workflow.",
    ],
    ["Can I track each payout?", "The illustrative feed shows line-by-line status."],
    ["What does it cost?", "A flat 1% per payout."],
  ],
  ctaTitle: "Pay the world from one balance.",
};
export const fiatOut: FlowContent = {
  slug: "fiat-out",
  number: "03",
  name: "Fiat Out",
  title: "Turn crypto into cash in the bank.",
  sub: "Convert your balance and pay out to bank accounts in 180+ fiat currencies.",
  hero: fiatOutHero,
  cta: fiatFilm,
  stats: [
    ["1%", "FLAT"],
    ["180+", "CURRENCIES"],
    ["RATE", "BEFORE YOU CONFIRM"],
  ],
  waysTitle: "Out to any bank.",
  methods: [
    {
      title: "Your own account",
      description: "Move revenue from crypto into a bank account.",
      best: "CASHING OUT REVENUE",
      image: finance.url,
      alt: "Business owner reviewing finances",
    },
    {
      title: "Bank settlement",
      description: "Move value from the platform toward a bank account.",
      best: "TRADE",
      image: market.url,
      alt: "Colleagues reviewing supplier finances",
    },
    {
      title: "Local currency",
      description: "See an illustrative local-currency settlement flow.",
      best: "TEAMS",
      image: team.url,
      alt: "Team collaborating at work",
    },
    {
      title: "Settlement workflow",
      description: "Follow a settlement request from balance to bank.",
      best: "TREASURY",
      image: office.url,
      alt: "Office workspace for treasury planning",
    },
    {
      title: "API",
      description: "Connect a payout request to your platform.",
      best: "PLATFORMS",
      image: code.url,
      alt: "Developer working on a laptop",
    },
  ],
  journeyTitle: "From crypto balance to bank account.",
  journey: [
    { title: "Your balance", detail: "USDT · ₮" },
    { title: "AraratPay", detail: "Convert · rate shown · 1%" },
    { title: "Bank transfer", detail: "Illustrative step" },
    { title: "Bank account", detail: "Local currency" },
  ],
  journeyCaption: "Illustrative bank-settlement journey.",
  whyTitle: "Know the rate. Know the fee. Know when.",
  whyCaption: "Illustrative quote and journey only.",
  visualTitle: "A world of local currencies.",
  galleryTitle: "Business moves in local currency.",
  gallery: [
    {
      title: "Business cash-outs",
      subtitle: "Revenue in the bank",
      image: finance.url,
      alt: "Business owner managing finances",
    },
    {
      title: "Payroll",
      subtitle: "For teams near and far",
      image: team.url,
      alt: "Team working together",
    },
    {
      title: "Import and export",
      subtitle: "Pay for what moves",
      image: market.url,
      alt: "Business team planning a transaction",
    },
    {
      title: "Freelancers",
      subtitle: "Work across borders",
      image: laptop.url,
      alt: "Freelancer working at a laptop",
    },
    {
      title: "Travel agencies",
      subtitle: "Settle in local currency",
      image: travel.url,
      alt: "Traveler in transit",
    },
  ],
  feed: [
    "USDT → AED · Business revenue",
    "USDT → EUR · Invoice",
    "USDT → INR · Supplier",
    "USDT → GBP · Settlement",
    "USDT → SGD · Cash-out",
  ],
  dashboard: {
    title: "From balance to bank, in one view.",
    description: "Illustrative conversion and bank payout activity.",
    metric: "BANK PAYOUTS TODAY",
    feedTitle: "FIAT PAYOUTS",
    unit: "USDT",
    amounts: [1240, 650, 440, 1800, 300],
    statuses: ["SENT TO BANK", "CONVERTING", "SENT TO BANK", "SENT TO BANK", "CONVERTING"],
  },
  calculator: {
    title: "See the fee before the exchange.",
    description: "The bank amount depends on the confirmed exchange rate.",
    input: "You convert",
    fee: "AraratPay fee (1%)",
    result: "Before FX",
    unit: "USDT",
    note: "FX spread",
    mode: "net",
  },
  developerTitle: "Move value to a bank.",
  faq: [
    ["How many fiat currencies?", "AraratPay supports 180+ fiat currencies."],
    [
      "Can I follow the transfer?",
      "The illustrative shows status from conversion through bank transfer.",
    ],
    ["What does it cost?", "A flat 1% per transaction."],
  ],
  ctaTitle: "Cash out without the wait.",
};
export const cards: FlowContent = {
  slug: "cards",
  number: "04",
  name: "Cards",
  title: "Spend your balance, anywhere cards work.",
  sub: "Explore how cards can connect to your AraratPay balance.",
  hero: cardsHero,
  cta: cardFilm,
  stats: [
    ["1%", "FLAT"],
    ["ONE", "BALANCE"],
    ["ILLUSTRATIVE", "CARD CONTROLS"],
  ],
  waysTitle: "One balance, many cards.",
  methods: [
    {
      title: "Virtual card illustrative",
      description: "Explore an illustrative online card experience.",
      best: "ONLINE AND SAAS",
      image: cardPhoto.url,
      alt: "Card being used at a counter",
    },
    {
      title: "In-store card illustrative",
      description: "Explore an illustrative in-store card experience.",
      best: "TRAVEL AND IN-STORE",
      image: store.url,
      alt: "Customer at a store counter",
    },
    {
      title: "Team spend illustrative",
      description: "Explore illustrative controls for team spend.",
      best: "SPEND CONTROL",
      image: team.url,
      alt: "Team collaborating at a desk",
    },
    {
      title: "Purchase card illustrative",
      description: "Explore an illustrative card for one purchase.",
      best: "ONE-OFF PURCHASES",
      image: laptop.url,
      alt: "Online transaction on a laptop",
    },
    {
      title: "Crypto-funded payment",
      description: "Explore an illustrative crypto-funded payment.",
      best: "TAP TO PAY",
      image: store.url,
      alt: "Customer using a phone at a counter",
    },
  ],
  journeyTitle: "From your balance to the checkout.",
  journey: [
    { title: "Your balance", detail: "One source" },
    { title: "Card", detail: "Issue · control" },
    { title: "Checkout", detail: "Terminal or online" },
    { title: "Approved", detail: "Receipt to dashboard" },
  ],
  journeyCaption: "Illustrative card journey.",
  whyTitle: "Control every card.",
  whyCaption: "Freeze, online controls, limits and notifications are illustrative.",
  visualTitle: "A card for every part of the business.",
  galleryTitle: "Make everyday spend feel effortless.",
  gallery: [
    {
      title: "Marketing teams",
      subtitle: "Ad spend",
      image: market.url,
      alt: "Marketing team planning a campaign",
    },
    {
      title: "Tech teams",
      subtitle: "SaaS and cloud",
      image: code.url,
      alt: "Technology team working on a laptop",
    },
    {
      title: "Travel",
      subtitle: "Expenses on the road",
      image: travel.url,
      alt: "Traveler in transit",
    },
    {
      title: "Founders",
      subtitle: "From one balance",
      image: finance.url,
      alt: "Business founder reviewing finances",
    },
    {
      title: "Field teams",
      subtitle: "In-store spend",
      image: store.url,
      alt: "Shop counter with customer",
    },
  ],
  feed: [
    "Cloud hosting · •••• 2041",
    "Ad campaign · •••• 2041",
    "Flight · •••• 1832",
    "Software · •••• 7740",
    "Supplies · •••• 1832",
  ],
  dashboard: {
    title: "One view of every card purchase.",
    description: "An illustrative card transaction feed.",
    metric: "SPENT THIS MONTH",
    feedTitle: "CARD TRANSACTIONS",
    unit: "USDC",
    amounts: [49, 125, 320, 29, 86],
    statuses: ["✓ APPROVED", "✓ APPROVED", "✓ APPROVED", "✓ APPROVED", "✓ APPROVED"],
  },
  calculator: {
    title: "Know the cost of every swipe.",
    description: "An illustrative card-spend estimate.",
    input: "Card spend",
    fee: "AraratPay fee (1%)",
    result: "Total from balance",
    unit: "USDC",
    note: "Network and FX costs",
    mode: "total",
  },
  developerTitle: "Issue a card from your workflow.",
  faq: [
    ["What does the page show?", "Illustrative card controls and transaction activity."],
    ["Can I explore spend controls?", "Yes. The page includes interactive illustrative controls."],
    ["What does it cost?", "A flat 1% on card spend."],
  ],
  ctaTitle: "Spend crypto like cash.",
};
