import * as tripsheetRepo from "$lib/server/repositories/tripsheet";
import type {
  TripsheetWithRelations,
  TripsheetTotals,
  DayStatus,
} from "$lib/types";

export async function createWeek(
  companyId: string,
  driverId: number,
  truckId: number,
  weekStartDate: string,
  startKm: number,
  endKm: number,
): Promise<number> {
  if (endKm < startKm) {
    throw new Error("Ending KM cannot be less than starting KM");
  }
  return tripsheetRepo.createTripsheet({
    companyId,
    driverId,
    truckId,
    weekStartDate,
    startKm,
    endKm,
  });
}

export async function getWeek(
  id: number,
): Promise<TripsheetWithRelations | undefined> {
  return tripsheetRepo.getTripsheet(id);
}

export async function updateDailyEntry(
  tripsheetId: number,
  dayOfWeek: number,
  data: {
    clientId?: number | null;
    dayStatus?: DayStatus;
    dailyKm?: number | null;
    notes?: string | null;
    stops?: { fromLocation: string; toLocation: string }[];
    fuelings?: { liters: string; cost: string }[];
  },
): Promise<void> {
  const ts = await tripsheetRepo.getTripsheet(tripsheetId);
  if (!ts) throw new Error("Tripsheet not found");

  const entry = ts.dailyEntries.find((e) => e.dayOfWeek === dayOfWeek);
  if (!entry) throw new Error("Daily entry not found");

  await tripsheetRepo.saveDailyEntry(entry.id, {
    clientId: data.clientId ?? null,
    dayStatus: data.dayStatus ?? "working",
    dailyKm: data.dailyKm ?? null,
    notes: data.notes ?? null,
  });

  if (data.stops !== undefined) {
    await tripsheetRepo.replaceStops(
      entry.id,
      data.stops.map((s, i) => ({ ...s, sortOrder: i })),
    );
  }

  if (data.fuelings !== undefined) {
    await tripsheetRepo.replaceFuelings(entry.id, data.fuelings);
  }
}

export async function getTotals(
  tripsheetId: number,
): Promise<TripsheetTotals> {
  return tripsheetRepo.getTotals(tripsheetId);
}

export async function deleteWeek(id: number): Promise<void> {
  return tripsheetRepo.deleteTripsheet(id);
}
