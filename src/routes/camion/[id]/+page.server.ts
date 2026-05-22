import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as truckRepo from "$lib/server/repositories/truck";
import { fail, redirect } from "@sveltejs/kit";

export const load = async (event) => {
  requireCompanyAccess(event.locals);
  const truck = await truckRepo.getTruck(Number(event.params.id));
  return { truck };
};

export const actions = {
  default: async (event) => {
    requireCompanyAccess(event.locals);
    const data = await event.request.formData();
    const licensePlate = data.get("licensePlate") as string;
    const id = Number(event.params.id);
    if (!licensePlate) return fail(400, { error: "License plate is required" });
    await truckRepo.updateTruck(id, licensePlate);
    redirect(303, "/camion");
  },
};
