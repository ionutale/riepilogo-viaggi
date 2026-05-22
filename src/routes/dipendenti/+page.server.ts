import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as driverRepo from "$lib/server/repositories/driver";
import { fail } from "@sveltejs/kit";

export const load = async (event) => {
  requireCompanyAccess(event.locals);
  const drivers = await driverRepo.listDrivers(event.locals.activeCompanyId!);
  return { drivers };
};

export const actions = {
  delete: async (event) => {
    requireCompanyAccess(event.locals);
    const data = await event.request.formData();
    const id = Number(data.get("id"));
    if (isNaN(id)) return fail(400, { error: "Invalid ID" });
    await driverRepo.deleteDriver(id);
    return { success: true };
  },
};
