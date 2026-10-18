# Homepage continuous film enhancement

The v3 film reuses the five previously generated v2 scenes: café phone payment, boutique card tap, market QR payment, studio online order and warehouse supplier payout. These are generated illustrative scenes, not licensed stock or documentary footage. No new stock sources or licence claims have been added. Source resolution is 1920×1080; no 4K source was available in this pass.

The scenes have a consistent warm grade, lifted brightness, saturation 1.12, contrast 1.07, restrained sharpening, temporal fine grain, 4% slow push-ins and 0.75-second crossfades. The 27-second edit is H.264/VP9 at 1080p and 720p; playback is muted, continuous and loops on desktop/mobile. Reduced-motion uses the poster. Shot labels switch at each crossfade midpoint.

## Files
- `hero-film-v3-1080.mp4`: 20,175,436 bytes
- `hero-film-v3-1080.webm`: 13,740,501 bytes
- `hero-film-v3-720.mp4`: 6,507,836 bytes
- `hero-film-v3-720.webm`: 5,708,496 bytes
- `poster.webp`: 125,202 bytes

All video formats use browser-compatible YUV 4:2:0. WebM is preferred, with H.264 MP4 fallback. Higher-bitrate encodes exceed the earlier 6 MB/3 MB targets. The hero and route preload reference the same poster. Prior asset pointers are retained for deployment safety.

## Superseded by v5
The homepage uses a six-shot, 30-second real licensed stock film. Current sources, commercial-use licences, wardrobe/action limitations, grading and file sizes are documented in `src/assets/company/SOURCES.md` under “Homepage six-shot colourful film (current v5)”. Unused old homepage pointer files are removed locally; immutable hosted originals remain available to older deployments.


## Previous homepage film — v14 POV inserts
The four existing bright generated wide shots are retained in full and unchanged: boutique owner in beige, woman at home in yellow, existing cafe woman using her laptop, and restaurant diner. New 3-second first-person inserts were generated from each scene’s own reference frame. No face appears in inserts; hands, cuffs, home wrist tattoo, devices and scenery were compared against the source references. These are illustrative generated scenes, not documentary footage or real customers.

Exact original payment UI is perspective-composited and tracked on each device: Tether Payment received +100 USDT; USDC Sent 100 USDC; laptop USDC Payment received +89 USDC; Tether Bill paid 100 USDT. Each says Settled · under 3 seconds and Illustrative; phones have teal Done buttons. No floating graphics or live-card synchronization remains.

The complete film is 50.01 seconds, 24fps, with gentle 0.3-second eye-line dissolves. Full wide clips are preserved rather than cut to six seconds. Desktop and mobile use VP9 WebM first with H.264 fallback, muted continuous looping; reduced motion uses the matching 1280×720 poster. Generated POV clips provide real hand motion, not still-image drift. The new inserts were explicitly approved for immediate installation.
- `hero-film-v14-1080.mp4`: 15,580,968 bytes
- `hero-film-v14-1080.webm`: 6,939,631 bytes
- `hero-film-v14-720.mp4`: 6,152,648 bytes
- `hero-film-v14-720.webm`: 3,557,718 bytes
- `hero-film-v14-poster.webp`: 41,334 bytes


## Previous homepage film — v15 screen-content update
Only the tracked device UI changes from v14. All four wide shots, POV source clips, screen masks, timing, transitions, grade, framing, poster and hero layout remain unchanged. No new imagery or footage was generated. The film remains 50.01 seconds at 24fps with 0.3-second dissolves.

Official Araratpay source mark is composited with the wordmark. Light Inter UI and JetBrains Mono amounts show one Illustrative caption per insert. Phones show 9:41. Boutique receives +100.00 USDT with order details and two recent payments. Home USDC and restaurant USDT checkouts show 250.00 with network selection, non-payable illustrative QR/address, countdown and Waiting for payment, changing at frame 32 (1.33s) to Payment sent with settlement and order summary. Cafe dashboard shows three older payments and a new highlighted +89.00 USDC row that slides in from frame 15, with a matching toast. Token marks are the retained Tether and USD Coin assets; no other brands or unverified claims are added. Fake order IDs, addresses and merchant activity are creative illustrative data.
- `hero-film-v15-1080.mp4`: 16,039,898 bytes
- `hero-film-v15-1080.webm`: 7,604,544 bytes
- `hero-film-v15-720.mp4`: 6,276,464 bytes
- `hero-film-v15-720.webm`: 3,757,184 bytes


## Current homepage film — v16 stable device composites
Retains every existing bright wide-shot source and all v15 payment copy, token marks and illustrative sample data. Each POV uses its own existing first frame; no new people or imagery generated. A fixed perspective quad and antialiased bezel-following mask bake the display into that frame before a single 4% cubic ease-in-out camera transform moves the whole picture. No independently moving screen overlay or per-frame corner detection remains. Insert motion is intentionally single-picture motion under the explicit stability brief.

Screen exposure is reduced and matched to the reference glass, with a faint static reflection gradient, subtle grain, softened edges and slight camera softness. Sending screens retain identical header/amount/network typography between states; the waiting pill stays in place and crossfades to sent over 500ms while QR/details fade to the order summary. Laptop row and toast ease/fade in over 500ms. Each insert remains three seconds. All story boundaries, including the loop return, use 700ms cubic eased cross-dissolves; the film is 46.51 seconds at 24fps. Wide-shot source footage, hero layout and the existing lightweight poster are retained. Reduced motion continues to show only the static poster. Prior CDN versions remain for deployment safety.
