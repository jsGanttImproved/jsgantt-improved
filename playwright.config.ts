import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  timeout: 30_000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://test.counbo.com/jsgantt-improved/',
    headless: true,
    viewport: { width: 1400, height: 900 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
