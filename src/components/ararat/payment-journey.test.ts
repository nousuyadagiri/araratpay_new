import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { sectionBandForIndex } from "./SectionBands";

describe("homepage payment band order", () => {
  it("How value moves is dark, Platform white, then light/dark alternation", () => {
    assert.deepEqual([0, 1, 2, 3, 4].map(index => sectionBandForIndex(index, true)), ["dark", "white", "light", "dark", "light"]);
  });
  it("other pages retain their light-first order", () => {
    assert.deepEqual([0, 1].map(index => sectionBandForIndex(index, false)), ["light", "dark"]);
  });
});