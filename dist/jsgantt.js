(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSGantt = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSGantt = void 0;
var jsGantt = require("./src/jsgantt");
module.exports = jsGantt.JSGantt;
exports.JSGantt = jsGantt.JSGantt;

},{"./src/jsgantt":6}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanttChart = void 0;
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
/**
 * function that loads the main gantt chart properties and functions
 * @param pDiv (required) this is a div object created in HTML
 * @param pFormat (required) - used to indicate whether chart should be drawn in "hour", "day", "week", "month", or "quarter" format
 */
var GanttChart = function (pDiv, pFormat) {
    // Accept either a native DOM element or a jQuery-wrapped element
    this.vDiv = (pDiv && pDiv[0] instanceof Element) ? pDiv[0] : pDiv;
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
    this.vShowDeps = 1;
    this.vTotalHeight = undefined;
    this.vWorkingDays = {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
    };
    this.vFirstDayOfWeek = 1; // 0=Sunday, 1=Monday (default), …, 6=Saturday
    this.vEventClickCollapse = null;
    this.vEventClickRow = null;
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
        onLineDraw: null,
        onLineContainerHover: null,
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
        line: null,
    };
    this.vResources = null;
    this.vAdditionalHeaders = {};
    this.vColumnOrder = draw_columns_1.COLUMN_ORDER;
    this.vEditable = false;
    this.vDebug = false;
    this.vShowSelector = new Array("top");
    this.vDateInputFormat = "yyyy-mm-dd";
    this.vDateTaskTableDisplayFormat = (0, date_utils_1.parseDateFormatStr)("dd/mm/yyyy");
    this.vDateTaskDisplayFormat = (0, date_utils_1.parseDateFormatStr)("dd month yyyy");
    this.vHourMajorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)("day dd month yyyy");
    this.vHourMinorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)("HH");
    this.vDayMajorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)("dd/mm/yyyy");
    this.vDayMinorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)("dd");
    this.vWeekMajorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)("yyyy");
    this.vWeekMinorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)("dd/mm");
    this.vMonthMajorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)("yyyy");
    this.vMonthMinorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)("mon");
    this.vQuarterMajorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)("yyyy");
    this.vQuarterMinorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)("qq");
    this.vUseFullYear = (0, date_utils_1.parseDateFormatStr)("dd/mm/yyyy");
    this.vCaptionType;
    this.vDepId = 1;
    this.vTaskList = new Array();
    this.vFormatArr = new Array("hour", "day", "week", "month", "quarter");
    this.vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    this.vProcessNeeded = true;
    this.vMinGpLen = 8;
    this.vScrollTo = "";
    this.vHourColWidth = 18;
    this.vDayColWidth = 18;
    this.vWeekColWidth = 36;
    this.vMonthColWidth = 36;
    this.vQuarterColWidth = 18;
    this.vRowHeight = 20;
    this.vTodayPx = -1;
    this.vLangs = lang;
    this.vLang = navigator.language && navigator.language in lang ? navigator.language : "en";
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
    this.GetTaskByOriginalID = task_1.GetTaskByOriginalID;
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
    this.printChart = general_utils_1.printChart.bind(this);
    this.clearDependencies = function () {
        var parent = this.getLines();
        if (this.vEventsChange.line && typeof this.vEventsChange.line === "function") {
            this.removeListener("click", this.vEventsChange.line, parent);
            this.addListener("click", this.vEventsChange.line, parent);
        }
        while (parent.hasChildNodes())
            parent.removeChild(parent.firstChild);
        this.vDepId = 1;
    };
    this.drawListHead = function (vLeftHeader) {
        var _this = this;
        var vTmpDiv = (0, draw_utils_1.newNode)(vLeftHeader, "div", this.vDivId + "glisthead", "glistlbl gcontainercol");
        var gListLbl = vTmpDiv;
        this.setListBody(vTmpDiv);
        var vTmpTab = (0, draw_utils_1.newNode)(vTmpDiv, "table", null, "gtasktableh");
        var vTmpTBody = (0, draw_utils_1.newNode)(vTmpTab, "tbody");
        var vTmpRow = (0, draw_utils_1.newNode)(vTmpTBody, "tr");
        (0, draw_utils_1.newNode)(vTmpRow, "td", null, "gtasklist", "\u00A0");
        var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, "gspanning gtaskname", null, null, null, null, this.getColumnOrder().length + 1);
        vTmpCell.appendChild(this.drawSelector("top"));
        vTmpRow = (0, draw_utils_1.newNode)(vTmpTBody, "tr");
        (0, draw_utils_1.newNode)(vTmpRow, "td", null, "gtasklist", "\u00A0");
        (0, draw_utils_1.newNode)(vTmpRow, "td", null, "gtaskname", "\u00A0");
        this.getColumnOrder().forEach(function (column) {
            if (_this[column] == 1 || column === "vAdditionalHeaders") {
                (0, draw_columns_1.draw_task_headings)(column, vTmpRow, _this.vLangs, _this.vLang, _this.vAdditionalHeaders, _this.vEvents);
            }
        });
        return gListLbl;
    };
    this.drawListBody = function (vLeftHeader) {
        var _this = this;
        var vTmpContentTabOuterWrapper = (0, draw_utils_1.newNode)(vLeftHeader, "div", null, "gtasktableouterwrapper");
        var vTmpContentTabWrapper = (0, draw_utils_1.newNode)(vTmpContentTabOuterWrapper, "div", null, "gtasktablewrapper");
        vTmpContentTabWrapper.style.width = "calc(100% + ".concat((0, general_utils_1.getScrollbarWidth)(), "px)");
        var vTmpContentTab = (0, draw_utils_1.newNode)(vTmpContentTabWrapper, "table", null, "gtasktable");
        var vTmpContentTBody = (0, draw_utils_1.newNode)(vTmpContentTab, "tbody");
        var vNumRows = 0;
        var _loop_1 = function (i) {
            var vBGColor = void 0;
            if (this_1.vTaskList[i].getGroup() == 1)
                vBGColor = "ggroupitem";
            else
                vBGColor = "glineitem a";
            var vID = this_1.vTaskList[i].getID();
            var vTmpRow_1, vTmpCell_1 = void 0;
            if (!(this_1.vTaskList[i].getParItem() && this_1.vTaskList[i].getParItem().getGroup() == 2) || this_1.vTaskList[i].getGroup() == 2) {
                if (this_1.vTaskList[i].getVisible() == 0)
                    vTmpRow_1 = (0, draw_utils_1.newNode)(vTmpContentTBody, "tr", this_1.vDivId + "child_" + vID, "gname " + vBGColor, null, null, null, "none");
                else
                    vTmpRow_1 = (0, draw_utils_1.newNode)(vTmpContentTBody, "tr", this_1.vDivId + "child_" + vID, "gname " + vBGColor);
                this_1.vTaskList[i].setListChildRow(vTmpRow_1);
                (0, draw_utils_1.newNode)(vTmpRow_1, "td", null, "gtasklist", "\u00A0");
                var editableClass = this_1.vEditable ? "gtaskname gtaskeditable" : "gtaskname";
                vTmpCell_1 = (0, draw_utils_1.newNode)(vTmpRow_1, "td", null, editableClass);
                var vCellContents = "";
                for (var j = 1; j < this_1.vTaskList[i].getLevel(); j++) {
                    vCellContents += "\u00A0\u00A0\u00A0\u00A0";
                }
                var task_2 = this_1.vTaskList[i];
                var vEventClickRow_1 = this_1.vEventClickRow;
                var vEventClickCollapse_1 = this_1.vEventClickCollapse;
                (0, events_1.addListener)("click", function (e) {
                    if (e.target.classList.contains("gfoldercollapse") === false) {
                        if (vEventClickRow_1 && typeof vEventClickRow_1 === "function") {
                            vEventClickRow_1(task_2);
                        }
                    }
                    else {
                        if (vEventClickCollapse_1 && typeof vEventClickCollapse_1 === "function") {
                            vEventClickCollapse_1(task_2);
                        }
                    }
                }, vTmpRow_1);
                if (this_1.vTaskList[i].getGroup() == 1) {
                    var vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell_1, "div", null, null, vCellContents);
                    var vTmpSpan = (0, draw_utils_1.newNode)(vTmpDiv, "span", this_1.vDivId + "group_" + vID, "gfoldercollapse", this_1.vTaskList[i].getOpen() == 1 ? "-" : "+");
                    this_1.vTaskList[i].setGroupSpan(vTmpSpan);
                    (0, events_1.addFolderListeners)(this_1, vTmpSpan, vID);
                    var divTask = document.createElement("span");
                    divTask.innerHTML = "\u00A0" + this_1.vTaskList[i].getName();
                    vTmpDiv.appendChild(divTask);
                    // const text = makeInput(this.vTaskList[i].getName(), this.vEditable, 'text');
                    // vTmpDiv.appendChild(document.createNode(text));
                    var callback = function (task, e) { return task.setName(e.target.value); };
                    (0, events_1.addListenerInputCell)(vTmpCell_1, this_1.vEventsChange, callback, this_1.vTaskList, i, "taskname", this_1.Draw.bind(this_1));
                    (0, events_1.addListenerClickCell)(vTmpDiv, this_1.vEvents, this_1.vTaskList[i], "taskname");
                }
                else {
                    vCellContents += "\u00A0\u00A0\u00A0\u00A0";
                    var text = (0, draw_utils_1.makeInput)(this_1.vTaskList[i].getName(), this_1.vEditable, "text");
                    var vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell_1, "div", null, null, vCellContents + text);
                    var callback = function (task, e) { return task.setName(e.target.value); };
                    (0, events_1.addListenerInputCell)(vTmpCell_1, this_1.vEventsChange, callback, this_1.vTaskList, i, "taskname", this_1.Draw.bind(this_1));
                    (0, events_1.addListenerClickCell)(vTmpCell_1, this_1.vEvents, this_1.vTaskList[i], "taskname");
                }
                this_1.getColumnOrder().forEach(function (column) {
                    if (_this[column] == 1 || column === "vAdditionalHeaders") {
                        (0, draw_columns_1.draw_header)(column, i, vTmpRow_1, _this.vTaskList, _this.vEditable, _this.vEventsChange, _this.vEvents, _this.vDateTaskTableDisplayFormat, _this.vAdditionalHeaders, _this.vFormat, _this.vLangs, _this.vLang, _this.vResources, _this.Draw.bind(_this));
                    }
                });
                vNumRows++;
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.vTaskList.length; i++) {
            _loop_1(i);
        }
        // Render no daa in the chart
        if (this.vTaskList.length == 0) {
            var totalColumns = this.getColumnOrder().filter(function (column) { return _this[column] == 1 || column === "vAdditionalHeaders"; }).length;
            var vTmpRow_2 = (0, draw_utils_1.newNode)(vTmpContentTBody, "tr", this.vDivId + "child_", "gname ");
            // this.vTaskList[i].setListChildRow(vTmpRow);
            var vTmpCell_2 = (0, draw_utils_1.newNode)(vTmpRow_2, "td", null, "gtasknolist", "", null, null, null, totalColumns);
            var vOutput = document.createDocumentFragment();
            (0, draw_utils_1.newNode)(vOutput, "div", null, "gtasknolist-label", this.vLangs[this.vLang]["nodata"] + ".");
            vTmpCell_2.appendChild(vOutput);
        }
        // DRAW the date format selector at bottom left.
        var vTmpRow = (0, draw_utils_1.newNode)(vTmpContentTBody, "tr");
        (0, draw_utils_1.newNode)(vTmpRow, "td", null, "gtasklist", "\u00A0");
        var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, "gspanning gtaskname");
        vTmpCell.appendChild(this.drawSelector("bottom"));
        this.getColumnOrder().forEach(function (column) {
            if (_this[column] == 1 || column === "vAdditionalHeaders") {
                (0, draw_columns_1.draw_bottom)(column, vTmpRow, _this.vAdditionalHeaders);
            }
        });
        // Add some white space so the vertical scroll distance should always be greater
        // than for the right pane (keep to a minimum as it is seen in unconstrained height designs)
        // newNode(vTmpDiv2, 'br');
        // newNode(vTmpDiv2, 'br');
        return {
            vNumRows: vNumRows,
            vTmpContentTabWrapper: vTmpContentTabWrapper,
        };
    };
    /**
     *
     * DRAW CHAR HEAD
     *
     */
    this.drawChartHead = function (vMinDate, vMaxDate, vColWidth, vNumRows) {
        var vRightHeader = document.createDocumentFragment();
        var vTmpDiv = (0, draw_utils_1.newNode)(vRightHeader, "div", this.vDivId + "gcharthead", "gchartlbl gcontainercol");
        var gChartLbl = vTmpDiv;
        this.setChartHead(vTmpDiv);
        var vTmpTab = (0, draw_utils_1.newNode)(vTmpDiv, "table", this.vDivId + "chartTableh", "gcharttableh");
        var vTmpTBody = (0, draw_utils_1.newNode)(vTmpTab, "tbody");
        var vTmpRow = (0, draw_utils_1.newNode)(vTmpTBody, "tr");
        var vTmpDate = new Date();
        vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
        if (this.vFormat == "hour")
            vTmpDate.setHours(vMinDate.getHours());
        else
            vTmpDate.setHours(0);
        vTmpDate.setMinutes(0);
        vTmpDate.setSeconds(0);
        vTmpDate.setMilliseconds(0);
        var vColSpan = 1;
        // Major Date Header
        while (vTmpDate.getTime() <= vMaxDate.getTime()) {
            var vHeaderCellClass = "gmajorheading";
            var vCellContents = "";
            if (this.vFormat == "day") {
                var colspan = 7;
                if (!this.vShowWeekends) {
                    vHeaderCellClass += " headweekends";
                    colspan = 5;
                }
                var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, colspan);
                vCellContents += (0, date_utils_1.formatDateStr)(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
                vTmpDate.setDate(vTmpDate.getDate() + 6);
                if (this.vShowEndWeekDate == 1)
                    vCellContents += " - " + (0, date_utils_1.formatDateStr)(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
                (0, draw_utils_1.newNode)(vTmpCell, "div", null, null, vCellContents, vColWidth * colspan);
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
            else if (this.vFormat == "week") {
                // Group weeks by year: span all weeks whose start date falls in the same year
                var thisYear = vTmpDate.getFullYear();
                var countDate = new Date(vTmpDate);
                vColSpan = 0;
                while (countDate.getTime() <= vMaxDate.getTime() && countDate.getFullYear() === thisYear) {
                    vColSpan++;
                    countDate.setDate(countDate.getDate() + 7);
                }
                var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, vColSpan);
                (0, draw_utils_1.newNode)(vTmpCell, "div", null, null, (0, date_utils_1.formatDateStr)(vTmpDate, this.vWeekMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setDate(vTmpDate.getDate() + vColSpan * 7);
            }
            else if (this.vFormat == "month") {
                vColSpan = 12 - vTmpDate.getMonth();
                if (vTmpDate.getFullYear() == vMaxDate.getFullYear())
                    vColSpan -= 11 - vMaxDate.getMonth();
                var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, vColSpan);
                (0, draw_utils_1.newNode)(vTmpCell, "div", null, null, (0, date_utils_1.formatDateStr)(vTmpDate, this.vMonthMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
            }
            else if (this.vFormat == "quarter") {
                vColSpan = 4 - Math.floor(vTmpDate.getMonth() / 3);
                if (vTmpDate.getFullYear() == vMaxDate.getFullYear())
                    vColSpan -= 3 - Math.floor(vMaxDate.getMonth() / 3);
                var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, vColSpan);
                (0, draw_utils_1.newNode)(vTmpCell, "div", null, null, (0, date_utils_1.formatDateStr)(vTmpDate, this.vQuarterMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
            }
            else if (this.vFormat == "hour") {
                vColSpan = 24 - vTmpDate.getHours();
                if (vTmpDate.getFullYear() == vMaxDate.getFullYear() && vTmpDate.getMonth() == vMaxDate.getMonth() && vTmpDate.getDate() == vMaxDate.getDate())
                    vColSpan -= 23 - vMaxDate.getHours();
                var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, vColSpan);
                (0, draw_utils_1.newNode)(vTmpCell, "div", null, null, (0, date_utils_1.formatDateStr)(vTmpDate, this.vHourMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                vTmpDate.setHours(0);
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
        }
        vTmpRow = (0, draw_utils_1.newNode)(vTmpTBody, "tr", null, "footerdays");
        // Minor Date header and Cell Rows
        vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate()); // , vMinDate.getHours()
        if (this.vFormat == "hour")
            vTmpDate.setHours(vMinDate.getHours());
        var vNumCols = 0;
        while (vTmpDate.getTime() <= vMaxDate.getTime()) {
            var vMinorHeaderCellClass = "gminorheading";
            if (this.vFormat == "day") {
                var vWkLastDay = (this.vFirstDayOfWeek + 6) % 7;
                var vWkPenultDay = (this.vFirstDayOfWeek + 5) % 7;
                if (vTmpDate.getDay() === vWkLastDay || vTmpDate.getDay() === vWkPenultDay) {
                    if (!this.vShowWeekends) {
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                        continue;
                    }
                    vMinorHeaderCellClass += "wkend";
                }
                if (vTmpDate <= vMaxDate) {
                    var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, vMinorHeaderCellClass);
                    (0, draw_utils_1.newNode)(vTmpCell, "div", null, null, (0, date_utils_1.formatDateStr)(vTmpDate, this.vDayMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
            else if (this.vFormat == "week") {
                if (vTmpDate <= vMaxDate) {
                    var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, vMinorHeaderCellClass);
                    (0, draw_utils_1.newNode)(vTmpCell, "div", null, null, (0, date_utils_1.formatDateStr)(vTmpDate, this.vWeekMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 7);
            }
            else if (this.vFormat == "month") {
                if (vTmpDate <= vMaxDate) {
                    var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, vMinorHeaderCellClass);
                    (0, draw_utils_1.newNode)(vTmpCell, "div", null, null, (0, date_utils_1.formatDateStr)(vTmpDate, this.vMonthMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 1);
                while (vTmpDate.getDate() > 1) {
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
            }
            else if (this.vFormat == "quarter") {
                if (vTmpDate <= vMaxDate) {
                    var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, vMinorHeaderCellClass);
                    (0, draw_utils_1.newNode)(vTmpCell, "div", null, null, (0, date_utils_1.formatDateStr)(vTmpDate, this.vQuarterMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vNumCols++;
                }
                vTmpDate.setDate(vTmpDate.getDate() + 81);
                while (vTmpDate.getDate() > 1)
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
            else if (this.vFormat == "hour") {
                for (var i = vTmpDate.getHours(); i < 24; i++) {
                    vTmpDate.setHours(i); //works around daylight savings but may look a little odd on days where the clock goes forward
                    if (vTmpDate <= vMaxDate) {
                        var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, vMinorHeaderCellClass);
                        (0, draw_utils_1.newNode)(vTmpCell, "div", null, null, (0, date_utils_1.formatDateStr)(vTmpDate, this.vHourMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                        vNumCols++;
                    }
                }
                vTmpDate.setHours(0);
                vTmpDate.setDate(vTmpDate.getDate() + 1);
            }
        }
        var vDateRow = vTmpRow;
        // Calculate size of grids  : Plus 3 because 1 border left + 2 of paddings
        var vTaskLeftPx = vNumCols * (vColWidth + 3) + 1;
        // Fix a small space at the end for day
        if (this.vFormat === "day") {
            vTaskLeftPx += 2;
        }
        vTmpTab.style.width = vTaskLeftPx + "px"; // Ensure that the headings has exactly the same width as the chart grid
        // const vTaskPlanLeftPx = (vNumCols * (vColWidth + 3)) + 1;
        var vSingleCell = false;
        if (this.vUseSingleCell !== 0 && this.vUseSingleCell < vNumCols * vNumRows)
            vSingleCell = true;
        (0, draw_utils_1.newNode)(vTmpDiv, "div", null, "rhscrpad", null, null, vTaskLeftPx + 1);
        vTmpDiv = (0, draw_utils_1.newNode)(vRightHeader, "div", null, "glabelfooter");
        return { gChartLbl: gChartLbl, vTaskLeftPx: vTaskLeftPx, vSingleCell: vSingleCell, vDateRow: vDateRow, vRightHeader: vRightHeader, vNumCols: vNumCols };
    };
    /**
     *
     * DRAW CHART BODY
     *
     */
    this.drawCharBody = function (vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl, vMinDate, vMaxDate, vSingleCell, vNumCols, vColWidth, vDateRow) {
        var vRightTable = document.createDocumentFragment();
        var vTmpDiv = (0, draw_utils_1.newNode)(vRightTable, "div", this.vDivId + "gchartbody", "gchartgrid gcontainercol");
        this.setChartBody(vTmpDiv);
        var vTmpTab = (0, draw_utils_1.newNode)(vTmpDiv, "table", this.vDivId + "chartTable", "gcharttable", null, vTaskLeftPx);
        this.setChartTable(vTmpTab);
        (0, draw_utils_1.newNode)(vTmpDiv, "div", null, "rhscrpad", null, null, vTaskLeftPx + 1);
        var vTmpTBody = (0, draw_utils_1.newNode)(vTmpTab, "tbody");
        var vTmpTFoot = (0, draw_utils_1.newNode)(vTmpTab, "tfoot");
        (0, events_1.syncScroll)([vTmpContentTabWrapper, vTmpDiv], "scrollTop");
        (0, events_1.syncScroll)([gChartLbl, vTmpDiv], "scrollLeft");
        (0, events_1.syncScroll)([vTmpContentTabWrapper, gListLbl], "scrollLeft");
        // Draw each row
        var i = 0;
        var j = 0;
        var bd;
        if (this.vDebug) {
            bd = new Date();
            console.info("before tasks loop", bd);
        }
        for (i = 0; i < this.vTaskList.length; i++) {
            var curTaskStart = this.vTaskList[i].getStart() ? this.vTaskList[i].getStart() : this.vTaskList[i].getPlanStart();
            var curTaskEnd = this.vTaskList[i].getEnd() ? this.vTaskList[i].getEnd() : this.vTaskList[i].getPlanEnd();
            var vTaskLeftPx_1 = (0, general_utils_1.getOffset)(vMinDate, curTaskStart, vColWidth, this.vFormat, this.vShowWeekends, this.vFirstDayOfWeek);
            var vTaskRightPx = (0, general_utils_1.getOffset)(curTaskStart, curTaskEnd, vColWidth, this.vFormat, this.vShowWeekends, this.vFirstDayOfWeek);
            var curTaskPlanStart = void 0, curTaskPlanEnd = void 0;
            curTaskPlanStart = this.vTaskList[i].getPlanStart();
            curTaskPlanEnd = this.vTaskList[i].getPlanEnd();
            var vTaskPlanLeftPx = 0;
            var vTaskPlanRightPx = 0;
            if (curTaskPlanStart && curTaskPlanEnd) {
                vTaskPlanLeftPx = (0, general_utils_1.getOffset)(vMinDate, curTaskPlanStart, vColWidth, this.vFormat, this.vShowWeekends, this.vFirstDayOfWeek);
                vTaskPlanRightPx = (0, general_utils_1.getOffset)(curTaskPlanStart, curTaskPlanEnd, vColWidth, this.vFormat, this.vShowWeekends, this.vFirstDayOfWeek);
            }
            var vID = this.vTaskList[i].getID();
            var vComb = this.vTaskList[i].getParItem() && this.vTaskList[i].getParItem().getGroup() == 2;
            var vCellFormat = "";
            var vTmpDiv_1 = null;
            var vTmpItem = this.vTaskList[i];
            var vCaptClass = null;
            // set cell width only for first row because of table-layout:fixed
            var taskCellWidth = i === 0 ? vColWidth : null;
            if (this.vTaskList[i].getMile() && !vComb) {
                var vTmpRow = (0, draw_utils_1.newNode)(vTmpTBody, "tr", this.vDivId + "childrow_" + vID, "gmileitem gmile" + this.vFormat, null, null, null, this.vTaskList[i].getVisible() == 0 ? "none" : null);
                this.vTaskList[i].setChildRow(vTmpRow);
                (0, events_1.addThisRowListeners)(this, this.vTaskList[i].getListChildRow(), vTmpRow);
                var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, "gtaskcell gtaskcellmile", null, vColWidth, null, null, null);
                vTmpDiv_1 = (0, draw_utils_1.newNode)(vTmpCell, "div", null, "gtaskcelldiv", "\u00A0\u00A0");
                vTmpDiv_1 = (0, draw_utils_1.newNode)(vTmpDiv_1, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer", null, 12, vTaskLeftPx_1 + vTaskRightPx - 6);
                this.vTaskList[i].setBarDiv(vTmpDiv_1);
                var vTmpDiv2 = (0, draw_utils_1.newNode)(vTmpDiv_1, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getClass(), null, 12);
                this.vTaskList[i].setTaskDiv(vTmpDiv2);
                if (this.vTaskList[i].getCompVal() < 100)
                    vTmpDiv2.appendChild(document.createTextNode("\u25CA"));
                else {
                    vTmpDiv2 = (0, draw_utils_1.newNode)(vTmpDiv2, "div", null, "gmilediamond");
                    (0, draw_utils_1.newNode)(vTmpDiv2, "div", null, "gmdtop");
                    (0, draw_utils_1.newNode)(vTmpDiv2, "div", null, "gmdbottom");
                }
                vCaptClass = "gmilecaption";
                if (!vSingleCell && !vComb) {
                    this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                }
            }
            else {
                var vTaskWidth = vTaskRightPx;
                // Draw Group Bar which has outer div with inner group div
                // and several small divs to left and right to create angled-end indicators
                if (this.vTaskList[i].getGroup()) {
                    vTaskWidth = vTaskWidth > this.vMinGpLen && vTaskWidth < this.vMinGpLen * 2 ? this.vMinGpLen * 2 : vTaskWidth; // Expand to show two end points
                    vTaskWidth = vTaskWidth < this.vMinGpLen ? this.vMinGpLen : vTaskWidth; // expand to show one end point
                    var vTmpRow = (0, draw_utils_1.newNode)(vTmpTBody, "tr", this.vDivId + "childrow_" + vID, (this.vTaskList[i].getGroup() == 2 ? "glineitem gitem" : "ggroupitem ggroup") + this.vFormat, null, null, null, this.vTaskList[i].getVisible() == 0 ? "none" : null);
                    this.vTaskList[i].setChildRow(vTmpRow);
                    (0, events_1.addThisRowListeners)(this, this.vTaskList[i].getListChildRow(), vTmpRow);
                    var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, "gtaskcell gtaskcellbar", null, vColWidth, null, null);
                    vTmpDiv_1 = (0, draw_utils_1.newNode)(vTmpCell, "div", null, "gtaskcelldiv", "\u00A0\u00A0");
                    this.vTaskList[i].setCellDiv(vTmpDiv_1);
                    if (this.vTaskList[i].getGroup() == 1) {
                        vTmpDiv_1 = (0, draw_utils_1.newNode)(vTmpDiv_1, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer", null, vTaskWidth, vTaskLeftPx_1);
                        this.vTaskList[i].setBarDiv(vTmpDiv_1);
                        var vTmpDiv2 = (0, draw_utils_1.newNode)(vTmpDiv_1, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getClass(), null, vTaskWidth);
                        this.vTaskList[i].setTaskDiv(vTmpDiv2);
                        (0, draw_utils_1.newNode)(vTmpDiv2, "div", this.vDivId + "complete_" + vID, this.vTaskList[i].getClass() + "complete", null, this.vTaskList[i].getCompStr());
                        (0, draw_utils_1.newNode)(vTmpDiv_1, "div", null, this.vTaskList[i].getClass() + "endpointleft");
                        if (vTaskWidth >= this.vMinGpLen * 2)
                            (0, draw_utils_1.newNode)(vTmpDiv_1, "div", null, this.vTaskList[i].getClass() + "endpointright");
                        vCaptClass = "ggroupcaption";
                    }
                    if (!vSingleCell && !vComb) {
                        this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                    }
                }
                else {
                    vTaskWidth = vTaskWidth <= 0 ? 1 : vTaskWidth;
                    /**
                     * DRAW THE BOXES FOR GANTT
                     */
                    var vTmpDivCell = void 0, vTmpRow = void 0;
                    if (vComb) {
                        vTmpDivCell = vTmpDiv_1 = this.vTaskList[i].getParItem().getCellDiv();
                    }
                    else {
                        // Draw Task Bar which has colored bar div
                        var differentDatesHighlight = "";
                        if (this.vTaskList[i].getEnd() && this.vTaskList[i].getPlanEnd() && this.vTaskList[i].getStart() && this.vTaskList[i].getPlanStart())
                            if (Date.parse(this.vTaskList[i].getEnd()) !== Date.parse(this.vTaskList[i].getPlanEnd()) || Date.parse(this.vTaskList[i].getStart()) !== Date.parse(this.vTaskList[i].getPlanStart()))
                                differentDatesHighlight = "gitemdifferent ";
                        vTmpRow = (0, draw_utils_1.newNode)(vTmpTBody, "tr", this.vDivId + "childrow_" + vID, "glineitem ".concat(differentDatesHighlight, "gitem") + this.vFormat, null, null, null, this.vTaskList[i].getVisible() == 0 ? "none" : null);
                        this.vTaskList[i].setChildRow(vTmpRow);
                        (0, events_1.addThisRowListeners)(this, this.vTaskList[i].getListChildRow(), vTmpRow);
                        var vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, "td", null, "gtaskcell gtaskcellcolorbar", null, taskCellWidth, null, null);
                        vTmpDivCell = vTmpDiv_1 = (0, draw_utils_1.newNode)(vTmpCell, "div", null, "gtaskcelldiv", "\u00A0\u00A0");
                    }
                    // DRAW TASK BAR
                    vTmpDiv_1 = (0, draw_utils_1.newNode)(vTmpDiv_1, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer", null, vTaskWidth, vTaskLeftPx_1);
                    this.vTaskList[i].setBarDiv(vTmpDiv_1);
                    var vTmpDiv2 = void 0;
                    if (this.vTaskList[i].getStartVar()) {
                        // textbar
                        vTmpDiv2 = (0, draw_utils_1.newNode)(vTmpDiv_1, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getClass(), null, vTaskWidth);
                        if (this.vTaskList[i].getBarText()) {
                            (0, draw_utils_1.newNode)(vTmpDiv2, "span", this.vDivId + "tasktextbar_" + vID, "textbar", this.vTaskList[i].getBarText(), this.vTaskList[i].getCompRestStr());
                        }
                        this.vTaskList[i].setTaskDiv(vTmpDiv2);
                    }
                    // PLANNED
                    // If exist and one of them are different, show plan bar... show if there is no real vStart as well (just plan dates)
                    if (vTaskPlanLeftPx && (vTaskPlanLeftPx != vTaskLeftPx_1 || vTaskPlanRightPx != vTaskRightPx || !this.vTaskList[i].getStartVar())) {
                        var vTmpPlanDiv = (0, draw_utils_1.newNode)(vTmpDivCell, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer gplan", null, vTaskPlanRightPx, vTaskPlanLeftPx);
                        var vTmpPlanDiv2 = (0, draw_utils_1.newNode)(vTmpPlanDiv, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getPlanClass() + " gplan", null, vTaskPlanRightPx);
                        this.vTaskList[i].setPlanTaskDiv(vTmpPlanDiv2);
                    }
                    // and opaque completion div
                    if (vTmpDiv2) {
                        (0, draw_utils_1.newNode)(vTmpDiv2, "div", this.vDivId + "complete_" + vID, this.vTaskList[i].getClass() + "complete", null, this.vTaskList[i].getCompStr());
                    }
                    // caption
                    if (vComb)
                        vTmpItem = this.vTaskList[i].getParItem();
                    if (!vComb || (vComb && this.vTaskList[i].getParItem().getEnd() == this.vTaskList[i].getEnd()))
                        vCaptClass = "gcaption";
                    // Background cells
                    if (!vSingleCell && !vComb && vTmpRow) {
                        this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
                    }
                }
            }
            if (this.getCaptionType() && vCaptClass !== null) {
                var vCaptionStr = void 0;
                switch (this.getCaptionType()) {
                    case "Caption":
                        vCaptionStr = vTmpItem.getCaption();
                        break;
                    case "Resource":
                        vCaptionStr = vTmpItem.getResource();
                        break;
                    case "Duration":
                        vCaptionStr = vTmpItem.getDuration(this.vFormat, this.vLangs[this.vLang]);
                        break;
                    case "Complete":
                        vCaptionStr = vTmpItem.getCompStr();
                        break;
                }
                (0, draw_utils_1.newNode)(vTmpDiv_1, "div", null, vCaptClass, vCaptionStr, 120, vCaptClass == "gmilecaption" ? 12 : 0);
            }
            // Add Task Info div for tooltip
            if (this.vTaskList[i].getTaskDiv() && vTmpDiv_1) {
                var vTmpDiv2 = (0, draw_utils_1.newNode)(vTmpDiv_1, "div", this.vDivId + "tt" + vID, null, null, null, null, "none");
                var _a = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate), component = _a.component, callback = _a.callback;
                vTmpDiv2.appendChild(component);
                (0, events_1.addTooltipListeners)(this, this.vTaskList[i].getTaskDiv(), vTmpDiv2, callback);
            }
            // Add Plan Task Info div for tooltip
            if (this.vTaskList[i].getPlanTaskDiv() && vTmpDiv_1) {
                var vTmpDiv2 = (0, draw_utils_1.newNode)(vTmpDiv_1, "div", this.vDivId + "tt" + vID, null, null, null, null, "none");
                var _b = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate), component = _b.component, callback = _b.callback;
                vTmpDiv2.appendChild(component);
                (0, events_1.addTooltipListeners)(this, this.vTaskList[i].getPlanTaskDiv(), vTmpDiv2, callback);
            }
        }
        // Include the footer with the days/week/month...
        if (vSingleCell) {
            var vTmpTFootTRow = (0, draw_utils_1.newNode)(vTmpTFoot, "tr");
            var vTmpTFootTCell = (0, draw_utils_1.newNode)(vTmpTFootTRow, "td", null, null, null, "100%");
            var vTmpTFootTCellTable = (0, draw_utils_1.newNode)(vTmpTFootTCell, "table", null, "gcharttableh", null, "100%");
            var vTmpTFootTCellTableTBody = (0, draw_utils_1.newNode)(vTmpTFootTCellTable, "tbody");
            vTmpTFootTCellTableTBody.appendChild(vDateRow.cloneNode(true));
        }
        else {
            vTmpTFoot.appendChild(vDateRow.cloneNode(true));
        }
        return { vRightTable: vRightTable };
    };
    this.drawColsChart = function (vNumCols, vTmpRow, taskCellWidth, pStartDate, pEndDate) {
        if (pStartDate === void 0) { pStartDate = null; }
        if (pEndDate === void 0) { pEndDate = null; }
        var columnCurrentDay = null;
        // Find the Current day cell to put a different class
        if (this.vShowWeekends && pStartDate && pEndDate && (this.vFormat == "day" || this.vFormat == "week")) {
            var curTaskStart = new Date(pStartDate.getTime());
            var curTaskEnd = new Date();
            var onePeriod = 3600000;
            if (this.vFormat == "day") {
                onePeriod *= 24;
            }
            else if (this.vFormat == "week") {
                onePeriod *= 24 * 7;
            }
            columnCurrentDay = Math.floor((0, general_utils_1.calculateCurrentDateOffset)(curTaskStart, curTaskEnd) / onePeriod) - 1;
        }
        for (var j = 0; j < vNumCols - 1; j++) {
            var vCellFormat = "gtaskcell gtaskcellcols";
            if (this.vShowWeekends && this.vFormat == "day" && (j % 7 == 4 || j % 7 == 5)) {
                vCellFormat = "gtaskcellwkend";
            }
            //When is the column is the current day/week,give a different class
            else if ((this.vFormat == "week" || this.vFormat == "day") && j === columnCurrentDay) {
                vCellFormat = "gtaskcellcurrent";
            }
            (0, draw_utils_1.newNode)(vTmpRow, "td", null, vCellFormat, "\u00A0\u00A0", taskCellWidth);
        }
    };
    /**
     *
     *
     * DRAWING PROCESS
     *
     *  vTaskRightPx,vTaskWidth,vTaskPlanLeftPx,vTaskPlanRightPx,vID
     */
    this.Draw = function () {
        var vMaxDate = new Date();
        var vMinDate = new Date();
        var vColWidth = 0;
        var bd;
        if (this.vEvents && this.vEvents.beforeDraw) {
            this.vEvents.beforeDraw();
        }
        if (this.vDebug) {
            bd = new Date();
            console.info("before draw", bd);
        }
        // Process all tasks, reset parent date and completion % if task list has altered
        if (this.vProcessNeeded)
            (0, task_1.processRows)(this.vTaskList, 0, -1, 1, 1, this.getUseSort(), this.vDebug);
        this.vProcessNeeded = false;
        // get overall min/max dates plus padding
        vMinDate = (0, date_utils_1.getMinDate)(this.vTaskList, this.vFormat, this.getMinDate() && (0, date_utils_1.coerceDate)(this.getMinDate()), this.vFirstDayOfWeek);
        vMaxDate = (0, date_utils_1.getMaxDate)(this.vTaskList, this.vFormat, this.getMaxDate() && (0, date_utils_1.coerceDate)(this.getMaxDate()), this.vFirstDayOfWeek);
        // Calculate chart width variables.
        if (this.vFormat == "day")
            vColWidth = this.vDayColWidth;
        else if (this.vFormat == "week")
            vColWidth = this.vWeekColWidth;
        else if (this.vFormat == "month")
            vColWidth = this.vMonthColWidth;
        else if (this.vFormat == "quarter")
            vColWidth = this.vQuarterColWidth;
        else if (this.vFormat == "hour")
            vColWidth = this.vHourColWidth;
        // DRAW the Left-side of the chart (names, resources, comp%)
        var vLeftHeader = document.createDocumentFragment();
        /**
         * LIST HEAD
         */
        var gListLbl = this.drawListHead(vLeftHeader);
        /**
         * LIST BODY
         */
        var _a = this.drawListBody(vLeftHeader), vNumRows = _a.vNumRows, vTmpContentTabWrapper = _a.vTmpContentTabWrapper;
        /**
         * CHART HEAD
         */
        var _b = this.drawChartHead(vMinDate, vMaxDate, vColWidth, vNumRows), gChartLbl = _b.gChartLbl, vTaskLeftPx = _b.vTaskLeftPx, vSingleCell = _b.vSingleCell, vRightHeader = _b.vRightHeader, vDateRow = _b.vDateRow, vNumCols = _b.vNumCols;
        /**
         * CHART GRID
         */
        var vRightTable = this.drawCharBody(vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl, vMinDate, vMaxDate, vSingleCell, vNumCols, vColWidth, vDateRow).vRightTable;
        if (this.vDebug) {
            var ad = new Date();
            console.info("after tasks loop", ad, ad.getTime() - bd.getTime());
        }
        // MAIN VIEW: Appending all generated components to main view
        while (this.vDiv.hasChildNodes())
            this.vDiv.removeChild(this.vDiv.firstChild);
        var vTmpDiv = (0, draw_utils_1.newNode)(this.vDiv, "div", null, "gchartcontainer");
        vTmpDiv.style.height = this.vTotalHeight;
        var leftvTmpDiv = (0, draw_utils_1.newNode)(vTmpDiv, "div", null, "gmain gmainleft");
        leftvTmpDiv.appendChild(vLeftHeader);
        // leftvTmpDiv.appendChild(vLeftTable);
        var rightvTmpDiv = (0, draw_utils_1.newNode)(vTmpDiv, "div", null, "gmain gmainright");
        rightvTmpDiv.appendChild(vRightHeader);
        rightvTmpDiv.appendChild(vRightTable);
        vTmpDiv.appendChild(leftvTmpDiv);
        vTmpDiv.appendChild(rightvTmpDiv);
        (0, draw_utils_1.newNode)(vTmpDiv, "div", null, "ggridfooter");
        var vTmpDiv2 = (0, draw_utils_1.newNode)(this.getChartBody(), "div", this.vDivId + "Lines", "glinediv");
        if (this.vEvents.onLineContainerHover && typeof this.vEvents.onLineContainerHover === "function") {
            (0, events_1.addListener)("mouseover", this.vEvents.onLineContainerHover, vTmpDiv2);
            (0, events_1.addListener)("mouseout", this.vEvents.onLineContainerHover, vTmpDiv2);
        }
        vTmpDiv2.style.visibility = "hidden";
        this.setLines(vTmpDiv2);
        /* Quick hack to show the generated HTML on older browsers
              let tmpGenSrc=document.createElement('textarea');
              tmpGenSrc.appendChild(document.createTextNode(vTmpDiv.innerHTML));
              vDiv.appendChild(tmpGenSrc);
        //*/
        // LISTENERS: Now all the content exists, register scroll listeners
        (0, events_1.addScrollListeners)(this);
        // SCROLL: now check if we are actually scrolling the pane
        if (this.vScrollTo != "") {
            var vScrollDate = new Date(vMinDate.getTime());
            var vScrollPx = 0;
            if (this.vScrollTo.substr && this.vScrollTo.substr(0, 2) == "px") {
                vScrollPx = parseInt(this.vScrollTo.substr(2));
            }
            else {
                if (this.vScrollTo === "today") {
                    vScrollDate = new Date();
                }
                else if (this.vScrollTo instanceof Date) {
                    vScrollDate = this.vScrollTo;
                }
                else {
                    vScrollDate = (0, date_utils_1.parseDateStr)(this.vScrollTo, this.getDateInputFormat());
                }
                if (this.vFormat == "hour")
                    vScrollDate.setMinutes(0, 0, 0);
                else
                    vScrollDate.setHours(0, 0, 0, 0);
                vScrollPx = (0, general_utils_1.getOffset)(vMinDate, vScrollDate, vColWidth, this.vFormat, this.vShowWeekends, this.vFirstDayOfWeek) - 30;
            }
            this.getChartBody().scrollLeft = vScrollPx;
        }
        if (vMinDate.getTime() <= new Date().getTime() && vMaxDate.getTime() >= new Date().getTime()) {
            this.vTodayPx = (0, general_utils_1.getOffset)(vMinDate, new Date(), vColWidth, this.vFormat, this.vShowWeekends, this.vFirstDayOfWeek);
        }
        else
            this.vTodayPx = -1;
        // DEPENDENCIES: Draw lines of Dependencies
        var bdd;
        if (this.vDebug) {
            bdd = new Date();
            console.info("before DrawDependencies", bdd);
        }
        if (this.vEvents && typeof this.vEvents.beforeLineDraw === "function") {
            this.vEvents.beforeLineDraw();
        }
        this.DrawDependencies(this.vDebug);
        (0, events_1.addListenerDependencies)(this.vLineOptions);
        // EVENTS
        if (this.vEvents && typeof this.vEvents.afterLineDraw === "function") {
            this.vEvents.afterLineDraw();
        }
        if (this.vDebug) {
            var ad = new Date();
            console.info("after DrawDependencies", ad, ad.getTime() - bdd.getTime());
        }
        this.drawComplete(vMinDate, vColWidth, bd);
    };
    /**
     * Actions after all the render process
     */
    this.drawComplete = function (vMinDate, vColWidth, bd) {
        if (this.vDebug) {
            var ad = new Date();
            console.info("after draw", ad, ad.getTime() - bd.getTime());
        }
        (0, events_1.updateGridHeaderWidth)(this);
        this.chartRowDateToX = function (date) {
            return (0, general_utils_1.getOffset)(vMinDate, date, vColWidth, this.vFormat, this.vShowWeekends, this.vFirstDayOfWeek);
        };
        if (this.vEvents && this.vEvents.afterDraw) {
            this.vEvents.afterDraw();
        }
    };
    if (this.vDiv && this.vDiv.nodeName && this.vDiv.nodeName.toLowerCase() == "div")
        this.vDivId = this.vDiv.id;
}; //GanttChart
exports.GanttChart = GanttChart;

},{"./draw_columns":3,"./draw_dependencies":4,"./events":5,"./lang":8,"./options":9,"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13,"./xml":14}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.draw_task_headings = exports.draw_bottom = exports.draw_header = exports.COLUMN_ORDER = void 0;
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
var COLUMNS_TYPES = {
    'vShowRes': 'res',
    'vShowDur': 'dur',
    'vShowComp': 'comp',
    'vShowStartDate': 'startdate',
    'vShowEndDate': 'enddate',
    'vShowPlanStartDate': 'planstartdate',
    'vShowPlanEndDate': 'planenddate',
    'vShowCost': 'cost',
    'vShowAddEntries': 'addentries'
};
var draw_header = function (column, i, vTmpRow, vTaskList, vEditable, vEventsChange, vEvents, vDateTaskTableDisplayFormat, vAdditionalHeaders, vFormat, vLangs, vLang, vResources, Draw) {
    var vTmpCell, vTmpDiv;
    if ('vShowRes' === column) {
        vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, 'gres');
        var text = (0, draw_utils_1.makeInput)(vTaskList[i].getResource(), vEditable, 'resource', vTaskList[i].getResource(), vResources);
        vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setResource(e.target.value); };
        (0, events_1.addListenerInputCell)(vTmpCell, vEventsChange, callback, vTaskList, i, 'res', Draw, 'change');
        (0, events_1.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'res');
    }
    if ('vShowDur' === column) {
        vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, 'gdur');
        var text = (0, draw_utils_1.makeInput)(vTaskList[i].getDuration(vFormat, vLangs[vLang]), vEditable, 'text', vTaskList[i].getDuration());
        vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setDuration(e.target.value); };
        (0, events_1.addListenerInputCell)(vTmpCell, vEventsChange, callback, vTaskList, i, 'dur', Draw);
        (0, events_1.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'dur');
    }
    if ('vShowComp' === column) {
        vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, 'gcomp');
        var text = (0, draw_utils_1.makeInput)(vTaskList[i].getCompStr(), vEditable, 'percentage', vTaskList[i].getCompVal());
        vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { task.setComp(e.target.value); task.setCompVal(e.target.value); };
        (0, events_1.addListenerInputCell)(vTmpCell, vEventsChange, callback, vTaskList, i, 'comp', Draw);
        (0, events_1.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'comp');
    }
    if ('vShowStartDate' === column) {
        vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, 'gstartdate');
        var v = (0, date_utils_1.formatDateStr)(vTaskList[i].getStartVar(), vDateTaskTableDisplayFormat, vLangs[vLang]);
        var text = (0, draw_utils_1.makeInput)(v, vEditable, 'date', vTaskList[i].getStartVar());
        vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setStart(e.target.value); };
        (0, events_1.addListenerInputCell)(vTmpCell, vEventsChange, callback, vTaskList, i, 'start', Draw);
        (0, events_1.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'start');
    }
    if ('vShowEndDate' === column) {
        vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, 'genddate');
        var v = (0, date_utils_1.formatDateStr)(vTaskList[i].getEndVar(), vDateTaskTableDisplayFormat, vLangs[vLang]);
        var text = (0, draw_utils_1.makeInput)(v, vEditable, 'date', vTaskList[i].getEndVar());
        vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setEnd(e.target.value); };
        (0, events_1.addListenerInputCell)(vTmpCell, vEventsChange, callback, vTaskList, i, 'end', Draw);
        (0, events_1.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'end');
    }
    if ('vShowPlanStartDate' === column) {
        vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, 'gplanstartdate');
        var v = vTaskList[i].getPlanStart() ? (0, date_utils_1.formatDateStr)(vTaskList[i].getPlanStart(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
        var text = (0, draw_utils_1.makeInput)(v, vEditable, 'date', vTaskList[i].getPlanStart());
        vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setPlanStart(e.target.value); };
        (0, events_1.addListenerInputCell)(vTmpCell, vEventsChange, callback, vTaskList, i, 'planstart', Draw);
        (0, events_1.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'planstart');
    }
    if ('vShowPlanEndDate' === column) {
        vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, 'gplanenddate');
        var v = vTaskList[i].getPlanEnd() ? (0, date_utils_1.formatDateStr)(vTaskList[i].getPlanEnd(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';
        var text = (0, draw_utils_1.makeInput)(v, vEditable, 'date', vTaskList[i].getPlanEnd());
        vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setPlanEnd(e.target.value); };
        (0, events_1.addListenerInputCell)(vTmpCell, vEventsChange, callback, vTaskList, i, 'planend', Draw);
        (0, events_1.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'planend');
    }
    if ('vShowCost' === column) {
        vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, 'gcost');
        var text = (0, draw_utils_1.makeInput)(vTaskList[i].getCost(), vEditable, 'cost');
        vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell, 'div', null, null, text);
        var callback = function (task, e) { return task.setCost(e.target.value); };
        (0, events_1.addListenerInputCell)(vTmpCell, vEventsChange, callback, vTaskList, i, 'cost', Draw);
        (0, events_1.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'cost');
    }
    if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var css = header.class ? header.class : "gadditional-".concat(key);
            var data = vTaskList[i].getDataObject();
            vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, "gadditional ".concat(css));
            vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell, 'div', null, null, data ? data[key] : '');
            (0, events_1.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], "additional_".concat(key));
            // const callback = (task, e) => task.setCost(e.target.value);
            // addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'costdate');
        }
    }
    if ('vShowAddEntries' === column) {
        vTmpCell = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, 'gaddentries');
        var button = "<button>+</button>";
        vTmpDiv = (0, draw_utils_1.newNode)(vTmpCell, 'div', null, null, button);
        var callback = function (task, e) {
            (0, task_1.AddTaskItemObject)({
                vParent: task.getParent()
            });
        };
        (0, events_1.addListenerInputCell)(vTmpCell, vEventsChange, callback, vTaskList, i, 'addentries', Draw.bind(this));
        (0, events_1.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'addentries');
    }
};
exports.draw_header = draw_header;
var draw_bottom = function (column, vTmpRow, vAdditionalHeaders) {
    if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var css = header.class ? header.class : "gadditional-".concat(key);
            (0, draw_utils_1.newNode)(vTmpRow, 'td', null, "gspanning gadditional ".concat(css), '\u00A0');
        }
    }
    else {
        var type = COLUMNS_TYPES[column];
        (0, draw_utils_1.newNode)(vTmpRow, 'td', null, "gspanning g".concat(type), '\u00A0');
    }
};
exports.draw_bottom = draw_bottom;
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
var draw_task_headings = function (column, vTmpRow, vLangs, vLang, vAdditionalHeaders, vEvents) {
    var nodeCreated;
    if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
        for (var key in vAdditionalHeaders) {
            var header = vAdditionalHeaders[key];
            var text = header.translate ? vLangs[vLang][header.translate] : header.title;
            var css = header.class ? header.class : "gadditional-".concat(key);
            nodeCreated = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, "gtaskheading gadditional ".concat(css), text);
        }
    }
    else {
        var type = COLUMNS_TYPES[column];
        nodeCreated = (0, draw_utils_1.newNode)(vTmpRow, 'td', null, "gtaskheading g".concat(type), vLangs[vLang][type]);
        (0, events_1.addListenerClickCell)(nodeCreated, vEvents, { hader: true, column: column }, type);
    }
};
exports.draw_task_headings = draw_task_headings;

},{"./events":5,"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawDependencies = exports.drawDependency = void 0;
var drawDependency = function (x1, y1, x2, y2, pType, pClass) {
    var vDir = 1;
    var vBend = false;
    var vShort = 4;
    var vRow = Math.floor(this.getRowHeight() / 2);
    if (y2 < y1)
        vRow *= -1;
    switch (pType) {
        case 'SF':
            vShort *= -1;
            if (x1 - 10 <= x2 && y1 != y2)
                vBend = true;
            vDir = -1;
            break;
        case 'SS':
            if (x1 < x2)
                vShort *= -1;
            else
                vShort = x2 - x1 - (2 * vShort);
            break;
        case 'FF':
            if (x1 <= x2)
                vShort = x2 - x1 + (2 * vShort);
            vDir = -1;
            break;
        default:
            if (x1 + 10 >= x2 && y1 != y2)
                vBend = true;
            break;
    }
    if (vBend) {
        this.sLine(x1, y1, x1 + vShort, y1, pClass);
        this.sLine(x1 + vShort, y1, x1 + vShort, y2 - vRow, pClass);
        this.sLine(x1 + vShort, y2 - vRow, x2 - (vShort * 2), y2 - vRow, pClass);
        this.sLine(x2 - (vShort * 2), y2 - vRow, x2 - (vShort * 2), y2, pClass);
        this.sLine(x2 - (vShort * 2), y2, x2 - (1 * vDir), y2, pClass);
    }
    else if (y1 != y2) {
        this.sLine(x1, y1, x1 + vShort, y1, pClass);
        this.sLine(x1 + vShort, y1, x1 + vShort, y2, pClass);
        this.sLine(x1 + vShort, y2, x2 - (1 * vDir), y2, pClass);
    }
    else
        this.sLine(x1, y1, x2 - (1 * vDir), y2, pClass);
    var vTmpDiv = this.sLine(x2, y2, x2 - 3 - ((vDir < 0) ? 1 : 0), y2 - 3 - ((vDir < 0) ? 1 : 0), pClass + "Arw");
    vTmpDiv.style.width = '0px';
    vTmpDiv.style.height = '0px';
};
exports.drawDependency = drawDependency;
var DrawDependencies = function (vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    if (this.getShowDeps() == 1) {
        this.CalcTaskXY(); //First recalculate the x,y
        this.clearDependencies();
        var vList = this.getList();
        for (var i = 0; i < vList.length; i++) {
            var vDepend = vList[i].getDepend();
            var vDependType = vList[i].getDepType();
            var n = vDepend.length;
            if (n > 0 && vList[i].getVisible() == 1) {
                for (var k = 0; k < n; k++) {
                    var vTask = this.getArrayLocationByID(vDepend[k]);
                    if (vTask >= 0 && vList[vTask].getGroup() != 2) {
                        if (vList[vTask].getVisible() == 1) {
                            if (vDebug) {
                                console.info("init drawDependency ", vList[vTask].getID(), new Date());
                            }
                            var cssClass = 'gDepId' + vList[vTask].getID() +
                                ' ' + 'gDepNextId' + vList[i].getID();
                            var dependedData = vList[vTask].getDataObject();
                            var nextDependedData = vList[i].getDataObject();
                            if (dependedData && dependedData.pID && nextDependedData && nextDependedData.pID) {
                                cssClass += ' gDepDataId' + dependedData.pID + ' ' + 'gDepNextDataId' + nextDependedData.pID;
                            }
                            if (vDependType[k] == 'SS')
                                this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'SS', cssClass + ' gDepSS');
                            else if (vDependType[k] == 'FF')
                                this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getEndX(), vList[i].getEndY(), 'FF', cssClass + ' gDepFF');
                            else if (vDependType[k] == 'SF')
                                this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getEndX(), vList[i].getEndY(), 'SF', cssClass + ' gDepSF');
                            else if (vDependType[k] == 'FS')
                                this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'FS', cssClass + ' gDepFS');
                        }
                    }
                }
            }
        }
    }
    // draw the current date line
    if (this.vTodayPx >= 0) {
        this.sLine(this.vTodayPx, 0, this.vTodayPx, this.getChartTable().offsetHeight - 1, 'gCurDate');
    }
};
exports.DrawDependencies = DrawDependencies;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addListenerDependencies = exports.addListenerInputCell = exports.addListenerClickCell = exports.addScrollListeners = exports.addFormatListeners = exports.addFolderListeners = exports.updateGridHeaderWidth = exports.addThisRowListeners = exports.addTooltipListeners = exports.syncScroll = exports.removeListener = exports.addListener = exports.showToolTip = exports.mouseOut = exports.mouseOver = exports.show = exports.hide = exports.folder = void 0;
var general_utils_1 = require("./utils/general_utils");
// Function to open/close and hide/show children of specified task
var folder = function (pID, ganttObj) {
    var vList = ganttObj.getList();
    ganttObj.clearDependencies(); // clear these first so slow rendering doesn't look odd
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getID() == pID) {
            if (vList[i].getOpen() == 1) {
                vList[i].setOpen(0);
                (0, exports.hide)(pID, ganttObj);
                if ((0, general_utils_1.isIE)())
                    vList[i].getGroupSpan().innerText = '+';
                else
                    vList[i].getGroupSpan().textContent = '+';
            }
            else {
                vList[i].setOpen(1);
                (0, exports.show)(pID, 1, ganttObj);
                if ((0, general_utils_1.isIE)())
                    vList[i].getGroupSpan().innerText = '-';
                else
                    vList[i].getGroupSpan().textContent = '-';
            }
        }
    }
    var bd;
    if (this.vDebug) {
        bd = new Date();
        console.info('after drawDependency', bd);
    }
    ganttObj.DrawDependencies(this.vDebug);
    if (this.vDebug) {
        var ad = new Date();
        console.info('after drawDependency', ad, (ad.getTime() - bd.getTime()));
    }
};
exports.folder = folder;
var hide = function (pID, ganttObj) {
    var vList = ganttObj.getList();
    var vID = 0;
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            vID = vList[i].getID();
            // it's unlikely but if the task list has been updated since
            // the chart was drawn some of the rows may not exist
            if (vList[i].getListChildRow())
                vList[i].getListChildRow().style.display = 'none';
            if (vList[i].getChildRow())
                vList[i].getChildRow().style.display = 'none';
            vList[i].setVisible(0);
            if (vList[i].getGroup())
                (0, exports.hide)(vID, ganttObj);
        }
    }
};
exports.hide = hide;
// Function to show children of specified task
var show = function (pID, pTop, ganttObj) {
    var vList = ganttObj.getList();
    var vID = 0;
    var vState = '';
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            if (!vList[i].getParItem()) {
                console.error("Cant find parent on who event (maybe problems with Task ID and Parent Id mixes?)");
            }
            if (vList[i].getParItem().getGroupSpan()) {
                if ((0, general_utils_1.isIE)())
                    vState = vList[i].getParItem().getGroupSpan().innerText;
                else
                    vState = vList[i].getParItem().getGroupSpan().textContent;
            }
            i = vList.length;
        }
    }
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            var vChgState = false;
            vID = vList[i].getID();
            if (pTop == 1 && vState == '+')
                vChgState = true;
            else if (vState == '-')
                vChgState = true;
            else if (vList[i].getParItem() && vList[i].getParItem().getGroup() == 2)
                vList[i].setVisible(1);
            if (vChgState) {
                if (vList[i].getListChildRow())
                    vList[i].getListChildRow().style.display = '';
                if (vList[i].getChildRow())
                    vList[i].getChildRow().style.display = '';
                vList[i].setVisible(1);
            }
            if (vList[i].getGroup())
                (0, exports.show)(vID, 0, ganttObj);
        }
    }
};
exports.show = show;
var mouseOver = function (pObj1, pObj2) {
    if (this.getUseRowHlt()) {
        pObj1.className += ' gitemhighlight';
        pObj2.className += ' gitemhighlight';
    }
};
exports.mouseOver = mouseOver;
var mouseOut = function (pObj1, pObj2) {
    if (this.getUseRowHlt()) {
        pObj1.className = pObj1.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
        pObj2.className = pObj2.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
    }
};
exports.mouseOut = mouseOut;
var showToolTip = function (pGanttChartObj, e, pContents, pWidth, pTimer) {
    var vTtDivId = pGanttChartObj.getDivId() + 'JSGanttToolTip';
    var vMaxW = 500;
    var vMaxAlpha = 100;
    var vShowing = pContents.id;
    if (pGanttChartObj.getUseToolTip()) {
        if (pGanttChartObj.vTool == null) {
            pGanttChartObj.vTool = document.createElement('div');
            pGanttChartObj.vTool.id = vTtDivId;
            pGanttChartObj.vTool.className = 'JSGanttToolTip';
            pGanttChartObj.vTool.vToolCont = document.createElement('div');
            pGanttChartObj.vTool.vToolCont.id = vTtDivId + 'cont';
            pGanttChartObj.vTool.vToolCont.className = 'JSGanttToolTipcont';
            pGanttChartObj.vTool.vToolCont.setAttribute('showing', '');
            pGanttChartObj.vTool.appendChild(pGanttChartObj.vTool.vToolCont);
            document.body.appendChild(pGanttChartObj.vTool);
            pGanttChartObj.vTool.style.opacity = 0;
            pGanttChartObj.vTool.setAttribute('currentOpacity', 0);
            pGanttChartObj.vTool.setAttribute('fadeIncrement', 10);
            pGanttChartObj.vTool.setAttribute('moveSpeed', 10);
            pGanttChartObj.vTool.style.filter = 'alpha(opacity=0)';
            pGanttChartObj.vTool.style.visibility = 'hidden';
            pGanttChartObj.vTool.style.left = Math.floor(((e) ? e.clientX : window.event.clientX) / 2) + 'px';
            pGanttChartObj.vTool.style.top = Math.floor(((e) ? e.clientY : window.event.clientY) / 2) + 'px';
            (0, exports.addListener)('mouseover', function () { clearTimeout(pGanttChartObj.vTool.delayTimeout); }, pGanttChartObj.vTool);
            (0, exports.addListener)('mouseout', function () { (0, general_utils_1.delayedHide)(pGanttChartObj, pGanttChartObj.vTool, pTimer); }, pGanttChartObj.vTool);
        }
        clearTimeout(pGanttChartObj.vTool.delayTimeout);
        var newHTML = pContents.innerHTML;
        if (pGanttChartObj.vTool.vToolCont.getAttribute("content") !== newHTML) {
            pGanttChartObj.vTool.vToolCont.innerHTML = pContents.innerHTML;
            // as we are allowing arbitrary HTML we should remove any tag ids to prevent duplication
            (0, general_utils_1.stripIds)(pGanttChartObj.vTool.vToolCont);
            pGanttChartObj.vTool.vToolCont.setAttribute("content", newHTML);
        }
        if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing || pGanttChartObj.vTool.style.visibility != 'visible') {
            if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing) {
                pGanttChartObj.vTool.vToolCont.setAttribute('showing', vShowing);
            }
            pGanttChartObj.vTool.style.visibility = 'visible';
            // Rather than follow the mouse just have it stay put
            (0, general_utils_1.updateFlyingObj)(e, pGanttChartObj, pTimer);
            pGanttChartObj.vTool.style.width = (pWidth) ? pWidth + 'px' : 'auto';
            if (!pWidth && (0, general_utils_1.isIE)()) {
                pGanttChartObj.vTool.style.width = pGanttChartObj.vTool.offsetWidth;
            }
            if (pGanttChartObj.vTool.offsetWidth > vMaxW) {
                pGanttChartObj.vTool.style.width = vMaxW + 'px';
            }
        }
        if (pGanttChartObj.getUseFade()) {
            clearInterval(pGanttChartObj.vTool.fadeInterval);
            pGanttChartObj.vTool.fadeInterval = setInterval(function () { (0, general_utils_1.fadeToolTip)(1, pGanttChartObj.vTool, vMaxAlpha); }, pTimer);
        }
        else {
            pGanttChartObj.vTool.style.opacity = vMaxAlpha * 0.01;
            pGanttChartObj.vTool.style.filter = 'alpha(opacity=' + vMaxAlpha + ')';
        }
    }
};
exports.showToolTip = showToolTip;
var addListener = function (eventName, handler, control) {
    // Check if control is a string
    if (control === String(control))
        control = (0, general_utils_1.findObj)(control);
    if (control.addEventListener) //Standard W3C
     {
        return control.addEventListener(eventName, handler, false);
    }
    else if (control.attachEvent) //IExplore
     {
        return control.attachEvent('on' + eventName, handler);
    }
    else {
        return false;
    }
};
exports.addListener = addListener;
var removeListener = function (eventName, handler, control) {
    // Check if control is a string
    if (control === String(control))
        control = (0, general_utils_1.findObj)(control);
    if (control.removeEventListener) {
        //Standard W3C
        return control.removeEventListener(eventName, handler, false);
    }
    else if (control.detachEvent) {
        //IExplore
        return control.attachEvent('on' + eventName, handler);
    }
    else {
        return false;
    }
};
exports.removeListener = removeListener;
var syncScroll = function (elements, attrName) {
    var syncFlags = new Map(elements.map(function (e) { return [e, false]; }));
    function scrollEvent(e) {
        if (!syncFlags.get(e.target)) {
            for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
                var el = elements_2[_i];
                if (el !== e.target) {
                    syncFlags.set(el, true);
                    el[attrName] = e.target[attrName];
                }
            }
        }
        syncFlags.set(e.target, false);
    }
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var el = elements_1[_i];
        el.addEventListener('scroll', scrollEvent);
    }
};
exports.syncScroll = syncScroll;
var addTooltipListeners = function (pGanttChart, pObj1, pObj2, callback) {
    var isShowingTooltip = false;
    (0, exports.addListener)('mouseover', function (e) {
        if (isShowingTooltip || !callback) {
            (0, exports.showToolTip)(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
        }
        else if (callback) {
            isShowingTooltip = true;
            var promise = callback();
            (0, exports.showToolTip)(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
            if (promise && promise.then) {
                promise.then(function () {
                    if (pGanttChart.vTool.vToolCont.getAttribute('showing') === pObj2.id &&
                        pGanttChart.vTool.style.visibility === 'visible') {
                        (0, exports.showToolTip)(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
                    }
                });
            }
        }
    }, pObj1);
    (0, exports.addListener)('mouseout', function (e) {
        var outTo = e.relatedTarget;
        if ((0, general_utils_1.isParentElementOrSelf)(outTo, pObj1) || (pGanttChart.vTool && (0, general_utils_1.isParentElementOrSelf)(outTo, pGanttChart.vTool))) {
            // not actually out
        }
        else {
            isShowingTooltip = false;
        }
        (0, general_utils_1.delayedHide)(pGanttChart, pGanttChart.vTool, pGanttChart.getTimer());
    }, pObj1);
};
exports.addTooltipListeners = addTooltipListeners;
var addThisRowListeners = function (pGanttChart, pObj1, pObj2) {
    (0, exports.addListener)('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj1);
    (0, exports.addListener)('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj2);
    (0, exports.addListener)('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj1);
    (0, exports.addListener)('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj2);
};
exports.addThisRowListeners = addThisRowListeners;
var updateGridHeaderWidth = function (pGanttChart) {
    var head = pGanttChart.getChartHead();
    var body = pGanttChart.getChartBody();
    if (!head || !body)
        return;
    var isScrollVisible = body.scrollHeight > body.clientHeight;
    if (isScrollVisible) {
        head.style.width = "calc(100% - ".concat((0, general_utils_1.getScrollbarWidth)(), "px)");
    }
    else {
        head.style.width = '100%';
    }
};
exports.updateGridHeaderWidth = updateGridHeaderWidth;
var addFolderListeners = function (pGanttChart, pObj, pID) {
    (0, exports.addListener)('click', function () {
        (0, exports.folder)(pID, pGanttChart);
        (0, exports.updateGridHeaderWidth)(pGanttChart);
    }, pObj);
};
exports.addFolderListeners = addFolderListeners;
var addFormatListeners = function (pGanttChart, pFormat, pObj) {
    (0, exports.addListener)('click', function () { (0, general_utils_1.changeFormat)(pFormat, pGanttChart); }, pObj);
};
exports.addFormatListeners = addFormatListeners;
var addScrollListeners = function (pGanttChart) {
    (0, exports.addListener)('resize', function () { pGanttChart.getChartHead().scrollLeft = pGanttChart.getChartBody().scrollLeft; }, window);
    (0, exports.addListener)('resize', function () {
        pGanttChart.getListBody().scrollTop = pGanttChart.getChartBody().scrollTop;
    }, window);
};
exports.addScrollListeners = addScrollListeners;
var addListenerClickCell = function (vTmpCell, vEvents, task, column) {
    (0, exports.addListener)('click', function (e) {
        if (e.target.classList.contains('gfoldercollapse') === false &&
            vEvents[column] && typeof vEvents[column] === 'function') {
            vEvents[column](task, e, vTmpCell, column);
        }
    }, vTmpCell);
};
exports.addListenerClickCell = addListenerClickCell;
var addListenerInputCell = function (vTmpCell, vEventsChange, callback, tasks, index, column, draw, event) {
    if (draw === void 0) { draw = null; }
    if (event === void 0) { event = 'blur'; }
    var task = tasks[index];
    if (vTmpCell.children[0] && vTmpCell.children[0].children && vTmpCell.children[0].children[0]) {
        var tagName = vTmpCell.children[0].children[0].tagName;
        var selectInputOrButton = tagName === 'SELECT' || tagName === 'INPUT' || tagName === 'BUTTON';
        if (selectInputOrButton) {
            (0, exports.addListener)(event, function (e) {
                if (callback) {
                    callback(task, e);
                }
                if (vEventsChange[column] && typeof vEventsChange[column] === 'function') {
                    var q = vEventsChange[column](tasks, task, e, vTmpCell, vColumnsNames[column]);
                    if (q && q.then) {
                        q.then(function (e) { return draw(); });
                    }
                    else {
                        draw();
                    }
                }
                else {
                    draw();
                }
            }, vTmpCell.children[0].children[0]);
        }
    }
};
exports.addListenerInputCell = addListenerInputCell;
var addListenerDependencies = function (vLineOptions) {
    var elements = document.querySelectorAll('.gtaskbarcontainer');
    for (var i = 0; i < elements.length; i++) {
        var taskDiv = elements[i];
        taskDiv.addEventListener('mouseover', function (e) {
            toggleDependencies(e, vLineOptions);
        });
        taskDiv.addEventListener('mouseout', function (e) {
            toggleDependencies(e, vLineOptions);
        });
    }
};
exports.addListenerDependencies = addListenerDependencies;
var toggleDependencies = function (e, vLineOptions) {
    var target = e.currentTarget;
    var ids = target.getAttribute('id').split('_');
    var style = vLineOptions && vLineOptions.borderStyleHover !== undefined ? vLineOptions.hoverStyle : 'groove';
    if (e.type === 'mouseout') {
        style = '';
    }
    if (ids.length > 1) {
        var frameZones = Array.from(document.querySelectorAll(".gDepId".concat(ids[1])));
        frameZones.forEach(function (c) {
            c.style.borderStyle = style;
        });
        // document.querySelectorAll(`.gDepId${ids[1]}`).forEach((c: any) => {
        // c.style.borderStyle = style;
        // });
    }
};
var vColumnsNames = {
    taskname: 'pName',
    res: 'pRes',
    dur: '',
    comp: 'pComp',
    start: 'pStart',
    end: 'pEnd',
    planstart: 'pPlanStart',
    planend: 'pPlanEnd',
    link: 'pLink',
    cost: 'pCost',
    mile: 'pMile',
    group: 'pGroup',
    parent: 'pParent',
    open: 'pOpen',
    depend: 'pDepend',
    caption: 'pCaption',
    note: 'pNotes'
};

},{"./utils/general_utils":13}],6:[function(require,module,exports){
"use strict";
/*
    * Copyright (c) 2013-2018, Paul Geldart, Eduardo Rodrigues, Ricardo Cardoso and Mario Mol.
    *
    * Redistribution and use in source and binary forms, with or without
    * modification, are permitted provided that the following conditions are met:
    *     * Redistributions of source code must retain the above copyright
    *       notice, this list of conditions and the following disclaimer.
    *     * Redistributions in binary form must reproduce the above copyright
    *       notice, this list of conditions and the following disclaimer in the
    *       documentation and/or other materials provided with the distribution.
    *     * Neither the name of AUTHORS nor the names of its contributors
    *       may be used to endorse or promote products derived from this software
    *       without specific prior written permission.
    *
    * THIS SOFTWARE IS PROVIDED BY THE AUTHORS ''AS IS'' AND ANY EXPRESS OR
    * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
    * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
    * IN NO EVENT SHALL AUTHORS BE LIABLE FOR ANY DIRECT,
    * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    This project is based on jsGantt 1.2, (which can be obtained from
    https://code.google.com/p/jsgantt/) and remains under the original BSD license.
    Copyright (c) 2009, Shlomy Gantz BlueBrick Inc.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSGantt = void 0;
var events_1 = require("./events");
var general_utils_1 = require("./utils/general_utils");
var xml_1 = require("./xml");
var task_1 = require("./task");
var draw_1 = require("./draw");
var json_1 = require("./json");
var date_utils_1 = require("./utils/date_utils");
if (!exports.JSGantt)
    exports.JSGantt = {};
exports.JSGantt.isIE = general_utils_1.isIE;
exports.JSGantt.TaskItem = task_1.TaskItem;
exports.JSGantt.GanttChart = draw_1.GanttChart;
exports.JSGantt.updateFlyingObj = general_utils_1.updateFlyingObj;
exports.JSGantt.showToolTip = events_1.showToolTip;
exports.JSGantt.stripIds = general_utils_1.stripIds;
exports.JSGantt.stripUnwanted = general_utils_1.stripUnwanted;
exports.JSGantt.delayedHide = general_utils_1.delayedHide;
exports.JSGantt.hideToolTip = general_utils_1.hideToolTip;
exports.JSGantt.fadeToolTip = general_utils_1.fadeToolTip;
exports.JSGantt.moveToolTip = general_utils_1.moveToolTip;
exports.JSGantt.getZoomFactor = general_utils_1.getZoomFactor;
exports.JSGantt.getOffset = general_utils_1.getOffset;
exports.JSGantt.getScrollPositions = general_utils_1.getScrollPositions;
exports.JSGantt.processRows = task_1.processRows;
exports.JSGantt.sortTasks = task_1.sortTasks;
// Used to determine the minimum date of all tasks and set lower bound based on format
exports.JSGantt.getMinDate = date_utils_1.getMinDate;
// Used to determine the maximum date of all tasks and set upper bound based on format
exports.JSGantt.getMaxDate = date_utils_1.getMaxDate;
// This function finds the document id of the specified object
exports.JSGantt.findObj = general_utils_1.findObj;
exports.JSGantt.changeFormat = general_utils_1.changeFormat;
// Tasks
exports.JSGantt.folder = events_1.folder;
exports.JSGantt.hide = events_1.hide;
exports.JSGantt.show = events_1.show;
exports.JSGantt.taskLink = task_1.taskLink;
exports.JSGantt.parseDateStr = date_utils_1.parseDateStr;
exports.JSGantt.formatDateStr = date_utils_1.formatDateStr;
exports.JSGantt.parseDateFormatStr = date_utils_1.parseDateFormatStr;
// XML 
exports.JSGantt.parseXML = xml_1.parseXML;
exports.JSGantt.parseXMLString = xml_1.parseXMLString;
exports.JSGantt.findXMLNode = xml_1.findXMLNode;
exports.JSGantt.getXMLNodeValue = xml_1.getXMLNodeValue;
exports.JSGantt.AddXMLTask = xml_1.AddXMLTask;
// JSON
exports.JSGantt.parseJSON = json_1.parseJSON;
exports.JSGantt.parseJSONString = json_1.parseJSONString;
exports.JSGantt.addJSONTask = json_1.addJSONTask;
exports.JSGantt.benchMark = general_utils_1.benchMark;
exports.JSGantt.getIsoWeek = date_utils_1.getIsoWeek;
exports.JSGantt.addListener = events_1.addListener;
exports.JSGantt.addTooltipListeners = events_1.addTooltipListeners;
exports.JSGantt.addThisRowListeners = events_1.addThisRowListeners;
exports.JSGantt.addFolderListeners = events_1.addFolderListeners;
exports.JSGantt.addFormatListeners = events_1.addFormatListeners;
exports.JSGantt.addScrollListeners = events_1.addScrollListeners;
exports.JSGantt.criticalPath = general_utils_1.criticalPath;

},{"./draw":2,"./events":5,"./json":7,"./task":10,"./utils/date_utils":11,"./utils/general_utils":13,"./xml":14}],7:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addJSONTask = exports.parseJSONString = exports.parseJSON = void 0;
var task_1 = require("./task");
var general_utils_1 = require("./utils/general_utils");
/**
 *
 * @param pFile
 * @param pGanttlet
 */
var parseJSON = function (pFile, pGanttVar, vDebug, redrawAfter) {
    if (vDebug === void 0) { vDebug = false; }
    if (redrawAfter === void 0) { redrawAfter = true; }
    return __awaiter(this, void 0, void 0, function () {
        var jsonObj, bd, ad;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, general_utils_1.makeRequest)(pFile, true, true)];
                case 1:
                    jsonObj = _a.sent();
                    if (vDebug) {
                        bd = new Date();
                        console.info('before jsonparse', bd);
                    }
                    (0, exports.addJSONTask)(pGanttVar, jsonObj);
                    if (this.vDebug) {
                        ad = new Date();
                        console.info('after addJSONTask', ad, (ad.getTime() - bd.getTime()));
                    }
                    if (redrawAfter) {
                        pGanttVar.Draw();
                    }
                    return [2 /*return*/, jsonObj];
            }
        });
    });
};
exports.parseJSON = parseJSON;
var parseJSONString = function (pStr, pGanttVar) {
    (0, exports.addJSONTask)(pGanttVar, JSON.parse(pStr));
};
exports.parseJSONString = parseJSONString;
var addJSONTask = function (pGanttVar, pJsonObj) {
    for (var index = 0; index < pJsonObj.length; index++) {
        var id = void 0;
        var name_1 = void 0;
        var start = void 0;
        var end = void 0;
        var planstart = void 0;
        var planend = void 0;
        var itemClass = void 0;
        var planClass = void 0;
        var link = '';
        var milestone = 0;
        var resourceName = '';
        var completion = void 0;
        var group = 0;
        var parent_1 = void 0;
        var open_1 = void 0;
        var dependsOn = '';
        var caption = '';
        var notes = '';
        var cost = void 0;
        var duration = '';
        var bartext = '';
        var additionalObject = {};
        for (var prop in pJsonObj[index]) {
            var property = prop;
            var value = pJsonObj[index][property];
            switch (property.toLowerCase()) {
                case 'pid':
                case 'id':
                    id = value;
                    break;
                case 'pname':
                case 'name':
                    name_1 = value;
                    break;
                case 'pstart':
                case 'start':
                    start = value;
                    break;
                case 'pend':
                case 'end':
                    end = value;
                    break;
                case 'pplanstart':
                case 'planstart':
                    planstart = value;
                    break;
                case 'pplanend':
                case 'planend':
                    planend = value;
                    break;
                case 'pclass':
                case 'class':
                    itemClass = value;
                    break;
                case 'pplanclass':
                case 'planclass':
                    planClass = value;
                    break;
                case 'plink':
                case 'link':
                    link = value;
                    break;
                case 'pmile':
                case 'mile':
                    milestone = value;
                    break;
                case 'pres':
                case 'res':
                    resourceName = value;
                    break;
                case 'pcomp':
                case 'comp':
                    completion = value;
                    break;
                case 'pgroup':
                case 'group':
                    group = value;
                    break;
                case 'pparent':
                case 'parent':
                    parent_1 = value;
                    break;
                case 'popen':
                case 'open':
                    open_1 = value;
                    break;
                case 'pdepend':
                case 'depend':
                    dependsOn = value;
                    break;
                case 'pcaption':
                case 'caption':
                    caption = value;
                    break;
                case 'pnotes':
                case 'notes':
                    notes = value;
                    break;
                case 'pcost':
                case 'cost':
                    cost = value;
                    break;
                case 'duration':
                case 'pduration':
                    duration = value;
                    break;
                case 'bartext':
                case 'pbartext':
                    bartext = value;
                    break;
                default:
                    additionalObject[property.toLowerCase()] = value;
            }
        }
        //if (id != undefined && !isNaN(parseInt(id)) && isFinite(id) && name && start && end && itemClass && completion != undefined && !isNaN(parseFloat(completion)) && isFinite(completion) && !isNaN(parseInt(parent)) && isFinite(parent)) {
        pGanttVar.AddTaskItem(new task_1.TaskItem(id, name_1, start, end, itemClass, link, milestone, resourceName, completion, group, parent_1, open_1, dependsOn, caption, notes, pGanttVar, cost, planstart, planend, duration, bartext, additionalObject, planClass));
        //}
    }
};
exports.addJSONTask = addJSONTask;

},{"./task":10,"./utils/general_utils":13}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ua = exports.tr = exports.sv = exports.ru = exports.pt = exports.pl = exports.nl = exports.ko = exports.ja = exports.id = exports.it = exports.hu = exports.he = exports.fr = exports.fi = exports.de = exports.es = exports.en = exports.cs = exports.cn = exports.scn = exports.ar = void 0;
var ar = {
    'format': 'التنسيق',
    'hour': 'ساعة',
    'day': 'يوم',
    'week': 'أسبوع',
    'month': 'شهر',
    'quarter': 'ربع',
    'hours': 'ساعات',
    'days': 'أيام',
    'weeks': 'أسابيع',
    'months': 'أشهر',
    'quarters': 'أرباع',
    'hr': 'س',
    'dy': 'يو',
    'wk': 'أ',
    'mth': 'ش',
    'qtr': 'ر',
    'hrs': 'س',
    'dys': 'ي',
    'wks': 'أ',
    'mths': 'ش',
    'qtrs': 'ر',
    'res': 'الموارد',
    'dur': 'المدة',
    'comp': '% الإنجاز',
    'completion': 'الإنجاز',
    'startdate': 'تاريخ البدء',
    'planstartdate': 'تاريخ بدء الخطة',
    'enddate': 'تاريخ الانتهاء',
    'planenddate': 'تاريخ نهاية الخطة',
    'cost': 'التكلفة',
    'moreinfo': 'مزيد من المعلومات',
    'nodata': 'لم يتم العثور على مهام',
    'notes': 'ملاحظات',
    'january': 'يناير',
    'february': 'فبراير',
    'march': 'مارس',
    'april': 'أبريل',
    'maylong': 'مايو',
    'june': 'يونيو',
    'july': 'يوليو',
    'august': 'أغسطس',
    'september': 'سبتمبر',
    'october': 'أكتوبر',
    'november': 'نوفمبر',
    'december': 'ديسمبر',
    'jan': 'يناير',
    'feb': 'فبراير',
    'mar': 'مارس',
    'apr': 'أبريل',
    'may': 'مايو',
    'jun': 'يونيو',
    'jul': 'يوليو',
    'aug': 'أغسطس',
    'sep': 'سبتمبر',
    'oct': 'أكتوبر',
    'nov': 'نوفمبر',
    'dec': 'ديسمبر',
    'sunday': 'الأحد',
    'monday': 'الإثنين',
    'tuesday': 'الثلاثاء',
    'wednesday': 'الأربعاء',
    'thursday': 'الخميس',
    'friday': 'الجمعة',
    'saturday': 'السبت',
    'sun': 'الأحد',
    'mon': 'الإثنين',
    'tue': 'الثلاثاء',
    'wed': 'الأربعاء',
    'thu': 'الخميس',
    'fri': 'الجمعة',
    'sat': 'السبت',
    'tooltipLoading': 'جاري التحميل...'
};
exports.ar = ar;
var scn = {
    'january': '一月',
    'february': '二月',
    'march': '三月',
    'april': '四月',
    'maylong': '五月',
    'june': '六月',
    'july': '七月',
    'august': '八月',
    'september': '九月',
    'october': '十月',
    'november': '十一月',
    'december': '十二月',
    'jan': '一月',
    'feb': '二月',
    'mar': '三月',
    'apr': '四月',
    'may': '五月',
    'jun': '六月',
    'jul': '七月',
    'aug': '八月',
    'sep': '九月',
    'oct': '十月',
    'nov': '十一月',
    'dec': '十二月',
    'sunday': '星期日',
    'monday': '星期一',
    'tuesday': '星期二',
    'wednesday': '星期三',
    'thursday': '星期四',
    'friday': '星期五',
    'saturday': '星期六',
    'sun': '星期日',
    'mon': '星期一',
    'tue': '星期二',
    'wed': '星期三',
    'thu': '星期四',
    'fri': '星期五',
    'sat': '星期六',
    'res': '资源',
    'dur': '时长',
    'comp': '完成度',
    'completion': '完成',
    'startdate': '起始日期',
    'planstartdate': '计划起始日期',
    'enddate': '截止日期',
    'planenddate': '计划截止日期',
    'cost': '成本',
    'moreinfo': "更多信息",
    'nodata': 'No tasks found',
    'notes': '备注',
    'format': '格式',
    'hour': '时',
    'day': '日',
    'week': '星期',
    'month': '月',
    'quarter': '季',
    'hours': '小时',
    'days': '天',
    'weeks': '周',
    'months': '月',
    'quarters': '季',
    'hr': '小时',
    'dy': '天',
    'wk': '周',
    'mth': '月',
    'qtr': '季',
    'hrs': '小时',
    'dys': '天',
    'wks': '周',
    'mths': '月',
    'qtrs': '季'
};
exports.scn = scn;
var cn = {
    'january': '一月',
    'february': '二月',
    'march': '三月',
    'april': '四月',
    'maylong': '五月',
    'june': '六月',
    'july': '七月',
    'august': '八月',
    'september': '九月',
    'october': '十月',
    'november': '十一月',
    'december': '十二月',
    'jan': '一月',
    'feb': '二月',
    'mar': '三月',
    'apr': '四月',
    'may': '五月',
    'jun': '六月',
    'jul': '七月',
    'aug': '八月',
    'sep': '九月',
    'oct': '十月',
    'nov': '十一月',
    'dec': '十二月',
    'sunday': '星期日',
    'monday': '星期一',
    'tuesday': '星期二',
    'wednesday': '星期三',
    'thursday': '星期四',
    'friday': '星期五',
    'saturday': '星期六',
    'sun': '星期日',
    'mon': '星期一',
    'tue': '星期二',
    'wed': '星期三',
    'thu': '星期四',
    'fri': '星期五',
    'sat': '星期六',
    'res': '資源',
    'dur': '時程',
    'comp': '達成率',
    'completion': '達成',
    'startdate': '起始日期',
    'planstartdate': '計劃起始日期',
    'enddate': '截止日期',
    'planenddate': '計劃截止日期',
    'cost': '成本',
    'moreinfo': "更多資訊",
    'nodata': 'No tasks found',
    'notes': '備註',
    'format': '格式',
    'hour': '時',
    'day': '日',
    'week': '星期',
    'month': '月',
    'quarter': '季',
    'hours': '小時',
    'days': '天',
    'weeks': '週',
    'months': '月',
    'quarters': '季',
    'hr': '小時',
    'dy': '天',
    'wk': '週',
    'mth': '月',
    'qtr': '季',
    'hrs': '小時',
    'dys': '天',
    'wks': '週',
    'mths': '月',
    'qtrs': '季'
};
exports.cn = cn;
var cs = {
    'format': 'Zobrazení',
    'hour': 'Hodina',
    'day': 'Den',
    'week': 'Týden',
    'month': 'Měsíc',
    'quarter': 'Kvartál',
    'hours': 'Hodiny',
    'days': 'Dni',
    'weeks': 'Týdny',
    'months': 'Měsíce',
    'quarters': 'Kvartály',
    'hr': 'Ho',
    'dy': 'Den',
    'wk': 'Tyd',
    'mth': 'Měs',
    'qtr': 'Kvar',
    'hrs': 'Ho',
    'dys': 'Dni',
    'wks': 'Tyd',
    'mths': 'Měs',
    'qtrs': 'Kvar',
    'res': 'Přiřazeno',
    'dur': 'Trvání',
    'comp': '% Hotovo',
    'completion': 'Hotovo',
    'startdate': 'Start',
    'planstartdate': 'Plánovaný start',
    'enddate': 'Konec',
    'planenddate': 'Plánovaný konec',
    'cost': 'Náklady',
    'moreinfo': 'Více informací',
    'nodata': 'No tasks found',
    'notes': 'Poznámky',
    'january': 'Leden',
    'february': 'Únor',
    'march': 'Březen',
    'april': 'Duben',
    'maylong': 'Květen',
    'june': 'Červen',
    'july': 'Červenec',
    'august': 'Srpen',
    'september': 'Září',
    'october': 'Říjen',
    'november': 'Listopad',
    'december': 'Prosinec',
    'jan': 'Led',
    'feb': 'Úno',
    'mar': 'Bře',
    'apr': 'Dub',
    'may': 'Kvě',
    'jun': 'Čer',
    'jul': 'Čvc',
    'aug': 'Srp',
    'sep': 'Zář',
    'oct': 'Říj',
    'nov': 'Lis',
    'dec': 'Pro',
    'sunday': 'Neděle',
    'monday': 'Pondělí',
    'tuesday': 'Úterý',
    'wednesday': 'Středa',
    'thursday': 'Čtvrtek',
    'friday': 'Pátek',
    'saturday': 'Sobota',
    'sun': 'Ne',
    'mon': 'Po',
    'tue': 'Út',
    'wed': 'St',
    'thu': 'Čt',
    'fri': 'Pa',
    'sat': 'So',
    'tooltipLoading': 'Nahrávám...'
};
exports.cs = cs;
var de = {
    'format': 'Ansicht',
    'hour': 'Stunde',
    'day': 'Tag',
    'week': 'Woche',
    'month': 'Monat',
    'quarter': 'Quartal',
    'hours': 'Stunden',
    'days': 'Tage',
    'weeks': 'Wochen',
    'months': 'Monate',
    'quarters': 'Quartale',
    'hr': 'h',
    'dy': 'T',
    'wk': 'W',
    'mth': 'M',
    'qtr': 'Q',
    'hrs': 'Std',
    'dys': 'Tage',
    'wks': 'Wochen',
    'mths': 'Monate',
    'qtrs': 'Quartal',
    'res': 'Resource',
    'dur': 'Dauer',
    'comp': '%Fertig',
    'completion': 'Fertigstellung',
    'startdate': 'Erste Buchu',
    'planstartdate': 'Erste Buchu Plan',
    'enddate': 'Letzte Buchung',
    'planenddate': 'Plan Letzte Buchung',
    'cost': 'Cost',
    'moreinfo': 'Weitere Infos',
    'nodata': 'No tasks found',
    'notes': 'Anmerkung',
    'january': 'Jänner',
    'february': 'Februar',
    'march': 'März',
    'april': 'April',
    'maylong': 'Mai',
    'june': 'Juni',
    'july': 'Juli',
    'august': 'August',
    'september': 'September',
    'october': 'Oktober',
    'november': 'November',
    'december': 'Dezember',
    'jan': 'Jan',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Apr',
    'may': 'Mai',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Aug',
    'sep': 'Sep',
    'oct': 'Okt',
    'nov': 'Nov',
    'dec': 'Dez',
    'sunday': 'Sonntag',
    'monday': 'Montag',
    'tuesday': 'Dienstag',
    'wednesday': 'Mittwoch',
    'thursday': 'Donnerstag',
    'friday': 'Freitag',
    'saturday': 'Samstag',
    'sun': 'So',
    'mon': 'Mo', 'tue': 'Di', 'wed': 'Mi', 'thu': 'Do', 'fri': 'Fr', 'sat': 'Sa'
};
exports.de = de;
var es = {
    'january': 'Enero',
    'february': 'Febrero',
    'march': 'Marzo',
    'april': 'Abril',
    'maylong': 'Mayo',
    'june': 'Junio',
    'july': 'Julio',
    'august': 'Agosto',
    'september': 'Septiembre',
    'october': 'Octubre',
    'november': 'Noviembre',
    'december': 'Diciembre',
    'jan': 'Ene',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Abr',
    'may': 'May',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Ago',
    'sep': 'Sep',
    'oct': 'Oct',
    'nov': 'Nov',
    'dec': 'Dic',
    'sunday': 'Domingo',
    'monday': 'Lunes',
    'tuesday': 'Martes',
    'wednesday': 'Miércoles',
    'thursday': 'Jueves',
    'friday': 'Viernes',
    'saturday': 'Sábado',
    'sun': '	Dom',
    'mon': '	Lun',
    'tue': '	Mar',
    'wed': '	Mie',
    'thu': '	Jue',
    'fri': '	Vie',
    'sat': '	Sab',
    'res': 'Recurso',
    'dur': 'Duración',
    'comp': '% Compl.',
    'completion': 'Completado',
    'startdate': 'Inicio',
    'planstartdate': 'Inicio Planificado',
    'cost': 'Coste',
    'enddate': 'Fin',
    'planenddate': 'Fin Planificado',
    'moreinfo': 'Más Información',
    'nodata': 'No tasks found',
    'notes': 'Notas',
    'format': 'Formato',
    'hour': 'Hora',
    'day': 'Día',
    'week': 'Semana',
    'month': 'Mes',
    'quarter': 'Trimestre',
    'hours': 'Horas',
    'days': 'Días',
    'weeks': 'Semanas',
    'months': 'Meses',
    'quarters': 'Trimestres',
    'hr': 'h',
    'dy': 'Día',
    'wk': 'Sem.',
    'mth': 'Mes',
    'qtr': 'Trim.',
    'hrs': 'h',
    'dys': 'Días',
    'wks': 'Sem.',
    'mths': 'Meses',
    'qtrs': 'Trim.',
    'tooltipLoading': 'Cargando...'
};
exports.es = es;
var en = {
    'format': 'Format',
    'hour': 'Hour',
    'day': 'Day',
    'week': 'Week',
    'month': 'Month',
    'quarter': 'Quarter',
    'hours': 'Hours',
    'days': 'Days',
    'weeks': 'Weeks',
    'months': 'Months',
    'quarters': 'Quarters',
    'hr': 'Hr',
    'dy': 'Day',
    'wk': 'Wk',
    'mth': 'Mth',
    'qtr': 'Qtr',
    'hrs': 'Hrs',
    'dys': 'Days',
    'wks': 'Wks',
    'mths': 'Mths',
    'qtrs': 'Qtrs',
    'res': 'Resource',
    'dur': 'Duration',
    'comp': '% Comp.',
    'completion': 'Completion',
    'startdate': 'Start Date',
    'planstartdate': 'Plan Start Date',
    'enddate': 'End Date',
    'planenddate': 'Plan End Date',
    'cost': 'Cost',
    'moreinfo': 'More Information',
    'nodata': 'No tasks found',
    'notes': 'Notes',
    'january': 'January',
    'february': 'February',
    'march': 'March',
    'april': 'April',
    'maylong': 'May',
    'june': 'June',
    'july': 'July',
    'august': 'August',
    'september': 'September',
    'october': 'October',
    'november': 'November',
    'december': 'December',
    'jan': 'Jan',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Apr',
    'may': 'May',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Aug',
    'sep': 'Sep',
    'oct': 'Oct',
    'nov': 'Nov',
    'dec': 'Dec',
    'sunday': 'Sunday',
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sun': 'Sun',
    'mon': 'Mon',
    'tue': 'Tue',
    'wed': 'Wed',
    'thu': 'Thu',
    'fri': 'Fri',
    'sat': 'Sat',
    'tooltipLoading': 'Loading...'
};
exports.en = en;
var fi = {
    'format': 'Näkymä',
    'hour': 'Tunti',
    'day': 'Päivä',
    'week': 'Viikko',
    'month': 'Kuukausi',
    'quarter': 'Kvartaali',
    'hours': 'Tunnit',
    'days': 'Päivät',
    'weeks': 'Viikot',
    'months': 'Kuukaudet',
    'quarters': 'Kvartaalit',
    'hr': 't',
    'dy': 'pv',
    'wk': 'vk',
    'mth': 'kk',
    'qtr': 'Q',
    'hrs': 't:t',
    'dys': 'pv:t',
    'wks': 'vk:t',
    'mths': 'kk:t',
    'qtrs': 'Kvartaalit',
    'res': 'Henkilö',
    'dur': 'Kesto',
    'comp': '% Valm.',
    'completion': 'Valmius',
    'startdate': 'Alkupäivä',
    'planstartdate': 'Suunniteltu alkupäivä',
    'enddate': 'Päättymispäivä',
    'planenddate': 'Suunniteltu päättymispäivä',
    'cost': 'Kustannus',
    'moreinfo': 'Lisätieto',
    'nodata': 'Tehtäviä ei löydy',
    'notes': 'Muistiinpanot',
    'january': 'Tammikuu',
    'february': 'Helmikuu',
    'march': 'Maaliskuu',
    'april': 'Huhtikuu',
    'maylong': 'Toukokuu',
    'june': 'Kesäkuu',
    'july': 'Heinäkuu',
    'august': 'Elokuu',
    'september': 'Syyskuu',
    'october': 'Lokakuu',
    'november': 'Marraskuu',
    'december': 'Joulukuu',
    'jan': 'Tammi',
    'feb': 'Helmi',
    'mar': 'Maalis',
    'apr': 'Huhti',
    'may': 'Touko',
    'jun': 'Kesä',
    'jul': 'Heinä',
    'aug': 'Elo',
    'sep': 'Syys',
    'oct': 'Loka',
    'nov': 'Marras',
    'dec': 'Joulu',
    'sunday': 'Sunnuntai',
    'monday': 'Maanantai',
    'tuesday': 'Tiista',
    'wednesday': 'Keskiviikko',
    'thursday': 'Torstai',
    'friday': 'Perjantai',
    'saturday': 'Lauantai',
    'sun': 'Su',
    'mon': 'Ma',
    'tue': 'Ti',
    'wed': 'Ke',
    'thu': 'To',
    'fri': 'Pe',
    'sat': 'La',
    'tooltipLoading': 'Ladataan...'
};
exports.fi = fi;
/**
 * Mois : http://bdl.oqlf.gouv.qc.ca/bdl/gabarit_bdl.asp?id=3619
   Jours : http://bdl.oqlf.gouv.qc.ca/bdl/gabarit_bdl.asp?id=3617
 */
var fr = {
    'january': 'Janvier',
    'february': 'Février',
    'march': 'Mars',
    'april': 'Avril',
    'maylong': 'Mai',
    'june': 'Juin',
    'july': 'Juillet',
    'august': 'Août',
    'september': 'Septembre',
    'october': 'Octobre',
    'november': 'Novembre',
    'december': 'Décembre',
    'jan': 'Janv',
    'feb': 'Févr',
    'mar': 'Mars',
    'apr': 'Avr',
    'may': 'Mai',
    'jun': 'Juin',
    'jul': 'Juil',
    'aug': 'Août',
    'sep': 'Sept',
    'oct': 'Oct',
    'nov': 'Nov',
    'dec': 'Déc',
    'sunday': 'Dimanche',
    'monday': 'Lundi',
    'tuesday': 'Mardi',
    'wednesday': 'Mercredi',
    'thursday': 'Jeudi',
    'friday': 'Vendredi',
    'saturday': 'Samedi',
    'sun': 'Dim',
    'mon': 'Lun',
    'tue': 'Mar',
    'wed': 'Mer',
    'thu': 'Jeu',
    'fri': 'Ven',
    'sat': 'Sam',
    'res': 'Ressource',
    'dur': 'Durée',
    'comp': '% Term.',
    'completion': 'Terminé',
    'startdate': 'Début',
    'planstartdate': 'Plan Début',
    'enddate': 'Fin',
    'planenddate': 'Plan Fin',
    'cost': 'Cost',
    'moreinfo': "Plus d'informations",
    'nodata': 'No tasks found',
    'notes': 'Notes',
    'format': 'Format',
    'hour': 'Heure',
    'day': 'Jour',
    'week': 'Semaine',
    'month': 'Mois',
    'quarter': 'Trimestre',
    'hours': 'Heures',
    'days': 'Jours',
    'weeks': 'Semaines',
    'months': 'Mois',
    'quarters': 'Trimestres',
    'hr': 'h',
    'dy': 'j',
    'wk': 'sem',
    'mth': 'mois',
    'qtr': 'tri',
    'hrs': 'h',
    'dys': 'j',
    'wks': 'sem',
    'mths': 'mois',
    'qtrs': 'tri'
};
exports.fr = fr;
var he = {
    'format': 'תבנית',
    'hour': 'שעה',
    'day': 'יום',
    'week': 'שבוע',
    'month': 'חודש',
    'quarter': 'רבעון',
    'hours': 'שעות',
    'days': 'ימים',
    'weeks': 'שבועות',
    'months': 'חודשים',
    'quarters': 'רבעונים',
    'hr': 'שעה',
    'dy': 'יום',
    'wk': 'שבוע',
    'mth': 'חודש',
    'qtr': 'רבעון',
    'hrs': 'שעות',
    'dys': 'ימים',
    'wks': 'שבועות',
    'mths': 'חודשים',
    'qtrs': 'רבעונים',
    'res': 'משאב',
    'dur': 'משך',
    'comp': '% השלמה',
    'completion': 'השלמה',
    'startdate': 'תאריך התחלה',
    'planstartdate': 'תאריך התחלה מתוכנן',
    'enddate': 'תאריך סיום',
    'planenddate': 'תאריך סיום מתוכנן',
    'cost': 'עלות',
    'moreinfo': 'מידע נוסף',
    'nodata': 'לא נמצאו משימות',
    'notes': 'הערות',
    'january': 'ינואר',
    'february': 'פברואר',
    'march': 'מרץ',
    'april': 'אפריל',
    'maylong': 'מאי',
    'june': 'יוני',
    'july': 'יולי',
    'august': 'אוגוסט',
    'september': 'ספטמבר',
    'october': 'אוקטובר',
    'november': 'נובמבר',
    'december': 'דצמבר',
    'jan': 'ינו',
    'feb': 'פבר',
    'mar': 'מרץ',
    'apr': 'אפר',
    'may': 'מאי',
    'jun': 'יוני',
    'jul': 'יולי',
    'aug': 'אוג',
    'sep': 'ספט',
    'oct': 'אוק',
    'nov': 'נוב',
    'dec': 'דצמ',
    'sunday': 'יום ראשון',
    'monday': 'יום שני',
    'tuesday': 'יום שלישי',
    'wednesday': 'יום רביעי',
    'thursday': 'الخميس',
    'friday': 'الجمعة',
    'saturday': 'السبت',
    'sun': 'الأحد',
    'mon': 'الإثنين',
    'tue': 'الثلاثاء',
    'wed': 'الأربعاء',
    'thu': 'الخميس',
    'fri': 'الجمعة',
    'sat': 'السبت',
    'tooltipLoading': 'جارٍ التحميل...'
};
exports.he = he;
var it = {
    'format': 'Formato',
    'hour': 'Ora',
    'day': 'Giorno',
    'week': 'Settimana',
    'month': 'Mese',
    'quarter': 'Trimestre',
    'hours': 'Ore',
    'days': 'Giorni',
    'weeks': 'Mesi',
    'months': 'Settimane',
    'quarters': 'Trimestri',
    'hr': 'Ora',
    'dy': 'G',
    'wk': 'Sett.',
    'mth': 'Mese',
    'qtr': 'Trim.',
    'hrs': 'Ora',
    'dys': 'GG',
    'wks': 'Sett.',
    'mths': 'Mesi',
    'qtrs': 'Trim.',
    'res': 'Risorsa',
    'dur': 'Durata',
    'comp': '% Compl.',
    'completion': 'Completamento',
    'startdate': 'Data inizio',
    'planstartdate': 'Piano data inizio',
    'enddate': 'Data fine',
    'planenddate': 'Piano data fine',
    'cost': 'Costo',
    'moreinfo': 'Più informazioni',
    'nodata': 'Nessun task trovato',
    'notes': 'Note',
    'january': 'Gennaio',
    'february': 'Febbraio',
    'march': 'Marzo',
    'april': 'Aprile',
    'maylong': 'Maggio',
    'june': 'Giugno',
    'july': 'Luglio',
    'august': 'Agosto',
    'september': 'Settembre',
    'october': 'Ottobre',
    'november': 'Novembre',
    'december': 'Dicembre',
    'jan': 'Gen',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Apr',
    'may': 'Mag',
    'jun': 'Giu',
    'jul': 'Lug',
    'aug': 'Ago',
    'sep': 'Set',
    'oct': 'Ott',
    'nov': 'Nov',
    'dec': 'Dic',
    'sunday': 'Domenica',
    'monday': 'Lunedì',
    'tuesday': 'Martedì',
    'wednesday': 'Mercoledì',
    'thursday': 'Giovedì',
    'friday': 'Venerdì',
    'saturday': 'Sabato',
    'sun': 'Dom',
    'mon': 'Lun',
    'tue': 'Mar',
    'wed': 'Mer',
    'thu': 'Gio',
    'fri': 'Ven',
    'sat': 'Sab',
    'tooltipLoading': 'Caricamento...'
};
exports.it = it;
var hu = {
    'format': 'Formátum',
    'hour': 'Óra',
    'day': 'Nap',
    'week': 'Hét',
    'month': 'Hónap',
    'quarter': 'Negyedév ',
    'hours': 'Órák',
    'days': 'Nap',
    'weeks': 'Hét',
    'months': 'Hónap',
    'quarters': 'Negyedév',
    'hr': 'Ó',
    'dy': 'Nap',
    'wk': 'Hét',
    'mth': 'Hó',
    'qtr': 'NÉ',
    'hrs': 'Óra',
    'dys': 'Nap',
    'wks': 'Hét',
    'mths': 'Hó',
    'qtrs': 'NÉ',
    'res': 'Erőforrás',
    'dur': 'Időtartam',
    'comp': '% Kész',
    'completion': 'Elkészült',
    'startdate': 'Kezdés',
    'planstartdate': 'Tervezett kezdés',
    'enddate': 'Befejezés',
    'planenddate': 'Tervezett befejezés',
    'cost': 'Költség',
    'moreinfo': 'További információ',
    'nodata': 'No tasks found',
    'notes': 'Jegyzetek',
    'january': 'Január',
    'february': 'Február',
    'march': 'Március',
    'april': 'Április',
    'maylong': 'Május',
    'june': 'Június',
    'july': 'Július',
    'august': 'Augusztus',
    'september': 'Szeptember',
    'october': 'Október',
    'november': 'November',
    'december': 'December',
    'jan': 'Jan',
    'feb': 'Feb',
    'mar': 'Már',
    'apr': 'Ápr',
    'may': 'Máj',
    'jun': 'Jún',
    'jul': 'Júl',
    'aug': 'Aug',
    'sep': 'Szep',
    'oct': 'Okt',
    'nov': 'Nov',
    'dec': 'Dec',
    'sunday': 'Vasárnap',
    'monday': 'Hétfő',
    'tuesday': 'Kedd',
    'wednesday': 'Szerda',
    'thursday': 'Csütörtök',
    'friday': 'Péntek',
    'saturday': 'Szombat',
    'sun': 'Vas',
    'mon': 'Hé',
    'tue': 'Ke',
    'wed': 'Sze',
    'thu': 'Csü',
    'fri': 'Pén',
    'sat': 'Szo',
    'tooltipLoading': 'Belöltés...'
};
exports.hu = hu;
var id = {
    'format': 'Format',
    'hour': 'Jam',
    'day': 'Hari',
    'week': 'Minggu',
    'month': 'Bulan',
    'quarter': 'Kuartal',
    'hours': 'Jam',
    'days': 'Hari',
    'weeks': 'Minggu',
    'months': 'Bulan',
    'quarters': 'Kuartal',
    'hr': 'Jam',
    'dy': 'Hari',
    'wk': 'Min',
    'mth': 'Bln',
    'qtr': 'Krtl',
    'hrs': 'Jam',
    'dys': 'Hari',
    'wks': 'Min',
    'mths': 'Bln',
    'qtrs': 'Krtl',
    'res': 'Sumber Daya',
    'dur': 'Durasi',
    'comp': '% Penyelesaian',
    'completion': 'Penyelesaian',
    'startdate': 'Tanggal Mulai',
    'planstartdate': 'Perencanaan Tanggal Mulai',
    'enddate': 'Tanggal Akhir',
    'planenddate': 'Perencanaan Tanggal Akhir',
    'cost': 'Biaya',
    'moreinfo': 'Informasi Lebih Lanjut',
    'nodata': 'No tasks found',
    'notes': 'Catatan',
    'january': 'Januari',
    'february': 'Februari',
    'march': 'Maret',
    'april': 'April',
    'maylong': 'Mei',
    'june': 'Juni',
    'july': 'Juli',
    'august': 'Agustus',
    'september': 'September',
    'october': 'Oktober',
    'november': 'November',
    'december': 'Desember',
    'jan': 'Jan',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Apr',
    'may': 'Mei',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Agu',
    'sep': 'Sep',
    'oct': 'Okt',
    'nov': 'Nov',
    'dec': 'Des',
    'sunday': 'Minggu',
    'monday': 'Senin',
    'tuesday': 'Selasa',
    'wednesday': 'Rabu',
    'thursday': 'Kamis',
    'friday': 'Jumat',
    'saturday': 'Sabtu',
    'sun': 'Min',
    'mon': 'Sen',
    'tue': 'Sel',
    'wed': 'Rab',
    'thu': 'Kam',
    'fri': 'Jum',
    'sat': 'Sab'
};
exports.id = id;
var ja = {
    'format': 'タイムライン表示',
    'hour': '時',
    'day': '日',
    'week': '週',
    'month': '月',
    'quarter': '四半期',
    'hours': '時間',
    'days': '日間',
    'weeks': '週間',
    'months': '月間',
    'quarters': '四半期',
    'hr': '時',
    'dy': '日',
    'wk': '週',
    'mth': '月',
    'qtr': '四',
    'hrs': '時間',
    'dys': '日間',
    'wks': '週間',
    'mths': '月間',
    'qtrs': '四半期',
    'res': 'リソース',
    'dur': '期間',
    'comp': '進捗率',
    'completion': '進捗率',
    'startdate': '開始日',
    'planstartdate': '予定開始日',
    'enddate': '期日',
    'planenddate': '予定期日',
    'cost': 'コスト',
    'moreinfo': '詳細',
    'nodata': 'No tasks found',
    'notes': 'ノート',
    'january': '1月',
    'february': '2月',
    'march': '3月',
    'april': '4月',
    'maylong': '5月',
    'june': '6月',
    'july': '7月',
    'august': '8月',
    'september': '9月',
    'october': '10月',
    'november': '11月',
    'december': '12月',
    'jan': '1月',
    'feb': '2月',
    'mar': '3月',
    'apr': '4月',
    'may': '5月',
    'jun': '6月',
    'jul': '7月',
    'aug': '8月',
    'sep': '9月',
    'oct': '10月',
    'nov': '11月',
    'dec': '12月',
    'sunday': '日曜日',
    'monday': '月曜日',
    'tuesday': '火曜日',
    'wednesday': '水曜日',
    'thursday': '木曜日',
    'friday': '金曜日',
    'saturday': '土曜日',
    'sun': '日',
    'mon': '月',
    'tue': '火',
    'wed': '水',
    'thu': '木',
    'fri': '金',
    'sat': '土',
    'tooltipLoading': 'ローディング中...'
};
exports.ja = ja;
var ko = {
    'format': '구분',
    'hour': '시',
    'day': '일',
    'week': '주',
    'month': '월',
    'quarter': '분기',
    'hours': '시',
    'days': '일',
    'weeks': '주',
    'months': '월',
    'quarters': '분기',
    'hr': '시',
    'dy': '일',
    'wk': '주',
    'mth': '월',
    'qtr': '분기',
    'hrs': '시',
    'dys': '일',
    'wks': '주',
    'mths': '월',
    'qtrs': '분기',
    'res': '이름',
    'dur': '기간',
    'comp': '% ',
    'completion': '완료',
    'startdate': '시작일자',
    'planstartdate': '계획 시작일자',
    'enddate': '종료일자',
    'planenddate': '계획 종료일자',
    'cost': '비용',
    'moreinfo': '더 많은 정보',
    'nodata': 'No tasks found',
    'notes': '비고',
    'january': '1월',
    'february': '2월',
    'march': '3월',
    'april': '4월',
    'maylong': '5월',
    'june': '6월',
    'july': '7월',
    'august': '8월',
    'september': '9월',
    'october': '10월',
    'november': '11월',
    'december': '12월',
    'jan': '1',
    'feb': '2',
    'mar': '3',
    'apr': '4',
    'may': '5',
    'jun': '6',
    'jul': '7',
    'aug': '8',
    'sep': '9',
    'oct': '10',
    'nov': '11',
    'dec': '12',
    'sunday': '일요일',
    'monday': '월요일',
    'tuesday': '화요일',
    'wednesday': '수요일',
    'thursday': '목요일',
    'friday': '금요일',
    'saturday': '토요일',
    'sun': '일',
    'mon': '월',
    'tue': '화',
    'wed': '수',
    'thu': '목',
    'fri': '금',
    'sat': '토',
    'tooltipLoading': '로딩중...'
};
exports.ko = ko;
var nl = {
    'format': 'Format',
    'hour': 'Uur',
    'day': 'Dag',
    'week': 'Week',
    'month': 'Maand',
    'quarter': 'Kwartaal',
    'hours': 'Uren',
    'days': 'Dagen',
    'weeks': 'Weken',
    'months': 'Maanden',
    'quarters': 'Kwartalen',
    'hr': 'uur',
    'dy': 'dag',
    'wk': 'wk',
    'mth': 'mnd',
    'qtr': 'kw',
    'hrs': 'uren',
    'dys': 'dagen',
    'wks': 'weken',
    'mths': 'maanden',
    'qtrs': 'kwartalen',
    'res': 'Resource',
    'dur': 'Doorlooptijd',
    'comp': '% gereed',
    'completion': 'Gereed',
    'startdate': 'Startdatum',
    'planstartdate': 'Geplande startdatum',
    'enddate': 'Einddatum',
    'planenddate': 'Geplande einddatum',
    'cost': 'Kosten',
    'moreinfo': 'Meer informatie',
    'nodata': 'Geen taken gevonden',
    'notes': 'Notities',
    'january': 'januari',
    'february': 'februari',
    'march': 'maart',
    'april': 'april',
    'maylong': 'mei',
    'june': 'juni',
    'july': 'juli',
    'august': 'augustus',
    'september': 'september',
    'october': 'oktober',
    'november': 'november',
    'december': 'december',
    'jan': 'jan',
    'feb': 'feb',
    'mar': 'mrt',
    'apr': 'apr',
    'may': 'mei',
    'jun': 'jun',
    'jul': 'jul',
    'aug': 'aug',
    'sep': 'sep',
    'oct': 'okt',
    'nov': 'nov',
    'dec': 'dec',
    'sunday': 'zondag',
    'monday': 'maandag',
    'tuesday': 'dinsdag',
    'wednesday': 'woensdag',
    'thursday': 'donderdag',
    'friday': 'vrijdag',
    'saturday': 'zaterdag',
    'sun': 'zo',
    'mon': 'ma',
    'tue': 'di',
    'wed': 'wo',
    'thu': 'do',
    'fri': 'vr',
    'sat': 'za'
};
exports.nl = nl;
var pl = {
    'format': 'Format',
    'hour': 'Godzina',
    'day': 'Dzień',
    'week': 'Tydzień',
    'month': 'Miesiąc',
    'quarter': 'Kwartał',
    'hours': 'Godziny',
    'days': 'Dni',
    'weeks': 'Tygodni',
    'months': 'Miesięcy',
    'quarters': 'Kwartały',
    'hr': 'godz.',
    'dy': 'd.',
    'wk': 'tydz.',
    'mth': 'mies.',
    'qtr': 'kw.',
    'hrs': 'godz.',
    'dys': 'd.',
    'wks': 'tyg.',
    'mths': 'mies.',
    'qtrs': 'kw.',
    'res': 'Zasób',
    'dur': 'Czas trwania',
    'comp': '% Komp.',
    'completion': 'Ukończenie',
    'startdate': 'Data Startu',
    'planstartdate': 'Planowana Data Startu',
    'enddate': 'Data Zakończenia',
    'planenddate': 'Planowana Data Zakończenia',
    'cost': 'Koszt',
    'moreinfo': 'Więcej Inormacji',
    'nodata': 'Nie znaleziono zadań',
    'notes': 'Dodatkowe Informacje',
    'january': 'Styczeń',
    'february': 'Luty',
    'march': 'Marzec',
    'april': 'Kwiecień',
    'maylong': 'Maj',
    'june': 'Czerwiec',
    'july': 'Lipiec',
    'august': 'Sierpień',
    'september': 'Wrzesień',
    'october': 'Październik',
    'november': 'Listopad',
    'december': 'Grudzień',
    'jan': 'St',
    'feb': 'Lut',
    'mar': 'Mar',
    'apr': 'Kw',
    'may': 'Maj',
    'jun': 'Cz',
    'jul': 'Lip',
    'aug': 'Sier',
    'sep': 'Wrz',
    'oct': 'Paź',
    'nov': 'Lis',
    'dec': 'Gr',
    'sunday': 'Niedziela',
    'monday': 'Poniedziałek',
    'tuesday': 'Wtorek',
    'wednesday': 'Środa',
    'thursday': 'Czwartek',
    'friday': 'Piątek',
    'saturday': 'Sobota',
    'sun': 'Nd',
    'mon': 'Pon',
    'tue': 'Wt',
    'wed': 'Śr',
    'thu': 'Czw',
    'fri': 'Pt',
    'sat': 'So',
    'tooltipLoading': 'Ładowanie...'
};
exports.pl = pl;
var pt = {
    'hours': 'Horas',
    'days': 'Dias',
    'weeks': 'Weeks',
    'months': 'Months',
    'quarters': 'Quarters',
    'format': 'Formato',
    'hour': 'Hora',
    'day': 'Dia',
    'week': 'Semana',
    'month': 'Mês',
    'quarter': 'Trimestre',
    'hr': 'hr',
    'dy': 'dia',
    'wk': 'sem.',
    'mth': 'mês',
    'qtr': 'qtr',
    'hrs': 'hrs',
    'dys': 'dias',
    'wks': 'sem.',
    'mths': 'meses',
    'qtrs': 'qtrs',
    'completion': 'Terminado',
    'comp': '% Completado',
    'moreinfo': 'Mais informações',
    'nodata': 'Sem atividades',
    'notes': 'Notas',
    'res': 'Responsável',
    'dur': 'Duração',
    'startdate': 'Data inicial',
    'planstartdate': 'Plan Data inicial',
    'enddate': 'Data final',
    'planenddate': 'Plan Data final',
    'cost': 'Custo',
    'jan': 'Jan',
    'feb': 'Fev',
    'mar': 'Mar',
    'apr': 'Abr',
    'may': 'Mai',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Ago',
    'sep': 'Set',
    'oct': 'Out',
    'nov': 'Nov',
    'dec': 'Dez',
    'january': 'Janeiro',
    'february': 'Fevereiro',
    'march': 'Março',
    'april': 'Abril',
    'maylong': 'Maio',
    'june': 'Junho',
    'july': 'Julho',
    'august': 'Agosto',
    'september': 'Setembro',
    'october': 'Outubro',
    'november': 'Novembro',
    'december': 'Dezembro',
    'sun': 'Dom',
    'mon': 'Seg',
    'tue': 'Ter',
    'wed': 'Qua',
    'thu': 'Qui',
    'fri': 'Sex',
    'sat': 'Sab'
};
exports.pt = pt;
var ru = {
    'january': 'Январь',
    'february': 'Февраль',
    'march': 'Март',
    'april': 'Апрель',
    'maylong': 'Май',
    'june': 'Июнь',
    'july': 'Июль',
    'august': 'Август', 'september': 'Сентябрь',
    'october': 'Октябрь',
    'november': 'Ноябрь',
    'december': 'Декабрь',
    'jan': 'Янв',
    'feb': 'Фев',
    'mar': 'Мар',
    'apr': 'Апр',
    'may': 'Май',
    'jun': 'Июн',
    'jul': 'Июл',
    'aug': 'Авг',
    'sep': 'Сен',
    'oct': 'Окт',
    'nov': 'Ноя',
    'dec': 'Дек',
    'sunday': 'Воскресенье',
    'monday': 'Понедельник',
    'tuesday': 'Вторник',
    'wednesday': 'Среда',
    'thursday': 'Четверг',
    'friday': 'Пятница',
    'saturday': 'Суббота',
    'sun': '	Вс',
    'mon': '	Пн',
    'tue': '	Вт',
    'wed': '	Ср',
    'thu': '	Чт',
    'fri': '	Пт',
    'sat': '	Сб',
    'res': 'Ресурс',
    'dur': 'Длительность',
    'comp': '% выполнения',
    'completion': 'Выполнено',
    'startdate': 'Нач. дата',
    'planstartdate': 'Plan Нач. дата',
    'enddate': 'Кон. дата',
    'planenddate': 'Plan Кон. дата',
    'cost': 'Cost',
    'moreinfo': 'Детали',
    'nodata': 'No tasks found',
    'notes': 'Заметки',
    'format': 'Формат',
    'hour': 'Час',
    'day': 'День',
    'week': 'Неделя',
    'month': 'Месяц',
    'quarter': 'Кварт',
    'hours': 'Часов',
    'days': 'Дней',
    'weeks': 'Недель',
    'months': 'Месяцев',
    'quarters': 'Кварталов',
    'hr': 'ч.',
    'dy': 'дн.',
    'wk': 'нед.',
    'mth': 'мес.',
    'qtr': 'кв.',
    'hrs': 'ч.',
    'dys': 'дн.',
    'wks': 'нед.',
    'mths': 'мес.',
    'qtrs': 'кв.',
    'tooltipLoading': 'Загрузка...'
};
exports.ru = ru;
var sv = {
    'format': 'Filter',
    'hour': 'Timme',
    'day': 'Dag',
    'week': 'Vecka',
    'month': 'Månad',
    'quarter': 'Kvartal',
    'hours': 'Timmar',
    'days': 'Dagar',
    'weeks': 'Veckor',
    'months': 'Månader',
    'quarters': 'Kvartal',
    'hr': 'Timme',
    'dy': 'Dag',
    'wk': 'Vecka',
    'mth': 'Månad',
    'qtr': 'Q',
    'hrs': 'Timmar',
    'dys': 'Dagar',
    'wks': 'Veckor',
    'mths': 'Månader',
    'qtrs': 'Q',
    'res': 'Resurs',
    'dur': 'Tidsåtgång',
    'comp': '% klart',
    'completion': 'Klart',
    'startdate': 'Startdatum',
    'planstartdate': 'Planerad startdatum',
    'enddate': 'Slutdatum',
    'planenddate': 'Planerad slutdatum',
    'cost': 'Kostnad',
    'moreinfo': 'Mer Information',
    'nodata': 'No tasks found',
    'notes': 'Notes',
    'january': 'januari',
    'february': 'februari',
    'march': 'mars',
    'april': 'april',
    'maylong': 'maj',
    'june': 'juni',
    'july': 'juli',
    'august': 'augusti',
    'september': 'september',
    'october': 'oktober',
    'november': 'november',
    'december': 'december',
    'jan': 'jan',
    'feb': 'feb',
    'mar': 'mar',
    'apr': 'apr',
    'may': 'maj',
    'jun': 'jun',
    'jul': 'jul',
    'aug': 'aug',
    'sep': 'sep',
    'oct': 'okt',
    'nov': 'nov',
    'dec': 'dec',
    'sunday': 'söndag',
    'monday': 'måndag',
    'tuesday': 'tisdag',
    'wednesday': 'onsdag',
    'thursday': 'torsdag',
    'friday': 'fredag',
    'saturday': 'lördag',
    'sun': 'sön',
    'mon': 'mån',
    'tue': 'tis',
    'wed': 'ons',
    'thu': 'tor',
    'fri': 'fre',
    'sat': 'lör'
};
exports.sv = sv;
var tr = {
    'format': 'Biçim',
    'hour': 'Saat',
    'day': 'Gün',
    'week': 'Hafta',
    'month': 'Ay',
    'quarter': 'Çeyrek Yıl',
    'hours': 'Saat',
    'days': 'Gün',
    'weeks': 'Hafta',
    'months': 'Ay',
    'quarters': 'Çeyrek Yıl',
    'hr': 'Saat',
    'dy': 'Gün',
    'wk': 'Hft',
    'mth': 'Ay',
    'qtr': 'Çyrk',
    'hrs': 'Saat',
    'dys': 'Gün',
    'wks': 'Hft',
    'mths': 'Ay',
    'qtrs': 'Çyrk',
    'res': 'Kaynak',
    'dur': 'Süre',
    'comp': '% Tamamlanma.',
    'completion': 'Tamamlanma',
    'startdate': 'Başlangıç Tarihi',
    'planstartdate': 'Plan Başlama Tarihi',
    'enddate': 'Bitiş Tarihi',
    'planenddate': 'Plan Bitiş Tarihi',
    'cost': 'Tutar',
    'moreinfo': 'Daha Fazla Bilgi',
    'nodata': 'No tasks found',
    'notes': 'Notlar',
    'january': 'Ocak',
    'february': 'Şubat',
    'march': 'Mart',
    'april': 'Nisan',
    'maylong': 'Mayıs',
    'june': 'Haziran',
    'july': 'Temmuz',
    'august': 'Ağustos',
    'september': 'Eylül',
    'october': 'Ekim',
    'november': 'Kasım',
    'december': 'Aralık',
    'jan': 'Oca',
    'feb': 'Şub',
    'mar': 'Mar',
    'apr': 'Nis',
    'may': 'May',
    'jun': 'Haz',
    'jul': 'Tem',
    'aug': 'Ağu',
    'sep': 'Eyl',
    'oct': 'Eki',
    'nov': 'Kas',
    'dec': 'Ara',
    'sunday': 'Pazar',
    'monday': 'Pazartesi',
    'tuesday': 'Salı',
    'wednesday': 'Çarşamba',
    'thursday': 'Perşembe',
    'friday': 'Cuma',
    'saturday': 'Cumartesi',
    'sun': 'Paz',
    'mon': 'Pzt',
    'tue': 'Sal',
    'wed': 'Çrş',
    'thu': 'Prş',
    'fri': 'Cum',
    'sat': 'Cmt'
};
exports.tr = tr;
var ua = {
    'january': 'Січень',
    'february': 'Лютий',
    'march': 'Березень',
    'april': 'Квітень',
    'maylong': 'Травень',
    'june': 'Червень',
    'july': 'Липень',
    'august': 'Серпень',
    'september': 'Вересень',
    'october': 'Жовтень',
    'november': 'Листопад',
    'december': 'Грудень',
    'jan': 'Січ',
    'feb': 'Лют',
    'mar': 'Бер',
    'apr': 'Кві',
    'may': 'Тра',
    'jun': 'Чер',
    'jul': 'Лип',
    'aug': 'Сер',
    'sep': 'Вер',
    'oct': 'Жов',
    'nov': 'Лис',
    'dec': 'Гру',
    'sunday': 'Неділя',
    'monday': 'Понеділок',
    'tuesday': 'Вівторок',
    'wednesday': 'Середа',
    'thursday': 'Четвер',
    'friday': 'П\'ятниця',
    'saturday': 'Субота',
    'sun': ' Нд',
    'mon': 'Пн',
    'tue': ' Вт',
    'wed': 'Ср',
    'thu': ' Чт',
    'fri': ' Пт',
    'sat': ' Сб',
    'res': 'Ресурс',
    'dur': 'Тривалість',
    'comp': '% виконання',
    'completion': 'Виконано',
    'startdate': 'Поч. дата',
    'planstartdate': 'План Поч. дата',
    'enddate': 'Кін. дата',
    'planenddate': 'План Кін. дата',
    'cost': 'Вартість',
    'moreinfo': 'Деталі',
    'nodata': 'Нічого не знайдено',
    'notes': 'Нотатки',
    'format': 'Формат',
    'hour': 'Година',
    'day': 'День',
    'week': 'Тиждень',
    'month': 'Місяць',
    'quarter': 'Кварт',
    'hours': 'Годин',
    'days': 'Днів',
    'weeks': 'Тижнів',
    'months': 'Місяців',
    'quarters': 'Кварталів',
    'hr': 'г.',
    'dy': 'дн.',
    'wk': 'тиж.',
    'mth': 'міс.',
    'qtr': 'кв.',
    'hrs': 'г.',
    'dys': 'дн.',
    'wks': 'тиж.',
    'mths': 'міс.',
    'qtrs': 'кв.',
    'tooltipLoading': 'Загрузка...'
};
exports.ua = ua;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.includeGetSet = void 0;
var date_utils_1 = require("./utils/date_utils");
var draw_columns_1 = require("./draw_columns");
var includeGetSet = function () {
    /**
     * SETTERS
     */
    this.setOptions = function (options) {
        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var val = options[key];
            if (key === 'vResources' || key === 'vColumnOrder') {
                // ev = `this.set${key.substr(1)}(val)`;
                this['set' + key.substr(1)](val);
            }
            else if (val instanceof Array) {
                // ev = `this.set${key.substr(1)}(...val)`;
                this['set' + key.substr(1)].apply(this, val);
            }
            else {
                // ev = `this.set${key.substr(1)}(val)`;
                this['set' + key.substr(1)](val);
            }
        }
    };
    this.setUseFade = function (pVal) { this.vUseFade = pVal; };
    this.setUseMove = function (pVal) { this.vUseMove = pVal; };
    this.setUseRowHlt = function (pVal) { this.vUseRowHlt = pVal; };
    this.setUseToolTip = function (pVal) { this.vUseToolTip = pVal; };
    this.setUseSort = function (pVal) { this.vUseSort = pVal; };
    this.setUseSingleCell = function (pVal) { this.vUseSingleCell = pVal * 1; };
    this.setFormatArr = function () {
        var vValidFormats = 'hour day week month quarter';
        this.vFormatArr = new Array();
        for (var i = 0, j = 0; i < arguments.length; i++) {
            if (vValidFormats.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
                this.vFormatArr[j++] = arguments[i].toLowerCase();
                var vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
                vValidFormats = vValidFormats.replace(vRegExp, '');
            }
        }
    };
    this.setShowRes = function (pVal) { this.vShowRes = pVal; };
    this.setShowDur = function (pVal) { this.vShowDur = pVal; };
    this.setShowComp = function (pVal) { this.vShowComp = pVal; };
    this.setShowStartDate = function (pVal) { this.vShowStartDate = pVal; };
    this.setShowEndDate = function (pVal) { this.vShowEndDate = pVal; };
    this.setShowPlanStartDate = function (pVal) { this.vShowPlanStartDate = pVal; };
    this.setShowPlanEndDate = function (pVal) { this.vShowPlanEndDate = pVal; };
    this.setShowCost = function (pVal) { this.vShowCost = pVal; };
    this.setShowAddEntries = function (pVal) { this.vShowAddEntries = pVal; };
    this.setShowTaskInfoRes = function (pVal) { this.vShowTaskInfoRes = pVal; };
    this.setShowTaskInfoDur = function (pVal) { this.vShowTaskInfoDur = pVal; };
    this.setShowTaskInfoComp = function (pVal) { this.vShowTaskInfoComp = pVal; };
    this.setShowTaskInfoStartDate = function (pVal) { this.vShowTaskInfoStartDate = pVal; };
    this.setShowTaskInfoEndDate = function (pVal) { this.vShowTaskInfoEndDate = pVal; };
    this.setShowTaskInfoNotes = function (pVal) { this.vShowTaskInfoNotes = pVal; };
    this.setShowTaskInfoLink = function (pVal) { this.vShowTaskInfoLink = pVal; };
    this.setShowEndWeekDate = function (pVal) { this.vShowEndWeekDate = pVal; };
    this.setShowWeekends = function (pVal) { this.vShowWeekends = pVal; };
    this.setShowSelector = function () {
        var vValidSelectors = 'top bottom';
        this.vShowSelector = new Array();
        for (var i = 0, j = 0; i < arguments.length; i++) {
            if (vValidSelectors.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
                this.vShowSelector[j++] = arguments[i].toLowerCase();
                var vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
                vValidSelectors = vValidSelectors.replace(vRegExp, '');
            }
        }
    };
    this.setShowDeps = function (pVal) { this.vShowDeps = pVal; };
    this.setDateInputFormat = function (pVal) { this.vDateInputFormat = pVal; };
    this.setDateTaskTableDisplayFormat = function (pVal) { this.vDateTaskTableDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setDateTaskDisplayFormat = function (pVal) { this.vDateTaskDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setHourMajorDateDisplayFormat = function (pVal) { this.vHourMajorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setHourMinorDateDisplayFormat = function (pVal) { this.vHourMinorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setDayMajorDateDisplayFormat = function (pVal) { this.vDayMajorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setDayMinorDateDisplayFormat = function (pVal) { this.vDayMinorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setWeekMajorDateDisplayFormat = function (pVal) { this.vWeekMajorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setWeekMinorDateDisplayFormat = function (pVal) { this.vWeekMinorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setMonthMajorDateDisplayFormat = function (pVal) { this.vMonthMajorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setMonthMinorDateDisplayFormat = function (pVal) { this.vMonthMinorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setQuarterMajorDateDisplayFormat = function (pVal) { this.vQuarterMajorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setQuarterMinorDateDisplayFormat = function (pVal) { this.vQuarterMinorDateDisplayFormat = (0, date_utils_1.parseDateFormatStr)(pVal); };
    this.setCaptionType = function (pType) { this.vCaptionType = pType; };
    this.setFormat = function (pFormat) {
        this.vFormat = pFormat;
        this.Draw();
    };
    this.setWorkingDays = function (workingDays) { this.vWorkingDays = workingDays; };
    this.setFirstDayOfWeek = function (pVal) { this.vFirstDayOfWeek = parseInt(String(pVal), 10); };
    this.setMinGpLen = function (pMinGpLen) { this.vMinGpLen = pMinGpLen; };
    this.setScrollTo = function (pDate) { this.vScrollTo = pDate; };
    this.setHourColWidth = function (pWidth) { this.vHourColWidth = pWidth; };
    this.setDayColWidth = function (pWidth) { this.vDayColWidth = pWidth; };
    this.setWeekColWidth = function (pWidth) { this.vWeekColWidth = pWidth; };
    this.setMonthColWidth = function (pWidth) { this.vMonthColWidth = pWidth; };
    this.setQuarterColWidth = function (pWidth) { this.vQuarterColWidth = pWidth; };
    this.setRowHeight = function (pHeight) { this.vRowHeight = pHeight; };
    this.setLang = function (pLang) { if (this.vLangs[pLang])
        this.vLang = pLang; };
    this.setChartBody = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vChartBody = pDiv; };
    this.setChartHead = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vChartHead = pDiv; };
    this.setListBody = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vListBody = pDiv; };
    this.setChartTable = function (pTable) { if (typeof HTMLTableElement !== 'function' || pTable instanceof HTMLTableElement)
        this.vChartTable = pTable; };
    this.setLines = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        this.vLines = pDiv; };
    this.setLineOptions = function (lineOptions) { this.vLineOptions = lineOptions; };
    this.setTimer = function (pVal) { this.vTimer = pVal * 1; };
    this.setTooltipDelay = function (pVal) { this.vTooltipDelay = pVal * 1; };
    this.setTooltipTemplate = function (pVal) { this.vTooltipTemplate = pVal; };
    this.setMinDate = function (pVal) { this.vMinDate = pVal; };
    this.setMaxDate = function (pVal) { this.vMaxDate = pVal; };
    this.addLang = function (pLang, pVals) {
        if (!this.vLangs[pLang]) {
            this.vLangs[pLang] = new Object();
            for (var vKey in this.vLangs['en'])
                this.vLangs[pLang][vKey] = (pVals[vKey]) ? document.createTextNode(pVals[vKey]).data : this.vLangs['en'][vKey];
        }
    };
    this.setCustomLang = function (pVals) {
        this.vLangs[this.vLang] = new Object();
        for (var vKey in this.vLangs['en']) {
            this.vLangs[this.vLang][vKey] = (pVals[vKey]) ? document.createTextNode(pVals[vKey]).data : this.vLangs['en'][vKey];
        }
    };
    this.setTotalHeight = function (pVal) { this.vTotalHeight = pVal; };
    // EVENTS
    this.setEvents = function (pEvents) { this.vEvents = pEvents; };
    this.setEventsChange = function (pEventsChange) { this.vEventsChange = pEventsChange; };
    this.setEventClickRow = function (fn) { this.vEventClickRow = fn; };
    this.setEventClickCollapse = function (fn) { this.vEventClickCollapse = fn; };
    this.setResources = function (resources) { this.vResources = resources; };
    this.setAdditionalHeaders = function (headers) { this.vAdditionalHeaders = headers; };
    this.setColumnOrder = function (order) { this.vColumnOrder = order; };
    this.setEditable = function (editable) { this.vEditable = editable; };
    this.setDebug = function (debug) { this.vDebug = debug; };
    /**
     * GETTERS
     */
    this.getDivId = function () { return this.vDivId; };
    this.getUseFade = function () { return this.vUseFade; };
    this.getUseMove = function () { return this.vUseMove; };
    this.getUseRowHlt = function () { return this.vUseRowHlt; };
    this.getUseToolTip = function () { return this.vUseToolTip; };
    this.getUseSort = function () { return this.vUseSort; };
    this.getUseSingleCell = function () { return this.vUseSingleCell; };
    this.getFormatArr = function () { return this.vFormatArr; };
    this.getShowRes = function () { return this.vShowRes; };
    this.getShowDur = function () { return this.vShowDur; };
    this.getShowComp = function () { return this.vShowComp; };
    this.getShowStartDate = function () { return this.vShowStartDate; };
    this.getShowEndDate = function () { return this.vShowEndDate; };
    this.getShowPlanStartDate = function () { return this.vShowPlanStartDate; };
    this.getShowPlanEndDate = function () { return this.vShowPlanEndDate; };
    this.getShowCost = function () { return this.vShowCost; };
    this.getShowAddEntries = function () { return this.vShowAddEntries; };
    this.getShowTaskInfoRes = function () { return this.vShowTaskInfoRes; };
    this.getShowTaskInfoDur = function () { return this.vShowTaskInfoDur; };
    this.getShowTaskInfoComp = function () { return this.vShowTaskInfoComp; };
    this.getShowTaskInfoStartDate = function () { return this.vShowTaskInfoStartDate; };
    this.getShowTaskInfoEndDate = function () { return this.vShowTaskInfoEndDate; };
    this.getShowTaskInfoNotes = function () { return this.vShowTaskInfoNotes; };
    this.getShowTaskInfoLink = function () { return this.vShowTaskInfoLink; };
    this.getShowEndWeekDate = function () { return this.vShowEndWeekDate; };
    this.getShowWeekends = function () { return this.vShowWeekends; };
    this.getFirstDayOfWeek = function () { return this.vFirstDayOfWeek; };
    this.getShowSelector = function () { return this.vShowSelector; };
    this.getShowDeps = function () { return this.vShowDeps; };
    this.getDateInputFormat = function () { return this.vDateInputFormat; };
    this.getDateTaskTableDisplayFormat = function () { return this.vDateTaskTableDisplayFormat; };
    this.getDateTaskDisplayFormat = function () { return this.vDateTaskDisplayFormat; };
    this.getHourMajorDateDisplayFormat = function () { return this.vHourMajorDateDisplayFormat; };
    this.getHourMinorDateDisplayFormat = function () { return this.vHourMinorDateDisplayFormat; };
    this.getDayMajorDateDisplayFormat = function () { return this.vDayMajorDateDisplayFormat; };
    this.getDayMinorDateDisplayFormat = function () { return this.vDayMinorDateDisplayFormat; };
    this.getWeekMajorDateDisplayFormat = function () { return this.vWeekMajorDateDisplayFormat; };
    this.getWeekMinorDateDisplayFormat = function () { return this.vWeekMinorDateDisplayFormat; };
    this.getMonthMajorDateDisplayFormat = function () { return this.vMonthMajorDateDisplayFormat; };
    this.getMonthMinorDateDisplayFormat = function () { return this.vMonthMinorDateDisplayFormat; };
    this.getQuarterMajorDateDisplayFormat = function () { return this.vQuarterMajorDateDisplayFormat; };
    this.getQuarterMinorDateDisplayFormat = function () { return this.vQuarterMinorDateDisplayFormat; };
    this.getCaptionType = function () { return this.vCaptionType; };
    this.getMinGpLen = function () { return this.vMinGpLen; };
    this.getScrollTo = function () { return this.vScrollTo; };
    this.getHourColWidth = function () { return this.vHourColWidth; };
    this.getDayColWidth = function () { return this.vDayColWidth; };
    this.getWeekColWidth = function () { return this.vWeekColWidth; };
    this.getMonthColWidth = function () { return this.vMonthColWidth; };
    this.getQuarterColWidth = function () { return this.vQuarterColWidth; };
    this.getRowHeight = function () { return this.vRowHeight; };
    this.getChartBody = function () { return this.vChartBody; };
    this.getChartHead = function () { return this.vChartHead; };
    this.getListBody = function () { return this.vListBody; };
    this.getChartTable = function () { return this.vChartTable; };
    this.getLines = function () { return this.vLines; };
    this.getTimer = function () { return this.vTimer; };
    this.getMinDate = function () { return this.vMinDate; };
    this.getMaxDate = function () { return this.vMaxDate; };
    this.getTooltipDelay = function () { return this.vTooltipDelay; };
    this.getList = function () { return this.vTaskList; };
    //EVENTS
    this.getEventsClickCell = function () { return this.vEvents; };
    this.getEventsChange = function () { return this.vEventsChange; };
    this.getEventClickRow = function () { return this.vEventClickRow; };
    this.getEventClickCollapse = function () { return this.vEventClickCollapse; };
    this.getResources = function () { return this.vResources; };
    this.getAdditionalHeaders = function () { return this.vAdditionalHeaders; };
    this.getColumnOrder = function () { return this.vColumnOrder || draw_columns_1.COLUMN_ORDER; };
};
exports.includeGetSet = includeGetSet;

},{"./draw_columns":3,"./utils/date_utils":11}],10:[function(require,module,exports){
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRows = exports.ClearTasks = exports.RemoveTaskItem = exports.GetTaskByOriginalID = exports.AddTaskItemObject = exports.AddTaskItem = exports.createTaskInfo = exports.TaskItem = exports.TaskItemObject = exports.sortTasks = exports.taskLink = void 0;
var general_utils_1 = require("./utils/general_utils");
var draw_utils_1 = require("./utils/draw_utils");
var date_utils_1 = require("./utils/date_utils");
// function to open window to display task link
var taskLink = function (pRef, pWidth, pHeight) {
    var vWidth, vHeight;
    if (pWidth)
        vWidth = pWidth;
    else
        vWidth = 400;
    if (pHeight)
        vHeight = pHeight;
    else
        vHeight = 400;
    window.open(pRef, 'newwin', 'height=' + vHeight + ',width=' + vWidth); // let OpenWindow = 
};
exports.taskLink = taskLink;
var sortTasks = function (pList, pID, pIdx) {
    if (pList.length < 2) {
        return pIdx;
    }
    var sortIdx = pIdx;
    var sortArr = new Array();
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].getParent() == pID)
            sortArr.push(pList[i]);
    }
    if (sortArr.length > 0) {
        sortArr.sort(function (a, b) {
            var i = a.getStart().getTime() - b.getStart().getTime();
            if (i == 0)
                i = a.getEnd().getTime() - b.getEnd().getTime();
            if (i == 0)
                return a.getID() - b.getID();
            else
                return i;
        });
    }
    for (var j = 0; j < sortArr.length; j++) {
        for (var i = 0; i < pList.length; i++) {
            if (pList[i].getID() == sortArr[j].getID()) {
                pList[i].setSortIdx(sortIdx++);
                sortIdx = (0, exports.sortTasks)(pList, pList[i].getID(), sortIdx);
            }
        }
    }
    return sortIdx;
};
exports.sortTasks = sortTasks;
var TaskItemObject = function (object) {
    var pDataObject = __assign({}, object);
    general_utils_1.internalProperties.forEach(function (property) {
        delete pDataObject[property];
    });
    return new exports.TaskItem(object.pID, object.pName, object.pStart, object.pEnd, object.pClass, object.pLink, object.pMile, object.pRes, object.pComp, object.pGroup, object.pParent, object.pOpen, object.pDepend, object.pCaption, object.pNotes, object.pGantt, object.pCost, object.pPlanStart, object.pPlanEnd, object.pDuration, object.pBarText, object, object.pPlanClass);
};
exports.TaskItemObject = TaskItemObject;
var TaskItem = function (pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt, pCost, pPlanStart, pPlanEnd, pDuration, pBarText, pDataObject, pPlanClass) {
    if (pCost === void 0) { pCost = null; }
    if (pPlanStart === void 0) { pPlanStart = null; }
    if (pPlanEnd === void 0) { pPlanEnd = null; }
    if (pDuration === void 0) { pDuration = null; }
    if (pBarText === void 0) { pBarText = null; }
    if (pDataObject === void 0) { pDataObject = null; }
    if (pPlanClass === void 0) { pPlanClass = null; }
    var vGantt = pGantt ? pGantt : this;
    var _id = document.createTextNode(pID).data;
    var vID = (0, general_utils_1.hashKey)(document.createTextNode(pID).data);
    var vName = document.createTextNode(pName).data;
    var vStart = null;
    var vEnd = null;
    var vPlanStart = null;
    var vPlanEnd = null;
    var vGroupMinStart = null;
    var vGroupMinEnd = null;
    var vGroupMinPlanStart = null;
    var vGroupMinPlanEnd = null;
    var vClass = document.createTextNode(pClass).data;
    var vPlanClass = document.createTextNode(pPlanClass).data;
    var vLink = document.createTextNode(pLink).data;
    var vMile = parseInt(document.createTextNode(pMile).data);
    var vRes = document.createTextNode(pRes).data;
    var vComp = parseFloat(document.createTextNode(pComp).data);
    var vCost = parseInt(document.createTextNode(pCost).data);
    var vGroup = parseInt(document.createTextNode(pGroup).data);
    var vDataObject = pDataObject;
    var vCompVal;
    var parent = document.createTextNode(pParent).data;
    if (parent && parent !== '0') {
        parent = (0, general_utils_1.hashKey)(parent).toString();
    }
    var vParent = parent;
    var vOpen = (vGroup == 2) ? 1 : parseInt(document.createTextNode(pOpen).data);
    var vDepend = new Array();
    var vDependType = new Array();
    var vCaption = document.createTextNode(pCaption).data;
    var vDuration = pDuration || '';
    var vBarText = pBarText || '';
    var vLevel = 0;
    var vNumKid = 0;
    var vWeight = 0;
    var vVisible = 1;
    var vSortIdx = 0;
    var vToDelete = false;
    var x1, y1, x2, y2;
    var vNotes;
    var vParItem = null;
    var vCellDiv = null;
    var vBarDiv = null;
    var vTaskDiv = null;
    var vPlanTaskDiv = null;
    var vListChildRow = null;
    var vChildRow = null;
    var vGroupSpan = null;
    vNotes = document.createElement('span');
    vNotes.className = 'gTaskNotes';
    if (pNotes != null) {
        vNotes.innerHTML = pNotes;
        (0, general_utils_1.stripUnwanted)(vNotes);
    }
    if (pStart != null && pStart != '') {
        vStart = (pStart instanceof Date) ? pStart : (0, date_utils_1.parseDateStr)(document.createTextNode(pStart).data, vGantt.getDateInputFormat());
        vGroupMinStart = vStart;
    }
    if (pEnd != null && pEnd != '') {
        vEnd = (pEnd instanceof Date) ? pEnd : (0, date_utils_1.parseDateStr)(document.createTextNode(pEnd).data, vGantt.getDateInputFormat());
        vGroupMinEnd = vEnd;
    }
    if (pPlanStart != null && pPlanStart != '') {
        vPlanStart = (pPlanStart instanceof Date) ? pPlanStart : (0, date_utils_1.parseDateStr)(document.createTextNode(pPlanStart).data, vGantt.getDateInputFormat());
        vGroupMinPlanStart = vPlanStart;
    }
    if (pPlanEnd != null && pPlanEnd != '') {
        vPlanEnd = (pPlanEnd instanceof Date) ? pPlanEnd : (0, date_utils_1.parseDateStr)(document.createTextNode(pPlanEnd).data, vGantt.getDateInputFormat());
        vGroupMinPlanEnd = vPlanEnd;
    }
    function parseDepend(pDep) {
        vDepend = [];
        vDependType = [];
        if (!pDep)
            return;
        var vDepList = (pDep + '').split(',');
        for (var k = 0; k < vDepList.length; k++) {
            if (vDepList[k].toUpperCase().endsWith('SS')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'SS';
            }
            else if (vDepList[k].toUpperCase().endsWith('FF')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'FF';
            }
            else if (vDepList[k].toUpperCase().endsWith('SF')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'SF';
            }
            else if (vDepList[k].toUpperCase().endsWith('FS')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'FS';
            }
            else {
                vDepend[k] = vDepList[k];
                vDependType[k] = 'FS';
            }
            if (vDepend[k]) {
                vDepend[k] = (0, general_utils_1.hashKey)(vDepend[k]).toString();
            }
        }
    }
    parseDepend(pDepend);
    this.getID = function () { return vID; };
    this.getOriginalID = function () { return _id; };
    this.getGantt = function () { return vGantt; };
    this.getName = function () { return vName; };
    this.getStart = function () {
        if (vStart)
            return vStart;
        else if (vPlanStart)
            return vPlanStart;
        else
            return new Date();
    };
    this.getStartVar = function () {
        return vStart;
    };
    this.hasStart = function () { return !!(vStart || vPlanStart); };
    this.hasEnd = function () { return !!(vEnd || vPlanEnd || (vStart && vDuration)); };
    this.getEnd = function () {
        if (vEnd)
            return vEnd;
        else if (vPlanEnd)
            return vPlanEnd;
        else if (vStart && vDuration) {
            var date = new Date(vStart);
            var vUnits = vDuration.split(' ');
            var value = parseInt(vUnits[0]);
            switch (vUnits[1]) {
                case 'hour':
                    date.setMinutes(date.getMinutes() + (value * 60));
                    break;
                case 'day':
                    date.setMinutes(date.getMinutes() + (value * 60 * 24));
                    break;
                case 'week':
                    date.setMinutes(date.getMinutes() + (value * 60 * 24 * 7));
                    break;
                case 'month':
                    date.setMonth(date.getMonth() + (value));
                    break;
                case 'quarter':
                    date.setMonth(date.getMonth() + (value * 3));
                    break;
            }
            return date;
        }
        else
            return new Date();
    };
    this.getEndVar = function () {
        return vEnd;
    };
    this.getPlanStart = function () { return vPlanStart ? vPlanStart : vStart; };
    this.getPlanClass = function () { return vPlanClass && vPlanClass !== "null" ? vPlanClass : vClass; };
    this.getPlanEnd = function () { return vPlanEnd ? vPlanEnd : vEnd; };
    this.getCost = function () { return vCost; };
    this.getGroupMinStart = function () { return vGroupMinStart; };
    this.getGroupMinEnd = function () { return vGroupMinEnd; };
    this.getGroupMinPlanStart = function () { return vGroupMinPlanStart; };
    this.getGroupMinPlanEnd = function () { return vGroupMinPlanEnd; };
    this.getClass = function () { return vClass; };
    this.getLink = function () { return vLink; };
    this.getMile = function () { return vMile; };
    this.getDepend = function () {
        if (vDepend)
            return vDepend;
        else
            return null;
    };
    this.getDataObject = function () { return vDataObject; };
    this.getDepType = function () { if (vDependType)
        return vDependType;
    else
        return null; };
    this.getCaption = function () { if (vCaption)
        return vCaption;
    else
        return ''; };
    this.getResource = function () { if (vRes)
        return vRes;
    else
        return '\u00A0'; };
    this.getCompVal = function () { if (vComp)
        return vComp;
    else if (vCompVal)
        return vCompVal;
    else
        return 0; };
    this.getCompStr = function () { if (vComp)
        return vComp + '%';
    else if (vCompVal)
        return vCompVal + '%';
    else
        return ''; };
    this.getCompRestStr = function () { if (vComp)
        return (100 - vComp) + '%';
    else if (vCompVal)
        return (100 - vCompVal) + '%';
    else
        return ''; };
    this.getNotes = function () { return vNotes; };
    this.getSortIdx = function () { return vSortIdx; };
    this.getToDelete = function () { return vToDelete; };
    this.getDuration = function (pFormat, pLang) {
        if (vMile) {
            vDuration = '-';
        }
        else if (!vEnd && !vStart && vPlanStart && vPlanEnd) {
            return calculateVDuration(pFormat, pLang, this.getPlanStart(), this.getPlanEnd());
        }
        else if (!vEnd && vDuration) {
            return vDuration;
        }
        else {
            vDuration = calculateVDuration(pFormat, pLang, this.getStart(), this.getEnd());
        }
        return vDuration;
    };
    function calculateVDuration(pFormat, pLang, start, end) {
        var vDuration;
        var vUnits = null;
        switch (pFormat) {
            case 'week':
                vUnits = 'day';
                break;
            case 'month':
                vUnits = 'week';
                break;
            case 'quarter':
                vUnits = 'month';
                break;
            default:
                vUnits = pFormat;
                break;
        }
        // let vTaskEnd = new Date(this.getEnd().getTime());
        // if ((vTaskEnd.getTime() - (vTaskEnd.getTimezoneOffset() * 60000)) % (86400000) == 0) {
        //   vTaskEnd = new Date(vTaskEnd.getFullYear(), vTaskEnd.getMonth(), vTaskEnd.getDate() + 1, vTaskEnd.getHours(), vTaskEnd.getMinutes(), vTaskEnd.getSeconds());
        // }
        // let tmpPer = (getOffset(this.getStart(), vTaskEnd, 999, vUnits)) / 1000;
        var hours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
        var tmpPer;
        switch (vUnits) {
            case 'hour':
                tmpPer = Math.round(hours);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['hrs'] : pLang['hr']);
                break;
            case 'day':
                tmpPer = Math.round(hours / 24);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['dys'] : pLang['dy']);
                break;
            case 'week':
                tmpPer = Math.round(hours / 24 / 7);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['wks'] : pLang['wk']);
                break;
            case 'month':
                tmpPer = Math.round(hours / 24 / 7 / 4.35);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['mths'] : pLang['mth']);
                break;
            case 'quarter':
                tmpPer = Math.round(hours / 24 / 7 / 13);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['qtrs'] : pLang['qtr']);
                break;
        }
        return vDuration;
    }
    this.getBarText = function () { return vBarText; };
    this.getParent = function () { return vParent; };
    this.getGroup = function () { return vGroup; };
    this.getOpen = function () { return vOpen; };
    this.getLevel = function () { return vLevel; };
    this.getNumKids = function () { return vNumKid; };
    this.getWeight = function () { return vWeight; };
    this.getStartX = function () { return x1; };
    this.getStartY = function () { return y1; };
    this.getEndX = function () { return x2; };
    this.getEndY = function () { return y2; };
    this.getVisible = function () { return vVisible; };
    this.getParItem = function () { return vParItem; };
    this.getCellDiv = function () { return vCellDiv; };
    this.getBarDiv = function () { return vBarDiv; };
    this.getTaskDiv = function () { return vTaskDiv; };
    this.getPlanTaskDiv = function () { return vPlanTaskDiv; };
    this.getChildRow = function () { return vChildRow; };
    this.getListChildRow = function () { return vListChildRow; };
    this.getGroupSpan = function () { return vGroupSpan; };
    this.setDepend = function (pDepend) { parseDepend(pDepend); };
    this.setName = function (pName) { vName = pName; };
    this.setNotes = function (pNotes) { vNotes = pNotes; };
    this.setClass = function (pClass) { vClass = pClass; };
    this.setPlanClass = function (pPlanClass) { vPlanClass = pPlanClass; };
    this.setCost = function (pCost) { vCost = pCost; };
    this.setResource = function (pRes) { vRes = pRes; };
    this.setDuration = function (pDuration) { vDuration = pDuration; };
    this.setDataObject = function (pDataObject) { vDataObject = pDataObject; };
    this.setStart = function (pStart) {
        if (pStart instanceof Date) {
            vStart = pStart;
        }
        else {
            var temp = new Date(pStart);
            if (temp instanceof Date && !isNaN(temp.valueOf())) {
                vStart = temp;
            }
        }
    };
    this.setEnd = function (pEnd) {
        if (pEnd instanceof Date) {
            vEnd = pEnd;
        }
        else {
            var temp = new Date(pEnd);
            if (temp instanceof Date && !isNaN(temp.valueOf())) {
                vEnd = temp;
            }
        }
    };
    this.setPlanStart = function (pPlanStart) {
        if (pPlanStart instanceof Date)
            vPlanStart = pPlanStart;
        else
            vPlanStart = new Date(pPlanStart);
    };
    this.setPlanEnd = function (pPlanEnd) {
        if (pPlanEnd instanceof Date)
            vPlanEnd = pPlanEnd;
        else
            vPlanEnd = new Date(pPlanEnd);
    };
    this.setGroupMinStart = function (pStart) { if (pStart instanceof Date)
        vGroupMinStart = pStart; };
    this.setGroupMinEnd = function (pEnd) { if (pEnd instanceof Date)
        vGroupMinEnd = pEnd; };
    this.setLevel = function (pLevel) { vLevel = parseInt(document.createTextNode(pLevel).data); };
    this.setNumKid = function (pNumKid) { vNumKid = parseInt(document.createTextNode(pNumKid).data); };
    this.setWeight = function (pWeight) { vWeight = parseInt(document.createTextNode(pWeight).data); };
    this.setCompVal = function (pCompVal) { vCompVal = parseFloat(document.createTextNode(pCompVal).data); };
    this.setComp = function (pComp) {
        vComp = parseInt(document.createTextNode(pComp).data);
    };
    this.setStartX = function (pX) { x1 = parseInt(document.createTextNode(pX).data); };
    this.setStartY = function (pY) { y1 = parseInt(document.createTextNode(pY).data); };
    this.setEndX = function (pX) { x2 = parseInt(document.createTextNode(pX).data); };
    this.setEndY = function (pY) { y2 = parseInt(document.createTextNode(pY).data); };
    this.setOpen = function (pOpen) { vOpen = parseInt(document.createTextNode(pOpen).data); };
    this.setVisible = function (pVisible) { vVisible = parseInt(document.createTextNode(pVisible).data); };
    this.setSortIdx = function (pSortIdx) { vSortIdx = parseInt(document.createTextNode(pSortIdx).data); };
    this.setToDelete = function (pToDelete) { if (pToDelete)
        vToDelete = true;
    else
        vToDelete = false; };
    this.setParItem = function (pParItem) { if (pParItem)
        vParItem = pParItem; };
    this.setCellDiv = function (pCellDiv) { if (typeof HTMLDivElement !== 'function' || pCellDiv instanceof HTMLDivElement)
        vCellDiv = pCellDiv; }; //"typeof HTMLDivElement !== 'function'" to play nice with ie6 and 7
    this.setGroup = function (pGroup) {
        if (pGroup === true || pGroup === 'true') {
            vGroup = 1;
        }
        else if (pGroup === false || pGroup === 'false') {
            vGroup = 0;
        }
        else {
            vGroup = parseInt(document.createTextNode(pGroup).data);
        }
    };
    this.setBarText = function (pBarText) { if (pBarText)
        vBarText = pBarText; };
    this.setBarDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vBarDiv = pDiv; };
    this.setTaskDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vTaskDiv = pDiv; };
    this.setPlanTaskDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vPlanTaskDiv = pDiv; };
    this.setChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement)
        vChildRow = pRow; };
    this.setListChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement)
        vListChildRow = pRow; };
    this.setGroupSpan = function (pSpan) { if (typeof HTMLSpanElement !== 'function' || pSpan instanceof HTMLSpanElement)
        vGroupSpan = pSpan; };
    this.getAllData = function () {
        return {
            pID: vID,
            pName: vName,
            pStart: vStart,
            pEnd: vEnd,
            pPlanStart: vPlanStart,
            pPlanEnd: vPlanEnd,
            pGroupMinStart: vGroupMinStart,
            pGroupMinEnd: vGroupMinEnd,
            pClass: vClass,
            pLink: vLink,
            pMile: vMile,
            pRes: vRes,
            pComp: vComp,
            pCost: vCost,
            pGroup: vGroup,
            pDataObject: vDataObject,
            pPlanClass: vPlanClass
        };
    };
};
exports.TaskItem = TaskItem;
/**
 * @param pTask
 * @param templateStrOrFn template string or function(task). In any case parameters in template string are substituted.
 *        If string - just a static template.
 *        If function(task): string - per task template. Can return null|undefined to fallback to default template.
 *        If function(task): Promise<string>) - async per task template. Tooltip will show 'Loading...' if promise is not yet complete.
 *          Otherwise returned template will be handled in the same manner as in other cases.
 */
