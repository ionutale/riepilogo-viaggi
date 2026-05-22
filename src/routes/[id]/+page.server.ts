import { requireCompanyAccess } from "$lib/server/auth-guards";
import { getWeek, updateDailyEntry } from "$lib/server/services/tripsheet-service";
import * as driverRepo from "$lib/server/repositories/driver";
import * as truckRepo from "$lib/server/repositories/truck";
import * as clientRepo from "$lib/server/repositories/client";
import * as tripsheetRepo from "$lib/server/repositories/tripsheet";
import { fail, redirect } from "@sveltejs/kit";

export const load = async (event) => {
  requireCompanyAccess(event.locals);
  const id = Number(event.params.id);
  if (isNaN(id)) redirect(303, "/");

  const [ts, drivers, trucks, clients] = await Promise.all([
    getWeek(id),
    driverRepo.listDrivers(event.locals.activeCompanyId!),
    truckRepo.listTrucks(event.locals.activeCompanyId!),
    clientRepo.listClients(event.locals.activeCompanyId!),
  ]);

  if (!ts) redirect(303, "/");

  return { ts, drivers, trucks, clients };
};

export const actions = {
  save: async (event) => {
    requireCompanyAccess(event.locals);
    const tripsheetId = Number(event.params.id);
    if (isNaN(tripsheetId)) return fail(400, { error: "Invalid ID" });

    const data = await event.request.formData();
    const payload = JSON.parse(data.get("payload") as string);

    try {
      await tripsheetRepo.saveTripsheet(tripsheetId, {
        driverId: payload.header.driverId,
        truckId: payload.header.truckId,
        startKm: Number(payload.header.startKm),
        endKm: Number(payload.header.endKm),
      });

      for (const day of payload.days) {
        await updateDailyEntry(tripsheetId, day.dayOfWeek, {
          clientId: day.clientId || null,
          dayStatus: day.dayStatus,
          dailyKm: day.dailyKm ? Number(day.dailyKm) : null,
          notes: day.notes || null,
          stops: day.stops,
          fuelings: day.fuelings,
        });
      }

      return { success: true };
    } catch (e) {
      return fail(500, { error: (e as Error).message });
    }
  },

  delete: async (event) => {
    requireCompanyAccess(event.locals);
    const id = Number(event.params.id);
    if (isNaN(id)) return fail(400, { error: "Invalid ID" });
    await tripsheetRepo.deleteTripsheet(id);
    redirect(303, "/");
  },
};
