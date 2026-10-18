// Six 7-second excerpts with 0.6-second dissolves, including the loop seam.
export const HERO_FILM_DURATION = 38.4;
export const HERO_SHOT_BOUNDARIES = [6.1, 12.5, 18.9, 25.3, 31.7];
export const HERO_LOOP_RESET = 38.1;

export const heroFilmShots = [
  { direction: "Receiving", title: "Payment received", amount: "+250.00 USDC", status: "Settled" },
  { direction: "Sending", title: "Sending", amount: "100.00 USDT", status: "Sent" },
  { direction: "Receiving", title: "Payment received", amount: "+250.00 USDC", status: "Settled" },
  { direction: "Sending", title: "Sending", amount: "100.00 USDT", status: "Sent" },
  { direction: "Receiving", title: "Payment received", amount: "+250.00 USDC", status: "Settled" },
  { direction: "Sending", title: "Sending", amount: "100.00 USDT", status: "Sent" },
] as const;

export function heroShotAtTime(time: number) {
  const local = ((time % HERO_FILM_DURATION) + HERO_FILM_DURATION) % HERO_FILM_DURATION;
  return local >= HERO_LOOP_RESET ? 0 : HERO_SHOT_BOUNDARIES.filter(boundary => local >= boundary).length;
}