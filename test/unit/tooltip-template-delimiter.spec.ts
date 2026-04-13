/**
 * Unit tests for issue #346 — configurable tooltip template delimiters.
 *
 * By default the tooltip template uses {{ }} which conflicts with Django's
 * template engine. setTooltipTemplateDelimiter(open, close) lets users swap
 * the delimiters to any pair of strings.
 */

import { expect } from 'chai';
import { createTaskInfo, TaskItem } from '../../src/task';
import { hashString } from '../../src/utils/general_utils';

// ─── Mock DOM helpers ─────────────────────────────────────────────────────────

function makeTextNode(val: any) {
  return { _type: 'text', data: String(val == null ? '' : val), childNodes: [] as any[] };
}

function makeElement(tag: string): any {
  const children: any[] = [];
  let _inner = '';
  const el: any = {
    _type: 'element',
    nodeName: tag.toUpperCase(),
    className: '',
    childNodes: children,
    style: {},
    id: '',
    colSpan: 0,
    appendChild(child: any) { children.push(child); return child; },
    setAttribute(_name: string, _val: any) {},
    insertAdjacentHTML(_pos: string, html: string) {
      children.push({ _type: 'raw', html });
    },
    hasChildNodes() { return children.length > 0; },
    replaceChild(newNode: any, oldNode: any) {
      const idx = children.indexOf(oldNode);
      if (idx !== -1) children[idx] = newNode;
    },
  };
  Object.defineProperty(el, 'innerHTML', {
    get() { return _inner; },
    set(v: string) { _inner = v; if (v === '') children.length = 0; },
  });
  return el;
}

function makeFragment(): any {
  const children: any[] = [];
  return {
    _type: 'fragment',
    childNodes: children,
    appendChild(child: any) { children.push(child); return child; },
  };
}

/** Recursively collect all text-node data from a mock DOM node. */
function textContent(node: any): string {
  if (!node) return '';
  if (node._type === 'text') return node.data;
  return (node.childNodes || []).map(textContent).join('');
}

/** Find the first node (BFS) whose className includes the given class. */
function findByClass(node: any, cls: string): any {
  if (node.className && node.className.includes(cls)) return node;
  for (const child of node.childNodes || []) {
    const found = findByClass(child, cls);
    if (found) return found;
  }
  return null;
}

// ─── Minimal GanttChart context ───────────────────────────────────────────────

function makeTask(name: string): any {
  return new (TaskItem as any)(
    1, name, '', '', 'gtaskblue', '', 0, '', 0, 0, 0, 1, null, '', '', {
      getDateInputFormat: () => 'yyyy-mm-dd',
      hashString,
    }, 0, null, null,
  );
}

const mockChart: any = {
  vLang: 'en',
  vLangs: { en: {} },
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('createTaskInfo — tooltip template delimiters', () => {
  // Patch global.document to add createDocumentFragment (not in helpers.ts shim).
  // We save and restore around the suite so other tests are unaffected.
  let savedDoc: any;
  before(() => {
    savedDoc = (global as any).document;
    (global as any).document = {
      createTextNode: makeTextNode,
      createElement:  makeElement,
      createDocumentFragment: makeFragment,
    };
  });
  after(() => {
    (global as any).document = savedDoc;
  });

  it('default {{ }} delimiters substitute pName', () => {
    const task = makeTask('My Task');
    const { component } = createTaskInfo.call(mockChart, task, '{{pName}}');
    const span = findByClass(component, 'gTtTemplate');
    expect(textContent(span)).to.equal('My Task');
  });

  it('custom delimiters {[ ]} substitute pName', () => {
    const task = makeTask('Django Task');
    const { component } = createTaskInfo.call(mockChart, task, '{[pName]}', '{[', ']}');
    const span = findByClass(component, 'gTtTemplate');
    expect(textContent(span)).to.equal('Django Task');
  });

  it('default delimiters do NOT match a custom-delimited template', () => {
    const task = makeTask('Should Not Match');
    const { component } = createTaskInfo.call(mockChart, task, '{[pName]}');
    const span = findByClass(component, 'gTtTemplate');
    expect(textContent(span)).to.equal('{[pName]}');
  });

  it('custom delimiters do NOT match a default-delimited template', () => {
    const task = makeTask('Should Not Match');
    const { component } = createTaskInfo.call(mockChart, task, '{{pName}}', '{[', ']}');
    const span = findByClass(component, 'gTtTemplate');
    expect(textContent(span)).to.equal('{{pName}}');
  });
});
