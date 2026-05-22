import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/server/db/schema/*",
  out: "./src/lib/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://app:devpassword@localhost:5433/riepilogo",
  },
});
