/**
 * Unit tests for drawColsChart — issue #255.
 *
 * Root cause: drawColsChart used strict `this.vShowWeekends !== false` so
 * passing the numeric 0 still colored weekend cells. Fix changed both checks
 * to a truthy test (`this.vShowWeekends`).
 *
 * These tests directly invoke drawColsChart with a fake DOM row and assert
 * which CSS classes end up on the created <td> cells.
 */

import './helpers';  // DOM shim — must be first
import { expect } from 'chai';
import { GanttChart } from '../../src/draw';

// ─── Extended DOM shim for drawColsChart ─────────────────────────────────────
// newNode calls pParent.appendChild(document.createElement(...)) and then sets
// className. We need a row object that collects appended children so we can
// inspect their classes afterward.

function makeRow(): any {
  const children: any[] = [];
  return {
    appendChild(child: any) { children.push(child); return child; },
    get children() { return children; },
  };
}

// Extend the existing document shim so that createElement returns an object
// that also supports appendChild (needed for the text-node path in newNode).
const origCreateElement = (global as any).document.createElement;
(global as any).document.createElement = function(tag: string) {
  const el: any = origCreateElement(tag);
  el.style     = { width: '', left: '', display: '' };
  el.className = '';
  const kids: any[] = [];
  el.appendChild  = (c: any) => { kids.push(c); return c; };
  el.getAttribute = (_: string) => null;
  el.setAttribute = (_k: string, _v: string) => {};
  el.insertAdjacentHTML = (_pos: string, _html: string) => {};
  return el;
};

// ─── Helper: create a minimal GanttChart and call drawColsChart ───────────────

function runDrawColsChart(opts: {
  vShowWeekends: any;
  vFormat?: string;
  numCols?: number;
}): string[] {
  const chart = new (GanttChart as any)(null, opts.vFormat ?? 'day');
  chart.vShowWeekends = opts.vShowWeekends;
  chart.vFormat       = opts.vFormat ?? 'day';

  const row = makeRow();
  // numCols=8 gives us 7 actual cells (loop runs < numCols-1 ... wait, j < vNumCols - 1)
  // Use 15 columns so we always cover one full 7-day cycle (indices 0-13).
  const numCols = opts.numCols ?? 15;
  chart.drawColsChart(numCols, row, 30, null, null);
  return row.children.map((td: any) => td.className as string);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('drawColsChart — vShowWeekends (issue #255)', () => {

  it('colors weekend columns (j%7==4 or j%7==5) with gtaskcellwkend when vShowWeekends=1', () => {
    const classes = runDrawColsChart({ vShowWeekends: 1 });
    const wkendCells = classes.filter(c => c === 'gtaskcellwkend');
    expect(wkendCells.length).to.be.greaterThan(0,
      'Expected at least one gtaskcellwkend cell when vShowWeekends=1');
    // Verify the correct column indices (4 and 5 within each 7-day block)
    classes.forEach((cls, j) => {
      if (j % 7 === 4 || j % 7 === 5) {
        expect(cls).to.equal('gtaskcellwkend', `Column ${j} should be gtaskcellwkend`);
      } else {
        expect(cls).to.include('gtaskcell', `Column ${j} should be a normal cell`);
      }
    });
  });

  it('produces NO gtaskcellwkend cells when vShowWeekends=0 (numeric zero)', () => {
    const classes = runDrawColsChart({ vShowWeekends: 0 });
    const wkendCells = classes.filter(c => c === 'gtaskcellwkend');
    expect(wkendCells.length).to.equal(0,
      'Expected zero gtaskcellwkend cells when vShowWeekends=0 (numeric)');
  });

  it('produces NO gtaskcellwkend cells when vShowWeekends=false (boolean)', () => {
    const classes = runDrawColsChart({ vShowWeekends: false });
    const wkendCells = classes.filter(c => c === 'gtaskcellwkend');
    expect(wkendCells.length).to.equal(0,
      'Expected zero gtaskcellwkend cells when vShowWeekends=false (boolean)');
  });

  it('does not apply gtaskcellwkend in week format even when vShowWeekends=1', () => {
    const classes = runDrawColsChart({ vShowWeekends: 1, vFormat: 'week' });
    const wkendCells = classes.filter(c => c === 'gtaskcellwkend');
    expect(wkendCells.length).to.equal(0,
      'gtaskcellwkend coloring is day-format only');
  });

  it('does not apply gtaskcellwkend in month format even when vShowWeekends=1', () => {
    const classes = runDrawColsChart({ vShowWeekends: 1, vFormat: 'month' });
    const wkendCells = classes.filter(c => c === 'gtaskcellwkend');
    expect(wkendCells.length).to.equal(0,
      'gtaskcellwkend coloring is day-format only');
  });

  it('all non-weekend cells get gtaskcell class when vShowWeekends=1', () => {
    const classes = runDrawColsChart({ vShowWeekends: 1 });
    classes.forEach((cls, j) => {
      if (j % 7 !== 4 && j % 7 !== 5) {
        expect(cls).to.include('gtaskcell', `Column ${j} should include gtaskcell`);
      }
    });
  });

  it('all cells get gtaskcell class when vShowWeekends=0', () => {
    const classes = runDrawColsChart({ vShowWeekends: 0 });
    classes.forEach((cls, j) => {
      expect(cls).to.include('gtaskcell', `Column ${j} should include gtaskcell, got: ${cls}`);
    });
  });

});
