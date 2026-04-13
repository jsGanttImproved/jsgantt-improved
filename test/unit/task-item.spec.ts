/**
 * Unit tests for TaskItem accessor methods.
 */

import './helpers';   // DOM shim — must be first
import { expect } from 'chai';
import { makeTask } from './helpers';
import { hashString } from '../../src/utils/general_utils';

function h(id: string | number) {
  return hashString(String(id)).toString();
}

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

  it('returns true when only plan dates are provided', () => {
    const task = makeTask({
      id: 3,
      parent: 0,
      planStart: new Date('2027-01-01'),
      planEnd:   new Date('2027-01-31'),
    });
    expect(task.hasStart()).to.equal(true);
    expect(task.hasEnd()).to.equal(true);
  });

  it('getStart() on a dateless task still returns a Date (backwards compat)', () => {
    const task = makeTask({ id: 4, parent: 0 });
    expect(task.getStart()).to.be.instanceOf(Date);
    expect(task.getEnd()).to.be.instanceOf(Date);
  });

  it('getStart() returns the explicit start date when set', () => {
    const start = new Date('2027-06-15');
    const task  = makeTask({ id: 5, parent: 0, start, end: new Date('2027-06-30') });
    expect(task.getStart().getTime()).to.equal(start.getTime());
  });
});

describe('TaskItem.setDepend', () => {
  it('constructor with no depend initialises empty arrays', () => {
    const task = makeTask({ id: 10, parent: 0 });
    expect(task.getDepend()).to.deep.equal([]);
    expect(task.getDepType()).to.deep.equal([]);
  });

  it('constructor with pDepend parses a single FS dependency', () => {
    const task = makeTask({ id: 11, parent: 0, depend: '2FS' });
    expect(task.getDepend()).to.deep.equal([h('2')]);
    expect(task.getDepType()).to.deep.equal(['FS']);
  });

  it('constructor with pDepend parses multiple dependencies', () => {
    const task = makeTask({ id: 12, parent: 0, depend: '2FS,5SS' });
    expect(task.getDepend()).to.deep.equal([h('2'), h('5')]);
    expect(task.getDepType()).to.deep.equal(['FS', 'SS']);
  });

  it('setDepend replaces a single dependency', () => {
    const task = makeTask({ id: 13, parent: 0, depend: '2FS' });
    task.setDepend('7FF');
    expect(task.getDepend()).to.deep.equal([h('7')]);
    expect(task.getDepType()).to.deep.equal(['FF']);
  });

  it('setDepend sets multiple dependencies at once', () => {
    const task = makeTask({ id: 14, parent: 0 });
    task.setDepend('3SS,8SF');
    expect(task.getDepend()).to.deep.equal([h('3'), h('8')]);
    expect(task.getDepType()).to.deep.equal(['SS', 'SF']);
  });

  it('setDepend with no type suffix defaults to FS', () => {
    const task = makeTask({ id: 15, parent: 0 });
    task.setDepend('4');
    expect(task.getDepend()).to.deep.equal([h('4')]);
    expect(task.getDepType()).to.deep.equal(['FS']);
  });

  it('setDepend(null) clears all dependencies', () => {
    const task = makeTask({ id: 16, parent: 0, depend: '2FS' });
    task.setDepend(null);
    expect(task.getDepend()).to.deep.equal([]);
    expect(task.getDepType()).to.deep.equal([]);
  });

  it('setDepend("") clears all dependencies', () => {
    const task = makeTask({ id: 17, parent: 0, depend: '2FS' });
    task.setDepend('');
    expect(task.getDepend()).to.deep.equal([]);
    expect(task.getDepType()).to.deep.equal([]);
  });

  it('setDepend can be called multiple times and always reflects the latest value', () => {
    const task = makeTask({ id: 18, parent: 0, depend: '2FS' });
    task.setDepend('3SS');
    expect(task.getDepend()).to.deep.equal([h('3')]);
    task.setDepend('9FF,1FS');
    expect(task.getDepend()).to.deep.equal([h('9'), h('1')]);
    expect(task.getDepType()).to.deep.equal(['FF', 'FS']);
  });
});
