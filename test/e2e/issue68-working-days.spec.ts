/**
 * E2E tests for issue #68: configurable working days.
 *
 * Verifies that setWorkingDays() causes getDuration() to count only
 * working days, and that the default (all days working) is unchanged.
 *
 * Test chart: day format, one task Mon 2025-01-06 → Mon 2025-01-13.
 *
 * Date arithmetic note: '2025-01-13' parses to local midnight, which always
 * satisfies the getDuration midnight-check, so vTaskEnd is shifted +1 day to
 * Jan 14. The effective span is therefore Jan 6 → Jan 14 (8 calendar days).
 *   Calendar span (Jan 6–13):  8 days
 *   Working days Mon–Fri (Jan 6–13): Mon 6,Tue 7,Wed 8,Thu 9,Fri 10,Mon 13 = 6 days
 *   Working days Mon–Sat:            add Sat 11                              = 7 days
 */

import { test, expect } from '@playwright/test';

const BASE = (process.env.JSGANTT_E2E_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '');
const DEMO_URL = `${BASE}/demo.html`;

/** Wait for JSGantt global and navigate to demo page. */
async function gotoDemo(page) {
  await page.goto(DEMO_URL, { waitUntil: 'load', timeout: 25_000 });
  await page.waitForFunction(() => typeof (window as any).JSGantt !== 'undefined', { timeout: 15_000 });
}

/**
 * Inject a day-format Gantt with one task (Mon Jan 6 → Mon Jan 13 2025) into
 * #embedded-Gantt with optional working-days configuration.
 *
 * @param workingDays  If supplied, passed to g.setWorkingDays(). Null = default (all days).
 */
async function mountDayGantt(page, workingDays: Record<number, boolean> | null = null) {
  await page.evaluate((wd) => {
    const container = document.getElementById('embedded-Gantt');
    if (!container) throw new Error('#embedded-Gantt not found');
    container.innerHTML = '';

    const g = new (window as any).JSGantt.GanttChart(container, 'day');
    g.setOptions({ vFormat: 'day', vFormatArr: ['Day'], vShowDur: 1 });

    if (wd) g.setWorkingDays(wd);

    g.AddTaskItem(new (window as any).JSGantt.TaskItem(
      1, 'Task A',
      '2025-01-06',  // Monday
      '2025-01-13',  // Monday (midnight → effective end = Tue Jan 14 for duration calc)
      'gtaskblue', '', 0, 'Me', 0, 0, 0, 1, '', '', '', g,
    ));

    g.Draw();
  }, workingDays);

  await page.waitForSelector('#embedded-Gantt .gcharttable', { timeout: 10_000 });
  await page.waitForTimeout(300);
}

/** Read the text of the first .gduration cell. */
async function getDurationText(page): Promise<string> {
  return page.evaluate(() => {
    const cell = document.querySelector('#embedded-Gantt .gduration div') as HTMLElement | null;
    return cell ? cell.innerText.trim() : '';
  });
}

/** Read the pixel width of the first task bar. */
async function getBarWidth(page): Promise<number> {
  return page.evaluate(() => {
    const bar = document.querySelector('[id*="bardiv_"]') as HTMLElement | null;
    return bar ? parseInt(bar.style.width || '0', 10) : 0;
  });
}

test.describe('Issue #68 — working days duration', () => {

  test.beforeEach(async ({ page }) => {
    await gotoDemo(page);
  });

  test('default: all-days chart shows 8 calendar days', async ({ page }) => {
    await mountDayGantt(page, null);

    const dur = await getDurationText(page);
    // Effective span Jan 6 → Jan 14 = 8 calendar days (midnight +1 day adjustment)
    expect(parseInt(dur), `Expected 8 days, got "${dur}"`).toBe(8);
  });

  test('setWorkingDays Mon–Fri: duration shows 6 working days', async ({ page }) => {
    await mountDayGantt(page, { 0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: false });

    const dur = await getDurationText(page);
    // Mon 6, Tue 7, Wed 8, Thu 9, Fri 10, Mon 13 = 6 working days
    expect(parseInt(dur), `Expected 6 working days, got "${dur}"`).toBe(6);
  });

  test('setWorkingDays Mon–Sat: duration shows 7 working days', async ({ page }) => {
    await mountDayGantt(page, { 0: false, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true });

    const dur = await getDurationText(page);
    // Mon 6, Tue 7, Wed 8, Thu 9, Fri 10, Sat 11, Mon 13 = 7 working days
    expect(parseInt(dur), `Expected 7 working days, got "${dur}"`).toBe(7);
  });

  test('all-true vWorkingDays gives same duration as default', async ({ page }) => {
    await mountDayGantt(page, null);
    const defaultDur = await getDurationText(page);

    // Re-mount with explicit all-true working days
    await page.evaluate(() => {
      const container = document.getElementById('embedded-Gantt')!;
      container.innerHTML = '';
      const g = new (window as any).JSGantt.GanttChart(container, 'day');
      g.setOptions({ vFormat: 'day', vFormatArr: ['Day'], vShowDur: 1 });
      g.setWorkingDays({ 0:true,1:true,2:true,3:true,4:true,5:true,6:true });
      g.AddTaskItem(new (window as any).JSGantt.TaskItem(
        1,'Task A','2025-01-06','2025-01-13','gtaskblue','',0,'Me',0,0,0,1,'','','',g,
      ));
      g.Draw();
    });
    await page.waitForTimeout(300);

    const allTrueDur = await getDurationText(page);
    expect(parseInt(allTrueDur),
      `all-true working days (${allTrueDur}) should equal default (${defaultDur})`
    ).toBe(parseInt(defaultDur));
  });

});
