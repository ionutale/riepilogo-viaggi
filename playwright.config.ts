import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'pnpm run build && pnpm run preview',
    port: 4173,
    reuseExistingServer: true,
    env: {
      DATABASE_URL: 'postgres://app:devpassword@localhost:5433/riepilogo',
      BETTER_AUTH_SECRET: 'dev-secret-change-in-production',
      BETTER_AUTH_URL: 'http://localhost:4173',
    },
  },
  testDir: 'e2e',
  testMatch: '*.spec.ts',
});
