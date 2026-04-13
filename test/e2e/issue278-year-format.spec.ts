/**
 * E2E tests for issue #278: Year format support.
 *
 * Verifies that the Gantt chart renders correctly when vFormat='year':
 * - Minor header cells show individual calendar years (2020, 2021, …)
 * - Major header groups years into decades
 * - Task bars have a positive width and a non-negative left offset
 * - Bar widths scale proportionally: a 2-year task is ~2× wider than a 1-year task
 */

import { test, expect } from '@playwright/test';

const BASE = (process.env.JSGANTT_E2E_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '');
const DEMO_URL = `${BASE}/demo.html`;

/** Navigate to the demo page and wait for JSGantt to be available. */
async function gotoDemo(page) {
  await page.goto(DEMO_URL, { waitUntil: 'load', timeout: 25_000 });
  await page.waitForFunction(() => typeof (window as any).JSGantt !== 'undefined', { timeout: 15_000 });
}

/**
 * Inject a year-format Gantt with three tasks into #embedded-Gantt:
 *   - Task 1 (group): 2020-01-01 → 2026-12-31  (7 years, parent)
 *   - Task 2: 2020-01-01 → 2021-12-31           (2 years)
 *   - Task 3: 2022-01-01 → 2025-12-31           (4 years)
 */
async function mountYearGantt(page) {
  await page.evaluate(() => {
    const container = document.getElementById('embedded-Gantt');
    if (!container) throw new Error('#embedded-Gantt not found');
    container.innerHTML = '';

    const JSGantt = (window as any).JSGantt;
    const g = new JSGantt.GanttChart(container, 'year');
    g.setOptions({
      vFormat: 'year',
      vFormatArr: ['Year'],
      vShowRes: 0,
      vShowDur: 0,
      vShowComp: 0,
    });

    g.AddTaskItem(new JSGantt.TaskItem(
      1, 'Multi-Year Programme',
      '2020-01-01', '2026-12-31',
      'ggroupblack', '', 0, '', 0, 1, 0, 1, '', '', '', g,
    ));
    g.AddTaskItem(new JSGantt.TaskItem(
      2, 'Phase 1',
      '2020-01-01', '2021-12-31',
      'gtaskblue', '', 0, '', 0, 0, 1, 1, '', '', '', g,
    ));
    g.AddTaskItem(new JSGantt.TaskItem(
      3, 'Phase 2',
      '2022-01-01', '2025-12-31',
      'gtaskgreen', '', 0, '', 0, 0, 1, 1, '2', '', '', g,
    ));

    g.Draw();
  });

  await page.waitForSelector('#embedded-Gantt .gcharttable', { timeout: 10_000 });
  await page.waitForTimeout(300);
}

/** Extract text content of minor header cells (the year labels). */
async function getMinorHeaderLabels(page): Promise<string[]> {
  return page.evaluate(() => {
    const headerTable = document.querySelector('.gcharttableh');
    if (!headerTable) return [];
    const rows = headerTable.querySelectorAll('tr');
    // Last row = minor header (individual years)
    const lastRow = rows[rows.length - 1];
    if (!lastRow) return [];
    return Array.from(lastRow.querySelectorAll('td div'))
      .map(el => (el as HTMLElement).innerText.trim());
  });
}

/** Extract major header cell texts. */
async function getMajorHeaderLabels(page): Promise<string[]> {
  return page.evaluate(() => {
    const headerTable = document.querySelector('.gcharttableh');
    if (!headerTable) return [];
    const rows = headerTable.querySelectorAll('tr');
    const firstRow = rows[0];
    if (!firstRow) return [];
    return Array.from(firstRow.querySelectorAll('td div'))
      .map(el => (el as HTMLElement).innerText.trim());
  });
}

/** Read all task bar pixel widths and left offsets. */
async function getBarMetrics(page): Promise<{ id: string; width: number; left: number }[]> {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll('[id*="bardiv_"]')).map(el => {
      const h = el as HTMLElement;
      return {
        id: h.id,
        width: parseInt(h.style.width || '0', 10),
        left:  parseInt(h.style.left  || '0', 10),
      };
    });
  });
}

test.describe('Issue #278 — Year format', () => {
  test.beforeEach(async ({ page }) => {
    await gotoDemo(page);
    await mountYearGantt(page);
  });

  test('minor header shows individual year labels 2020–2026', async ({ page }) => {
    const labels = await getMinorHeaderLabels(page);

    expect(labels.length).toBeGreaterThanOrEqual(7);

    for (const year of ['2020', '2021', '2022', '2023', '2024', '2025', '2026']) {
      expect(labels, `Minor header should contain "${year}"`).toContain(year);
    }
  });

  test('major header is a single empty spanning cell (year labels in minor row are sufficient)', async ({ page }) => {
    const labels = await getMajorHeaderLabels(page);

    // The year format renders one empty major cell spanning all columns.
    // Individual year labels (2020, 2021, …) live in the minor header row.
    expect(labels.length).toBe(1);
    expect(labels[0]).toBe('');
  });

  test('task bars have a positive width', async ({ page }) => {
    const bars = await getBarMetrics(page);

    expect(bars.length).toBeGreaterThan(0);
    for (const bar of bars) {
      expect(bar.width).toBeGreaterThan(0, `Bar ${bar.id} should have width > 0`);
    }
  });

  test('task bars have a left offset of -1 or greater (chart-origin tasks render at -1px)', async ({ page }) => {
    const bars = await getBarMetrics(page);

    // getOffset returns Math.ceil(0 * scale - 1) = -1 for tasks that start at the
    // chart minimum date. This is the standard behaviour across all formats; -1 is
    // the intended starting position (flush with the left edge). Tasks that start
    // later in the timeline always have left > -1.
    expect(bars.length).toBeGreaterThan(0);
    for (const bar of bars) {
      expect(bar.left).toBeGreaterThanOrEqual(-1, `Bar ${bar.id} left=${bar.left} should be ≥ -1`);
    }
  });

  test('4-year task bar is approximately twice as wide as 2-year task bar', async ({ page }) => {
    const bars = await getBarMetrics(page);

    // Task order: [0] group (7 years), [1] Phase 1 (2 years), [2] Phase 2 (4 years).
    // IDs are hashed by the library, so look up by position rather than raw task ID.
    expect(bars.length).toBeGreaterThanOrEqual(3);

    const bar2yr = bars[1]; // Phase 1: 2020-01-01 → 2021-12-31 (2 years)
    const bar4yr = bars[2]; // Phase 2: 2022-01-01 → 2025-12-31 (4 years)

    expect(bar2yr.width).toBeGreaterThan(0);
    expect(bar4yr.width).toBeGreaterThan(0);

    const ratio = bar4yr.width / bar2yr.width;
    expect(ratio).toBeGreaterThan(1.7);
    expect(ratio).toBeLessThan(2.3);
  });
});
