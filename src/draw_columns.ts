import { formatDateStr } from "./utils";
import { addListenerInputCell, addListenerClickCell } from "./events";
import { newNode, makeInput } from "./draw_utils";


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


export const draw_header = function (column, i, vTmpRow, vTaskList, vEditable, vEventsChange, vEvents,
  vDateTaskTableDisplayFormat, vAdditionalHeaders, vFormat, vLangs, vLang, vResources, Draw) {
  let vTmpCell, vTmpDiv;

  if ('vShowRes' == column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gresource');
    const text = makeInput(vTaskList[i].getResource(), vEditable, 'resource', vTaskList[i].getResource(), vResources);
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setResource(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'res', Draw, 'change');
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'res');
  }
  if ('vShowDur' == column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gduration');
    const text = makeInput(vTaskList[i].getDuration(vFormat, vLangs[vLang]), vEditable, 'text', vTaskList[i].getDuration());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setDuration(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'dur', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'dur');
  }
  if ('vShowComp' == column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gpccomplete');
    const text = makeInput(vTaskList[i].getCompStr(), vEditable, 'percentage', vTaskList[i].getCompVal());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => { task.setComp(e.target.value); task.setCompVal(e.target.value); }
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'comp', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'comp');
  }
  if ('vShowStartDate' == column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gstartdate');
    const v = formatDateStr(vTaskList[i].getStart(), vDateTaskTableDisplayFormat, vLangs[vLang]);
    const text = makeInput(v, vEditable, 'date', vTaskList[i].getStart());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setStart(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'start', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'start');
  }
  if ('vShowEndDate' == column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'genddate');
    const v = formatDateStr(vTaskList[i].getEnd(), vDateTaskTableDisplayFormat, vLangs[vLang]);
    const text = makeInput(v, vEditable, 'date', vTaskList[i].getEnd());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setEnd(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'end', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'end');
  }
  if ('vShowPlanStartDate' == column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gplanstartdate');
    const v = vTaskList[i].getPlanStart() ? formatDateStr(vTaskList[i].getPlanStart(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
    const text = makeInput(v, vEditable, 'date', vTaskList[i].getPlanStart());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setPlanStart(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'planstart', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planstart');
  }
  if ('vShowPlanEndDate' == column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gplanenddate');
    const v = vTaskList[i].getPlanEnd() ? formatDateStr(vTaskList[i].getPlanEnd(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
    const text = makeInput(v, vEditable, 'date', vTaskList[i].getPlanEnd());
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setPlanEnd(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'planend', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planend');
  }
  if ('vShowCost' == column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gcost');
    const text = makeInput(vTaskList[i].getCost(), vEditable, 'cost');
    vTmpDiv = newNode(vTmpCell, 'div', null, null, text);
    const callback = (task, e) => task.setCost(e.target.value);
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'cost', Draw);
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'cost');
  }


  if ('vAdditionalHeaders' == column && vAdditionalHeaders) {
    for (const key in vAdditionalHeaders) {
      const header = vAdditionalHeaders[key];
      const css = header.class ? header.class : `gadditional-${key}`;
      const data = vTaskList[i].getDataObject();
      if (data) {
        vTmpCell = newNode(vTmpRow, 'td', null, `gadditional ${css}`);
      }
      // const callback = (task, e) => task.setCost(e.target.value);
      // addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'costdate');
      vTmpDiv = newNode(vTmpCell, 'div', null, null, data ? data[key] : '');
    }
  }

  if ('vShowAddEntries' == column) {
    vTmpCell = newNode(vTmpRow, 'td', null, 'gaddentries');
    const button = "<button>+</button>";
    vTmpDiv = newNode(vTmpCell, 'div', null, null, button);

    const callback = (task, e) => {
      vTaskList.push({

      });
    }
    addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'addentries', Draw.bind(this));
    addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'addentries');
  }
};

export const draw_bottom = function (column, vTmpRow, vAdditionalHeaders) {
  if ('vShowRes' == column) newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
  if ('vShowDur' == column) newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');  
  if ('vShowComp' == column) newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
  if ('vShowStartDate' == column) newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
  if ('vShowEndDate' == column) newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');
  if ('vShowPlanStartDate' == column) newNode(vTmpRow, 'td', null, 'gspanning gplanstartdate', '\u00A0');
  if ('vShowPlanEndDate' == column) newNode(vTmpRow, 'td', null, 'gspanning gplanenddate', '\u00A0');
  if ('vShowCost' == column) newNode(vTmpRow, 'td', null, 'gspanning gcost', '\u00A0');

  if ('vAdditionalHeaders' == column && vAdditionalHeaders) {
    for (const key in vAdditionalHeaders) {
      const header = vAdditionalHeaders[key];
      const css = header.class ? header.class : `gadditional-${key}`;
      newNode(vTmpRow, 'td', null, `gspanning gadditional ${css}`, '\u00A0');
    }
  }

  if ('vShowAddEntries' == column) newNode(vTmpRow, 'td', null, 'gspanning gaddentries', '\u00A0');
}

export const draw_list_headings = function (column, vTmpRow, vAdditionalHeaders) {

  if ('vShowRes' == column) newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
  if ('vShowDur' == column) newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');
  if ('vShowComp' == column) newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
  if ('vShowStartDate' == column) newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
  if ('vShowEndDate' == column) newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');
  if ('vShowPlanStartDate' == column) newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
  if ('vShowPlanEndDate' == column) newNode(vTmpRow, 'td', null, 'gspanning gplanenddate', '\u00A0');
  if ('vShowCost' == column) newNode(vTmpRow, 'td', null, 'gspanning gcost', '\u00A0');
  if ('vAdditionalHeaders' == column && vAdditionalHeaders) {
    for (const key in vAdditionalHeaders) {
      const header = vAdditionalHeaders[key];
      const css = header.class ? header.class : `gadditional-${key}`;
      newNode(vTmpRow, 'td', null, `gspanning gadditional ${css}`, '\u00A0');
    }
  }
  if ('vShowAddEntries' == column) newNode(vTmpRow, 'td', null, 'gspanning gaddentries', '\u00A0');
}

export const draw_task_headings = function (column, vTmpRow, vLangs, vLang, vAdditionalHeaders) {

  if ('vShowRes' == column) newNode(vTmpRow, 'td', null, 'gtaskheading gresource', vLangs[vLang]['resource']);
  if ('vShowDur' == column) newNode(vTmpRow, 'td', null, 'gtaskheading gduration', vLangs[vLang]['duration']);
  if ('vShowComp' == column) newNode(vTmpRow, 'td', null, 'gtaskheading gpccomplete', vLangs[vLang]['comp']);
  if ('vShowStartDate' == column) newNode(vTmpRow, 'td', null, 'gtaskheading gstartdate', vLangs[vLang]['startdate']);
  if ('vShowEndDate' == column) newNode(vTmpRow, 'td', null, 'gtaskheading genddate', vLangs[vLang]['enddate']);
  if ('vShowPlanStartDate' == column) newNode(vTmpRow, 'td', null, 'gtaskheading gplanstartdate', vLangs[vLang]['planstartdate']);
  if ('vShowPlanEndDate' == column) newNode(vTmpRow, 'td', null, 'gtaskheading gplanenddate', vLangs[vLang]['planenddate']);
  if ('vShowCost' == column) newNode(vTmpRow, 'td', null, 'gtaskheading gcost', vLangs[vLang]['cost']);
  if ('vAdditionalHeaders' == column && vAdditionalHeaders) {
    for (const key in vAdditionalHeaders) {
      const header = vAdditionalHeaders[key];
      const text = header.translate ? vLangs[vLang][header.translate] : header.title;
      const css = header.class ? header.class : `gadditional-${key}`;
      newNode(vTmpRow, 'td', null, `gtaskheading gadditional ${css}`, text);
    }
  }
  if ('vShowAddEntries' == column) newNode(vTmpRow, 'td', null, 'gtaskheading gaddentries', vLangs[vLang]['addentries']);
}
