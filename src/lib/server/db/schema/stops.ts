import { serial, integer, text, pgTable } from "drizzle-orm/pg-core";
import { dailyEntries } from "./daily-entries";

export const stops = pgTable("stops", {
  id: serial("id").primaryKey(),
  dailyEntryId: integer("daily_entry_id")
    .notNull()
    .references(() => dailyEntries.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull(),
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
});
