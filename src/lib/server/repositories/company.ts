import { db } from "$lib/server/db";
import { companies } from "$lib/server/db/schema";
import type { Company } from "$lib/types";
import { eq, asc } from "drizzle-orm";

export function listCompanies(): Promise<Company[]> {
  return db.select().from(companies).orderBy(asc(companies.name));
}

export function getCompany(id: string): Promise<Company | undefined> {
  return db.select().from(companies).where(eq(companies.id, id)).then((r) => r[0]);
}

export function createCompany(
  id: string,
  data: {
    name: string;
    address: string;
    city: string;
    vat: string;
    phone: string;
  },
): Promise<Company> {
  return db
    .insert(companies)
    .values({ id, ...data })
    .returning()
    .then((r) => r[0]);
}

export function updateCompany(
  id: string,
  data: {
    name: string;
    address: string;
    city: string;
    vat: string;
    phone: string;
  },
): Promise<Company | undefined> {
  return db
    .update(companies)
    .set(data)
    .where(eq(companies.id, id))
    .returning()
    .then((r) => r[0]);
}

export function deleteCompany(id: string): Promise<void> {
  return db.delete(companies).where(eq(companies.id, id)).then(() => undefined);
}
