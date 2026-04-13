/**
 * Unit tests for getMinDate / getMaxDate (src/utils.ts).
 *
 * Covers the regression from issue #355:
 * "Calculated min date uses current date as a minimum instead of the actual task minimum date"
 */

import './helpers';   // DOM shim — must be first
import { expect } from 'chai';
import { makeTask } from './helpers';
import { getMinDate, getMaxDate, parseDateFormatStr, formatDateStr } from '../../src/utils/date_utils';
import { en } from '../../src/lang';

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

// ── Issue #278: Year format — getMinDate / getMaxDate boundary snapping ──────

describe('getMinDate — year format', () => {
  it('snaps to Jan 1 of the earliest task year', () => {
    const t1 = makeTask({ id: 100, parent: 0, start: new Date('2023-07-15'), end: new Date('2023-12-31') });
    const t2 = makeTask({ id: 101, parent: 0, start: new Date('2021-03-01'), end: new Date('2022-06-30') });

    const minDate = getMinDate([t1, t2], 'year');

    expect(minDate.getFullYear()).to.equal(2021, `Expected year 2021, got ${minDate.getFullYear()}`);
    expect(minDate.getMonth()).to.equal(0, 'Expected January (month 0)');
    expect(minDate.getDate()).to.equal(1, 'Expected 1st of month');
  });

  it('handles a single task spanning multiple years', () => {
    const t = makeTask({ id: 102, parent: 0, start: new Date('2019-06-01'), end: new Date('2025-11-30') });

    const minDate = getMinDate([t], 'year');

    expect(minDate.getFullYear()).to.equal(2019);
    expect(minDate.getMonth()).to.equal(0);
    expect(minDate.getDate()).to.equal(1);
  });

  it('dateless group does not pull min to today in year format', () => {
    const group = makeTask({ id: 103, parent: 0, group: 1 });
    const leaf  = makeTask({ id: 104, parent: 103, start: new Date('2030-01-01'), end: new Date('2030-12-31') });

    const minDate = getMinDate([group, leaf], 'year');

    expect(minDate.getFullYear()).to.equal(2030, `Expected 2030, got ${minDate.getFullYear()}`);
  });
});

describe('getMaxDate — year format', () => {
  it('snaps to Dec 31 of the latest task year', () => {
    const t1 = makeTask({ id: 110, parent: 0, start: new Date('2020-01-01'), end: new Date('2022-06-30') });
    const t2 = makeTask({ id: 111, parent: 0, start: new Date('2023-03-01'), end: new Date('2025-09-15') });

    const maxDate = getMaxDate([t1, t2], 'year');

    expect(maxDate.getFullYear()).to.equal(2025, `Expected year 2025, got ${maxDate.getFullYear()}`);
    expect(maxDate.getMonth()).to.equal(11, 'Expected December (month 11)');
    expect(maxDate.getDate()).to.equal(31, 'Expected 31st');
  });

  it('year already ending Dec 31 stays as Dec 31', () => {
    const t = makeTask({ id: 112, parent: 0, start: new Date('2024-01-01'), end: new Date('2024-12-31') });

    const maxDate = getMaxDate([t], 'year');

    expect(maxDate.getFullYear()).to.equal(2024);
    expect(maxDate.getMonth()).to.equal(11);
    expect(maxDate.getDate()).to.equal(31);
  });

  it('min and max dates bracket the full task range in year format', () => {
    const tasks = [
      makeTask({ id: 120, parent: 0, start: new Date('2018-05-01'), end: new Date('2018-08-31') }),
      makeTask({ id: 121, parent: 0, start: new Date('2022-11-01'), end: new Date('2023-02-28') }),
    ];

    const minDate = getMinDate(tasks, 'year');
    const maxDate = getMaxDate(tasks, 'year');

    expect(minDate.getFullYear()).to.equal(2018);
    expect(minDate.getMonth()).to.equal(0);
    expect(maxDate.getFullYear()).to.equal(2023);
    expect(maxDate.getMonth()).to.equal(11);
  });
});

