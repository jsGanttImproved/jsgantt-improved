/**
 * Page Object Model for the jsGantt demo page.
 * Wraps common selectors and helpers used across e2e specs.
 */

import { Page, Locator } from '@playwright/test';

export const DEMO_URL = 'demo.html';

export interface BarMetrics {
  id: string;
  /** JS-computed left offset in CSS pixels (bar.style.left) */
  styleLeft: number;
  /** JS-computed width in CSS pixels (bar.style.width) */
  styleWidth: number;
  /** Actual left position in viewport pixels relative to chart table left edge */
  viewportLeft: number;
  /** Actual width in viewport pixels */
  viewportWidth: number;
}

export interface ColMetrics {
  index: number;
  text: string;
  /** Width in viewport pixels */
  viewportWidth: number;
}

export class GanttPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url = DEMO_URL) {
    await this.page.goto(url, { waitUntil: 'load' });
    await this.page.waitForSelector('#embedded-Gantt .gcharttable', { timeout: 10_000 });
    // Allow layout to settle
    await this.page.waitForTimeout(400);
  }

  /**
   * Apply CSS zoom to the Gantt container, simulating browser-level zoom.
   * zoom=1.0 restores 100%.
   */
  async applyZoom(zoom: number) {
    await this.page.evaluate((z: number) => {
      const el = document.querySelector<HTMLElement>('#embedded-Gantt');
      if (el) el.style.zoom = z === 1 ? '' : String(z);
    }, zoom);
  }

  /**
   * Measure bar positions relative to the chart table's left edge.
   * Returns up to `limit` bars.
   */
  async getBarMetrics(limit = 8): Promise<BarMetrics[]> {
    return this.page.evaluate((lim: number) => {
      const chartTable = document.querySelector('.gcharttable');
      if (!chartTable) return [];
      const chartRect = chartTable.getBoundingClientRect();
      return Array.from(document.querySelectorAll('[id*="bardiv_"]'))
        .slice(0, lim)
        .map(bar => {
          const el = bar as HTMLElement;
          const rect = el.getBoundingClientRect();
          return {
            id: el.id.replace(/.*bardiv_/, 'bar_'),
            styleLeft: parseInt(el.style.left || '0', 10),
            styleWidth: parseInt(el.style.width || '0', 10),
            viewportLeft: Math.round((rect.left - chartRect.left) * 100) / 100,
            viewportWidth: Math.round(rect.width * 100) / 100,
          };
        });
    }, limit);
  }

  /**
   * Measure the last header row's column widths in viewport pixels.
   * The last row is the finest date granularity (day/week/month).
   */
  async getColumnMetrics(limit = 20): Promise<ColMetrics[]> {
    return this.page.evaluate((lim: number) => {
      const headerTable = document.querySelector('.gcharttableh');
      if (!headerTable) return [];
      const rows = headerTable.querySelectorAll('tr');
      const lastRow = rows[rows.length - 1];
      if (!lastRow) return [];
      return Array.from(lastRow.querySelectorAll('td'))
        .slice(0, lim)
        .map((td, i) => ({
          index: i,
          text: (td as HTMLElement).innerText.trim().slice(0, 10),
          viewportWidth: Math.round(td.getBoundingClientRect().width * 100) / 100,
        }));
    }, limit);
  }
}
