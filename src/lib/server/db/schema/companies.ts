import { text, pgTable } from "drizzle-orm/pg-core";

export const companies = pgTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  vat: text("vat").notNull(),
  phone: text("phone").notNull(),
});
