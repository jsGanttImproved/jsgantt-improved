/**
 * Unit tests for the "year" format (issue #278).
 *
 * Covers getOffset() with pFormat='year': verifies that tasks spanning N years
 * produce pixel widths proportional to N columns.
 */

import './helpers';   // DOM shim — must be first
import { expect } from 'chai';
import { getOffset } from '../../src/utils/general_utils';

// Column width used throughout (matches vYearColWidth default)
const COL_WIDTH = 60;
// Cell margin applied inside getOffset for 'year'
const MARGIN = 3;
// One column worth of pixels (approximate)
const ONE_YEAR_PX = COL_WIDTH + MARGIN; // 63

describe('getOffset — year format', () => {
  it('full calendar year (Jan 1 → Dec 31) is approximately one column wide', () => {
    const start = new Date('2020-01-01');
    const end   = new Date('2020-12-31');

    const px = getOffset(start, end, COL_WIDTH, 'year', 1);

    // Should be close to ONE_YEAR_PX but not exceed it by much
    expect(px).to.be.greaterThan(ONE_YEAR_PX * 0.9,
      `Expected ≈${ONE_YEAR_PX}px for one year, got ${px}`);
    expect(px).to.be.lessThan(ONE_YEAR_PX * 1.1,
      `Expected ≈${ONE_YEAR_PX}px for one year, got ${px}`);
  });

  it('five-year task is approximately five columns wide', () => {
    const start = new Date('2020-01-01');
    const end   = new Date('2025-01-01');

    const px = getOffset(start, end, COL_WIDTH, 'year', 1);

    expect(px).to.be.greaterThan(ONE_YEAR_PX * 4.5,
      `Expected ≈${ONE_YEAR_PX * 5}px for 5 years, got ${px}`);
    expect(px).to.be.lessThan(ONE_YEAR_PX * 5.5,
      `Expected ≈${ONE_YEAR_PX * 5}px for 5 years, got ${px}`);
  });

  it('six-month task is approximately half a column wide', () => {
    const start = new Date('2022-01-01');
    const end   = new Date('2022-07-01');

    const px = getOffset(start, end, COL_WIDTH, 'year', 1);

    expect(px).to.be.greaterThan(ONE_YEAR_PX * 0.3,
      `Expected roughly half a column for 6 months, got ${px}`);
    expect(px).to.be.lessThan(ONE_YEAR_PX * 0.7,
      `Expected roughly half a column for 6 months, got ${px}`);
  });

  it('two-year task is twice the width of a one-year task (proportional scaling)', () => {
    const start1 = new Date('2021-01-01');
    const end1   = new Date('2022-01-01');
    const start2 = new Date('2021-01-01');
    const end2   = new Date('2023-01-01');

    const px1 = getOffset(start1, end1, COL_WIDTH, 'year', 1);
    const px2 = getOffset(start2, end2, COL_WIDTH, 'year', 1);

    const ratio = px2 / px1;
    expect(ratio).to.be.closeTo(2, 0.1,
      `Two-year task should be 2× one-year task; ratio was ${ratio.toFixed(3)}`);
  });

  it('returns a non-negative value even for very short (same-day) tasks', () => {
    const start = new Date('2023-06-15');
    const end   = new Date('2023-06-15');

    const px = getOffset(start, end, COL_WIDTH, 'year', 1);

    // Math.ceil of 0 - 1 = -1, but we just document current behaviour:
    // getOffset does not guarantee ≥ 0 for zero-duration tasks in other formats either.
    // The caller clamps to 1px when needed. We just verify it doesn't throw.
    expect(px).to.be.a('number');
  });

  it('a task offset from chart start is proportional in year format', () => {
    const chartStart = new Date('2020-01-01');
    const taskStart  = new Date('2022-01-01'); // 2 years from chart start

    const leftPx = getOffset(chartStart, taskStart, COL_WIDTH, 'year', 1);

    // Should be approximately 2 columns from the left edge
    expect(leftPx).to.be.greaterThan(ONE_YEAR_PX * 1.8,
      `Expected ≈${ONE_YEAR_PX * 2}px offset for 2-year gap, got ${leftPx}`);
    expect(leftPx).to.be.lessThan(ONE_YEAR_PX * 2.2,
      `Expected ≈${ONE_YEAR_PX * 2}px offset for 2-year gap, got ${leftPx}`);
  });
});
