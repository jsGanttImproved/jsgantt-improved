(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSGantt = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsGantt = require("./src/jsgantt");
module.exports = jsGantt.JSGantt;
exports.JSGantt = jsGantt.JSGantt;

},{"./src/jsgantt":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lang = require("./lang");
var events_1 = require("./events");
var utils_1 = require("./utils");
var task_1 = require("./task");
var options_1 = require("./options");
var xml_1 = require("./xml");
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
    this.vShowPlanEndDate = 0;
    this.vShowEndWeekDate = 1;
    this.vShowTaskInfoRes = 1;
    this.vShowTaskInfoDur = 1;
    this.vShowTaskInfoComp = 1;
    this.vShowTaskInfoStartDate = 1;
    this.vShowTaskInfoEndDate = 1;
    this.vShowTaskInfoNotes = 1;
    this.vShowTaskInfoLink = 0;
    this.vEventClickRow = 1;
    this.vShowDeps = 1;
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
    };
    this.vResources = null;
    this.vAdditionalHeaders = {};
    this.vEditable = false;
    this.vDebug = false;
    this.vShowSelector = new Array('top');
    this.vDateInputFormat = 'yyyy-mm-dd';
    this.vDateTaskTableDisplayFormat = utils_1.parseDateFormatStr('dd/mm/yyyy');
    this.vDateTaskDisplayFormat = utils_1.parseDateFormatStr('dd month yyyy');
    this.vHourMajorDateDisplayFormat = utils_1.parseDateFormatStr('day dd month yyyy');
    this.vHourMinorDateDisplayFormat = utils_1.parseDateFormatStr('HH');
    this.vDayMajorDateDisplayFormat = utils_1.parseDateFormatStr('dd/mm/yyyy');
    this.vDayMinorDateDisplayFormat = utils_1.parseDateFormatStr('dd');
    this.vWeekMajorDateDisplayFormat = utils_1.parseDateFormatStr('yyyy');
    this.vWeekMinorDateDisplayFormat = utils_1.parseDateFormatStr('dd/mm');
    this.vMonthMajorDateDisplayFormat = utils_1.parseDateFormatStr('yyyy');
    this.vMonthMinorDateDisplayFormat = utils_1.parseDateFormatStr('mon');
    this.vQuarterMajorDateDisplayFormat = utils_1.parseDateFormatStr('yyyy');
    this.vQuarterMinorDateDisplayFormat = utils_1.parseDateFormatStr('qq');
    this.vUseFullYear = utils_1.parseDateFormatStr('dd/mm/yyyy');
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
    this.includeGetSet = options_1.includeGetSet.bind(this);
    this.includeGetSet();
    this.mouseOver = events_1.mouseOver;
    this.mouseOut = events_1.mouseOut;
    this.createTaskInfo = task_1.createTaskInfo;
    this.AddTaskItem = task_1.AddTaskItem;
    this.AddTaskItemObject = task_1.AddTaskItemObject;
    this.RemoveTaskItem = task_1.RemoveTaskItem;
    this.getXMLProject = xml_1.getXMLProject;
    this.getXMLTask = xml_1.getXMLTask;
    this.CalcTaskXY = function () {
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
    this.clearDependencies = function () {
        var parent = this.getLines();
        while (parent.hasChildNodes())
            parent.removeChild(parent.firstChild);
        this.vDepId = 1;
    };
    // sLine: Draw a straight line (colored one-pixel wide div)
    this.sLine = function (x1, y1, x2, y2, pClass) {
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
        return vTmpDiv;
    };
    this.drawDependency = function (x1, y1, x2, y2, pType, pClass) {
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
    this.DrawDependencies = function (vDebug) {
        if (vDebug === void 0) { vDebug = false; }
        if (this.getShowDeps() == 1) {
            //First recalculate the x,y
            this.CalcTaskXY();
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
                                    console.log("init drawDependency ", vList[vTask].getID(), new Date());
                                }
                                var cssClass = 'gDepId' + vList[vTask].getID();
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
        if (this.vTodayPx >= 0)
            this.sLine(this.vTodayPx, 0, this.vTodayPx, this.getChartTable().offsetHeight - 1, 'gCurDate');
    };
    this.getArrayLocationByID = function (pId) {
        var vList = this.getList();
        for (var i = 0; i < vList.length; i++) {
            if (vList[i].getID() == pId)
                return i;
        }
        return -1;
    };
    this.newNode = function (pParent, pNodeType, pId, pClass, pText, pWidth, pLeft, pDisplay, pColspan, pAttribs) {
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
    this.Draw = function () {
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
            vMinDate = utils_1.getMinDate(this.vTaskList, this.vFormat);
            vMaxDate = utils_1.getMaxDate(this.vTaskList, this.vFormat);
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
            var vTmpDiv = this.newNode(vLeftHeader, 'div', this.vDivId + 'glisthead', 'glistlbl gcontainercol');
            this.setListBody(vTmpDiv);
            var vTmpTab = this.newNode(vTmpDiv, 'table', null, 'gtasktableh');
            var vTmpTBody = this.newNode(vTmpTab, 'tbody');
            var vTmpRow = this.newNode(vTmpTBody, 'tr');
            this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
            var vTmpCell = this.newNode(vTmpRow, 'td', null, 'gspanning gtaskname');
            vTmpCell.appendChild(this.drawSelector('top'));
            if (this.vShowRes == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
            if (this.vShowDur == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');
            if (this.vShowComp == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
            if (this.vShowStartDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
            if (this.vShowEndDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');
            if (this.vShowPlanStartDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
            if (this.vShowPlanEndDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gplanenddate', '\u00A0');
            if (this.vShowCost == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gcost', '\u00A0');
            if (this.vAdditionalHeaders) {
                for (var key in this.vAdditionalHeaders) {
                    var header = this.vAdditionalHeaders[key];
                    var css = header.class ? header.class : "gadditional-" + key;
                    this.newNode(vTmpRow, 'td', null, "gspanning gadditional " + css, '\u00A0');
                }
            }
            vTmpRow = this.newNode(vTmpTBody, 'tr');
            this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
            this.newNode(vTmpRow, 'td', null, 'gtaskname', '\u00A0');
            if (this.vShowRes == 1)
                this.newNode(vTmpRow, 'td', null, 'gtaskheading gresource', this.vLangs[this.vLang]['resource']);
            if (this.vShowDur == 1)
                this.newNode(vTmpRow, 'td', null, 'gtaskheading gduration', this.vLangs[this.vLang]['duration']);
            if (this.vShowComp == 1)
                this.newNode(vTmpRow, 'td', null, 'gtaskheading gpccomplete', this.vLangs[this.vLang]['comp']);
            if (this.vShowStartDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gtaskheading gstartdate', this.vLangs[this.vLang]['startdate']);
            if (this.vShowEndDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gtaskheading genddate', this.vLangs[this.vLang]['enddate']);
            if (this.vShowPlanStartDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gtaskheading gplanstartdate', this.vLangs[this.vLang]['planstartdate']);
            if (this.vShowPlanEndDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gtaskheading gplanenddate', this.vLangs[this.vLang]['planenddate']);
            if (this.vShowCost == 1)
                this.newNode(vTmpRow, 'td', null, 'gtaskheading gcost', this.vLangs[this.vLang]['cost']);
            if (this.vAdditionalHeaders) {
                for (var key in this.vAdditionalHeaders) {
                    var header = this.vAdditionalHeaders[key];
                    var text = header.translate ? this.vLangs[this.vLang][header.translate] : header.title;
                    var css = header.class ? header.class : "gadditional-" + key;
                    this.newNode(vTmpRow, 'td', null, "gtaskheading gadditional " + css, text);
                }
            }
            /**
             * LIST BODY
             *
             *
            */
            var vTmpDiv2 = void 0;
            var _loop_1 = function (i_1) {
                var vBGColor = void 0;
                if (this_1.vTaskList[i_1].getGroup() == 1)
                    vBGColor = 'ggroupitem';
                else
                    vBGColor = 'glineitem';
                vID = this_1.vTaskList[i_1].getID();
                if ((!(this_1.vTaskList[i_1].getParItem() && this_1.vTaskList[i_1].getParItem().getGroup() == 2)) || this_1.vTaskList[i_1].getGroup() == 2) {
                    if (this_1.vTaskList[i_1].getVisible() == 0)
                        vTmpRow = this_1.newNode(vTmpTBody, 'tr', this_1.vDivId + 'child_' + vID, 'gname ' + vBGColor, null, null, null, 'none');
                    else
                        vTmpRow = this_1.newNode(vTmpTBody, 'tr', this_1.vDivId + 'child_' + vID, 'gname ' + vBGColor);
                    this_1.vTaskList[i_1].setListChildRow(vTmpRow);
                    this_1.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
                    vTmpCell = this_1.newNode(vTmpRow, 'td', null, 'gtaskname');
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
                    }, vTmpRow);
                    if (this_1.vTaskList[i_1].getGroup() == 1) {
                        vTmpDiv = this_1.newNode(vTmpCell, 'div', null, null, vCellContents);
                        var vTmpSpan = this_1.newNode(vTmpDiv, 'span', this_1.vDivId + 'group_' + vID, 'gfoldercollapse', (this_1.vTaskList[i_1].getOpen() == 1) ? '-' : '+');
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
                        var text = makeInput(this_1.vTaskList[i_1].getName(), this_1.vEditable, 'text');
                        vTmpDiv = this_1.newNode(vTmpCell, 'div', null, null, vCellContents + text);
                        var callback = function (task, e) { return task.setName(e.target.value); };
                        events_1.addListenerInputCell(vTmpCell, this_1.vEventsChange, callback, this_1.vTaskList[i_1], 'taskname', this_1.Draw.bind(this_1));
                        events_1.addListenerClickCell(vTmpCell, this_1.vEvents, this_1.vTaskList[i_1], 'taskname');
                    }
                    if (this_1.vShowRes == 1) {
                        vTmpCell = this_1.newNode(vTmpRow, 'td', null, 'gresource');
                        var text = makeInput(this_1.vTaskList[i_1].getResource(), this_1.vEditable, 'resource', this_1.vTaskList[i_1].getResource(), this_1.vResources);
                        vTmpDiv = this_1.newNode(vTmpCell, 'div', null, null, text);
                        var callback = function (task, e) { return task.setResource(e.target.value); };
                        events_1.addListenerInputCell(vTmpCell, this_1.vEventsChange, callback, this_1.vTaskList[i_1], 'res', this_1.Draw.bind(this_1), 'change');
                        events_1.addListenerClickCell(vTmpCell, this_1.vEvents, this_1.vTaskList[i_1], 'res');
                    }
                    if (this_1.vShowDur == 1) {
                        vTmpCell = this_1.newNode(vTmpRow, 'td', null, 'gduration');
                        var text = makeInput(this_1.vTaskList[i_1].getDuration(this_1.vFormat, this_1.vLangs[this_1.vLang]), this_1.vEditable, 'text', this_1.vTaskList[i_1].getDuration());
                        vTmpDiv = this_1.newNode(vTmpCell, 'div', null, null, text);
                        var callback = function (task, e) { return task.setDuration(e.target.value); };
                        events_1.addListenerInputCell(vTmpCell, this_1.vEventsChange, callback, this_1.vTaskList[i_1], 'dur', this_1.Draw.bind(this_1));
                        events_1.addListenerClickCell(vTmpCell, this_1.vEvents, this_1.vTaskList[i_1], 'dur');
                    }
                    if (this_1.vShowComp == 1) {
                        vTmpCell = this_1.newNode(vTmpRow, 'td', null, 'gpccomplete');
                        var text = makeInput(this_1.vTaskList[i_1].getCompStr(), this_1.vEditable, 'percentage', this_1.vTaskList[i_1].getCompVal());
                        vTmpDiv = this_1.newNode(vTmpCell, 'div', null, null, text);
                        var callback = function (task, e) { return task.setCompVal(e.target.value); };
                        events_1.addListenerInputCell(vTmpCell, this_1.vEventsChange, callback, this_1.vTaskList[i_1], 'comp', this_1.Draw.bind(this_1));
                        events_1.addListenerClickCell(vTmpCell, this_1.vEvents, this_1.vTaskList[i_1], 'comp');
                    }
                    if (this_1.vShowStartDate == 1) {
                        vTmpCell = this_1.newNode(vTmpRow, 'td', null, 'gstartdate');
                        var v = utils_1.formatDateStr(this_1.vTaskList[i_1].getStart(), this_1.vDateTaskTableDisplayFormat, this_1.vLangs[this_1.vLang]);
                        var text = makeInput(v, this_1.vEditable, 'date', this_1.vTaskList[i_1].getStart());
                        vTmpDiv = this_1.newNode(vTmpCell, 'div', null, null, text);
                        var callback = function (task, e) { return task.setStart(e.target.value); };
                        events_1.addListenerInputCell(vTmpCell, this_1.vEventsChange, callback, this_1.vTaskList[i_1], 'start', this_1.Draw.bind(this_1));
                        events_1.addListenerClickCell(vTmpCell, this_1.vEvents, this_1.vTaskList[i_1], 'start');
                    }
                    if (this_1.vShowEndDate == 1) {
                        vTmpCell = this_1.newNode(vTmpRow, 'td', null, 'genddate');
                        var v = utils_1.formatDateStr(this_1.vTaskList[i_1].getEnd(), this_1.vDateTaskTableDisplayFormat, this_1.vLangs[this_1.vLang]);
                        var text = makeInput(v, this_1.vEditable, 'date', this_1.vTaskList[i_1].getEnd());
                        vTmpDiv = this_1.newNode(vTmpCell, 'div', null, null, text);
                        var callback = function (task, e) { return task.setEnd(e.target.value); };
                        events_1.addListenerInputCell(vTmpCell, this_1.vEventsChange, callback, this_1.vTaskList[i_1], 'end', this_1.Draw.bind(this_1));
                        events_1.addListenerClickCell(vTmpCell, this_1.vEvents, this_1.vTaskList[i_1], 'end');
                    }
                    if (this_1.vShowPlanStartDate == 1) {
                        vTmpCell = this_1.newNode(vTmpRow, 'td', null, 'gplanstartdate');
                        var v = this_1.vTaskList[i_1].getPlanStart() ? utils_1.formatDateStr(this_1.vTaskList[i_1].getPlanStart(), this_1.vDateTaskTableDisplayFormat, this_1.vLangs[this_1.vLang]) : '';
                        var text = makeInput(v, this_1.vEditable, 'date', this_1.vTaskList[i_1].getPlanStart());
                        vTmpDiv = this_1.newNode(vTmpCell, 'div', null, null, text);
                        var callback = function (task, e) { return task.setPlanStart(e.target.value); };
                        events_1.addListenerInputCell(vTmpCell, this_1.vEventsChange, callback, this_1.vTaskList[i_1], 'planstart', this_1.Draw.bind(this_1));
                        events_1.addListenerClickCell(vTmpCell, this_1.vEvents, this_1.vTaskList[i_1], 'planstart');
                    }
                    if (this_1.vShowPlanEndDate == 1) {
                        vTmpCell = this_1.newNode(vTmpRow, 'td', null, 'gplanenddate');
                        var v = this_1.vTaskList[i_1].getPlanEnd() ? utils_1.formatDateStr(this_1.vTaskList[i_1].getPlanEnd(), this_1.vDateTaskTableDisplayFormat, this_1.vLangs[this_1.vLang]) : '';
                        var text = makeInput(v, this_1.vEditable, 'date', this_1.vTaskList[i_1].getPlanEnd());
                        vTmpDiv = this_1.newNode(vTmpCell, 'div', null, null, text);
                        var callback = function (task, e) { return task.setPlanEnd(e.target.value); };
                        events_1.addListenerInputCell(vTmpCell, this_1.vEventsChange, callback, this_1.vTaskList[i_1], 'planend', this_1.Draw.bind(this_1));
                        events_1.addListenerClickCell(vTmpCell, this_1.vEvents, this_1.vTaskList[i_1], 'planend');
                    }
                    if (this_1.vShowCost == 1) {
                        vTmpCell = this_1.newNode(vTmpRow, 'td', null, 'gcost');
                        var text = makeInput(this_1.vTaskList[i_1].getCost(), this_1.vEditable, 'cost');
                        vTmpDiv = this_1.newNode(vTmpCell, 'div', null, null, text);
                        var callback = function (task, e) { return task.setCost(e.target.value); };
                        events_1.addListenerInputCell(vTmpCell, this_1.vEventsChange, callback, this_1.vTaskList[i_1], 'cost', this_1.Draw.bind(this_1));
                        events_1.addListenerClickCell(vTmpCell, this_1.vEvents, this_1.vTaskList[i_1], 'cost');
                    }
                    if (this_1.vAdditionalHeaders) {
                        for (var key in this_1.vAdditionalHeaders) {
                            var header = this_1.vAdditionalHeaders[key];
                            var css = header.class ? header.class : "gadditional-" + key;
                            var data = this_1.vTaskList[i_1].getDataObject();
                            if (data) {
                                vTmpCell = this_1.newNode(vTmpRow, 'td', null, "gadditional " + css);
                            }
                            // const callback = (task, e) => task.setCost(e.target.value);
                            // addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'costdate');
                            vTmpDiv = this_1.newNode(vTmpCell, 'div', null, null, data ? data[key] : '');
                        }
                    }
                    vNumRows++;
                }
            };
            var this_1 = this;
            for (var i_1 = 0; i_1 < this.vTaskList.length; i_1++) {
                _loop_1(i_1);
            }
            // DRAW the date format selector at bottom left.
            vTmpRow = this.newNode(vTmpTBody, 'tr');
            this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gspanning gtaskname');
            vTmpCell.appendChild(this.drawSelector('bottom'));
            if (this.vShowRes == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
            if (this.vShowDur == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');
            if (this.vShowComp == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
            if (this.vShowStartDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
            if (this.vShowEndDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');
            if (this.vShowPlanStartDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gplanstartdate', '\u00A0');
            if (this.vShowPlanEndDate == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gplanenddate', '\u00A0');
            if (this.vShowCost == 1)
                this.newNode(vTmpRow, 'td', null, 'gspanning gcost', '\u00A0');
            if (this.vAdditionalHeaders) {
                for (var key in this.vAdditionalHeaders) {
                    var header = this.vAdditionalHeaders[key];
                    var css = header.class ? header.class : "gadditional-" + key;
                    this.newNode(vTmpRow, 'td', null, "gspanning gadditional " + css, '\u00A0');
                }
            }
            // Add some white space so the vertical scroll distance should always be greater
            // than for the right pane (keep to a minimum as it is seen in unconstrained height designs)
            // this.newNode(vTmpDiv2, 'br');
            // this.newNode(vTmpDiv2, 'br');
            /**
             * CHART HEAD
             *
             *
             * HEADINGS
             */
            var vRightHeader = document.createDocumentFragment();
            vTmpDiv = this.newNode(vRightHeader, 'div', this.vDivId + 'gcharthead', 'gchartlbl gcontainercol');
            this.setChartHead(vTmpDiv);
            vTmpTab = this.newNode(vTmpDiv, 'table', this.vDivId + 'chartTableh', 'gcharttableh');
            vTmpTBody = this.newNode(vTmpTab, 'tbody');
            vTmpRow = this.newNode(vTmpTBody, 'tr');
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
                    vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, 7);
                    vCellContents += utils_1.formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
                    vTmpDate.setDate(vTmpDate.getDate() + 6);
                    if (this.vShowEndWeekDate == 1)
                        vCellContents += ' - ' + utils_1.formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
                    this.newNode(vTmpCell, 'div', null, null, vCellContents, vColWidth * 7);
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
                else if (this.vFormat == 'week') {
                    vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, vColWidth);
                    this.newNode(vTmpCell, 'div', null, null, utils_1.formatDateStr(vTmpDate, this.vWeekMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                    vTmpDate.setDate(vTmpDate.getDate() + 7);
                }
                else if (this.vFormat == 'month') {
                    vColSpan = (12 - vTmpDate.getMonth());
                    if (vTmpDate.getFullYear() == vMaxDate.getFullYear())
                        vColSpan -= (11 - vMaxDate.getMonth());
                    vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                    this.newNode(vTmpCell, 'div', null, null, utils_1.formatDateStr(vTmpDate, this.vMonthMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                    vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
                }
                else if (this.vFormat == 'quarter') {
                    vColSpan = (4 - Math.floor(vTmpDate.getMonth() / 3));
                    if (vTmpDate.getFullYear() == vMaxDate.getFullYear())
                        vColSpan -= (3 - Math.floor(vMaxDate.getMonth() / 3));
                    vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                    this.newNode(vTmpCell, 'div', null, null, utils_1.formatDateStr(vTmpDate, this.vQuarterMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                    vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
                }
                else if (this.vFormat == 'hour') {
                    vColSpan = (24 - vTmpDate.getHours());
                    if (vTmpDate.getFullYear() == vMaxDate.getFullYear() &&
                        vTmpDate.getMonth() == vMaxDate.getMonth() &&
                        vTmpDate.getDate() == vMaxDate.getDate())
                        vColSpan -= (23 - vMaxDate.getHours());
                    vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
                    this.newNode(vTmpCell, 'div', null, null, utils_1.formatDateStr(vTmpDate, this.vHourMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
                    vTmpDate.setHours(0);
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
            }
            vTmpRow = this.newNode(vTmpTBody, 'tr');
            // Minor Date header and Cell Rows
            vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate()); // , vMinDate.getHours()
            if (this.vFormat == 'hour')
                vTmpDate.setHours(vMinDate.getHours());
            vNumCols = 0;
            while (vTmpDate.getTime() <= vMaxDate.getTime()) {
                var vHeaderCellClass = 'gminorheading';
                if (this.vFormat == 'day') {
                    if (vTmpDate.getDay() % 6 == 0) {
                        vHeaderCellClass += 'wkend';
                    }
                    if (vTmpDate <= vMaxDate) {
                        vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
                        this.newNode(vTmpCell, 'div', null, null, utils_1.formatDateStr(vTmpDate, this.vDayMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                        vNumCols++;
                    }
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
                else if (this.vFormat == 'week') {
                    if (vTmpDate <= vMaxDate) {
                        vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
                        this.newNode(vTmpCell, 'div', null, null, utils_1.formatDateStr(vTmpDate, this.vWeekMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                        vNumCols++;
                    }
                    vTmpDate.setDate(vTmpDate.getDate() + 7);
                }
                else if (this.vFormat == 'month') {
                    if (vTmpDate <= vMaxDate) {
                        vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
                        this.newNode(vTmpCell, 'div', null, null, utils_1.formatDateStr(vTmpDate, this.vMonthMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                        vNumCols++;
                    }
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                    while (vTmpDate.getDate() > 1) {
                        vTmpDate.setDate(vTmpDate.getDate() + 1);
                    }
                }
                else if (this.vFormat == 'quarter') {
                    if (vTmpDate <= vMaxDate) {
                        vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
                        this.newNode(vTmpCell, 'div', null, null, utils_1.formatDateStr(vTmpDate, this.vQuarterMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
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
                            vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
                            this.newNode(vTmpCell, 'div', null, null, utils_1.formatDateStr(vTmpDate, this.vHourMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
                            vNumCols++;
                        }
                    }
                    vTmpDate.setHours(0);
                    vTmpDate.setDate(vTmpDate.getDate() + 1);
                }
            }
            vDateRow = vTmpRow;
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
            this.newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);
            vTmpDiv = this.newNode(vRightHeader, 'div', null, 'glabelfooter');
            /**
             * CHART GRID
             *
             *
             *
             */
            var vRightTable = document.createDocumentFragment();
            vTmpDiv = this.newNode(vRightTable, 'div', this.vDivId + 'gchartbody', 'gchartgrid gcontainercol');
            this.setChartBody(vTmpDiv);
            vTmpTab = this.newNode(vTmpDiv, 'table', this.vDivId + 'chartTable', 'gcharttable', null, vTaskLeftPx);
            this.setChartTable(vTmpTab);
            this.newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);
            vTmpTBody = this.newNode(vTmpTab, 'tbody');
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
                vTaskLeftPx = utils_1.getOffset(vMinDate, curTaskStart, vColWidth, this.vFormat);
                vTaskRightPx = utils_1.getOffset(curTaskStart, curTaskEnd, vColWidth, this.vFormat);
                var curTaskPlanStart = void 0, curTaskPlanEnd = void 0;
                curTaskPlanStart = this.vTaskList[i].getPlanStart();
                curTaskPlanEnd = this.vTaskList[i].getPlanEnd();
                if (curTaskPlanStart && curTaskPlanEnd) {
                    if ((curTaskPlanEnd.getTime() - (curTaskPlanEnd.getTimezoneOffset() * 60000)) % (86400000) == 0)
                        curTaskPlanEnd = new Date(curTaskPlanEnd.getFullYear(), curTaskPlanEnd.getMonth(), curTaskPlanEnd.getDate() + 1, curTaskPlanEnd.getHours(), curTaskPlanEnd.getMinutes(), curTaskPlanEnd.getSeconds()); // add 1 day here to simplify calculations below
                    vTaskPlanLeftPx = utils_1.getOffset(vMinDate, curTaskPlanStart, vColWidth, this.vFormat);
                    vTaskPlanRightPx = utils_1.getOffset(curTaskPlanStart, curTaskPlanEnd, vColWidth, this.vFormat);
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
                    vTmpRow = this.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'gmileitem gmile' + this.vFormat, null, null, null, ((this.vTaskList[i].getVisible() == 0) ? 'none' : null));
                    this.vTaskList[i].setChildRow(vTmpRow);
                    events_1.addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);
                    vTmpCell = this.newNode(vTmpRow, 'td', null, 'gtaskcell');
                    vTmpDiv = this.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                    vTmpDiv = this.newNode(vTmpDiv, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, 12, vTaskLeftPx + vTaskRightPx - 6);
                    this.vTaskList[i].setBarDiv(vTmpDiv);
                    vTmpDiv2 = this.newNode(vTmpDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass(), null, 12);
                    this.vTaskList[i].setTaskDiv(vTmpDiv2);
                    if (this.vTaskList[i].getCompVal() < 100)
                        vTmpDiv2.appendChild(document.createTextNode('\u25CA'));
                    else {
                        vTmpDiv2 = this.newNode(vTmpDiv2, 'div', null, 'gmilediamond');
                        this.newNode(vTmpDiv2, 'div', null, 'gmdtop');
                        this.newNode(vTmpDiv2, 'div', null, 'gmdbottom');
                    }
                    vCaptClass = 'gmilecaption';
                    if (!vSingleCell && !vComb) {
                        vCellFormat = '';
                        for (j = 0; j < vNumCols - 1; j++) {
                            if (this.vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5)))
                                vCellFormat = 'gtaskcellwkend';
                            else
                                vCellFormat = 'gtaskcell';
                            this.newNode(vTmpRow, 'td', null, vCellFormat, '\u00A0\u00A0');
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
                        vTmpRow = this.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, ((this.vTaskList[i].getGroup() == 2) ? 'glineitem gitem' : 'ggroupitem ggroup') + this.vFormat, null, null, null, ((this.vTaskList[i].getVisible() == 0) ? 'none' : null));
                        this.vTaskList[i].setChildRow(vTmpRow);
                        events_1.addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);
                        vTmpCell = this.newNode(vTmpRow, 'td', null, 'gtaskcell');
                        vTmpDiv = this.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                        this.vTaskList[i].setCellDiv(vTmpDiv);
                        if (this.vTaskList[i].getGroup() == 1) {
                            vTmpDiv = this.newNode(vTmpDiv, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, vTaskLeftPx);
                            this.vTaskList[i].setBarDiv(vTmpDiv);
                            vTmpDiv2 = this.newNode(vTmpDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass(), null, vTaskWidth);
                            this.vTaskList[i].setTaskDiv(vTmpDiv2);
                            this.newNode(vTmpDiv2, 'div', this.vDivId + 'complete_' + vID, this.vTaskList[i].getClass() + 'complete', null, this.vTaskList[i].getCompStr());
                            this.newNode(vTmpDiv, 'div', null, this.vTaskList[i].getClass() + 'endpointleft');
                            if (vTaskWidth >= this.vMinGpLen * 2)
                                this.newNode(vTmpDiv, 'div', null, this.vTaskList[i].getClass() + 'endpointright');
                            vCaptClass = 'ggroupcaption';
                        }
                        if (!vSingleCell && !vComb) {
                            vCellFormat = '';
                            for (j = 0; j < vNumCols - 1; j++) {
                                if (this.vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5)))
                                    vCellFormat = 'gtaskcellwkend';
                                else
                                    vCellFormat = 'gtaskcell';
                                this.newNode(vTmpRow, 'td', null, vCellFormat, '\u00A0\u00A0');
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
                            vTmpRow = this.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'glineitem gitem' + this.vFormat, null, null, null, ((this.vTaskList[i].getVisible() == 0) ? 'none' : null));
                            this.vTaskList[i].setChildRow(vTmpRow);
                            events_1.addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);
                            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gtaskcell');
                            vTmpDivCell = vTmpDiv = this.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
                        }
                        // draw the lines for dependecies
                        vTmpDiv = this.newNode(vTmpDiv, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, vTaskLeftPx);
                        this.vTaskList[i].setBarDiv(vTmpDiv);
                        vTmpDiv2 = this.newNode(vTmpDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass(), null, vTaskWidth);
                        this.vTaskList[i].setTaskDiv(vTmpDiv2);
                        // PLANNED
                        if (vTaskPlanLeftPx && vTaskPlanLeftPx != vTaskLeftPx) { // vTaskPlanRightPx vTaskPlanLeftPx
                            var vTmpPlanDiv = this.newNode(vTmpDivCell, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer gplan', null, vTaskPlanRightPx, vTaskPlanLeftPx);
                            var vTmpDiv3 = this.newNode(vTmpPlanDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass() + ' gplan', null, vTaskPlanRightPx);
                        }
                        // and opaque completion div
                        this.newNode(vTmpDiv2, 'div', this.vDivId + 'complete_' + vID, this.vTaskList[i].getClass() + 'complete', null, this.vTaskList[i].getCompStr());
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
                                this.newNode(vTmpRow, 'td', null, vCellFormat, '\u00A0\u00A0');
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
                    this.newNode(vTmpDiv, 'div', null, vCaptClass, vCaptionStr, 120, (vCaptClass == 'gmilecaption') ? 12 : 0);
                }
                // Add Task Info div for tooltip
                if (this.vTaskList[i].getTaskDiv() && vTmpDiv) {
                    vTmpDiv2 = this.newNode(vTmpDiv, 'div', this.vDivId + 'tt' + vID, null, null, null, null, 'none');
                    vTmpDiv2.appendChild(this.createTaskInfo(this.vTaskList[i]));
                    events_1.addTooltipListeners(this, this.vTaskList[i].getTaskDiv(), vTmpDiv2);
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
                vTmpTBody.appendChild(vTmpRow.cloneNode(true));
            }
            // MAIN VIEW: Appending all generated components to main view
            while (this.vDiv.hasChildNodes())
                this.vDiv.removeChild(this.vDiv.firstChild);
            vTmpDiv = this.newNode(this.vDiv, 'div', null, 'gchartcontainer');
            var leftvTmpDiv = this.newNode(vTmpDiv, 'div', null, 'gmain gmainleft');
            leftvTmpDiv.appendChild(vLeftHeader);
            // leftvTmpDiv.appendChild(vLeftTable);
            var rightvTmpDiv = this.newNode(vTmpDiv, 'div', null, 'gmain gmainright');
            rightvTmpDiv.appendChild(vRightHeader);
            rightvTmpDiv.appendChild(vRightTable);
            vTmpDiv.appendChild(leftvTmpDiv);
            vTmpDiv.appendChild(rightvTmpDiv);
            this.newNode(vTmpDiv, 'div', null, 'ggridfooter');
            vTmpDiv2 = this.newNode(this.getChartBody(), 'div', this.vDivId + 'Lines', 'glinediv');
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
                if (this.vScrollTo.substr(0, 2) == 'px') {
                    vScrollPx = parseInt(this.vScrollTo.substr(2));
                }
                else {
                    vScrollDate = utils_1.parseDateStr(this.vScrollTo, this.getDateInputFormat());
                    if (this.vFormat == 'hour')
                        vScrollDate.setMinutes(0, 0, 0);
                    else
                        vScrollDate.setHours(0, 0, 0, 0);
                    vScrollPx = utils_1.getOffset(vMinDate, vScrollDate, vColWidth, this.vFormat);
                }
                this.getChartBody().scrollLeft = vScrollPx;
            }
            if (vMinDate.getTime() <= (new Date()).getTime() && vMaxDate.getTime() >= (new Date()).getTime())
                this.vTodayPx = utils_1.getOffset(vMinDate, new Date(), vColWidth, this.vFormat);
            else
                this.vTodayPx = -1;
            // Dependencies
            var bdd = void 0;
            if (this.vDebug) {
                bdd = new Date();
                console.log('before DrawDependencies', bdd);
            }
            this.DrawDependencies(this.vDebug);
            events_1.addListenerDependencies();
            if (this.vDebug) {
                var ad = new Date();
                console.log('after DrawDependencies', ad, (ad.getTime() - bdd.getTime()));
            }
        }
        if (this.vDebug) {
            var ad = new Date();
            console.log('after draw', ad, (ad.getTime() - bd.getTime()));
        }
    }; //this.draw
    this.drawSelector = function (pPos) {
        var vOutput = document.createDocumentFragment();
        var vDisplay = false;
        for (var i = 0; i < this.vShowSelector.length && !vDisplay; i++) {
            if (this.vShowSelector[i].toLowerCase() == pPos.toLowerCase())
                vDisplay = true;
        }
        if (vDisplay) {
            var vTmpDiv = this.newNode(vOutput, 'div', null, 'gselector', this.vLangs[this.vLang]['format'] + ':');
            if (this.vFormatArr.join().toLowerCase().indexOf('hour') != -1)
                events_1.addFormatListeners(this, 'hour', this.newNode(vTmpDiv, 'span', this.vDivId + 'formathour' + pPos, 'gformlabel' + ((this.vFormat == 'hour') ? ' gselected' : ''), this.vLangs[this.vLang]['hour']));
            if (this.vFormatArr.join().toLowerCase().indexOf('day') != -1)
                events_1.addFormatListeners(this, 'day', this.newNode(vTmpDiv, 'span', this.vDivId + 'formatday' + pPos, 'gformlabel' + ((this.vFormat == 'day') ? ' gselected' : ''), this.vLangs[this.vLang]['day']));
            if (this.vFormatArr.join().toLowerCase().indexOf('week') != -1)
                events_1.addFormatListeners(this, 'week', this.newNode(vTmpDiv, 'span', this.vDivId + 'formatweek' + pPos, 'gformlabel' + ((this.vFormat == 'week') ? ' gselected' : ''), this.vLangs[this.vLang]['week']));
            if (this.vFormatArr.join().toLowerCase().indexOf('month') != -1)
                events_1.addFormatListeners(this, 'month', this.newNode(vTmpDiv, 'span', this.vDivId + 'formatmonth' + pPos, 'gformlabel' + ((this.vFormat == 'month') ? ' gselected' : ''), this.vLangs[this.vLang]['month']));
            if (this.vFormatArr.join().toLowerCase().indexOf('quarter') != -1)
                events_1.addFormatListeners(this, 'quarter', this.newNode(vTmpDiv, 'span', this.vDivId + 'formatquarter' + pPos, 'gformlabel' + ((this.vFormat == 'quarter') ? ' gselected' : ''), this.vLangs[this.vLang]['quarter']));
        }
        else {
            this.newNode(vOutput, 'div', null, 'gselector');
        }
        return vOutput;
    };
    if (this.vDiv && this.vDiv.nodeName.toLowerCase() == 'div')
        this.vDivId = this.vDiv.id;
}; //GanttChart
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
                value = value ? value.toISOString().split('T')[0] : '';
                return "<input class=\"gantt-inputtable\" type=\"date\" value=\"" + value + "\">";
            case 'resource':
                if (choices) {
                    var found = choices.find(function (c) { return c.id == value || c.name == value; });
                    if (found) {
                        value = found.id;
                    }
                    else {
                        choices.push({ id: value, name: value });
                    }
                    return "<select>" + choices.map(function (c) { return "<option value=\"" + c.id + "\" " + (value == c.id ? 'selected' : '') + " >" + c.name + "</option>"; }).join('') + "</select>";
                }
                else {
                    return "<input class=\"gantt-inputtable\" type=\"text\" value=\"" + (value ? value : '') + "\">";
                }
            case 'cost':
                return "<input class=\"gantt-inputtable\" type=\"number\" max=\"100\" min=\"0\" value=\"" + (value ? value : '') + "\">";
            default:
                return "<input class=\"gantt-inputtable\" value=\"" + (value ? value : '') + "\">";
        }
    }
    else {
        return formattedValue;
    }
};
exports.updateFlyingObj = function (e, pGanttChartObj, pTimer) {
    var vCurTopBuf = 3;
    var vCurLeftBuf = 5;
    var vCurBotBuf = 3;
    var vCurRightBuf = 15;
    var vMouseX = (e) ? e.clientX : window.event.clientX;
    var vMouseY = (e) ? e.clientY : window.event.clientY;
    var vViewportX = document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    var vViewportY = document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    var vNewX = vMouseX;
    var vNewY = vMouseY;
    if (navigator.appName.toLowerCase() == 'microsoft internet explorer') {
        // the clientX and clientY properties include the left and top borders of the client area
        vMouseX -= document.documentElement.clientLeft;
        vMouseY -= document.documentElement.clientTop;
        var vZoomFactor = utils_1.getZoomFactor();
        if (vZoomFactor != 1) { // IE 7 at non-default zoom level
            vMouseX = Math.round(vMouseX / vZoomFactor);
            vMouseY = Math.round(vMouseY / vZoomFactor);
        }
    }
    var vScrollPos = utils_1.getScrollPositions();
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
    if (pGanttChartObj.getUseMove()) {
        clearInterval(pGanttChartObj.vTool.moveInterval);
        pGanttChartObj.vTool.moveInterval = setInterval(function () { events_1.moveToolTip(vNewX, vNewY, pGanttChartObj.vTool, pTimer); }, pTimer);
    }
    else {
        pGanttChartObj.vTool.style.left = vNewX + 'px';
        pGanttChartObj.vTool.style.top = vNewY + 'px';
    }
};

},{"./events":3,"./lang":6,"./options":7,"./task":8,"./utils":9,"./xml":10}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var task_1 = require("./task");
var draw_1 = require("./draw");
exports.mouseOver = function (pObj1, pObj2) {
    if (this.getUseRowHlt()) {
        pObj1.className += ' gitemhighlight';
        pObj2.className += ' gitemhighlight';
    }
};
exports.mouseOut = function (pObj1, pObj2) {
    if (this.getUseRowHlt()) {
        pObj1.className = pObj1.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
        pObj2.className = pObj2.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
    }
};
exports.showToolTip = function (pGanttChartObj, e, pContents, pWidth, pTimer) {
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
            this.addListener('mouseover', function () { clearTimeout(pGanttChartObj.vTool.delayTimeout); }, pGanttChartObj.vTool);
            this.addListener('mouseout', function () { utils_1.delayedHide(pGanttChartObj, pGanttChartObj.vTool, pTimer); }, pGanttChartObj.vTool);
        }
        clearTimeout(pGanttChartObj.vTool.delayTimeout);
        if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing || pGanttChartObj.vTool.style.visibility != 'visible') {
            if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing) {
                pGanttChartObj.vTool.vToolCont.setAttribute('showing', vShowing);
                pGanttChartObj.vTool.vToolCont.innerHTML = pContents.innerHTML;
                // as we are allowing arbitrary HTML we should remove any tag ids to prevent duplication
                utils_1.stripIds(pGanttChartObj.vTool.vToolCont);
            }
            pGanttChartObj.vTool.style.visibility = 'visible';
            // Rather than follow the mouse just have it stay put
            draw_1.updateFlyingObj(e, pGanttChartObj, pTimer);
            pGanttChartObj.vTool.style.width = (pWidth) ? pWidth + 'px' : 'auto';
            if (!pWidth && utils_1.isIE()) {
                pGanttChartObj.vTool.style.width = pGanttChartObj.vTool.offsetWidth;
            }
            if (pGanttChartObj.vTool.offsetWidth > vMaxW) {
                pGanttChartObj.vTool.style.width = vMaxW + 'px';
            }
        }
        if (pGanttChartObj.getUseFade()) {
            clearInterval(pGanttChartObj.vTool.fadeInterval);
            pGanttChartObj.vTool.fadeInterval = setInterval(function () { utils_1.fadeToolTip(1, pGanttChartObj.vTool, vMaxAlpha); }, pTimer);
        }
        else {
            pGanttChartObj.vTool.style.opacity = vMaxAlpha * 0.01;
            pGanttChartObj.vTool.style.filter = 'alpha(opacity=' + vMaxAlpha + ')';
        }
    }
};
exports.moveToolTip = function (pNewX, pNewY, pTool, timer) {
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
exports.addListener = function (eventName, handler, control) {
    // Check if control is a string
    if (control === String(control))
        control = utils_1.findObj(control);
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
exports.addTooltipListeners = function (pGanttChart, pObj1, pObj2) {
    exports.addListener('mouseover', function (e) { exports.showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer()); }, pObj1);
    exports.addListener('mouseout', function (e) { utils_1.delayedHide(pGanttChart, pGanttChart.vTool, pGanttChart.getTimer()); }, pObj1);
};
exports.addThisRowListeners = function (pGanttChart, pObj1, pObj2) {
    exports.addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj1);
    exports.addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj2);
    exports.addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj1);
    exports.addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj2);
};
exports.addFolderListeners = function (pGanttChart, pObj, pID) {
    exports.addListener('click', function () { task_1.folder(pID, pGanttChart); }, pObj);
};
exports.addFormatListeners = function (pGanttChart, pFormat, pObj) {
    exports.addListener('click', function () { utils_1.changeFormat(pFormat, pGanttChart); }, pObj);
};
exports.addScrollListeners = function (pGanttChart) {
    exports.addListener('resize', function () { pGanttChart.getChartHead().scrollLeft = pGanttChart.getChartBody().scrollLeft; }, window);
    exports.addListener('resize', function () {
        pGanttChart.getListBody().scrollTop = pGanttChart.getChartBody().scrollTop;
    }, window);
};
exports.addListenerClickCell = function (vTmpCell, vEvents, task, column) {
    exports.addListener('click', function (e) {
        if (e.target.classList.contains('gfoldercollapse') === false &&
            vEvents[column] && typeof vEvents[column] === 'function') {
            vEvents[column](task, e, vTmpCell);
        }
    }, vTmpCell);
};
exports.addListenerInputCell = function (vTmpCell, vEventsChange, callback, task, column, draw, event) {
    if (draw === void 0) { draw = null; }
    if (event === void 0) { event = 'blur'; }
    if (vTmpCell.children[0] && vTmpCell.children[0].children && vTmpCell.children[0].children[0]) {
        exports.addListener(event, function (e) {
            if (callback) {
                callback(task, e);
            }
            if (vEventsChange[column] && typeof vEventsChange[column] === 'function') {
                var q = vEventsChange[column](task, e, vTmpCell, vColumnsNames[column]);
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
};
exports.addListenerDependencies = function () {
    var elements = document.querySelectorAll('.gtaskbarcontainer');
    for (var i = 0; i < elements.length; i++) {
        var taskDiv = elements[i];
        taskDiv.addEventListener('mouseover', function (e) {
            toggleDependencies(e);
        });
        taskDiv.addEventListener('mouseout', function (e) {
            toggleDependencies(e);
        });
    }
};
var toggleDependencies = function (e) {
    var target = e.currentTarget;
    var ids = target.getAttribute('id').split('_');
    var style = 'groove';
    if (e.type === 'mouseout') {
        style = '';
    }
    if (ids.length > 1) {
        var frameZones = Array.from(document.querySelectorAll(".gDepId" + ids[1]));
        frameZones.forEach(function (c) {
            c.style.borderStyle = style;
        });
        // document.querySelectorAll(`.gDepId${ids[1]}`).forEach((c: any) => {
        // c.style.borderStyle = style;
        // });
    }
};
// "pID": 122
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

},{"./draw":2,"./task":8,"./utils":9}],4:[function(require,module,exports){
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
var events_1 = require("./events");
var utils_1 = require("./utils");
var xml_1 = require("./xml");
var task_1 = require("./task");
var draw_1 = require("./draw");
var json_1 = require("./json");
if (!exports.JSGantt)
    exports.JSGantt = {};
exports.JSGantt.isIE = utils_1.isIE;
exports.JSGantt.TaskItem = task_1.TaskItem;
exports.JSGantt.GanttChart = draw_1.GanttChart;
exports.JSGantt.updateFlyingObj = draw_1.updateFlyingObj;
exports.JSGantt.showToolTip = events_1.showToolTip;
exports.JSGantt.stripIds = utils_1.stripIds;
exports.JSGantt.stripUnwanted = utils_1.stripUnwanted;
exports.JSGantt.delayedHide = utils_1.delayedHide;
exports.JSGantt.hideToolTip = utils_1.hideToolTip;
exports.JSGantt.fadeToolTip = utils_1.fadeToolTip;
exports.JSGantt.moveToolTip = events_1.moveToolTip;
exports.JSGantt.getZoomFactor = utils_1.getZoomFactor;
exports.JSGantt.getOffset = utils_1.getOffset;
exports.JSGantt.getScrollPositions = utils_1.getScrollPositions;
exports.JSGantt.processRows = task_1.processRows;
exports.JSGantt.sortTasks = task_1.sortTasks;
// Used to determine the minimum date of all tasks and set lower bound based on format
exports.JSGantt.getMinDate = utils_1.getMinDate;
// Used to determine the maximum date of all tasks and set upper bound based on format
exports.JSGantt.getMaxDate = utils_1.getMaxDate;
// This function finds the document id of the specified object
exports.JSGantt.findObj = utils_1.findObj;
exports.JSGantt.changeFormat = utils_1.changeFormat;
// Tasks
exports.JSGantt.folder = task_1.folder;
exports.JSGantt.hide = task_1.hide;
exports.JSGantt.show = task_1.show;
exports.JSGantt.taskLink = task_1.taskLink;
exports.JSGantt.parseDateStr = utils_1.parseDateStr;
exports.JSGantt.formatDateStr = utils_1.formatDateStr;
exports.JSGantt.parseDateFormatStr = utils_1.parseDateFormatStr;
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
exports.JSGantt.benchMark = utils_1.benchMark;
exports.JSGantt.getIsoWeek = utils_1.getIsoWeek;
exports.JSGantt.addListener = events_1.addListener;
exports.JSGantt.addTooltipListeners = events_1.addTooltipListeners;
exports.JSGantt.addThisRowListeners = events_1.addThisRowListeners;
exports.JSGantt.addFolderListeners = events_1.addFolderListeners;
exports.JSGantt.addFormatListeners = events_1.addFormatListeners;
exports.JSGantt.addScrollListeners = events_1.addScrollListeners;
exports.JSGantt.criticalPath = utils_1.criticalPath;

},{"./draw":2,"./events":3,"./json":5,"./task":8,"./utils":9,"./xml":10}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var task_1 = require("./task");
/**
 *
 * @param pFile
 * @param pGanttlet
 */
exports.parseJSON = function (pFile, pGanttVar, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    }
    else { // IE 5/6
        xhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
    }
    xhttp.open('GET', pFile, false);
    xhttp.send(null);
    var bd;
    if (vDebug) {
        bd = new Date();
        console.log('before jsonparse', bd);
    }
    var jsonObj = JSON.parse(xhttp.response);
    if (vDebug) {
        var ad = new Date();
        console.log('after jsonparse', ad, (ad.getTime() - bd.getTime()));
        bd = new Date();
    }
    exports.addJSONTask(pGanttVar, jsonObj);
    if (this.vDebug) {
        var ad = new Date();
        console.log('after addJSONTask', ad, (ad.getTime() - bd.getTime()));
    }
    return jsonObj;
};
exports.parseJSONString = function (pStr, pGanttVar) {
    exports.addJSONTask(pGanttVar, eval('(' + pStr + ')'));
};
exports.addJSONTask = function (pGanttVar, pJsonObj) {
    if ({}.toString.call(pJsonObj) === '[object Array]') {
        for (var index = 0; index < pJsonObj.length; index++) {
            var id = void 0;
            var name_1 = void 0;
            var start = void 0;
            var end = void 0;
            var planstart = void 0;
            var planend = void 0;
            var itemClass = void 0;
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
                    default:
                        additionalObject[property.toLowerCase()] = value;
                }
            }
            //if (id != undefined && !isNaN(parseInt(id)) && isFinite(id) && name && start && end && itemClass && completion != undefined && !isNaN(parseFloat(completion)) && isFinite(completion) && !isNaN(parseInt(parent)) && isFinite(parent)) {
            pGanttVar.AddTaskItem(new task_1.TaskItem(id, name_1, start, end, itemClass, link, milestone, resourceName, completion, group, parent_1, open_1, dependsOn, caption, notes, pGanttVar, cost, planstart, planend, additionalObject));
            //}
        }
    }
};

},{"./task":8}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    'resource': 'Recurso',
    'duration': 'Duración',
    'comp': '% Completado',
    'completion': 'Terminado',
    'startdate': 'Inicio',
    'planstartdate': 'Inicio Plan',
    'cost': 'Custo',
    'enddate': 'Fin',
    'planenddate': 'Plan Fin',
    'moreinfo': '+información',
    'notes': 'Notas',
    'format': 'Formato',
    'hour': 'Hora',
    'day': 'Dia',
    'week': 'Semana',
    'month': 'Mes',
    'quarter': 'Trimestre',
    'hours': 'Horas',
    'days': 'Días',
    'weeks': 'Semanas',
    'months': 'Meses',
    'quarters': 'Trimestres',
    'hr': 'Hr',
    'dy': 'D',
    'wk': 'Sem',
    'mth': 'Mes',
    'qtr': 'Trim',
    'hrs': 'Hrs',
    'dys': 'Dias',
    'wks': 'Sems',
    'mths': 'Meses',
    'qtrs': 'Trims'
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
    'resource': 'Resource',
    'duration': 'Duration',
    'comp': '% Comp.',
    'completion': 'Completion',
    'startdate': 'Start Date',
    'planstartdate': 'Plan Start Date',
    'enddate': 'End Date',
    'planenddate': 'Plan End Date',
    'cost': 'Cost',
    'moreinfo': 'More Information',
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
    'sat': 'Sat'
};
exports.en = en;
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
    'resource': 'Resource',
    'duration': 'Dauer',
    'comp': '%Fertig',
    'completion': 'Fertigstellung',
    'startdate': 'Erste Buchu',
    'planstartdate': 'Erste Buchu Plan',
    'enddate': 'Letzte Buchung',
    'planenddate': 'Plan Letzte Buchung',
    'cost': 'Cost',
    'moreinfo': 'Weitere Infos',
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
    'notes': 'Notas',
    'resource': 'Responsável',
    'duration': 'Duração',
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
    'resource': 'Ресурс',
    'duration': 'Длительность',
    'comp': '% выполнения',
    'completion': 'Выполнено',
    'startdate': 'Нач. дата',
    'planstartdate': 'Plan Нач. дата',
    'enddate': 'Кон. дата',
    'planenddate': 'Plan Кон. дата',
    'cost': 'Cost',
    'moreinfo': 'Детали',
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
    'qtrs': 'кв.'
};
exports.ru = ru;
var fr = {
    // Mois : http://bdl.oqlf.gouv.qc.ca/bdl/gabarit_bdl.asp?id=3619
    // Jours : http://bdl.oqlf.gouv.qc.ca/bdl/gabarit_bdl.asp?id=3617
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
    'resource': 'Ressource',
    'duration': 'Durée',
    'comp': '% Term.',
    'completion': 'Terminé',
    'startdate': 'Début',
    'planstartdate': 'Plan Début',
    'enddate': 'Fin',
    'planenddate': 'Plan Fin',
    'cost': 'Cost',
    'moreinfo': "Plus d'informations",
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
    'resource': '資源',
    'duration': '時程',
    'comp': '達成率',
    'completion': '達成',
    'startdate': '起始日期',
    'planstartdate': '計劃起始日期',
    'enddate': '截止日期',
    'planenddate': '計劃截止日期',
    'cost': '成本',
    'moreinfo': "更多資訊",
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
    'resource': 'Resurs',
    'duration': 'Tidsåtgång',
    'comp': '% klart',
    'completion': 'Klart',
    'startdate': 'Startdatum',
    'planstartdate': 'Planerad startdatum',
    'enddate': 'Slutdatum',
    'planenddate': 'Planerad slutdatum',
    'cost': 'Kostnad',
    'moreinfo': 'Mer Information',
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

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
exports.includeGetSet = function () {
    /**
     * SETTERS
     */
    this.setOptions = function (options) {
        var keys = Object.keys(options);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var val = options[key];
            if (key === 'vResources') {
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
    this.setShowTaskInfoRes = function (pVal) { this.vShowTaskInfoRes = pVal; };
    this.setShowTaskInfoDur = function (pVal) { this.vShowTaskInfoDur = pVal; };
    this.setShowTaskInfoComp = function (pVal) { this.vShowTaskInfoComp = pVal; };
    this.setShowTaskInfoStartDate = function (pVal) { this.vShowTaskInfoStartDate = pVal; };
    this.setShowTaskInfoEndDate = function (pVal) { this.vShowTaskInfoEndDate = pVal; };
    this.setShowTaskInfoNotes = function (pVal) { this.vShowTaskInfoNotes = pVal; };
    this.setShowTaskInfoLink = function (pVal) { this.vShowTaskInfoLink = pVal; };
    this.setShowEndWeekDate = function (pVal) { this.vShowEndWeekDate = pVal; };
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
    this.setDateTaskTableDisplayFormat = function (pVal) { this.vDateTaskTableDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setDateTaskDisplayFormat = function (pVal) { this.vDateTaskDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setHourMajorDateDisplayFormat = function (pVal) { this.vHourMajorDateDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setHourMinorDateDisplayFormat = function (pVal) { this.vHourMinorDateDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setDayMajorDateDisplayFormat = function (pVal) { this.vDayMajorDateDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setDayMinorDateDisplayFormat = function (pVal) { this.vDayMinorDateDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setWeekMajorDateDisplayFormat = function (pVal) { this.vWeekMajorDateDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setWeekMinorDateDisplayFormat = function (pVal) { this.vWeekMinorDateDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setMonthMajorDateDisplayFormat = function (pVal) { this.vMonthMajorDateDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setMonthMinorDateDisplayFormat = function (pVal) { this.vMonthMinorDateDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setQuarterMajorDateDisplayFormat = function (pVal) { this.vQuarterMajorDateDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setQuarterMinorDateDisplayFormat = function (pVal) { this.vQuarterMinorDateDisplayFormat = utils_1.parseDateFormatStr(pVal); };
    this.setCaptionType = function (pType) { this.vCaptionType = pType; };
    this.setFormat = function (pFormat) {
        this.vFormat = pFormat;
        this.Draw();
    };
    this.setWorkingDays = function (workingDays) { this.vWorkingDays = workingDays; };
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
    this.setTimer = function (pVal) { this.vTimer = pVal * 1; };
    this.setTooltipDelay = function (pVal) { this.vTooltipDelay = pVal * 1; };
    this.addLang = function (pLang, pVals) {
        if (!this.vLangs[pLang]) {
            this.vLangs[pLang] = new Object();
            for (var vKey in this.vLangs['en'])
                this.vLangs[pLang][vKey] = (pVals[vKey]) ? document.createTextNode(pVals[vKey]).data : this.vLangs['en'][vKey];
        }
    };
    this.setEvents = function (pEvents) { this.vEvents = pEvents; };
    this.setEventsChange = function (pEventsChange) { this.vEventsChange = pEventsChange; };
    this.setEventClickRow = function (fn) { this.vEventClickRow = fn; };
    this.setResources = function (resources) { this.vResources = resources; };
    this.setAdditionalHeaders = function (headers) { this.vAdditionalHeaders = headers; };
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
    this.getShowTaskInfoRes = function () { return this.vShowTaskInfoRes; };
    this.getShowTaskInfoDur = function () { return this.vShowTaskInfoDur; };
    this.getShowTaskInfoComp = function () { return this.vShowTaskInfoComp; };
    this.getShowTaskInfoStartDate = function () { return this.vShowTaskInfoStartDate; };
    this.getShowTaskInfoEndDate = function () { return this.vShowTaskInfoEndDate; };
    this.getShowTaskInfoNotes = function () { return this.vShowTaskInfoNotes; };
    this.getShowTaskInfoLink = function () { return this.vShowTaskInfoLink; };
    this.getShowEndWeekDate = function () { return this.vShowEndWeekDate; };
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
    this.getTooltipDelay = function () { return this.vTooltipDelay; };
    this.getList = function () { return this.vTaskList; };
    this.getEventsClickCell = function () { return this.vEvents; };
    this.getEventsChange = function () { return this.vEventsChange; };
    this.getEventClickRow = function () { return this.vEventClickRow; };
    this.getResources = function () { return this.vResources; };
    this.getAdditionalHeaders = function () { return this.vAdditionalHeaders; };
};

},{"./utils":9}],8:[function(require,module,exports){
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
var utils_1 = require("./utils");
// Function to open/close and hide/show children of specified task
exports.folder = function (pID, ganttObj) {
    var vList = ganttObj.getList();
    ganttObj.clearDependencies(); // clear these first so slow rendering doesn't look odd
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getID() == pID) {
            if (vList[i].getOpen() == 1) {
                vList[i].setOpen(0);
                exports.hide(pID, ganttObj);
                if (utils_1.isIE())
                    vList[i].getGroupSpan().innerText = '+';
                else
                    vList[i].getGroupSpan().textContent = '+';
            }
            else {
                vList[i].setOpen(1);
                exports.show(pID, 1, ganttObj);
                if (utils_1.isIE())
                    vList[i].getGroupSpan().innerText = '-';
                else
                    vList[i].getGroupSpan().textContent = '-';
            }
        }
    }
    var bd;
    if (this.vDebug) {
        bd = new Date();
        console.log('after drawDependency', bd);
    }
    ganttObj.DrawDependencies(this.vDebug);
    if (this.vDebug) {
        var ad = new Date();
        console.log('after drawDependency', ad, (ad.getTime() - bd.getTime()));
    }
};
exports.hide = function (pID, ganttObj) {
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
                exports.hide(vID, ganttObj);
        }
    }
};
// Function to show children of specified task
exports.show = function (pID, pTop, ganttObj) {
    var vList = ganttObj.getList();
    var vID = 0;
    var vState = '';
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            if (vList[i].getParItem().getGroupSpan()) {
                if (utils_1.isIE())
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
                exports.show(vID, 0, ganttObj);
        }
    }
};
// function to open window to display task link
exports.taskLink = function (pRef, pWidth, pHeight) {
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
exports.sortTasks = function (pList, pID, pIdx) {
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
                sortIdx = exports.sortTasks(pList, pList[i].getID(), sortIdx);
            }
        }
    }
    return sortIdx;
};
exports.TaskItemObject = function (object) {
    var pDataObject = __assign({}, object);
    utils_1.internalProperties.forEach(function (property) {
        delete pDataObject[property];
    });
    return new exports.TaskItem(object.pID, object.pName, object.pStart, object.pEnd, object.pClass, object.pLink, object.pMile, object.pRes, object.pComp, object.pGroup, object.pParent, object.pOpen, object.pDepend, object.pCaption, object.pNotes, object.pGantt, object.pCost, object.pPlanStart, object.pPlanEnd, object);
};
exports.TaskItem = function (pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt, pCost, pPlanStart, pPlanEnd, pDataObject) {
    if (pCost === void 0) { pCost = null; }
    if (pPlanStart === void 0) { pPlanStart = null; }
    if (pPlanEnd === void 0) { pPlanEnd = null; }
    if (pDataObject === void 0) { pDataObject = null; }
    var vGantt = pGantt ? pGantt : this;
    var _id = document.createTextNode(pID).data;
    var vID = utils_1.hashKey(document.createTextNode(pID).data);
    var vName = document.createTextNode(pName).data;
    var vStart = null;
    var vEnd = null;
    var vPlanStart = null;
    var vPlanEnd = null;
    var vGroupMinStart = null;
    var vGroupMinEnd = null;
    var vClass = document.createTextNode(pClass).data;
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
        parent = utils_1.hashKey(parent).toString();
    }
    var vParent = parent;
    var vOpen = (vGroup == 2) ? 1 : parseInt(document.createTextNode(pOpen).data);
    var vDepend = new Array();
    var vDependType = new Array();
    var vCaption = document.createTextNode(pCaption).data;
    var vDuration = '';
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
    var vListChildRow = null;
    var vChildRow = null;
    var vGroupSpan = null;
    vNotes = document.createElement('span');
    vNotes.className = 'gTaskNotes';
    if (pNotes != null) {
        vNotes.innerHTML = pNotes;
        utils_1.stripUnwanted(vNotes);
    }
    if (pStart != null && pStart != '') {
        vStart = (pStart instanceof Date) ? pStart : utils_1.parseDateStr(document.createTextNode(pStart).data, vGantt.getDateInputFormat());
        vGroupMinStart = vStart;
    }
    if (pEnd != null && pEnd != '') {
        vEnd = (pEnd instanceof Date) ? pEnd : utils_1.parseDateStr(document.createTextNode(pEnd).data, vGantt.getDateInputFormat());
        vGroupMinEnd = vEnd;
    }
    if (pPlanStart != null && pPlanStart != '') {
        vPlanStart = (pPlanStart instanceof Date) ? pPlanStart : utils_1.parseDateStr(document.createTextNode(pPlanStart).data, vGantt.getDateInputFormat());
        vGroupMinStart = vPlanStart;
    }
    if (pPlanEnd != null && pPlanEnd != '') {
        vPlanEnd = (pPlanEnd instanceof Date) ? pPlanEnd : utils_1.parseDateStr(document.createTextNode(pPlanEnd).data, vGantt.getDateInputFormat());
        vGroupMinEnd = vPlanEnd;
    }
    if (pDepend != null) {
        var vDependStr = pDepend + '';
        var vDepList = vDependStr.split(',');
        var n = vDepList.length;
        for (var k = 0; k < n; k++) {
            if (vDepList[k].toUpperCase().indexOf('SS') != -1) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].toUpperCase().indexOf('SS'));
                vDependType[k] = 'SS';
            }
            else if (vDepList[k].toUpperCase().indexOf('FF') != -1) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].toUpperCase().indexOf('FF'));
                vDependType[k] = 'FF';
            }
            else if (vDepList[k].toUpperCase().indexOf('SF') != -1) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].toUpperCase().indexOf('SF'));
                vDependType[k] = 'SF';
            }
            else if (vDepList[k].toUpperCase().indexOf('FS') != -1) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].toUpperCase().indexOf('FS'));
                vDependType[k] = 'FS';
            }
            else {
                vDepend[k] = vDepList[k];
                vDependType[k] = 'FS';
            }
            if (vDepend[k]) {
                vDepend[k] = utils_1.hashKey(vDepend[k]).toString();
            }
        }
    }
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
    this.getEnd = function () {
        if (vEnd)
            return vEnd;
        else if (vPlanEnd)
            return vPlanEnd;
        else
            return new Date();
    };
    this.getPlanStart = function () { return vPlanStart ? vPlanStart : vStart; };
    this.getPlanEnd = function () { return vPlanEnd ? vPlanEnd : vEnd; };
    this.getCost = function () { return vCost; };
    this.getGroupMinStart = function () { return vGroupMinStart; };
    this.getGroupMinEnd = function () { return vGroupMinEnd; };
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
    this.getNotes = function () { return vNotes; };
    this.getSortIdx = function () { return vSortIdx; };
    this.getToDelete = function () { return vToDelete; };
    this.getDuration = function (pFormat, pLang) {
        if (vMile) {
            vDuration = '-';
        }
        else {
            var vTaskEnd = new Date(this.getEnd().getTime());
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
            if ((vTaskEnd.getTime() - (vTaskEnd.getTimezoneOffset() * 60000)) % (86400000) == 0) {
                vTaskEnd = new Date(vTaskEnd.getFullYear(), vTaskEnd.getMonth(), vTaskEnd.getDate() + 1, vTaskEnd.getHours(), vTaskEnd.getMinutes(), vTaskEnd.getSeconds());
            }
            var tmpPer = (utils_1.getOffset(this.getStart(), vTaskEnd, 999, vUnits)) / 1000;
            if (Math.floor(tmpPer) != tmpPer)
                tmpPer = Math.round(tmpPer);
            switch (vUnits) {
                case 'hour':
                    vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['hrs'] : pLang['hr']);
                    break;
                case 'day':
                    vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['dys'] : pLang['dy']);
                    break;
                case 'week':
                    vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['wks'] : pLang['wk']);
                    break;
                case 'month':
                    vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['mths'] : pLang['mth']);
                    break;
                case 'quarter':
                    vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['qtrs'] : pLang['qtr']);
                    break;
            }
        }
        return vDuration;
    };
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
    this.getChildRow = function () { return vChildRow; };
    this.getListChildRow = function () { return vListChildRow; };
    this.getGroupSpan = function () { return vGroupSpan; };
    this.setName = function (pName) { vName = pName; };
    this.setCost = function (pCost) { vCost = pCost; };
    this.setResource = function (pRes) { vRes = pRes; };
    this.setDuration = function (pDuration) { vDuration = pDuration; };
    this.setDataObject = function (pDataObject) { vDataObject = pDataObject; };
    this.setStart = function (pStart) {
        if (pStart instanceof Date)
            vStart = pStart;
        else
            vStart = new Date(pStart);
    };
    this.setEnd = function (pEnd) {
        if (pEnd instanceof Date)
            vEnd = pEnd;
        else
            vEnd = new Date(pEnd);
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
    this.setCost = function (pCost) {
        vComp = parseInt(document.createTextNode(pCost).data);
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
    this.setBarDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vBarDiv = pDiv; };
    this.setTaskDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vTaskDiv = pDiv; };
    this.setChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement)
        vChildRow = pRow; };
    this.setListChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement)
        vListChildRow = pRow; };
    this.setGroupSpan = function (pSpan) { if (typeof HTMLSpanElement !== 'function' || pSpan instanceof HTMLSpanElement)
        vGroupSpan = pSpan; };
};
exports.createTaskInfo = function (pTask) {
    var vTmpDiv;
    var vTaskInfoBox = document.createDocumentFragment();
    var vTaskInfo = this.newNode(vTaskInfoBox, 'div', null, 'gTaskInfo');
    this.newNode(vTaskInfo, 'span', null, 'gTtTitle', pTask.getName());
    if (this.vShowTaskInfoStartDate == 1) {
        vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIsd');
        this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['startdate'] + ': ');
        this.newNode(vTmpDiv, 'span', null, 'gTaskText', utils_1.formatDateStr(pTask.getStart(), this.vDateTaskDisplayFormat, this.vLangs[this.vLang]));
    }
    if (this.vShowTaskInfoEndDate == 1) {
        vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIed');
        this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['enddate'] + ': ');
        this.newNode(vTmpDiv, 'span', null, 'gTaskText', utils_1.formatDateStr(pTask.getEnd(), this.vDateTaskDisplayFormat, this.vLangs[this.vLang]));
    }
    if (this.vShowTaskInfoDur == 1 && !pTask.getMile()) {
        vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTId');
        this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['duration'] + ': ');
        this.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getDuration(this.vFormat, this.vLangs[this.vLang]));
    }
    if (this.vShowTaskInfoComp == 1) {
        vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIc');
        this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['completion'] + ': ');
        this.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getCompStr());
    }
    if (this.vShowTaskInfoRes == 1) {
        vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIr');
        this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['resource'] + ': ');
        this.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getResource());
    }
    if (this.vShowTaskInfoLink == 1 && pTask.getLink() != '') {
        vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIl');
        var vTmpNode = this.newNode(vTmpDiv, 'span', null, 'gTaskLabel');
        vTmpNode = this.newNode(vTmpNode, 'a', null, 'gTaskText', this.vLangs[this.vLang]['moreinfo']);
        vTmpNode.setAttribute('href', pTask.getLink());
    }
    if (this.vShowTaskInfoNotes == 1) {
        vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIn');
        this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['notes'] + ': ');
        if (pTask.getNotes())
            vTmpDiv.appendChild(pTask.getNotes());
    }
    return vTaskInfoBox;
};
exports.AddTaskItem = function (value) {
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
};
exports.AddTaskItemObject = function (object) {
    if (!object.pGantt) {
        object.pGantt = this;
    }
    return this.AddTaskItem(exports.TaskItemObject(object));
};
exports.RemoveTaskItem = function (pID) {
    // simply mark the task for removal at this point - actually remove it next time we re-draw the chart
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getID() == pID)
            this.vTaskList[i].setToDelete(true);
        else if (this.vTaskList[i].getParent() == pID)
            this.RemoveTaskItem(this.vTaskList[i].getID());
    }
    this.vProcessNeeded = true;
};
// Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
exports.processRows = function (pList, pID, pRow, pLevel, pOpen, pUseSort, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    var vMinDate = new Date();
    var vMaxDate = new Date();
    var vVisible = pOpen;
    var vCurItem = null;
    var vCompSum = 0;
    var vMinSet = 0;
    var vMaxSet = 0;
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
                exports.processRows(vList, pList[i].getID(), i, vLevel + 1, vVisible, 0);
            }
            if (vMinSet == 0 || pList[i].getStart() < vMinDate) {
                vMinDate = pList[i].getStart();
                vMinSet = 1;
            }
            if (vMaxSet == 0 || pList[i].getEnd() > vMaxDate) {
                vMaxDate = pList[i].getEnd();
                vMaxSet = 1;
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
        pList[pRow].setStart(vMinDate);
        pList[pRow].setEnd(vMaxDate);
        pList[pRow].setNumKid(vNumKid);
        pList[pRow].setWeight(vWeight);
        pList[pRow].setCompVal(Math.ceil(vCompSum / vWeight));
    }
    if (pID == 0 && pUseSort == 1) {
        var bd = void 0;
        if (vDebug) {
            bd = new Date();
            console.log('before afterTasks', bd);
        }
        exports.sortTasks(pList, 0, 0);
        if (vDebug) {
            var ad = new Date();
            console.log('after afterTasks', ad, (ad.getTime() - bd.getTime()));
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
                    console.log('before sortTasks', bd);
                }
                exports.sortTasks(pList, pList[i].getID(), pList[i].getSortIdx() + 1);
                if (vDebug) {
                    var ad = new Date();
                    console.log('after sortTasks', ad, (ad.getTime() - bd.getTime()));
                }
            }
        }
        if (vComb == true)
            pList.sort(function (a, b) { return a.getSortIdx() - b.getSortIdx(); });
    }
};

},{"./utils":9}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalProperties = ['pID', 'pName', 'pStart', 'pEnd', 'pClass', 'pLink', 'pMile', 'pRes', 'pComp', 'pGroup', 'pParent',
    'pOpen', 'pDepend', 'pCaption', 'pNotes', 'pGantt', 'pCost', 'pPlanStart', 'pPlanEnd'];
