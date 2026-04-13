/**
 * Shared test helpers for unit tests.
 *
 * Import this module BEFORE any src imports so the DOM shim is installed
 * before TypeScript module initialisation runs.
 *
 *   import '../helpers';           // must be first
 *   import { TaskItem } from '../../src/task';
 */

// ─── Minimal DOM shim ────────────────────────────────────────────────────────
// TaskItem uses document.createTextNode / createElement to sanitise values.
// In a real browser this strips HTML; here we provide the minimum surface area
// needed to construct a TaskItem without a real browser.

function makeTextNode(val: any) {
  return {
    data: String(val == null ? '' : val),
    nodeName: '#text',
    childNodes: [] as any[],
    hasChildNodes() { return false; },
  };
}

function makeElement(tag: string) {
  const el: any = {
    nodeName: tag.toUpperCase(),
    className: '',
    innerHTML: '',
    childNodes: [] as any[],
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

// ─── TaskItem factory ─────────────────────────────────────────────────────────
// Pass Date objects so the constructor takes the `instanceof Date` fast-path,
// bypassing parseDateStr / document.createTextNode on the date strings.

import { TaskItem } from '../../src/task';
import { hashString } from '../../src/utils/general_utils';

const mockGantt = {
  getDateInputFormat: () => 'yyyy-mm-dd',
  hashString,
};

export interface TaskOpts {
  id: number;
  parent: number;
  start?: Date;
  end?: Date;
  planStart?: Date;
  planEnd?: Date;
  group?: number;
  name?: string;
  depend?: string;
}

export function makeTask(opts: TaskOpts): any {
  return new (TaskItem as any)(
    opts.id,
    opts.name || ('task-' + opts.id),
    opts.start     || '',   // '' → vStart stays null → hasStart() === false
    opts.end       || '',
    'gtaskblue',
    '',                     // pLink
    0,                      // pMile
    '',                     // pRes
    0,                      // pComp
    opts.group     || 0,
    opts.parent,
    1,                      // pOpen
    opts.depend    || null, // pDepend
    '',                     // pCaption
    '',                     // pNotes
    mockGantt,
    0,                      // pCost
    opts.planStart || null,
    opts.planEnd   || null,
  );
}
