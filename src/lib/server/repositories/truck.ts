import { db } from "$lib/server/db";
import { trucks } from "$lib/server/db/schema";
import type { Truck } from "$lib/types";
import { asc, eq } from "drizzle-orm";

export function listTrucks(companyId: string): Promise<Truck[]> {
  return db
    .select()
    .from(trucks)
    .where(eq(trucks.companyId, companyId))
    .orderBy(asc(trucks.licensePlate));
}

export function getTruck(id: number): Promise<Truck | undefined> {
  return db.select().from(trucks).where(eq(trucks.id, id)).then((r) => r[0]);
}

export function createTruck(
  companyId: string,
  licensePlate: string,
): Promise<Truck> {
  return db
    .insert(trucks)
    .values({ companyId, licensePlate })
    .returning()
    .then((r) => r[0]);
}

export function updateTruck(
  id: number,
  licensePlate: string,
): Promise<Truck | undefined> {
  return db
    .update(trucks)
    .set({ licensePlate })
    .where(eq(trucks.id, id))
    .returning()
    .then((r) => r[0]);
}

export function deleteTruck(id: number): Promise<void> {
  return db.delete(trucks).where(eq(trucks.id, id)).then(() => undefined);
}
