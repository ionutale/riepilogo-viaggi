import { authOrganizations, authMembers } from "$lib/server/db/schema";
import { companies } from "$lib/server/db/schema";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";

export const load = async (event) => {
  const { user, activeCompanyId } = event.locals;
  const userCompanies: { id: string; name: string }[] = [];

  if (user) {
    const isSuperadmin = (user as any)?.superadmin;

    if (isSuperadmin) {
      const all = await db
        .select({ id: companies.id, name: companies.name })
        .from(companies);
      userCompanies.push(...all);
    } else if (user.id) {
      const memberships = await db
        .select({
          orgId: authMembers.organizationId,
          orgName: authOrganizations.name,
        })
        .from(authMembers)
        .innerJoin(authOrganizations, eq(authMembers.organizationId, authOrganizations.id))
        .where(eq(authMembers.userId, user.id));

      for (const m of memberships) {
        const c = await db
          .select({ id: companies.id, name: companies.name })
          .from(companies)
          .where(eq(companies.id, m.orgId))
          .limit(1)
          .then((r) => r[0]);
        if (c) userCompanies.push(c);
      }
    }

    if (userCompanies.length > 0 && !activeCompanyId) {
      event.locals.activeCompanyId = userCompanies[0].id;
    }
  }

  const activeCompany = activeCompanyId
    ? await db
        .select()
        .from(companies)
        .where(eq(companies.id, activeCompanyId))
        .limit(1)
        .then((r) => r[0])
    : null;

  const isSuperadmin = user ? (user as any)?.superadmin : false;

  return { userCompanies, activeCompany, user: { id: user?.id, isSuperadmin } };
};
