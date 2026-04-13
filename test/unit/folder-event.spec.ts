/**
 * Unit tests for the folder() event handler in src/events.ts.
 *
 * Regression: folder() used `this.vDebug` instead of `ganttObj.vDebug`.
 * Because folder is called as a plain function (not as a method on ganttObj),
 * `this` is undefined in strict mode, throwing:
 *   TypeError: Cannot read properties of undefined (reading 'vDebug')
 *
 * Fixed in PR #399: all three `this.vDebug` references replaced with
 * `ganttObj.vDebug`.
 */

import './helpers';
import { expect } from 'chai';
import { folder } from '../../src/events';

// ─── Minimal ganttObj stub ────────────────────────────────────────────────────

function makeGanttStub(opts: { vDebug?: boolean; open?: number } = {}) {
  const task = {
    _open: opts.open ?? 1,
    _visible: 1,
    getID:         () => 1,
    getParent:     () => 0,
    getGroup:      () => 1,
    getOpen:       function () { return this._open; },
    setOpen:       function (v: number) { this._open = v; },
    getVisible:    function () { return this._visible; },
    setVisible:    function (v: number) { this._visible = v; },
    getGroupSpan:  () => ({ textContent: '-', innerText: '-' }),
    getListChildRow: () => ({ style: { display: '' } }),
    getChildRow:   () => ({ style: { display: '' } }),
    getParItem:    () => null,
  };

  const drawDependenciesCalls: boolean[] = [];

  const ganttObj = {
    vDebug: opts.vDebug ?? false,
    _list: [task],
    getList:            function () { return this._list; },
    clearDependencies:  () => {},
    DrawDependencies:   (debug: boolean) => { drawDependenciesCalls.push(debug); },
    _drawCalls:         drawDependenciesCalls,
  };

  return { ganttObj, task };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('folder() — regression: this.vDebug (PR #399)', () => {

  it('does not throw when called as a plain function (not a method)', () => {
    const { ganttObj } = makeGanttStub();
    // Before the fix this threw: "Cannot read properties of undefined (reading 'vDebug')"
    expect(() => folder(1, ganttObj)).to.not.throw();
  });

  it('does not throw with vDebug: true', () => {
    const { ganttObj } = makeGanttStub({ vDebug: true });
    expect(() => folder(1, ganttObj)).to.not.throw();
  });

  it('passes ganttObj.vDebug=false to DrawDependencies', () => {
    const { ganttObj } = makeGanttStub({ vDebug: false });
    folder(1, ganttObj);
    expect(ganttObj._drawCalls).to.deep.equal([false]);
  });

  it('passes ganttObj.vDebug=true to DrawDependencies', () => {
    const { ganttObj } = makeGanttStub({ vDebug: true });
    folder(1, ganttObj);
    expect(ganttObj._drawCalls).to.deep.equal([true]);
  });

  it('collapses an open group (setOpen 1 → 0)', () => {
    const { ganttObj, task } = makeGanttStub({ open: 1 });
    folder(1, ganttObj);
    expect(task._open).to.equal(0);
  });

  it('expands a closed group (setOpen 0 → 1)', () => {
    const { ganttObj, task } = makeGanttStub({ open: 0 });
    folder(1, ganttObj);
    expect(task._open).to.equal(1);
  });

  it('calls DrawDependencies exactly once per invocation', () => {
    const { ganttObj } = makeGanttStub();
    folder(1, ganttObj);
    folder(1, ganttObj);
    expect(ganttObj._drawCalls).to.have.length(2);
  });
});
