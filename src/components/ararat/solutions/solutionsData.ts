import ecommercePhoto from '@/assets/flows/shared/store.webp.asset.json';
import saasPhoto from '@/assets/flows/shared/office.webp.asset.json';
import marketPhoto from '@/assets/flows/shared/market.webp.asset.json';
import remittancePhoto from '@/assets/flows/shared/fiat-out.webp.asset.json';
import gamingPhoto from '@/assets/flows/shared/code.webp.asset.json';
import freelancePhoto from '@/assets/flows/shared/laptop.webp.asset.json';
import ecommercePrismPhoto from '@/assets/flows/hero/crypto-in-hero-poster.webp.asset.json';
import saasPrismPhoto from '@/assets/company/workshop.webp.asset.json';
import marketplacePrismPhoto from '@/assets/company/ship.webp.asset.json';
import remittancePrismPhoto from '@/assets/flows/hero/fiat-out-hero-poster.webp.asset.json';
import gamingPrismPhoto from '@/assets/flows/crypto-in/gaming.webp.asset.json';
import freelancePrismPhoto from '@/assets/flows/shared/laptop.webp.asset.json';
import ecommerceMp4 from '@/assets/flows/hero/crypto-in-hero-720.mp4.asset.json';
import ecommerceWebm from '@/assets/flows/hero/crypto-in-hero-720.webm.asset.json';
import ecommercePoster from '@/assets/flows/hero/crypto-in-hero-poster.webp.asset.json';
import saasMp4 from '@/assets/company/manifesto.mp4.asset.json';
import saasWebm from '@/assets/company/manifesto.webm.asset.json';
import saasPoster from '@/assets/company/manifesto-poster.jpg.asset.json';
import marketMp4 from '@/assets/videos/moments/pays-suppliers.mp4.asset.json';
import marketWebm from '@/assets/videos/moments/pays-suppliers.webm.asset.json';
import marketPoster from '@/assets/videos/moments/pays-suppliers.jpg.asset.json';
import remitMp4 from '@/assets/flows/hero/fiat-out-hero-720.mp4.asset.json';
import remitWebm from '@/assets/flows/hero/fiat-out-hero-720.webm.asset.json';
import remitPoster from '@/assets/flows/hero/fiat-out-hero-poster.webp.asset.json';
import gameMp4 from '@/assets/company/careers.mp4.asset.json';
import gameWebm from '@/assets/company/careers.webm.asset.json';
import gamePoster from '@/assets/company/careers-poster.jpg.asset.json';
import freelanceMp4 from '@/assets/flows/hero/crypto-out-hero-720.mp4.asset.json';
import freelanceWebm from '@/assets/flows/hero/crypto-out-hero-720.webm.asset.json';
import freelancePoster from '@/assets/flows/hero/crypto-out-hero-poster.webp.asset.json';

export const flowNames = ['Crypto In', 'Crypto Out', 'Fiat Out', 'Cards'] as const;
export type FlowName = typeof flowNames[number];
export type Industry = {
  id: string; name: string; tagline: string; icon: 'shopping-cart' | 'cloud' | 'store' | 'globe' | 'gamepad' | 'briefcase'; problem: string; answer: string;
  flows: readonly FlowName[]; facts: readonly [string, string]; photo: string; prismPhoto: string;
  film: { mp4: string; webm: string; poster: string };
  demo: readonly [string, string, string]; caption: string;
};

export const flowSlugs: Record<FlowName, 'crypto-in' | 'crypto-out' | 'fiat-out' | 'cards'> = {
  'Crypto In': 'crypto-in', 'Crypto Out': 'crypto-out', 'Fiat Out': 'fiat-out', Cards: 'cards',
};

