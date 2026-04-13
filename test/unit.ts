/**
 * Unit tests for issue #355:
 * "Calculated min date uses current date as a minimum instead of the actual task minimum date"
 *
 * Run without a browser:
 *   TS_NODE_TRANSPILE_ONLY=true node_modules/.bin/mocha -r ts-node/register test/unit.ts
 */

import { expect } from 'chai';

// Minimal DOM shim — TaskItem uses document.createTextNode / createElement to
// sanitize values. Provide the minimum surface area needed to construct a
// TaskItem without a real browser.
function makeTextNode(val: any) {
  const node: any = {
    data: String(val == null ? '' : val),
    nodeName: '#text',
    childNodes: [],
    hasChildNodes() { return false; },
  };
  return node;
}
function makeElement(tag: string) {
  const el: any = {
    nodeName: tag.toUpperCase(),
    className: '',
    innerHTML: '',
    childNodes: [],
    hasChildNodes() { return this.childNodes.length > 0; },
    replaceChild(newNode: any, oldNode: any) {
      const idx = this.childNodes.indexOf(oldNode);
      if (idx !== -1) this.childNodes[idx] = newNode;
    },
  };
  return el;
}
(global as any).document = {
  createTextNode: makeTextNode,
  createElement:  makeElement,
};

import { TaskItem } from '../src/task';
import { getMinDate, getMaxDate } from '../src/utils';

