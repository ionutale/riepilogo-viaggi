import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as driverRepo from "$lib/server/repositories/driver";
import { fail, redirect } from "@sveltejs/kit";

export const load = async (event) => {
  requireCompanyAccess(event.locals);
  const driver = await driverRepo.getDriver(Number(event.params.id));
  return { driver };
};

export const actions = {
  default: async (event) => {
    requireCompanyAccess(event.locals);
    const data = await event.request.formData();
    const name = data.get("name") as string;
    const id = Number(event.params.id);
    if (!name) return fail(400, { error: "Name is required" });
    await driverRepo.updateDriver(id, name);
    redirect(303, "/dipendenti");
  },
};
