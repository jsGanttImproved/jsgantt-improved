"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lang = require("./lang");
var events_1 = require("./events");
var general_utils_1 = require("./utils/general_utils");
var task_1 = require("./task");
var xml_1 = require("./xml");
var draw_columns_1 = require("./draw_columns");
var draw_utils_1 = require("./utils/draw_utils");
var draw_dependencies_1 = require("./draw_dependencies");
var options_1 = require("./options");
var date_utils_1 = require("./utils/date_utils");
// function that loads the main gantt chart properties and functions
// pDiv: (required) this is a div object created in HTML
// pFormat: (required) - used to indicate whether chart should be drawn in "hour", "day", "week", "month", or "quarter" format
exports.GanttChart = function (pDiv, pFormat) {
    this.vDiv = pDiv;
    this.vFormat = pFormat;
    this.vDivId = null;
    this.vUseFade = 1;
    this.vUseMove = 1;
    this.vUseRowHlt = 1;
    this.vUseToolTip = 1;
    this.vUseSort = 1;
    this.vUseSingleCell = 25000;
    this.vShowRes = 1;
    this.vShowDur = 1;
    this.vShowComp = 1;
    this.vShowStartDate = 1;
    this.vShowEndDate = 1;
    this.vShowPlanStartDate = 0;
    this.vShowPlanEndDate = 0;
    this.vShowCost = 0;
    this.vShowAddEntries = 0;
    this.vShowEndWeekDate = 1;
    this.vShowWeekends = 1;
    this.vShowTaskInfoRes = 1;
    this.vShowTaskInfoDur = 1;
    this.vShowTaskInfoComp = 1;
    this.vShowTaskInfoStartDate = 1;
    this.vShowTaskInfoEndDate = 1;
    this.vShowTaskInfoNotes = 1;
    this.vShowTaskInfoLink = 0;
    this.vEventClickRow = 1;
    this.vShowDeps = 1;
    this.vTotalHeight = undefined;
    this.vWorkingDays = {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true
    };
    this.vEvents = {
        taskname: null,
        res: null,
        dur: null,
        comp: null,
        startdate: null,
        enddate: null,
        planstartdate: null,
        planenddate: null,
        cost: null,
        beforeDraw: null,
        afterDraw: null,
        beforeLineDraw: null,
        afterLineDraw: null,
        onLineDraw: null
    };
    this.vEventsChange = {
        taskname: null,
        res: null,
        dur: null,
        comp: null,
        startdate: null,
        enddate: null,
        planstartdate: null,
        planenddate: null,
        cost: null,
        line: null
    };
    this.vResources = null;
    this.vAdditionalHeaders = {};
    this.vColumnOrder = draw_columns_1.COLUMN_ORDER;
    this.vEditable = false;
    this.vDebug = false;
    this.vShowSelector = new Array('top');
    this.vDateInputFormat = 'yyyy-mm-dd';
    this.vDateTaskTableDisplayFormat = date_utils_1.parseDateFormatStr('dd/mm/yyyy');
    this.vDateTaskDisplayFormat = date_utils_1.parseDateFormatStr('dd month yyyy');
    this.vHourMajorDateDisplayFormat = date_utils_1.parseDateFormatStr('day dd month yyyy');
    this.vHourMinorDateDisplayFormat = date_utils_1.parseDateFormatStr('HH');
    this.vDayMajorDateDisplayFormat = date_utils_1.parseDateFormatStr('dd/mm/yyyy');
    this.vDayMinorDateDisplayFormat = date_utils_1.parseDateFormatStr('dd');
    this.vWeekMajorDateDisplayFormat = date_utils_1.parseDateFormatStr('yyyy');
    this.vWeekMinorDateDisplayFormat = date_utils_1.parseDateFormatStr('dd/mm');
    this.vMonthMajorDateDisplayFormat = date_utils_1.parseDateFormatStr('yyyy');
    this.vMonthMinorDateDisplayFormat = date_utils_1.parseDateFormatStr('mon');
    this.vQuarterMajorDateDisplayFormat = date_utils_1.parseDateFormatStr('yyyy');
    this.vQuarterMinorDateDisplayFormat = date_utils_1.parseDateFormatStr('qq');
    this.vUseFullYear = date_utils_1.parseDateFormatStr('dd/mm/yyyy');
    this.vCaptionType;
    this.vDepId = 1;
    this.vTaskList = new Array();
    this.vFormatArr = new Array('hour', 'day', 'week', 'month', 'quarter');
    this.vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    this.vProcessNeeded = true;
    this.vMinGpLen = 8;
    this.vScrollTo = '';
    this.vHourColWidth = 18;
    this.vDayColWidth = 18;
    this.vWeekColWidth = 36;
    this.vMonthColWidth = 36;
    this.vQuarterColWidth = 18;
    this.vRowHeight = 20;
    this.vTodayPx = -1;
    this.vLangs = lang;
    this.vLang = navigator.language && navigator.language in lang ? navigator.language : 'en';
    this.vChartBody = null;
    this.vChartHead = null;
    this.vListBody = null;
    this.vChartTable = null;
    this.vLines = null;
    this.vTimer = 20;
    this.vTooltipDelay = 1500;
    this.vTooltipTemplate = null;
    this.vMinDate = null;
    this.vMaxDate = null;
    this.includeGetSet = options_1.includeGetSet.bind(this);
    this.includeGetSet();
    this.mouseOver = events_1.mouseOver;
    this.mouseOut = events_1.mouseOut;
    this.addListener = events_1.addListener.bind(this);
    this.removeListener = events_1.removeListener.bind(this);
    this.createTaskInfo = task_1.createTaskInfo;
    this.AddTaskItem = task_1.AddTaskItem;
    this.AddTaskItemObject = task_1.AddTaskItemObject;
    this.RemoveTaskItem = task_1.RemoveTaskItem;
    this.ClearTasks = task_1.ClearTasks;
    this.getXMLProject = xml_1.getXMLProject;
    this.getXMLTask = xml_1.getXMLTask;
    this.CalcTaskXY = draw_utils_1.CalcTaskXY.bind(this);
    // sLine: Draw a straight line (colored one-pixel wide div)
    this.sLine = draw_utils_1.sLine.bind(this);
    this.drawDependency = draw_dependencies_1.drawDependency.bind(this);
    this.DrawDependencies = draw_dependencies_1.DrawDependencies.bind(this);
    this.getArrayLocationByID = draw_utils_1.getArrayLocationByID.bind(this);
    this.drawSelector = draw_utils_1.drawSelector.bind(this);
    this.clearDependencies = function () {
        var parent = this.getLines();
        if (this.vEventsChange.line &&
            typeof this.vEventsChange.line === 'function') {
            this.removeListener('click', this.vEventsChange.line, parent);
            this.addListener('click', this.vEventsChange.line, parent);
        }
        while (parent.hasChildNodes())
            parent.removeChild(parent.firstChild);
        this.vDepId = 1;
    };
    this.Draw = function () {
        var _this = this;
        if (this.vEvents && this.vEvents.beforeDraw) {
            this.vEvents.beforeDraw();
        }
        var vMaxDate = new Date();
        var vMinDate = new Date();
        var vTmpDate = new Date();
        var vTaskLeftPx = 0;
        var vTaskRightPx = 0;
        var vTaskWidth = 1;
        var vTaskPlanLeftPx = 0;
        var vTaskPlanRightPx = 0;
        var vNumCols = 0;
        var vNumRows = 0;
        var vSingleCell = false;
        var vID = 0;
        var vDateRow = null;
        var vColWidth = 0;
        var bd;
        if (this.vDebug) {
            bd = new Date();
            console.log('before draw', bd);
        }
        if (this.vTaskList.length > 0) {
            // Process all tasks, reset parent date and completion % if task list has altered
            if (this.vProcessNeeded)
                task_1.processRows(this.vTaskList, 0, -1, 1, 1, this.getUseSort(), this.vDebug);
            this.vProcessNeeded = false;
            // get overall min/max dates plus padding
            vMinDate = date_utils_1.getMinDate(this.vTaskList, this.vFormat, this.getMinDate() && date_utils_1.coerceDate(this.getMinDate()));
            vMaxDate = date_utils_1.getMaxDate(this.vTaskList, this.vFormat, this.getMaxDate() && date_utils_1.coerceDate(this.getMaxDate()));
            // Calculate chart width variables.
            if (this.vFormat == 'day')
                vColWidth = this.vDayColWidth;
            else if (this.vFormat == 'week')
                vColWidth = this.vWeekColWidth;
            else if (this.vFormat == 'month')
                vColWidth = this.vMonthColWidth;
            else if (this.vFormat == 'quarter')
                vColWidth = this.vQuarterColWidth;
            else if (this.vFormat == 'hour')
                vColWidth = this.vHourColWidth;
            // DRAW the Left-side of the chart (names, resources, comp%)
            var vLeftHeader = document.createDocumentFragment();
            /**
             * LIST HEAD
             *
             *
             *
             * HEADINGS
            */
            var vTmpDiv = draw_utils_1.newNode(vLeftHeader, 'div', this.vDivId + 'glisthead', 'glistlbl gcontainercol');
            var gListLbl = vTmpDiv;
            this.setListBody(vTmpDiv);
            var vTmpTab = draw_utils_1.newNode(vTmpDiv, 'table', null, 'gtasktableh');
            var vTmpTBody = draw_utils_1.newNode(vTmpTab, 'tbody');
            var vTmpRow_1 = draw_utils_1.newNode(vTmpTBody, 'tr');
            draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gtasklist', '\u00A0');
            var vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gspanning gtaskname');
            vTmpCell.appendChild(this.drawSelector('top'));
            this.getColumnOrder().forEach(function (column) {
                if (_this[column] == 1 || column === 'vAdditionalHeaders') {
                    draw_columns_1.draw_list_headings(column, vTmpRow_1, _this.vAdditionalHeaders);
                }
            });
            vTmpRow_1 = draw_utils_1.newNode(vTmpTBody, 'tr');
            draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gtasklist', '\u00A0');
            draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gtaskname', '\u00A0');
            this.getColumnOrder().forEach(function (column) {
                if (_this[column] == 1 || column === 'vAdditionalHeaders') {
                    draw_columns_1.draw_task_headings(column, vTmpRow_1, _this.vLangs, _this.vLang, _this.vAdditionalHeaders);
                }
            });
            /**
             * LIST BODY
             *
             *
            */
            var vTmpDiv2 = void 0;
            var vTmpContentTabOuterWrapper = draw_utils_1.newNode(vLeftHeader, 'div', null, 'gtasktableouterwrapper');
            var vTmpContentTabWrapper = draw_utils_1.newNode(vTmpContentTabOuterWrapper, 'div', null, 'gtasktablewrapper');
            vTmpContentTabWrapper.style.width = "calc(100% + " + general_utils_1.getScrollbarWidth() + "px)";
            var vTmpContentTab = draw_utils_1.newNode(vTmpContentTabWrapper, 'table', null, 'gtasktable');
            var vTmpContentTBody = draw_utils_1.newNode(vTmpContentTab, 'tbody');
            var _loop_1 = function (i_1) {
                var vBGColor = void 0;
                if (this_1.vTaskList[i_1].getGroup() == 1)
                    vBGColor = 'ggroupitem';
                else
                    vBGColor = 'glineitem';
                vID = this_1.vTaskList[i_1].getID();
                if ((!(this_1.vTaskList[i_1].getParItem() && this_1.vTaskList[i_1].getParItem().getGroup() == 2)) || this_1.vTaskList[i_1].getGroup() == 2) {
                    if (this_1.vTaskList[i_1].getVisible() == 0)
                        vTmpRow_1 = draw_utils_1.newNode(vTmpContentTBody, 'tr', this_1.vDivId + 'child_' + vID, 'gname ' + vBGColor, null, null, null, 'none');
                    else
                        vTmpRow_1 = draw_utils_1.newNode(vTmpContentTBody, 'tr', this_1.vDivId + 'child_' + vID, 'gname ' + vBGColor);
                    this_1.vTaskList[i_1].setListChildRow(vTmpRow_1);
                    draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gtasklist', '\u00A0');
                    vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gtaskname');
                    var vCellContents = '';
                    for (var j_1 = 1; j_1 < this_1.vTaskList[i_1].getLevel(); j_1++) {
                        vCellContents += '\u00A0\u00A0\u00A0\u00A0';
                    }
                    var task_2 = this_1.vTaskList[i_1];
                    var vEventClickRow_1 = this_1.vEventClickRow;
                    events_1.addListener('click', function (e) {
                        if (e.target.classList.contains('gfoldercollapse') === false &&
                            vEventClickRow_1 && typeof vEventClickRow_1 === "function") {
                            vEventClickRow_1(task_2);
                        }
                    }, vTmpRow_1);
                    if (this_1.vTaskList[i_1].getGroup() == 1) {
                        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, vCellContents);
                        var vTmpSpan = draw_utils_1.newNode(vTmpDiv, 'span', this_1.vDivId + 'group_' + vID, 'gfoldercollapse', (this_1.vTaskList[i_1].getOpen() == 1) ? '-' : '+');
                        this_1.vTaskList[i_1].setGroupSpan(vTmpSpan);
                        events_1.addFolderListeners(this_1, vTmpSpan, vID);
                        var divTask = document.createElement('span');
                        divTask.innerHTML = '\u00A0' + this_1.vTaskList[i_1].getName();
                        vTmpDiv.appendChild(divTask);
                        // const text = makeInput(this.vTaskList[i].getName(), this.vEditable, 'text');
                        // vTmpDiv.appendChild(document.createNode(text));
                        var callback = function (task, e) { return task.setName(e.target.value); };
                        events_1.addListenerInputCell(vTmpCell, this_1.vEventsChange, callback, this_1.vTaskList[i_1], 'taskname', this_1.Draw.bind(this_1));
                        events_1.addListenerClickCell(vTmpDiv, this_1.vEvents, this_1.vTaskList[i_1], 'taskname');
                    }
                    else {
                        vCellContents += '\u00A0\u00A0\u00A0\u00A0';
                        var text = draw_utils_1.makeInput(this_1.vTaskList[i_1].getName(), this_1.vEditable, 'text');
                        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, null, vCellContents + text);
                        var callback = function (task, e) { return task.setName(e.target.value); };
                        events_1.addListenerInputCell(vTmpCell, this_1.vEventsChange, callback, this_1.vTaskList[i_1], 'taskname', this_1.Draw.bind(this_1));
                        events_1.addListenerClickCell(vTmpCell, this_1.vEvents, this_1.vTaskList[i_1], 'taskname');
                    }
                    this_1.getColumnOrder().forEach(function (column) {
                        if (_this[column] == 1 || column === 'vAdditionalHeaders') {
                            draw_columns_1.draw_header(column, i_1, vTmpRow_1, _this.vTaskList, _this.vEditable, _this.vEventsChange, _this.vEvents, _this.vDateTaskTableDisplayFormat, _this.vAdditionalHeaders, _this.vFormat, _this.vLangs, _this.vLang, _this.vResources, _this.Draw);
                        }
                    });
                    vNumRows++;
                }
            };
            var this_1 = this;
            for (var i_1 = 0; i_1 < this.vTaskList.length; i_1++) {
                _loop_1(i_1);
            }
            // DRAW the date format selector at bottom left.
            vTmpRow_1 = draw_utils_1.newNode(vTmpContentTBody, 'tr');
            draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gtasklist', '\u00A0');
            vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gspanning gtaskname');
            vTmpCell.appendChild(this.drawSelector('bottom'));
            this.getColumnOrder().forEach(function (column) {
                if (_this[column] == 1 || column === 'vAdditionalHeaders') {
                    draw_columns_1.draw_bottom(column, vTmpRow_1, _this.vAdditionalHeaders);
                }
            });
            // Add some white space so the vertical scroll distance should always be greater
            // than for the right pane (keep to a minimum as it is seen in unconstrained height designs)
            // newNode(vTmpDiv2, 'br');
            // newNode(vTmpDiv2, 'br');
            /**
             * CHART HEAD
             *
             *
             * HEADINGS
             */
            var vRightHeader = document.createDocumentFragment();
            vTmpDiv = draw_utils_1.newNode(vRightHeader, 'div', this.vDivId + 'gcharthead', 'gchartlbl gcontainercol');
            var gChartLbl = vTmpDiv;
            this.setChartHead(vTmpDiv);
            vTmpTab = draw_utils_1.newNode(vTmpDiv, 'table', this.vDivId + 'chartTableh', 'gcharttableh');
            vTmpTBody = draw_utils_1.newNode(vTmpTab, 'tbody');
            vTmpRow_1 = draw_utils_1.newNode(vTmpTBody, 'tr');
            vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
            if (this.vFormat == 'hour')
                vTmpDate.setHours(vMinDate.getHours());
            else
                vTmpDate.setHours(0);
            vTmpDate.setMinutes(0);
            vTmpDate.setSeconds(0);
            vTmpDate.setMilliseconds(0);
            var vColSpan = 1;
            // Major Date Header
            while (vTmpDate.getTime() <= vMaxDate.getTime()) {
                var vHeaderCellClass = 'gmajorheading';
                var vCellContents = '';
                if (this.vFormat == 'day') {
                    var colspan = 7;
                    if (!this.vShowWeekends) {
                        vHeaderCellClass += ' headweekends';
                        colspan = 5;
                    }
                    vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, vHeaderCellClass, null, null, null, null, colspan);
                    vCellContents += date_utils_1.formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
                    vTmpDate.setDate(vTmpDate.getDate() + 6);
                    if (this.vShowEndWeekDate == 1)
                        vCellContents += ' - ' + date_utils_1.formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
                    draw_utils_1.newNode(vTmpCell, 'div', null, null, vCellContents, vColWidth * colspan);
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
                else if (this.vFormat == 'week') {
                    vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, vHeaderCellClass, null, vColWidth);
                    draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vWeekMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vTmpDate.setDate(vTmpDate.getDate() + 7);
                }
                else if (this.vFormat == 'month') {
                    vColSpan = (12 - vTmpDate.getMonth());
                    if (vTmpDate.getFullYear() == vMaxDate.getFullYear())
                        vColSpan -= (11 - vMaxDate.getMonth());
                    vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                    draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vMonthMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                    vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
                }
                else if (this.vFormat == 'quarter') {
                    vColSpan = (4 - Math.floor(vTmpDate.getMonth() / 3));
                    if (vTmpDate.getFullYear() == vMaxDate.getFullYear())
                        vColSpan -= (3 - Math.floor(vMaxDate.getMonth() / 3));
                    vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                    draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vQuarterMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                    vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
                }
                else if (this.vFormat == 'hour') {
                    vColSpan = (24 - vTmpDate.getHours());
                    if (vTmpDate.getFullYear() == vMaxDate.getFullYear() &&
                        vTmpDate.getMonth() == vMaxDate.getMonth() &&
                        vTmpDate.getDate() == vMaxDate.getDate())
                        vColSpan -= (23 - vMaxDate.getHours());
                    vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                    draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vHourMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                    vTmpDate.setHours(0);
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
            }
            vTmpRow_1 = draw_utils_1.newNode(vTmpTBody, 'tr');
            // Minor Date header and Cell Rows
            vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate()); // , vMinDate.getHours()
            if (this.vFormat == 'hour')
                vTmpDate.setHours(vMinDate.getHours());
            vNumCols = 0;
            while (vTmpDate.getTime() <= vMaxDate.getTime()) {
                var vHeaderCellClass = 'gminorheading';
                if (this.vFormat == 'day') {
                    if (vTmpDate.getDay() % 6 == 0) {
                        if (!this.vShowWeekends) {
                            vTmpDate.setDate(vTmpDate.getDate() + 1);
                            continue;
                        }
                        vHeaderCellClass += 'wkend';
                    }
                    if (vTmpDate <= vMaxDate) {
                        vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, vHeaderCellClass);
                        draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vDayMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                        vNumCols++;
                    }
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
                else if (this.vFormat == 'week') {
                    if (vTmpDate <= vMaxDate) {
                        vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, vHeaderCellClass);
                        draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vWeekMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                        vNumCols++;
                    }
                    vTmpDate.setDate(vTmpDate.getDate() + 7);
                }
                else if (this.vFormat == 'month') {
                    if (vTmpDate <= vMaxDate) {
                        vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, vHeaderCellClass);
                        draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vMonthMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                        vNumCols++;
                    }
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                    while (vTmpDate.getDate() > 1) {
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                    }
                }
                else if (this.vFormat == 'quarter') {
                    if (vTmpDate <= vMaxDate) {
                        vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, vHeaderCellClass);
                        draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vQuarterMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                        vNumCols++;
                    }
                    vTmpDate.setDate(vTmpDate.getDate() + 81);
                    while (vTmpDate.getDate() > 1)
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
                else if (this.vFormat == 'hour') {
                    for (var i_2 = vTmpDate.getHours(); i_2 < 24; i_2++) {
                        vTmpDate.setHours(i_2); //works around daylight savings but may look a little odd on days where the clock goes forward
                        if (vTmpDate <= vMaxDate) {
                            vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, vHeaderCellClass);
                            draw_utils_1.newNode(vTmpCell, 'div', null, null, date_utils_1.formatDateStr(vTmpDate, this.vHourMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                            vNumCols++;
                        }
                    }
                    vTmpDate.setHours(0);
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
            }
            vDateRow = vTmpRow_1;
            // Calculate size of grids  : Plus 3 because 1 border left + 2 of paddings
            vTaskLeftPx = (vNumCols * (vColWidth + 3)) + 1;
            // Fix a small space at the end for day
            if (this.vFormat === 'day') {
                vTaskLeftPx += 2;
            }
            vTmpTab.style.width = vTaskLeftPx + 'px'; // Ensure that the headings has exactly the same width as the chart grid
            vTaskPlanLeftPx = (vNumCols * (vColWidth + 3)) + 1;
            if (this.vUseSingleCell != 0 && this.vUseSingleCell < (vNumCols * vNumRows))
                vSingleCell = true;
            draw_utils_1.newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);
            vTmpDiv = draw_utils_1.newNode(vRightHeader, 'div', null, 'glabelfooter');
            /**
             * CHART GRID
             *
             *
             *
             */
            var vRightTable = document.createDocumentFragment();
            vTmpDiv = draw_utils_1.newNode(vRightTable, 'div', this.vDivId + 'gchartbody', 'gchartgrid gcontainercol');
            this.setChartBody(vTmpDiv);
            vTmpTab = draw_utils_1.newNode(vTmpDiv, 'table', this.vDivId + 'chartTable', 'gcharttable', null, vTaskLeftPx);
            this.setChartTable(vTmpTab);
            draw_utils_1.newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);
            vTmpTBody = draw_utils_1.newNode(vTmpTab, 'tbody');
            events_1.syncScroll([vTmpContentTabWrapper, vTmpDiv], 'scrollTop');
            events_1.syncScroll([gChartLbl, vTmpDiv], 'scrollLeft');
            events_1.syncScroll([vTmpContentTabWrapper, gListLbl], 'scrollLeft');
            // Draw each row
            var i = 0;
            var j = 0;
            var bd_1;
            if (this.vDebug) {
                bd_1 = new Date();
                console.log('before tasks loop', bd_1);
            }
            for (i = 0; i < this.vTaskList.length; i++) {
                var curTaskStart = this.vTaskList[i].getStart() ? this.vTaskList[i].getStart() : this.vTaskList[i].getPlanStart();
                var curTaskEnd = this.vTaskList[i].getEnd() ? this.vTaskList[i].getEnd() : this.vTaskList[i].getPlanEnd();
                if ((curTaskEnd.getTime() - (curTaskEnd.getTimezoneOffset() * 60000)) % (86400000) == 0)
                    curTaskEnd = new Date(curTaskEnd.getFullYear(), curTaskEnd.getMonth(), curTaskEnd.getDate() + 1, curTaskEnd.getHours(), curTaskEnd.getMinutes(), curTaskEnd.getSeconds()); // add 1 day here to simplify calculations below
                vTaskLeftPx = general_utils_1.getOffset(vMinDate, curTaskStart, vColWidth, this.vFormat, this.vShowWeekends);
                vTaskRightPx = general_utils_1.getOffset(curTaskStart, curTaskEnd, vColWidth, this.vFormat, this.vShowWeekends);
                var curTaskPlanStart = void 0, curTaskPlanEnd = void 0;
                curTaskPlanStart = this.vTaskList[i].getPlanStart();
                curTaskPlanEnd = this.vTaskList[i].getPlanEnd();
                if (curTaskPlanStart && curTaskPlanEnd) {
                    if ((curTaskPlanEnd.getTime() - (curTaskPlanEnd.getTimezoneOffset() * 60000)) % (86400000) == 0)
                        curTaskPlanEnd = new Date(curTaskPlanEnd.getFullYear(), curTaskPlanEnd.getMonth(), curTaskPlanEnd.getDate() + 1, curTaskPlanEnd.getHours(), curTaskPlanEnd.getMinutes(), curTaskPlanEnd.getSeconds()); // add 1 day here to simplify calculations below
                    vTaskPlanLeftPx = general_utils_1.getOffset(vMinDate, curTaskPlanStart, vColWidth, this.vFormat, this.vShowWeekends);
                    vTaskPlanRightPx = general_utils_1.getOffset(curTaskPlanStart, curTaskPlanEnd, vColWidth, this.vFormat, this.vShowWeekends);
                }
                else {
                    vTaskPlanLeftPx = vTaskPlanRightPx = 0;
                }
                vID = this.vTaskList[i].getID();
                var vComb = (this.vTaskList[i].getParItem() && this.vTaskList[i].getParItem().getGroup() == 2);
                var vCellFormat = '';
                var vTmpItem = this.vTaskList[i];
                var vCaptClass = null;
                if (this.vTaskList[i].getMile() && !vComb) {
                    vTmpRow_1 = draw_utils_1.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'gmileitem gmile' + this.vFormat, null, null, null, ((this.vTaskList[i].getVisible() == 0) ? 'none' : null));
                    this.vTaskList[i].setChildRow(vTmpRow_1);
                    events_1.addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow_1);
                    vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gtaskcell');
                    vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                    vTmpDiv = draw_utils_1.newNode(vTmpDiv, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, 12, vTaskLeftPx + vTaskRightPx - 6);
                    this.vTaskList[i].setBarDiv(vTmpDiv);
                    vTmpDiv2 = draw_utils_1.newNode(vTmpDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass(), null, 12);
                    this.vTaskList[i].setTaskDiv(vTmpDiv2);
                    if (this.vTaskList[i].getCompVal() < 100)
                        vTmpDiv2.appendChild(document.createTextNode('\u25CA'));
                    else {
                        vTmpDiv2 = draw_utils_1.newNode(vTmpDiv2, 'div', null, 'gmilediamond');
                        draw_utils_1.newNode(vTmpDiv2, 'div', null, 'gmdtop');
                        draw_utils_1.newNode(vTmpDiv2, 'div', null, 'gmdbottom');
                    }
                    vCaptClass = 'gmilecaption';
                    if (!vSingleCell && !vComb) {
                        vCellFormat = '';
                        for (j = 0; j < vNumCols - 1; j++) {
                            if (this.vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5)))
                                vCellFormat = 'gtaskcellwkend';
                            else
                                vCellFormat = 'gtaskcell';
                            draw_utils_1.newNode(vTmpRow_1, 'td', null, vCellFormat, '\u00A0\u00A0');
                        }
                    }
                }
                else {
                    vTaskWidth = vTaskRightPx;
                    // Draw Group Bar which has outer div with inner group div 
                    // and several small divs to left and right to create angled-end indicators
                    if (this.vTaskList[i].getGroup()) {
                        vTaskWidth = (vTaskWidth > this.vMinGpLen && vTaskWidth < this.vMinGpLen * 2) ? this.vMinGpLen * 2 : vTaskWidth; // Expand to show two end points
                        vTaskWidth = (vTaskWidth < this.vMinGpLen) ? this.vMinGpLen : vTaskWidth; // expand to show one end point
                        vTmpRow_1 = draw_utils_1.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, ((this.vTaskList[i].getGroup() == 2) ? 'glineitem gitem' : 'ggroupitem ggroup') + this.vFormat, null, null, null, ((this.vTaskList[i].getVisible() == 0) ? 'none' : null));
                        this.vTaskList[i].setChildRow(vTmpRow_1);
                        events_1.addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow_1);
                        vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gtaskcell');
                        vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                        this.vTaskList[i].setCellDiv(vTmpDiv);
                        if (this.vTaskList[i].getGroup() == 1) {
                            vTmpDiv = draw_utils_1.newNode(vTmpDiv, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, vTaskLeftPx);
                            this.vTaskList[i].setBarDiv(vTmpDiv);
                            vTmpDiv2 = draw_utils_1.newNode(vTmpDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass(), null, vTaskWidth);
                            this.vTaskList[i].setTaskDiv(vTmpDiv2);
                            draw_utils_1.newNode(vTmpDiv2, 'div', this.vDivId + 'complete_' + vID, this.vTaskList[i].getClass() + 'complete', null, this.vTaskList[i].getCompStr());
                            draw_utils_1.newNode(vTmpDiv, 'div', null, this.vTaskList[i].getClass() + 'endpointleft');
                            if (vTaskWidth >= this.vMinGpLen * 2)
                                draw_utils_1.newNode(vTmpDiv, 'div', null, this.vTaskList[i].getClass() + 'endpointright');
                            vCaptClass = 'ggroupcaption';
                        }
                        if (!vSingleCell && !vComb) {
                            vCellFormat = '';
                            for (j = 0; j < vNumCols - 1; j++) {
                                if (this.vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5)))
                                    vCellFormat = 'gtaskcellwkend';
                                else
                                    vCellFormat = 'gtaskcell';
                                draw_utils_1.newNode(vTmpRow_1, 'td', null, vCellFormat, '\u00A0\u00A0');
                            }
                        }
                    }
                    else {
                        vTaskWidth = (vTaskWidth <= 0) ? 1 : vTaskWidth;
                        /**
                         * DRAW THE BOXES FOR GANTT
                         */
                        var vTmpDivCell = void 0;
                        if (vComb) {
                            vTmpDivCell = vTmpDiv = this.vTaskList[i].getParItem().getCellDiv();
                        }
                        else {
                            // Draw Task Bar which has colored bar div
                            vTmpRow_1 = draw_utils_1.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'glineitem gitem' + this.vFormat, null, null, null, ((this.vTaskList[i].getVisible() == 0) ? 'none' : null));
                            this.vTaskList[i].setChildRow(vTmpRow_1);
                            events_1.addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow_1);
                            vTmpCell = draw_utils_1.newNode(vTmpRow_1, 'td', null, 'gtaskcell');
                            vTmpDivCell = vTmpDiv = draw_utils_1.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                        }
                        // DRAW TASK BAR
                        vTmpDiv = draw_utils_1.newNode(vTmpDiv, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, vTaskLeftPx);
                        this.vTaskList[i].setBarDiv(vTmpDiv);
                        if (this.vTaskList[i].getStartVar()) {
                            // textbar
                            vTmpDiv2 = draw_utils_1.newNode(vTmpDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass(), null, vTaskWidth);
                            if (this.vTaskList[i].getBarText()) {
                                draw_utils_1.newNode(vTmpDiv2, 'span', this.vDivId + 'tasktextbar_' + vID, 'textbar', this.vTaskList[i].getBarText(), this.vTaskList[i].getCompRestStr());
                            }
                            this.vTaskList[i].setTaskDiv(vTmpDiv2);
                        }
                        // PLANNED
                        // If they are different, show plan bar... show if there is no real vStart as well (just plan dates)
                        if (vTaskPlanLeftPx && (vTaskPlanLeftPx != vTaskLeftPx || !this.vTaskList[i].getStartVar())) {
                            var vTmpPlanDiv = draw_utils_1.newNode(vTmpDivCell, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer gplan', null, vTaskPlanRightPx, vTaskPlanLeftPx);
                            var vTmpPlanDiv2 = draw_utils_1.newNode(vTmpPlanDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass() + ' gplan', null, vTaskPlanRightPx);
                            this.vTaskList[i].setPlanTaskDiv(vTmpPlanDiv2);
                        }
                        // and opaque completion div
                        draw_utils_1.newNode(vTmpDiv2, 'div', this.vDivId + 'complete_' + vID, this.vTaskList[i].getClass() + 'complete', null, this.vTaskList[i].getCompStr());
                        // caption
                        if (vComb)
                            vTmpItem = this.vTaskList[i].getParItem();
                        if (!vComb || (vComb && this.vTaskList[i].getParItem().getEnd() == this.vTaskList[i].getEnd()))
                            vCaptClass = 'gcaption';
                        // Background cells
                        if (!vSingleCell && !vComb) {
                            vCellFormat = '';
                            for (j = 0; j < vNumCols - 1; j++) {
                                if (this.vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5)))
                                    vCellFormat = 'gtaskcellwkend';
                                else
                                    vCellFormat = 'gtaskcell';
                                draw_utils_1.newNode(vTmpRow_1, 'td', null, vCellFormat, '\u00A0\u00A0');
                            }
                        }
                    }
                }
                if (this.getCaptionType() && vCaptClass !== null) {
                    var vCaptionStr = void 0;
                    switch (this.getCaptionType()) {
                        case 'Caption':
                            vCaptionStr = vTmpItem.getCaption();
                            break;
                        case 'Resource':
                            vCaptionStr = vTmpItem.getResource();
                            break;
                        case 'Duration':
                            vCaptionStr = vTmpItem.getDuration(this.vFormat, this.vLangs[this.vLang]);
                            break;
                        case 'Complete':
                            vCaptionStr = vTmpItem.getCompStr();
                            break;
                    }
                    draw_utils_1.newNode(vTmpDiv, 'div', null, vCaptClass, vCaptionStr, 120, (vCaptClass == 'gmilecaption') ? 12 : 0);
                }
                // Add Task Info div for tooltip
                if (this.vTaskList[i].getTaskDiv() && vTmpDiv) {
                    vTmpDiv2 = draw_utils_1.newNode(vTmpDiv, 'div', this.vDivId + 'tt' + vID, null, null, null, null, 'none');
                    var _a = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate), component = _a.component, callback = _a.callback;
                    vTmpDiv2.appendChild(component);
                    events_1.addTooltipListeners(this, this.vTaskList[i].getTaskDiv(), vTmpDiv2, callback);
                }
                // Add Plan Task Info div for tooltip
                if (this.vTaskList[i].getPlanTaskDiv() && vTmpDiv) {
                    vTmpDiv2 = draw_utils_1.newNode(vTmpDiv, 'div', this.vDivId + 'tt' + vID, null, null, null, null, 'none');
                    var _b = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate), component = _b.component, callback = _b.callback;
                    vTmpDiv2.appendChild(component);
                    events_1.addTooltipListeners(this, this.vTaskList[i].getPlanTaskDiv(), vTmpDiv2, callback);
                }
            }
            if (this.vDebug) {
                var ad = new Date();
                console.log('after tasks loop', ad, (ad.getTime() - bd_1.getTime()));
            }
            if (!vSingleCell) {
                vTmpTBody.appendChild(vDateRow.cloneNode(true));
            }
            else if (this.vFormat == 'day') {
                vTmpTBody.appendChild(document.createElement('tr'));
            }
            // MAIN VIEW: Appending all generated components to main view
            while (this.vDiv.hasChildNodes())
                this.vDiv.removeChild(this.vDiv.firstChild);
            vTmpDiv = draw_utils_1.newNode(this.vDiv, 'div', null, 'gchartcontainer');
            vTmpDiv.style.height = this.vTotalHeight;
            var leftvTmpDiv = draw_utils_1.newNode(vTmpDiv, 'div', null, 'gmain gmainleft');
            leftvTmpDiv.appendChild(vLeftHeader);
            // leftvTmpDiv.appendChild(vLeftTable);
            var rightvTmpDiv = draw_utils_1.newNode(vTmpDiv, 'div', null, 'gmain gmainright');
            rightvTmpDiv.appendChild(vRightHeader);
            rightvTmpDiv.appendChild(vRightTable);
            vTmpDiv.appendChild(leftvTmpDiv);
            vTmpDiv.appendChild(rightvTmpDiv);
            draw_utils_1.newNode(vTmpDiv, 'div', null, 'ggridfooter');
            vTmpDiv2 = draw_utils_1.newNode(this.getChartBody(), 'div', this.vDivId + 'Lines', 'glinediv');
            vTmpDiv2.style.visibility = 'hidden';
            this.setLines(vTmpDiv2);
            /* Quick hack to show the generated HTML on older browsers - add a '/' to the begining of this line to activate
                  let tmpGenSrc=document.createElement('textarea');
                  tmpGenSrc.appendChild(document.createTextNode(vTmpDiv.innerHTML));
                  vDiv.appendChild(tmpGenSrc);
            //*/
            // LISTENERS: Now all the content exists, register scroll listeners
            events_1.addScrollListeners(this);
            // now check if we are actually scrolling the pane
            if (this.vScrollTo != '') {
                var vScrollDate = new Date(vMinDate.getTime());
                var vScrollPx = 0;
                if (this.vScrollTo.substr && this.vScrollTo.substr(0, 2) == 'px') {
                    vScrollPx = parseInt(this.vScrollTo.substr(2));
                }
                else {
                    if (this.vScrollTo === 'today') {
                        vScrollDate = new Date();
                    }
                    else if (this.vScrollTo instanceof Date) {
                        vScrollDate = this.vScrollTo;
                    }
                    else {
                        vScrollDate = date_utils_1.parseDateStr(this.vScrollTo, this.getDateInputFormat());
                    }
                    if (this.vFormat == 'hour')
                        vScrollDate.setMinutes(0, 0, 0);
                    else
                        vScrollDate.setHours(0, 0, 0, 0);
                    vScrollPx = general_utils_1.getOffset(vMinDate, vScrollDate, vColWidth, this.vFormat, this.vShowWeekends) - 30;
                }
                this.getChartBody().scrollLeft = vScrollPx;
            }
            if (vMinDate.getTime() <= (new Date()).getTime() && vMaxDate.getTime() >= (new Date()).getTime())
                this.vTodayPx = general_utils_1.getOffset(vMinDate, new Date(), vColWidth, this.vFormat, this.vShowWeekends);
            else
                this.vTodayPx = -1;
            // Dependencies
            var bdd = void 0;
            if (this.vDebug) {
                bdd = new Date();
                console.log('before DrawDependencies', bdd);
            }
            if (this.vEvents && typeof this.vEvents.beforeLineDraw === 'function') {
                this.vEvents.beforeLineDraw();
            }
            this.DrawDependencies(this.vDebug);
            events_1.addListenerDependencies();
            if (this.vEvents && typeof this.vEvents.afterLineDraw === 'function') {
                this.vEvents.afterLineDraw();
            }
            if (this.vDebug) {
                var ad = new Date();
                console.log('after DrawDependencies', ad, (ad.getTime() - bdd.getTime()));
            }
        }
        if (this.vDebug) {
            var ad = new Date();
            console.log('after draw', ad, (ad.getTime() - bd.getTime()));
        }
        events_1.updateGridHeaderWidth(this);
        this.chartRowDateToX = function (date) {
            return general_utils_1.getOffset(vMinDate, date, vColWidth, this.vFormat, this.vShowWeekends);
        };
        if (this.vEvents && this.vEvents.afterDraw) {
            this.vEvents.afterDraw();
        }
    }; //this.draw
    if (this.vDiv && this.vDiv.nodeName.toLowerCase() == 'div')
        this.vDivId = this.vDiv.id;
}; //GanttChart
//# sourceMappingURL=draw.js.map