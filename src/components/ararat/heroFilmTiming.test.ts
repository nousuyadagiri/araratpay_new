import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { HERO_FILM_DURATION, heroFilmShots, heroShotAtTime } from "./heroFilmTiming";

describe("illustrative receiving/sending film", () => {
  it("alternates the six requested transaction directions", () => {
    assert.deepEqual(heroFilmShots.map(shot => shot.direction), ["Receiving", "Sending", "Receiving", "Sending", "Receiving", "Sending"]);
  });
  it("uses +250.00 USDC and Settled for every receiving shot", () => {
    assert.deepEqual(heroFilmShots.filter(shot => shot.direction === "Receiving").map(({ amount, status }) => ({ amount, status })), Array(3).fill({ amount: "+250.00 USDC", status: "Settled" }));
  });
  it("uses 100.00 USDT and Sent for every sending shot", () => {
    assert.deepEqual(heroFilmShots.filter(shot => shot.direction === "Sending").map(({ amount, status }) => ({ amount, status })), Array(3).fill({ amount: "100.00 USDT", status: "Sent" }));
  });
  it("changes at dissolve midpoints and resets through the seamless return", () => {
    assert.deepEqual([3, 9, 16, 22, 29, 35].map(heroShotAtTime), [0, 1, 2, 3, 4, 5]);
    assert.equal(heroShotAtTime(6.09), 0);
    assert.equal(heroShotAtTime(6.11), 1);
    assert.equal(heroShotAtTime(38.11), 0);
    assert.equal(heroShotAtTime(HERO_FILM_DURATION), 0);
  });
});