// ── Issue #382: {{token}} delimiter syntax for date display formats ────────────
//
// Test date: 2024-01-05 14:30:45  (Friday, ISO week 1, Q1)
//   dd=05  d=5   mm=01  m=1   yyyy=2024  yy=24
//   mon=Jan  month=January  day=Fri  DAY=Friday
//   w=1  ww=01  week=2024-W1-5
//   q=1  qq=Qtr1
//   H=14  HH=14  h=2  hh=02  MI=30  SS=45  pm=pm  PM=PM

describe('parseDateFormatStr — {{token}} syntax', () => {
  it('single token only: {{dd}}', () => {
    expect(parseDateFormatStr('{{dd}}')).to.deep.equal(['dd']);
  });

  it('trailing literal text is sentinel-prefixed', () => {
    expect(parseDateFormatStr('{{ww}} week')).to.deep.equal(['ww', '\x00 week']);
  });

  it('leading literal text is sentinel-prefixed', () => {
    expect(parseDateFormatStr('W{{ww}}')).to.deep.equal(['\x00W', 'ww']);
  });

  it('multiple tokens with literal separators', () => {
    expect(parseDateFormatStr('{{ww}} week - {{mon}} {{yyyy}}')).to.deep.equal(
      ['ww', '\x00 week - ', 'mon', '\x00 ', 'yyyy']
    );
  });

  it('adjacent tokens with no separator', () => {
    expect(parseDateFormatStr('{{dd}}{{mm}}{{yyyy}}')).to.deep.equal(['dd', 'mm', 'yyyy']);
  });

  it('literal-only string (no tokens)', () => {
    expect(parseDateFormatStr('{{Week}}')).to.deep.equal(['Week']);
  });

  it('separator character as literal', () => {
    expect(parseDateFormatStr('{{dd}}/{{mm}}/{{yyyy}}')).to.deep.equal(
      ['dd', '\x00/', 'mm', '\x00/', 'yyyy']
    );
  });

  it('legacy path: no {{ → original split behaviour', () => {
    expect(parseDateFormatStr('dd/mm/yyyy')).to.deep.equal(['dd', '/', 'mm', '/', 'yyyy']);
  });

  it('legacy path: space and hyphen separators unchanged', () => {
    expect(parseDateFormatStr('mon yyyy')).to.deep.equal(['mon', ' ', 'yyyy']);
  });
});

