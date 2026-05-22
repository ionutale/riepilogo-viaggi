import { serial, text, pgTable, unique } from "drizzle-orm/pg-core";

export const clients = pgTable(
  "clients",
  {
    id: serial("id").primaryKey(),
    companyId: text("company_id").notNull(),
    name: text("name").notNull(),
    address: text("address").notNull(),
    city: text("city").notNull(),
    vat: text("vat").notNull(),
    phone: text("phone").notNull(),
  },
  (table) => [unique().on(table.companyId, table.name)],
);
