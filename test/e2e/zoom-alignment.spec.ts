/**
 * E2E tests for issue #23: bar misalignment at non-100% browser zoom.
 *
 * Root cause: table-layout:auto gives columns fractional pixel widths at
 * non-100% zoom. As columns accumulate, bars drift away from their date.
 *
 * Fix: table-layout:fixed + explicit JS cell widths (already applied).
 *
 * Test strategy:
 *   - Apply CSS zoom to #embedded-Gantt (equivalent to browser-level zoom)
 *   - At each zoom level, assert bars scale proportionally with zoom
 *     (viewportLeft ≈ styleLeft × zoom ± tolerance)
 *   - Assert column widths are uniform within each zoom level
 *     (no fractional-px spread from table-layout:auto)
 */

import { test, expect } from '@playwright/test';
import { GanttPage, DEMO_URL } from './gantt.page';

const ZOOM_LEVELS = [0.75, 0.8, 1.0, 1.25, 1.5];

/** Maximum allowed drift between expected and actual bar position (px). */
const DRIFT_TOLERANCE_PX = 3;

/** Maximum allowed spread between widest and narrowest column at the same zoom (px). */
const COL_SPREAD_TOLERANCE_PX = 1;

test.describe('Issue #23 — bar alignment at non-100% zoom', () => {
  for (const zoom of ZOOM_LEVELS) {
    const label = `${Math.round(zoom * 100)}%`;

    test(`bars are correctly aligned at ${label} zoom`, async ({ page }) => {
      const gantt = new GanttPage(page);
      await gantt.goto(DEMO_URL);
      await gantt.applyZoom(zoom);

      const bars = await gantt.getBarMetrics(8);
      expect(bars.length, 'should find rendered task bars').toBeGreaterThan(0);

      for (const bar of bars) {
        const expectedLeft = bar.styleLeft * zoom;
        const drift = Math.abs(bar.viewportLeft - expectedLeft);
        expect(
          drift,
          `${bar.id} at zoom ${label}: viewportLeft=${bar.viewportLeft} expected≈${expectedLeft.toFixed(1)}`,
        ).toBeLessThanOrEqual(DRIFT_TOLERANCE_PX);
      }
    });

    test(`column widths are uniform at ${label} zoom`, async ({ page }) => {
      const gantt = new GanttPage(page);
      await gantt.goto(DEMO_URL);

      // Capture baseline column width at 100% before applying zoom
      const baseCols = await gantt.getColumnMetrics(5);
      const baseColWidth = baseCols[0]?.viewportWidth ?? 39;

      await gantt.applyZoom(zoom);

      const cols = await gantt.getColumnMetrics(20);
      expect(cols.length, 'should find header columns').toBeGreaterThan(0);

      // All columns at the same zoom level should have the same width
      const widths = cols.map(c => c.viewportWidth);
      const spread = Math.max(...widths) - Math.min(...widths);
      expect(
        spread,
        `column width spread at ${label} zoom (min=${Math.min(...widths).toFixed(2)} max=${Math.max(...widths).toFixed(2)})`,
      ).toBeLessThanOrEqual(COL_SPREAD_TOLERANCE_PX);

      // Column widths should scale proportionally with the zoom factor
      const expectedWidth = baseColWidth * zoom;
      const avgWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
      expect(
        Math.abs(avgWidth - expectedWidth),
        `avg col width ${avgWidth.toFixed(2)} should be ≈ baseCol(${baseColWidth}) × zoom(${zoom}) = ${expectedWidth.toFixed(2)}`,
      ).toBeLessThanOrEqual(1);
    });
  }
});
