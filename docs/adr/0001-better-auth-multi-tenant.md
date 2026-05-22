# ADR-0001: Better Auth for authentication & multi-tenancy

**Status:** Accepted

## Context

The app needed authentication (email/password), multi-company support, role-based access (owner/admin/member), and invitation flows. Alternatives considered: Lucia v3 (DIY orgs) and Auth.js (mature but no built-in orgs).

## Decision

Use Better Auth with the `organization()` plugin. Better Auth provides built-in organization management, member roles (owner/admin/member), invitation flows, session management, and a first-party Drizzle adapter — saving weeks of scaffolding.

## Trade-offs

- **Lock-in to Better Auth schema.** The `user`, `session`, `account`, `verification`, `organization`, `member`, and `invitation` tables are managed by Better Auth. We don't define them in our Drizzle schema to avoid conflicts; we only add thin reference definitions for JOINs.
- **Superadmin not built-in.** Better Auth has no concept of a cross-org superadmin. We added a `superadmin` boolean on the `user` table and enforce it via application guards.
- **SvelteKit integration still maturing.** The `sveltekitCookies` + `svelteKitHandler` pattern works but is less documented than the Express/Fastify adapters.