var createTaskInfo = function (pTask, templateStrOrFn) {
    var _this = this;
    if (templateStrOrFn === void 0) { templateStrOrFn = null; }
    var vTmpDiv;
    var vTaskInfoBox = document.createDocumentFragment();
    var vTaskInfo = (0, draw_utils_1.newNode)(vTaskInfoBox, 'div', null, 'gTaskInfo');
    var setupTemplate = function (template) {
        vTaskInfo.innerHTML = "";
        if (template) {
            var allData_1 = pTask.getAllData();
            general_utils_1.internalProperties.forEach(function (key) {
                var lang;
                if (general_utils_1.internalPropertiesLang[key]) {
                    lang = _this.vLangs[_this.vLang][general_utils_1.internalPropertiesLang[key]];
                }
                if (!lang) {
                    lang = key;
                }
                var val = allData_1[key];
                template = template.replace("{{".concat(key, "}}"), val);
                if (lang) {
                    template = template.replace("{{Lang:".concat(key, "}}"), lang);
                }
                else {
                    template = template.replace("{{Lang:".concat(key, "}}"), key);
                }
            });
            (0, draw_utils_1.newNode)(vTaskInfo, 'span', null, 'gTtTemplate', template);
        }
        else {
            (0, draw_utils_1.newNode)(vTaskInfo, 'span', null, 'gTtTitle', pTask.getName());
            if (_this.vShowTaskInfoStartDate == 1) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIsd');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['startdate'] + ': ');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskText', (0, date_utils_1.formatDateStr)(pTask.getStart(), _this.vDateTaskDisplayFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoEndDate == 1) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIed');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['enddate'] + ': ');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskText', (0, date_utils_1.formatDateStr)(pTask.getEnd(), _this.vDateTaskDisplayFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoDur == 1 && !pTask.getMile()) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTId');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['dur'] + ': ');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskText', pTask.getDuration(_this.vFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoComp == 1) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIc');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['completion'] + ': ');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskText', pTask.getCompStr());
            }
            if (_this.vShowTaskInfoRes == 1) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIr');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['res'] + ': ');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskText', pTask.getResource());
            }
            if (_this.vShowTaskInfoLink == 1 && pTask.getLink() != '') {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIl');
                var vTmpNode = (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel');
                vTmpNode = (0, draw_utils_1.newNode)(vTmpNode, 'a', null, 'gTaskText', _this.vLangs[_this.vLang]['moreinfo']);
                vTmpNode.setAttribute('href', pTask.getLink());
            }
            if (_this.vShowTaskInfoNotes == 1) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIn');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['notes'] + ': ');
                if (pTask.getNotes())
                    vTmpDiv.appendChild(pTask.getNotes());
            }
        }
    };
    var callback;
    if (typeof templateStrOrFn === 'function') {
        callback = function () {
            var strOrPromise = templateStrOrFn(pTask);
            if (!strOrPromise || typeof strOrPromise === 'string') {
                setupTemplate(strOrPromise);
            }
            else if (strOrPromise.then) {
                setupTemplate(_this.vLangs[_this.vLang]['tooltipLoading'] || _this.vLangs['en']['tooltipLoading']);
                return strOrPromise.then(setupTemplate);
            }
        };
    }
    else {
        setupTemplate(templateStrOrFn);
    }
    return { component: vTaskInfoBox, callback: callback };
};
exports.createTaskInfo = createTaskInfo;
var AddTaskItem = function (value) {
    var vExists = false;
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getID() == value.getID()) {
            i = this.vTaskList.length;
            vExists = true;
        }
    }
    if (!vExists) {
        this.vTaskList.push(value);
        this.vProcessNeeded = true;
    }
    return value.getID();
};
exports.AddTaskItem = AddTaskItem;
var AddTaskItemObject = function (object) {
    if (!object.pGantt) {
        object.pGantt = this;
    }
    return this.AddTaskItem((0, exports.TaskItemObject)(object));
};
exports.AddTaskItemObject = AddTaskItemObject;
var GetTaskByOriginalID = function (pOriginalID) {
    var id = String(pOriginalID);
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getOriginalID() === id)
            return this.vTaskList[i];
    }
    return null;
};
exports.GetTaskByOriginalID = GetTaskByOriginalID;
var RemoveTaskItem = function (pID) {
    // Accept either the internal vID or the original string ID.
    // Resolve an original ID to its vID so the recursive child-removal still works.
    var vID = pID;
    var asString = String(pID);
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getOriginalID() === asString) {
            vID = this.vTaskList[i].getID();
            break;
        }
    }
    // simply mark the task for removal at this point - actually remove it next time we re-draw the chart
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getID() == vID)
            this.vTaskList[i].setToDelete(true);
        else if (this.vTaskList[i].getParent() == vID)
            this.RemoveTaskItem(this.vTaskList[i].getID());
    }
    this.vProcessNeeded = true;
};
exports.RemoveTaskItem = RemoveTaskItem;
var ClearTasks = function () {
    var _this = this;
    this.vTaskList.map(function (task) { return _this.RemoveTaskItem(task.getID()); });
    this.vProcessNeeded = true;
};
exports.ClearTasks = ClearTasks;
// Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
var processRows = function (pList, pID, pRow, pLevel, pOpen, pUseSort, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    var vMinDate = null;
    var vMaxDate = null;
    var vMinPlanDate = null;
    var vMaxPlanDate = null;
    var vVisible = pOpen;
    var vCurItem = null;
    var vCompSum = 0;
    var vMinSet = 0;
    var vMaxSet = 0;
    var vMinPlanSet = 0;
    var vMaxPlanSet = 0;
    var vNumKid = 0;
    var vWeight = 0;
    var vLevel = pLevel;
    var vList = pList;
    var vComb = false;
    var i = 0;
    for (i = 0; i < pList.length; i++) {
        if (pList[i].getToDelete()) {
            pList.splice(i, 1);
            i--;
        }
        if (i >= 0 && pList[i].getID() == pID)
            vCurItem = pList[i];
    }
    for (i = 0; i < pList.length; i++) {
        if (pList[i].getParent() == pID) {
            vVisible = pOpen;
            pList[i].setParItem(vCurItem);
            pList[i].setVisible(vVisible);
            if (vVisible == 1 && pList[i].getOpen() == 0)
                vVisible = 0;
            if (pList[i].getMile() && pList[i].getParItem() && pList[i].getParItem().getGroup() == 2) { //remove milestones owned by combined groups
                pList.splice(i, 1);
                i--;
                continue;
            }
            pList[i].setLevel(vLevel);
            if (pList[i].getGroup()) {
                if (pList[i].getParItem() && pList[i].getParItem().getGroup() == 2)
                    pList[i].setGroup(2);
                (0, exports.processRows)(vList, pList[i].getID(), i, vLevel + 1, vVisible, 0);
            }
            if (pList[i].getStartVar() && (vMinSet == 0 || pList[i].getStartVar() < vMinDate)) {
                vMinDate = pList[i].getStartVar();
                vMinSet = 1;
            }
            if (pList[i].getEndVar() && (vMaxSet == 0 || pList[i].getEndVar() > vMaxDate)) {
                vMaxDate = pList[i].getEndVar();
                vMaxSet = 1;
            }
            if (vMinPlanSet == 0 || pList[i].getPlanStart() < vMinPlanDate) {
                vMinPlanDate = pList[i].getPlanStart();
                vMinPlanSet = 1;
            }
            if (vMaxPlanSet == 0 || pList[i].getPlanEnd() > vMaxPlanDate) {
                vMaxPlanDate = pList[i].getPlanEnd();
                vMaxPlanSet = 1;
            }
            vNumKid++;
            vWeight += pList[i].getEnd() - pList[i].getStart() + 1;
            vCompSum += pList[i].getCompVal() * (pList[i].getEnd() - pList[i].getStart() + 1);
            pList[i].setSortIdx(i * pList.length);
        }
    }
    if (pRow >= 0) {
        if (pList[pRow].getGroupMinStart() != null && pList[pRow].getGroupMinStart() < vMinDate) {
            vMinDate = pList[pRow].getGroupMinStart();
        }
        if (pList[pRow].getGroupMinEnd() != null && pList[pRow].getGroupMinEnd() > vMaxDate) {
            vMaxDate = pList[pRow].getGroupMinEnd();
        }
        if (vMinDate) {
            pList[pRow].setStart(vMinDate);
        }
        if (vMaxDate) {
            pList[pRow].setEnd(vMaxDate);
        }
        if (pList[pRow].getGroupMinPlanStart() != null && pList[pRow].getGroupMinPlanStart() < vMinPlanDate) {
            vMinPlanDate = pList[pRow].getGroupMinPlanStart();
        }
        if (pList[pRow].getGroupMinPlanEnd() != null && pList[pRow].getGroupMinPlanEnd() > vMaxPlanDate) {
            vMaxPlanDate = pList[pRow].getGroupMinPlanEnd();
        }
        if (vMinPlanDate) {
            pList[pRow].setPlanStart(vMinPlanDate);
        }
        if (vMaxPlanDate) {
            pList[pRow].setPlanEnd(vMaxPlanDate);
        }
        pList[pRow].setNumKid(vNumKid);
        pList[pRow].setWeight(vWeight);
        pList[pRow].setCompVal(Math.ceil(vCompSum / vWeight));
    }
    if (pID == 0 && pUseSort == 1) {
        var bd = void 0;
        if (vDebug) {
            bd = new Date();
            console.info('before afterTasks', bd);
        }
        (0, exports.sortTasks)(pList, 0, 0);
        if (vDebug) {
            var ad = new Date();
            console.info('after afterTasks', ad, (ad.getTime() - bd.getTime()));
        }
        pList.sort(function (a, b) { return a.getSortIdx() - b.getSortIdx(); });
    }
    if (pID == 0 && pUseSort != 1) // Need to sort combined tasks regardless
     {
        for (i = 0; i < pList.length; i++) {
            if (pList[i].getGroup() == 2) {
                vComb = true;
                var bd = void 0;
                if (vDebug) {
                    bd = new Date();
                    console.info('before sortTasks', bd);
                }
                (0, exports.sortTasks)(pList, pList[i].getID(), pList[i].getSortIdx() + 1);
                if (vDebug) {
                    var ad = new Date();
                    console.info('after sortTasks', ad, (ad.getTime() - bd.getTime()));
                }
            }
        }
        if (vComb == true)
            pList.sort(function (a, b) { return a.getSortIdx() - b.getSortIdx(); });
    }
};
exports.processRows = processRows;

},{"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsoWeek = exports.parseDateFormatStr = exports.formatDateStr = exports.parseDateStr = exports.coerceDate = exports.getMaxDate = exports.getMinDate = void 0;
/**
 * Returns the last day of the week (0=Sun … 6=Sat) for a given first day.
 */
var lastDayOfWeek = function (firstDay) { return (firstDay + 6) % 7; };
/**
 * DATES
 */
var getMinDate = function (pList, pFormat, pMinDate, pFirstDayOfWeek) {
    if (pFirstDayOfWeek === void 0) { pFirstDayOfWeek = 1; }
    var vDate = new Date();
    if (pList.length <= 0)
        return pMinDate || vDate;
    var firstWithDate = pList.find(function (t) { return !t.hasStart || t.hasStart(); });
    vDate.setTime((pMinDate && pMinDate.getTime()) || (firstWithDate ? firstWithDate.getStart().getTime() : vDate.getTime()));
    // Parse all Task Start dates to find min, skipping tasks with no explicit date
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].hasStart && !pList[i].hasStart())
            continue;
        if (pList[i].getStart().getTime() < vDate.getTime())
            vDate.setTime(pList[i].getStart().getTime());
        if (pList[i].getPlanStart() && pList[i].getPlanStart().getTime() < vDate.getTime())
            vDate.setTime(pList[i].getPlanStart().getTime());
    }
    // Adjust min date to specific format boundaries (first of week or first of month)
    if (pFormat == 'day') {
        vDate.setDate(vDate.getDate() - 1);
        while (vDate.getDay() != pFirstDayOfWeek)
            vDate.setDate(vDate.getDate() - 1);
    }
    else if (pFormat == 'week') {
        vDate.setDate(vDate.getDate() - 1);
        while (vDate.getDay() != pFirstDayOfWeek)
            vDate.setDate(vDate.getDate() - 1);
    }
    else if (pFormat == 'month') {
        vDate.setDate(vDate.getDate() - 15);
        while (vDate.getDate() > 1)
            vDate.setDate(vDate.getDate() - 1);
    }
    else if (pFormat == 'quarter') {
        vDate.setDate(vDate.getDate() - 31);
        if (vDate.getMonth() == 0 || vDate.getMonth() == 1 || vDate.getMonth() == 2)
            vDate.setFullYear(vDate.getFullYear(), 0, 1);
        else if (vDate.getMonth() == 3 || vDate.getMonth() == 4 || vDate.getMonth() == 5)
            vDate.setFullYear(vDate.getFullYear(), 3, 1);
        else if (vDate.getMonth() == 6 || vDate.getMonth() == 7 || vDate.getMonth() == 8)
            vDate.setFullYear(vDate.getFullYear(), 6, 1);
        else if (vDate.getMonth() == 9 || vDate.getMonth() == 10 || vDate.getMonth() == 11)
            vDate.setFullYear(vDate.getFullYear(), 9, 1);
    }
    else if (pFormat == 'hour') {
        vDate.setHours(vDate.getHours() - 1);
        while (vDate.getHours() % 6 != 0)
            vDate.setHours(vDate.getHours() - 1);
    }
    if (pFormat == 'hour')
        vDate.setMinutes(0, 0);
    else
        vDate.setHours(0, 0, 0);
    return (vDate);
};
exports.getMinDate = getMinDate;
var getMaxDate = function (pList, pFormat, pMaxDate, pFirstDayOfWeek) {
    if (pFirstDayOfWeek === void 0) { pFirstDayOfWeek = 1; }
    var vDate = new Date();
    if (pList.length <= 0)
        return pMaxDate || vDate;
    var firstWithDate = pList.find(function (t) { return !t.hasEnd || t.hasEnd(); });
    vDate.setTime((pMaxDate && pMaxDate.getTime()) || (firstWithDate ? firstWithDate.getEnd().getTime() : vDate.getTime()));
    // Parse all Task End dates to find max, skipping tasks with no explicit date
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].hasEnd && !pList[i].hasEnd())
            continue;
        if (pList[i].getEnd().getTime() > vDate.getTime())
            vDate.setTime(pList[i].getEnd().getTime());
        if (pList[i].getPlanEnd() && pList[i].getPlanEnd().getTime() > vDate.getTime())
            vDate.setTime(pList[i].getPlanEnd().getTime());
    }
    // Adjust max date to specific format boundaries (end of week or end of month)
    if (pFormat == 'day') {
        // Advance to the end of the week that contains vDate.
        // Do NOT unconditionally add 1 first — if vDate is already the last day of
        // the week, that would push it into the next week (issue #284).
        while (vDate.getDay() != lastDayOfWeek(pFirstDayOfWeek))
            vDate.setDate(vDate.getDate() + 1);
    }
    else if (pFormat == 'week') {
        // Same logic as 'day': round up to end of the current week without
        // overshooting when vDate is already the last day of the week (issue #284).
        while (vDate.getDay() != lastDayOfWeek(pFirstDayOfWeek))
            vDate.setDate(vDate.getDate() + 1);
    }
    else if (pFormat == 'month') {
        // Set to last day of current Month
        while (vDate.getDate() > 1)
            vDate.setDate(vDate.getDate() + 1);
        vDate.setDate(vDate.getDate() - 1);
    }
    else if (pFormat == 'quarter') {
        // Set to last day of current Quarter
        if (vDate.getMonth() == 0 || vDate.getMonth() == 1 || vDate.getMonth() == 2)
            vDate.setFullYear(vDate.getFullYear(), 2, 31);
        else if (vDate.getMonth() == 3 || vDate.getMonth() == 4 || vDate.getMonth() == 5)
            vDate.setFullYear(vDate.getFullYear(), 5, 30);
        else if (vDate.getMonth() == 6 || vDate.getMonth() == 7 || vDate.getMonth() == 8)
            vDate.setFullYear(vDate.getFullYear(), 8, 30);
        else if (vDate.getMonth() == 9 || vDate.getMonth() == 10 || vDate.getMonth() == 11)
            vDate.setFullYear(vDate.getFullYear(), 11, 31);
    }
    else if (pFormat == 'hour') {
        if (vDate.getHours() == 0)
            vDate.setDate(vDate.getDate() + 1);
        vDate.setHours(vDate.getHours() + 1);
        while (vDate.getHours() % 6 != 5)
            vDate.setHours(vDate.getHours() + 1);
    }
    return (vDate);
};
exports.getMaxDate = getMaxDate;
var coerceDate = function (date) {
    if (date instanceof Date) {
        return date;
    }
    else {
        var temp = new Date(date);
        if (temp instanceof Date && !isNaN(temp.valueOf())) {
            return temp;
        }
    }
};
exports.coerceDate = coerceDate;
var parseDateStr = function (pDateStr, pFormatStr) {
    var vDate = new Date();
    var vDateParts = pDateStr.split(/[^0-9]/);
    if (pDateStr.length >= 10 && vDateParts.length >= 3) {
        while (vDateParts.length < 5)
            vDateParts.push(0);
        switch (pFormatStr) {
            case 'mm/dd/yyyy':
                vDate = new Date(vDateParts[2], vDateParts[0] - 1, vDateParts[1], vDateParts[3], vDateParts[4]);
                break;
            case 'dd/mm/yyyy':
                vDate = new Date(vDateParts[2], vDateParts[1] - 1, vDateParts[0], vDateParts[3], vDateParts[4]);
                break;
            case 'yyyy-mm-dd':
                vDate = new Date(vDateParts[0], vDateParts[1] - 1, vDateParts[2], vDateParts[3], vDateParts[4]);
                break;
            case 'yyyy-mm-dd HH:MI:SS':
                vDate = new Date(vDateParts[0], vDateParts[1] - 1, vDateParts[2], vDateParts[3], vDateParts[4], vDateParts[5]);
                break;
        }
    }
    return (vDate);
};
exports.parseDateStr = parseDateStr;
var formatDateStr = function (pDate, pDateFormatArr, pL) {
    // Fix on issue #303 - getXMLTask is passing null as pDates
    if (!pDate) {
        return;
    }
    var vDateStr = '';
    var vYear2Str = pDate.getFullYear().toString().substring(2, 4);
    var vMonthStr = (pDate.getMonth() + 1) + '';
    var vMonthArr = new Array(pL['january'], pL['february'], pL['march'], pL['april'], pL['maylong'], pL['june'], pL['july'], pL['august'], pL['september'], pL['october'], pL['november'], pL['december']);
    var vDayArr = new Array(pL['sunday'], pL['monday'], pL['tuesday'], pL['wednesday'], pL['thursday'], pL['friday'], pL['saturday']);
    var vMthArr = new Array(pL['jan'], pL['feb'], pL['mar'], pL['apr'], pL['may'], pL['jun'], pL['jul'], pL['aug'], pL['sep'], pL['oct'], pL['nov'], pL['dec']);
    var vDyArr = new Array(pL['sun'], pL['mon'], pL['tue'], pL['wed'], pL['thu'], pL['fri'], pL['sat']);
    for (var i = 0; i < pDateFormatArr.length; i++) {
        if (pDateFormatArr[i].charCodeAt(0) === 0) {
            vDateStr += pDateFormatArr[i].slice(1);
            continue;
        }
        switch (pDateFormatArr[i]) {
            case 'dd':
                if (pDate.getDate() < 10)
                    vDateStr += '0'; // now fall through
            case 'd':
                vDateStr += pDate.getDate();
                break;
            case 'day':
                vDateStr += vDyArr[pDate.getDay()];
                break;
            case 'DAY':
                vDateStr += vDayArr[pDate.getDay()];
                break;
            case 'mm':
                if (parseInt(vMonthStr, 10) < 10)
                    vDateStr += '0'; // now fall through
            case 'm':
                vDateStr += vMonthStr;
                break;
            case 'mon':
                vDateStr += vMthArr[pDate.getMonth()];
                break;
            case 'month':
                vDateStr += vMonthArr[pDate.getMonth()];
                break;
            case 'yyyy':
                vDateStr += pDate.getFullYear();
                break;
            case 'yy':
                vDateStr += vYear2Str;
                break;
            case 'qq':
                vDateStr += pL['qtr']; // now fall through
            case 'q':
                vDateStr += Math.floor(pDate.getMonth() / 3) + 1;
                break;
            case 'hh':
                if ((((pDate.getHours() % 12) == 0) ? 12 : pDate.getHours() % 12) < 10)
                    vDateStr += '0'; // now fall through
            case 'h':
                vDateStr += ((pDate.getHours() % 12) == 0) ? 12 : pDate.getHours() % 12;
                break;
            case 'HH':
                if ((pDate.getHours()) < 10)
                    vDateStr += '0'; // now fall through
            case 'H':
                vDateStr += (pDate.getHours());
                break;
            case 'MI':
                if (pDate.getMinutes() < 10)
                    vDateStr += '0'; // now fall through
            case 'mi':
                vDateStr += pDate.getMinutes();
                break;
            case 'SS':
                if (pDate.getSeconds() < 10)
                    vDateStr += '0'; // now fall through
            case 'ss':
                vDateStr += pDate.getSeconds();
                break;
            case 'pm':
                vDateStr += ((pDate.getHours()) < 12) ? 'am' : 'pm';
                break;
            case 'PM':
                vDateStr += ((pDate.getHours()) < 12) ? 'AM' : 'PM';
                break;
            case 'ww':
                if ((0, exports.getIsoWeek)(pDate) < 10)
                    vDateStr += '0'; // now fall through
            case 'w':
                vDateStr += (0, exports.getIsoWeek)(pDate);
                break;
            case 'week':
                var vWeekNum = (0, exports.getIsoWeek)(pDate);
                var vYear = pDate.getFullYear();
                var vDayOfWeek = (pDate.getDay() == 0) ? 7 : pDate.getDay();
                if (vWeekNum >= 52 && parseInt(vMonthStr, 10) === 1)
                    vYear--;
                if (vWeekNum == 1 && parseInt(vMonthStr, 10) === 12)
                    vYear++;
                if (vWeekNum < 10)
                    vWeekNum = parseInt('0' + vWeekNum, 10);
                vDateStr += vYear + '-W' + vWeekNum + '-' + vDayOfWeek;
                break;
            default:
                if (pL[pDateFormatArr[i].toLowerCase()])
                    vDateStr += pL[pDateFormatArr[i].toLowerCase()];
                else
                    vDateStr += pDateFormatArr[i];
                break;
        }
    }
    return vDateStr;
};
exports.formatDateStr = formatDateStr;
var parseDateFormatStr = function (pFormatStr) {
    if (pFormatStr.includes('{{')) {
        var result = [];
        var parts = pFormatStr.split(/({{[^}]+}})/);
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            if (part.startsWith('{{') && part.endsWith('}}')) {
                result.push(part.slice(2, -2));
            }
            else if (part.length > 0) {
                result.push('\x00' + part);
            }
        }
        return result;
    }
    var vComponantStr = '';
    var vCurrChar = '';
    var vSeparators = new RegExp('[\/\\ -.,\'":]');
    var vDateFormatArray = new Array();
    for (var i = 0; i < pFormatStr.length; i++) {
        vCurrChar = pFormatStr.charAt(i);
        if ((vCurrChar.match(vSeparators)) || (i + 1 == pFormatStr.length)) // separator or end of string
         {
            if ((i + 1 == pFormatStr.length) && (!(vCurrChar.match(vSeparators)))) // at end of string add any non-separator chars to the current component
             {
                vComponantStr += vCurrChar;
            }
            vDateFormatArray.push(vComponantStr);
            if (vCurrChar.match(vSeparators))
                vDateFormatArray.push(vCurrChar);
            vComponantStr = '';
        }
        else {
            vComponantStr += vCurrChar;
        }
    }
    return vDateFormatArray;
};
exports.parseDateFormatStr = parseDateFormatStr;
/**
 * We have to compare against the monday of the first week of the year containing 04 jan *not* 01/01
 * 60*60*24*1000=86400000
 * @param pDate
 */
