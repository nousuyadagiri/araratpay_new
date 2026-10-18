# AraratPeak Gateway

Build a premium, 3D-animated marketing website for "AraratPay", a crypto payment gateway. Act as a top-tier UI/UX designer and senior front-end developer. Quality bar: Stripe, Linear, Revolut Business.

TECH
- React + TypeScript + Tailwind + shadcn/ui
- 3D: @react-three/fiber + @react-three/drei (lazy-loaded, Suspense fallback)
- Motion: framer-motion for UI; gsap + ScrollTrigger for scroll-driven scenes
- Smooth scroll: lenis
- Respect prefers-reduced-motion (disable 3D motion/parallax, keep static renders)
- Mobile: swap heavy 3D scenes for lightweight static/CSS versions under 768px
- Lazy-load everything below the fold; aim for strong performance

BRAND CONCEPT
The name comes from Mount Ararat. Visual metaphor: a peak built from a network — stability, elevation, trust. Use it subtly: a low-poly mountain made of connected nodes and glowing transaction lines. No literal landscape photos.

DESIGN SYSTEM
- Dark-first. Background #07090F, surface #0E121B, elevated #151A26, border rgba(255,255,255,0.08)
- Primary: deep amber/copper gradient (#F5A524 → #E0662B), evoking sunrise on a peak
- Secondary accent: teal #2DD4BF for "settled/success" states
- Text: #F4F5F7 primary, #9AA3B2 secondary
- Fonts: "Space Grotesk" headings, "Inter" body, "JetBrains Mono" for numbers/code
- Large display type (hero 72–88px desktop), tight heading letter-spacing
- Glassmorphism cards (backdrop-blur, 1px gradient border), subtle grain texture overlay
- Radius 16px cards, pill buttons
- Primary button = amber gradient with glow on hover; secondary = glass outline
- All numbers in tabular monospace
Define all colors as semantic tokens in index.css / tailwind config.

NAVBAR (sticky, glass on scroll, shrinks on scroll)
Logo "AraratPay" (simple geometric peak mark + wordmark) | Products ▾ (mega-menu: Crypto In, Crypto Out, Fiat Out, Cards — icon + one-line description each) | Solutions ▾ | Developers | Pricing | Security | Company | Log In | [Get Started →]. Mobile: animated full-screen menu.

HERO (full viewport)
- Background: full-bleed looping video (<video autoPlay muted loop playsInline preload="metadata">) with poster. Use placeholder paths "/videos/hero.mp4", "/videos/hero.webm", "/videos/hero-poster.jpg" (I'll upload these later). Until the files exist, show a rich animated fallback background (dark gradient mesh with slowly drifting amber/teal light and a faint animated grid) so the hero never looks empty. Overlay a dark gradient (left ~85% opacity → right ~40%) for readability.
- Left:
  Eyebrow pill: "Crypto In · Crypto Out · Fiat Out · Cards"
  Headline: "One Gateway. Every Currency. Total Control." (word-by-word reveal)
  Subheadline: "Accept crypto payments, pay out in crypto or fiat, and issue cards — all on a single blockchain-secured platform."
  CTAs: [Start Accepting Payments] (primary) [Talk to Sales] (secondary) and "View API Docs →" text link
- Right: floating 3D glass checkout widget built in react-three-fiber (or a CSS-3D fallback) that tilts with mouse movement, showing a live-looking transaction sequence that loops: "Customer paid 250 USDT" → "Smart-contract settlement" → "Settled $250.00" with a teal check → payout choice chips "Crypto / Bank / Card".
- Below hero: infinite logo marquee of chains (Bitcoin, Ethereum, Tron, Solana, Polygon, Avalanche, BNB Chain — use simple SVG glyph/text marks), label "Built for 7+ blockchains".
- Compliance strip (small, muted): KYC/AML Compliant · SOC 2 Type II (in progress) · Multi-sig Cold Storage · Smart Contract Audited
- Scroll indicator at bottom.

In this first step build ONLY the design system, navbar, and hero (plus a minimal footer stub). Make components reusable — more sections and pages will follow.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7af7e689-94d0-422b-b997-3561621da9f8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Current typography design notes
Familjen Grotesk 700 for primary headings and the live capital-A Araratpay wordmark; 600 for smaller headings. Inter remains body/UI/buttons; JetBrains Mono remains figures/labels/code. Self-hosted Latin WOFF2 faces use font-display: swap, with only used critical weights preloaded. All route heading and large-number sizes share --heading-scale (.8 relative to the preceding design), tracking -0.015em (small headings -0.01em), and display leading 1.1. Large leads use --lead-scale (.95), with a 14px prose floor. Logo imagery, content, palette and interactions are unchanged.

## Current light-theme section design notes
The alternating teal palette supersedes the original brief and sage palette. Sections after heroes alternate rectangular light teal (#DDF0EE) and deep teal (#3F7474) through reusable data-band roles, including lazy homepage sheets. Light bands use charcoal text, #33454A secondary copy, white panels and deep-teal actions. Dark bands use white text, #E3F3F1 secondary/mono copy, white actions and frosted panels with a subtle dark underlay where needed for readability. Financial tools, invoices, charts, checkout and code remain white with dark local tokens. Small teal labels use #33605F where #3F7474 falls just below 4.5:1 on light teal. Footer stays charcoal, solid navigation white, hero surrounds light teal. Dark theme and opening films are unchanged. Security and Developers retain their paired layout, with a light Developers sub-band.
