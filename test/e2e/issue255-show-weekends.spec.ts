/**
 * E2E tests for issue #255: vShowWeekends: 0 does not remove weekend cell colorization.
 *
 * Root cause: draw.ts used strict `!== false` to check vShowWeekends in drawColsChart(),
 * so passing the numeric value 0 (as documented) still evaluated truthy, leaving
 * weekend cells with class "gtaskcellwkend".
 *
 * Fix: changed `this.vShowWeekends !== false` → `this.vShowWeekends` (truthy check),
 * consistent with the rest of the file which already used `!this.vShowWeekends`.
 */

import { test, expect } from '@playwright/test';

// Use absolute URL so the path resolves correctly regardless of baseURL trailing-slash
const BASE = (process.env.JSGANTT_E2E_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '');
const TEST_PAGE = `${BASE}/test-issue255.html`;

test.describe('Issue #255 — vShowWeekends: 0 must suppress weekend colorization', () => {

  test('weekend cells have class gtaskcellwkend when vShowWeekends: 1', async ({ page }) => {
    await page.goto(TEST_PAGE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const count = await page.evaluate(() =>
      document.querySelectorAll('#gantt-with-weekends .gtaskcellwkend').length,
    );
    expect(count, 'Expected weekend cells to be colored when vShowWeekends=1').toBeGreaterThan(0);
  });

  test('no gtaskcellwkend cells when vShowWeekends: 0', async ({ page }) => {
    await page.goto(TEST_PAGE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const count = await page.evaluate(() =>
      document.querySelectorAll('#gantt-no-weekends .gtaskcellwkend').length,
    );
    expect(count, 'Expected no weekend-colored cells when vShowWeekends=0').toBe(0);
  });

});
