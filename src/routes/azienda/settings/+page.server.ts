import { requireAuth } from "$lib/server/auth-guards";
import { auth } from "$lib/server/auth";
import * as companyRepo from "$lib/server/repositories/company";
import { db } from "$lib/server/db";
import { authMembers, authUsers } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { fail, redirect } from "@sveltejs/kit";

export const load = async (event) => {
  requireAuth(event.locals);
  const companyId = event.locals.activeCompanyId;
  if (!companyId) return { company: null, members: [] };

  const [company, members] = await Promise.all([
    companyRepo.getCompany(companyId),
    db
      .select({
        id: authMembers.id,
        userId: authMembers.userId,
        role: authMembers.role,
        userName: authUsers.name,
        userEmail: authUsers.email,
      })
      .from(authMembers)
      .innerJoin(authUsers, eq(authMembers.userId, authUsers.id))
      .where(eq(authMembers.organizationId, companyId)),
  ]);

  return { company, members };
};

export const actions = {
  update: async (event) => {
    requireAuth(event.locals);
    const companyId = event.locals.activeCompanyId;
    if (!companyId) return fail(400, { error: "No active company" });

    const data = await event.request.formData();
    const name = data.get("name") as string;
    const address = data.get("address") as string;
    const city = data.get("city") as string;
    const vat = data.get("vat") as string;
    const phone = data.get("phone") as string;

    if (!name) return fail(400, { error: "Company name is required" });
    await companyRepo.updateCompany(companyId, { name, address, city, vat, phone });
    return { success: true };
  },

  invite: async (event) => {
    requireAuth(event.locals);
    const companyId = event.locals.activeCompanyId;
    if (!companyId) return fail(400, { error: "No active company" });

    const data = await event.request.formData();
    const email = data.get("email") as string;
    if (!email) return fail(400, { error: "Email is required" });

    try {
      await (auth.api as any).inviteMember({ body: { email, role: "member", organizationId: companyId } });
      return { inviteSuccess: true };
    } catch (e: any) {
      return fail(400, { error: e?.message || "Invitation failed" });
    }
  },
};
