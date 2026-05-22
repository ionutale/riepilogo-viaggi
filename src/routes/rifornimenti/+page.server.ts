import { requireCompanyAccess } from "$lib/server/auth-guards";
import * as tripsheetRepo from "$lib/server/repositories/tripsheet";
import * as truckRepo from "$lib/server/repositories/truck";
import * as driverRepo from "$lib/server/repositories/driver";

export const load = async (event) => {
  requireCompanyAccess(event.locals);
  const companyId = event.locals.activeCompanyId!;
  const url = event.url;
  const truckId = url.searchParams.get("truckId") ? Number(url.searchParams.get("truckId")) : undefined;
  const driverId = url.searchParams.get("driverId") ? Number(url.searchParams.get("driverId")) : undefined;

  const [fuelings, trucks, drivers] = await Promise.all([
    tripsheetRepo.getFuelingsByCompany(companyId, { truckId, driverId }),
    truckRepo.listTrucks(companyId),
    driverRepo.listDrivers(companyId),
  ]);

  return { fuelings, trucks, drivers, filters: { truckId, driverId } };
};
