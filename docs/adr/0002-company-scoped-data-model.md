# ADR-0002: Company-scoped data model with application-level enforcement

**Status:** Accepted

## Context

Every domain entity (Drivers, Trucks, Trailers, Clients, Tripsheets) must be scoped to a single company. Options: database foreign keys to Better Auth's `organization` table, or application-level `company_id` column with no DB constraint.

## Decision

Use a `company_id` text column on every domain table. Enforce scoping at the application layer (repositories and services). No database-level foreign keys.

## Rationale

- Better Auth's `organization` table uses UUID primary keys. Our tables use serial (integer) PKs. Mixing FK types adds complexity.
- Better Auth manages its own schema; we avoid importing its internal table definitions into our Drizzle migrations.
- Application-level enforcement is explicit and auditable — every query includes a `WHERE company_id = ?` clause.
- If Better Auth changes its `organization` table schema, we don't need to migrate our tables.

## Consequences

- All repositories accept `companyId` as a parameter.
- A bug in a query could leak data across companies. Mitigation: integration tests verify data isolation.
- Superadmin queries bypass company scoping with an explicit `isSuperadmin` flag.
