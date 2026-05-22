import { db } from "$lib/server/db";
import {
  tripsheets,
  dailyEntries,
  stops,
  fuelings,
  drivers,
  trucks,
  clients,
  companies,
  authUsers,
  authOrganizations,
} from "$lib/server/db/schema";
import type {
  Tripsheet,
  TripsheetWithRelations,
  TripsheetTotals,
} from "$lib/types";
import { eq, and, asc, inArray, desc } from "drizzle-orm";

export function listTripsheets(companyId: string): Promise<Tripsheet[]> {
  return db
    .select()
    .from(tripsheets)
    .where(eq(tripsheets.companyId, companyId))
    .orderBy(desc(tripsheets.weekStartDate));
}

export async function getTripsheet(
  id: number,
): Promise<TripsheetWithRelations | undefined> {
  const [ts] = await db
    .select()
    .from(tripsheets)
    .where(eq(tripsheets.id, id))
    .innerJoin(drivers, eq(tripsheets.driverId, drivers.id))
    .innerJoin(trucks, eq(tripsheets.truckId, trucks.id))
    .limit(1);

  if (!ts) return undefined;

  const entries = await db
    .select()
    .from(dailyEntries)
    .where(eq(dailyEntries.tripsheetId, ts.tripsheets.id))
    .leftJoin(clients, eq(dailyEntries.clientId, clients.id))
    .orderBy(asc(dailyEntries.dayOfWeek));

  const entryIds = entries.map((e) => e.daily_entries.id);
  const stopsRows =
    entryIds.length > 0
      ? await db
          .select()
          .from(stops)
          .where(inArray(stops.dailyEntryId, entryIds))
          .orderBy(asc(stops.sortOrder))
      : [];
  const fuelingsRows =
    entryIds.length > 0
      ? await db
          .select()
          .from(fuelings)
          .where(inArray(fuelings.dailyEntryId, entryIds))
      : [];

  const stopsByEntry = groupBy(stopsRows, (s) => s.dailyEntryId);
  const fuelingsByEntry = groupBy(fuelingsRows, (f) => f.dailyEntryId);

  return {
    ...ts.tripsheets,
    driver: ts.drivers,
    truck: ts.trucks,
    dailyEntries: entries.map((e) => ({
      ...e.daily_entries,
      client: e.clients ?? null,
      stops: stopsByEntry.get(e.daily_entries.id) ?? [],
      fuelings: fuelingsByEntry.get(e.daily_entries.id) ?? [],
    })),
  };
}

export async function saveTripsheet(
  id: number,
  data: {
    startKm?: number;
    endKm?: number;
    driverId?: number;
    truckId?: number;
  },
): Promise<void> {
  await db.update(tripsheets).set(data).where(eq(tripsheets.id, id));
}

export async function saveDailyEntry(
  entryId: number,
  data: {
    clientId?: number | null;
    dayStatus?: string;
    dailyKm?: number | null;
    notes?: string | null;
  },
): Promise<void> {
  await db.update(dailyEntries).set(data).where(eq(dailyEntries.id, entryId));
}

export async function replaceStops(
  entryId: number,
  newStops: { fromLocation: string; toLocation: string; sortOrder: number }[],
): Promise<void> {
  await db.delete(stops).where(eq(stops.dailyEntryId, entryId));
  if (newStops.length > 0) {
    await db
      .insert(stops)
      .values(newStops.map((s) => ({ ...s, dailyEntryId: entryId })));
  }
}

export async function replaceFuelings(
  entryId: number,
  newFuelings: { liters: string; cost: string }[],
): Promise<void> {
  await db.delete(fuelings).where(eq(fuelings.dailyEntryId, entryId));
  if (newFuelings.length > 0) {
    await db
      .insert(fuelings)
      .values(newFuelings.map((f) => ({ ...f, dailyEntryId: entryId })));
  }
}

export async function getTotals(
  tripsheetId: number,
): Promise<TripsheetTotals> {
  const [ts] = await db
    .select()
    .from(tripsheets)
    .where(eq(tripsheets.id, tripsheetId))
    .limit(1);
  if (!ts) return { totalKm: 0, totalLiters: 0, totalCost: 0 };

  const entries = await db
    .select()
    .from(dailyEntries)
    .where(
      and(
        eq(dailyEntries.tripsheetId, tripsheetId),
        eq(dailyEntries.dayStatus, "working"),
      ),
    );

  const entryIds = entries.map((e) => e.id);
  if (entryIds.length === 0) {
    return {
      totalKm: ts.endKm - ts.startKm,
      totalLiters: 0,
      totalCost: 0,
    };
  }

  const fuelRows = await db
    .select()
    .from(fuelings)
    .where(inArray(fuelings.dailyEntryId, entryIds));

  const totalKm = entries.reduce((s, e) => s + (e.dailyKm ?? 0), 0);
  const totalLiters = fuelRows.reduce((s, f) => s + Number(f.liters), 0);
  const totalCost = fuelRows.reduce((s, f) => s + Number(f.cost), 0);

  return { totalKm, totalLiters, totalCost };
}

export async function createTripsheet(data: {
  companyId: string;
  driverId: number;
  truckId: number;
  weekStartDate: string;
  startKm: number;
  endKm: number;
}): Promise<number> {
  const [ts] = await db
    .insert(tripsheets)
    .values(data)
    .returning({ id: tripsheets.id });
  const days = Array.from({ length: 7 }, (_, i) => ({
    tripsheetId: ts.id,
    dayOfWeek: i,
    dayStatus: "working",
  }));
  await db.insert(dailyEntries).values(days);
  return ts.id;
}

export async function deleteTripsheet(id: number): Promise<void> {
  await db.delete(tripsheets).where(eq(tripsheets.id, id));
}

export async function getFuelingsByCompany(
  companyId: string,
  filters: { truckId?: number; driverId?: number; from?: string; to?: string },
) {
  const conditions = [eq(tripsheets.companyId, companyId)];

  if (filters.truckId) conditions.push(eq(tripsheets.truckId, filters.truckId));
  if (filters.driverId)
    conditions.push(eq(tripsheets.driverId, filters.driverId));

  const query = db
    .select({
      id: fuelings.id,
      date: tripsheets.weekStartDate,
      dayOfWeek: dailyEntries.dayOfWeek,
      liters: fuelings.liters,
      cost: fuelings.cost,
      dailyKm: dailyEntries.dailyKm,
      driverName: drivers.name,
      truckPlate: trucks.licensePlate,
    })
    .from(fuelings)
    .innerJoin(dailyEntries, eq(fuelings.dailyEntryId, dailyEntries.id))
    .innerJoin(tripsheets, eq(dailyEntries.tripsheetId, tripsheets.id))
    .innerJoin(drivers, eq(tripsheets.driverId, drivers.id))
    .innerJoin(trucks, eq(tripsheets.truckId, trucks.id))
    .where(and(...conditions))
    .orderBy(desc(tripsheets.weekStartDate), asc(dailyEntries.dayOfWeek));

  return query;
}

function groupBy<T, K>(items: T[], fn: (item: T) => K): Map<K, T[]> {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const key = fn(item);
    const group = map.get(key);
    if (group) group.push(item);
    else map.set(key, [item]);
  }
  return map;
}
