# ADR-0003: Superadmin seeded via setup wizard

**Status:** Accepted

## Context

The first user needs to be a superadmin who can create companies. Better Auth has no built-in superadmin. Options: first-user-auto-superadmin (race condition), env var seeding (brittle), dedicated setup page (requires UI).

## Decision

Hybrid approach:
- **Dev**: A seed script (`scripts/seed-auth.js`) creates the superadmin + first company from env vars.
- **Production**: A `/admin/setup` page that appears when no companies exist. The form creates the superadmin user + first organization + company profile simultaneously.

The `superadmin` boolean is stored directly on Better Auth's `user` table. Guards (`requireSuperadmin()`) check this flag at the application layer.

## Consequences

- First-run setup is intuitive (visit the app, fill in the form).
- Seed script provides fast dev onboarding.
- `superadmin` flag on the user record is simple to audit and revoke.
- Future: add a superadmin management UI for promoting/demoting superadmins.
