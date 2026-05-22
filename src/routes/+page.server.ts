import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as tripsheetRepo from "$lib/server/repositories/tripsheet";
import * as driverRepo from "$lib/server/repositories/driver";
import * as truckRepo from "$lib/server/repositories/truck";
import { createWeek } from "$lib/server/services/tripsheet-service";
import { fail, redirect } from "@sveltejs/kit";

export const load = async (event) => {
  requireCompanyAccess(event.locals);
  const companyId = event.locals.activeCompanyId!;
  const [tripsheets, drivers, trucks] = await Promise.all([
    tripsheetRepo.listTripsheets(companyId),
    driverRepo.listDrivers(companyId),
    truckRepo.listTrucks(companyId),
  ]);
  return { tripsheets, drivers, trucks };
};

export const actions = {
  create: async (event) => {
    requireCompanyAccess(event.locals);
    const data = await event.request.formData();
    const driverId = Number(data.get("driverId"));
    const truckId = Number(data.get("truckId"));
    const weekStartDate = data.get("weekStartDate") as string;
    const startKm = Number(data.get("startKm"));
    const endKm = Number(data.get("endKm"));

    if (!driverId || !truckId || !weekStartDate) {
      return fail(400, { error: "Driver, Truck, and Week start are required" });
    }
    if (isNaN(startKm) || isNaN(endKm)) {
      return fail(400, { error: "KM values must be valid numbers" });
    }

    try {
      const id = await createWeek(
        event.locals.activeCompanyId!,
        driverId,
        truckId,
        weekStartDate,
        startKm,
        endKm,
      );
      redirect(303, `/${id}`);
    } catch (e) {
      return fail(400, { error: (e as Error).message });
    }
  },
};
