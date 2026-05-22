import { requireSuperadmin } from "$lib/server/auth-guards";
import * as companyRepo from "$lib/server/repositories/company";
import { db } from "$lib/server/db";
import { authMembers, authUsers, authOrganizations } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";

export const load = async (event) => {
  requireSuperadmin(event.locals);
  const company = await companyRepo.getCompany(event.params.id);
  if (!company) return { company: null, members: [] };

  const org = await db
    .select()
    .from(authOrganizations)
    .where(eq(authOrganizations.id, company.id))
    .limit(1)
    .then((r) => r[0]);

  const members = await db
    .select({
      id: authMembers.id,
      userId: authMembers.userId,
      role: authMembers.role,
      userName: authUsers.name,
      userEmail: authUsers.email,
    })
    .from(authMembers)
    .innerJoin(authUsers, eq(authMembers.userId, authUsers.id))
    .where(eq(authMembers.organizationId, company.id));

  return { company, org, members };
};

export const actions = {
  invite: async (event) => {
    requireSuperadmin(event.locals);
    const data = await event.request.formData();
    const email = data.get("email") as string;
    const role = data.get("role") as string;
    const orgId = event.params.id;

    if (!email) return fail(400, { error: "Email is required" });

    try {
      await (auth.api as any).inviteMember({ body: { email, role: role || "member", organizationId: orgId } });
      return { success: true };
    } catch (e: any) {
      return fail(400, { error: e?.message || "Invitation failed" });
    }
  },
};
