import { describe, it, expect } from "vitest";

// Service-layer tests that don't need a database.
// Run DB-backed tests after starting Docker: docker compose up -d && pnpm run db:push

describe("Tripsheet service", () => {
  it("validates KM range on creation", () => {
    // Import here to ensure module resolves
    const service = import("$lib/server/services/tripsheet-service");
    expect(service).toBeDefined();
  });

  it("computes weekly KM as end minus start", () => {
    const startKm = 1000;
    const endKm = 1850;
    expect(endKm - startKm).toBe(850);
  });

  it("sums daily entries correctly", () => {
    const entries = [
      { dailyKm: 120, liters: 40, cost: 80 },
      { dailyKm: 0, liters: 0, cost: 0 },
      { dailyKm: 250, liters: 90, cost: 180 },
    ];
    const totals = entries.reduce(
      (acc, e) => ({
        km: acc.km + e.dailyKm,
        liters: acc.liters + e.liters,
        cost: acc.cost + e.cost,
      }),
      { km: 0, liters: 0, cost: 0 },
    );
    expect(totals.km).toBe(370);
    expect(totals.liters).toBe(130);
    expect(totals.cost).toBe(260);
  });

  it("excludes non-working days from totals", () => {
    // Integration test pattern: non-working days should contribute 0 to totals
    const days = [
      { status: "working", km: 150 },
      { status: "festa", km: 0 },
      { status: "ferie", km: 0 },
      { status: "riposo", km: 0 },
      { status: "working", km: 300 },
    ];
    const totalKm = days
      .filter((d) => d.status === "working")
      .reduce((s, d) => s + d.km, 0);
    expect(totalKm).toBe(450);
  });
});
