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
        if (this.vShowWeekends !== false && pStartDate && pEndDate && (this.vFormat == "day" || this.vFormat == "week")) {
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
            if (this.vShowWeekends !== false && this.vFormat == "day" && (j % 7 == 4 || j % 7 == 5)) {
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
