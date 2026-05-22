import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as clientRepo from "$lib/server/repositories/client";
import { fail, redirect } from "@sveltejs/kit";

export const load = async (event) => {
  requireCompanyAccess(event.locals);
  const client = await clientRepo.getClient(Number(event.params.id));
  return { client };
};

export const actions = {
  default: async (event) => {
    requireCompanyAccess(event.locals);
    const data = await event.request.formData();
    const id = Number(event.params.id);
    const name = data.get("name") as string;
    const address = data.get("address") as string;
    const city = data.get("city") as string;
    const vat = data.get("vat") as string;
    const phone = data.get("phone") as string;
    if (!name) return fail(400, { error: "Client name is required" });
    await clientRepo.updateClient(id, { name, address, city, vat, phone });
    redirect(303, "/clienti");
  },
};
