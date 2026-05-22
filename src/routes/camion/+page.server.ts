import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as truckRepo from "$lib/server/repositories/truck";
import { fail } from "@sveltejs/kit";

export const load = async (event) => {
  requireCompanyAccess(event.locals);
  const trucks = await truckRepo.listTrucks(event.locals.activeCompanyId!);
  return { trucks };
};

export const actions = {
  delete: async (event) => {
    requireCompanyAccess(event.locals);
    const data = await event.request.formData();
    const id = Number(data.get("id"));
    if (isNaN(id)) return fail(400, { error: "Invalid ID" });
    await truckRepo.deleteTruck(id);
    return { success: true };
  },
};
