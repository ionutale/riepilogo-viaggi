import { serial, text, pgTable, unique } from "drizzle-orm/pg-core";

export const trucks = pgTable(
  "trucks",
  {
    id: serial("id").primaryKey(),
    companyId: text("company_id").notNull(),
    licensePlate: text("license_plate").notNull(),
  },
  (table) => [unique().on(table.companyId, table.licensePlate)],
);
