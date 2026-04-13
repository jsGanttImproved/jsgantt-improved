/**
 * Unit tests for getMinDate / getMaxDate (src/utils.ts).
 *
 * Covers the regression from issue #355:
 * "Calculated min date uses current date as a minimum instead of the actual task minimum date"
 */

import './helpers';   // DOM shim — must be first
import { expect } from 'chai';
import { makeTask } from './helpers';
import { getMinDate, getMaxDate } from '../../src/utils/date_utils';

describe('getMinDate', () => {
  it('issue #355: does not anchor the chart to today when a dateless group task is present', () => {
    // One group with pStart/pEnd = "", all leaf tasks in 2027.
    // Before the fix, the group's getStart() returned today, which is earlier
    // than all 2027 dates, so the chart started at today instead of 2027.
    const today  = new Date();
    const group  = makeTask({ id: 10, parent: 0, group: 1 });
    const child1 = makeTask({ id: 11, parent: 10, start: new Date('2027-01-01'), end: new Date('2027-01-29') });
    const child2 = makeTask({ id: 12, parent: 10, start: new Date('2027-01-15'), end: new Date('2027-02-12') });
    const child3 = makeTask({ id: 13, parent: 10, start: new Date('2027-02-12'), end: new Date('2027-03-01') });

    const minDate = getMinDate([group, child1, child2, child3], 'month');

    // 'month' format pads back ~1 month, so minDate lands in late 2026.
    // Key invariant: it must be well after today, not anchored to today.
    const sixMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 6, 1);
    expect(minDate.getTime()).to.be.above(sixMonthsFromNow.getTime(),
      `minDate (${minDate.toDateString()}) should be near 2027, not today (${today.toDateString()})`);
  });

  it('dateless group at pList[0] does not pull the minimum to today', () => {
    // The old code seeded vDate from pList[0].getStart() — dangerous when pList[0]
    // is a dateless group.
    const today = new Date();
    const group = makeTask({ id: 20, parent: 0, group: 1 });
    const leaf  = makeTask({ id: 21, parent: 20, start: new Date('2030-06-01'), end: new Date('2030-06-30') });

    const minDate = getMinDate([group, leaf], 'week');

    expect(minDate.getFullYear()).to.be.above(today.getFullYear(),
      `minDate year should be > ${today.getFullYear()}, got ${minDate.toDateString()}`);
  });

  it('picks the earliest start date across multiple leaf tasks', () => {
    // t2 (2025-03-01) is the earliest; 'month' format pads back ~15 days → Feb 2025.
    const t1 = makeTask({ id: 30, parent: 0, start: new Date('2025-06-15'), end: new Date('2025-07-01') });
    const t2 = makeTask({ id: 31, parent: 0, start: new Date('2025-03-01'), end: new Date('2025-03-31') });
    const t3 = makeTask({ id: 32, parent: 0, start: new Date('2025-09-01'), end: new Date('2025-09-30') });

    const minDate = getMinDate([t1, t2, t3], 'month');

    expect(minDate.getFullYear()).to.equal(2025);
    expect(minDate.getMonth()).to.be.at.most(2,   // Jan(0)–Feb(1) due to padding, never after March
      `Expected minDate before March 2025, got month ${minDate.getMonth()}`);
  });

  it('falls back to approximately today when no task has an explicit date', () => {
    const group  = makeTask({ id: 40, parent: 0, group: 1 });
    const before = new Date();
    const minDate = getMinDate([group], 'week');

    // 'week' format adjusts back to the previous Monday — within one week of today.
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    expect(Math.abs(minDate.getTime() - before.getTime())).to.be.below(oneWeekMs * 2,
      `Fallback should be within 2 weeks of today; got ${minDate.toDateString()}`);
  });

  it('produces correct results for a fully-specified task list (no regression)', () => {
    const t1 = makeTask({ id: 50, parent: 0, start: new Date('2024-01-10'), end: new Date('2024-01-20') });
    const t2 = makeTask({ id: 51, parent: 0, start: new Date('2024-01-05'), end: new Date('2024-02-28') });

    const minDate = getMinDate([t1, t2], 'month');

    // 2024-01-05 padded back ~15 days → Dec 2023 → 2023-12-01.
    // Assert the result is before February 2024 (covers both Dec 2023 and Jan 2024).
    const feb2024 = new Date(2024, 1, 1);
    expect(minDate.getTime()).to.be.below(feb2024.getTime(),
      `Expected minDate before Feb 2024 but got ${minDate.toDateString()}`);
  });
});

describe('getMaxDate', () => {
  it('issue #355: does not anchor the chart end to today when a dateless group task is present', () => {
    const today  = new Date();
    const group  = makeTask({ id: 60, parent: 0, group: 1 });
    const child1 = makeTask({ id: 61, parent: 60, start: new Date('2027-01-01'), end: new Date('2027-01-29') });
    const child2 = makeTask({ id: 62, parent: 60, start: new Date('2027-02-12'), end: new Date('2027-03-01') });

    const maxDate = getMaxDate([group, child1, child2], 'month');

    expect(maxDate.getFullYear()).to.equal(2027,
      `maxDate (${maxDate.toDateString()}) should be in 2027, not near today (${today.toDateString()})`);
  });

  it('picks the latest end date across multiple leaf tasks', () => {
    const t1 = makeTask({ id: 70, parent: 0, start: new Date('2025-01-01'), end: new Date('2025-03-31') });
    const t2 = makeTask({ id: 71, parent: 0, start: new Date('2025-06-01'), end: new Date('2025-09-30') });
    const t3 = makeTask({ id: 72, parent: 0, start: new Date('2025-01-01'), end: new Date('2025-02-28') });

    const maxDate = getMaxDate([t1, t2, t3], 'month');

    expect(maxDate.getFullYear()).to.equal(2025);
    expect(maxDate.getMonth()).to.be.at.least(8,  // Sept(8) or Oct(9) due to padding
      `Expected maxDate in September or later 2025, got month ${maxDate.getMonth()}`);
  });
});
