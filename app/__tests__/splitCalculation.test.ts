import { describe, it, expect } from "vitest";

// Mirror the DB logic for client-side validation/preview
function evenSplit(amount: number, count: number): number[] {
  const base = Math.floor(amount * 100 / count) / 100;
  const remainder = Math.round((amount - base * count) * 100) / 100;
  return Array.from({ length: count }, (_, i) =>
    i === count - 1 ? base + remainder : base
  );
}

function percentSplit(amount: number, percentages: number[]): number[] {
  let remaining = amount;
  return percentages.map((pct, i) => {
    if (i === percentages.length - 1) return Math.round(remaining * 100) / 100;
    const share = Math.floor(amount * pct / 100 * 100) / 100;
    remaining -= share;
    return share;
  });
}

describe("evenSplit", () => {
  it("splits evenly with no remainder", () => {
    expect(evenSplit(60, 3)).toEqual([20, 20, 20]);
  });

  it("assigns remainder to last person", () => {
    const result = evenSplit(10, 3);
    expect(result[0]).toBe(3.33);
    expect(result[1]).toBe(3.33);
    expect(result[2]).toBe(3.34);
    expect(result.reduce((a, b) => a + b)).toBeCloseTo(10);
  });

  it("handles 1 person", () => {
    expect(evenSplit(50, 1)).toEqual([50]);
  });

  it("handles 2 people evenly", () => {
    expect(evenSplit(100, 2)).toEqual([50, 50]);
  });
});

describe("percentSplit", () => {
  it("splits by percentage", () => {
    const result = percentSplit(100, [50, 30, 20]);
    expect(result).toEqual([50, 30, 20]);
  });

  it("handles rounding remainder", () => {
    const result = percentSplit(10, [33.33, 33.33, 33.34]);
    expect(result.reduce((a, b) => a + b)).toBeCloseTo(10);
  });
});
