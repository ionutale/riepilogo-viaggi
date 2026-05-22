import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as trailerRepo from "$lib/server/repositories/trailer";
import { fail } from "@sveltejs/kit";

export const load = async (event) => {
  requireCompanyAccess(event.locals);
  const trailers = await trailerRepo.listTrailers(event.locals.activeCompanyId!);
  return { trailers };
};

export const actions = {
  delete: async (event) => {
    requireCompanyAccess(event.locals);
    const data = await event.request.formData();
    const id = Number(data.get("id"));
    if (isNaN(id)) return fail(400, { error: "Invalid ID" });
    await trailerRepo.deleteTrailer(id);
    return { success: true };
  },
};
