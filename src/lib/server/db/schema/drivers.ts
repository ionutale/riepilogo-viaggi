import { serial, text, pgTable, unique } from "drizzle-orm/pg-core";

export const drivers = pgTable(
  "drivers",
  {
    id: serial("id").primaryKey(),
    companyId: text("company_id").notNull(),
    name: text("name").notNull(),
  },
  (table) => [unique().on(table.companyId, table.name)],
);
