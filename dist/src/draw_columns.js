"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var date_utils_1 = require("./utils/date_utils");
var task_1 = require("./task");
var events_1 = require("./events");
var draw_utils_1 = require("./utils/draw_utils");
exports.COLUMN_ORDER = [
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
exports.draw_header = function (column, i, vTmpRow, vTaskList, vEditable, vEventsChange, vEvents, vDateTaskTableDisplayFormat, vAdditionalHeaders, vFormat, vLangs, vLang, vResources, Draw) {
    var vTmpCell, vTmpDiv;
    if ('vShowRes' == column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gresource');
        var text = draw_utils_1.makeInput(vTaskList[i].getResource(), vEditable, 'resource', vTaskList[i].getResource(), vResources);
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setResource(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'res', Draw, 'change');
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'res');
    }
    if ('vShowDur' == column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gduration');
        var text = draw_utils_1.makeInput(vTaskList[i].getDuration(vFormat, vLangs[vLang]), vEditable, 'text', vTaskList[i].getDuration());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setDuration(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'dur', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'dur');
    }
    if ('vShowComp' == column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gpccomplete');
        var text = draw_utils_1.makeInput(vTaskList[i].getCompStr(), vEditable, 'percentage', vTaskList[i].getCompVal());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { task.setComp(e.target.value); task.setCompVal(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'comp', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'comp');
    }
    if ('vShowStartDate' == column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gstartdate');
        var v = date_utils_1.formatDateStr(vTaskList[i].getStart(), vDateTaskTableDisplayFormat, vLangs[vLang]);
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getStart());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setStart(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'start', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'start');
    }
    if ('vShowEndDate' == column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'genddate');
        var v = date_utils_1.formatDateStr(vTaskList[i].getEnd(), vDateTaskTableDisplayFormat, vLangs[vLang]);
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getEnd());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setEnd(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'end', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'end');
    }
    if ('vShowPlanStartDate' == column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gplanstartdate');
        var v = vTaskList[i].getPlanStart() ? date_utils_1.formatDateStr(vTaskList[i].getPlanStart(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getPlanStart());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setPlanStart(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'planstart', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planstart');
    }
    if ('vShowPlanEndDate' == column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gplanenddate');
        var v = vTaskList[i].getPlanEnd() ? date_utils_1.formatDateStr(vTaskList[i].getPlanEnd(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
        var text = draw_utils_1.makeInput(v, vEditable, 'date', vTaskList[i].getPlanEnd());
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setPlanEnd(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'planend', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'planend');
    }
    if ('vShowCost' == column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gcost');
        var text = draw_utils_1.makeInput(vTaskList[i].getCost(), vEditable, 'cost');
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setCost(e.target.value); };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'cost', Draw);
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'cost');
    }
    if ('vAdditionalHeaders' == column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var css = header.class ? header.class : "gadditional-" + key;
            var data = vTaskList[i].getDataObject();
            if (data) {
                vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, "gadditional " + css);
            }
            // const callback = (task, e) => task.setCost(e.target.value);
            // addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'costdate');
            vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, data ? data[key] : '');
        }
    }
    if ('vShowAddEntries' == column) {
        vTmpCell = draw_utils_1.newNode(vTmpRow, 'td', null, 'gaddentries');
        var button = "<button>+</button>";
        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, button);
        var callback = function (task, e) {
            task_1.AddTaskItemObject({
                vParent: task.getParent()
            });
        };
        events_1.addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList[i], 'addentries', Draw.bind(this));
        events_1.addListenerClickCell(vTmpCell, vEvents, vTaskList[i], 'addentries');
    }
};
exports.draw_bottom = function (column, vTmpRow, vAdditionalHeaders) {
    if ('vShowRes' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
    if ('vShowDur' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');
    if ('vShowComp' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
    if ('vShowStartDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
    if ('vShowEndDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');
    if ('vShowPlanStartDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gplanstartdate', '\u00A0');
    if ('vShowPlanEndDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gplanenddate', '\u00A0');
    if ('vShowCost' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gcost', '\u00A0');
    if ('vAdditionalHeaders' == column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var css = header.class ? header.class : "gadditional-" + key;
            draw_utils_1.newNode(vTmpRow, 'td', null, "gspanning gadditional " + css, '\u00A0');
        }
    }
    if ('vShowAddEntries' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gaddentries', '\u00A0');
};
exports.draw_list_headings = function (column, vTmpRow, vAdditionalHeaders) {
    if ('vShowRes' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
    if ('vShowDur' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');
    if ('vShowComp' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
    if ('vShowStartDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
    if ('vShowEndDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');
    if ('vShowPlanStartDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
    if ('vShowPlanEndDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gplanenddate', '\u00A0');
    if ('vShowCost' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gcost', '\u00A0');
    if ('vAdditionalHeaders' == column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var css = header.class ? header.class : "gadditional-" + key;
            draw_utils_1.newNode(vTmpRow, 'td', null, "gspanning gadditional " + css, '\u00A0');
        }
    }
    if ('vShowAddEntries' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gspanning gaddentries', '\u00A0');
};
exports.draw_task_headings = function (column, vTmpRow, vLangs, vLang, vAdditionalHeaders) {
    if ('vShowRes' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskheading gresource', vLangs[vLang]['resource']);
    if ('vShowDur' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskheading gduration', vLangs[vLang]['duration']);
    if ('vShowComp' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskheading gpccomplete', vLangs[vLang]['comp']);
    if ('vShowStartDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskheading gstartdate', vLangs[vLang]['startdate']);
    if ('vShowEndDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskheading genddate', vLangs[vLang]['enddate']);
    if ('vShowPlanStartDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskheading gplanstartdate', vLangs[vLang]['planstartdate']);
    if ('vShowPlanEndDate' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskheading gplanenddate', vLangs[vLang]['planenddate']);
    if ('vShowCost' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskheading gcost', vLangs[vLang]['cost']);
    if ('vAdditionalHeaders' == column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var text = header.translate ? vLangs[vLang][header.translate] : header.title;
            var css = header.class ? header.class : "gadditional-" + key;
            draw_utils_1.newNode(vTmpRow, 'td', null, "gtaskheading gadditional " + css, text);
        }
    }
    if ('vShowAddEntries' == column)
        draw_utils_1.newNode(vTmpRow, 'td', null, 'gtaskheading gaddentries', vLangs[vLang]['addentries']);
};
//# sourceMappingURL=draw_columns.js.map