var getIsoWeek = function (pDate) {
    var dayMiliseconds = 86400000;
    var keyDay = new Date(pDate.getFullYear(), 0, 4, 0, 0, 0);
    var keyDayOfWeek = (keyDay.getDay() == 0) ? 6 : keyDay.getDay() - 1; // define monday as 0
    var firstMondayYearTime = keyDay.getTime() - (keyDayOfWeek * dayMiliseconds);
    var thisDate = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate(), 0, 0, 0); // This at 00:00:00
    var thisTime = thisDate.getTime();
    var daysFromFirstMonday = Math.round(((thisTime - firstMondayYearTime) / dayMiliseconds));
    var lastWeek = 99;
    var thisWeek = 99;
    var firstMondayYear = new Date(firstMondayYearTime);
    thisWeek = Math.ceil((daysFromFirstMonday + 1) / 7);
    if (thisWeek <= 0)
        thisWeek = (0, exports.getIsoWeek)(new Date(pDate.getFullYear() - 1, 11, 31, 0, 0, 0));
    else if (thisWeek == 53 && (new Date(pDate.getFullYear(), 0, 1, 0, 0, 0)).getDay() != 4 && (new Date(pDate.getFullYear(), 11, 31, 0, 0, 0)).getDay() != 4)
        thisWeek = 1;
    return thisWeek;
};
exports.getIsoWeek = getIsoWeek;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSelector = exports.sLine = exports.CalcTaskXY = exports.getArrayLocationByID = exports.newNode = exports.makeInput = void 0;
var events_1 = require("../events");
var makeInput = function (formattedValue, editable, type, value, choices) {
    if (type === void 0) { type = 'text'; }
    if (value === void 0) { value = null; }
    if (choices === void 0) { choices = null; }
    if (!value) {
        value = formattedValue;
    }
    if (editable) {
        switch (type) {
            case 'date':
                // Take timezone into account before converting to ISO String
                value = value ? new Date(value.getTime() - (value.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
                return "<input class=\"gantt-inputtable\" type=\"date\" value=\"".concat(value, "\">");
            case 'resource':
                if (choices) {
                    var found = choices.filter(function (c) { return c.id == value || c.name == value; });
                    if (found && found.length > 0) {
                        value = found[0].id;
                    }
                    else {
                        choices.push({ id: value, name: value });
                    }
                    return "<select>" + choices.map(function (c) { return "<option value=\"".concat(c.id, "\" ").concat(value == c.id ? 'selected' : '', " >").concat(c.name, "</option>"); }).join('') + "</select>";
                }
                else {
                    return "<input class=\"gantt-inputtable\" type=\"text\" value=\"".concat(value ? value : '', "\">");
                }
            case 'cost':
                return "<input class=\"gantt-inputtable\" type=\"number\" max=\"100\" min=\"0\" value=\"".concat(value ? value : '', "\">");
            default:
                return "<input class=\"gantt-inputtable\" value=\"".concat(value ? value : '', "\">");
        }
    }
    else {
        return formattedValue;
    }
};
exports.makeInput = makeInput;
var newNode = function (pParent, pNodeType, pId, pClass, pText, pWidth, pLeft, pDisplay, pColspan, pAttribs) {
    if (pId === void 0) { pId = null; }
    if (pClass === void 0) { pClass = null; }
    if (pText === void 0) { pText = null; }
    if (pWidth === void 0) { pWidth = null; }
    if (pLeft === void 0) { pLeft = null; }
    if (pDisplay === void 0) { pDisplay = null; }
    if (pColspan === void 0) { pColspan = null; }
    if (pAttribs === void 0) { pAttribs = null; }
    var vNewNode = pParent.appendChild(document.createElement(pNodeType));
    if (pAttribs) {
        for (var i = 0; i + 1 < pAttribs.length; i += 2) {
            vNewNode.setAttribute(pAttribs[i], pAttribs[i + 1]);
        }
    }
    if (pId)
        vNewNode.id = pId; // I wish I could do this with setAttribute but older IEs don't play nice
    if (pClass)
        vNewNode.className = pClass;
    if (pWidth)
        vNewNode.style.width = (isNaN(pWidth * 1)) ? pWidth : pWidth + 'px';
    if (pLeft)
        vNewNode.style.left = (isNaN(pLeft * 1)) ? pLeft : pLeft + 'px';
    if (pText) {
        if (pText.indexOf && pText.indexOf('<') === -1) {
            vNewNode.appendChild(document.createTextNode(pText));
        }
        else {
            vNewNode.insertAdjacentHTML('beforeend', pText);
        }
    }
    if (pDisplay)
        vNewNode.style.display = pDisplay;
    if (pColspan)
        vNewNode.colSpan = pColspan;
    return vNewNode;
};
exports.newNode = newNode;
var getArrayLocationByID = function (pId) {
    var vList = this.getList();
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getID() == pId)
            return i;
    }
    return -1;
};
exports.getArrayLocationByID = getArrayLocationByID;
var CalcTaskXY = function () {
    var vID;
    var vList = this.getList();
    var vBarDiv;
    var vTaskDiv;
    var vParDiv;
    var vLeft, vTop, vWidth;
    var vHeight = Math.floor((this.getRowHeight() / 2));
    for (var i = 0; i < vList.length; i++) {
        vID = vList[i].getID();
        vBarDiv = vList[i].getBarDiv();
        vTaskDiv = vList[i].getTaskDiv();
        if ((vList[i].getParItem() && vList[i].getParItem().getGroup() == 2)) {
            vParDiv = vList[i].getParItem().getChildRow();
        }
        else
            vParDiv = vList[i].getChildRow();
        if (vBarDiv) {
            vList[i].setStartX(vBarDiv.offsetLeft + 1);
            vList[i].setStartY(vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1);
            vList[i].setEndX(vBarDiv.offsetLeft + vBarDiv.offsetWidth + 1);
            vList[i].setEndY(vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1);
        }
    }
};
exports.CalcTaskXY = CalcTaskXY;
var sLine = function (x1, y1, x2, y2, pClass) {
    var vLeft = Math.min(x1, x2);
    var vTop = Math.min(y1, y2);
    var vWid = Math.abs(x2 - x1) + 1;
    var vHgt = Math.abs(y2 - y1) + 1;
    var vTmpDiv = document.createElement('div');
    vTmpDiv.id = this.vDivId + 'line' + this.vDepId++;
    vTmpDiv.style.position = 'absolute';
    vTmpDiv.style.overflow = 'hidden';
    vTmpDiv.style.zIndex = '0';
    vTmpDiv.style.left = vLeft + 'px';
    vTmpDiv.style.top = vTop + 'px';
    vTmpDiv.style.width = vWid + 'px';
    vTmpDiv.style.height = vHgt + 'px';
    vTmpDiv.style.visibility = 'visible';
    if (vWid == 1)
        vTmpDiv.className = 'glinev';
    else
        vTmpDiv.className = 'glineh';
    if (pClass)
        vTmpDiv.className += ' ' + pClass;
    this.getLines().appendChild(vTmpDiv);
    if (this.vEvents.onLineDraw && typeof this.vEvents.onLineDraw === 'function') {
        this.vEvents.onLineDraw(vTmpDiv);
    }
    return vTmpDiv;
};
exports.sLine = sLine;
var drawSelector = function (pPos) {
    var vOutput = document.createDocumentFragment();
    var vDisplay = false;
    for (var i = 0; i < this.vShowSelector.length && !vDisplay; i++) {
        if (this.vShowSelector[i].toLowerCase() == pPos.toLowerCase())
            vDisplay = true;
    }
    if (vDisplay) {
        var vTmpDiv = (0, exports.newNode)(vOutput, 'div', null, 'gselector', this.vLangs[this.vLang]['format'] + ':');
        if (this.vFormatArr.join().toLowerCase().indexOf('hour') != -1)
            (0, events_1.addFormatListeners)(this, 'hour', (0, exports.newNode)(vTmpDiv, 'span', this.vDivId + 'formathour' + pPos, 'gformlabel' + ((this.vFormat == 'hour') ? ' gselected' : ''), this.vLangs[this.vLang]['hour']));
        if (this.vFormatArr.join().toLowerCase().indexOf('day') != -1)
            (0, events_1.addFormatListeners)(this, 'day', (0, exports.newNode)(vTmpDiv, 'span', this.vDivId + 'formatday' + pPos, 'gformlabel' + ((this.vFormat == 'day') ? ' gselected' : ''), this.vLangs[this.vLang]['day']));
        if (this.vFormatArr.join().toLowerCase().indexOf('week') != -1)
            (0, events_1.addFormatListeners)(this, 'week', (0, exports.newNode)(vTmpDiv, 'span', this.vDivId + 'formatweek' + pPos, 'gformlabel' + ((this.vFormat == 'week') ? ' gselected' : ''), this.vLangs[this.vLang]['week']));
        if (this.vFormatArr.join().toLowerCase().indexOf('month') != -1)
            (0, events_1.addFormatListeners)(this, 'month', (0, exports.newNode)(vTmpDiv, 'span', this.vDivId + 'formatmonth' + pPos, 'gformlabel' + ((this.vFormat == 'month') ? ' gselected' : ''), this.vLangs[this.vLang]['month']));
        if (this.vFormatArr.join().toLowerCase().indexOf('quarter') != -1)
            (0, events_1.addFormatListeners)(this, 'quarter', (0, exports.newNode)(vTmpDiv, 'span', this.vDivId + 'formatquarter' + pPos, 'gformlabel' + ((this.vFormat == 'quarter') ? ' gselected' : ''), this.vLangs[this.vLang]['quarter']));
    }
    else {
        (0, exports.newNode)(vOutput, 'div', null, 'gselector');
    }
    return vOutput;
};
exports.drawSelector = drawSelector;

},{"../events":5}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printChart = exports.calculateStartEndFromDepend = exports.makeRequestOldBrowsers = exports.makeRequest = exports.moveToolTip = exports.updateFlyingObj = exports.isParentElementOrSelf = exports.criticalPath = exports.hashKey = exports.hashString = exports.fadeToolTip = exports.hideToolTip = exports.isIE = exports.getOffset = exports.calculateCurrentDateOffset = exports.getScrollbarWidth = exports.getScrollPositions = exports.benchMark = exports.getZoomFactor = exports.delayedHide = exports.stripUnwanted = exports.stripIds = exports.changeFormat = exports.findObj = exports.internalPropertiesLang = exports.internalProperties = void 0;
exports.internalProperties = ['pID', 'pName', 'pStart', 'pEnd', 'pClass', 'pLink', 'pMile', 'pRes', 'pComp', 'pGroup', 'pParent',
    'pOpen', 'pDepend', 'pCaption', 'pNotes', 'pGantt', 'pCost', 'pPlanStart', 'pPlanEnd', 'pPlanClass'];
