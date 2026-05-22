import { describe, it, expect } from "vitest";
import {
  LoginSchema,
  RegisterSchema,
  CompanySchema,
  TruckSchema,
  TrailerSchema,
  DriverSchema,
  ClientSchema,
  TripsheetHeaderSchema,
  DailyEntryPayloadSchema,
} from "$lib/validation/schemas";

describe("LoginSchema", () => {
  it("accepts valid email and password", () => {
    const r = LoginSchema.safeParse({ email: "test@example.com", password: "secret" });
    expect(r.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const r = LoginSchema.safeParse({ email: "not-an-email", password: "secret" });
    expect(r.success).toBe(false);
  });

  it("rejects empty password", () => {
    const r = LoginSchema.safeParse({ email: "test@example.com", password: "" });
    expect(r.success).toBe(false);
  });
});

describe("RegisterSchema", () => {
  it("accepts valid registration", () => {
    const r = RegisterSchema.safeParse({ name: "Test", email: "test@example.com", password: "12345678" });
    expect(r.success).toBe(true);
  });

  it("rejects short password", () => {
    const r = RegisterSchema.safeParse({ name: "Test", email: "test@example.com", password: "123" });
    expect(r.success).toBe(false);
  });

  it("rejects missing name", () => {
    const r = RegisterSchema.safeParse({ email: "test@example.com", password: "12345678" });
    expect(r.success).toBe(false);
  });
});

describe("TruckSchema", () => {
  it("uppercases license plate", () => {
    const r = TruckSchema.safeParse({ licensePlate: "ab123cd" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.licensePlate).toBe("AB123CD");
  });
});

describe("TrailerSchema", () => {
  it("uppercases license plate", () => {
    const r = TrailerSchema.safeParse({ licensePlate: "tr001xy" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.licensePlate).toBe("TR001XY");
  });
});

describe("DriverSchema", () => {
  it("rejects empty name", () => {
    const r = DriverSchema.safeParse({ name: "" });
    expect(r.success).toBe(false);
  });
});

describe("ClientSchema", () => {
  it("requires name, accepts optional fields", () => {
    const r = ClientSchema.safeParse({ name: "Test Client" });
    expect(r.success).toBe(true);
  });

  it("rejects empty name", () => {
    const r = ClientSchema.safeParse({ name: "" });
    expect(r.success).toBe(false);
  });
});

describe("CompanySchema", () => {
  it("requires name only", () => {
    const r = CompanySchema.safeParse({ name: "Test Co" });
    expect(r.success).toBe(true);
  });
});

describe("TripsheetHeaderSchema", () => {
  it("accepts valid header", () => {
    const r = TripsheetHeaderSchema.safeParse({ driverId: 1, truckId: 2, startKm: 100, endKm: 500 });
    expect(r.success).toBe(true);
  });

  it("rejects negative KM", () => {
    const r = TripsheetHeaderSchema.safeParse({ driverId: 1, truckId: 2, startKm: -1, endKm: 500 });
    expect(r.success).toBe(false);
  });
});

describe("DailyEntryPayloadSchema", () => {
  it("accepts valid entry", () => {
    const r = DailyEntryPayloadSchema.safeParse({
      dayOfWeek: 0, clientId: 1, dayStatus: "working",
      dailyKm: 150, notes: "", stops: [{ fromLocation: "MI", toLocation: "BO" }], fuelings: [],
    });
    expect(r.success).toBe(true);
  });

  it("rejects out-of-range dayOfWeek", () => {
    const r = DailyEntryPayloadSchema.safeParse({
      dayOfWeek: 7, dayStatus: "working",
      stops: [], fuelings: [],
    });
    expect(r.success).toBe(false);
  });
});