describe('formatDateStr — all tokens in {{token}} mode', () => {
  // 2024-01-05 14:30:45, Friday, ISO week 1, Q1
  const date  = new Date(2024, 0, 5, 14, 30, 45);
  const fmt   = (s: string) => parseDateFormatStr(s);
  const f     = (s: string) => formatDateStr(date, fmt(s), en);

  // ── Day tokens ────────────────────────────────────────────────────────────
  it('{{dd}} → zero-padded day', ()          => expect(f('{{dd}}')).to.equal('05'));
  it('{{d}}  → unpadded day',   ()          => expect(f('{{d}}')).to.equal('5'));
  it('{{day}} → short weekday name', ()     => expect(f('{{day}}')).to.equal('Fri'));
  it('{{DAY}} → full weekday name', ()      => expect(f('{{DAY}}')).to.equal('Friday'));

  // ── Month tokens ──────────────────────────────────────────────────────────
  it('{{mm}} → zero-padded month', ()       => expect(f('{{mm}}')).to.equal('01'));
  it('{{m}}  → unpadded month', ()          => expect(f('{{m}}')).to.equal('1'));
  it('{{mon}} → 3-letter month abbrev', ()  => expect(f('{{mon}}')).to.equal('Jan'));
  it('{{month}} → full month name', ()      => expect(f('{{month}}')).to.equal('January'));

  // ── Year tokens ───────────────────────────────────────────────────────────
  it('{{yyyy}} → 4-digit year', ()          => expect(f('{{yyyy}}')).to.equal('2024'));
  it('{{yy}}   → 2-digit year', ()          => expect(f('{{yy}}')).to.equal('24'));

  // ── Week tokens ───────────────────────────────────────────────────────────
  it('{{w}}    → unpadded ISO week number', () => expect(f('{{w}}')).to.equal('1'));
  it('{{ww}}   → zero-padded ISO week number', () => expect(f('{{ww}}')).to.equal('01'));
  it('{{week}} → full ISO 8601 week date', () => expect(f('{{week}}')).to.equal('2024-W1-5'));

  // ── Quarter tokens ────────────────────────────────────────────────────────
  it('{{q}}  → quarter number', ()          => expect(f('{{q}}')).to.equal('1'));
  it('{{qq}} → quarter label + number', ()  => expect(f('{{qq}}')).to.equal('Qtr1'));

  // ── Time tokens ───────────────────────────────────────────────────────────
  it('{{H}}  → unpadded 24-h hour', ()      => expect(f('{{H}}')).to.equal('14'));
  it('{{HH}} → zero-padded 24-h hour', ()   => expect(f('{{HH}}')).to.equal('14'));
  it('{{h}}  → unpadded 12-h hour', ()      => expect(f('{{h}}')).to.equal('2'));
  it('{{hh}} → zero-padded 12-h hour', ()   => expect(f('{{hh}}')).to.equal('02'));
  it('{{MI}} → zero-padded minutes', ()     => expect(f('{{MI}}')).to.equal('30'));
  it('{{SS}} → zero-padded seconds', ()     => expect(f('{{SS}}')).to.equal('45'));
  it('{{pm}} → lowercase am/pm', ()         => expect(f('{{pm}}')).to.equal('pm'));
  it('{{PM}} → uppercase AM/PM', ()         => expect(f('{{PM}}')).to.equal('PM'));

  // ── Core use-case from issue #382: "week" / "mon" as literal text ─────────
  it('"week" in label stays literal when outside {{}}', () => {
    expect(f('{{ww}} week - {{mon}} {{yyyy}}')).to.equal('01 week - Jan 2024');
  });

  it('"mon" in label stays literal when outside {{}}', () => {
    // "every mon" — "mon" is literal; only {{dd}} and {{yyyy}} are substituted
    expect(f('{{dd}} {{yyyy}} every mon')).to.equal('05 2024 every mon');
  });

  it('leading literal "W" prefix stays literal', () => {
    expect(f('W{{ww}}/{{yyyy}}')).to.equal('W01/2024');
  });

  it('adjacent tokens with no separator', () => {
    expect(f('{{dd}}{{mm}}{{yyyy}}')).to.equal('05012024');
  });

  // ── Legacy formats unaffected ─────────────────────────────────────────────
  it('legacy dd/mm/yyyy unchanged', () => {
    expect(f('dd/mm/yyyy')).to.equal('05/01/2024');
  });

  it('legacy "mon yyyy" unchanged (mon substituted, not literal)', () => {
    // Without {{ delimiters, "mon" is still a token → "Jan 2024"
    expect(f('mon yyyy')).to.equal('Jan 2024');
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

// ── Issue #379: Configurable first day of week ────────────────────────────────

describe('getMinDate — vFirstDayOfWeek', () => {
  // 2025-04-09 is a Wednesday. For 'day' format the function steps back to the
  // start of the week, so the result depends on which day opens the week.
  const task = makeTask({ id: 100, parent: 0, start: new Date('2025-04-09'), end: new Date('2025-04-16') });

  it('default (Monday=1): min boundary is the preceding Monday', () => {
    const minDate = getMinDate([task], 'day');
    expect(minDate.getDay()).to.equal(1, `Expected Monday (1), got day ${minDate.getDay()} (${minDate.toDateString()})`);
  });

  it('Sunday-first (0): min boundary is the preceding Sunday', () => {
    const minDate = getMinDate([task], 'day', undefined, 0);
    expect(minDate.getDay()).to.equal(0, `Expected Sunday (0), got day ${minDate.getDay()} (${minDate.toDateString()})`);
  });

  it('Saturday-first (6): min boundary is the preceding Saturday', () => {
    const minDate = getMinDate([task], 'day', undefined, 6);
    expect(minDate.getDay()).to.equal(6, `Expected Saturday (6), got day ${minDate.getDay()} (${minDate.toDateString()})`);
  });

  it('Sunday-first (0): week format also snaps to Sunday', () => {
    const minDate = getMinDate([task], 'week', undefined, 0);
    expect(minDate.getDay()).to.equal(0, `Expected Sunday (0) in week format, got ${minDate.toDateString()}`);
  });
});

// ── Issue #284: end date on last day of week renders extra empty week ─────────

describe('getMaxDate — issue #284 (end date on last day of week)', () => {
  // 2020-02-23 is a Sunday. With firstDayOfWeek=1 (Monday), Sunday is the last
  // day of the week. Before the fix, getMaxDate would +1 to Monday and then
  // advance all the way to the NEXT Sunday, causing a blank extra week.

  // ── Core regression: exact date must not overshoot ────────────────────────

  it('day format: end on Sunday (Mon-first) stays at that exact Sunday', () => {
    const task = makeTask({ id: 284, parent: 0, start: new Date('2020-02-14'), end: new Date('2020-02-23') });
    const maxDate = getMaxDate([task], 'day', undefined, 1);
    expect(maxDate.toDateString()).to.equal(new Date('2020-02-23').toDateString(),
      `Expected maxDate to be Sun 2020-02-23, got ${maxDate.toDateString()}`);
  });

  it('week format: end on Sunday (Mon-first) stays at that exact Sunday', () => {
    const task = makeTask({ id: 285, parent: 0, start: new Date('2020-02-14'), end: new Date('2020-02-23') });
    const maxDate = getMaxDate([task], 'week', undefined, 1);
    expect(maxDate.toDateString()).to.equal(new Date('2020-02-23').toDateString(),
      `Expected maxDate to be Sun 2020-02-23, got ${maxDate.toDateString()}`);
  });

  it('exact date: year=2020, month=Feb, date=23 (not the following Sun 2020-03-01)', () => {
    // Regression guard: the wrong answer before the fix was 2020-03-01 (next Sunday).
    const task = makeTask({ id: 2840, parent: 0, start: new Date('2020-02-14'), end: new Date('2020-02-23') });
    const maxDate = getMaxDate([task], 'week', undefined, 1);
    expect(maxDate.getFullYear()).to.equal(2020);
    expect(maxDate.getMonth()).to.equal(1, 'should be February (month index 1)');
    expect(maxDate.getDate()).to.equal(23, 'should be the 23rd, not the 1st of March');
  });

  // ── Other firstDayOfWeek values ───────────────────────────────────────────

  it('day format: end on Saturday (lastDayOfWeek for Sun-first) stays at that Saturday', () => {
    // firstDayOfWeek=0 → lastDayOfWeek=(0+6)%7=6=Saturday. 2020-02-22 is Sat.
    const task = makeTask({ id: 286, parent: 0, start: new Date('2020-02-16'), end: new Date('2020-02-22') });
    const maxDate = getMaxDate([task], 'day', undefined, 0);
    expect(maxDate.toDateString()).to.equal(new Date('2020-02-22').toDateString(),
      `Expected maxDate to be Sat 2020-02-22, got ${maxDate.toDateString()}`);
  });

  it('week format: end on Friday (lastDayOfWeek for Sat-first) stays at that Friday', () => {
    // firstDayOfWeek=6 → lastDayOfWeek=(6+6)%7=5=Friday. 2020-02-21 is Fri.
    const task = makeTask({ id: 2861, parent: 0, start: new Date('2020-02-17'), end: new Date('2020-02-21') });
    const maxDate = getMaxDate([task], 'week', undefined, 6);
    expect(maxDate.toDateString()).to.equal(new Date('2020-02-21').toDateString(),
      `Expected maxDate to be Fri 2020-02-21, got ${maxDate.toDateString()}`);
  });

  // ── Mid-week still advances correctly (regression guard) ──────────────────

  it('day format: end mid-week (Wed) still advances to end of that week (Sun)', () => {
    // 2020-02-19 is Wednesday. With Mon-first, should advance to 2020-02-23 (Sun).
    const task = makeTask({ id: 287, parent: 0, start: new Date('2020-02-14'), end: new Date('2020-02-19') });
    const maxDate = getMaxDate([task], 'day', undefined, 1);
    expect(maxDate.toDateString()).to.equal(new Date('2020-02-23').toDateString(),
      `Expected maxDate to advance to Sun 2020-02-23, got ${maxDate.toDateString()}`);
  });

  it('week format: end mid-week (Tue) still advances to end of that week (Sun)', () => {
    // 2020-02-18 is Tuesday.
    const task = makeTask({ id: 2871, parent: 0, start: new Date('2020-02-14'), end: new Date('2020-02-18') });
    const maxDate = getMaxDate([task], 'week', undefined, 1);
    expect(maxDate.toDateString()).to.equal(new Date('2020-02-23').toDateString(),
      `Expected maxDate to advance to Sun 2020-02-23, got ${maxDate.toDateString()}`);
  });

  // ── planEnd on last day of week ────────────────────────────────────────────

  it('planEnd on Sunday drives maxDate without overshooting', () => {
    // pEnd is Wednesday, but planEnd is Sunday — planEnd wins and should not overshoot.
    const task = makeTask({
      id: 2881, parent: 0,
      start: new Date('2020-02-14'), end: new Date('2020-02-19'),
      planEnd: new Date('2020-02-23'),
    });
    const maxDate = getMaxDate([task], 'week', undefined, 1);
    expect(maxDate.toDateString()).to.equal(new Date('2020-02-23').toDateString(),
      `planEnd on Sun should set maxDate to 2020-02-23, got ${maxDate.toDateString()}`);
  });

  // ── Multiple tasks ─────────────────────────────────────────────────────────

  it('multiple tasks: latest task ends on Sunday, maxDate stops at that Sunday', () => {
    const t1 = makeTask({ id: 2891, parent: 0, start: new Date('2020-02-10'), end: new Date('2020-02-18') });
    const t2 = makeTask({ id: 2892, parent: 0, start: new Date('2020-02-17'), end: new Date('2020-02-23') });
    const maxDate = getMaxDate([t1, t2], 'week', undefined, 1);
    expect(maxDate.toDateString()).to.equal(new Date('2020-02-23').toDateString(),
      `Expected maxDate 2020-02-23, got ${maxDate.toDateString()}`);
  });

  it('multiple tasks: task ending on Sunday is not the latest — mid-week task drives maxDate', () => {
    // t1 ends on Sunday (week 1), t2 ends Thursday the following week.
    // maxDate should advance to the Sunday of the week containing t2.
    const t1 = makeTask({ id: 2893, parent: 0, start: new Date('2020-02-10'), end: new Date('2020-02-23') });
    const t2 = makeTask({ id: 2894, parent: 0, start: new Date('2020-02-24'), end: new Date('2020-02-27') });
    const maxDate = getMaxDate([t1, t2], 'week', undefined, 1);
    // 2020-02-27 is Thursday → advances to Sun 2020-03-01
    expect(maxDate.toDateString()).to.equal(new Date('2020-03-01').toDateString(),
      `Expected maxDate 2020-03-01 (Sun of t2's week), got ${maxDate.toDateString()}`);
  });
});

describe('getMaxDate — vFirstDayOfWeek', () => {
  // 2025-04-09 is a Wednesday.
  const task = makeTask({ id: 110, parent: 0, start: new Date('2025-04-09'), end: new Date('2025-04-09') });

  it('default (Monday=1): max boundary is the following Sunday (6)', () => {
    const maxDate = getMaxDate([task], 'day');
    expect(maxDate.getDay()).to.equal(0, `Expected Sunday (0), got day ${maxDate.getDay()} (${maxDate.toDateString()})`);
  });

  it('Sunday-first (0): max boundary is the following Saturday (6)', () => {
    const maxDate = getMaxDate([task], 'day', undefined, 0);
    expect(maxDate.getDay()).to.equal(6, `Expected Saturday (6), got day ${maxDate.getDay()} (${maxDate.toDateString()})`);
  });

  it('Saturday-first (6): max boundary is the following Friday (5)', () => {
    const maxDate = getMaxDate([task], 'day', undefined, 6);
    expect(maxDate.getDay()).to.equal(5, `Expected Friday (5), got day ${maxDate.getDay()} (${maxDate.toDateString()})`);
  });

  it('Sunday-first (0): week format max boundary is Saturday (6)', () => {
    const maxDate = getMaxDate([task], 'week', undefined, 0);
    expect(maxDate.getDay()).to.equal(6, `Expected Saturday (6) in week format, got ${maxDate.toDateString()}`);
  });
});
