/**
 * Unit tests for GanttChart constructor — jQuery-element normalisation.
 *
 * Issue #344: passing a jQuery-wrapped element threw "hasChildNodes is not a
 * function" because pDiv[0] (the real Element) was never unwrapped.
 *
 * PR #393 fixes this with the guard:
 *   this.vDiv = (pDiv && pDiv[0] instanceof Element) ? pDiv[0] : pDiv;
 */

import './helpers';   // DOM shim — must be first
import { expect } from 'chai';

// GanttChart is exported as a plain constructor function.
import { GanttChart } from '../../src/draw';

// ─── Minimal fake DOM element ─────────────────────────────────────────────────
// The shim in helpers.ts installs document.createElement / createTextNode so
// that TaskItem works.  GanttChart only stores pDiv in this.vDiv, so a plain
// object that satisfies `instanceof Element` suffices.

function makeFakeElement(): Element {
  // jsdom is not available; create a minimal stand-in that IS an Element by
  // delegating through the global.Element constructor set up in the shim.
  // However, `instanceof Element` requires the *global* Element constructor.
  // We set one up below so tests are self-contained.
  return new (global as any).Element();
}

// Install a minimal Element constructor in the global scope so that
// `pDiv[0] instanceof Element` works inside GanttChart.
before(function () {
  if (!(global as any).Element) {
    (global as any).Element = class Element {
      nodeName = 'DIV';
      className = '';
      childNodes: any[] = [];
      hasChildNodes() { return this.childNodes.length > 0; }
    };
  }
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('GanttChart constructor — pDiv normalisation (issue #344)', () => {

  it('stores a plain DOM element unchanged', () => {
    const el = makeFakeElement();
    const chart = new (GanttChart as any)(el, 'week');
    expect(chart.vDiv).to.equal(el);
  });

  it('unwraps a jQuery-like object (pDiv[0] instanceof Element)', () => {
    const el = makeFakeElement();
    // Simulate a jQuery wrapper: array-like with [0] pointing to the element.
    const jqueryLike = { 0: el, length: 1 };
    const chart = new (GanttChart as any)(jqueryLike, 'week');
    expect(chart.vDiv).to.equal(el,
      'vDiv should be the unwrapped DOM element, not the jQuery wrapper');
  });

  it('does NOT unwrap when pDiv[0] is not an Element', () => {
    // e.g. someone passes an arbitrary array-like whose [0] is a string
    const notAnElement = { 0: 'string-value', length: 1 };
    const chart = new (GanttChart as any)(notAnElement, 'week');
    expect(chart.vDiv).to.equal(notAnElement,
      'vDiv should remain unchanged when [0] is not an Element');
  });

  it('handles null pDiv without throwing', () => {
    expect(() => new (GanttChart as any)(null, 'week')).to.not.throw();
    const chart = new (GanttChart as any)(null, 'week');
    expect(chart.vDiv).to.equal(null);
  });

  it('handles undefined pDiv without throwing', () => {
    expect(() => new (GanttChart as any)(undefined, 'week')).to.not.throw();
    const chart = new (GanttChart as any)(undefined, 'week');
    // undefined is falsy → guard short-circuits → vDiv stays undefined
    expect(chart.vDiv).to.equal(undefined);
  });

  it('stores the format string in vFormat', () => {
    const el = makeFakeElement();
    const chart = new (GanttChart as any)(el, 'month');
    expect(chart.vFormat).to.equal('month');
  });

  it('stores the correct format when a jQuery wrapper is passed', () => {
    const el = makeFakeElement();
    const jqueryLike = { 0: el, length: 1 };
    const chart = new (GanttChart as any)(jqueryLike, 'day');
    expect(chart.vFormat).to.equal('day');
  });
});
