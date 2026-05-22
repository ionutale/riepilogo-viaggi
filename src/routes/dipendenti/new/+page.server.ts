import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as driverRepo from "$lib/server/repositories/driver";
import { fail, redirect } from "@sveltejs/kit";

export const load = (event) => {
  requireCompanyAccess(event.locals);
};

export const actions = {
  default: async (event) => {
    requireCompanyAccess(event.locals);
    const data = await event.request.formData();
    const name = data.get("name") as string;
    if (!name) return fail(400, { error: "Name is required" });
    await driverRepo.createDriver(event.locals.activeCompanyId!, name);
    redirect(303, "/dipendenti");
  },
};
