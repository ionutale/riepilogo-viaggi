import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as clientRepo from "$lib/server/repositories/client";
import { fail } from "@sveltejs/kit";

export const load = async (event) => {
  requireCompanyAccess(event.locals);
  const clients = await clientRepo.listClients(event.locals.activeCompanyId!);
  return { clients };
};

export const actions = {
  delete: async (event) => {
    requireCompanyAccess(event.locals);
    const data = await event.request.formData();
    const id = Number(data.get("id"));
    if (isNaN(id)) return fail(400, { error: "Invalid ID" });
    await clientRepo.deleteClient(id);
    return { success: true };
  },
};
