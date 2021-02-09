import { formatDateStr } from './utils/date_utils';
import { AddTaskItemObject } from './task';
import { addListenerInputCell, addListenerClickCell } from './events';
import { newNode, makeInput } from './utils/draw_utils';

export const COLUMN_ORDER = [
  'vShowRes',
  'vShowDur',
  'vShowComp',
  'vShowStartDate',
  'vShowEndDate',
  'vShowPlanStartDate',
  'vShowPlanEndDate',
  'vShowCost',
  'vAdditionalHeaders',
  'vShowAddEntries'
];

const COLUMNS_TYPES = {
  'vShowRes': 'res',
  'vShowDur': 'dur',
  'vShowComp': 'comp',
  'vShowStartDate': 'startdate',
  'vShowEndDate': 'enddate',
  'vShowPlanStartDate': 'planstartdate',
  'vShowPlanEndDate': 'planenddate',
  'vShowCost': 'cost',
  'vShowAddEntries': 'addentries'
}

export const draw_header = function (column, i, vTmpRow, vTaskList, vEditable, vEventsChange, vEvents,
  vDateTaskTableDisplayFormat, vAdditionalHeaders, vFormat, vLangs, vLang, vResources, Draw) {
  let vTmpCell, vTmpDiv;

  if ('vShowRes' === column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gres');
    const text = makeInput(vTaskList[i].getResource(), vEditable, 'resource', vTaskList[i].getResource(), vResources);
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setResource(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'res', Draw, 'change');
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'res');
  }
  if ('vShowDur' === column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gdur');
    const text = makeInput(vTaskList[i].getDuration(vFormat, vLangs[vLang]), vEditable, 'text', vTaskList[i].getDuration());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setDuration(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'dur', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'dur');
  }
  if ('vShowComp' === column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gcomp');
    const text = makeInput(vTaskList[i].getCompStr(), vEditable, 'percentage', vTaskList[i].getCompVal());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => { task.setComp(e.target.value); task.setCompVal(e.target.value); }
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'comp', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'comp');
  }
  if ('vShowStartDate' === column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gstartdate');
    const v = formatDateStr(vTaskList[i].getStartVar(), vDateTaskTableDisplayFormat, vLangs[vLang]);
    const text = makeInput(v, vEditable, 'date', vTaskList[i].getStartVar());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setStart(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'start', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'start');
  }
  if ('vShowEndDate' === column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'genddate');
    const v = formatDateStr(vTaskList[i].getEndVar(), vDateTaskTableDisplayFormat, vLangs[vLang]);
    const text = makeInput(v, vEditable, 'date', vTaskList[i].getEndVar());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setEnd(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'end', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'end');
  }
  if ('vShowPlanStartDate' === column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gplanstartdate');
    const v = vTaskList[i].getPlanStart() ? formatDateStr(vTaskList[i].getPlanStart(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
    const text = makeInput(v, vEditable, 'date', vTaskList[i].getPlanStart());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setPlanStart(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'planstart', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planstart');
  }
  if ('vShowPlanEndDate' === column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gplanenddate');
    const v = vTaskList[i].getPlanEnd() ? formatDateStr(vTaskList[i].getPlanEnd(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
    const text = makeInput(v, vEditable, 'date', vTaskList[i].getPlanEnd());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setPlanEnd(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'planend', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planend');
  }
  if ('vShowCost' === column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gcost');
    const text = makeInput(vTaskList[i].getCost(), vEditable, 'cost');
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setCost(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'cost', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'cost');
  }

  if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
    for (const key in vAdditionalHeaders) {
      const header = vAdditionalHeaders[key];
      const css = header.class ? header.class : `gadditional-${key}`;
      const data = vTaskList[i].getDataObject();
      vTmpCell = newNode(vTmpRow, 'td', null, `gadditional ${css}`);
      vTmpDiv = newNode(vTmpCell, 'div', null, null, data ? data[key] : '');
      addListenerClickCell(vTmpCell, vEvents, vTaskList[i], `additional_${key}`);
      // const callback = (task, e) => task.setCost(e.target.value);
      // addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'costdate');
    }
  }

  if ('vShowAddEntries' === column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gaddentries');
    const button = "<button>+</button>";
    vTmpDiv = newNode(vTmpCell, 'div', null, null, button);

    const callback = (task, e) => {
      AddTaskItemObject({
        vParent: task.getParent()
      });
    }
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'addentries', Draw.bind(this));
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'addentries');
  }
};

export const draw_bottom = function (column, vTmpRow, vAdditionalHeaders) {
  if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
    for (const key in vAdditionalHeaders) {
      const header = vAdditionalHeaders[key];
      const css = header.class ? header.class : `gadditional-${key}`;
      newNode(vTmpRow, 'td', null, `gspanning gadditional ${css}`, '\u00A0');
    }
  } else {
    const type = COLUMNS_TYPES[column];
    newNode(vTmpRow, 'td', null, `gspanning g${type}`, '\u00A0');
  }
}

// export const draw_list_headings = function (column, vTmpRow, vAdditionalHeaders, vEvents) {
//   let nodeCreated;
//   if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
//     for (const key in vAdditionalHeaders) {
//       const header = vAdditionalHeaders[key];
//       const css = header.class ? header.class : `gadditional-${key}`;
//       newNode(vTmpRow, 'td', null, `gspanning gadditional ${css}`, '\u00A0');
//     }
//   } else {
//     const type = COLUMNS_TYPES[column];
//     nodeCreated = newNode(vTmpRow, 'td', null, `gspanning g${type}`, '\u00A0');
//     addListenerClickCell(nodeCreated, vEvents, { hader: true, column }, type);
//   }
// }

export const draw_task_headings = function (column, vTmpRow, vLangs, vLang, vAdditionalHeaders, vEvents) {
  let nodeCreated;
  if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
    for (const key in vAdditionalHeaders) {
      const header = vAdditionalHeaders[key];
      const text = header.translate ? vLangs[vLang][header.translate] : header.title;
      const css = header.class ? header.class : `gadditional-${key}`;
      nodeCreated = newNode(vTmpRow, 'td', null, `gtaskheading gadditional ${css}`, text);
    }
  }
  else {
    const type = COLUMNS_TYPES[column];
    nodeCreated = newNode(vTmpRow, 'td', null, `gtaskheading g${type}`, vLangs[vLang][type]);
    addListenerClickCell(nodeCreated, vEvents, { hader: true, column }, type);
  }
}
