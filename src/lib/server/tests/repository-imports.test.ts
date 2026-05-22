import { describe, it, expect } from "vitest";

describe("Repository module imports", () => {
  it("can import client repository", async () => {
    const mod = await import("$lib/server/repositories/client");
    expect(mod.listClients).toBeDefined();
    expect(mod.getClient).toBeDefined();
    expect(mod.createClient).toBeDefined();
    expect(mod.updateClient).toBeDefined();
    expect(mod.deleteClient).toBeDefined();
  });

  it("can import driver repository", async () => {
    const mod = await import("$lib/server/repositories/driver");
    expect(mod.listDrivers).toBeDefined();
    expect(mod.getDriver).toBeDefined();
    expect(mod.createDriver).toBeDefined();
    expect(mod.updateDriver).toBeDefined();
    expect(mod.deleteDriver).toBeDefined();
  });

  it("can import truck repository", async () => {
    const mod = await import("$lib/server/repositories/truck");
    expect(mod.listTrucks).toBeDefined();
    expect(mod.getTruck).toBeDefined();
    expect(mod.createTruck).toBeDefined();
    expect(mod.updateTruck).toBeDefined();
    expect(mod.deleteTruck).toBeDefined();
  });

  it("can import trailer repository", async () => {
    const mod = await import("$lib/server/repositories/trailer");
    expect(mod.listTrailers).toBeDefined();
    expect(mod.getTrailer).toBeDefined();
    expect(mod.createTrailer).toBeDefined();
    expect(mod.updateTrailer).toBeDefined();
    expect(mod.deleteTrailer).toBeDefined();
  });

  it("can import company repository", async () => {
    const mod = await import("$lib/server/repositories/company");
    expect(mod.getCompany).toBeDefined();
    expect(mod.updateCompany).toBeDefined();
    expect(mod.listCompanies).toBeDefined();
  });

  it("can import tripsheet repository", async () => {
    const mod = await import("$lib/server/repositories/tripsheet");
    expect(mod.listTripsheets).toBeDefined();
    expect(mod.getTripsheet).toBeDefined();
    expect(mod.createTripsheet).toBeDefined();
    expect(mod.deleteTripsheet).toBeDefined();
    expect(mod.getTotals).toBeDefined();
    expect(mod.getFuelingsByCompany).toBeDefined();
  });

  it("can import tripsheet service", async () => {
    const mod = await import("$lib/server/services/tripsheet-service");
    expect(mod.createWeek).toBeDefined();
    expect(mod.getWeek).toBeDefined();
    expect(mod.updateDailyEntry).toBeDefined();
    expect(mod.getTotals).toBeDefined();
    expect(mod.deleteWeek).toBeDefined();
  });
});