exports.getMinDate = function (pList, pFormat) {
    var vDate = new Date();
    vDate.setTime(pList[0].getStart().getTime());
    // Parse all Task End dates to find min
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].getStart().getTime() < vDate.getTime())
            vDate.setTime(pList[i].getStart().getTime());
    }
    // Adjust min date to specific format boundaries (first of week or first of month)
    if (pFormat == 'day') {
        vDate.setDate(vDate.getDate() - 1);
        while (vDate.getDay() % 7 != 1)
            vDate.setDate(vDate.getDate() - 1);
    }
    else if (pFormat == 'week') {
        vDate.setDate(vDate.getDate() - 1);
        while (vDate.getDay() % 7 != 1)
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
exports.getMaxDate = function (pList, pFormat) {
    var vDate = new Date();
    vDate.setTime(pList[0].getEnd().getTime());
    // Parse all Task End dates to find max
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].getEnd().getTime() > vDate.getTime())
            vDate.setTime(pList[i].getEnd().getTime());
    }
    // Adjust max date to specific format boundaries (end of week or end of month)
    if (pFormat == 'day') {
        vDate.setDate(vDate.getDate() + 1);
        while (vDate.getDay() % 7 != 0)
            vDate.setDate(vDate.getDate() + 1);
    }
    else if (pFormat == 'week') {
        //For weeks, what is the last logical boundary?
        vDate.setDate(vDate.getDate() + 1);
        while (vDate.getDay() % 7 != 0)
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
exports.findObj = function (theObj, theDoc) {
    if (theDoc === void 0) { theDoc = null; }
    var p, i, foundObj;
    if (!theDoc)
        theDoc = document;
    if (document.getElementById)
        foundObj = document.getElementById(theObj);
    return foundObj;
};
exports.changeFormat = function (pFormat, ganttObj) {
    if (ganttObj)
        ganttObj.setFormat(pFormat);
    else
        alert('Chart undefined');
};
exports.parseDateStr = function (pDateStr, pFormatStr) {
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
        }
    }
    return (vDate);
};
exports.formatDateStr = function (pDate, pDateFormatArr, pL) {
    var vDateStr = '';
    var vYear2Str = pDate.getFullYear().toString().substring(2, 4);
    var vMonthStr = (pDate.getMonth() + 1) + '';
    var vMonthArr = new Array(pL['january'], pL['february'], pL['march'], pL['april'], pL['maylong'], pL['june'], pL['july'], pL['august'], pL['september'], pL['october'], pL['november'], pL['december']);
    var vDayArr = new Array(pL['sunday'], pL['monday'], pL['tuesday'], pL['wednesday'], pL['thursday'], pL['friday'], pL['saturday']);
    var vMthArr = new Array(pL['jan'], pL['feb'], pL['mar'], pL['apr'], pL['may'], pL['jun'], pL['jul'], pL['aug'], pL['sep'], pL['oct'], pL['nov'], pL['dec']);
    var vDyArr = new Array(pL['sun'], pL['mon'], pL['tue'], pL['wed'], pL['thu'], pL['fri'], pL['sat']);
    for (var i = 0; i < pDateFormatArr.length; i++) {
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
            case 'pm':
                vDateStr += ((pDate.getHours()) < 12) ? 'am' : 'pm';
                break;
            case 'PM':
                vDateStr += ((pDate.getHours()) < 12) ? 'AM' : 'PM';
                break;
            case 'ww':
                if (exports.getIsoWeek(pDate) < 10)
                    vDateStr += '0'; // now fall through
            case 'w':
                vDateStr += exports.getIsoWeek(pDate);
                break;
            case 'week':
                var vWeekNum = exports.getIsoWeek(pDate);
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
exports.parseDateFormatStr = function (pFormatStr) {
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
exports.stripIds = function (pNode) {
    for (var i = 0; i < pNode.childNodes.length; i++) {
        if ('removeAttribute' in pNode.childNodes[i])
            pNode.childNodes[i].removeAttribute('id');
        if (pNode.childNodes[i].hasChildNodes())
            exports.stripIds(pNode.childNodes[i]);
    }
};
exports.stripUnwanted = function (pNode) {
    var vAllowedTags = new Array('#text', 'p', 'br', 'ul', 'ol', 'li', 'div', 'span', 'img');
    for (var i = 0; i < pNode.childNodes.length; i++) {
        /* versions of IE<9 don't support indexOf on arrays so add trailing comma to the joined array and lookup value to stop substring matches */
        if ((vAllowedTags.join().toLowerCase() + ',').indexOf(pNode.childNodes[i].nodeName.toLowerCase() + ',') == -1) {
            pNode.replaceChild(document.createTextNode(pNode.childNodes[i].outerHTML), pNode.childNodes[i]);
        }
        if (pNode.childNodes[i].hasChildNodes())
            exports.stripUnwanted(pNode.childNodes[i]);
    }
};
exports.delayedHide = function (pGanttChartObj, pTool, pTimer) {
    var vDelay = pGanttChartObj.getTooltipDelay() || 1500;
    if (pTool)
        pTool.delayTimeout = setTimeout(function () { exports.hideToolTip(pGanttChartObj, pTool, pTimer); }, vDelay);
};
exports.getZoomFactor = function () {
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
exports.benchMark = function (pItem) {
    var vEndTime = new Date().getTime();
    alert(pItem + ': Elapsed time: ' + ((vEndTime - this.vBenchTime) / 1000) + ' seconds.');
    this.vBenchTime = new Date().getTime();
};
exports.getIsoWeek = function (pDate) {
    // We have to compare against the monday of the first week of the year containing 04 jan *not* 01/01
    // 60*60*24*1000=86400000
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
        thisWeek = exports.getIsoWeek(new Date(pDate.getFullYear() - 1, 11, 31, 0, 0, 0));
    else if (thisWeek == 53 && (new Date(pDate.getFullYear(), 0, 1, 0, 0, 0)).getDay() != 4 && (new Date(pDate.getFullYear(), 11, 31, 0, 0, 0)).getDay() != 4)
        thisWeek = 1;
    return thisWeek;
};
exports.getScrollPositions = function () {
    var vScrollLeft = window.pageXOffset;
    var vScrollTop = window.pageYOffset;
    if (!('pageXOffset' in window)) // Internet Explorer before version 9
     {
        var vZoomFactor = exports.getZoomFactor();
        vScrollLeft = Math.round(document.documentElement.scrollLeft / vZoomFactor);
        vScrollTop = Math.round(document.documentElement.scrollTop / vZoomFactor);
    }
    return { x: vScrollLeft, y: vScrollTop };
};
exports.getOffset = function (pStartDate, pEndDate, pColWidth, pFormat) {
    var DAY_CELL_MARGIN_WIDTH = 3; // Cell margin for 'day' format
    var WEEK_CELL_MARGIN_WIDTH = 3; // Cell margin for 'week' format
    var MONTH_CELL_MARGIN_WIDTH = 1; // Cell margin for 'month' format
    var QUARTER_CELL_MARGIN_WIDTH = 1; // Cell margin for 'quarter' format
    var HOUR_CELL_MARGIN_WIDTH = 3; // Cell margin for 'hour' format
    var vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var curTaskStart = new Date(pStartDate.getTime());
    var curTaskEnd = new Date(pEndDate.getTime());
    var vTaskRightPx = 0;
    var tmpTaskStart = Date.UTC(curTaskStart.getFullYear(), curTaskStart.getMonth(), curTaskStart.getDate(), curTaskStart.getHours(), 0, 0);
    var tmpTaskEnd = Date.UTC(curTaskEnd.getFullYear(), curTaskEnd.getMonth(), curTaskEnd.getDate(), curTaskEnd.getHours(), 0, 0);
    var vTaskRight = (tmpTaskEnd - tmpTaskStart) / 3600000; // Length of task in hours
    var vPosTmpDate;
    if (pFormat == 'day') {
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
exports.isIE = function () {
    if (typeof document.all != 'undefined') {
        if ('pageXOffset' in window)
            return false; // give IE9 and above the benefit of the doubt!
        else
            return true;
    }
    else
        return false;
};
exports.hideToolTip = function (pGanttChartObj, pTool, pTimer) {
    if (pGanttChartObj.getUseFade()) {
        clearInterval(pTool.fadeInterval);
        pTool.fadeInterval = setInterval(function () { exports.fadeToolTip(-1, pTool, 0); }, pTimer);
    }
    else {
        pTool.style.opacity = 0;
        pTool.style.filter = 'alpha(opacity=0)';
        pTool.style.visibility = 'hidden';
    }
};
exports.fadeToolTip = function (pDirection, pTool, pMaxAlpha) {
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
        }
    }
};
exports.hashString = function (key) {
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
exports.hashKey = function (key) {
    return this.hashString(key) % 10000;
};
exports.criticalPath = function (tasks) {
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
        // console.log(path);
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

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var task_1 = require("./task");
var utils_1 = require("./utils");
exports.parseXML = function (pFile, pGanttVar) {
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new window.XMLHttpRequest();
    }
    else { // IE 5/6
        xhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
    }
    xhttp.open('GET', pFile, false);
    xhttp.send(null);
    var xmlDoc = xhttp.responseXML;
    exports.AddXMLTask(pGanttVar, xmlDoc);
};
exports.parseXMLString = function (pStr, pGanttVar) {
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
    exports.AddXMLTask(pGanttVar, xmlDoc);
};
exports.findXMLNode = function (pRoot, pNodeName) {
    var vRetValue;
    try {
        vRetValue = pRoot.getElementsByTagName(pNodeName);
    }
    catch (error) {
        ;
    } // do nothing, we'll return undefined
    return vRetValue;
};
// pType can be 1=numeric, 2=String, all other values just return raw data
exports.getXMLNodeValue = function (pRoot, pNodeName, pType, pDefault) {
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
exports.AddXMLTask = function (pGanttVar, pXmlDoc) {
    var project = '';
    var vMSP = false;
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
    var projNode = exports.findXMLNode(pXmlDoc, 'Project');
    if (typeof projNode != 'undefined' && projNode.length > 0)
        project = projNode[0].getAttribute('xmlns');
    if (project == 'http://schemas.microsoft.com/project') {
        vMSP = true;
        pGanttVar.setDateInputFormat('yyyy-mm-dd');
        Task = exports.findXMLNode(pXmlDoc, 'Task');
        if (typeof Task == 'undefined')
            n = 0;
        else
            n = Task.length;
        var resources = exports.findXMLNode(pXmlDoc, 'Resource');
        if (typeof resources == 'undefined') {
            n = 0;
            m = 0;
        }
        else
            m = resources.length;
        for (i = 0; i < m; i++) {
            var resname = exports.getXMLNodeValue(resources[i], 'Name', 2, '');
            var uid = exports.getXMLNodeValue(resources[i], 'UID', 1, -1);
            if (resname.length > 0 && uid > 0)
                res[uid] = resname;
        }
        var assignments = exports.findXMLNode(pXmlDoc, 'Assignment');
        if (typeof assignments == 'undefined')
            j = 0;
        else
            j = assignments.length;
        for (i = 0; i < j; i++) {
            var uid = void 0;
            var resUID = exports.getXMLNodeValue(assignments[i], 'ResourceUID', 1, -1);
            uid = exports.getXMLNodeValue(assignments[i], 'TaskUID', 1, -1);
            if (uid > 0) {
                if (resUID > 0)
                    assRes[uid] = res[resUID];
                ass[uid] = assignments[i];
            }
        }
        // Store information about parent UIDs in an easily searchable form
        for (i = 0; i < n; i++) {
            var uid = void 0;
            uid = exports.getXMLNodeValue(Task[i], 'UID', 1, 0);
            var vOutlineNumber = void 0;
            if (uid != 0)
                vOutlineNumber = exports.getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
            if (uid > 0)
                pars[vOutlineNumber] = uid;
            if (uid > maxPID)
                maxPID = uid;
        }
        for (i = 0; i < n; i++) {
            // optional parameters may not have an entry
            // Task ID must NOT be zero otherwise it will be skipped
            var pID = exports.getXMLNodeValue(Task[i], 'UID', 1, 0);
            if (pID != 0) {
                var pName = exports.getXMLNodeValue(Task[i], 'Name', 2, 'No Task Name');
                var pStart = exports.getXMLNodeValue(Task[i], 'Start', 2, '');
                var pEnd = exports.getXMLNodeValue(Task[i], 'Finish', 2, '');
                var pLink = exports.getXMLNodeValue(Task[i], 'HyperlinkAddress', 2, '');
                var pMile = exports.getXMLNodeValue(Task[i], 'Milestone', 1, 0);
                var pComp = exports.getXMLNodeValue(Task[i], 'PercentWorkComplete', 1, 0);
                var pCost = exports.getXMLNodeValue(Task[i], 'Cost', 2, 0);
                var pGroup = exports.getXMLNodeValue(Task[i], 'Summary', 1, 0);
                var pParent = 0;
                var vOutlineLevel = exports.getXMLNodeValue(Task[i], 'OutlineLevel', 1, 0);
                var vOutlineNumber = void 0;
                if (vOutlineLevel > 1) {
                    vOutlineNumber = exports.getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
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
                var predecessors = exports.findXMLNode(Task[i], 'PredecessorLink');
                if (typeof predecessors == 'undefined')
                    j = 0;
                else
                    j = predecessors.length;
                var pDepend = '';
                for (k = 0; k < j; k++) {
                    var depUID = exports.getXMLNodeValue(predecessors[k], 'PredecessorUID', 1, -1);
                    var depType = exports.getXMLNodeValue(predecessors[k], 'Type', 1, 1);
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
                var splits = exports.findXMLNode(ass[pID], 'TimephasedData');
                if (typeof splits == 'undefined')
                    j = 0;
                else
                    j = splits.length;
                var vSplitStart = pStart;
                var vSplitEnd = pEnd;
                var vSubCreated = false;
                var vDepend = pDepend.replace(/,*[0-9]+[FS]F/g, '');
                for (k = 0; k < j; k++) {
                    var vDuration = exports.getXMLNodeValue(splits[k], 'Value', 2, '0');
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
                        vSplitEnd = exports.getXMLNodeValue(splits[k], (k + 1 == j) ? 'Finish' : 'Start', 2, '');
                        pGanttVar.AddTaskItem(new task_1.TaskItem(maxPID, pName, vSplitStart, vSplitEnd, 'gtaskblue', pLink, pMile, pRes, pComp, 0, pID, pOpen, vDepend, pCaption, pNotes, pGanttVar, pCost));
                        vSubCreated = true;
                        vDepend = '';
                    }
                    else if (vDuration != 0 && vSubCreated) {
                        vSplitStart = exports.getXMLNodeValue(splits[k], 'Start', 2, '');
                        vSubCreated = false;
                    }
                }
                if (vSubCreated)
                    pDepend = '';
                // Finally add the task
                pGanttVar.AddTaskItem(new task_1.TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar, pCost));
            }
        }
    }
    else {
        Task = pXmlDoc.getElementsByTagName('task');
        n = Task.length;
        for (i = 0; i < n; i++) {
            // optional parameters may not have an entry
            // Task ID must NOT be zero otherwise it will be skipped
            var pID = exports.getXMLNodeValue(Task[i], 'pID', 1, 0);
            if (pID != 0) {
                var pName = exports.getXMLNodeValue(Task[i], 'pName', 2, 'No Task Name');
                var pStart = exports.getXMLNodeValue(Task[i], 'pStart', 2, '');
                var pEnd = exports.getXMLNodeValue(Task[i], 'pEnd', 2, '');
                var pLink = exports.getXMLNodeValue(Task[i], 'pLink', 2, '');
                var pMile = exports.getXMLNodeValue(Task[i], 'pMile', 1, 0);
                var pComp = exports.getXMLNodeValue(Task[i], 'pComp', 1, 0);
                var pCost = exports.getXMLNodeValue(Task[i], 'pCost', 2, 0);
                var pGroup = exports.getXMLNodeValue(Task[i], 'pGroup', 1, 0);
                var pParent = exports.getXMLNodeValue(Task[i], 'pParent', 1, 0);
                var pRes = exports.getXMLNodeValue(Task[i], 'pRes', 2, '');
                var pOpen = exports.getXMLNodeValue(Task[i], 'pOpen', 1, 1);
                var pDepend = exports.getXMLNodeValue(Task[i], 'pDepend', 2, '');
                var pCaption = exports.getXMLNodeValue(Task[i], 'pCaption', 2, '');
                var pNotes = exports.getXMLNodeValue(Task[i], 'pNotes', 2, '');
                var pClass = exports.getXMLNodeValue(Task[i], 'pClass', 2, '');
                if (typeof pClass == 'undefined') {
                    if (pGroup > 0)
                        pClass = 'ggroupblack';
                    else if (pMile > 0)
                        pClass = 'gmilestone';
                    else
                        pClass = 'gtaskblue';
                }
                // Finally add the task
                pGanttVar.AddTaskItem(new task_1.TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar, pCost));
            }
        }
    }
};
exports.getXMLProject = function () {
    var vProject = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
    for (var i = 0; i < this.vTaskList.length; i++) {
        vProject += this.getXMLTask(i, true);
    }
    vProject += '</project>';
    return vProject;
};
exports.getXMLTask = function (pID, pIdx) {
    var i = 0;
    var vIdx = -1;
    var vTask = '';
    var vOutFrmt = utils_1.parseDateFormatStr(this.getDateInputFormat() + ' HH:MI');
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
        vTask += '<pStart>' + utils_1.formatDateStr(this.vTaskList[vIdx].getStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pStart>';
        vTask += '<pEnd>' + utils_1.formatDateStr(this.vTaskList[vIdx].getEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pEnd>';
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
        var vTmpDiv = this.newNode(vTmpFrag, 'div', null, null, this.vTaskList[vIdx].getNotes().innerHTML);
        vTask += '<pNotes>' + vTmpDiv.innerHTML + '</pNotes>';
        vTask += '</task>';
    }
    return vTask;
};

},{"./task":8,"./utils":9}]},{},[1])(1)
});