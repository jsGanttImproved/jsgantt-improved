/**
 * Unit tests for PR #394 — GetTaskByOriginalID + RemoveTaskItem accepting original IDs.
 *
 * After tasks are loaded via parseXMLString / parseJSONString the internal vID
 * (a hash of the original pID) differs from the original string.  These tests
 * verify that:
 *   - AddTaskItem returns the internal vID
 *   - GetTaskByOriginalID looks up a task by its pre-hash ID
 *   - RemoveTaskItem accepts original IDs as well as internal vIDs
 *   - Child removal still works recursively when the parent is addressed by original ID
 */

import './helpers';   // DOM shim — must be first
import { expect } from 'chai';
import { makeTask } from './helpers';
import { AddTaskItem, RemoveTaskItem, GetTaskByOriginalID } from '../../src/task';
import { hashString } from '../../src/utils/general_utils';

function h(id: string | number) {
  return hashString(String(id)).toString();
}

/** Minimal GanttChart-like context that binds the three task-management functions. */
function makeChart() {
  const chart: any = {
    vTaskList: [] as any[],
    vProcessNeeded: false,
  };
  chart.AddTaskItem       = AddTaskItem.bind(chart);
  chart.RemoveTaskItem    = RemoveTaskItem.bind(chart);
  chart.GetTaskByOriginalID = GetTaskByOriginalID.bind(chart);
  return chart;
}

// ─── AddTaskItem ──────────────────────────────────────────────────────────────

describe('AddTaskItem — return value', () => {
  it('returns the internal (hashed) vID', () => {
    const chart = makeChart();
    const task  = makeTask({ id: 100, parent: 0 });
    const vID   = chart.AddTaskItem(task);
    // getID() returns a number; compare as string to h() which also stringifies
    expect(String(vID)).to.equal(h('100'));
  });

  it('adds the task to vTaskList', () => {
    const chart = makeChart();
    chart.AddTaskItem(makeTask({ id: 101, parent: 0 }));
    expect(chart.vTaskList).to.have.length(1);
  });

  it('does not add the same task twice (idempotent)', () => {
    const chart = makeChart();
    const task  = makeTask({ id: 102, parent: 0 });
    chart.AddTaskItem(task);
    chart.AddTaskItem(task);
    expect(chart.vTaskList).to.have.length(1);
  });
});

// ─── GetTaskByOriginalID ──────────────────────────────────────────────────────

describe('GetTaskByOriginalID', () => {
  it('returns the task when the original ID matches', () => {
    const chart = makeChart();
    const task  = makeTask({ id: 200, parent: 0 });
    chart.AddTaskItem(task);
    const found = chart.GetTaskByOriginalID('200');
    expect(found).to.not.equal(null);
    expect(found.getOriginalID()).to.equal('200');
  });

  it('accepts a numeric argument (coerces to string)', () => {
    const chart = makeChart();
    const task  = makeTask({ id: 201, parent: 0 });
    chart.AddTaskItem(task);
    expect(chart.GetTaskByOriginalID(201)).to.not.equal(null);
  });

  it('returns null when no task has that original ID', () => {
    const chart = makeChart();
    chart.AddTaskItem(makeTask({ id: 202, parent: 0 }));
    expect(chart.GetTaskByOriginalID('999')).to.equal(null);
  });

  it('returns null on an empty task list', () => {
    const chart = makeChart();
    expect(chart.GetTaskByOriginalID('1')).to.equal(null);
  });

  it('does not match a task by its internal hashed ID', () => {
    const chart = makeChart();
    const task  = makeTask({ id: 203, parent: 0 });
    chart.AddTaskItem(task);
    // The hashed ID is NOT the original ID — should not match
    expect(chart.GetTaskByOriginalID(h('203'))).to.equal(null);
  });
});

// ─── RemoveTaskItem with original IDs ─────────────────────────────────────────

describe('RemoveTaskItem — accepts original IDs', () => {
  it('marks a task for deletion when called with its original string ID', () => {
    const chart = makeChart();
    const task  = makeTask({ id: 300, parent: 0 });
    chart.AddTaskItem(task);
    chart.RemoveTaskItem('300');
    expect(task.getToDelete()).to.equal(true);
  });

  it('still works when called with the internal vID (backwards-compat)', () => {
    const chart = makeChart();
    const task  = makeTask({ id: 301, parent: 0 });
    chart.AddTaskItem(task);
    chart.RemoveTaskItem(h('301'));   // pass the hashed ID as before
    expect(task.getToDelete()).to.equal(true);
  });

  it('sets vProcessNeeded to true after removal', () => {
    const chart = makeChart();
    chart.vProcessNeeded = false;
    chart.AddTaskItem(makeTask({ id: 302, parent: 0 }));
    chart.RemoveTaskItem('302');
    expect(chart.vProcessNeeded).to.equal(true);
  });

  it('does not throw when the ID does not match any task', () => {
    const chart = makeChart();
    chart.AddTaskItem(makeTask({ id: 303, parent: 0 }));
    expect(() => chart.RemoveTaskItem('NONEXISTENT')).to.not.throw();
  });
});

// ─── Recursive child removal ──────────────────────────────────────────────────

describe('RemoveTaskItem — recursive child removal via original ID', () => {
  it('also marks child tasks for deletion when parent is removed by original ID', () => {
    const chart  = makeChart();
    const parent = makeTask({ id: 400, parent: 0, group: 1 });
    // Pass the original parent ID (400); TaskItem hashes it internally, matching the parent's vID
    const child  = makeTask({ id: 401, parent: 400 });

    chart.AddTaskItem(parent);
    chart.AddTaskItem(child);

    chart.RemoveTaskItem('400');   // use the original string ID

    expect(parent.getToDelete()).to.equal(true);
    expect(child.getToDelete()).to.equal(true);
  });

  it('recursive removal also works when parent is addressed by internal vID', () => {
    const chart  = makeChart();
    const parent = makeTask({ id: 410, parent: 0, group: 1 });
    const child  = makeTask({ id: 411, parent: 410 });

    chart.AddTaskItem(parent);
    chart.AddTaskItem(child);

    chart.RemoveTaskItem(h('410'));   // internal vID — classic usage

    expect(parent.getToDelete()).to.equal(true);
    expect(child.getToDelete()).to.equal(true);
  });
});
