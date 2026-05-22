import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as trailerRepo from "$lib/server/repositories/trailer";
import { fail, redirect } from "@sveltejs/kit";

export const load = async (event) => {
  requireCompanyAccess(event.locals);
  const trailer = await trailerRepo.getTrailer(Number(event.params.id));
  return { trailer };
};

export const actions = {
  default: async (event) => {
    requireCompanyAccess(event.locals);
    const data = await event.request.formData();
    const licensePlate = data.get("licensePlate") as string;
    const id = Number(event.params.id);
    if (!licensePlate) return fail(400, { error: "License plate is required" });
    await trailerRepo.updateTrailer(id, licensePlate);
    redirect(303, "/rimorchi");
  },
};
