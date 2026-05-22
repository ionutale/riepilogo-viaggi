import type { InferSelectModel } from "drizzle-orm";
import type {
  drivers,
  trucks,
  trailers,
  clients,
  tripsheets,
  dailyEntries,
  stops,
  fuelings,
  companies,
} from "$lib/server/db/schema";

export type Driver = InferSelectModel<typeof drivers>;
export type Truck = InferSelectModel<typeof trucks>;
export type Trailer = InferSelectModel<typeof trailers>;
export type Client = InferSelectModel<typeof clients>;
export type Tripsheet = InferSelectModel<typeof tripsheets>;
export type DailyEntry = InferSelectModel<typeof dailyEntries>;
export type Stop = InferSelectModel<typeof stops>;
export type Fueling = InferSelectModel<typeof fuelings>;
export type Company = InferSelectModel<typeof companies>;

export type DayStatus = "working" | "festa" | "ferie" | "riposo";

export interface DailyEntryWithRelations extends DailyEntry {
  stops: Stop[];
  fuelings: Fueling[];
  client: Client | null;
}

export interface TripsheetWithRelations extends Tripsheet {
  driver: Driver;
  truck: Truck;
  dailyEntries: DailyEntryWithRelations[];
}

export interface TripsheetTotals {
  totalKm: number;
  totalLiters: number;
  totalCost: number;
}
