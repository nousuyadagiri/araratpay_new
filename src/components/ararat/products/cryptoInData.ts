import { cryptoInHero } from './flowHeroFilms';
import ctaMp4 from '@/assets/flows/crypto-in/crypto-in-cta.mp4.asset.json';
import ctaWebm from '@/assets/flows/crypto-in/crypto-in-cta.webm.asset.json';
import ctaPoster from '@/assets/flows/crypto-in/crypto-in-cta.webp.asset.json';
import retail from '@/assets/flows/crypto-in/retail.webp.asset.json';
import links from '@/assets/flows/crypto-in/links.webp.asset.json';
import checkout from '@/assets/flows/crypto-in/checkout.webp.asset.json';
import invoices from '@/assets/flows/crypto-in/invoices.webp.asset.json';
import api from '@/assets/flows/crypto-in/api.webp.asset.json';
import gaming from '@/assets/flows/crypto-in/gaming.webp.asset.json';
import travel from '@/assets/flows/crypto-in/travel.webp.asset.json';
import saas from '@/assets/flows/crypto-in/saas.webp.asset.json';
import type { FlowContent } from './FlowPageTemplate';

export const cryptoIn: FlowContent = {
  slug: 'crypto-in', number: '01', name: 'Crypto In',
  title: 'Take crypto payments. Keep every one.',
  sub: 'QR at the counter, links in chat, checkout on your site. Payments are final, so 0% chargebacks.',
  hero: cryptoInHero,
  cta: { mp4: ctaMp4.url, webm: ctaWebm.url, poster: ctaPoster.url },
  stats: [['1%', 'FLAT'], ['7+', 'CHAINS'], ['0%', 'CHARGEBACKS']],
  waysTitle: 'Five ways in. One balance.',
  methods: [
    { title: 'QR at the counter', description: 'Let a customer scan and pay right where they stand.', best: 'SHOPS AND CAFÉS', image: retail.url, alt: 'Customer paying at a café counter' },
    { title: 'Payment links', description: 'Share a link in a message and make getting paid feel effortless.', best: 'SERVICES AND SOCIAL SELLERS', image: links.url, alt: 'Customer using a phone at a shop counter' },
    { title: 'Website checkout', description: 'Make crypto a natural next step in your online checkout.', best: 'ONLINE STORES', image: checkout.url, alt: 'People looking at an online purchase on a laptop' },
    { title: 'Invoices', description: 'Send a payment request with the details your business needs.', best: 'B2B', image: invoices.url, alt: 'Business team reviewing a payment request together' },
    { title: 'API', description: 'Build payment collection into the experience you own.', best: 'PLATFORMS', image: api.url, alt: 'Developer working at a laptop' },
  ],
  journeyTitle: "From a customer's wallet to your balance.",
  journey: [{ title: 'Customer wallet', detail: 'Choose a coin' }, { title: 'Blockchain', detail: '7+ chains' }, { title: 'AraratPay', detail: 'Confirm · 1% · final' }, { title: 'Your balance', detail: 'Ready to move' }],
  journeyCaption: 'Crypto-to-crypto settlement in under 3 seconds.',
  whyTitle: 'Lower cost. No chargebacks. Faster money.',
  whyCaption: 'Card figures are illustrative industry ranges, not quotes.',
  visualTitle: 'Coins that move with your business.',
  galleryTitle: 'Made for the moments that matter.',
  gallery: [
    { title: 'Retail and cafés', subtitle: 'QR at the counter', image: retail.url, alt: 'Customer paying at a retail counter' },
    { title: 'E-commerce', subtitle: 'Checkout without borders', image: checkout.url, alt: 'Shoppers browsing an online order together' },
    { title: 'Gaming', subtitle: 'Digital goods, digital payment', image: gaming.url, alt: 'Colorful gaming setup' },
    { title: 'Travel', subtitle: 'A world of customers', image: travel.url, alt: 'Traveler using a phone while planning a trip' },
    { title: 'SaaS', subtitle: 'Payments for platforms', image: saas.url, alt: 'Technology workspace with laptop' },
  ],
  feed: ['Ararat Cafe', 'Online order #2041', 'Game top-up', 'Studio invoice #182', 'Travel booking'],
  faq: [
    ['Can a customer reverse a payment?', 'No. Payments are final on-chain, so there are 0% card-network chargebacks.'],
    ['Which chains are supported?', 'AraratPay supports 7+ blockchains.'],
    ['What does it cost?', 'A flat 1% per payment.'],
  ],
  ctaTitle: 'Start taking crypto today.',
};
