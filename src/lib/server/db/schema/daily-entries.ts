import { serial, integer, smallint, text, pgTable, unique } from "drizzle-orm/pg-core";
import { tripsheets } from "./tripsheets";
import { clients } from "./clients";

export const dailyEntries = pgTable(
  "daily_entries",
  {
    id: serial("id").primaryKey(),
    tripsheetId: integer("tripsheet_id")
      .notNull()
      .references(() => tripsheets.id, { onDelete: "cascade" }),
    dayOfWeek: smallint("day_of_week").notNull(),
    clientId: integer("client_id").references(() => clients.id),
    dayStatus: text("day_status").notNull().default("working"),
    dailyKm: integer("daily_km"),
    notes: text("notes"),
  },
  (table) => [unique().on(table.tripsheetId, table.dayOfWeek)],
);
