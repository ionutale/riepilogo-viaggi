import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as truckRepo from "$lib/server/repositories/truck";
import { fail, redirect } from "@sveltejs/kit";

export const load = (event) => {
  requireCompanyAccess(event.locals);
};

export const actions = {
  default: async (event) => {
    requireCompanyAccess(event.locals);
    const data = await event.request.formData();
    const licensePlate = data.get("licensePlate") as string;
    if (!licensePlate) return fail(400, { error: "License plate is required" });
    await truckRepo.createTruck(event.locals.activeCompanyId!, licensePlate);
    redirect(303, "/camion");
  },
};
