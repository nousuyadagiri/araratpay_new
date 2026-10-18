<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep `/` and reusable Ararat components; NearMount defers lower modules.
- Keep preview destinations honest coming-soon dialogs; contact is preview-only without submission, and legal text is pending review.
- Keep the flat 1% fee and illustrative card-comparison inputs in `src/config/pricing.ts`; never reintroduce pricing plans.
- Use one flow template at `/platform/$slug`, productData for content, and PageShell for shared informational pages; legacy URLs redirect.
- FlowContent and signature/visual slots preserve the eleven-section flow template.
- Use the logo palette through semantic tokens: charcoal #0E1016, silver #DBE1E6, teal #5FA9A2; mirror these in sceneColors for WebGL.
- Render the official araratpay-mark.svg through AraratLogo/AraratMark for theme consistency.
- Fonts: Familjen Grotesk 700 headings/live Araratpay wordmark, 600 smaller headings; Inter body/UI/buttons; JetBrains Mono figures/labels/code. Self-host swap faces; preload used critical weights.
- Share heading-scale/display metrics; preserve independent wordmarks. Closing CTAs separate copy and marks into grid columns to prevent occlusion.
- HeroSection owns film/pin/poster. Bake review invoices into device quads; local blink masks prevent device morphing. Review is unlinked/noindex/static until Play; installation needs approval.
- Section 01 uses CSS-3D steps/invoice, status pills and SVG coins; spring motion values avoid pointer state and WebGL.
- Every drawn QR uses the shared qr-tile styles and dedicated QR color tokens, not inherited theme ink, to preserve contrast and quiet zones in every theme.
- Section 02 uses CSS-3D fanned video cards, spring parallax and SVG coins; tablet snaps, reduced motion grids. Visible desktop videos play; tablet plays its active card.
- Sections 01–04 use exact desktop frames; 01–03 stretch real tracks, not scaled text. Flow lists stay visible. Mobile/short screens flow. Activity is illustrative.
- Section 04 has one ring/slot; first-render readiness hides fallback. Ref-driven sweeps/depth motion avoid rerenders; mobile is static media.
- SmoothScroll owns ticker-driven Lenis off-homepage; native homepage snap avoids competing controllers. Use refs/CSS vars.
- Set theme pre-paint. SectionBands owns ordered bands and light-panel roles; replace only measured teal section paint/exposed ink in light mode, preserving panel/control tokens and dark media.

- Keep sheets untransformed for sticky content. Light-only gutters contain tables/code with local scrolling to prevent page overflow.

- Security/builders share an eyebrow; FAQ stands alone.

## Homepage interactions
- Invoice steps advance on an interval, pausing for direct step interaction; figures remain illustrative, never live funds.
- Fee towers retain pricing config; the split comparison retains illustrative axes, never measured scores.
- Sections 05–07 scope live themes; coverageSceneColors updates globe materials without remounting. One lazy slot shares worldDots/coverageData with the accessible map to limit GPU work.
- Regional activity is illustrative, never a rail availability claim; fast settlement applies only crypto-to-crypto.
- Keep `/developers` a preview-only API reference; docsData holds the illustrative catalog and ApiDocs owns local mock interactions. Never call the example endpoints or claim that keys, SDKs, webhooks, or uptime are live.
- AraratPay is one platform with four flows, not four separate products; keep old /products/$slug redirects.
- The contact form is preview-only and validates required identity fields locally; it must not send or store visitor data until a real intake service is explicitly requested.
- Keep the Security dive as one pinned desktop ScrollTrigger with one near-viewport WebGL slot; render static/mobile cards without WebGL and lazy-mount lower sheets to preserve performance.
- Company uses hosted asset pointers, one near-viewport video and lazy lower sections; never present stock people as staff.
- Keep `/solutions` driven by one shared industry index across its prism, scene, matrix, setup, and photo strip; desktop pins the CSS prism sequence while mobile uses scroll snap.


## Unconfirmed, do not publish
- Do not publish licences or registrations, custody/key-management model, screening provider, penetration-test dates, named partners, HQ, legal entity, launch dates, open roles, or press-kit availability until verified.
- Do not publish unsupported coin lists, transaction minimums, batch limits, approval limits, rate-lock duration, payout timing, region/country/card availability, card network/types, or team-card controls until verified.
- Do not publish FX spread, blockchain network-fee treatment, volume discounts, support channels, API/SDK/plugin availability, webhook signing/retry details, rate limits, uptime, or status-page claims until verified.
- Public pages must never display TBC/TBD/to-be-confirmed markers; remove the item or use neutral copy without implying availability.

- Shared theme-aware check tokens include white-on-teal filled circles for readable confirmations.
- Label sample financial activity Illustrative.
