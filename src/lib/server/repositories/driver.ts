import { db } from "$lib/server/db";
import { drivers } from "$lib/server/db/schema";
import type { Driver } from "$lib/types";
import { asc, eq, and } from "drizzle-orm";

export function listDrivers(companyId: string): Promise<Driver[]> {
  return db
    .select()
    .from(drivers)
    .where(eq(drivers.companyId, companyId))
    .orderBy(asc(drivers.name));
}

export function getDriver(id: number): Promise<Driver | undefined> {
  return db.select().from(drivers).where(eq(drivers.id, id)).then((r) => r[0]);
}

export function createDriver(
  companyId: string,
  name: string,
): Promise<Driver> {
  return db
    .insert(drivers)
    .values({ companyId, name })
    .returning()
    .then((r) => r[0]);
}

export function updateDriver(
  id: number,
  name: string,
): Promise<Driver | undefined> {
  return db
    .update(drivers)
    .set({ name })
    .where(eq(drivers.id, id))
    .returning()
    .then((r) => r[0]);
}

export function deleteDriver(id: number): Promise<void> {
  return db.delete(drivers).where(eq(drivers.id, id)).then(() => undefined);
}
