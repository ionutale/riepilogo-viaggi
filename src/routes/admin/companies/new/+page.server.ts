import { requireSuperadmin } from "$lib/server/auth-guards";
import { auth } from "$lib/server/auth";
import * as companyRepo from "$lib/server/repositories/company";
import { fail, redirect } from "@sveltejs/kit";

export const load = (event) => {
  requireSuperadmin(event.locals);
};

export const actions = {
  default: async (event) => {
    requireSuperadmin(event.locals);
    const data = await event.request.formData();
    const name = data.get("name") as string;
    const address = data.get("address") as string;
    const city = data.get("city") as string;
    const vat = data.get("vat") as string;
    const phone = data.get("phone") as string;

    if (!name) return fail(400, { error: "Company name is required" });

    try {
      const org = await auth.api.createOrganization({
        body: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
      });
      await companyRepo.createCompany(org.id, { name, address, city, vat, phone });
      redirect(303, "/admin/companies");
    } catch (e: any) {
      return fail(400, { error: e?.message || "Failed to create company" });
    }
  },
};
