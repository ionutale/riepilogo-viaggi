import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as trailerRepo from "$lib/server/repositories/trailer";
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
    await trailerRepo.createTrailer(event.locals.activeCompanyId!, licensePlate);
    redirect(303, "/rimorchi");
  },
};
