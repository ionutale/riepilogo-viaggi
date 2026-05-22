import { serial, integer, numeric, pgTable } from "drizzle-orm/pg-core";
import { dailyEntries } from "./daily-entries";

export const fuelings = pgTable("fuelings", {
  id: serial("id").primaryKey(),
  dailyEntryId: integer("daily_entry_id")
    .notNull()
    .references(() => dailyEntries.id, { onDelete: "cascade" }),
  liters: numeric("liters").notNull(),
  cost: numeric("cost").notNull(),
});
