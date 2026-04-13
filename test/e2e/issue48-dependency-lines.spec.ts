/**
 * E2E tests for ng-gantt issue #48: dependency lines (pDepend) only visible
 * on click of the start date, not on initial render.
 *
 * Root behaviour we test:
 *   After g.Draw() completes, dependency line elements (.gDepFS / .gDepFSArw
 *   etc.) must already be present in the DOM — no user interaction required.
 *
 * Strategy:
 *   1. Load demo.html (which uses data.json — several tasks have pDepend set).
 *   2. Assert dep-line elements exist without any click.
 *   3. Inject a minimal chart via JSGantt globals to get a deterministic
 *      scenario: two tasks, second depends on first (FS).  Assert the line
 *      elements are rendered.
 *   4. Assert the lines are not zero-size (i.e. actually visible).
 */

import { test, expect } from '@playwright/test';
import { DEMO_URL } from './gantt.page';

// CSS class prefix used for dependency line <div>s drawn by sLine()
const DEP_LINE_SELECTOR = '[class*="gDepFS"],[class*="gDepSS"],[class*="gDepFF"],[class*="gDepSF"]';
const DEP_ARROW_SELECTOR = '[class*="gDepFSArw"],[class*="gDepSSArw"],[class*="gDepFFArw"],[class*="gDepSFArw"]';

test.describe('Issue #48 — dependency lines rendered on initial Draw()', () => {

  test('demo.html: dep lines are in the DOM after initial load (no click required)', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'load' });
    await page.waitForSelector('#embedded-Gantt .gcharttable', { timeout: 15_000 });
    // Allow layout and DrawDependencies to finish
    await page.waitForTimeout(600);

    const lineCount = await page.locator(DEP_LINE_SELECTOR).count();
    expect(lineCount, 'Dependency line elements should be present in the DOM on initial render').toBeGreaterThan(0);
  });

  test('demo.html: dep arrow elements are in the DOM after initial load', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'load' });
    await page.waitForSelector('#embedded-Gantt .gcharttable', { timeout: 15_000 });
    await page.waitForTimeout(600);

    const arrowCount = await page.locator(DEP_ARROW_SELECTOR).count();
    expect(arrowCount, 'Dependency arrow elements should be present in the DOM on initial render').toBeGreaterThan(0);
  });

  test('minimal chart: dep line rendered for a 2-task FS dependency without any click', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'load' });
    await page.waitForSelector('#embedded-Gantt .gcharttable', { timeout: 15_000 });

    // Inject a minimal 2-task chart so the scenario is deterministic
    await page.evaluate(() => {
      const container = document.getElementById('embedded-Gantt')!;
      container.innerHTML = '';

      const g = new (window as any).JSGantt.GanttChart(container, 'week');
      g.setOptions({ vFormat: 'week', vShowDeps: 1, vLang: 'en' });

      const T = (window as any).JSGantt.TaskItem;
      // task 1: no dependency
      g.AddTaskItem(new T(1, 'Alpha', '04/01/2026', '04/10/2026', 'gtaskblue', '', 0, '', 0, 0, 0, 1, '', '', '', g));
      // task 2: depends on task 1 (FS)
      g.AddTaskItem(new T(2, 'Beta',  '04/11/2026', '04/20/2026', 'gtaskgreen', '', 0, '', 0, 0, 0, 1, '1', '', '', g));

      g.Draw();
    });

    await page.waitForSelector('#embedded-Gantt .gcharttable', { timeout: 10_000 });
    await page.waitForTimeout(400);

    const lineCount = await page.locator(DEP_LINE_SELECTOR).count();
    expect(lineCount, 'FS dependency line divs should be rendered without any click').toBeGreaterThan(0);

    const arrowCount = await page.locator(DEP_ARROW_SELECTOR).count();
    expect(arrowCount, 'FS dependency arrow should be rendered without any click').toBeGreaterThan(0);
  });

  test('minimal chart: dep line elements have non-zero dimensions (are actually visible)', async ({ page }) => {
    await page.goto(DEMO_URL, { waitUntil: 'load' });
    await page.waitForSelector('#embedded-Gantt .gcharttable', { timeout: 15_000 });

    await page.evaluate(() => {
      const container = document.getElementById('embedded-Gantt')!;
      container.innerHTML = '';

      const g = new (window as any).JSGantt.GanttChart(container, 'week');
      g.setOptions({ vFormat: 'week', vShowDeps: 1, vLang: 'en' });

      const T = (window as any).JSGantt.TaskItem;
      g.AddTaskItem(new T(1, 'Alpha', '04/01/2026', '04/10/2026', 'gtaskblue', '', 0, '', 0, 0, 0, 1, '', '', '', g));
      g.AddTaskItem(new T(2, 'Beta',  '04/11/2026', '04/20/2026', 'gtaskgreen', '', 0, '', 0, 0, 0, 1, '1', '', '', g));
      g.Draw();
    });

    await page.waitForSelector('#embedded-Gantt .gcharttable', { timeout: 10_000 });
    await page.waitForTimeout(400);

    // At least one dep-line div should have a non-zero bounding box
    const hasVisibleLine = await page.evaluate((sel: string) => {
      const lines = Array.from(document.querySelectorAll(sel)) as HTMLElement[];
      return lines.some(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 || r.height > 0;
      });
    }, DEP_LINE_SELECTOR);

    expect(hasVisibleLine, 'At least one dependency line element should have non-zero dimensions').toBe(true);
  });

});