exports.internalPropertiesLang = {
    'pID': 'id',
    'pName': 'name',
    'pStart': 'startdate',
    'pEnd': 'enddate',
    'pLink': 'link',
    'pMile': 'mile',
    'pRes': 'res',
    'pDuration': 'dur',
    'pComp': 'comp',
    'pGroup': 'group',
    'pParent': 'parent',
    'pOpen': 'open',
    'pDepend': 'depend',
    'pCaption': 'caption',
    'pNotes': 'notes',
    'pCost': 'cost',
    'pPlanStart': 'planstartdate',
    'pPlanEnd': 'planenddate',
    'pPlanClass': 'planclass'
};
var findObj = function (theObj, theDoc) {
    if (theDoc === void 0) { theDoc = null; }
    var p, i, foundObj;
    if (!theDoc)
        theDoc = document;
    if (document.getElementById)
        foundObj = document.getElementById(theObj);
    return foundObj;
};
exports.findObj = findObj;
var changeFormat = function (pFormat, ganttObj) {
    if (ganttObj)
        ganttObj.setFormat(pFormat);
    else
        alert('Chart undefined');
};
exports.changeFormat = changeFormat;
var stripIds = function (pNode) {
    for (var i = 0; i < pNode.childNodes.length; i++) {
        if ('removeAttribute' in pNode.childNodes[i])
            pNode.childNodes[i].removeAttribute('id');
        if (pNode.childNodes[i].hasChildNodes())
            (0, exports.stripIds)(pNode.childNodes[i]);
    }
};
exports.stripIds = stripIds;
var stripUnwanted = function (pNode) {
    var vAllowedTags = new Array('#text', 'p', 'br', 'ul', 'ol', 'li', 'div', 'span', 'img');
    for (var i = 0; i < pNode.childNodes.length; i++) {
        /* versions of IE<9 don't support indexOf on arrays so add trailing comma to the joined array and lookup value to stop substring matches */
        if ((vAllowedTags.join().toLowerCase() + ',').indexOf(pNode.childNodes[i].nodeName.toLowerCase() + ',') == -1) {
            pNode.replaceChild(document.createTextNode(pNode.childNodes[i].outerHTML), pNode.childNodes[i]);
        }
        if (pNode.childNodes[i].hasChildNodes())
            (0, exports.stripUnwanted)(pNode.childNodes[i]);
    }
};
exports.stripUnwanted = stripUnwanted;
var delayedHide = function (pGanttChartObj, pTool, pTimer) {
    var vDelay = pGanttChartObj.getTooltipDelay() || 1500;
    if (pTool)
        pTool.delayTimeout = setTimeout(function () { (0, exports.hideToolTip)(pGanttChartObj, pTool, pTimer); }, vDelay);
};
exports.delayedHide = delayedHide;
var getZoomFactor = function () {
    var vFactor = 1;
    if (document.body.getBoundingClientRect) {
        // rect is only in physical pixel size in IE before version 8
        var vRect = document.body.getBoundingClientRect();
        var vPhysicalW = vRect.right - vRect.left;
        var vLogicalW = document.body.offsetWidth;
        // the zoom level is always an integer percent value
        vFactor = Math.round((vPhysicalW / vLogicalW) * 100) / 100;
    }
    return vFactor;
};
exports.getZoomFactor = getZoomFactor;
var benchMark = function (pItem) {
    var vEndTime = new Date().getTime();
    alert(pItem + ': Elapsed time: ' + ((vEndTime - this.vBenchTime) / 1000) + ' seconds.');
    this.vBenchTime = new Date().getTime();
};
exports.benchMark = benchMark;
var getScrollPositions = function () {
    var vScrollLeft = window.pageXOffset;
    var vScrollTop = window.pageYOffset;
    if (!('pageXOffset' in window)) // Internet Explorer before version 9
     {
        var vZoomFactor = (0, exports.getZoomFactor)();
        vScrollLeft = Math.round(document.documentElement.scrollLeft / vZoomFactor);
        vScrollTop = Math.round(document.documentElement.scrollTop / vZoomFactor);
    }
    return { x: vScrollLeft, y: vScrollTop };
};
exports.getScrollPositions = getScrollPositions;
var scrollbarWidth = undefined;
var getScrollbarWidth = function () {
    if (scrollbarWidth)
        return scrollbarWidth;
    var outer = document.createElement('div');
    outer.className = 'gscrollbar-calculation-container';
    document.body.appendChild(outer);
    // Creating inner element and placing it in the container
    var inner = document.createElement('div');
    outer.appendChild(inner);
    // Calculating difference between container's full width and the child width
    scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
};
exports.getScrollbarWidth = getScrollbarWidth;
var calculateCurrentDateOffset = function (curTaskStart, curTaskEnd) {
    var tmpTaskStart = Date.UTC(curTaskStart.getFullYear(), curTaskStart.getMonth(), curTaskStart.getDate(), curTaskStart.getHours(), 0, 0);
    var tmpTaskEnd = Date.UTC(curTaskEnd.getFullYear(), curTaskEnd.getMonth(), curTaskEnd.getDate(), curTaskEnd.getHours(), 0, 0);
    return (tmpTaskEnd - tmpTaskStart);
};
exports.calculateCurrentDateOffset = calculateCurrentDateOffset;
var getOffset = function (pStartDate, pEndDate, pColWidth, pFormat, pShowWeekends, pFirstDayOfWeek) {
    if (pFirstDayOfWeek === void 0) { pFirstDayOfWeek = 1; }
    var DAY_CELL_MARGIN_WIDTH = 3; // Cell margin for 'day' format
    var WEEK_CELL_MARGIN_WIDTH = 3; // Cell margin for 'week' format
    var MONTH_CELL_MARGIN_WIDTH = 3; // Cell margin for 'month' format
    var QUARTER_CELL_MARGIN_WIDTH = 3; // Cell margin for 'quarter' format
    var HOUR_CELL_MARGIN_WIDTH = 3; // Cell margin for 'hour' format
    var vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var curTaskStart = new Date(pStartDate.getTime());
    var curTaskEnd = new Date(pEndDate.getTime());
    var vTaskRightPx = 0;
    // Length of task in hours
    var oneHour = 3600000;
    var vTaskRight = (0, exports.calculateCurrentDateOffset)(curTaskStart, curTaskEnd) / oneHour;
    var vPosTmpDate;
    if (pFormat == 'day') {
        if (!pShowWeekends) {
            var start = curTaskStart;
            var end = curTaskEnd;
            var countWeekends = 0;
            while (start < end) {
                var day = start.getDay();
                var vLastDay = (pFirstDayOfWeek + 6) % 7;
                var vPenultDay = (pFirstDayOfWeek + 5) % 7;
                if (day === vLastDay || day === vPenultDay) {
                    countWeekends++;
                }
                start = new Date(start.getTime() + 24 * oneHour);
            }
            vTaskRight -= countWeekends * 24;
        }
        vTaskRightPx = Math.ceil((vTaskRight / 24) * (pColWidth + DAY_CELL_MARGIN_WIDTH) - 1);
    }
    else if (pFormat == 'week') {
        vTaskRightPx = Math.ceil((vTaskRight / (24 * 7)) * (pColWidth + WEEK_CELL_MARGIN_WIDTH) - 1);
    }
    else if (pFormat == 'month') {
        var vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
        vPosTmpDate = new Date(curTaskEnd.getTime());
        vPosTmpDate.setDate(curTaskStart.getDate());
        var vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (86400000);
        vTaskRightPx = Math.ceil((vMonthsDiff * (pColWidth + MONTH_CELL_MARGIN_WIDTH)) + (vDaysCrctn * (pColWidth / vMonthDaysArr[curTaskEnd.getMonth()])) - 1);
    }
    else if (pFormat == 'quarter') {
        var vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
        vPosTmpDate = new Date(curTaskEnd.getTime());
        vPosTmpDate.setDate(curTaskStart.getDate());
        var vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (86400000);
        vTaskRightPx = Math.ceil((vMonthsDiff * ((pColWidth + QUARTER_CELL_MARGIN_WIDTH) / 3)) + (vDaysCrctn * (pColWidth / 90)) - 1);
    }
    else if (pFormat == 'hour') {
        // can't just calculate sum because of daylight savings changes
        vPosTmpDate = new Date(curTaskEnd.getTime());
        vPosTmpDate.setMinutes(curTaskStart.getMinutes(), 0);
        var vMinsCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (3600000);
        vTaskRightPx = Math.ceil((vTaskRight * (pColWidth + HOUR_CELL_MARGIN_WIDTH)) + (vMinsCrctn * (pColWidth)));
    }
    return vTaskRightPx;
};
exports.getOffset = getOffset;
var isIE = function () {
    if (typeof document.all != 'undefined') {
        if ('pageXOffset' in window)
            return false; // give IE9 and above the benefit of the doubt!
        else
            return true;
    }
    else
        return false;
};
exports.isIE = isIE;
var hideToolTip = function (pGanttChartObj, pTool, pTimer) {
    if (pGanttChartObj.getUseFade()) {
        clearInterval(pTool.fadeInterval);
        pTool.fadeInterval = setInterval(function () { (0, exports.fadeToolTip)(-1, pTool, 0); }, pTimer);
    }
    else {
        pTool.style.opacity = 0;
        pTool.style.filter = 'alpha(opacity=0)';
        pTool.style.visibility = 'hidden';
        pTool.vToolCont.setAttribute("showing", null);
    }
};
exports.hideToolTip = hideToolTip;
var fadeToolTip = function (pDirection, pTool, pMaxAlpha) {
    var vIncrement = parseInt(pTool.getAttribute('fadeIncrement'));
    var vAlpha = pTool.getAttribute('currentOpacity');
    var vCurAlpha = parseInt(vAlpha);
    if ((vCurAlpha != pMaxAlpha && pDirection == 1) || (vCurAlpha != 0 && pDirection == -1)) {
        var i = vIncrement;
        if (pMaxAlpha - vCurAlpha < vIncrement && pDirection == 1) {
            i = pMaxAlpha - vCurAlpha;
        }
        else if (vAlpha < vIncrement && pDirection == -1) {
            i = vCurAlpha;
        }
        vAlpha = vCurAlpha + (i * pDirection);
        pTool.style.opacity = vAlpha * 0.01;
        pTool.style.filter = 'alpha(opacity=' + vAlpha + ')';
        pTool.setAttribute('currentOpacity', vAlpha);
    }
    else {
        clearInterval(pTool.fadeInterval);
        if (pDirection == -1) {
            pTool.style.opacity = 0;
            pTool.style.filter = 'alpha(opacity=0)';
            pTool.style.visibility = 'hidden';
            pTool.vToolCont.setAttribute("showing", null);
        }
    }
};
exports.fadeToolTip = fadeToolTip;
var hashString = function (key) {
    if (!key) {
        key = 'default';
    }
    key += '';
    var hash = 5381;
    for (var i = 0; i < key.length; i++) {
        if (key.charCodeAt) {
            // tslint:disable-next-line:no-bitwise
            hash = (hash << 5) + hash + key.charCodeAt(i);
        }
        // tslint:disable-next-line:no-bitwise
        hash = hash & hash;
    }
    // tslint:disable-next-line:no-bitwise
    return hash >>> 0;
};
exports.hashString = hashString;
var hashKey = function (key) {
    return (0, exports.hashString)(key);
};
exports.hashKey = hashKey;
var criticalPath = function (tasks) {
    var path = {};
    // calculate duration
    tasks.forEach(function (task) {
        task.duration = new Date(task.pEnd).getTime() - new Date(task.pStart).getTime();
    });
    tasks.forEach(function (task) {
        if (!path[task.pID]) {
            path[task.pID] = task;
        }
        if (!path[task.pParent]) {
            path[task.pParent] = {
                childrens: []
            };
        }
        if (!path[task.pID].childrens) {
            path[task.pID].childrens = [];
        }
        path[task.pParent].childrens.push(task);
        var max = path[task.pParent].childrens[0].duration;
        path[task.pParent].childrens.forEach(function (t) {
            if (t.duration > max) {
                max = t.duration;
            }
        });
        path[task.pParent].duration = max;
    });
    var finalNodes = { 0: path[0] };
    var node = path[0];
    var _loop_1 = function () {
        if (node.childrens.length > 0) {
            var found_1 = node.childrens[0];
            var max_1 = found_1.duration;
            node.childrens.forEach(function (c) {
                if (c.duration > max_1) {
                    found_1 = c;
                    max_1 = c.duration;
                }
            });
            finalNodes[found_1.pID] = found_1;
            node = found_1;
        }
        else {
            node = null;
        }
    };
    while (node) {
        _loop_1();
    }
};
exports.criticalPath = criticalPath;
function isParentElementOrSelf(child, parent) {
    while (child) {
        if (child === parent)
            return true;
        child = child.parentElement;
    }
}
exports.isParentElementOrSelf = isParentElementOrSelf;
var updateFlyingObj = function (e, pGanttChartObj, pTimer) {
    var documentElement = document.documentElement;
    var bodyElement = document.getElementsByTagName('body')[0];
    var vCurTopBuf = 3;
    var vCurLeftBuf = 5;
    var vCurBotBuf = 3;
    var vCurRightBuf = 15;
    var vMouseX = (e) ? e.clientX : window.event.clientX;
    var vMouseY = (e) ? e.clientY : window.event.clientY;
    var vViewportX = (documentElement === null || documentElement === void 0 ? void 0 : documentElement.clientWidth) || (bodyElement === null || bodyElement === void 0 ? void 0 : bodyElement.clientWidth);
    var vViewportY = (documentElement === null || documentElement === void 0 ? void 0 : documentElement.clientHeight) || (bodyElement === null || bodyElement === void 0 ? void 0 : bodyElement.clientHeight);
    var vNewX = vMouseX;
    var vNewY = vMouseY;
    var screenX = screen.availWidth || window.innerWidth;
    var screenY = screen.availHeight || window.innerHeight;
    var vOldX = parseInt(pGanttChartObj.vTool.style.left);
    var vOldY = parseInt(pGanttChartObj.vTool.style.top);
    if (navigator.appName.toLowerCase() == 'microsoft internet explorer') {
        // the clientX and clientY properties include the left and top borders of the client area
        vMouseX -= documentElement === null || documentElement === void 0 ? void 0 : documentElement.clientLeft;
        vMouseY -= documentElement === null || documentElement === void 0 ? void 0 : documentElement.clientTop;
        var vZoomFactor = (0, exports.getZoomFactor)();
        if (vZoomFactor != 1) { // IE 7 at non-default zoom level
            vMouseX = Math.round(vMouseX / vZoomFactor);
            vMouseY = Math.round(vMouseY / vZoomFactor);
        }
    }
    var vScrollPos = (0, exports.getScrollPositions)();
    /* Code for positioned right of the mouse by default*/
    /*
    if (vMouseX+vCurRightBuf+pGanttChartObj.vTool.offsetWidth>vViewportX)
    {
        if (vMouseX-vCurLeftBuf-pGanttChartObj.vTool.offsetWidth<0) vNewX=vScrollPos.x;
        else vNewX=vMouseX+vScrollPos.x-vCurLeftBuf-pGanttChartObj.vTool.offsetWidth;
    }
    else vNewX=vMouseX+vScrollPos.x+vCurRightBuf;
    */
    /* Code for positioned left of the mouse by default */
    if (vMouseX - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth < 0) {
        if (vMouseX + vCurRightBuf + pGanttChartObj.vTool.offsetWidth > vViewportX)
            vNewX = vScrollPos.x;
        else
            vNewX = vMouseX + vScrollPos.x + vCurRightBuf;
    }
    else
        vNewX = vMouseX + vScrollPos.x - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth;
    /* Code for positioned below the mouse by default */
    if (vMouseY + vCurBotBuf + pGanttChartObj.vTool.offsetHeight > vViewportY) {
        if (vMouseY - vCurTopBuf - pGanttChartObj.vTool.offsetHeight < 0)
            vNewY = vScrollPos.y;
        else
            vNewY = vMouseY + vScrollPos.y - vCurTopBuf - pGanttChartObj.vTool.offsetHeight;
    }
    else
        vNewY = vMouseY + vScrollPos.y + vCurBotBuf;
    /* Code for positioned above the mouse by default */
    /*
    if (vMouseY-vCurTopBuf-pGanttChartObj.vTool.offsetHeight<0)
    {
        if (vMouseY+vCurBotBuf+pGanttChartObj.vTool.offsetHeight>vViewportY) vNewY=vScrollPos.y;
        else vNewY=vMouseY+vScrollPos.y+vCurBotBuf;
    }
    else vNewY=vMouseY+vScrollPos.y-vCurTopBuf-pGanttChartObj.vTool.offsetHeight;
    */
    var outViewport = Math.abs(vOldX - vNewX) > screenX || Math.abs(vOldY - vNewY) > screenY;
    if (pGanttChartObj.getUseMove() && !outViewport) {
        clearInterval(pGanttChartObj.vTool.moveInterval);
        pGanttChartObj.vTool.moveInterval = setInterval(function () { (0, exports.moveToolTip)(vNewX, vNewY, pGanttChartObj.vTool, pTimer); }, pTimer);
    }
    else {
        pGanttChartObj.vTool.style.left = vNewX + 'px';
        pGanttChartObj.vTool.style.top = vNewY + 'px';
    }
};
exports.updateFlyingObj = updateFlyingObj;
var moveToolTip = function (pNewX, pNewY, pTool, timer) {
    var vSpeed = parseInt(pTool.getAttribute('moveSpeed'));
    var vOldX = parseInt(pTool.style.left);
    var vOldY = parseInt(pTool.style.top);
    if (pTool.style.visibility != 'visible') {
        pTool.style.left = pNewX + 'px';
        pTool.style.top = pNewY + 'px';
        clearInterval(pTool.moveInterval);
    }
    else {
        if (pNewX != vOldX && pNewY != vOldY) {
            vOldX += Math.ceil((pNewX - vOldX) / vSpeed);
            vOldY += Math.ceil((pNewY - vOldY) / vSpeed);
            pTool.style.left = vOldX + 'px';
            pTool.style.top = vOldY + 'px';
        }
        else {
            clearInterval(pTool.moveInterval);
        }
    }
};
exports.moveToolTip = moveToolTip;
var makeRequest = function (pFile, json, vDebug) {
    if (json === void 0) { json = true; }
    if (vDebug === void 0) { vDebug = false; }
    if (window.fetch) {
        var f = fetch(pFile);
        if (json) {
            return f.then(function (res) { return res.json(); });
        }
        else {
            return f;
        }
    }
    else {
        return (0, exports.makeRequestOldBrowsers)(pFile, vDebug)
            .then(function (xhttp) {
            if (json) {
                var jsonObj = JSON.parse(xhttp.response);
                return jsonObj;
            }
            else {
                var xmlDoc = xhttp.responseXML;
                return xmlDoc;
            }
        });
    }
};
exports.makeRequest = makeRequest;
var makeRequestOldBrowsers = function (pFile, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    return new Promise(function (resolve, reject) {
        var bd;
        if (vDebug) {
            bd = new Date();
            console.info('before jsonparse', bd);
        }
        var xhttp;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        }
        else { // IE 5/6
            xhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
        }
        xhttp.open('GET', pFile, true);
        xhttp.send(null);
        xhttp.onload = function (e) {
            if (xhttp.readyState === 4) {
                if (xhttp.status === 200) {
                    // resolve(xhttp.responseText);
                }
                else {
                    console.error(xhttp.statusText);
                }
                if (vDebug) {
                    bd = new Date();
                    console.info('before jsonparse', bd);
                }
                resolve(xhttp);
            }
        };
        xhttp.onerror = function (e) {
            reject(xhttp.statusText);
        };
    });
};
exports.makeRequestOldBrowsers = makeRequestOldBrowsers;
var calculateStartEndFromDepend = function (tasksList) {
};
exports.calculateStartEndFromDepend = calculateStartEndFromDepend;
var printChart = function (width, height, css) {
    if (css === void 0) { css = undefined; }
    if (css === undefined) {
        css = // Default injected CSS
            "@media print {\n        @page {\n          size: ".concat(width, "mm ").concat(height, "mm;\n        }\n        /* set gantt container to the same width as the page */\n        .gchartcontainer {\n            width: ").concat(width, "mm;\n        }\n    };");
    }
    var $container = document.querySelector('.gchartcontainer');
    $container.insertAdjacentHTML('afterbegin', "<style>".concat(css, "</style>"));
    // Remove the print CSS when the print dialog is closed
    window.addEventListener('afterprint', function () {
        $container.removeChild($container.children[0]);
    }, { 'once': true });
    // Trigger the print
    window.print();
};
exports.printChart = printChart;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getXMLTask = exports.getXMLProject = exports.AddXMLTask = exports.getXMLNodeValue = exports.findXMLNode = exports.parseXMLString = exports.parseXML = void 0;
var task_1 = require("./task");
var date_utils_1 = require("./utils/date_utils");
var draw_utils_1 = require("./utils/draw_utils");
var general_utils_1 = require("./utils/general_utils");
var parseXML = function (pFile, pGanttVar) {
    return (0, general_utils_1.makeRequest)(pFile, false, false)
        .then(function (xmlDoc) {
        (0, exports.AddXMLTask)(pGanttVar, xmlDoc);
    });
};
exports.parseXML = parseXML;
var parseXMLString = function (pStr, pGanttVar) {
    var xmlDoc;
    if (typeof window.DOMParser != 'undefined') {
        xmlDoc = (new window.DOMParser()).parseFromString(pStr, 'text/xml');
    }
    else if (typeof window.ActiveXObject != 'undefined' &&
        new window.ActiveXObject('Microsoft.XMLDOM')) {
        xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = 'false';
        xmlDoc.loadXML(pStr);
    }
    (0, exports.AddXMLTask)(pGanttVar, xmlDoc);
};
exports.parseXMLString = parseXMLString;
var findXMLNode = function (pRoot, pNodeName) {
    var vRetValue;
    try {
        vRetValue = pRoot.getElementsByTagName(pNodeName);
    }
    catch (error) {
        ;
    } // do nothing, we'll return undefined
    return vRetValue;
};
exports.findXMLNode = findXMLNode;
// pType can be 1=numeric, 2=String, all other values just return raw data
var getXMLNodeValue = function (pRoot, pNodeName, pType, pDefault) {
    var vRetValue;
    try {
        vRetValue = pRoot.getElementsByTagName(pNodeName)[0].childNodes[0].nodeValue;
    }
    catch (error) {
        if (typeof pDefault != 'undefined')
            vRetValue = pDefault;
    }
    if (typeof vRetValue != 'undefined' && vRetValue != null) {
        if (pType == 1)
            vRetValue *= 1;
        else if (pType == 2)
            vRetValue = vRetValue.toString();
    }
    return vRetValue;
};
exports.getXMLNodeValue = getXMLNodeValue;
var AddXMLTask = function (pGanttVar, pXmlDoc) {
    var project = '';
    var Task;
    var n = 0;
    var m = 0;
    var i = 0;
    var j = 0;
    var k = 0;
    var maxPID = 0;
    var ass = new Array();
    var assRes = new Array();
    var res = new Array();
    var pars = new Array();
    var projNode = (0, exports.findXMLNode)(pXmlDoc, 'Project');
    if (typeof projNode != 'undefined' && projNode.length > 0) {
        project = projNode[0].getAttribute('xmlns');
    }
    if (project == 'http://schemas.microsoft.com/project') {
        pGanttVar.setDateInputFormat('yyyy-mm-dd');
        Task = (0, exports.findXMLNode)(pXmlDoc, 'Task');
        if (typeof Task == 'undefined')
            n = 0;
        else
            n = Task.length;
        var resources = (0, exports.findXMLNode)(pXmlDoc, 'Resource');
        if (typeof resources == 'undefined') {
            n = 0;
            m = 0;
        }
        else
            m = resources.length;
        for (i = 0; i < m; i++) {
            var resname = (0, exports.getXMLNodeValue)(resources[i], 'Name', 2, '');
            var uid = (0, exports.getXMLNodeValue)(resources[i], 'UID', 1, -1);
            if (resname.length > 0 && uid > 0)
                res[uid] = resname;
        }
        var assignments = (0, exports.findXMLNode)(pXmlDoc, 'Assignment');
        if (typeof assignments == 'undefined')
            j = 0;
        else
            j = assignments.length;
        for (i = 0; i < j; i++) {
            var uid = void 0;
            var resUID = (0, exports.getXMLNodeValue)(assignments[i], 'ResourceUID', 1, -1);
            uid = (0, exports.getXMLNodeValue)(assignments[i], 'TaskUID', 1, -1);
            if (uid > 0) {
                if (resUID > 0)
                    assRes[uid] = res[resUID];
                ass[uid] = assignments[i];
            }
        }
        // Store information about parent UIDs in an easily searchable form
        for (i = 0; i < n; i++) {
            var uid = void 0;
            uid = (0, exports.getXMLNodeValue)(Task[i], 'UID', 1, 0);
            var vOutlineNumber = void 0;
            if (uid != 0)
                vOutlineNumber = (0, exports.getXMLNodeValue)(Task[i], 'OutlineNumber', 2, '0');
            if (uid > 0)
                pars[vOutlineNumber] = uid;
            if (uid > maxPID)
                maxPID = uid;
        }
        for (i = 0; i < n; i++) {
            // optional parameters may not have an entry
            // Task ID must NOT be zero otherwise it will be skipped
            var pID = (0, exports.getXMLNodeValue)(Task[i], 'UID', 1, 0);
            if (pID != 0) {
                var pName = (0, exports.getXMLNodeValue)(Task[i], 'Name', 2, 'No Task Name');
                var pStart = (0, exports.getXMLNodeValue)(Task[i], 'Start', 2, '');
                var pEnd = (0, exports.getXMLNodeValue)(Task[i], 'Finish', 2, '');
                var pPlanStart = (0, exports.getXMLNodeValue)(Task[i], 'PlanStart', 2, '');
                var pPlanEnd = (0, exports.getXMLNodeValue)(Task[i], 'PlanFinish', 2, '');
                var pDuration = (0, exports.getXMLNodeValue)(Task[i], 'Duration', 2, '');
                var pLink = (0, exports.getXMLNodeValue)(Task[i], 'HyperlinkAddress', 2, '');
                var pMile = (0, exports.getXMLNodeValue)(Task[i], 'Milestone', 1, 0);
                var pComp = (0, exports.getXMLNodeValue)(Task[i], 'PercentWorkComplete', 1, 0);
                var pCost = (0, exports.getXMLNodeValue)(Task[i], 'Cost', 2, 0);
                var pGroup = (0, exports.getXMLNodeValue)(Task[i], 'Summary', 1, 0);
                var pParent = 0;
                var vOutlineLevel = (0, exports.getXMLNodeValue)(Task[i], 'OutlineLevel', 1, 0);
                var vOutlineNumber = void 0;
                if (vOutlineLevel > 1) {
                    vOutlineNumber = (0, exports.getXMLNodeValue)(Task[i], 'OutlineNumber', 2, '0');
                    pParent = pars[vOutlineNumber.substr(0, vOutlineNumber.lastIndexOf('.'))];
                }
                var pNotes = void 0;
                try {
                    pNotes = Task[i].getElementsByTagName('Notes')[0].childNodes[1].nodeValue; //this should be a CDATA node
                }
                catch (error) {
                    pNotes = '';
                }
                var pRes = void 0;
                if (typeof assRes[pID] != 'undefined')
                    pRes = assRes[pID];
                else
                    pRes = '';
                var predecessors = (0, exports.findXMLNode)(Task[i], 'PredecessorLink');
                if (typeof predecessors == 'undefined')
                    j = 0;
                else
                    j = predecessors.length;
                var pDepend = '';
                for (k = 0; k < j; k++) {
                    var depUID = (0, exports.getXMLNodeValue)(predecessors[k], 'PredecessorUID', 1, -1);
                    var depType = (0, exports.getXMLNodeValue)(predecessors[k], 'Type', 1, 1);
                    if (depUID > 0) {
                        if (pDepend.length > 0)
                            pDepend += ',';
                        switch (depType) {
                            case 0:
                                pDepend += depUID + 'FF';
                                break;
                            case 1:
                                pDepend += depUID + 'FS';
                                break;
                            case 2:
                                pDepend += depUID + 'SF';
                                break;
                            case 3:
                                pDepend += depUID + 'SS';
                                break;
                            default:
                                pDepend += depUID + 'FS';
                                break;
                        }
                    }
                }
                var pOpen = 1;
                var pCaption = '';
                var pClass = void 0;
                if (pGroup > 0)
                    pClass = 'ggroupblack';
                else if (pMile > 0)
                    pClass = 'gmilestone';
                else
                    pClass = 'gtaskblue';
                // check for split tasks
                var splits = (0, exports.findXMLNode)(ass[pID], 'TimephasedData');
                if (typeof splits == 'undefined')
                    j = 0;
                else
                    j = splits.length;
                var vSplitStart = pStart;
                var vSplitEnd = pEnd;
                var vSubCreated = false;
                var vDepend = pDepend.replace(/,*[0-9]+[FS]F/g, '');
                for (k = 0; k < j; k++) {
                    var vDuration = (0, exports.getXMLNodeValue)(splits[k], 'Value', 2, '0');
                    //remove all text
                    vDuration = '0' + vDuration.replace(/\D/g, '');
                    vDuration *= 1;
                    if ((vDuration == 0 && !vSubCreated) || (k + 1 == j && pGroup == 2)) {
                        // No time booked in the given period (or last entry)
                        // Make sure the parent task is set as a combined group
                        pGroup = 2;
                        // Handle last loop
                        if (k + 1 == j)
                            vDepend = pDepend.replace(/,*[0-9]+[FS]S/g, '');
                        // Now create a subtask
                        maxPID++;
                        vSplitEnd = (0, exports.getXMLNodeValue)(splits[k], (k + 1 == j) ? 'Finish' : 'Start', 2, '');
                        pGanttVar.AddTaskItem(new task_1.TaskItem(maxPID, pName, vSplitStart, vSplitEnd, 'gtaskblue', pLink, pMile, pRes, pComp, 0, pID, pOpen, vDepend, pCaption, pNotes, pGanttVar, pCost, pPlanStart, pPlanEnd, pDuration));
                        vSubCreated = true;
                        vDepend = '';
                    }
                    else if (vDuration != 0 && vSubCreated) {
                        vSplitStart = (0, exports.getXMLNodeValue)(splits[k], 'Start', 2, '');
                        vSubCreated = false;
                    }
                }
                if (vSubCreated)
                    pDepend = '';
                // Finally add the task
                pGanttVar.AddTaskItem(new task_1.TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar, pCost, pPlanStart, pPlanEnd, pDuration, undefined, undefined, pClass));
            }
        }
    }
    else {
        Task = pXmlDoc.getElementsByTagName('task');
        n = Task.length;
        for (i = 0; i < n; i++) {
            // optional parameters may not have an entry
            // Task ID must NOT be zero otherwise it will be skipped
            var pID = (0, exports.getXMLNodeValue)(Task[i], 'pID', 1, 0);
            if (pID != 0) {
                var pName = (0, exports.getXMLNodeValue)(Task[i], 'pName', 2, 'No Task Name');
                var pStart = (0, exports.getXMLNodeValue)(Task[i], 'pStart', 2, '');
                var pEnd = (0, exports.getXMLNodeValue)(Task[i], 'pEnd', 2, '');
                var pPlanStart = (0, exports.getXMLNodeValue)(Task[i], 'pPlanStart', 2, '');
                var pPlanEnd = (0, exports.getXMLNodeValue)(Task[i], 'pPlanEnd', 2, '');
                var pDuration = (0, exports.getXMLNodeValue)(Task[i], 'pDuration', 2, '');
                var pLink = (0, exports.getXMLNodeValue)(Task[i], 'pLink', 2, '');
                var pMile = (0, exports.getXMLNodeValue)(Task[i], 'pMile', 1, 0);
                var pComp = (0, exports.getXMLNodeValue)(Task[i], 'pComp', 1, 0);
                var pCost = (0, exports.getXMLNodeValue)(Task[i], 'pCost', 2, 0);
                var pGroup = (0, exports.getXMLNodeValue)(Task[i], 'pGroup', 1, 0);
                var pParent = (0, exports.getXMLNodeValue)(Task[i], 'pParent', 1, 0);
                var pRes = (0, exports.getXMLNodeValue)(Task[i], 'pRes', 2, '');
                var pOpen = (0, exports.getXMLNodeValue)(Task[i], 'pOpen', 1, 1);
                var pDepend = (0, exports.getXMLNodeValue)(Task[i], 'pDepend', 2, '');
                var pCaption = (0, exports.getXMLNodeValue)(Task[i], 'pCaption', 2, '');
                var pNotes = (0, exports.getXMLNodeValue)(Task[i], 'pNotes', 2, '');
                var pClass = (0, exports.getXMLNodeValue)(Task[i], 'pClass', 2, '');
                var pPlanClass = (0, exports.getXMLNodeValue)(Task[i], 'pPlanClass', 2, '');
                if (typeof pClass == 'undefined') {
                    if (pGroup > 0)
                        pClass = 'ggroupblack';
                    else if (pMile > 0)
                        pClass = 'gmilestone';
                    else
                        pClass = 'gtaskblue';
                }
                if (typeof pPlanClass == 'undefined')
                    pPlanClass = pClass;
                // Finally add the task
                pGanttVar.AddTaskItem(new task_1.TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar, pCost, pPlanStart, pPlanEnd, pDuration, undefined, undefined, pPlanClass));
            }
        }
    }
};
exports.AddXMLTask = AddXMLTask;
var getXMLProject = function () {
    var vProject = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
    for (var i = 0; i < this.vTaskList.length; i++) {
        vProject += this.getXMLTask(i, true);
    }
    vProject += '</project>';
    return vProject;
};
exports.getXMLProject = getXMLProject;
var getXMLTask = function (pID, pIdx) {
    var i = 0;
    var vIdx = -1;
    var vTask = '';
    var vOutFrmt = (0, date_utils_1.parseDateFormatStr)(this.getDateInputFormat() + ' HH:MI:SS');
    if (pIdx === true)
        vIdx = pID;
    else {
        for (i = 0; i < this.vTaskList.length; i++) {
            if (this.vTaskList[i].getID() == pID) {
                vIdx = i;
                break;
            }
        }
    }
    if (vIdx >= 0 && vIdx < this.vTaskList.length) {
        /* Simplest way to return case sensitive node names is to just build a string */
        vTask = '<task>';
        vTask += '<pID>' + this.vTaskList[vIdx].getID() + '</pID>';
        vTask += '<pName>' + this.vTaskList[vIdx].getName() + '</pName>';
        vTask += '<pStart>' + (0, date_utils_1.formatDateStr)(this.vTaskList[vIdx].getStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pStart>';
        vTask += '<pEnd>' + (0, date_utils_1.formatDateStr)(this.vTaskList[vIdx].getEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pEnd>';
        vTask += '<pPlanStart>' + (0, date_utils_1.formatDateStr)(this.vTaskList[vIdx].getPlanStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pPlanStart>';
        vTask += '<pPlanEnd>' + (0, date_utils_1.formatDateStr)(this.vTaskList[vIdx].getPlanEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pPlanEnd>';
        vTask += '<pDuration>' + this.vTaskList[vIdx].getDuration() + '</pDuration>';
        vTask += '<pClass>' + this.vTaskList[vIdx].getClass() + '</pClass>';
        vTask += '<pLink>' + this.vTaskList[vIdx].getLink() + '</pLink>';
        vTask += '<pMile>' + this.vTaskList[vIdx].getMile() + '</pMile>';
        if (this.vTaskList[vIdx].getResource() != '\u00A0')
            vTask += '<pRes>' + this.vTaskList[vIdx].getResource() + '</pRes>';
        vTask += '<pComp>' + this.vTaskList[vIdx].getCompVal() + '</pComp>';
        vTask += '<pCost>' + this.vTaskList[vIdx].getCost() + '</pCost>';
        vTask += '<pGroup>' + this.vTaskList[vIdx].getGroup() + '</pGroup>';
        vTask += '<pParent>' + this.vTaskList[vIdx].getParent() + '</pParent>';
        vTask += '<pOpen>' + this.vTaskList[vIdx].getOpen() + '</pOpen>';
        vTask += '<pDepend>';
        var vDepList = this.vTaskList[vIdx].getDepend();
        for (i = 0; i < vDepList.length; i++) {
            if (i > 0)
                vTask += ',';
            if (vDepList[i] > 0)
                vTask += vDepList[i] + this.vTaskList[vIdx].getDepType()[i];
        }
        vTask += '</pDepend>';
        vTask += '<pCaption>' + this.vTaskList[vIdx].getCaption() + '</pCaption>';
        var vTmpFrag = document.createDocumentFragment();
        var vTmpDiv = (0, draw_utils_1.newNode)(vTmpFrag, 'div', null, null, this.vTaskList[vIdx].getNotes().innerHTML);
        vTask += '<pNotes>' + vTmpDiv.innerHTML + '</pNotes>';
        vTask += '<pPlanClass>' + this.vTaskList[vIdx].getPlanClass() + '</pPlanClass>';
        vTask += '</task>';
    }
    return vTask;
};
exports.getXMLTask = getXMLTask;

},{"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13}]},{},[1])(1)
});
