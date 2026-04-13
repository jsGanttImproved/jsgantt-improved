/**
 * Unit tests for TaskItem accessor methods.
 */

import './helpers';   // DOM shim — must be first
import { expect } from 'chai';
import { makeTask } from './helpers';

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
