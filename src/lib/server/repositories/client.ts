import { db } from "$lib/server/db";
import { clients } from "$lib/server/db/schema";
import type { Client } from "$lib/types";
import { asc, eq, ilike, and } from "drizzle-orm";

export function listClients(companyId: string): Promise<Client[]> {
  return db
    .select()
    .from(clients)
    .where(eq(clients.companyId, companyId))
    .orderBy(asc(clients.name));
}

export function getClient(id: number): Promise<Client | undefined> {
  return db.select().from(clients).where(eq(clients.id, id)).then((r) => r[0]);
}

export function searchClients(
  companyId: string,
  query: string,
): Promise<Client[]> {
  return db
    .select()
    .from(clients)
    .where(
      and(eq(clients.companyId, companyId), ilike(clients.name, `%${query}%`)),
    )
    .orderBy(asc(clients.name));
}

export function createClient(
  companyId: string,
  data: {
    name: string;
    address: string;
    city: string;
    vat: string;
    phone: string;
  },
): Promise<Client> {
  return db
    .insert(clients)
    .values({ ...data, companyId })
    .returning()
    .then((r) => r[0]);
}

export function updateClient(
  id: number,
  data: {
    name: string;
    address: string;
    city: string;
    vat: string;
    phone: string;
  },
): Promise<Client | undefined> {
  return db
    .update(clients)
    .set(data)
    .where(eq(clients.id, id))
    .returning()
    .then((r) => r[0]);
}

export function deleteClient(id: number): Promise<void> {
  return db.delete(clients).where(eq(clients.id, id)).then(() => undefined);
}
