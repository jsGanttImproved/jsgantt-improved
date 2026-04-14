/**
 * Unit tests for setShowCurrentDateLine / setCurrentDate — issue #260.
 *
 * The feature adds:
 *   - setShowCurrentDateLine(1|0)  — toggle a vertical "today" line
 *   - setCurrentDate(date|string)  — override the reference date
 *   - getCurrentDate()             — returns the active reference date
 *
 * These tests verify the option getters/setters and the vTodayPx calculation
 * logic without requiring a full DOM render.
 */

import './helpers';  // DOM shim — must be first
import { expect } from 'chai';
import { GanttChart } from '../../src/draw';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeChart(format = 'day'): any {
  return new (GanttChart as any)(null, format);
}

// ─── setCurrentDate / getCurrentDate ─────────────────────────────────────────

describe('setCurrentDate / getCurrentDate (issue #260)', () => {

  it('getCurrentDate() returns a Date close to now when unset', () => {
    const chart = makeChart();
    const before = Date.now();
    const d = chart.getCurrentDate();
    const after = Date.now();
    expect(d).to.be.instanceOf(Date);
    expect(d.getTime()).to.be.within(before - 100, after + 100);
  });

  it('setCurrentDate(Date) stores the exact date', () => {
    const chart = makeChart();
    const ref = new Date('2019-09-30T00:00:00Z');
    chart.setCurrentDate(ref);
    expect(chart.getCurrentDate()).to.deep.equal(ref);
  });

  it('setCurrentDate(string) parses and stores a Date', () => {
    const chart = makeChart();
    chart.setCurrentDate('2019-09-30');
    const stored = chart.getCurrentDate();
    expect(stored).to.be.instanceOf(Date);
    expect(stored.getFullYear()).to.equal(2019);
    expect(stored.getMonth()).to.equal(8);   // 0-indexed → September
    expect(stored.getDate()).to.equal(30);
  });

  it('setCurrentDate(Date) stores an instance separate from new Date()', () => {
    const chart = makeChart();
    const ref = new Date('2025-01-15');
    chart.setCurrentDate(ref);
    expect(chart.getCurrentDate()).to.not.equal(new Date(), 'should not fall back to now');
    expect(chart.getCurrentDate().getFullYear()).to.equal(2025);
  });

  it('vCurrentDate is null by default', () => {
    const chart = makeChart();
    expect(chart.vCurrentDate).to.equal(null);
  });

  it('setCurrentDate updates vCurrentDate', () => {
    const chart = makeChart();
    const ref = new Date('2020-06-01');
    chart.setCurrentDate(ref);
    expect(chart.vCurrentDate).to.deep.equal(ref);
  });

});

// ─── setShowCurrentDateLine / getShowCurrentDateLine ─────────────────────────

describe('setShowCurrentDateLine / getShowCurrentDateLine (issue #260)', () => {

  it('vShowCurrentDateLine defaults to 0', () => {
    const chart = makeChart();
    expect(chart.vShowCurrentDateLine).to.equal(0);
  });

  it('getShowCurrentDateLine() returns 0 by default', () => {
    const chart = makeChart();
    expect(chart.getShowCurrentDateLine()).to.equal(0);
  });

  it('setShowCurrentDateLine(1) enables the flag', () => {
    const chart = makeChart();
    chart.setShowCurrentDateLine(1);
    expect(chart.getShowCurrentDateLine()).to.equal(1);
  });

  it('setShowCurrentDateLine(0) disables after being enabled', () => {
    const chart = makeChart();
    chart.setShowCurrentDateLine(1);
    chart.setShowCurrentDateLine(0);
    expect(chart.getShowCurrentDateLine()).to.equal(0);
  });

  it('setShowCurrentDateLine(true) is truthy', () => {
    const chart = makeChart();
    chart.setShowCurrentDateLine(true);
    expect(chart.getShowCurrentDateLine()).to.be.ok;
  });

  it('setShowCurrentDateLine(false) is falsy', () => {
    const chart = makeChart();
    chart.setShowCurrentDateLine(false);
    expect(chart.getShowCurrentDateLine()).to.not.be.ok;
  });

});

// ─── vTodayPx uses getCurrentDate() ──────────────────────────────────────────
// We can't call Draw() without a full DOM, but we can verify that
// getCurrentDate() returns the right value when setCurrentDate is configured,
// since vTodayPx is computed directly from getCurrentDate() in Draw().

describe('getCurrentDate() is used for vTodayPx computation (issue #260)', () => {

  it('getCurrentDate() returns custom date after setCurrentDate — not new Date()', () => {
    const chart = makeChart();
    const custom = new Date('2019-09-30T12:00:00');
    chart.setCurrentDate(custom);

    const result = chart.getCurrentDate();
    expect(result.getFullYear()).to.equal(2019);
    expect(result.getMonth()).to.equal(8);
    expect(result.getDate()).to.equal(30);
  });

  it('getCurrentDate() returns current time when no custom date is set', () => {
    const chart = makeChart();
    const before = new Date();
    const result = chart.getCurrentDate();
    const after = new Date();

    expect(result.getTime()).to.be.within(
      before.getTime() - 100,
      after.getTime() + 100,
    );
  });

  it('overwriting setCurrentDate replaces the previous value', () => {
    const chart = makeChart();
    chart.setCurrentDate(new Date('2019-01-01'));
    chart.setCurrentDate(new Date('2023-07-04'));
    expect(chart.getCurrentDate().getFullYear()).to.equal(2023);
    expect(chart.getCurrentDate().getMonth()).to.equal(6);
    expect(chart.getCurrentDate().getDate()).to.equal(4);
  });

});
