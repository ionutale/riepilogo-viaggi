import { test, expect } from "@playwright/test";
import postgres from "postgres";
import crypto from "crypto";

const TEST_EMAIL = "e2e@test.com";
const TEST_PASSWORD = "e2etest123";
const TEST_COMPANY_ID = "e2e-company";

async function seedTestData() {
  const sql = postgres("postgres://app:devpassword@localhost:5433/riepilogo");
  // Clean first
  await sql.unsafe(`
    DELETE FROM fuelings; DELETE FROM stops; DELETE FROM daily_entries;
    DELETE FROM tripsheets; DELETE FROM clients; DELETE FROM trucks;
    DELETE FROM trailers; DELETE FROM drivers; DELETE FROM companies;
    DELETE FROM "session"; DELETE FROM "account"; DELETE FROM "member";
    DELETE FROM "user"; DELETE FROM "organization";
  `);
}

async function cleanupDB() {
  const sql = postgres("postgres://app:devpassword@localhost:5433/riepilogo");
  await sql.unsafe(`
    DELETE FROM fuelings; DELETE FROM stops; DELETE FROM daily_entries;
    DELETE FROM tripsheets; DELETE FROM clients; DELETE FROM trucks;
    DELETE FROM trailers; DELETE FROM drivers; DELETE FROM companies;
    DELETE FROM "session"; DELETE FROM "account"; DELETE FROM "member";
    DELETE FROM "user"; DELETE FROM "organization";
  `);
  await sql.end();
}

test.describe.serial("app navigation", () => {
  test.beforeAll(async () => {
    await seedTestData();
  });

  test.afterAll(async () => {
    await cleanupDB();
  });

  test("logs in and navigates to CRUD pages", async ({ page }) => {
    // Use setup wizard to create user + company
    await page.goto("/admin/setup");
    await expect(page.getByText("Configurazione Iniziale")).toBeVisible({ timeout: 10000 });

    await page.fill('input[name="name"]', "Admin E2E");
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', TEST_PASSWORD);
    await page.fill('input[name="companyName"]', "E2E Test Company");

    // Submit form and wait for redirect
    await page.getByRole("button", { name: "Crea" }).click();

    // Wait for redirect to login page (native form submit follows redirect)
    console.log("Waiting for redirect to /auth/login...");
    await page.waitForURL(/\/auth\/login/, { timeout: 30000 });
    console.log("Redirected to login page");

    // Verify user exists in DB
    const checkUser = postgres("postgres://app:devpassword@localhost:5433/riepilogo");
    const [dbUser] = await checkUser`SELECT email FROM "user" WHERE email = ${TEST_EMAIL}`;
    console.log("DB user found:", !!dbUser);
    if (!dbUser) {
      console.log("WARNING: User not created in DB");
    }
    await checkUser.end();

    // Log in
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', TEST_PASSWORD);
    await page.getByRole("button", { name: "Accedi" }).click();
    await page.waitForURL(/^\/(?!auth)/, { timeout: 15000 });

    // Should be on homepage with app header visible
    await expect(page.locator(".navbar .font-bold")).toBeVisible();

    // Navigate to each CRUD page
    await page.goto("/dipendenti");
    await expect(page.getByText("Dipendenti")).toBeVisible();

    await page.goto("/camion");
    await expect(page.getByText("Camion")).toBeVisible();

    await page.goto("/rimorchi");
    await expect(page.getByText("Rimorchi")).toBeVisible();

    await page.goto("/clienti");
    await expect(page.getByText("Clienti")).toBeVisible();

    await page.goto("/azienda/settings");
    await expect(page.getByText("Gestione Azienda")).toBeVisible();
  });
});