export const industries = [
  { id: 'e-commerce', name: 'E-commerce', tagline: 'Borderless checkout', icon: 'shopping-cart', problem: "Card declines and chargebacks eat into online sales, and cross-border customers often can't pay.", answer: 'Customers pay in crypto at checkout or by link. Payments are final, so 0% chargebacks. Keep it, cash out or spend it.', flows: ['Crypto In','Fiat Out','Cards'], facts: ['0% chargebacks','7+ chains'], photo: ecommercePhoto.url, prismPhoto: ecommercePrismPhoto.url, film: { mp4: ecommerceMp4.url, webm: ecommerceWebm.url, poster: ecommercePoster.url }, demo: ['ORDER #2041','89.00 USDT','PAID · FINAL'], caption: 'Checkout without borders.' },
  { id: 'saas', name: 'SaaS / Subscriptions', tagline: 'Recurring global payments', icon: 'cloud', problem: 'Global customers struggle to pay, and your own cloud and tool bills pile up across many cards.', answer: 'Take crypto payments from customers anywhere and manage connected business spend from one balance.', flows: ['Crypto In','Fiat Out','Cards'], facts: ['Flat 1%','One balance'], photo: saasPhoto.url, prismPhoto: saasPrismPhoto.url, film: { mp4: saasMp4.url, webm: saasWebm.url, poster: saasPoster.url }, demo: ['PLAN · PRO','49.00 USDC','PAID'], caption: 'One balance for global software.' },
  { id: 'marketplaces', name: 'Marketplaces', tagline: 'Collect and pay sellers', icon: 'store', problem: 'Collecting from buyers and paying hundreds of sellers means many tools and many fees.', answer: 'Collect from buyers with Crypto In, then pay every seller in one batch, in crypto or to their bank.', flows: ['Crypto In','Crypto Out','Fiat Out'], facts: ['One batch','180+ currencies'], photo: marketPhoto.url, prismPhoto: marketplacePrismPhoto.url, film: { mp4: marketMp4.url, webm: marketWebm.url, poster: marketPoster.url }, demo: ['BUYER PAID','300.00 USDT','3 SELLERS PAID'], caption: 'Buyer in. Sellers out.' },
  { id: 'remittance', name: 'Remittance', tagline: 'Move funds across borders', icon: 'globe', problem: 'Sending money home is slow and expensive, and the final amount is unclear.', answer: 'Fund in crypto and pay out to bank accounts in 180+ currencies. See the rate before you confirm.', flows: ['Crypto In','Fiat Out'], facts: ['180+ currencies','Rate shown first'], photo: remittancePhoto.url, prismPhoto: remittancePrismPhoto.url, film: { mp4: remitMp4.url, webm: remitWebm.url, poster: remitPoster.url }, demo: ['SEND 500 USDT','→ INR','IN BANK'], caption: 'A clearer way home.' },
  { id: 'gaming', name: 'Gaming', tagline: 'Digital-first payments', icon: 'gamepad', problem: 'Top-up fraud and chargebacks hurt margins, and players want fast payouts.', answer: 'Instant crypto top-ups that stay paid, and fast crypto payouts for winnings and creators.', flows: ['Crypto In','Crypto Out','Cards'], facts: ['0% chargebacks','<3 sec crypto-to-crypto'], photo: gamingPhoto.url, prismPhoto: gamingPrismPhoto.url, film: { mp4: gameMp4.url, webm: gameWebm.url, poster: gamePoster.url }, demo: ['TOP-UP','20.00 USDT','CREDITED'], caption: 'Value at game speed.' },
  { id: 'freelance', name: 'Freelance Platforms', tagline: 'Flexible global payouts', icon: 'briefcase', problem: 'Paying freelancers in many countries is slow, costly and hard to track.', answer: 'Pay everyone in one batch: crypto to wallets, cash to banks, or a card to spend from.', flows: ['Crypto Out','Fiat Out','Cards'], facts: ['One batch','Status per person'], photo: freelancePhoto.url, prismPhoto: freelancePrismPhoto.url, film: { mp4: freelanceMp4.url, webm: freelanceWebm.url, poster: freelancePoster.url }, demo: ['BATCH · 12 PEOPLE','8,400 USDT','ALL PAID'], caption: 'Pay talent their way.' },
] as const satisfies readonly [Industry, ...Industry[]];