import { serial, integer, date, text, pgTable, unique } from "drizzle-orm/pg-core";

export const tripsheets = pgTable(
  "tripsheets",
  {
    id: serial("id").primaryKey(),
    companyId: text("company_id").notNull(),
    driverId: integer("driver_id").notNull(),
    truckId: integer("truck_id").notNull(),
    weekStartDate: date("week_start_date").notNull(),
    startKm: integer("start_km").notNull(),
    endKm: integer("end_km").notNull(),
  },
  (table) => [unique().on(table.companyId, table.driverId, table.truckId, table.weekStartDate)],
);
