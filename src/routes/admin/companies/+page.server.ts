import { requireSuperadmin } from "$lib/server/auth-guards";
import * as companyRepo from "$lib/server/repositories/company";
import { authOrganizations, authMembers } from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";

export const load = async (event) => {
  requireSuperadmin(event.locals);
  const companies = await companyRepo.listCompanies();
  const members = await Promise.all(
    companies.map(async (c) => {
      const org = await db
        .select()
        .from(authOrganizations)
        .where(eq(authOrganizations.id, c.id))
        .limit(1)
        .then((r) => r[0]);
      const count = await db
        .select({ count: authMembers.id })
        .from(authMembers)
        .where(eq(authMembers.organizationId, c.id))
        .then((r) => r.length);
      return { ...c, slug: org?.slug, memberCount: count };
    }),
  );
  return { companies: members };
};
