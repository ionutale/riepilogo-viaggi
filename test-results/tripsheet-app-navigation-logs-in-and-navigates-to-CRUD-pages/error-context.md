# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tripsheet.spec.ts >> app navigation >> logs in and navigates to CRUD pages
- Location: e2e/tripsheet.spec.ts:42:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://localhost:4173/auth/login"
============================================================
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import postgres from "postgres";
  3  | import crypto from "crypto";
  4  | 
  5  | const TEST_EMAIL = "e2e@test.com";
  6  | const TEST_PASSWORD = "e2etest123";
  7  | const TEST_COMPANY_ID = "e2e-company";
  8  | 
  9  | async function seedTestData() {
  10 |   const sql = postgres("postgres://app:devpassword@localhost:5433/riepilogo");
  11 |   // Clean first
  12 |   await sql.unsafe(`
  13 |     DELETE FROM fuelings; DELETE FROM stops; DELETE FROM daily_entries;
  14 |     DELETE FROM tripsheets; DELETE FROM clients; DELETE FROM trucks;
  15 |     DELETE FROM trailers; DELETE FROM drivers; DELETE FROM companies;
  16 |     DELETE FROM "session"; DELETE FROM "account"; DELETE FROM "member";
  17 |     DELETE FROM "user"; DELETE FROM "organization";
  18 |   `);
  19 | }
  20 | 
  21 | async function cleanupDB() {
  22 |   const sql = postgres("postgres://app:devpassword@localhost:5433/riepilogo");
  23 |   await sql.unsafe(`
  24 |     DELETE FROM fuelings; DELETE FROM stops; DELETE FROM daily_entries;
  25 |     DELETE FROM tripsheets; DELETE FROM clients; DELETE FROM trucks;
  26 |     DELETE FROM trailers; DELETE FROM drivers; DELETE FROM companies;
  27 |     DELETE FROM "session"; DELETE FROM "account"; DELETE FROM "member";
  28 |     DELETE FROM "user"; DELETE FROM "organization";
  29 |   `);
  30 |   await sql.end();
  31 | }
  32 | 
  33 | test.describe.serial("app navigation", () => {
  34 |   test.beforeAll(async () => {
  35 |     await seedTestData();
  36 |   });
  37 | 
  38 |   test.afterAll(async () => {
  39 |     await cleanupDB();
  40 |   });
  41 | 
  42 |   test("logs in and navigates to CRUD pages", async ({ page }) => {
  43 |     // Use setup wizard to create user + company
  44 |     await page.goto("/admin/setup");
  45 |     await expect(page.getByText("Configurazione Iniziale")).toBeVisible({ timeout: 10000 });
  46 | 
  47 |     await page.fill('input[name="name"]', "Admin E2E");
  48 |     await page.fill('input[name="email"]', TEST_EMAIL);
  49 |     await page.fill('input[name="password"]', TEST_PASSWORD);
  50 |     await page.fill('input[name="companyName"]', "E2E Test Company");
  51 | 
  52 |     // Submit form and wait for redirect
  53 |     await page.getByRole("button", { name: "Crea" }).click();
  54 | 
  55 |     // Wait for redirect to login page (native form submit follows redirect)
  56 |     console.log("Waiting for redirect to /auth/login...");
  57 |     await page.waitForURL(/\/auth\/login/, { timeout: 30000 });
  58 |     console.log("Redirected to login page");
  59 | 
  60 |     // Verify user exists in DB
  61 |     const checkUser = postgres("postgres://app:devpassword@localhost:5433/riepilogo");
  62 |     const [dbUser] = await checkUser`SELECT email FROM "user" WHERE email = ${TEST_EMAIL}`;
  63 |     console.log("DB user found:", !!dbUser);
  64 |     if (!dbUser) {
  65 |       console.log("WARNING: User not created in DB");
  66 |     }
  67 |     await checkUser.end();
  68 | 
  69 |     // Log in
  70 |     await page.fill('input[name="email"]', TEST_EMAIL);
  71 |     await page.fill('input[name="password"]', TEST_PASSWORD);
  72 |     await page.getByRole("button", { name: "Accedi" }).click();
> 73 |     await page.waitForURL(/^\/(?!auth)/, { timeout: 15000 });
     |                ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  74 | 
  75 |     // Should be on homepage with app header visible
  76 |     await expect(page.locator(".navbar .font-bold")).toBeVisible();
  77 | 
  78 |     // Navigate to each CRUD page
  79 |     await page.goto("/dipendenti");
  80 |     await expect(page.getByText("Dipendenti")).toBeVisible();
  81 | 
  82 |     await page.goto("/camion");
  83 |     await expect(page.getByText("Camion")).toBeVisible();
  84 | 
  85 |     await page.goto("/rimorchi");
  86 |     await expect(page.getByText("Rimorchi")).toBeVisible();
  87 | 
  88 |     await page.goto("/clienti");
  89 |     await expect(page.getByText("Clienti")).toBeVisible();
  90 | 
  91 |     await page.goto("/azienda/settings");
  92 |     await expect(page.getByText("Gestione Azienda")).toBeVisible();
  93 |   });
  94 | });
  95 | 
```