// ─── helper ───────────────────────────────────────────────────────────────────
// Pass Date objects so the constructor takes the `instanceof Date` fast-path,
// bypassing parseDateStr / document.createTextNode on the date strings.
function makeTask(opts: {
  id: number;
  parent: number;
  start?: Date;
  end?: Date;
  group?: number;
}) {
  const mockGantt = { getDateInputFormat: () => 'yyyy-mm-dd' };
  return new (TaskItem as any)(
    opts.id,           // pID
    'task-' + opts.id, // pName
    opts.start || '',  // pStart  ('' → vStart stays null → hasStart() === false)
    opts.end   || '',  // pEnd
    'gtaskblue',       // pClass
    '',                // pLink
    0,                 // pMile
    '',                // pRes
    0,                 // pComp
    opts.group || 0,   // pGroup
    opts.parent,       // pParent
    1,                 // pOpen
    '',                // pDepend
    '',                // pCaption
    '',                // pNotes
    mockGantt,         // pGantt
    0,                 // pCost
    null,              // pPlanStart
    null               // pPlanEnd
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// hasStart / hasEnd
// ─────────────────────────────────────────────────────────────────────────────
describe('TaskItem.hasStart / hasEnd', () => {
  it('returns false when no date is set', () => {
    const task = makeTask({ id: 1, parent: 0 });
    expect(task.hasStart()).to.equal(false);
    expect(task.hasEnd()).to.equal(false);
  });

  it('returns true when an explicit start/end date is provided', () => {
    const task = makeTask({
      id: 2,
      parent: 0,
      start: new Date('2027-01-01'),
      end:   new Date('2027-01-31'),
    });
    expect(task.hasStart()).to.equal(true);
    expect(task.hasEnd()).to.equal(true);
  });

  it('getStart() on a dateless task still returns a Date (backwards compat)', () => {
    const task = makeTask({ id: 3, parent: 0 });
    expect(task.getStart()).to.be.instanceOf(Date);
    expect(task.getEnd()).to.be.instanceOf(Date);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getMinDate / getMaxDate  —  issue #355 regression tests
// ─────────────────────────────────────────────────────────────────────────────
describe('getMinDate / getMaxDate', () => {

  it('issue #355: chart range should be anchored near the actual task dates, not today, when a dateless group task is present', () => {
    // Scenario: one group with pStart/pEnd = "", all leaf tasks in 2027.
    // Before the fix, the group's getStart() returned today (~Apr 2026),
    // which was earlier than all 2027 dates, causing the chart to start today.
    // After the fix, dateless tasks are skipped and the chart starts near 2027.

    const today = new Date();
    const group  = makeTask({ id: 10, parent: 0, group: 1 });
    const child1 = makeTask({ id: 11, parent: 10, start: new Date('2027-01-01'), end: new Date('2027-01-29') });
    const child2 = makeTask({ id: 12, parent: 10, start: new Date('2027-01-15'), end: new Date('2027-02-12') });
    const child3 = makeTask({ id: 13, parent: 10, start: new Date('2027-02-12'), end: new Date('2027-03-01') });
    const pList  = [group, child1, child2, child3];

    const minDate = getMinDate(pList, 'month');
    const maxDate = getMaxDate(pList, 'month');

    // getMinDate pads back by ~1 month for 'month' format, so minDate lands in
    // late 2026, not today.  The key invariant: minDate must be significantly
    // after today (more than 6 months), proving the chart is not anchored at today.
    const sixMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 6, 1);
    expect(minDate.getTime()).to.be.above(sixMonthsFromNow.getTime(),
      `Expected minDate (${minDate.toDateString()}) to be well after today (${today.toDateString()}), not anchored to today`);

    // Similarly maxDate must be after the last task end (2027-03-01 padded forward).
    expect(maxDate.getFullYear()).to.equal(2027,
      `Expected maxDate year 2027 but got ${maxDate.toISOString()}`);
  });

  it('dateless group first in pList does not pull the minimum to today', () => {
    const today = new Date();
    const group = makeTask({ id: 20, parent: 0, group: 1 });
    const leaf  = makeTask({ id: 21, parent: 20, start: new Date('2030-06-01'), end: new Date('2030-06-30') });
    const pList = [group, leaf];  // group is pList[0] — the old code used pList[0] to seed vDate

    const minDate = getMinDate(pList, 'week');

    expect(minDate.getFullYear()).to.be.above(today.getFullYear(),
      `Expected minDate year > ${today.getFullYear()} but got ${minDate.toDateString()}`);
  });

  it('picks the earliest start date across multiple leaf tasks', () => {
    // t2 starts 2025-03-01, which is the earliest.
    // 'month' format pads back by ~15 days then snaps to the 1st of the month,
    // so the returned date should be the 1st of February 2025.
    const t1 = makeTask({ id: 30, parent: 0, start: new Date('2025-06-15'), end: new Date('2025-07-01') });
    const t2 = makeTask({ id: 31, parent: 0, start: new Date('2025-03-01'), end: new Date('2025-03-31') });
    const t3 = makeTask({ id: 32, parent: 0, start: new Date('2025-09-01'), end: new Date('2025-09-30') });
    const pList = [t1, t2, t3];

    const minDate = getMinDate(pList, 'month');
    const maxDate = getMaxDate(pList, 'month');

    // min is derived from 2025-03-01 → padded back → 2025-02-01
    expect(minDate.getFullYear()).to.equal(2025);
    expect(minDate.getMonth()).to.be.at.most(2,   // Jan(0) or Feb(1) due to padding — definitely not later
      `Expected minDate to be before March 2025, got month ${minDate.getMonth()}`);

    // max is derived from 2025-09-30 → padded forward → end of Sept 2025
    expect(maxDate.getFullYear()).to.equal(2025);
    expect(maxDate.getMonth()).to.be.at.least(8,  // Sept(8) or Oct(9) due to padding
      `Expected maxDate to be September or later in 2025, got month ${maxDate.getMonth()}`);
  });

  it('falls back to approximately today when no task in the list has an explicit date', () => {
    const group = makeTask({ id: 40, parent: 0, group: 1 });
    const pList = [group];

    const before   = new Date();
    const minDate  = getMinDate(pList, 'week');
    const maxDate  = getMaxDate(pList, 'week');

    // 'week' format adjusts back to the previous Monday, so the result is
    // within a week of today, not years away.
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    expect(Math.abs(minDate.getTime() - before.getTime())).to.be.below(oneWeekMs * 2,
      `Fallback should be within 2 weeks of today; got ${minDate.toDateString()}`);
    expect(Math.abs(maxDate.getTime() - before.getTime())).to.be.below(oneWeekMs * 2);
  });

  it('produces correct results for a fully-specified list (no regression)', () => {
    const t1 = makeTask({ id: 50, parent: 0, start: new Date('2024-01-10'), end: new Date('2024-01-20') });
    const t2 = makeTask({ id: 51, parent: 0, start: new Date('2024-01-05'), end: new Date('2024-02-28') });
    const pList = [t1, t2];

    const minDate = getMinDate(pList, 'month');
    const maxDate = getMaxDate(pList, 'month');

    // 2024-01-05 padded back ~15 days → Dec 2023 → 2023-12-01
    // 2024-02-28 padded forward → end of Feb 2024
    expect(minDate.getFullYear()).to.be.oneOf([2023, 2024],
      `Expected late 2023 or early 2024 but got ${minDate.toDateString()}`);
    expect(maxDate.getFullYear()).to.equal(2024);
    expect(maxDate.getMonth()).to.be.at.least(1, // Feb(1) or later
      `Expected maxDate in Feb 2024 or later, got month ${maxDate.getMonth()}`);
  });
});
