import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "$env/static/private";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { db } from "./db";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL || "http://localhost:5174",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    organization(),
    sveltekitCookies(getRequestEvent),
  ],
});
