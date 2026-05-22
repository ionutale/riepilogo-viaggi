import { db } from "$lib/server/db";
import { companies, user, account, organization, member } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { fail, redirect } from "@sveltejs/kit";
import { hashPassword } from "better-auth/crypto";
import { generateId } from "better-auth";

export const load = async () => {
  const existing = await db.select().from(companies).limit(1);
  if (existing.length > 0) redirect(303, "/auth/login");
};

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const companyName = data.get("companyName") as string;
    const address = (data.get("address") as string) || "";
    const city = (data.get("city") as string) || "";
    const vat = (data.get("vat") as string) || "";
    const phone = (data.get("phone") as string) || "";

    if (!name || !email || !password || !companyName) {
      return fail(400, { error: "Name, email, password, and company name are required" });
    }

    const userId = generateId();
    const orgId = generateId();
    const now = new Date();
    const hashedPassword = await hashPassword(password);

    try {
      await db.insert(user).values({
        id: userId, name, email: email.toLowerCase(),
        emailVerified: false, superadmin: true,
        createdAt: now, updatedAt: now,
      });
      await db.insert(account).values({
        id: generateId(), userId, accountId: userId,
        providerId: "credential", password: hashedPassword,
        createdAt: now, updatedAt: now,
      });
      const slug = companyName.toLowerCase().replace(/\s+/g, "-");
      await db.insert(organization).values({
        id: orgId, name: companyName, slug, createdAt: now,
      });
      await db.insert(member).values({
        id: generateId(), userId, organizationId: orgId,
        role: "owner", createdAt: now,
      });
      await db.insert(companies).values({
        id: orgId, name: companyName, address, city, vat, phone,
      });
    } catch (e: any) {
      return fail(400, { error: `Setup failed: ${e?.message || String(e)}` });
    }

    redirect(303, "/auth/login");
  },
};
