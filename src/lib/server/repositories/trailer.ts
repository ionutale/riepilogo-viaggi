import { db } from "$lib/server/db";
import { trailers } from "$lib/server/db/schema";
import type { Trailer } from "$lib/types";
import { asc, eq } from "drizzle-orm";

export function listTrailers(companyId: string): Promise<Trailer[]> {
  return db
    .select()
    .from(trailers)
    .where(eq(trailers.companyId, companyId))
    .orderBy(asc(trailers.licensePlate));
}

export function getTrailer(id: number): Promise<Trailer | undefined> {
  return db.select().from(trailers).where(eq(trailers.id, id)).then((r) => r[0]);
}

export function createTrailer(
  companyId: string,
  licensePlate: string,
): Promise<Trailer> {
  return db
    .insert(trailers)
    .values({ companyId, licensePlate })
    .returning()
    .then((r) => r[0]);
}

export function updateTrailer(
  id: number,
  licensePlate: string,
): Promise<Trailer | undefined> {
  return db
    .update(trailers)
    .set({ licensePlate })
    .where(eq(trailers.id, id))
    .returning()
    .then((r) => r[0]);
}

export function deleteTrailer(id: number): Promise<void> {
  return db.delete(trailers).where(eq(trailers.id, id)).then(() => undefined);
}
