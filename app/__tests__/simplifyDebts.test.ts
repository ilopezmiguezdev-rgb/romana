import { describe, it, expect } from "vitest";

type Debt = { from: string; to: string; amount: number };

// Mirror the DB greedy algorithm for testing
function simplifyDebts(balances: Record<string, number>): Debt[] {
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  for (const [id, balance] of Object.entries(balances)) {
    if (balance > 0) creditors.push({ id, amount: balance });
    else if (balance < 0) debtors.push({ id, amount: Math.abs(balance) });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const result: Debt[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const transfer = Math.min(creditors[ci].amount, debtors[di].amount);
    if (transfer > 0) {
      result.push({
        from: debtors[di].id,
        to: creditors[ci].id,
        amount: Math.round(transfer * 100) / 100,
      });
    }
    creditors[ci].amount -= transfer;
    debtors[di].amount -= transfer;
    if (creditors[ci].amount === 0) ci++;
    if (debtors[di].amount === 0) di++;
  }

  return result;
}

describe("simplifyDebts", () => {
  it("returns empty for balanced group", () => {
    expect(simplifyDebts({ alice: 0, bob: 0 })).toEqual([]);
  });

  it("handles simple 2-person debt", () => {
    const result = simplifyDebts({ alice: 20, bob: -20 });
    expect(result).toEqual([{ from: "bob", to: "alice", amount: 20 }]);
  });

  it("handles 3-person scenario: one paid, others owe", () => {
    const result = simplifyDebts({ alice: 40, bob: -20, carol: -20 });
    expect(result).toHaveLength(2);
    expect(result.reduce((sum, d) => sum + d.amount, 0)).toBe(40);
  });

  it("minimizes transactions with cross-debts", () => {
    // Alice +30, Bob -10, Carol -20
    const result = simplifyDebts({ alice: 30, bob: -10, carol: -20 });
    expect(result.length).toBeLessThanOrEqual(2);
  });

  it("handles single person group", () => {
    expect(simplifyDebts({ alice: 0 })).toEqual([]);
  });
});
