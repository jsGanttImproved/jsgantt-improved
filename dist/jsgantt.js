(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSGantt = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsgantt = require("./src/jsgantt");

Object.keys(_jsgantt).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _jsgantt[key];
    }
  });
});

},{"./src/jsgantt":6}],2:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GanttChart = void 0;

var lang = _interopRequireWildcard(require("./lang"));

var _events = require("./events");

var _general_utils = require("./utils/general_utils");

var _task = require("./task");

var _xml = require("./xml");

var _draw_columns = require("./draw_columns");

var _draw_utils = require("./utils/draw_utils");

var _draw_dependencies = require("./draw_dependencies");

var _options = require("./options");

var _date_utils = require("./utils/date_utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * function that loads the main gantt chart properties and functions
 * @param pDiv (required) this is a div object created in HTML
 * @param pFormat (required) - used to indicate whether chart should be drawn in "hour", "day", "week", "month", or "quarter" format
 */
var GanttChart = function GanttChart(pDiv, pFormat) {
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
    onLineContainerHover: null
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
  this.vColumnOrder = _draw_columns.COLUMN_ORDER;
  this.vEditable = false;
  this.vDebug = false;
  this.vShowSelector = new Array('top');
  this.vDateInputFormat = 'yyyy-mm-dd';
  this.vDateTaskTableDisplayFormat = (0, _date_utils.parseDateFormatStr)('dd/mm/yyyy');
  this.vDateTaskDisplayFormat = (0, _date_utils.parseDateFormatStr)('dd month yyyy');
  this.vHourMajorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)('day dd month yyyy');
  this.vHourMinorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)('HH');
  this.vDayMajorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)('dd/mm/yyyy');
  this.vDayMinorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)('dd');
  this.vWeekMajorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)('yyyy');
  this.vWeekMinorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)('dd/mm');
  this.vMonthMajorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)('yyyy');
  this.vMonthMinorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)('mon');
  this.vQuarterMajorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)('yyyy');
  this.vQuarterMinorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)('qq');
  this.vUseFullYear = (0, _date_utils.parseDateFormatStr)('dd/mm/yyyy');
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
  this.includeGetSet = _options.includeGetSet.bind(this);
  this.includeGetSet();
  this.mouseOver = _events.mouseOver;
  this.mouseOut = _events.mouseOut;
  this.addListener = _events.addListener.bind(this);
  this.removeListener = _events.removeListener.bind(this);
  this.createTaskInfo = _task.createTaskInfo;
  this.AddTaskItem = _task.AddTaskItem;
  this.AddTaskItemObject = _task.AddTaskItemObject;
  this.RemoveTaskItem = _task.RemoveTaskItem;
  this.ClearTasks = _task.ClearTasks;
  this.getXMLProject = _xml.getXMLProject;
  this.getXMLTask = _xml.getXMLTask;
  this.CalcTaskXY = _draw_utils.CalcTaskXY.bind(this); // sLine: Draw a straight line (colored one-pixel wide div)

  this.sLine = _draw_utils.sLine.bind(this);
  this.drawDependency = _draw_dependencies.drawDependency.bind(this);
  this.DrawDependencies = _draw_dependencies.DrawDependencies.bind(this);
  this.getArrayLocationByID = _draw_utils.getArrayLocationByID.bind(this);
  this.drawSelector = _draw_utils.drawSelector.bind(this);

  this.clearDependencies = function () {
    var parent = this.getLines();

    if (this.vEventsChange.line && typeof this.vEventsChange.line === 'function') {
      this.removeListener('click', this.vEventsChange.line, parent);
      this.addListener('click', this.vEventsChange.line, parent);
    }

    while (parent.hasChildNodes()) {
      parent.removeChild(parent.firstChild);
    }

    this.vDepId = 1;
  };

  this.drawListHead = function (vLeftHeader) {
    var _this = this;

    var vTmpDiv = (0, _draw_utils.newNode)(vLeftHeader, 'div', this.vDivId + 'glisthead', 'glistlbl gcontainercol');
    var gListLbl = vTmpDiv;
    this.setListBody(vTmpDiv);
    var vTmpTab = (0, _draw_utils.newNode)(vTmpDiv, 'table', null, 'gtasktableh');
    var vTmpTBody = (0, _draw_utils.newNode)(vTmpTab, 'tbody');
    var vTmpRow = (0, _draw_utils.newNode)(vTmpTBody, 'tr');
    (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtasklist', "\xA0");
    var vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gtaskname', null, null, null, null, this.getColumnOrder().length + 1);
    vTmpCell.appendChild(this.drawSelector('top'));
    vTmpRow = (0, _draw_utils.newNode)(vTmpTBody, 'tr');
    (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtasklist', "\xA0");
    (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtaskname', "\xA0");
    this.getColumnOrder().forEach(function (column) {
      if (_this[column] == 1 || column === 'vAdditionalHeaders') {
        (0, _draw_columns.draw_task_headings)(column, vTmpRow, _this.vLangs, _this.vLang, _this.vAdditionalHeaders);
      }
    });
    return gListLbl;
  };

  this.drawListBody = function (vLeftHeader) {
    var _this2 = this;

    var vTmpContentTabOuterWrapper = (0, _draw_utils.newNode)(vLeftHeader, 'div', null, 'gtasktableouterwrapper');
    var vTmpContentTabWrapper = (0, _draw_utils.newNode)(vTmpContentTabOuterWrapper, 'div', null, 'gtasktablewrapper');
    vTmpContentTabWrapper.style.width = "calc(100% + ".concat((0, _general_utils.getScrollbarWidth)(), "px)");
    var vTmpContentTab = (0, _draw_utils.newNode)(vTmpContentTabWrapper, 'table', null, 'gtasktable');
    var vTmpContentTBody = (0, _draw_utils.newNode)(vTmpContentTab, 'tbody');
    var vNumRows = 0;

    var _loop = function _loop(i) {
      var vBGColor = void 0;
      if (_this2.vTaskList[i].getGroup() == 1) vBGColor = 'ggroupitem';else vBGColor = 'glineitem';

      var vID = _this2.vTaskList[i].getID();

      var vTmpRow = void 0,
          vTmpCell = void 0;

      if (!(_this2.vTaskList[i].getParItem() && _this2.vTaskList[i].getParItem().getGroup() == 2) || _this2.vTaskList[i].getGroup() == 2) {
        if (_this2.vTaskList[i].getVisible() == 0) vTmpRow = (0, _draw_utils.newNode)(vTmpContentTBody, 'tr', _this2.vDivId + 'child_' + vID, 'gname ' + vBGColor, null, null, null, 'none');else vTmpRow = (0, _draw_utils.newNode)(vTmpContentTBody, 'tr', _this2.vDivId + 'child_' + vID, 'gname ' + vBGColor);

        _this2.vTaskList[i].setListChildRow(vTmpRow);

        (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtasklist', "\xA0");
        var editableClass = _this2.vEditable ? 'gtaskname gtaskeditable' : 'gtaskname';
        vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, editableClass);
        var vCellContents = '';

        for (var j = 1; j < _this2.vTaskList[i].getLevel(); j++) {
          vCellContents += "\xA0\xA0\xA0\xA0";
        }

        var task = _this2.vTaskList[i];
        var vEventClickRow = _this2.vEventClickRow;
        var vEventClickCollapse = _this2.vEventClickCollapse;
        (0, _events.addListener)('click', function (e) {
          if (e.target.classList.contains('gfoldercollapse') === false) {
            if (vEventClickRow && typeof vEventClickRow === "function") {
              vEventClickRow(task);
            }
          } else {
            if (vEventClickCollapse && typeof vEventClickCollapse === "function") {
              vEventClickCollapse(task);
            }
          }
        }, vTmpRow);

        if (_this2.vTaskList[i].getGroup() == 1) {
          var vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, vCellContents);
          var vTmpSpan = (0, _draw_utils.newNode)(vTmpDiv, 'span', _this2.vDivId + 'group_' + vID, 'gfoldercollapse', _this2.vTaskList[i].getOpen() == 1 ? '-' : '+');

          _this2.vTaskList[i].setGroupSpan(vTmpSpan);

          (0, _events.addFolderListeners)(_this2, vTmpSpan, vID);
          var divTask = document.createElement('span');
          divTask.innerHTML = "\xA0" + _this2.vTaskList[i].getName();
          vTmpDiv.appendChild(divTask); // const text = makeInput(this.vTaskList[i].getName(), this.vEditable, 'text');
          // vTmpDiv.appendChild(document.createNode(text));

          var callback = function callback(task, e) {
            return task.setName(e.target.value);
          };

          (0, _events.addListenerInputCell)(vTmpCell, _this2.vEventsChange, callback, _this2.vTaskList, i, 'taskname', _this2.Draw.bind(_this2));
          (0, _events.addListenerClickCell)(vTmpDiv, _this2.vEvents, _this2.vTaskList[i], 'taskname');
        } else {
          vCellContents += "\xA0\xA0\xA0\xA0";
          var text = (0, _draw_utils.makeInput)(_this2.vTaskList[i].getName(), _this2.vEditable, 'text');

          var _vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, vCellContents + text);

          var _callback = function _callback(task, e) {
            return task.setName(e.target.value);
          };

          (0, _events.addListenerInputCell)(vTmpCell, _this2.vEventsChange, _callback, _this2.vTaskList, i, 'taskname', _this2.Draw.bind(_this2));
          (0, _events.addListenerClickCell)(vTmpCell, _this2.vEvents, _this2.vTaskList[i], 'taskname');
        }

        _this2.getColumnOrder().forEach(function (column) {
          if (_this2[column] == 1 || column === 'vAdditionalHeaders') {
            (0, _draw_columns.draw_header)(column, i, vTmpRow, _this2.vTaskList, _this2.vEditable, _this2.vEventsChange, _this2.vEvents, _this2.vDateTaskTableDisplayFormat, _this2.vAdditionalHeaders, _this2.vFormat, _this2.vLangs, _this2.vLang, _this2.vResources, _this2.Draw.bind(_this2));
          }
        });

        vNumRows++;
      }
    };

    for (var i = 0; i < this.vTaskList.length; i++) {
      _loop(i);
    } // DRAW the date format selector at bottom left.


    var vTmpRow = (0, _draw_utils.newNode)(vTmpContentTBody, 'tr');
    (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtasklist', "\xA0");
    var vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gtaskname');
    vTmpCell.appendChild(this.drawSelector('bottom'));
    this.getColumnOrder().forEach(function (column) {
      if (_this2[column] == 1 || column === 'vAdditionalHeaders') {
        (0, _draw_columns.draw_bottom)(column, vTmpRow, _this2.vAdditionalHeaders);
      }
    }); // Add some white space so the vertical scroll distance should always be greater
    // than for the right pane (keep to a minimum as it is seen in unconstrained height designs)
    // newNode(vTmpDiv2, 'br');
    // newNode(vTmpDiv2, 'br');

    return {
      vNumRows: vNumRows,
      vTmpContentTabWrapper: vTmpContentTabWrapper
    };
  };
  /**
   *
   * DRAW CHAR HEAD
   *
   */


  this.drawChartHead = function (vMinDate, vMaxDate, vColWidth, vNumRows) {
    var vRightHeader = document.createDocumentFragment();
    var vTmpDiv = (0, _draw_utils.newNode)(vRightHeader, 'div', this.vDivId + 'gcharthead', 'gchartlbl gcontainercol');
    var gChartLbl = vTmpDiv;
    this.setChartHead(vTmpDiv);
    var vTmpTab = (0, _draw_utils.newNode)(vTmpDiv, 'table', this.vDivId + 'chartTableh', 'gcharttableh');
    var vTmpTBody = (0, _draw_utils.newNode)(vTmpTab, 'tbody');
    var vTmpRow = (0, _draw_utils.newNode)(vTmpTBody, 'tr');
    var vTmpDate = new Date();
    vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
    if (this.vFormat == 'hour') vTmpDate.setHours(vMinDate.getHours());else vTmpDate.setHours(0);
    vTmpDate.setMinutes(0);
    vTmpDate.setSeconds(0);
    vTmpDate.setMilliseconds(0);
    var vColSpan = 1; // Major Date Header

    while (vTmpDate.getTime() <= vMaxDate.getTime()) {
      var vHeaderCellClass = 'gmajorheading';
      var vCellContents = '';

      if (this.vFormat == 'day') {
        var colspan = 7;

        if (!this.vShowWeekends) {
          vHeaderCellClass += ' headweekends';
          colspan = 5;
        }

        var vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, colspan);
        vCellContents += (0, _date_utils.formatDateStr)(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
        vTmpDate.setDate(vTmpDate.getDate() + 6);
        if (this.vShowEndWeekDate == 1) vCellContents += ' - ' + (0, _date_utils.formatDateStr)(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
        (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, vCellContents, vColWidth * colspan);
        vTmpDate.setDate(vTmpDate.getDate() + 1);
      } else if (this.vFormat == 'week') {
        var _vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, vHeaderCellClass, null, vColWidth);

        (0, _draw_utils.newNode)(_vTmpCell, 'div', null, null, (0, _date_utils.formatDateStr)(vTmpDate, this.vWeekMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
        vTmpDate.setDate(vTmpDate.getDate() + 7);
      } else if (this.vFormat == 'month') {
        vColSpan = 12 - vTmpDate.getMonth();
        if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= 11 - vMaxDate.getMonth();

        var _vTmpCell2 = (0, _draw_utils.newNode)(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);

        (0, _draw_utils.newNode)(_vTmpCell2, 'div', null, null, (0, _date_utils.formatDateStr)(vTmpDate, this.vMonthMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
        vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
      } else if (this.vFormat == 'quarter') {
        vColSpan = 4 - Math.floor(vTmpDate.getMonth() / 3);
        if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= 3 - Math.floor(vMaxDate.getMonth() / 3);

        var _vTmpCell3 = (0, _draw_utils.newNode)(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);

        (0, _draw_utils.newNode)(_vTmpCell3, 'div', null, null, (0, _date_utils.formatDateStr)(vTmpDate, this.vQuarterMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
        vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
      } else if (this.vFormat == 'hour') {
        vColSpan = 24 - vTmpDate.getHours();
        if (vTmpDate.getFullYear() == vMaxDate.getFullYear() && vTmpDate.getMonth() == vMaxDate.getMonth() && vTmpDate.getDate() == vMaxDate.getDate()) vColSpan -= 23 - vMaxDate.getHours();

        var _vTmpCell4 = (0, _draw_utils.newNode)(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);

        (0, _draw_utils.newNode)(_vTmpCell4, 'div', null, null, (0, _date_utils.formatDateStr)(vTmpDate, this.vHourMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
        vTmpDate.setHours(0);
        vTmpDate.setDate(vTmpDate.getDate() + 1);
      }
    }

    vTmpRow = (0, _draw_utils.newNode)(vTmpTBody, 'tr', null, 'footerdays'); // Minor Date header and Cell Rows

    vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate()); // , vMinDate.getHours()

    if (this.vFormat == 'hour') vTmpDate.setHours(vMinDate.getHours());
    var vNumCols = 0;

    while (vTmpDate.getTime() <= vMaxDate.getTime()) {
      var vMinorHeaderCellClass = 'gminorheading';

      if (this.vFormat == 'day') {
        if (vTmpDate.getDay() % 6 == 0) {
          if (!this.vShowWeekends) {
            vTmpDate.setDate(vTmpDate.getDate() + 1);
            continue;
          }

          vMinorHeaderCellClass += 'wkend';
        }

        if (vTmpDate <= vMaxDate) {
          var _vTmpCell5 = (0, _draw_utils.newNode)(vTmpRow, 'td', null, vMinorHeaderCellClass);

          (0, _draw_utils.newNode)(_vTmpCell5, 'div', null, null, (0, _date_utils.formatDateStr)(vTmpDate, this.vDayMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
          vNumCols++;
        }

        vTmpDate.setDate(vTmpDate.getDate() + 1);
      } else if (this.vFormat == 'week') {
        if (vTmpDate <= vMaxDate) {
          var _vTmpCell6 = (0, _draw_utils.newNode)(vTmpRow, 'td', null, vMinorHeaderCellClass);

          (0, _draw_utils.newNode)(_vTmpCell6, 'div', null, null, (0, _date_utils.formatDateStr)(vTmpDate, this.vWeekMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
          vNumCols++;
        }

        vTmpDate.setDate(vTmpDate.getDate() + 7);
      } else if (this.vFormat == 'month') {
        if (vTmpDate <= vMaxDate) {
          var _vTmpCell7 = (0, _draw_utils.newNode)(vTmpRow, 'td', null, vMinorHeaderCellClass);

          (0, _draw_utils.newNode)(_vTmpCell7, 'div', null, null, (0, _date_utils.formatDateStr)(vTmpDate, this.vMonthMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
          vNumCols++;
        }

        vTmpDate.setDate(vTmpDate.getDate() + 1);

        while (vTmpDate.getDate() > 1) {
          vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
      } else if (this.vFormat == 'quarter') {
        if (vTmpDate <= vMaxDate) {
          var _vTmpCell8 = (0, _draw_utils.newNode)(vTmpRow, 'td', null, vMinorHeaderCellClass);

          (0, _draw_utils.newNode)(_vTmpCell8, 'div', null, null, (0, _date_utils.formatDateStr)(vTmpDate, this.vQuarterMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
          vNumCols++;
        }

        vTmpDate.setDate(vTmpDate.getDate() + 81);

        while (vTmpDate.getDate() > 1) {
          vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
      } else if (this.vFormat == 'hour') {
        for (var i = vTmpDate.getHours(); i < 24; i++) {
          vTmpDate.setHours(i); //works around daylight savings but may look a little odd on days where the clock goes forward

          if (vTmpDate <= vMaxDate) {
            var _vTmpCell9 = (0, _draw_utils.newNode)(vTmpRow, 'td', null, vMinorHeaderCellClass);

            (0, _draw_utils.newNode)(_vTmpCell9, 'div', null, null, (0, _date_utils.formatDateStr)(vTmpDate, this.vHourMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
            vNumCols++;
          }
        }

        vTmpDate.setHours(0);
        vTmpDate.setDate(vTmpDate.getDate() + 1);
      }
    }

    var vDateRow = vTmpRow; // Calculate size of grids  : Plus 3 because 1 border left + 2 of paddings

    var vTaskLeftPx = vNumCols * (vColWidth + 3) + 1; // Fix a small space at the end for day

    if (this.vFormat === 'day') {
      vTaskLeftPx += 2;
    }

    vTmpTab.style.width = vTaskLeftPx + 'px'; // Ensure that the headings has exactly the same width as the chart grid
    // const vTaskPlanLeftPx = (vNumCols * (vColWidth + 3)) + 1;

    var vSingleCell = false;
    if (this.vUseSingleCell !== 0 && this.vUseSingleCell < vNumCols * vNumRows) vSingleCell = true;
    (0, _draw_utils.newNode)(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);
    vTmpDiv = (0, _draw_utils.newNode)(vRightHeader, 'div', null, 'glabelfooter');
    return {
      gChartLbl: gChartLbl,
      vTaskLeftPx: vTaskLeftPx,
      vSingleCell: vSingleCell,
      vDateRow: vDateRow,
      vRightHeader: vRightHeader,
      vNumCols: vNumCols
    };
  };
  /**
   *
   * DRAW CHART BODY
   *
   */


  this.drawCharBody = function (vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl, vMinDate, vSingleCell, vNumCols, vColWidth, vDateRow) {
    var vRightTable = document.createDocumentFragment();
    var vTmpDiv = (0, _draw_utils.newNode)(vRightTable, 'div', this.vDivId + 'gchartbody', 'gchartgrid gcontainercol');
    this.setChartBody(vTmpDiv);
    var vTmpTab = (0, _draw_utils.newNode)(vTmpDiv, 'table', this.vDivId + 'chartTable', 'gcharttable', null, vTaskLeftPx);
    this.setChartTable(vTmpTab);
    (0, _draw_utils.newNode)(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);
    var vTmpTBody = (0, _draw_utils.newNode)(vTmpTab, 'tbody');
    (0, _events.syncScroll)([vTmpContentTabWrapper, vTmpDiv], 'scrollTop');
    (0, _events.syncScroll)([gChartLbl, vTmpDiv], 'scrollLeft');
    (0, _events.syncScroll)([vTmpContentTabWrapper, gListLbl], 'scrollLeft'); // Draw each row

    var i = 0;
    var j = 0;
    var bd;

    if (this.vDebug) {
      bd = new Date();
      console.info('before tasks loop', bd);
    }

    for (i = 0; i < this.vTaskList.length; i++) {
      var curTaskStart = this.vTaskList[i].getStart() ? this.vTaskList[i].getStart() : this.vTaskList[i].getPlanStart();
      var curTaskEnd = this.vTaskList[i].getEnd() ? this.vTaskList[i].getEnd() : this.vTaskList[i].getPlanEnd();

      var _vTaskLeftPx = (0, _general_utils.getOffset)(vMinDate, curTaskStart, vColWidth, this.vFormat, this.vShowWeekends);

      var vTaskRightPx = (0, _general_utils.getOffset)(curTaskStart, curTaskEnd, vColWidth, this.vFormat, this.vShowWeekends);
      var curTaskPlanStart = void 0,
          curTaskPlanEnd = void 0;
      curTaskPlanStart = this.vTaskList[i].getPlanStart();
      curTaskPlanEnd = this.vTaskList[i].getPlanEnd();
      var vTaskPlanLeftPx = 0;
      var vTaskPlanRightPx = 0;

      if (curTaskPlanStart && curTaskPlanEnd) {
        vTaskPlanLeftPx = (0, _general_utils.getOffset)(vMinDate, curTaskPlanStart, vColWidth, this.vFormat, this.vShowWeekends);
        vTaskPlanRightPx = (0, _general_utils.getOffset)(curTaskPlanStart, curTaskPlanEnd, vColWidth, this.vFormat, this.vShowWeekends);
      }

      var vID = this.vTaskList[i].getID();
      var vComb = this.vTaskList[i].getParItem() && this.vTaskList[i].getParItem().getGroup() == 2;
      var vCellFormat = '';
      var _vTmpDiv2 = null;
      var vTmpItem = this.vTaskList[i];
      var vCaptClass = null; // set cell width only for first row because of table-layout:fixed

      var taskCellWidth = i === 0 ? vColWidth : null;

      if (this.vTaskList[i].getMile() && !vComb) {
        var vTmpRow = (0, _draw_utils.newNode)(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'gmileitem gmile' + this.vFormat, null, null, null, this.vTaskList[i].getVisible() == 0 ? 'none' : null);
        this.vTaskList[i].setChildRow(vTmpRow);
        (0, _events.addThisRowListeners)(this, this.vTaskList[i].getListChildRow(), vTmpRow);
        var vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtaskcell gtaskcellmile', null, vColWidth, null, null, null);
        _vTmpDiv2 = (0, _draw_utils.newNode)(vTmpCell, 'div', null, 'gtaskcelldiv', "\xA0\xA0");
        _vTmpDiv2 = (0, _draw_utils.newNode)(_vTmpDiv2, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, 12, _vTaskLeftPx + vTaskRightPx - 6);
        this.vTaskList[i].setBarDiv(_vTmpDiv2);
        var vTmpDiv2 = (0, _draw_utils.newNode)(_vTmpDiv2, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass(), null, 12);
        this.vTaskList[i].setTaskDiv(vTmpDiv2);
        if (this.vTaskList[i].getCompVal() < 100) vTmpDiv2.appendChild(document.createTextNode("\u25CA"));else {
          vTmpDiv2 = (0, _draw_utils.newNode)(vTmpDiv2, 'div', null, 'gmilediamond');
          (0, _draw_utils.newNode)(vTmpDiv2, 'div', null, 'gmdtop');
          (0, _draw_utils.newNode)(vTmpDiv2, 'div', null, 'gmdbottom');
        }
        vCaptClass = 'gmilecaption';

        if (!vSingleCell && !vComb) {
          this.drawColsChart(vNumCols, vTmpRow, taskCellWidth);
        }
      } else {
        var vTaskWidth = vTaskRightPx; // Draw Group Bar which has outer div with inner group div 
        // and several small divs to left and right to create angled-end indicators

        if (this.vTaskList[i].getGroup()) {
          vTaskWidth = vTaskWidth > this.vMinGpLen && vTaskWidth < this.vMinGpLen * 2 ? this.vMinGpLen * 2 : vTaskWidth; // Expand to show two end points

          vTaskWidth = vTaskWidth < this.vMinGpLen ? this.vMinGpLen : vTaskWidth; // expand to show one end point

          var _vTmpRow = (0, _draw_utils.newNode)(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, (this.vTaskList[i].getGroup() == 2 ? 'glineitem gitem' : 'ggroupitem ggroup') + this.vFormat, null, null, null, this.vTaskList[i].getVisible() == 0 ? 'none' : null);

          this.vTaskList[i].setChildRow(_vTmpRow);
          (0, _events.addThisRowListeners)(this, this.vTaskList[i].getListChildRow(), _vTmpRow);

          var _vTmpCell10 = (0, _draw_utils.newNode)(_vTmpRow, 'td', null, 'gtaskcell gtaskcellbar', null, vColWidth, null, null);

          _vTmpDiv2 = (0, _draw_utils.newNode)(_vTmpCell10, 'div', null, 'gtaskcelldiv', "\xA0\xA0");
          this.vTaskList[i].setCellDiv(_vTmpDiv2);

          if (this.vTaskList[i].getGroup() == 1) {
            _vTmpDiv2 = (0, _draw_utils.newNode)(_vTmpDiv2, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, _vTaskLeftPx);
            this.vTaskList[i].setBarDiv(_vTmpDiv2);

            var _vTmpDiv3 = (0, _draw_utils.newNode)(_vTmpDiv2, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass(), null, vTaskWidth);

            this.vTaskList[i].setTaskDiv(_vTmpDiv3);
            (0, _draw_utils.newNode)(_vTmpDiv3, 'div', this.vDivId + 'complete_' + vID, this.vTaskList[i].getClass() + 'complete', null, this.vTaskList[i].getCompStr());
            (0, _draw_utils.newNode)(_vTmpDiv2, 'div', null, this.vTaskList[i].getClass() + 'endpointleft');
            if (vTaskWidth >= this.vMinGpLen * 2) (0, _draw_utils.newNode)(_vTmpDiv2, 'div', null, this.vTaskList[i].getClass() + 'endpointright');
            vCaptClass = 'ggroupcaption';
          }

          if (!vSingleCell && !vComb) {
            this.drawColsChart(vNumCols, _vTmpRow, taskCellWidth);
          }
        } else {
          vTaskWidth = vTaskWidth <= 0 ? 1 : vTaskWidth;
          /**
           * DRAW THE BOXES FOR GANTT
           */

          var vTmpDivCell = void 0,
              _vTmpRow2 = void 0;

          if (vComb) {
            vTmpDivCell = _vTmpDiv2 = this.vTaskList[i].getParItem().getCellDiv();
          } else {
            // Draw Task Bar which has colored bar div
            _vTmpRow2 = (0, _draw_utils.newNode)(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'glineitem gitem' + this.vFormat, null, null, null, this.vTaskList[i].getVisible() == 0 ? 'none' : null);
            this.vTaskList[i].setChildRow(_vTmpRow2);
            (0, _events.addThisRowListeners)(this, this.vTaskList[i].getListChildRow(), _vTmpRow2);

            var _vTmpCell11 = (0, _draw_utils.newNode)(_vTmpRow2, 'td', null, 'gtaskcell gtaskcellcolorbar', null, taskCellWidth, null, null);

            vTmpDivCell = _vTmpDiv2 = (0, _draw_utils.newNode)(_vTmpCell11, 'div', null, 'gtaskcelldiv', "\xA0\xA0");
          } // DRAW TASK BAR


          _vTmpDiv2 = (0, _draw_utils.newNode)(_vTmpDiv2, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, _vTaskLeftPx);
          this.vTaskList[i].setBarDiv(_vTmpDiv2);

          var _vTmpDiv4 = void 0;

          if (this.vTaskList[i].getStartVar()) {
            // textbar
            _vTmpDiv4 = (0, _draw_utils.newNode)(_vTmpDiv2, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass(), null, vTaskWidth);

            if (this.vTaskList[i].getBarText()) {
              (0, _draw_utils.newNode)(_vTmpDiv4, 'span', this.vDivId + 'tasktextbar_' + vID, 'textbar', this.vTaskList[i].getBarText(), this.vTaskList[i].getCompRestStr());
            }

            this.vTaskList[i].setTaskDiv(_vTmpDiv4);
          } // PLANNED
          // If exist and one of them are different, show plan bar... show if there is no real vStart as well (just plan dates)


          if (vTaskPlanLeftPx && (vTaskPlanLeftPx != _vTaskLeftPx || vTaskPlanRightPx != vTaskRightPx || !this.vTaskList[i].getStartVar())) {
            var vTmpPlanDiv = (0, _draw_utils.newNode)(vTmpDivCell, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer gplan', null, vTaskPlanRightPx, vTaskPlanLeftPx);
            var vTmpPlanDiv2 = (0, _draw_utils.newNode)(vTmpPlanDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass() + ' gplan', null, vTaskPlanRightPx);
            this.vTaskList[i].setPlanTaskDiv(vTmpPlanDiv2);
          } // and opaque completion div


          if (_vTmpDiv4) {
            (0, _draw_utils.newNode)(_vTmpDiv4, 'div', this.vDivId + 'complete_' + vID, this.vTaskList[i].getClass() + 'complete', null, this.vTaskList[i].getCompStr());
          } // caption


          if (vComb) vTmpItem = this.vTaskList[i].getParItem();
          if (!vComb || vComb && this.vTaskList[i].getParItem().getEnd() == this.vTaskList[i].getEnd()) vCaptClass = 'gcaption'; // Background cells

          if (!vSingleCell && !vComb) {
            if (_vTmpRow2) this.drawColsChart(vNumCols, _vTmpRow2, taskCellWidth);
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

        (0, _draw_utils.newNode)(_vTmpDiv2, 'div', null, vCaptClass, vCaptionStr, 120, vCaptClass == 'gmilecaption' ? 12 : 0);
      } // Add Task Info div for tooltip


      if (this.vTaskList[i].getTaskDiv() && _vTmpDiv2) {
        var _vTmpDiv5 = (0, _draw_utils.newNode)(_vTmpDiv2, 'div', this.vDivId + 'tt' + vID, null, null, null, null, 'none');

        var _this$createTaskInfo = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate),
            component = _this$createTaskInfo.component,
            callback = _this$createTaskInfo.callback;

        _vTmpDiv5.appendChild(component);

        (0, _events.addTooltipListeners)(this, this.vTaskList[i].getTaskDiv(), _vTmpDiv5, callback);
      } // Add Plan Task Info div for tooltip


      if (this.vTaskList[i].getPlanTaskDiv() && _vTmpDiv2) {
        var _vTmpDiv6 = (0, _draw_utils.newNode)(_vTmpDiv2, 'div', this.vDivId + 'tt' + vID, null, null, null, null, 'none');

        var _this$createTaskInfo2 = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate),
            _component = _this$createTaskInfo2.component,
            _callback2 = _this$createTaskInfo2.callback;

        _vTmpDiv6.appendChild(_component);

        (0, _events.addTooltipListeners)(this, this.vTaskList[i].getPlanTaskDiv(), _vTmpDiv6, _callback2);
      }
    } // Include the footer with the days/week/month...


    vTmpTBody.appendChild(vDateRow.cloneNode(true));
    return {
      vRightTable: vRightTable
    };
  };

  this.drawColsChart = function (vNumCols, vTmpRow, taskCellWidth) {
    var vCellFormat = '';

    for (var j = 0; j < vNumCols - 1; j++) {
      if (this.vShowWeekends !== false && this.vFormat == 'day' && (j % 7 == 4 || j % 7 == 5)) vCellFormat = 'gtaskcellwkend';else vCellFormat = 'gtaskcell gtaskcellcols';
      (0, _draw_utils.newNode)(vTmpRow, 'td', null, vCellFormat, "\xA0\xA0", taskCellWidth);
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
      console.info('before draw', bd);
    }

    if (this.vTaskList.length === 0) {
      this.drawComplete(vMinDate, vColWidth, bd);
      return;
    } // Process all tasks, reset parent date and completion % if task list has altered


    if (this.vProcessNeeded) (0, _task.processRows)(this.vTaskList, 0, -1, 1, 1, this.getUseSort(), this.vDebug);
    this.vProcessNeeded = false; // get overall min/max dates plus padding

    vMinDate = (0, _date_utils.getMinDate)(this.vTaskList, this.vFormat, this.getMinDate() && (0, _date_utils.coerceDate)(this.getMinDate()));
    vMaxDate = (0, _date_utils.getMaxDate)(this.vTaskList, this.vFormat, this.getMaxDate() && (0, _date_utils.coerceDate)(this.getMaxDate())); // Calculate chart width variables.

    if (this.vFormat == 'day') vColWidth = this.vDayColWidth;else if (this.vFormat == 'week') vColWidth = this.vWeekColWidth;else if (this.vFormat == 'month') vColWidth = this.vMonthColWidth;else if (this.vFormat == 'quarter') vColWidth = this.vQuarterColWidth;else if (this.vFormat == 'hour') vColWidth = this.vHourColWidth; // DRAW the Left-side of the chart (names, resources, comp%)

    var vLeftHeader = document.createDocumentFragment();
    /**
     * LIST HEAD
    */

    var gListLbl = this.drawListHead(vLeftHeader);
    /**
     * LIST BODY
    */

    var _this$drawListBody = this.drawListBody(vLeftHeader),
        vNumRows = _this$drawListBody.vNumRows,
        vTmpContentTabWrapper = _this$drawListBody.vTmpContentTabWrapper;
    /**
     * CHART HEAD
     */


    var _this$drawChartHead = this.drawChartHead(vMinDate, vMaxDate, vColWidth, vNumRows),
        gChartLbl = _this$drawChartHead.gChartLbl,
        vTaskLeftPx = _this$drawChartHead.vTaskLeftPx,
        vSingleCell = _this$drawChartHead.vSingleCell,
        vRightHeader = _this$drawChartHead.vRightHeader,
        vDateRow = _this$drawChartHead.vDateRow,
        vNumCols = _this$drawChartHead.vNumCols;
    /**
     * CHART GRID
     */


    var _this$drawCharBody = this.drawCharBody(vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl, vMinDate, vSingleCell, vNumCols, vColWidth, vDateRow),
        vRightTable = _this$drawCharBody.vRightTable;

    if (this.vDebug) {
      var ad = new Date();
      console.info('after tasks loop', ad, ad.getTime() - bd.getTime());
    } // MAIN VIEW: Appending all generated components to main view


    while (this.vDiv.hasChildNodes()) {
      this.vDiv.removeChild(this.vDiv.firstChild);
    }

    var vTmpDiv = (0, _draw_utils.newNode)(this.vDiv, 'div', null, 'gchartcontainer');
    vTmpDiv.style.height = this.vTotalHeight;
    var leftvTmpDiv = (0, _draw_utils.newNode)(vTmpDiv, 'div', null, 'gmain gmainleft');
    leftvTmpDiv.appendChild(vLeftHeader); // leftvTmpDiv.appendChild(vLeftTable);

    var rightvTmpDiv = (0, _draw_utils.newNode)(vTmpDiv, 'div', null, 'gmain gmainright');
    rightvTmpDiv.appendChild(vRightHeader);
    rightvTmpDiv.appendChild(vRightTable);
    vTmpDiv.appendChild(leftvTmpDiv);
    vTmpDiv.appendChild(rightvTmpDiv);
    (0, _draw_utils.newNode)(vTmpDiv, 'div', null, 'ggridfooter');
    var vTmpDiv2 = (0, _draw_utils.newNode)(this.getChartBody(), 'div', this.vDivId + 'Lines', 'glinediv');

    if (this.vEvents.onLineContainerHover && typeof this.vEvents.onLineContainerHover === 'function') {
      (0, _events.addListener)('mouseover', this.vEvents.onLineContainerHover, vTmpDiv2);
      (0, _events.addListener)('mouseout', this.vEvents.onLineContainerHover, vTmpDiv2);
    }

    vTmpDiv2.style.visibility = 'hidden';
    this.setLines(vTmpDiv2);
    /* Quick hack to show the generated HTML on older browsers
          let tmpGenSrc=document.createElement('textarea');
          tmpGenSrc.appendChild(document.createTextNode(vTmpDiv.innerHTML));
          vDiv.appendChild(tmpGenSrc);
    //*/
    // LISTENERS: Now all the content exists, register scroll listeners

    (0, _events.addScrollListeners)(this); // SCROLL: now check if we are actually scrolling the pane

    if (this.vScrollTo != '') {
      var vScrollDate = new Date(vMinDate.getTime());
      var vScrollPx = 0;

      if (this.vScrollTo.substr && this.vScrollTo.substr(0, 2) == 'px') {
        vScrollPx = parseInt(this.vScrollTo.substr(2));
      } else {
        if (this.vScrollTo === 'today') {
          vScrollDate = new Date();
        } else if (this.vScrollTo instanceof Date) {
          vScrollDate = this.vScrollTo;
        } else {
          vScrollDate = (0, _date_utils.parseDateStr)(this.vScrollTo, this.getDateInputFormat());
        }

        if (this.vFormat == 'hour') vScrollDate.setMinutes(0, 0, 0);else vScrollDate.setHours(0, 0, 0, 0);
        vScrollPx = (0, _general_utils.getOffset)(vMinDate, vScrollDate, vColWidth, this.vFormat, this.vShowWeekends) - 30;
      }

      this.getChartBody().scrollLeft = vScrollPx;
    }

    if (vMinDate.getTime() <= new Date().getTime() && vMaxDate.getTime() >= new Date().getTime()) this.vTodayPx = (0, _general_utils.getOffset)(vMinDate, new Date(), vColWidth, this.vFormat, this.vShowWeekends);else this.vTodayPx = -1; // DEPENDENCIES: Draw lines of Dependencies

    var bdd;

    if (this.vDebug) {
      bdd = new Date();
      console.info('before DrawDependencies', bdd);
    }

    if (this.vEvents && typeof this.vEvents.beforeLineDraw === 'function') {
      this.vEvents.beforeLineDraw();
    }

    this.DrawDependencies(this.vDebug);
    (0, _events.addListenerDependencies)(this.vLineOptions); // EVENTS

    if (this.vEvents && typeof this.vEvents.afterLineDraw === 'function') {
      this.vEvents.afterLineDraw();
    }

    if (this.vDebug) {
      var _ad = new Date();

      console.info('after DrawDependencies', _ad, _ad.getTime() - bdd.getTime());
    }

    this.drawComplete(vMinDate, vColWidth, bd);
  };
  /**
   * Actions after all the render process
   */


  this.drawComplete = function (vMinDate, vColWidth, bd) {
    if (this.vDebug) {
      var ad = new Date();
      console.info('after draw', ad, ad.getTime() - bd.getTime());
    }

    (0, _events.updateGridHeaderWidth)(this);

    this.chartRowDateToX = function (date) {
      return (0, _general_utils.getOffset)(vMinDate, date, vColWidth, this.vFormat, this.vShowWeekends);
    };

    if (this.vEvents && this.vEvents.afterDraw) {
      this.vEvents.afterDraw();
    }
  };

  if (this.vDiv && this.vDiv.nodeName && this.vDiv.nodeName.toLowerCase() == 'div') this.vDivId = this.vDiv.id;
}; //GanttChart


exports.GanttChart = GanttChart;

},{"./draw_columns":3,"./draw_dependencies":4,"./events":5,"./lang":8,"./options":9,"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13,"./xml":14}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draw_task_headings = exports.draw_list_headings = exports.draw_bottom = exports.draw_header = exports.COLUMN_ORDER = void 0;

var _date_utils = require("./utils/date_utils");

var _task = require("./task");

var _events = require("./events");

var _draw_utils = require("./utils/draw_utils");

var COLUMN_ORDER = ['vShowRes', 'vShowDur', 'vShowComp', 'vShowStartDate', 'vShowEndDate', 'vShowPlanStartDate', 'vShowPlanEndDate', 'vShowCost', 'vAdditionalHeaders', 'vShowAddEntries'];
exports.COLUMN_ORDER = COLUMN_ORDER;

var draw_header = function draw_header(column, i, vTmpRow, vTaskList, vEditable, vEventsChange, vEvents, vDateTaskTableDisplayFormat, vAdditionalHeaders, vFormat, vLangs, vLang, vResources, Draw) {
  var vTmpCell, vTmpDiv;

  if ('vShowRes' === column) {
    vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gresource');
    var text = (0, _draw_utils.makeInput)(vTaskList[i].getResource(), vEditable, 'resource', vTaskList[i].getResource(), vResources);
    vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, text);

    var callback = function callback(task, e) {
      return task.setResource(e.target.value);
    };

    (0, _events.addListenerInputCell)(vTmpCell, vEventsChange, callback, vTaskList, i, 'res', Draw, 'change');
    (0, _events.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'res');
  }

  if ('vShowDur' === column) {
    vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gduration');

    var _text = (0, _draw_utils.makeInput)(vTaskList[i].getDuration(vFormat, vLangs[vLang]), vEditable, 'text', vTaskList[i].getDuration());

    vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, _text);

    var _callback = function _callback(task, e) {
      return task.setDuration(e.target.value);
    };

    (0, _events.addListenerInputCell)(vTmpCell, vEventsChange, _callback, vTaskList, i, 'dur', Draw);
    (0, _events.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'dur');
  }

  if ('vShowComp' === column) {
    vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gpccomplete');

    var _text2 = (0, _draw_utils.makeInput)(vTaskList[i].getCompStr(), vEditable, 'percentage', vTaskList[i].getCompVal());

    vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, _text2);

    var _callback2 = function _callback2(task, e) {
      task.setComp(e.target.value);
      task.setCompVal(e.target.value);
    };

    (0, _events.addListenerInputCell)(vTmpCell, vEventsChange, _callback2, vTaskList, i, 'comp', Draw);
    (0, _events.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'comp');
  }

  if ('vShowStartDate' === column) {
    vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gstartdate');
    var v = (0, _date_utils.formatDateStr)(vTaskList[i].getStartVar(), vDateTaskTableDisplayFormat, vLangs[vLang]);

    var _text3 = (0, _draw_utils.makeInput)(v, vEditable, 'date', vTaskList[i].getStartVar());

    vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, _text3);

    var _callback3 = function _callback3(task, e) {
      return task.setStart(e.target.value);
    };

    (0, _events.addListenerInputCell)(vTmpCell, vEventsChange, _callback3, vTaskList, i, 'start', Draw);
    (0, _events.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'start');
  }

  if ('vShowEndDate' === column) {
    vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'genddate');

    var _v = (0, _date_utils.formatDateStr)(vTaskList[i].getEndVar(), vDateTaskTableDisplayFormat, vLangs[vLang]);

    var _text4 = (0, _draw_utils.makeInput)(_v, vEditable, 'date', vTaskList[i].getEndVar());

    vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, _text4);

    var _callback4 = function _callback4(task, e) {
      return task.setEnd(e.target.value);
    };

    (0, _events.addListenerInputCell)(vTmpCell, vEventsChange, _callback4, vTaskList, i, 'end', Draw);
    (0, _events.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'end');
  }

  if ('vShowPlanStartDate' === column) {
    vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gplanstartdate');

    var _v2 = vTaskList[i].getPlanStart() ? (0, _date_utils.formatDateStr)(vTaskList[i].getPlanStart(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';

    var _text5 = (0, _draw_utils.makeInput)(_v2, vEditable, 'date', vTaskList[i].getPlanStart());

    vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, _text5);

    var _callback5 = function _callback5(task, e) {
      return task.setPlanStart(e.target.value);
    };

    (0, _events.addListenerInputCell)(vTmpCell, vEventsChange, _callback5, vTaskList, i, 'planstart', Draw);
    (0, _events.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'planstart');
  }

  if ('vShowPlanEndDate' === column) {
    vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gplanenddate');

    var _v3 = vTaskList[i].getPlanEnd() ? (0, _date_utils.formatDateStr)(vTaskList[i].getPlanEnd(), vDateTaskTableDisplayFormat, vLangs[vLang]) : '';

    var _text6 = (0, _draw_utils.makeInput)(_v3, vEditable, 'date', vTaskList[i].getPlanEnd());

    vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, _text6);

    var _callback6 = function _callback6(task, e) {
      return task.setPlanEnd(e.target.value);
    };

    (0, _events.addListenerInputCell)(vTmpCell, vEventsChange, _callback6, vTaskList, i, 'planend', Draw);
    (0, _events.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'planend');
  }

  if ('vShowCost' === column) {
    vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gcost');

    var _text7 = (0, _draw_utils.makeInput)(vTaskList[i].getCost(), vEditable, 'cost');

    vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, _text7);

    var _callback7 = function _callback7(task, e) {
      return task.setCost(e.target.value);
    };

    (0, _events.addListenerInputCell)(vTmpCell, vEventsChange, _callback7, vTaskList, i, 'cost', Draw);
    (0, _events.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'cost');
  }

  if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
    for (var key in vAdditionalHeaders) {
      var header = vAdditionalHeaders[key];
      var css = header.class ? header.class : "gadditional-".concat(key);
      var data = vTaskList[i].getDataObject();
      vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, "gadditional ".concat(css)); // const callback = (task, e) => task.setCost(e.target.value);
      // addListenerInputCell(vTmpCell, vEventsChange, callback, vTaskList, i, 'costdate');

      vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, data ? data[key] : '');
    }
  }

  if ('vShowAddEntries' === column) {
    vTmpCell = (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gaddentries');
    var button = "<button>+</button>";
    vTmpDiv = (0, _draw_utils.newNode)(vTmpCell, 'div', null, null, button);

    var _callback8 = function _callback8(task, e) {
      (0, _task.AddTaskItemObject)({
        vParent: task.getParent()
      });
    };

    (0, _events.addListenerInputCell)(vTmpCell, vEventsChange, _callback8, vTaskList, i, 'addentries', Draw.bind(this));
    (0, _events.addListenerClickCell)(vTmpCell, vEvents, vTaskList[i], 'addentries');
  }
};

exports.draw_header = draw_header;

var draw_bottom = function draw_bottom(column, vTmpRow, vAdditionalHeaders) {
  if ('vShowRes' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gresource', "\xA0");
  if ('vShowDur' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gduration', "\xA0");
  if ('vShowComp' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gpccomplete', "\xA0");
  if ('vShowStartDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gstartdate', "\xA0");
  if ('vShowEndDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning genddate', "\xA0");
  if ('vShowPlanStartDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gplanstartdate', "\xA0");
  if ('vShowPlanEndDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gplanenddate', "\xA0");
  if ('vShowCost' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gcost', "\xA0");

  if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
    for (var key in vAdditionalHeaders) {
      var header = vAdditionalHeaders[key];
      var css = header.class ? header.class : "gadditional-".concat(key);
      (0, _draw_utils.newNode)(vTmpRow, 'td', null, "gspanning gadditional ".concat(css), "\xA0");
    }
  }

  if ('vShowAddEntries' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gaddentries', "\xA0");
};

exports.draw_bottom = draw_bottom;

var draw_list_headings = function draw_list_headings(column, vTmpRow, vAdditionalHeaders) {
  if ('vShowRes' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gresource', "\xA0");
  if ('vShowDur' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gduration', "\xA0");
  if ('vShowComp' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gpccomplete', "\xA0");
  if ('vShowStartDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gstartdate', "\xA0");
  if ('vShowEndDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning genddate', "\xA0");
  if ('vShowPlanStartDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gstartdate', "\xA0");
  if ('vShowPlanEndDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gplanenddate', "\xA0");
  if ('vShowCost' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gcost', "\xA0");

  if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
    for (var key in vAdditionalHeaders) {
      var header = vAdditionalHeaders[key];
      var css = header.class ? header.class : "gadditional-".concat(key);
      (0, _draw_utils.newNode)(vTmpRow, 'td', null, "gspanning gadditional ".concat(css), "\xA0");
    }
  }

  if ('vShowAddEntries' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gspanning gaddentries', "\xA0");
};

exports.draw_list_headings = draw_list_headings;

var draw_task_headings = function draw_task_headings(column, vTmpRow, vLangs, vLang, vAdditionalHeaders) {
  if ('vShowRes' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtaskheading gresource', vLangs[vLang]['resource']);
  if ('vShowDur' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtaskheading gduration', vLangs[vLang]['duration']);
  if ('vShowComp' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtaskheading gpccomplete', vLangs[vLang]['comp']);
  if ('vShowStartDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtaskheading gstartdate', vLangs[vLang]['startdate']);
  if ('vShowEndDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtaskheading genddate', vLangs[vLang]['enddate']);
  if ('vShowPlanStartDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtaskheading gplanstartdate', vLangs[vLang]['planstartdate']);
  if ('vShowPlanEndDate' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtaskheading gplanenddate', vLangs[vLang]['planenddate']);
  if ('vShowCost' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtaskheading gcost', vLangs[vLang]['cost']);

  if ('vAdditionalHeaders' === column && vAdditionalHeaders) {
    for (var key in vAdditionalHeaders) {
      var header = vAdditionalHeaders[key];
      var text = header.translate ? vLangs[vLang][header.translate] : header.title;
      var css = header.class ? header.class : "gadditional-".concat(key);
      (0, _draw_utils.newNode)(vTmpRow, 'td', null, "gtaskheading gadditional ".concat(css), text);
    }
  }

  if ('vShowAddEntries' === column) (0, _draw_utils.newNode)(vTmpRow, 'td', null, 'gtaskheading gaddentries', vLangs[vLang]['addentries']);
};

exports.draw_task_headings = draw_task_headings;

},{"./events":5,"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawDependencies = exports.drawDependency = void 0;

var drawDependency = function drawDependency(x1, y1, x2, y2, pType, pClass) {
  var vDir = 1;
  var vBend = false;
  var vShort = 4;
  var vRow = Math.floor(this.getRowHeight() / 2);
  if (y2 < y1) vRow *= -1;

  switch (pType) {
    case 'SF':
      vShort *= -1;
      if (x1 - 10 <= x2 && y1 != y2) vBend = true;
      vDir = -1;
      break;

    case 'SS':
      if (x1 < x2) vShort *= -1;else vShort = x2 - x1 - 2 * vShort;
      break;

    case 'FF':
      if (x1 <= x2) vShort = x2 - x1 + 2 * vShort;
      vDir = -1;
      break;

    default:
      if (x1 + 10 >= x2 && y1 != y2) vBend = true;
      break;
  }

  if (vBend) {
    this.sLine(x1, y1, x1 + vShort, y1, pClass);
    this.sLine(x1 + vShort, y1, x1 + vShort, y2 - vRow, pClass);
    this.sLine(x1 + vShort, y2 - vRow, x2 - vShort * 2, y2 - vRow, pClass);
    this.sLine(x2 - vShort * 2, y2 - vRow, x2 - vShort * 2, y2, pClass);
    this.sLine(x2 - vShort * 2, y2, x2 - 1 * vDir, y2, pClass);
  } else if (y1 != y2) {
    this.sLine(x1, y1, x1 + vShort, y1, pClass);
    this.sLine(x1 + vShort, y1, x1 + vShort, y2, pClass);
    this.sLine(x1 + vShort, y2, x2 - 1 * vDir, y2, pClass);
  } else this.sLine(x1, y1, x2 - 1 * vDir, y2, pClass);

  var vTmpDiv = this.sLine(x2, y2, x2 - 3 - (vDir < 0 ? 1 : 0), y2 - 3 - (vDir < 0 ? 1 : 0), pClass + "Arw");
  vTmpDiv.style.width = '0px';
  vTmpDiv.style.height = '0px';
};

exports.drawDependency = drawDependency;

var DrawDependencies = function DrawDependencies() {
  var vDebug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

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

              var cssClass = 'gDepId' + vList[vTask].getID() + ' ' + 'gDepNextId' + vList[i].getID();
              var dependedData = vList[vTask].getDataObject();
              var nextDependedData = vList[i].getDataObject();

              if (dependedData && dependedData.pID && nextDependedData && nextDependedData.pID) {
                cssClass += ' gDepDataId' + dependedData.pID + ' ' + 'gDepNextDataId' + nextDependedData.pID;
              }

              if (vDependType[k] == 'SS') this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'SS', cssClass + ' gDepSS');else if (vDependType[k] == 'FF') this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getEndX(), vList[i].getEndY(), 'FF', cssClass + ' gDepFF');else if (vDependType[k] == 'SF') this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getEndX(), vList[i].getEndY(), 'SF', cssClass + ' gDepSF');else if (vDependType[k] == 'FS') this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'FS', cssClass + ' gDepFS');
            }
          }
        }
      }
    }
  } // draw the current date line


  if (this.vTodayPx >= 0) this.sLine(this.vTodayPx, 0, this.vTodayPx, this.getChartTable().offsetHeight - 1, 'gCurDate');
};

exports.DrawDependencies = DrawDependencies;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addListenerDependencies = exports.addListenerInputCell = exports.addListenerClickCell = exports.addScrollListeners = exports.addFormatListeners = exports.addFolderListeners = exports.updateGridHeaderWidth = exports.addThisRowListeners = exports.addTooltipListeners = exports.syncScroll = exports.removeListener = exports.addListener = exports.showToolTip = exports.mouseOut = exports.mouseOver = exports.show = exports.hide = exports.folder = void 0;

var _general_utils = require("./utils/general_utils");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// Function to open/close and hide/show children of specified task
var folder = function folder(pID, ganttObj) {
  var vList = ganttObj.getList();
  ganttObj.clearDependencies(); // clear these first so slow rendering doesn't look odd

  for (var i = 0; i < vList.length; i++) {
    if (vList[i].getID() == pID) {
      if (vList[i].getOpen() == 1) {
        vList[i].setOpen(0);
        hide(pID, ganttObj);
        if ((0, _general_utils.isIE)()) vList[i].getGroupSpan().innerText = '+';else vList[i].getGroupSpan().textContent = '+';
      } else {
        vList[i].setOpen(1);
        show(pID, 1, ganttObj);
        if ((0, _general_utils.isIE)()) vList[i].getGroupSpan().innerText = '-';else vList[i].getGroupSpan().textContent = '-';
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
    console.info('after drawDependency', ad, ad.getTime() - bd.getTime());
  }
};

exports.folder = folder;

var hide = function hide(pID, ganttObj) {
  var vList = ganttObj.getList();
  var vID = 0;

  for (var i = 0; i < vList.length; i++) {
    if (vList[i].getParent() == pID) {
      vID = vList[i].getID(); // it's unlikely but if the task list has been updated since
      // the chart was drawn some of the rows may not exist

      if (vList[i].getListChildRow()) vList[i].getListChildRow().style.display = 'none';
      if (vList[i].getChildRow()) vList[i].getChildRow().style.display = 'none';
      vList[i].setVisible(0);
      if (vList[i].getGroup()) hide(vID, ganttObj);
    }
  }
}; // Function to show children of specified task


exports.hide = hide;

var show = function show(pID, pTop, ganttObj) {
  var vList = ganttObj.getList();
  var vID = 0;
  var vState = '';

  for (var i = 0; i < vList.length; i++) {
    if (vList[i].getParent() == pID) {
      if (!vList[i].getParItem()) {
        console.error("Cant find parent on who event (maybe problems with Task ID and Parent Id mixes?)");
      }

      if (vList[i].getParItem().getGroupSpan()) {
        if ((0, _general_utils.isIE)()) vState = vList[i].getParItem().getGroupSpan().innerText;else vState = vList[i].getParItem().getGroupSpan().textContent;
      }

      i = vList.length;
    }
  }

  for (var _i = 0; _i < vList.length; _i++) {
    if (vList[_i].getParent() == pID) {
      var vChgState = false;
      vID = vList[_i].getID();
      if (pTop == 1 && vState == '+') vChgState = true;else if (vState == '-') vChgState = true;else if (vList[_i].getParItem() && vList[_i].getParItem().getGroup() == 2) vList[_i].setVisible(1);

      if (vChgState) {
        if (vList[_i].getListChildRow()) vList[_i].getListChildRow().style.display = '';
        if (vList[_i].getChildRow()) vList[_i].getChildRow().style.display = '';

        vList[_i].setVisible(1);
      }

      if (vList[_i].getGroup()) show(vID, 0, ganttObj);
    }
  }
};

exports.show = show;

var mouseOver = function mouseOver(pObj1, pObj2) {
  if (this.getUseRowHlt()) {
    pObj1.className += ' gitemhighlight';
    pObj2.className += ' gitemhighlight';
  }
};

exports.mouseOver = mouseOver;

var mouseOut = function mouseOut(pObj1, pObj2) {
  if (this.getUseRowHlt()) {
    pObj1.className = pObj1.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
    pObj2.className = pObj2.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
  }
};

exports.mouseOut = mouseOut;

var showToolTip = function showToolTip(pGanttChartObj, e, pContents, pWidth, pTimer) {
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
      pGanttChartObj.vTool.style.left = Math.floor((e ? e.clientX : window.event.clientX) / 2) + 'px';
      pGanttChartObj.vTool.style.top = Math.floor((e ? e.clientY : window.event.clientY) / 2) + 'px';
      this.addListener('mouseover', function () {
        clearTimeout(pGanttChartObj.vTool.delayTimeout);
      }, pGanttChartObj.vTool);
      this.addListener('mouseout', function () {
        (0, _general_utils.delayedHide)(pGanttChartObj, pGanttChartObj.vTool, pTimer);
      }, pGanttChartObj.vTool);
    }

    clearTimeout(pGanttChartObj.vTool.delayTimeout);
    var newHTML = pContents.innerHTML;

    if (pGanttChartObj.vTool.vToolCont.getAttribute("content") !== newHTML) {
      pGanttChartObj.vTool.vToolCont.innerHTML = pContents.innerHTML; // as we are allowing arbitrary HTML we should remove any tag ids to prevent duplication

      (0, _general_utils.stripIds)(pGanttChartObj.vTool.vToolCont);
      pGanttChartObj.vTool.vToolCont.setAttribute("content", newHTML);
    }

    if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing || pGanttChartObj.vTool.style.visibility != 'visible') {
      if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing) {
        pGanttChartObj.vTool.vToolCont.setAttribute('showing', vShowing);
      }

      pGanttChartObj.vTool.style.visibility = 'visible'; // Rather than follow the mouse just have it stay put

      (0, _general_utils.updateFlyingObj)(e, pGanttChartObj, pTimer);
      pGanttChartObj.vTool.style.width = pWidth ? pWidth + 'px' : 'auto';

      if (!pWidth && (0, _general_utils.isIE)()) {
        pGanttChartObj.vTool.style.width = pGanttChartObj.vTool.offsetWidth;
      }

      if (pGanttChartObj.vTool.offsetWidth > vMaxW) {
        pGanttChartObj.vTool.style.width = vMaxW + 'px';
      }
    }

    if (pGanttChartObj.getUseFade()) {
      clearInterval(pGanttChartObj.vTool.fadeInterval);
      pGanttChartObj.vTool.fadeInterval = setInterval(function () {
        (0, _general_utils.fadeToolTip)(1, pGanttChartObj.vTool, vMaxAlpha);
      }, pTimer);
    } else {
      pGanttChartObj.vTool.style.opacity = vMaxAlpha * 0.01;
      pGanttChartObj.vTool.style.filter = 'alpha(opacity=' + vMaxAlpha + ')';
    }
  }
};

exports.showToolTip = showToolTip;

var addListener = function addListener(eventName, handler, control) {
  // Check if control is a string
  if (control === String(control)) control = (0, _general_utils.findObj)(control);

  if (control.addEventListener) //Standard W3C
    {
      return control.addEventListener(eventName, handler, false);
    } else if (control.attachEvent) //IExplore
    {
      return control.attachEvent('on' + eventName, handler);
    } else {
    return false;
  }
};

exports.addListener = addListener;

var removeListener = function removeListener(eventName, handler, control) {
  // Check if control is a string
  if (control === String(control)) control = (0, _general_utils.findObj)(control);

  if (control.removeEventListener) {
    //Standard W3C
    return control.removeEventListener(eventName, handler, false);
  } else if (control.detachEvent) {
    //IExplore
    return control.attachEvent('on' + eventName, handler);
  } else {
    return false;
  }
};

exports.removeListener = removeListener;

var syncScroll = function syncScroll(elements, attrName) {
  var syncFlags = new Map(elements.map(function (e) {
    return [e, false];
  }));

  function scrollEvent(e) {
    if (!syncFlags.get(e.target)) {
      var _iterator = _createForOfIteratorHelper(elements),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var el = _step.value;

          if (el !== e.target) {
            syncFlags.set(el, true);
            el[attrName] = e.target[attrName];
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    syncFlags.set(e.target, false);
  }

  var _iterator2 = _createForOfIteratorHelper(elements),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var el = _step2.value;
      el.addEventListener('scroll', scrollEvent);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
};

exports.syncScroll = syncScroll;

var addTooltipListeners = function addTooltipListeners(pGanttChart, pObj1, pObj2, callback) {
  var isShowingTooltip = false;
  addListener('mouseover', function (e) {
    if (isShowingTooltip || !callback) {
      showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
    } else if (callback) {
      isShowingTooltip = true;
      var promise = callback();
      showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());

      if (promise && promise.then) {
        promise.then(function () {
          if (pGanttChart.vTool.vToolCont.getAttribute('showing') === pObj2.id && pGanttChart.vTool.style.visibility === 'visible') {
            showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
          }
        });
      }
    }
  }, pObj1);
  addListener('mouseout', function (e) {
    var outTo = e.relatedTarget;

    if ((0, _general_utils.isParentElementOrSelf)(outTo, pObj1) || pGanttChart.vTool && (0, _general_utils.isParentElementOrSelf)(outTo, pGanttChart.vTool)) {// not actually out
    } else {
      isShowingTooltip = false;
    }

    (0, _general_utils.delayedHide)(pGanttChart, pGanttChart.vTool, pGanttChart.getTimer());
  }, pObj1);
};

exports.addTooltipListeners = addTooltipListeners;

var addThisRowListeners = function addThisRowListeners(pGanttChart, pObj1, pObj2) {
  addListener('mouseover', function () {
    pGanttChart.mouseOver(pObj1, pObj2);
  }, pObj1);
  addListener('mouseover', function () {
    pGanttChart.mouseOver(pObj1, pObj2);
  }, pObj2);
  addListener('mouseout', function () {
    pGanttChart.mouseOut(pObj1, pObj2);
  }, pObj1);
  addListener('mouseout', function () {
    pGanttChart.mouseOut(pObj1, pObj2);
  }, pObj2);
};

exports.addThisRowListeners = addThisRowListeners;

var updateGridHeaderWidth = function updateGridHeaderWidth(pGanttChart) {
  var head = pGanttChart.getChartHead();
  var body = pGanttChart.getChartBody();
  if (!head || !body) return;
  var isScrollVisible = body.scrollHeight > body.clientHeight;

  if (isScrollVisible) {
    head.style.width = "calc(100% - ".concat((0, _general_utils.getScrollbarWidth)(), "px)");
  } else {
    head.style.width = '100%';
  }
};

exports.updateGridHeaderWidth = updateGridHeaderWidth;

var addFolderListeners = function addFolderListeners(pGanttChart, pObj, pID) {
  addListener('click', function () {
    folder(pID, pGanttChart);
    updateGridHeaderWidth(pGanttChart);
  }, pObj);
};

exports.addFolderListeners = addFolderListeners;

var addFormatListeners = function addFormatListeners(pGanttChart, pFormat, pObj) {
  addListener('click', function () {
    (0, _general_utils.changeFormat)(pFormat, pGanttChart);
  }, pObj);
};

exports.addFormatListeners = addFormatListeners;

var addScrollListeners = function addScrollListeners(pGanttChart) {
  addListener('resize', function () {
    pGanttChart.getChartHead().scrollLeft = pGanttChart.getChartBody().scrollLeft;
  }, window);
  addListener('resize', function () {
    pGanttChart.getListBody().scrollTop = pGanttChart.getChartBody().scrollTop;
  }, window);
};

exports.addScrollListeners = addScrollListeners;

var addListenerClickCell = function addListenerClickCell(vTmpCell, vEvents, task, column) {
  addListener('click', function (e) {
    if (e.target.classList.contains('gfoldercollapse') === false && vEvents[column] && typeof vEvents[column] === 'function') {
      vEvents[column](task, e, vTmpCell);
    }
  }, vTmpCell);
};

exports.addListenerClickCell = addListenerClickCell;

var addListenerInputCell = function addListenerInputCell(vTmpCell, vEventsChange, callback, tasks, index, column) {
  var draw = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  var event = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'blur';
  var task = tasks[index];

  if (vTmpCell.children[0] && vTmpCell.children[0].children && vTmpCell.children[0].children[0]) {
    var tagName = vTmpCell.children[0].children[0].tagName;
    var selectInputOrButton = tagName === 'SELECT' || tagName === 'INPUT' || tagName === 'BUTTON';

    if (selectInputOrButton) {
      addListener(event, function (e) {
        if (callback) {
          callback(task, e);
        }

        if (vEventsChange[column] && typeof vEventsChange[column] === 'function') {
          var q = vEventsChange[column](tasks, task, e, vTmpCell, vColumnsNames[column]);

          if (q && q.then) {
            q.then(function (e) {
              return draw();
            });
          } else {
            draw();
          }
        } else {
          draw();
        }
      }, vTmpCell.children[0].children[0]);
    }
  }
};

exports.addListenerInputCell = addListenerInputCell;

var addListenerDependencies = function addListenerDependencies(vLineOptions) {
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

var toggleDependencies = function toggleDependencies(e, vLineOptions) {
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
    }); // document.querySelectorAll(`.gDepId${ids[1]}`).forEach((c: any) => {
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSGantt = void 0;

var _events = require("./events");

var _general_utils = require("./utils/general_utils");

var _xml = require("./xml");

var _task = require("./task");

var _draw = require("./draw");

var _json = require("./json");

var _date_utils = require("./utils/date_utils");

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
var JSGantt;
exports.JSGantt = JSGantt;
if (!JSGantt) exports.JSGantt = JSGantt = {};
JSGantt.isIE = _general_utils.isIE;
JSGantt.TaskItem = _task.TaskItem;
JSGantt.GanttChart = _draw.GanttChart;
JSGantt.updateFlyingObj = _general_utils.updateFlyingObj;
JSGantt.showToolTip = _events.showToolTip;
JSGantt.stripIds = _general_utils.stripIds;
JSGantt.stripUnwanted = _general_utils.stripUnwanted;
JSGantt.delayedHide = _general_utils.delayedHide;
JSGantt.hideToolTip = _general_utils.hideToolTip;
JSGantt.fadeToolTip = _general_utils.fadeToolTip;
JSGantt.moveToolTip = _general_utils.moveToolTip;
JSGantt.getZoomFactor = _general_utils.getZoomFactor;
JSGantt.getOffset = _general_utils.getOffset;
JSGantt.getScrollPositions = _general_utils.getScrollPositions;
JSGantt.processRows = _task.processRows;
JSGantt.sortTasks = _task.sortTasks; // Used to determine the minimum date of all tasks and set lower bound based on format

JSGantt.getMinDate = _date_utils.getMinDate; // Used to determine the maximum date of all tasks and set upper bound based on format

JSGantt.getMaxDate = _date_utils.getMaxDate; // This function finds the document id of the specified object

JSGantt.findObj = _general_utils.findObj;
JSGantt.changeFormat = _general_utils.changeFormat; // Tasks

JSGantt.folder = _events.folder;
JSGantt.hide = _events.hide;
JSGantt.show = _events.show;
JSGantt.taskLink = _task.taskLink;
JSGantt.parseDateStr = _date_utils.parseDateStr;
JSGantt.formatDateStr = _date_utils.formatDateStr;
JSGantt.parseDateFormatStr = _date_utils.parseDateFormatStr; // XML 

JSGantt.parseXML = _xml.parseXML;
JSGantt.parseXMLString = _xml.parseXMLString;
JSGantt.findXMLNode = _xml.findXMLNode;
JSGantt.getXMLNodeValue = _xml.getXMLNodeValue;
JSGantt.AddXMLTask = _xml.AddXMLTask; // JSON

JSGantt.parseJSON = _json.parseJSON;
JSGantt.parseJSONString = _json.parseJSONString;
JSGantt.addJSONTask = _json.addJSONTask;
JSGantt.benchMark = _general_utils.benchMark;
JSGantt.getIsoWeek = _date_utils.getIsoWeek;
JSGantt.addListener = _events.addListener;
JSGantt.addTooltipListeners = _events.addTooltipListeners;
JSGantt.addThisRowListeners = _events.addThisRowListeners;
JSGantt.addFolderListeners = _events.addFolderListeners;
JSGantt.addFormatListeners = _events.addFormatListeners;
JSGantt.addScrollListeners = _events.addScrollListeners;
JSGantt.criticalPath = _general_utils.criticalPath;

},{"./draw":2,"./events":5,"./json":7,"./task":10,"./utils/date_utils":11,"./utils/general_utils":13,"./xml":14}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addJSONTask = exports.parseJSONString = exports.parseJSON = void 0;

var _task = require("./task");

var _general_utils = require("./utils/general_utils");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

/**
 *
 * @param pFile
 * @param pGanttlet
 */
var parseJSON = function parseJSON(pFile, pGanttVar) {
  var vDebug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var redrawAfter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  return __awaiter(this, void 0, void 0, function* () {
    var jsonObj = yield (0, _general_utils.makeRequest)(pFile, true, true);
    var bd;

    if (vDebug) {
      bd = new Date();
      console.info('before jsonparse', bd);
    }

    addJSONTask(pGanttVar, jsonObj);

    if (this.vDebug) {
      var ad = new Date();
      console.info('after addJSONTask', ad, ad.getTime() - bd.getTime());
    }

    if (redrawAfter) {
      pGanttVar.Draw();
    }

    return jsonObj;
  });
};

exports.parseJSON = parseJSON;

var parseJSONString = function parseJSONString(pStr, pGanttVar) {
  addJSONTask(pGanttVar, JSON.parse(pStr));
};

exports.parseJSONString = parseJSONString;

var addJSONTask = function addJSONTask(pGanttVar, pJsonObj) {
  for (var index = 0; index < pJsonObj.length; index++) {
    var id = void 0;
    var name = void 0;
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
    var parent = void 0;
    var open = void 0;
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
          name = value;
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
          parent = value;
          break;

        case 'popen':
        case 'open':
          open = value;
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
    } //if (id != undefined && !isNaN(parseInt(id)) && isFinite(id) && name && start && end && itemClass && completion != undefined && !isNaN(parseFloat(completion)) && isFinite(completion) && !isNaN(parseInt(parent)) && isFinite(parent)) {


    pGanttVar.AddTaskItem(new _task.TaskItem(id, name, start, end, itemClass, link, milestone, resourceName, completion, group, parent, open, dependsOn, caption, notes, pGanttVar, cost, planstart, planend, duration, bartext, additionalObject)); //}
  }
};

exports.addJSONTask = addJSONTask;

},{"./task":10,"./utils/general_utils":13}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ko = exports.hu = exports.cs = exports.ja = exports.tr = exports.id = exports.nl = exports.sv = exports.cn = exports.ru = exports.fr = exports.pt = exports.de = exports.es = exports.en = void 0;
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
  'comp': '% Compl.',
  'completion': 'Completado',
  'startdate': 'Inicio',
  'planstartdate': 'Inicio Planificado',
  'cost': 'Coste',
  'enddate': 'Fin',
  'planenddate': 'Fin Planificado',
  'moreinfo': 'Más Información',
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
  'sat': 'Sat',
  'tooltipLoading': 'Loading...'
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
  'mon': 'Mo',
  'tue': 'Di',
  'wed': 'Mi',
  'thu': 'Do',
  'fri': 'Fr',
  'sat': 'Sa'
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
  'august': 'Август',
  'september': 'Сентябрь',
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
  'qtrs': 'кв.',
  'tooltipLoading': 'Загрузка...'
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
  'resource': 'Resource',
  'duration': 'Doorlooptijd',
  'comp': '% gereed',
  'completion': 'Gereed',
  'startdate': 'Startdatum',
  'planstartdate': 'Geplande startdatum',
  'enddate': 'Einddatum',
  'planenddate': 'Geplande einddatum',
  'cost': 'Kosten',
  'moreinfo': 'Meer informatie',
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
  'resource': 'Sumber Daya',
  'duration': 'Durasi',
  'comp': '% Penyelesaian',
  'completion': 'Penyelesaian',
  'startdate': 'Tanggal Mulai',
  'planstartdate': 'Perencanaan Tanggal Mulai',
  'enddate': 'Tanggal Akhir',
  'planenddate': 'Perencanaan Tanggal Akhir',
  'cost': 'Biaya',
  'moreinfo': 'Informasi Lebih Lanjut',
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
  'resource': 'Kaynak',
  'duration': 'Süre',
  'comp': '% Tamamlanma.',
  'completion': 'Tamamlanma',
  'startdate': 'Başlangıç Tarihi',
  'planstartdate': 'Plan Başlama Tarihi',
  'enddate': 'Bitiş Tarihi',
  'planenddate': 'Plan Bitiş Tarihi',
  'cost': 'Tutar',
  'moreinfo': 'Daha Fazla Bilgi',
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
  'resource': 'リソース',
  'duration': '期間',
  'comp': '進捗率',
  'completion': '進捗率',
  'startdate': '開始日',
  'planstartdate': '予定開始日',
  'enddate': '期日',
  'planenddate': '予定期日',
  'cost': 'コスト',
  'moreinfo': '詳細',
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
  'resource': 'Přiřazeno',
  'duration': 'Trvání',
  'comp': '% Hotovo',
  'completion': 'Hotovo',
  'startdate': 'Start',
  'planstartdate': 'Plánovaný start',
  'enddate': 'Konec',
  'planenddate': 'Plánovaný konec',
  'cost': 'Náklady',
  'moreinfo': 'Více informací',
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
  'resource': 'Erőforrás',
  'duration': 'Időtartam',
  'comp': '% Kész',
  'completion': 'Elkészült',
  'startdate': 'Kezdés',
  'planstartdate': 'Tervezett kezdés',
  'enddate': 'Befejezés',
  'planenddate': 'Tervezett befejezés',
  'cost': 'Költség',
  'moreinfo': 'További információ',
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
  'resource': '이름',
  'duration': '기간',
  'comp': '% ',
  'completion': '완료',
  'startdate': '시작일자',
  'planstartdate': '계획 시작일자',
  'enddate': '종료일자',
  'planenddate': '계획 종료일자',
  'cost': '비용',
  'moreinfo': '더 많은 정보',
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

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.includeGetSet = void 0;

var _date_utils = require("./utils/date_utils");

var _draw_columns = require("./draw_columns");

var includeGetSet = function includeGetSet() {
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
      } else if (val instanceof Array) {
        // ev = `this.set${key.substr(1)}(...val)`;
        this['set' + key.substr(1)].apply(this, val);
      } else {
        // ev = `this.set${key.substr(1)}(val)`;
        this['set' + key.substr(1)](val);
      }
    }
  };

  this.setUseFade = function (pVal) {
    this.vUseFade = pVal;
  };

  this.setUseMove = function (pVal) {
    this.vUseMove = pVal;
  };

  this.setUseRowHlt = function (pVal) {
    this.vUseRowHlt = pVal;
  };

  this.setUseToolTip = function (pVal) {
    this.vUseToolTip = pVal;
  };

  this.setUseSort = function (pVal) {
    this.vUseSort = pVal;
  };

  this.setUseSingleCell = function (pVal) {
    this.vUseSingleCell = pVal * 1;
  };

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

  this.setShowRes = function (pVal) {
    this.vShowRes = pVal;
  };

  this.setShowDur = function (pVal) {
    this.vShowDur = pVal;
  };

  this.setShowComp = function (pVal) {
    this.vShowComp = pVal;
  };

  this.setShowStartDate = function (pVal) {
    this.vShowStartDate = pVal;
  };

  this.setShowEndDate = function (pVal) {
    this.vShowEndDate = pVal;
  };

  this.setShowPlanStartDate = function (pVal) {
    this.vShowPlanStartDate = pVal;
  };

  this.setShowPlanEndDate = function (pVal) {
    this.vShowPlanEndDate = pVal;
  };

  this.setShowCost = function (pVal) {
    this.vShowCost = pVal;
  };

  this.setShowAddEntries = function (pVal) {
    this.vShowAddEntries = pVal;
  };

  this.setShowTaskInfoRes = function (pVal) {
    this.vShowTaskInfoRes = pVal;
  };

  this.setShowTaskInfoDur = function (pVal) {
    this.vShowTaskInfoDur = pVal;
  };

  this.setShowTaskInfoComp = function (pVal) {
    this.vShowTaskInfoComp = pVal;
  };

  this.setShowTaskInfoStartDate = function (pVal) {
    this.vShowTaskInfoStartDate = pVal;
  };

  this.setShowTaskInfoEndDate = function (pVal) {
    this.vShowTaskInfoEndDate = pVal;
  };

  this.setShowTaskInfoNotes = function (pVal) {
    this.vShowTaskInfoNotes = pVal;
  };

  this.setShowTaskInfoLink = function (pVal) {
    this.vShowTaskInfoLink = pVal;
  };

  this.setShowEndWeekDate = function (pVal) {
    this.vShowEndWeekDate = pVal;
  };

  this.setShowWeekends = function (pVal) {
    this.vShowWeekends = pVal;
  };

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

  this.setShowDeps = function (pVal) {
    this.vShowDeps = pVal;
  };

  this.setDateInputFormat = function (pVal) {
    this.vDateInputFormat = pVal;
  };

  this.setDateTaskTableDisplayFormat = function (pVal) {
    this.vDateTaskTableDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setDateTaskDisplayFormat = function (pVal) {
    this.vDateTaskDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setHourMajorDateDisplayFormat = function (pVal) {
    this.vHourMajorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setHourMinorDateDisplayFormat = function (pVal) {
    this.vHourMinorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setDayMajorDateDisplayFormat = function (pVal) {
    this.vDayMajorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setDayMinorDateDisplayFormat = function (pVal) {
    this.vDayMinorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setWeekMajorDateDisplayFormat = function (pVal) {
    this.vWeekMajorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setWeekMinorDateDisplayFormat = function (pVal) {
    this.vWeekMinorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setMonthMajorDateDisplayFormat = function (pVal) {
    this.vMonthMajorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setMonthMinorDateDisplayFormat = function (pVal) {
    this.vMonthMinorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setQuarterMajorDateDisplayFormat = function (pVal) {
    this.vQuarterMajorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setQuarterMinorDateDisplayFormat = function (pVal) {
    this.vQuarterMinorDateDisplayFormat = (0, _date_utils.parseDateFormatStr)(pVal);
  };

  this.setCaptionType = function (pType) {
    this.vCaptionType = pType;
  };

  this.setFormat = function (pFormat) {
    this.vFormat = pFormat;
    this.Draw();
  };

  this.setWorkingDays = function (workingDays) {
    this.vWorkingDays = workingDays;
  };

  this.setMinGpLen = function (pMinGpLen) {
    this.vMinGpLen = pMinGpLen;
  };

  this.setScrollTo = function (pDate) {
    this.vScrollTo = pDate;
  };

  this.setHourColWidth = function (pWidth) {
    this.vHourColWidth = pWidth;
  };

  this.setDayColWidth = function (pWidth) {
    this.vDayColWidth = pWidth;
  };

  this.setWeekColWidth = function (pWidth) {
    this.vWeekColWidth = pWidth;
  };

  this.setMonthColWidth = function (pWidth) {
    this.vMonthColWidth = pWidth;
  };

  this.setQuarterColWidth = function (pWidth) {
    this.vQuarterColWidth = pWidth;
  };

  this.setRowHeight = function (pHeight) {
    this.vRowHeight = pHeight;
  };

  this.setLang = function (pLang) {
    if (this.vLangs[pLang]) this.vLang = pLang;
  };

  this.setChartBody = function (pDiv) {
    if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vChartBody = pDiv;
  };

  this.setChartHead = function (pDiv) {
    if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vChartHead = pDiv;
  };

  this.setListBody = function (pDiv) {
    if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vListBody = pDiv;
  };

  this.setChartTable = function (pTable) {
    if (typeof HTMLTableElement !== 'function' || pTable instanceof HTMLTableElement) this.vChartTable = pTable;
  };

  this.setLines = function (pDiv) {
    if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vLines = pDiv;
  };

  this.setLineOptions = function (lineOptions) {
    this.vLineOptions = lineOptions;
  };

  this.setTimer = function (pVal) {
    this.vTimer = pVal * 1;
  };

  this.setTooltipDelay = function (pVal) {
    this.vTooltipDelay = pVal * 1;
  };

  this.setTooltipTemplate = function (pVal) {
    this.vTooltipTemplate = pVal;
  };

  this.setMinDate = function (pVal) {
    this.vMinDate = pVal;
  };

  this.setMaxDate = function (pVal) {
    this.vMaxDate = pVal;
  };

  this.addLang = function (pLang, pVals) {
    if (!this.vLangs[pLang]) {
      this.vLangs[pLang] = new Object();

      for (var vKey in this.vLangs['en']) {
        this.vLangs[pLang][vKey] = pVals[vKey] ? document.createTextNode(pVals[vKey]).data : this.vLangs['en'][vKey];
      }
    }
  };

  this.setTotalHeight = function (pVal) {
    this.vTotalHeight = pVal;
  }; // EVENTS


  this.setEvents = function (pEvents) {
    this.vEvents = pEvents;
  };

  this.setEventsChange = function (pEventsChange) {
    this.vEventsChange = pEventsChange;
  };

  this.setEventClickRow = function (fn) {
    this.vEventClickRow = fn;
  };

  this.setEventClickCollapse = function (fn) {
    this.vEventClickCollapse = fn;
  };

  this.setResources = function (resources) {
    this.vResources = resources;
  };

  this.setAdditionalHeaders = function (headers) {
    this.vAdditionalHeaders = headers;
  };

  this.setColumnOrder = function (order) {
    this.vColumnOrder = order;
  };

  this.setEditable = function (editable) {
    this.vEditable = editable;
  };

  this.setDebug = function (debug) {
    this.vDebug = debug;
  };
  /**
   * GETTERS
   */


  this.getDivId = function () {
    return this.vDivId;
  };

  this.getUseFade = function () {
    return this.vUseFade;
  };

  this.getUseMove = function () {
    return this.vUseMove;
  };

  this.getUseRowHlt = function () {
    return this.vUseRowHlt;
  };

  this.getUseToolTip = function () {
    return this.vUseToolTip;
  };

  this.getUseSort = function () {
    return this.vUseSort;
  };

  this.getUseSingleCell = function () {
    return this.vUseSingleCell;
  };

  this.getFormatArr = function () {
    return this.vFormatArr;
  };

  this.getShowRes = function () {
    return this.vShowRes;
  };

  this.getShowDur = function () {
    return this.vShowDur;
  };

  this.getShowComp = function () {
    return this.vShowComp;
  };

  this.getShowStartDate = function () {
    return this.vShowStartDate;
  };

  this.getShowEndDate = function () {
    return this.vShowEndDate;
  };

  this.getShowPlanStartDate = function () {
    return this.vShowPlanStartDate;
  };

  this.getShowPlanEndDate = function () {
    return this.vShowPlanEndDate;
  };

  this.getShowCost = function () {
    return this.vShowCost;
  };

  this.getShowAddEntries = function () {
    return this.vShowAddEntries;
  };

  this.getShowTaskInfoRes = function () {
    return this.vShowTaskInfoRes;
  };

  this.getShowTaskInfoDur = function () {
    return this.vShowTaskInfoDur;
  };

  this.getShowTaskInfoComp = function () {
    return this.vShowTaskInfoComp;
  };

  this.getShowTaskInfoStartDate = function () {
    return this.vShowTaskInfoStartDate;
  };

  this.getShowTaskInfoEndDate = function () {
    return this.vShowTaskInfoEndDate;
  };

  this.getShowTaskInfoNotes = function () {
    return this.vShowTaskInfoNotes;
  };

  this.getShowTaskInfoLink = function () {
    return this.vShowTaskInfoLink;
  };

  this.getShowEndWeekDate = function () {
    return this.vShowEndWeekDate;
  };

  this.getShowWeekends = function () {
    return this.vShowWeekends;
  };

  this.getShowSelector = function () {
    return this.vShowSelector;
  };

  this.getShowDeps = function () {
    return this.vShowDeps;
  };

  this.getDateInputFormat = function () {
    return this.vDateInputFormat;
  };

  this.getDateTaskTableDisplayFormat = function () {
    return this.vDateTaskTableDisplayFormat;
  };

  this.getDateTaskDisplayFormat = function () {
    return this.vDateTaskDisplayFormat;
  };

  this.getHourMajorDateDisplayFormat = function () {
    return this.vHourMajorDateDisplayFormat;
  };

  this.getHourMinorDateDisplayFormat = function () {
    return this.vHourMinorDateDisplayFormat;
  };

  this.getDayMajorDateDisplayFormat = function () {
    return this.vDayMajorDateDisplayFormat;
  };

  this.getDayMinorDateDisplayFormat = function () {
    return this.vDayMinorDateDisplayFormat;
  };

  this.getWeekMajorDateDisplayFormat = function () {
    return this.vWeekMajorDateDisplayFormat;
  };

  this.getWeekMinorDateDisplayFormat = function () {
    return this.vWeekMinorDateDisplayFormat;
  };

  this.getMonthMajorDateDisplayFormat = function () {
    return this.vMonthMajorDateDisplayFormat;
  };

  this.getMonthMinorDateDisplayFormat = function () {
    return this.vMonthMinorDateDisplayFormat;
  };

  this.getQuarterMajorDateDisplayFormat = function () {
    return this.vQuarterMajorDateDisplayFormat;
  };

  this.getQuarterMinorDateDisplayFormat = function () {
    return this.vQuarterMinorDateDisplayFormat;
  };

  this.getCaptionType = function () {
    return this.vCaptionType;
  };

  this.getMinGpLen = function () {
    return this.vMinGpLen;
  };

  this.getScrollTo = function () {
    return this.vScrollTo;
  };

  this.getHourColWidth = function () {
    return this.vHourColWidth;
  };

  this.getDayColWidth = function () {
    return this.vDayColWidth;
  };

  this.getWeekColWidth = function () {
    return this.vWeekColWidth;
  };

  this.getMonthColWidth = function () {
    return this.vMonthColWidth;
  };

  this.getQuarterColWidth = function () {
    return this.vQuarterColWidth;
  };

  this.getRowHeight = function () {
    return this.vRowHeight;
  };

  this.getChartBody = function () {
    return this.vChartBody;
  };

  this.getChartHead = function () {
    return this.vChartHead;
  };

  this.getListBody = function () {
    return this.vListBody;
  };

  this.getChartTable = function () {
    return this.vChartTable;
  };

  this.getLines = function () {
    return this.vLines;
  };

  this.getTimer = function () {
    return this.vTimer;
  };

  this.getMinDate = function () {
    return this.vMinDate;
  };

  this.getMaxDate = function () {
    return this.vMaxDate;
  };

  this.getTooltipDelay = function () {
    return this.vTooltipDelay;
  };

  this.getList = function () {
    return this.vTaskList;
  }; //EVENTS


  this.getEventsClickCell = function () {
    return this.vEvents;
  };

  this.getEventsChange = function () {
    return this.vEventsChange;
  };

  this.getEventClickRow = function () {
    return this.vEventClickRow;
  };

  this.getEventClickCollapse = function () {
    return this.vEventClickCollapse;
  };

  this.getResources = function () {
    return this.vResources;
  };

  this.getAdditionalHeaders = function () {
    return this.vAdditionalHeaders;
  };

  this.getColumnOrder = function () {
    return this.vColumnOrder || _draw_columns.COLUMN_ORDER;
  };
};

exports.includeGetSet = includeGetSet;

},{"./draw_columns":3,"./utils/date_utils":11}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processRows = exports.ClearTasks = exports.RemoveTaskItem = exports.AddTaskItemObject = exports.AddTaskItem = exports.createTaskInfo = exports.TaskItem = exports.TaskItemObject = exports.sortTasks = exports.taskLink = void 0;

var _general_utils = require("./utils/general_utils");

var _draw_utils = require("./utils/draw_utils");

var _date_utils = require("./utils/date_utils");

// function to open window to display task link
var taskLink = function taskLink(pRef, pWidth, pHeight) {
  var vWidth, vHeight;
  if (pWidth) vWidth = pWidth;else vWidth = 400;
  if (pHeight) vHeight = pHeight;else vHeight = 400;
  window.open(pRef, 'newwin', 'height=' + vHeight + ',width=' + vWidth); // let OpenWindow = 
};

exports.taskLink = taskLink;

var sortTasks = function sortTasks(pList, pID, pIdx) {
  if (pList.length < 2) {
    return pIdx;
  }

  var sortIdx = pIdx;
  var sortArr = new Array();

  for (var i = 0; i < pList.length; i++) {
    if (pList[i].getParent() == pID) sortArr.push(pList[i]);
  }

  if (sortArr.length > 0) {
    sortArr.sort(function (a, b) {
      var i = a.getStart().getTime() - b.getStart().getTime();
      if (i == 0) i = a.getEnd().getTime() - b.getEnd().getTime();
      if (i == 0) return a.getID() - b.getID();else return i;
    });
  }

  for (var j = 0; j < sortArr.length; j++) {
    for (var _i = 0; _i < pList.length; _i++) {
      if (pList[_i].getID() == sortArr[j].getID()) {
        pList[_i].setSortIdx(sortIdx++);

        sortIdx = sortTasks(pList, pList[_i].getID(), sortIdx);
      }
    }
  }

  return sortIdx;
};

exports.sortTasks = sortTasks;

var TaskItemObject = function TaskItemObject(object) {
  var pDataObject = Object.assign({}, object);

  _general_utils.internalProperties.forEach(function (property) {
    delete pDataObject[property];
  });

  return new TaskItem(object.pID, object.pName, object.pStart, object.pEnd, object.pClass, object.pLink, object.pMile, object.pRes, object.pComp, object.pGroup, object.pParent, object.pOpen, object.pDepend, object.pCaption, object.pNotes, object.pGantt, object.pCost, object.pPlanStart, object.pPlanEnd, object.pDuration, object.pBarText, object);
};

exports.TaskItemObject = TaskItemObject;

var TaskItem = function TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt) {
  var pCost = arguments.length > 16 && arguments[16] !== undefined ? arguments[16] : null;
  var pPlanStart = arguments.length > 17 && arguments[17] !== undefined ? arguments[17] : null;
  var pPlanEnd = arguments.length > 18 && arguments[18] !== undefined ? arguments[18] : null;
  var pDuration = arguments.length > 19 && arguments[19] !== undefined ? arguments[19] : null;
  var pBarText = arguments.length > 20 && arguments[20] !== undefined ? arguments[20] : null;
  var pDataObject = arguments.length > 21 && arguments[21] !== undefined ? arguments[21] : null;
  var vGantt = pGantt ? pGantt : this;
  var _id = document.createTextNode(pID).data;
  var vID = (0, _general_utils.hashKey)(document.createTextNode(pID).data);
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
    parent = (0, _general_utils.hashKey)(parent).toString();
  }

  var vParent = parent;
  var vOpen = vGroup == 2 ? 1 : parseInt(document.createTextNode(pOpen).data);
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
    (0, _general_utils.stripUnwanted)(vNotes);
  }

  if (pStart != null && pStart != '') {
    vStart = pStart instanceof Date ? pStart : (0, _date_utils.parseDateStr)(document.createTextNode(pStart).data, vGantt.getDateInputFormat());
    vGroupMinStart = vStart;
  }

  if (pEnd != null && pEnd != '') {
    vEnd = pEnd instanceof Date ? pEnd : (0, _date_utils.parseDateStr)(document.createTextNode(pEnd).data, vGantt.getDateInputFormat());
    vGroupMinEnd = vEnd;
  }

  if (pPlanStart != null && pPlanStart != '') {
    vPlanStart = pPlanStart instanceof Date ? pPlanStart : (0, _date_utils.parseDateStr)(document.createTextNode(pPlanStart).data, vGantt.getDateInputFormat());
    vGroupMinPlanStart = vPlanStart;
  }

  if (pPlanEnd != null && pPlanEnd != '') {
    vPlanEnd = pPlanEnd instanceof Date ? pPlanEnd : (0, _date_utils.parseDateStr)(document.createTextNode(pPlanEnd).data, vGantt.getDateInputFormat());
    vGroupMinPlanEnd = vPlanEnd;
  }

  if (pDepend != null) {
    var vDependStr = pDepend + '';
    var vDepList = vDependStr.split(',');
    var n = vDepList.length;

    for (var k = 0; k < n; k++) {
      if (vDepList[k].toUpperCase().endsWith('SS')) {
        vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
        vDependType[k] = 'SS';
      } else if (vDepList[k].toUpperCase().endsWith('FF')) {
        vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
        vDependType[k] = 'FF';
      } else if (vDepList[k].toUpperCase().endsWith('SF')) {
        vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
        vDependType[k] = 'SF';
      } else if (vDepList[k].toUpperCase().endsWith('FS')) {
        vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
        vDependType[k] = 'FS';
      } else {
        vDepend[k] = vDepList[k];
        vDependType[k] = 'FS';
      }

      if (vDepend[k]) {
        vDepend[k] = (0, _general_utils.hashKey)(vDepend[k]).toString();
      }
    }
  }

  this.getID = function () {
    return vID;
  };

  this.getOriginalID = function () {
    return _id;
  };

  this.getGantt = function () {
    return vGantt;
  };

  this.getName = function () {
    return vName;
  };

  this.getStart = function () {
    if (vStart) return vStart;else if (vPlanStart) return vPlanStart;else return new Date();
  };

  this.getStartVar = function () {
    return vStart;
  };

  this.getEnd = function () {
    if (vEnd) return vEnd;else if (vPlanEnd) return vPlanEnd;else if (vStart && vDuration) {
      var date = new Date(vStart);
      var vUnits = vDuration.split(' ');
      var value = parseInt(vUnits[0]);

      switch (vUnits[1]) {
        case 'hour':
          date.setMinutes(date.getMinutes() + value * 60);
          break;

        case 'day':
          date.setMinutes(date.getMinutes() + value * 60 * 24);
          break;

        case 'week':
          date.setMinutes(date.getMinutes() + value * 60 * 24 * 7);
          break;

        case 'month':
          date.setMonth(date.getMonth() + value);
          break;

        case 'quarter':
          date.setMonth(date.getMonth() + value * 3);
          break;
      }

      return date;
    } else return new Date();
  };

  this.getEndVar = function () {
    return vEnd;
  };

  this.getPlanStart = function () {
    return vPlanStart ? vPlanStart : vStart;
  };

  this.getPlanEnd = function () {
    return vPlanEnd ? vPlanEnd : vEnd;
  };

  this.getCost = function () {
    return vCost;
  };

  this.getGroupMinStart = function () {
    return vGroupMinStart;
  };

  this.getGroupMinEnd = function () {
    return vGroupMinEnd;
  };

  this.getGroupMinPlanStart = function () {
    return vGroupMinPlanStart;
  };

  this.getGroupMinPlanEnd = function () {
    return vGroupMinPlanEnd;
  };

  this.getClass = function () {
    return vClass;
  };

  this.getLink = function () {
    return vLink;
  };

  this.getMile = function () {
    return vMile;
  };

  this.getDepend = function () {
    if (vDepend) return vDepend;else return null;
  };

  this.getDataObject = function () {
    return vDataObject;
  };

  this.getDepType = function () {
    if (vDependType) return vDependType;else return null;
  };

  this.getCaption = function () {
    if (vCaption) return vCaption;else return '';
  };

  this.getResource = function () {
    if (vRes) return vRes;else return "\xA0";
  };

  this.getCompVal = function () {
    if (vComp) return vComp;else if (vCompVal) return vCompVal;else return 0;
  };

  this.getCompStr = function () {
    if (vComp) return vComp + '%';else if (vCompVal) return vCompVal + '%';else return '';
  };

  this.getCompRestStr = function () {
    if (vComp) return 100 - vComp + '%';else if (vCompVal) return 100 - vCompVal + '%';else return '';
  };

  this.getNotes = function () {
    return vNotes;
  };

  this.getSortIdx = function () {
    return vSortIdx;
  };

  this.getToDelete = function () {
    return vToDelete;
  };

  this.getDuration = function (pFormat, pLang) {
    if (vMile) {
      vDuration = '-';
    } else if (!vEnd && !vStart && vPlanStart && vPlanEnd) {
      return calculateVDuration(pFormat, pLang, this.getPlanStart(), this.getPlanEnd());
    } else if (!vEnd && vDuration) {
      return vDuration;
    } else {
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
    } // let vTaskEnd = new Date(this.getEnd().getTime());
    // if ((vTaskEnd.getTime() - (vTaskEnd.getTimezoneOffset() * 60000)) % (86400000) == 0) {
    //   vTaskEnd = new Date(vTaskEnd.getFullYear(), vTaskEnd.getMonth(), vTaskEnd.getDate() + 1, vTaskEnd.getHours(), vTaskEnd.getMinutes(), vTaskEnd.getSeconds());
    // }
    // let tmpPer = (getOffset(this.getStart(), vTaskEnd, 999, vUnits)) / 1000;


    var hours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
    var tmpPer;

    switch (vUnits) {
      case 'hour':
        tmpPer = Math.round(hours);
        vDuration = tmpPer + ' ' + (tmpPer != 1 ? pLang['hrs'] : pLang['hr']);
        break;

      case 'day':
        tmpPer = Math.round(hours / 24);
        vDuration = tmpPer + ' ' + (tmpPer != 1 ? pLang['dys'] : pLang['dy']);
        break;

      case 'week':
        tmpPer = Math.round(hours / 24 / 7);
        vDuration = tmpPer + ' ' + (tmpPer != 1 ? pLang['wks'] : pLang['wk']);
        break;

      case 'month':
        tmpPer = Math.round(hours / 24 / 7 / 30);
        vDuration = tmpPer + ' ' + (tmpPer != 1 ? pLang['mths'] : pLang['mth']);
        break;

      case 'quarter':
        tmpPer = Math.round(hours / 24 / 7 / 30 / 3);
        vDuration = tmpPer + ' ' + (tmpPer != 1 ? pLang['qtrs'] : pLang['qtr']);
        break;
    }

    return vDuration;
  }

  this.getBarText = function () {
    return vBarText;
  };

  this.getParent = function () {
    return vParent;
  };

  this.getGroup = function () {
    return vGroup;
  };

  this.getOpen = function () {
    return vOpen;
  };

  this.getLevel = function () {
    return vLevel;
  };

  this.getNumKids = function () {
    return vNumKid;
  };

  this.getWeight = function () {
    return vWeight;
  };

  this.getStartX = function () {
    return x1;
  };

  this.getStartY = function () {
    return y1;
  };

  this.getEndX = function () {
    return x2;
  };

  this.getEndY = function () {
    return y2;
  };

  this.getVisible = function () {
    return vVisible;
  };

  this.getParItem = function () {
    return vParItem;
  };

  this.getCellDiv = function () {
    return vCellDiv;
  };

  this.getBarDiv = function () {
    return vBarDiv;
  };

  this.getTaskDiv = function () {
    return vTaskDiv;
  };

  this.getPlanTaskDiv = function () {
    return vPlanTaskDiv;
  };

  this.getChildRow = function () {
    return vChildRow;
  };

  this.getListChildRow = function () {
    return vListChildRow;
  };

  this.getGroupSpan = function () {
    return vGroupSpan;
  };

  this.setName = function (pName) {
    vName = pName;
  };

  this.setNotes = function (pNotes) {
    vNotes = pNotes;
  };

  this.setClass = function (pClass) {
    vClass = pClass;
  };

  this.setCost = function (pCost) {
    vCost = pCost;
  };

  this.setResource = function (pRes) {
    vRes = pRes;
  };

  this.setDuration = function (pDuration) {
    vDuration = pDuration;
  };

  this.setDataObject = function (pDataObject) {
    vDataObject = pDataObject;
  };

  this.setStart = function (pStart) {
    if (pStart instanceof Date) {
      vStart = pStart;
    } else {
      var temp = new Date(pStart);

      if (temp instanceof Date && !isNaN(temp.valueOf())) {
        vStart = temp;
      }
    }
  };

  this.setEnd = function (pEnd) {
    if (pEnd instanceof Date) {
      vEnd = pEnd;
    } else {
      var temp = new Date(pEnd);

      if (temp instanceof Date && !isNaN(temp.valueOf())) {
        vEnd = temp;
      }
    }
  };

  this.setPlanStart = function (pPlanStart) {
    if (pPlanStart instanceof Date) vPlanStart = pPlanStart;else vPlanStart = new Date(pPlanStart);
  };

  this.setPlanEnd = function (pPlanEnd) {
    if (pPlanEnd instanceof Date) vPlanEnd = pPlanEnd;else vPlanEnd = new Date(pPlanEnd);
  };

  this.setGroupMinStart = function (pStart) {
    if (pStart instanceof Date) vGroupMinStart = pStart;
  };

  this.setGroupMinEnd = function (pEnd) {
    if (pEnd instanceof Date) vGroupMinEnd = pEnd;
  };

  this.setLevel = function (pLevel) {
    vLevel = parseInt(document.createTextNode(pLevel).data);
  };

  this.setNumKid = function (pNumKid) {
    vNumKid = parseInt(document.createTextNode(pNumKid).data);
  };

  this.setWeight = function (pWeight) {
    vWeight = parseInt(document.createTextNode(pWeight).data);
  };

  this.setCompVal = function (pCompVal) {
    vCompVal = parseFloat(document.createTextNode(pCompVal).data);
  };

  this.setComp = function (pComp) {
    vComp = parseInt(document.createTextNode(pComp).data);
  };

  this.setStartX = function (pX) {
    x1 = parseInt(document.createTextNode(pX).data);
  };

  this.setStartY = function (pY) {
    y1 = parseInt(document.createTextNode(pY).data);
  };

  this.setEndX = function (pX) {
    x2 = parseInt(document.createTextNode(pX).data);
  };

  this.setEndY = function (pY) {
    y2 = parseInt(document.createTextNode(pY).data);
  };

  this.setOpen = function (pOpen) {
    vOpen = parseInt(document.createTextNode(pOpen).data);
  };

  this.setVisible = function (pVisible) {
    vVisible = parseInt(document.createTextNode(pVisible).data);
  };

  this.setSortIdx = function (pSortIdx) {
    vSortIdx = parseInt(document.createTextNode(pSortIdx).data);
  };

  this.setToDelete = function (pToDelete) {
    if (pToDelete) vToDelete = true;else vToDelete = false;
  };

  this.setParItem = function (pParItem) {
    if (pParItem) vParItem = pParItem;
  };

  this.setCellDiv = function (pCellDiv) {
    if (typeof HTMLDivElement !== 'function' || pCellDiv instanceof HTMLDivElement) vCellDiv = pCellDiv;
  }; //"typeof HTMLDivElement !== 'function'" to play nice with ie6 and 7


  this.setGroup = function (pGroup) {
    if (pGroup === true || pGroup === 'true') {
      vGroup = 1;
    } else if (pGroup === false || pGroup === 'false') {
      vGroup = 0;
    } else {
      vGroup = parseInt(document.createTextNode(pGroup).data);
    }
  };

  this.setBarText = function (pBarText) {
    if (pBarText) vBarText = pBarText;
  };

  this.setBarDiv = function (pDiv) {
    if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) vBarDiv = pDiv;
  };

  this.setTaskDiv = function (pDiv) {
    if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) vTaskDiv = pDiv;
  };

  this.setPlanTaskDiv = function (pDiv) {
    if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) vPlanTaskDiv = pDiv;
  };

  this.setChildRow = function (pRow) {
    if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement) vChildRow = pRow;
  };

  this.setListChildRow = function (pRow) {
    if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement) vListChildRow = pRow;
  };

  this.setGroupSpan = function (pSpan) {
    if (typeof HTMLSpanElement !== 'function' || pSpan instanceof HTMLSpanElement) vGroupSpan = pSpan;
  };

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
      pDataObjec: vDataObject
    };
  };
};
/**
 * @param pTask
 * @param templateStrOrFn template string or function(task). In any case parameters in template string are substituted.
 *        If string - just a static template.
 *        If function(task): string - per task template. Can return null|undefined to fallback to default template.
 *        If function(task): Promise<string>) - async per task template. Tooltip will show 'Loading...' if promise is not yet complete.
 *          Otherwise returned template will be handled in the same manner as in other cases.
 */


exports.TaskItem = TaskItem;

var createTaskInfo = function createTaskInfo(pTask) {
  var _this = this;

  var templateStrOrFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var vTmpDiv;
  var vTaskInfoBox = document.createDocumentFragment();
  var vTaskInfo = (0, _draw_utils.newNode)(vTaskInfoBox, 'div', null, 'gTaskInfo');

  var setupTemplate = function setupTemplate(template) {
    vTaskInfo.innerHTML = "";

    if (template) {
      var allData = pTask.getAllData();

      _general_utils.internalProperties.forEach(function (key) {
        var lang;

        if (_general_utils.internalPropertiesLang[key]) {
          lang = _this.vLangs[_this.vLang][_general_utils.internalPropertiesLang[key]];
        }

        if (!lang) {
          lang = key;
        }

        var val = allData[key];
        template = template.replace("{{".concat(key, "}}"), val);

        if (lang) {
          template = template.replace("{{Lang:".concat(key, "}}"), lang);
        } else {
          template = template.replace("{{Lang:".concat(key, "}}"), key);
        }
      });

      (0, _draw_utils.newNode)(vTaskInfo, 'span', null, 'gTtTemplate', template);
    } else {
      (0, _draw_utils.newNode)(vTaskInfo, 'span', null, 'gTtTitle', pTask.getName());

      if (_this.vShowTaskInfoStartDate == 1) {
        vTmpDiv = (0, _draw_utils.newNode)(vTaskInfo, 'div', null, 'gTILine gTIsd');
        (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['startdate'] + ': ');
        (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskText', (0, _date_utils.formatDateStr)(pTask.getStart(), _this.vDateTaskDisplayFormat, _this.vLangs[_this.vLang]));
      }

      if (_this.vShowTaskInfoEndDate == 1) {
        vTmpDiv = (0, _draw_utils.newNode)(vTaskInfo, 'div', null, 'gTILine gTIed');
        (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['enddate'] + ': ');
        (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskText', (0, _date_utils.formatDateStr)(pTask.getEnd(), _this.vDateTaskDisplayFormat, _this.vLangs[_this.vLang]));
      }

      if (_this.vShowTaskInfoDur == 1 && !pTask.getMile()) {
        vTmpDiv = (0, _draw_utils.newNode)(vTaskInfo, 'div', null, 'gTILine gTId');
        (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['duration'] + ': ');
        (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskText', pTask.getDuration(_this.vFormat, _this.vLangs[_this.vLang]));
      }

      if (_this.vShowTaskInfoComp == 1) {
        vTmpDiv = (0, _draw_utils.newNode)(vTaskInfo, 'div', null, 'gTILine gTIc');
        (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['completion'] + ': ');
        (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskText', pTask.getCompStr());
      }

      if (_this.vShowTaskInfoRes == 1) {
        vTmpDiv = (0, _draw_utils.newNode)(vTaskInfo, 'div', null, 'gTILine gTIr');
        (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['resource'] + ': ');
        (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskText', pTask.getResource());
      }

      if (_this.vShowTaskInfoLink == 1 && pTask.getLink() != '') {
        vTmpDiv = (0, _draw_utils.newNode)(vTaskInfo, 'div', null, 'gTILine gTIl');
        var vTmpNode = (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskLabel');
        vTmpNode = (0, _draw_utils.newNode)(vTmpNode, 'a', null, 'gTaskText', _this.vLangs[_this.vLang]['moreinfo']);
        vTmpNode.setAttribute('href', pTask.getLink());
      }

      if (_this.vShowTaskInfoNotes == 1) {
        vTmpDiv = (0, _draw_utils.newNode)(vTaskInfo, 'div', null, 'gTILine gTIn');
        (0, _draw_utils.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['notes'] + ': ');
        if (pTask.getNotes()) vTmpDiv.appendChild(pTask.getNotes());
      }
    }
  };

  var callback;

  if (typeof templateStrOrFn === 'function') {
    callback = function callback() {
      var strOrPromise = templateStrOrFn(pTask);

      if (!strOrPromise || typeof strOrPromise === 'string') {
        setupTemplate(strOrPromise);
      } else if (strOrPromise.then) {
        setupTemplate(_this.vLangs[_this.vLang]['tooltipLoading'] || _this.vLangs['en']['tooltipLoading']);
        return strOrPromise.then(setupTemplate);
      }
    };
  } else {
    setupTemplate(templateStrOrFn);
  }

  return {
    component: vTaskInfoBox,
    callback: callback
  };
};

exports.createTaskInfo = createTaskInfo;

var AddTaskItem = function AddTaskItem(value) {
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

exports.AddTaskItem = AddTaskItem;

var AddTaskItemObject = function AddTaskItemObject(object) {
  if (!object.pGantt) {
    object.pGantt = this;
  }

  return this.AddTaskItem(TaskItemObject(object));
};

exports.AddTaskItemObject = AddTaskItemObject;

var RemoveTaskItem = function RemoveTaskItem(pID) {
  // simply mark the task for removal at this point - actually remove it next time we re-draw the chart
  for (var i = 0; i < this.vTaskList.length; i++) {
    if (this.vTaskList[i].getID() == pID) this.vTaskList[i].setToDelete(true);else if (this.vTaskList[i].getParent() == pID) this.RemoveTaskItem(this.vTaskList[i].getID());
  }

  this.vProcessNeeded = true;
};

exports.RemoveTaskItem = RemoveTaskItem;

var ClearTasks = function ClearTasks() {
  var _this2 = this;

  this.vTaskList.map(function (task) {
    return _this2.RemoveTaskItem(task.getID());
  });
  this.vProcessNeeded = true;
}; // Recursively process task tree ... set min, max dates of parent tasks and identfy task level.


exports.ClearTasks = ClearTasks;

var processRows = function processRows(pList, pID, pRow, pLevel, pOpen, pUseSort) {
  var vDebug = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
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

    if (i >= 0 && pList[i].getID() == pID) vCurItem = pList[i];
  }

  for (i = 0; i < pList.length; i++) {
    if (pList[i].getParent() == pID) {
      vVisible = pOpen;
      pList[i].setParItem(vCurItem);
      pList[i].setVisible(vVisible);
      if (vVisible == 1 && pList[i].getOpen() == 0) vVisible = 0;

      if (pList[i].getMile() && pList[i].getParItem() && pList[i].getParItem().getGroup() == 2) {
        //remove milestones owned by combined groups
        pList.splice(i, 1);
        i--;
        continue;
      }

      pList[i].setLevel(vLevel);

      if (pList[i].getGroup()) {
        if (pList[i].getParItem() && pList[i].getParItem().getGroup() == 2) pList[i].setGroup(2);
        processRows(vList, pList[i].getID(), i, vLevel + 1, vVisible, 0);
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
    var bd;

    if (vDebug) {
      bd = new Date();
      console.info('before afterTasks', bd);
    }

    sortTasks(pList, 0, 0);

    if (vDebug) {
      var ad = new Date();
      console.info('after afterTasks', ad, ad.getTime() - bd.getTime());
    }

    pList.sort(function (a, b) {
      return a.getSortIdx() - b.getSortIdx();
    });
  }

  if (pID == 0 && pUseSort != 1) // Need to sort combined tasks regardless
    {
      for (i = 0; i < pList.length; i++) {
        if (pList[i].getGroup() == 2) {
          vComb = true;

          var _bd = void 0;

          if (vDebug) {
            _bd = new Date();
            console.info('before sortTasks', _bd);
          }

          sortTasks(pList, pList[i].getID(), pList[i].getSortIdx() + 1);

          if (vDebug) {
            var _ad = new Date();

            console.info('after sortTasks', _ad, _ad.getTime() - _bd.getTime());
          }
        }
      }

      if (vComb == true) pList.sort(function (a, b) {
        return a.getSortIdx() - b.getSortIdx();
      });
    }
};

exports.processRows = processRows;

},{"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIsoWeek = exports.parseDateFormatStr = exports.formatDateStr = exports.parseDateStr = exports.coerceDate = exports.getMaxDate = exports.getMinDate = void 0;

/**
 * DATES
 */
var getMinDate = function getMinDate(pList, pFormat, pMinDate) {
  var vDate = new Date();
  if (pList.length <= 0) return pMinDate || vDate;
  vDate.setTime(pMinDate && pMinDate.getTime() || pList[0].getStart().getTime()); // Parse all Task Start dates to find min

  for (var i = 0; i < pList.length; i++) {
    if (pList[i].getStart().getTime() < vDate.getTime()) vDate.setTime(pList[i].getStart().getTime());
    if (pList[i].getPlanStart() && pList[i].getPlanStart().getTime() < vDate.getTime()) vDate.setTime(pList[i].getPlanStart().getTime());
  } // Adjust min date to specific format boundaries (first of week or first of month)


  if (pFormat == 'day') {
    vDate.setDate(vDate.getDate() - 1);

    while (vDate.getDay() % 7 != 1) {
      vDate.setDate(vDate.getDate() - 1);
    }
  } else if (pFormat == 'week') {
    vDate.setDate(vDate.getDate() - 1);

    while (vDate.getDay() % 7 != 1) {
      vDate.setDate(vDate.getDate() - 1);
    }
  } else if (pFormat == 'month') {
    vDate.setDate(vDate.getDate() - 15);

    while (vDate.getDate() > 1) {
      vDate.setDate(vDate.getDate() - 1);
    }
  } else if (pFormat == 'quarter') {
    vDate.setDate(vDate.getDate() - 31);
    if (vDate.getMonth() == 0 || vDate.getMonth() == 1 || vDate.getMonth() == 2) vDate.setFullYear(vDate.getFullYear(), 0, 1);else if (vDate.getMonth() == 3 || vDate.getMonth() == 4 || vDate.getMonth() == 5) vDate.setFullYear(vDate.getFullYear(), 3, 1);else if (vDate.getMonth() == 6 || vDate.getMonth() == 7 || vDate.getMonth() == 8) vDate.setFullYear(vDate.getFullYear(), 6, 1);else if (vDate.getMonth() == 9 || vDate.getMonth() == 10 || vDate.getMonth() == 11) vDate.setFullYear(vDate.getFullYear(), 9, 1);
  } else if (pFormat == 'hour') {
    vDate.setHours(vDate.getHours() - 1);

    while (vDate.getHours() % 6 != 0) {
      vDate.setHours(vDate.getHours() - 1);
    }
  }

  if (pFormat == 'hour') vDate.setMinutes(0, 0);else vDate.setHours(0, 0, 0);
  return vDate;
};

exports.getMinDate = getMinDate;

var getMaxDate = function getMaxDate(pList, pFormat, pMaxDate) {
  var vDate = new Date();
  if (pList.length <= 0) return pMaxDate || vDate;
  vDate.setTime(pMaxDate && pMaxDate.getTime() || pList[0].getEnd().getTime()); // Parse all Task End dates to find max

  for (var i = 0; i < pList.length; i++) {
    if (pList[i].getEnd().getTime() > vDate.getTime()) vDate.setTime(pList[i].getEnd().getTime());
    if (pList[i].getPlanEnd() && pList[i].getPlanEnd().getTime() > vDate.getTime()) vDate.setTime(pList[i].getPlanEnd().getTime());
  } // Adjust max date to specific format boundaries (end of week or end of month)


  if (pFormat == 'day') {
    vDate.setDate(vDate.getDate() + 1);

    while (vDate.getDay() % 7 != 0) {
      vDate.setDate(vDate.getDate() + 1);
    }
  } else if (pFormat == 'week') {
    //For weeks, what is the last logical boundary?
    vDate.setDate(vDate.getDate() + 1);

    while (vDate.getDay() % 7 != 0) {
      vDate.setDate(vDate.getDate() + 1);
    }
  } else if (pFormat == 'month') {
    // Set to last day of current Month
    while (vDate.getDate() > 1) {
      vDate.setDate(vDate.getDate() + 1);
    }

    vDate.setDate(vDate.getDate() - 1);
  } else if (pFormat == 'quarter') {
    // Set to last day of current Quarter
    if (vDate.getMonth() == 0 || vDate.getMonth() == 1 || vDate.getMonth() == 2) vDate.setFullYear(vDate.getFullYear(), 2, 31);else if (vDate.getMonth() == 3 || vDate.getMonth() == 4 || vDate.getMonth() == 5) vDate.setFullYear(vDate.getFullYear(), 5, 30);else if (vDate.getMonth() == 6 || vDate.getMonth() == 7 || vDate.getMonth() == 8) vDate.setFullYear(vDate.getFullYear(), 8, 30);else if (vDate.getMonth() == 9 || vDate.getMonth() == 10 || vDate.getMonth() == 11) vDate.setFullYear(vDate.getFullYear(), 11, 31);
  } else if (pFormat == 'hour') {
    if (vDate.getHours() == 0) vDate.setDate(vDate.getDate() + 1);
    vDate.setHours(vDate.getHours() + 1);

    while (vDate.getHours() % 6 != 5) {
      vDate.setHours(vDate.getHours() + 1);
    }
  }

  return vDate;
};

exports.getMaxDate = getMaxDate;

var coerceDate = function coerceDate(date) {
  if (date instanceof Date) {
    return date;
  } else {
    var temp = new Date(date);

    if (temp instanceof Date && !isNaN(temp.valueOf())) {
      return temp;
    }
  }
};

exports.coerceDate = coerceDate;

var parseDateStr = function parseDateStr(pDateStr, pFormatStr) {
  var vDate = new Date();
  var vDateParts = pDateStr.split(/[^0-9]/);

  if (pDateStr.length >= 10 && vDateParts.length >= 3) {
    while (vDateParts.length < 5) {
      vDateParts.push(0);
    }

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

  return vDate;
};

exports.parseDateStr = parseDateStr;

var formatDateStr = function formatDateStr(pDate, pDateFormatArr, pL) {
  // Fix on issue #303 - getXMLTask is passing null as pDates
  if (!pDate) {
    return;
  }

  var vDateStr = '';
  var vYear2Str = pDate.getFullYear().toString().substring(2, 4);
  var vMonthStr = pDate.getMonth() + 1 + '';
  var vMonthArr = new Array(pL['january'], pL['february'], pL['march'], pL['april'], pL['maylong'], pL['june'], pL['july'], pL['august'], pL['september'], pL['october'], pL['november'], pL['december']);
  var vDayArr = new Array(pL['sunday'], pL['monday'], pL['tuesday'], pL['wednesday'], pL['thursday'], pL['friday'], pL['saturday']);
  var vMthArr = new Array(pL['jan'], pL['feb'], pL['mar'], pL['apr'], pL['may'], pL['jun'], pL['jul'], pL['aug'], pL['sep'], pL['oct'], pL['nov'], pL['dec']);
  var vDyArr = new Array(pL['sun'], pL['mon'], pL['tue'], pL['wed'], pL['thu'], pL['fri'], pL['sat']);

  for (var i = 0; i < pDateFormatArr.length; i++) {
    switch (pDateFormatArr[i]) {
      case 'dd':
        if (pDate.getDate() < 10) vDateStr += '0';
      // now fall through

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
        if (parseInt(vMonthStr, 10) < 10) vDateStr += '0';
      // now fall through

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
        vDateStr += pL['qtr'];
      // now fall through

      case 'q':
        vDateStr += Math.floor(pDate.getMonth() / 3) + 1;
        break;

      case 'hh':
        if ((pDate.getHours() % 12 == 0 ? 12 : pDate.getHours() % 12) < 10) vDateStr += '0';
      // now fall through

      case 'h':
        vDateStr += pDate.getHours() % 12 == 0 ? 12 : pDate.getHours() % 12;
        break;

      case 'HH':
        if (pDate.getHours() < 10) vDateStr += '0';
      // now fall through

      case 'H':
        vDateStr += pDate.getHours();
        break;

      case 'MI':
        if (pDate.getMinutes() < 10) vDateStr += '0';
      // now fall through

      case 'mi':
        vDateStr += pDate.getMinutes();
        break;

      case 'SS':
        if (pDate.getSeconds() < 10) vDateStr += '0';
      // now fall through

      case 'ss':
        vDateStr += pDate.getSeconds();
        break;

      case 'pm':
        vDateStr += pDate.getHours() < 12 ? 'am' : 'pm';
        break;

      case 'PM':
        vDateStr += pDate.getHours() < 12 ? 'AM' : 'PM';
        break;

      case 'ww':
        if (getIsoWeek(pDate) < 10) vDateStr += '0';
      // now fall through

      case 'w':
        vDateStr += getIsoWeek(pDate);
        break;

      case 'week':
        var vWeekNum = getIsoWeek(pDate);
        var vYear = pDate.getFullYear();
        var vDayOfWeek = pDate.getDay() == 0 ? 7 : pDate.getDay();
        if (vWeekNum >= 52 && parseInt(vMonthStr, 10) === 1) vYear--;
        if (vWeekNum == 1 && parseInt(vMonthStr, 10) === 12) vYear++;
        if (vWeekNum < 10) vWeekNum = parseInt('0' + vWeekNum, 10);
        vDateStr += vYear + '-W' + vWeekNum + '-' + vDayOfWeek;
        break;

      default:
        if (pL[pDateFormatArr[i].toLowerCase()]) vDateStr += pL[pDateFormatArr[i].toLowerCase()];else vDateStr += pDateFormatArr[i];
        break;
    }
  }

  return vDateStr;
};

exports.formatDateStr = formatDateStr;

var parseDateFormatStr = function parseDateFormatStr(pFormatStr) {
  var vComponantStr = '';
  var vCurrChar = '';
  var vSeparators = new RegExp('[\/\\ -.,\'":]');
  var vDateFormatArray = new Array();

  for (var i = 0; i < pFormatStr.length; i++) {
    vCurrChar = pFormatStr.charAt(i);

    if (vCurrChar.match(vSeparators) || i + 1 == pFormatStr.length) // separator or end of string
      {
        if (i + 1 == pFormatStr.length && !vCurrChar.match(vSeparators)) // at end of string add any non-separator chars to the current component
          {
            vComponantStr += vCurrChar;
          }

        vDateFormatArray.push(vComponantStr);
        if (vCurrChar.match(vSeparators)) vDateFormatArray.push(vCurrChar);
        vComponantStr = '';
      } else {
      vComponantStr += vCurrChar;
    }
  }

  return vDateFormatArray;
};
/**
 * We have to compare against the monday of the first week of the year containing 04 jan *not* 01/01
 * 60*60*24*1000=86400000
 * @param pDate
 */


exports.parseDateFormatStr = parseDateFormatStr;

var getIsoWeek = function getIsoWeek(pDate) {
  var dayMiliseconds = 86400000;
  var keyDay = new Date(pDate.getFullYear(), 0, 4, 0, 0, 0);
  var keyDayOfWeek = keyDay.getDay() == 0 ? 6 : keyDay.getDay() - 1; // define monday as 0

  var firstMondayYearTime = keyDay.getTime() - keyDayOfWeek * dayMiliseconds;
  var thisDate = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate(), 0, 0, 0); // This at 00:00:00

  var thisTime = thisDate.getTime();
  var daysFromFirstMonday = Math.round((thisTime - firstMondayYearTime) / dayMiliseconds);
  var lastWeek = 99;
  var thisWeek = 99;
  var firstMondayYear = new Date(firstMondayYearTime);
  thisWeek = Math.ceil((daysFromFirstMonday + 1) / 7);
  if (thisWeek <= 0) thisWeek = getIsoWeek(new Date(pDate.getFullYear() - 1, 11, 31, 0, 0, 0));else if (thisWeek == 53 && new Date(pDate.getFullYear(), 0, 1, 0, 0, 0).getDay() != 4 && new Date(pDate.getFullYear(), 11, 31, 0, 0, 0).getDay() != 4) thisWeek = 1;
  return thisWeek;
};

exports.getIsoWeek = getIsoWeek;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawSelector = exports.sLine = exports.CalcTaskXY = exports.getArrayLocationByID = exports.newNode = exports.makeInput = void 0;

var _events = require("../events");

var makeInput = function makeInput(formattedValue, editable) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'text';
  var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var choices = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

  if (!value) {
    value = formattedValue;
  }

  if (editable) {
    switch (type) {
      case 'date':
        // Take timezone into account before converting to ISO String
        value = value ? new Date(value.getTime() - value.getTimezoneOffset() * 60000).toISOString().split('T')[0] : '';
        return "<input class=\"gantt-inputtable\" type=\"date\" value=\"".concat(value, "\">");

      case 'resource':
        if (choices) {
          var found = choices.filter(function (c) {
            return c.id == value || c.name == value;
          });

          if (found && found.length > 0) {
            value = found[0].id;
          } else {
            choices.push({
              id: value,
              name: value
            });
          }

          return "<select>" + choices.map(function (c) {
            return "<option value=\"".concat(c.id, "\" ").concat(value == c.id ? 'selected' : '', " >").concat(c.name, "</option>");
          }).join('') + "</select>";
        } else {
          return "<input class=\"gantt-inputtable\" type=\"text\" value=\"".concat(value ? value : '', "\">");
        }

      case 'cost':
        return "<input class=\"gantt-inputtable\" type=\"number\" max=\"100\" min=\"0\" value=\"".concat(value ? value : '', "\">");

      default:
        return "<input class=\"gantt-inputtable\" value=\"".concat(value ? value : '', "\">");
    }
  } else {
    return formattedValue;
  }
};

exports.makeInput = makeInput;

var newNode = function newNode(pParent, pNodeType) {
  var pId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var pClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var pText = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
  var pWidth = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var pLeft = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  var pDisplay = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
  var pColspan = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : null;
  var pAttribs = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : null;
  var vNewNode = pParent.appendChild(document.createElement(pNodeType));

  if (pAttribs) {
    for (var i = 0; i + 1 < pAttribs.length; i += 2) {
      vNewNode.setAttribute(pAttribs[i], pAttribs[i + 1]);
    }
  }

  if (pId) vNewNode.id = pId; // I wish I could do this with setAttribute but older IEs don't play nice

  if (pClass) vNewNode.className = pClass;
  if (pWidth) vNewNode.style.width = isNaN(pWidth * 1) ? pWidth : pWidth + 'px';
  if (pLeft) vNewNode.style.left = isNaN(pLeft * 1) ? pLeft : pLeft + 'px';

  if (pText) {
    if (pText.indexOf && pText.indexOf('<') === -1) {
      vNewNode.appendChild(document.createTextNode(pText));
    } else {
      vNewNode.insertAdjacentHTML('beforeend', pText);
    }
  }

  if (pDisplay) vNewNode.style.display = pDisplay;
  if (pColspan) vNewNode.colSpan = pColspan;
  return vNewNode;
};

exports.newNode = newNode;

var getArrayLocationByID = function getArrayLocationByID(pId) {
  var vList = this.getList();

  for (var i = 0; i < vList.length; i++) {
    if (vList[i].getID() == pId) return i;
  }

  return -1;
};

exports.getArrayLocationByID = getArrayLocationByID;

var CalcTaskXY = function CalcTaskXY() {
  var vID;
  var vList = this.getList();
  var vBarDiv;
  var vTaskDiv;
  var vParDiv;
  var vLeft, vTop, vWidth;
  var vHeight = Math.floor(this.getRowHeight() / 2);

  for (var i = 0; i < vList.length; i++) {
    vID = vList[i].getID();
    vBarDiv = vList[i].getBarDiv();
    vTaskDiv = vList[i].getTaskDiv();

    if (vList[i].getParItem() && vList[i].getParItem().getGroup() == 2) {
      vParDiv = vList[i].getParItem().getChildRow();
    } else vParDiv = vList[i].getChildRow();

    if (vBarDiv) {
      vList[i].setStartX(vBarDiv.offsetLeft + 1);
      vList[i].setStartY(vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1);
      vList[i].setEndX(vBarDiv.offsetLeft + vBarDiv.offsetWidth + 1);
      vList[i].setEndY(vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1);
    }
  }
};

exports.CalcTaskXY = CalcTaskXY;

var sLine = function sLine(x1, y1, x2, y2, pClass) {
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
  if (vWid == 1) vTmpDiv.className = 'glinev';else vTmpDiv.className = 'glineh';
  if (pClass) vTmpDiv.className += ' ' + pClass;
  this.getLines().appendChild(vTmpDiv);

  if (this.vEvents.onLineDraw && typeof this.vEvents.onLineDraw === 'function') {
    this.vEvents.onLineDraw(vTmpDiv);
  }

  return vTmpDiv;
};

exports.sLine = sLine;

var drawSelector = function drawSelector(pPos) {
  var vOutput = document.createDocumentFragment();
  var vDisplay = false;

  for (var i = 0; i < this.vShowSelector.length && !vDisplay; i++) {
    if (this.vShowSelector[i].toLowerCase() == pPos.toLowerCase()) vDisplay = true;
  }

  if (vDisplay) {
    var vTmpDiv = newNode(vOutput, 'div', null, 'gselector', this.vLangs[this.vLang]['format'] + ':');
    if (this.vFormatArr.join().toLowerCase().indexOf('hour') != -1) (0, _events.addFormatListeners)(this, 'hour', newNode(vTmpDiv, 'span', this.vDivId + 'formathour' + pPos, 'gformlabel' + (this.vFormat == 'hour' ? ' gselected' : ''), this.vLangs[this.vLang]['hour']));
    if (this.vFormatArr.join().toLowerCase().indexOf('day') != -1) (0, _events.addFormatListeners)(this, 'day', newNode(vTmpDiv, 'span', this.vDivId + 'formatday' + pPos, 'gformlabel' + (this.vFormat == 'day' ? ' gselected' : ''), this.vLangs[this.vLang]['day']));
    if (this.vFormatArr.join().toLowerCase().indexOf('week') != -1) (0, _events.addFormatListeners)(this, 'week', newNode(vTmpDiv, 'span', this.vDivId + 'formatweek' + pPos, 'gformlabel' + (this.vFormat == 'week' ? ' gselected' : ''), this.vLangs[this.vLang]['week']));
    if (this.vFormatArr.join().toLowerCase().indexOf('month') != -1) (0, _events.addFormatListeners)(this, 'month', newNode(vTmpDiv, 'span', this.vDivId + 'formatmonth' + pPos, 'gformlabel' + (this.vFormat == 'month' ? ' gselected' : ''), this.vLangs[this.vLang]['month']));
    if (this.vFormatArr.join().toLowerCase().indexOf('quarter') != -1) (0, _events.addFormatListeners)(this, 'quarter', newNode(vTmpDiv, 'span', this.vDivId + 'formatquarter' + pPos, 'gformlabel' + (this.vFormat == 'quarter' ? ' gselected' : ''), this.vLangs[this.vLang]['quarter']));
  } else {
    newNode(vOutput, 'div', null, 'gselector');
  }

  return vOutput;
};

exports.drawSelector = drawSelector;

},{"../events":5}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isParentElementOrSelf = isParentElementOrSelf;
exports.calculateStartEndFromDepend = exports.makeRequestOldBrowsers = exports.makeRequest = exports.moveToolTip = exports.updateFlyingObj = exports.criticalPath = exports.hashKey = exports.hashString = exports.fadeToolTip = exports.hideToolTip = exports.isIE = exports.getOffset = exports.getScrollbarWidth = exports.getScrollPositions = exports.benchMark = exports.getZoomFactor = exports.delayedHide = exports.stripUnwanted = exports.stripIds = exports.changeFormat = exports.findObj = exports.internalPropertiesLang = exports.internalProperties = void 0;
var internalProperties = ['pID', 'pName', 'pStart', 'pEnd', 'pClass', 'pLink', 'pMile', 'pRes', 'pComp', 'pGroup', 'pParent', 'pOpen', 'pDepend', 'pCaption', 'pNotes', 'pGantt', 'pCost', 'pPlanStart', 'pPlanEnd'];
exports.internalProperties = internalProperties;
var internalPropertiesLang = {
  'pID': 'id',
  'pName': 'name',
  'pStart': 'startdate',
  'pEnd': 'enddate',
  'pLink': 'link',
  'pMile': 'mile',
  'pRes': 'resource',
  'pComp': 'comp',
  'pGroup': 'group',
  'pParent': 'parent',
  'pOpen': 'open',
  'pDepend': 'depend',
  'pCaption': 'caption',
  'pNotes': 'notes',
  'pCost': 'cost',
  'pPlanStart': 'planstartdate',
  'pPlanEnd': 'planenddate'
};
exports.internalPropertiesLang = internalPropertiesLang;

var findObj = function findObj(theObj) {
  var theDoc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var p, i, foundObj;
  if (!theDoc) theDoc = document;
  if (document.getElementById) foundObj = document.getElementById(theObj);
  return foundObj;
};

exports.findObj = findObj;

var changeFormat = function changeFormat(pFormat, ganttObj) {
  if (ganttObj) ganttObj.setFormat(pFormat);else alert('Chart undefined');
};

exports.changeFormat = changeFormat;

var stripIds = function stripIds(pNode) {
  for (var i = 0; i < pNode.childNodes.length; i++) {
    if ('removeAttribute' in pNode.childNodes[i]) pNode.childNodes[i].removeAttribute('id');
    if (pNode.childNodes[i].hasChildNodes()) stripIds(pNode.childNodes[i]);
  }
};

exports.stripIds = stripIds;

var stripUnwanted = function stripUnwanted(pNode) {
  var vAllowedTags = new Array('#text', 'p', 'br', 'ul', 'ol', 'li', 'div', 'span', 'img');

  for (var i = 0; i < pNode.childNodes.length; i++) {
    /* versions of IE<9 don't support indexOf on arrays so add trailing comma to the joined array and lookup value to stop substring matches */
    if ((vAllowedTags.join().toLowerCase() + ',').indexOf(pNode.childNodes[i].nodeName.toLowerCase() + ',') == -1) {
      pNode.replaceChild(document.createTextNode(pNode.childNodes[i].outerHTML), pNode.childNodes[i]);
    }

    if (pNode.childNodes[i].hasChildNodes()) stripUnwanted(pNode.childNodes[i]);
  }
};

exports.stripUnwanted = stripUnwanted;

var delayedHide = function delayedHide(pGanttChartObj, pTool, pTimer) {
  var vDelay = pGanttChartObj.getTooltipDelay() || 1500;
  if (pTool) pTool.delayTimeout = setTimeout(function () {
    hideToolTip(pGanttChartObj, pTool, pTimer);
  }, vDelay);
};

exports.delayedHide = delayedHide;

var getZoomFactor = function getZoomFactor() {
  var vFactor = 1;

  if (document.body.getBoundingClientRect) {
    // rect is only in physical pixel size in IE before version 8
    var vRect = document.body.getBoundingClientRect();
    var vPhysicalW = vRect.right - vRect.left;
    var vLogicalW = document.body.offsetWidth; // the zoom level is always an integer percent value

    vFactor = Math.round(vPhysicalW / vLogicalW * 100) / 100;
  }

  return vFactor;
};

exports.getZoomFactor = getZoomFactor;

var benchMark = function benchMark(pItem) {
  var vEndTime = new Date().getTime();
  alert(pItem + ': Elapsed time: ' + (vEndTime - this.vBenchTime) / 1000 + ' seconds.');
  this.vBenchTime = new Date().getTime();
};

exports.benchMark = benchMark;

var getScrollPositions = function getScrollPositions() {
  var vScrollLeft = window.pageXOffset;
  var vScrollTop = window.pageYOffset;

  if (!('pageXOffset' in window)) // Internet Explorer before version 9
    {
      var vZoomFactor = getZoomFactor();
      vScrollLeft = Math.round(document.documentElement.scrollLeft / vZoomFactor);
      vScrollTop = Math.round(document.documentElement.scrollTop / vZoomFactor);
    }

  return {
    x: vScrollLeft,
    y: vScrollTop
  };
};

exports.getScrollPositions = getScrollPositions;
var scrollbarWidth = undefined;

var getScrollbarWidth = function getScrollbarWidth() {
  if (scrollbarWidth) return scrollbarWidth;
  var outer = document.createElement('div');
  outer.className = 'gscrollbar-calculation-container';
  document.body.appendChild(outer); // Creating inner element and placing it in the container

  var inner = document.createElement('div');
  outer.appendChild(inner); // Calculating difference between container's full width and the child width

  scrollbarWidth = outer.offsetWidth - inner.offsetWidth; // Removing temporary elements from the DOM

  outer.parentNode.removeChild(outer);
  return scrollbarWidth;
};

exports.getScrollbarWidth = getScrollbarWidth;

var getOffset = function getOffset(pStartDate, pEndDate, pColWidth, pFormat, pShowWeekends) {
  var DAY_CELL_MARGIN_WIDTH = 3; // Cell margin for 'day' format

  var WEEK_CELL_MARGIN_WIDTH = 3; // Cell margin for 'week' format

  var MONTH_CELL_MARGIN_WIDTH = 3; // Cell margin for 'month' format

  var QUARTER_CELL_MARGIN_WIDTH = 3; // Cell margin for 'quarter' format

  var HOUR_CELL_MARGIN_WIDTH = 3; // Cell margin for 'hour' format

  var vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  var curTaskStart = new Date(pStartDate.getTime());
  var curTaskEnd = new Date(pEndDate.getTime());
  var vTaskRightPx = 0;
  var tmpTaskStart = Date.UTC(curTaskStart.getFullYear(), curTaskStart.getMonth(), curTaskStart.getDate(), curTaskStart.getHours(), 0, 0);
  var tmpTaskEnd = Date.UTC(curTaskEnd.getFullYear(), curTaskEnd.getMonth(), curTaskEnd.getDate(), curTaskEnd.getHours(), 0, 0);
  var oneHour = 3600000;
  var vTaskRight = (tmpTaskEnd - tmpTaskStart) / oneHour; // Length of task in hours

  var vPosTmpDate;

  if (pFormat == 'day') {
    if (!pShowWeekends) {
      var start = curTaskStart;
      var end = curTaskEnd;
      var countWeekends = 0;

      while (start < end) {
        var day = start.getDay();

        if (day === 6 || day == 0) {
          countWeekends++;
        }

        start = new Date(start.getTime() + 24 * oneHour);
      }

      vTaskRight -= countWeekends * 24;
    }

    vTaskRightPx = Math.ceil(vTaskRight / 24 * (pColWidth + DAY_CELL_MARGIN_WIDTH) - 1);
  } else if (pFormat == 'week') {
    vTaskRightPx = Math.ceil(vTaskRight / (24 * 7) * (pColWidth + WEEK_CELL_MARGIN_WIDTH) - 1);
  } else if (pFormat == 'month') {
    var vMonthsDiff = 12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear()) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
    vPosTmpDate = new Date(curTaskEnd.getTime());
    vPosTmpDate.setDate(curTaskStart.getDate());
    var vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / 86400000;
    vTaskRightPx = Math.ceil(vMonthsDiff * (pColWidth + MONTH_CELL_MARGIN_WIDTH) + vDaysCrctn * (pColWidth / vMonthDaysArr[curTaskEnd.getMonth()]) - 1);
  } else if (pFormat == 'quarter') {
    var _vMonthsDiff = 12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear()) + (curTaskEnd.getMonth() - curTaskStart.getMonth());

    vPosTmpDate = new Date(curTaskEnd.getTime());
    vPosTmpDate.setDate(curTaskStart.getDate());

    var _vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / 86400000;

    vTaskRightPx = Math.ceil(_vMonthsDiff * ((pColWidth + QUARTER_CELL_MARGIN_WIDTH) / 3) + _vDaysCrctn * (pColWidth / 90) - 1);
  } else if (pFormat == 'hour') {
    // can't just calculate sum because of daylight savings changes
    vPosTmpDate = new Date(curTaskEnd.getTime());
    vPosTmpDate.setMinutes(curTaskStart.getMinutes(), 0);
    var vMinsCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / 3600000;
    vTaskRightPx = Math.ceil(vTaskRight * (pColWidth + HOUR_CELL_MARGIN_WIDTH) + vMinsCrctn * pColWidth);
  }

  return vTaskRightPx;
};

exports.getOffset = getOffset;

var isIE = function isIE() {
  if (typeof document.all != 'undefined') {
    if ('pageXOffset' in window) return false; // give IE9 and above the benefit of the doubt!
    else return true;
  } else return false;
};

exports.isIE = isIE;

var hideToolTip = function hideToolTip(pGanttChartObj, pTool, pTimer) {
  if (pGanttChartObj.getUseFade()) {
    clearInterval(pTool.fadeInterval);
    pTool.fadeInterval = setInterval(function () {
      fadeToolTip(-1, pTool, 0);
    }, pTimer);
  } else {
    pTool.style.opacity = 0;
    pTool.style.filter = 'alpha(opacity=0)';
    pTool.style.visibility = 'hidden';
    pTool.vToolCont.setAttribute("showing", null);
  }
};

exports.hideToolTip = hideToolTip;

var fadeToolTip = function fadeToolTip(pDirection, pTool, pMaxAlpha) {
  var vIncrement = parseInt(pTool.getAttribute('fadeIncrement'));
  var vAlpha = pTool.getAttribute('currentOpacity');
  var vCurAlpha = parseInt(vAlpha);

  if (vCurAlpha != pMaxAlpha && pDirection == 1 || vCurAlpha != 0 && pDirection == -1) {
    var i = vIncrement;

    if (pMaxAlpha - vCurAlpha < vIncrement && pDirection == 1) {
      i = pMaxAlpha - vCurAlpha;
    } else if (vAlpha < vIncrement && pDirection == -1) {
      i = vCurAlpha;
    }

    vAlpha = vCurAlpha + i * pDirection;
    pTool.style.opacity = vAlpha * 0.01;
    pTool.style.filter = 'alpha(opacity=' + vAlpha + ')';
    pTool.setAttribute('currentOpacity', vAlpha);
  } else {
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

var hashString = function hashString(key) {
  if (!key) {
    key = 'default';
  }

  key += '';
  var hash = 5381;

  for (var i = 0; i < key.length; i++) {
    if (key.charCodeAt) {
      // tslint:disable-next-line:no-bitwise
      hash = (hash << 5) + hash + key.charCodeAt(i);
    } // tslint:disable-next-line:no-bitwise


    hash = hash & hash;
  } // tslint:disable-next-line:no-bitwise


  return hash >>> 0;
};

exports.hashString = hashString;

var hashKey = function hashKey(key) {
  return hashString(key);
};

exports.hashKey = hashKey;

var criticalPath = function criticalPath(tasks) {
  var path = {}; // calculate duration

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
  var finalNodes = {
    0: path[0]
  };
  var node = path[0];

  while (node) {
    if (node.childrens.length > 0) {
      (function () {
        var found = node.childrens[0];
        var max = found.duration;
        node.childrens.forEach(function (c) {
          if (c.duration > max) {
            found = c;
            max = c.duration;
          }
        });
        finalNodes[found.pID] = found;
        node = found;
      })();
    } else {
      node = null;
    }
  }
};

exports.criticalPath = criticalPath;

function isParentElementOrSelf(child, parent) {
  while (child) {
    if (child === parent) return true;
    child = child.parentElement;
  }
}

var updateFlyingObj = function updateFlyingObj(e, pGanttChartObj, pTimer) {
  var vCurTopBuf = 3;
  var vCurLeftBuf = 5;
  var vCurBotBuf = 3;
  var vCurRightBuf = 15;
  var vMouseX = e ? e.clientX : window.event.clientX;
  var vMouseY = e ? e.clientY : window.event.clientY;
  var vViewportX = document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
  var vViewportY = document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  var vNewX = vMouseX;
  var vNewY = vMouseY;

  if (navigator.appName.toLowerCase() == 'microsoft internet explorer') {
    // the clientX and clientY properties include the left and top borders of the client area
    vMouseX -= document.documentElement.clientLeft;
    vMouseY -= document.documentElement.clientTop;
    var vZoomFactor = getZoomFactor();

    if (vZoomFactor != 1) {
      // IE 7 at non-default zoom level
      vMouseX = Math.round(vMouseX / vZoomFactor);
      vMouseY = Math.round(vMouseY / vZoomFactor);
    }
  }

  var vScrollPos = getScrollPositions();
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
    if (vMouseX + vCurRightBuf + pGanttChartObj.vTool.offsetWidth > vViewportX) vNewX = vScrollPos.x;else vNewX = vMouseX + vScrollPos.x + vCurRightBuf;
  } else vNewX = vMouseX + vScrollPos.x - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth;
  /* Code for positioned below the mouse by default */


  if (vMouseY + vCurBotBuf + pGanttChartObj.vTool.offsetHeight > vViewportY) {
    if (vMouseY - vCurTopBuf - pGanttChartObj.vTool.offsetHeight < 0) vNewY = vScrollPos.y;else vNewY = vMouseY + vScrollPos.y - vCurTopBuf - pGanttChartObj.vTool.offsetHeight;
  } else vNewY = vMouseY + vScrollPos.y + vCurBotBuf;
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
    pGanttChartObj.vTool.moveInterval = setInterval(function () {
      moveToolTip(vNewX, vNewY, pGanttChartObj.vTool, pTimer);
    }, pTimer);
  } else {
    pGanttChartObj.vTool.style.left = vNewX + 'px';
    pGanttChartObj.vTool.style.top = vNewY + 'px';
  }
};

exports.updateFlyingObj = updateFlyingObj;

var moveToolTip = function moveToolTip(pNewX, pNewY, pTool, timer) {
  var vSpeed = parseInt(pTool.getAttribute('moveSpeed'));
  var vOldX = parseInt(pTool.style.left);
  var vOldY = parseInt(pTool.style.top);

  if (pTool.style.visibility != 'visible') {
    pTool.style.left = pNewX + 'px';
    pTool.style.top = pNewY + 'px';
    clearInterval(pTool.moveInterval);
  } else {
    if (pNewX != vOldX && pNewY != vOldY) {
      vOldX += Math.ceil((pNewX - vOldX) / vSpeed);
      vOldY += Math.ceil((pNewY - vOldY) / vSpeed);
      pTool.style.left = vOldX + 'px';
      pTool.style.top = vOldY + 'px';
    } else {
      clearInterval(pTool.moveInterval);
    }
  }
};

exports.moveToolTip = moveToolTip;

var makeRequest = function makeRequest(pFile) {
  var json = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var vDebug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (window.fetch) {
    var f = fetch(pFile);

    if (json) {
      return f.then(function (res) {
        return res.json();
      });
    } else {
      return f;
    }
  } else {
    return makeRequestOldBrowsers(pFile, vDebug).then(function (xhttp) {
      if (json) {
        var jsonObj = JSON.parse(xhttp.response);
        return jsonObj;
      } else {
        var xmlDoc = xhttp.responseXML;
        return xmlDoc;
      }
    });
  }
};

exports.makeRequest = makeRequest;

var makeRequestOldBrowsers = function makeRequestOldBrowsers(pFile) {
  var vDebug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return new Promise(function (resolve, reject) {
    var bd;

    if (vDebug) {
      bd = new Date();
      console.info('before jsonparse', bd);
    }

    var xhttp;

    if (window.XMLHttpRequest) {
      xhttp = new XMLHttpRequest();
    } else {
      // IE 5/6
      xhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
    }

    xhttp.open('GET', pFile, true);
    xhttp.send(null);

    xhttp.onload = function (e) {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {// resolve(xhttp.responseText);
        } else {
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

var calculateStartEndFromDepend = function calculateStartEndFromDepend(tasksList) {};

exports.calculateStartEndFromDepend = calculateStartEndFromDepend;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getXMLTask = exports.getXMLProject = exports.AddXMLTask = exports.getXMLNodeValue = exports.findXMLNode = exports.parseXMLString = exports.parseXML = void 0;

var _task = require("./task");

var _date_utils = require("./utils/date_utils");

var _draw_utils = require("./utils/draw_utils");

var _general_utils = require("./utils/general_utils");

var parseXML = function parseXML(pFile, pGanttVar) {
  return (0, _general_utils.makeRequest)(pFile, false, false).then(function (xmlDoc) {
    AddXMLTask(pGanttVar, xmlDoc);
  });
};

exports.parseXML = parseXML;

var parseXMLString = function parseXMLString(pStr, pGanttVar) {
  var xmlDoc;

  if (typeof window.DOMParser != 'undefined') {
    xmlDoc = new window.DOMParser().parseFromString(pStr, 'text/xml');
  } else if (typeof window.ActiveXObject != 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
    xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = 'false';
    xmlDoc.loadXML(pStr);
  }

  AddXMLTask(pGanttVar, xmlDoc);
};

exports.parseXMLString = parseXMLString;

var findXMLNode = function findXMLNode(pRoot, pNodeName) {
  var vRetValue;

  try {
    vRetValue = pRoot.getElementsByTagName(pNodeName);
  } catch (error) {
    ;
  } // do nothing, we'll return undefined


  return vRetValue;
}; // pType can be 1=numeric, 2=String, all other values just return raw data


exports.findXMLNode = findXMLNode;

var getXMLNodeValue = function getXMLNodeValue(pRoot, pNodeName, pType, pDefault) {
  var vRetValue;

  try {
    vRetValue = pRoot.getElementsByTagName(pNodeName)[0].childNodes[0].nodeValue;
  } catch (error) {
    if (typeof pDefault != 'undefined') vRetValue = pDefault;
  }

  if (typeof vRetValue != 'undefined' && vRetValue != null) {
    if (pType == 1) vRetValue *= 1;else if (pType == 2) vRetValue = vRetValue.toString();
  }

  return vRetValue;
};

exports.getXMLNodeValue = getXMLNodeValue;

var AddXMLTask = function AddXMLTask(pGanttVar, pXmlDoc) {
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
  var projNode = findXMLNode(pXmlDoc, 'Project');

  if (typeof projNode != 'undefined' && projNode.length > 0) {
    project = projNode[0].getAttribute('xmlns');
  }

  if (project == 'http://schemas.microsoft.com/project') {
    pGanttVar.setDateInputFormat('yyyy-mm-dd');
    Task = findXMLNode(pXmlDoc, 'Task');
    if (typeof Task == 'undefined') n = 0;else n = Task.length;
    var resources = findXMLNode(pXmlDoc, 'Resource');

    if (typeof resources == 'undefined') {
      n = 0;
      m = 0;
    } else m = resources.length;

    for (i = 0; i < m; i++) {
      var resname = getXMLNodeValue(resources[i], 'Name', 2, '');
      var uid = getXMLNodeValue(resources[i], 'UID', 1, -1);
      if (resname.length > 0 && uid > 0) res[uid] = resname;
    }

    var assignments = findXMLNode(pXmlDoc, 'Assignment');
    if (typeof assignments == 'undefined') j = 0;else j = assignments.length;

    for (i = 0; i < j; i++) {
      var _uid = void 0;

      var resUID = getXMLNodeValue(assignments[i], 'ResourceUID', 1, -1);
      _uid = getXMLNodeValue(assignments[i], 'TaskUID', 1, -1);

      if (_uid > 0) {
        if (resUID > 0) assRes[_uid] = res[resUID];
        ass[_uid] = assignments[i];
      }
    } // Store information about parent UIDs in an easily searchable form


    for (i = 0; i < n; i++) {
      var _uid2 = void 0;

      _uid2 = getXMLNodeValue(Task[i], 'UID', 1, 0);
      var vOutlineNumber = void 0;
      if (_uid2 != 0) vOutlineNumber = getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
      if (_uid2 > 0) pars[vOutlineNumber] = _uid2;
      if (_uid2 > maxPID) maxPID = _uid2;
    }

    for (i = 0; i < n; i++) {
      // optional parameters may not have an entry
      // Task ID must NOT be zero otherwise it will be skipped
      var pID = getXMLNodeValue(Task[i], 'UID', 1, 0);

      if (pID != 0) {
        var pName = getXMLNodeValue(Task[i], 'Name', 2, 'No Task Name');
        var pStart = getXMLNodeValue(Task[i], 'Start', 2, '');
        var pEnd = getXMLNodeValue(Task[i], 'Finish', 2, '');
        var pPlanStart = getXMLNodeValue(Task[i], 'PlanStart', 2, '');
        var pPlanEnd = getXMLNodeValue(Task[i], 'PlanFinish', 2, '');
        var pDuration = getXMLNodeValue(Task[i], 'Duration', 2, '');
        var pLink = getXMLNodeValue(Task[i], 'HyperlinkAddress', 2, '');
        var pMile = getXMLNodeValue(Task[i], 'Milestone', 1, 0);
        var pComp = getXMLNodeValue(Task[i], 'PercentWorkComplete', 1, 0);
        var pCost = getXMLNodeValue(Task[i], 'Cost', 2, 0);
        var pGroup = getXMLNodeValue(Task[i], 'Summary', 1, 0);
        var pParent = 0;
        var vOutlineLevel = getXMLNodeValue(Task[i], 'OutlineLevel', 1, 0);

        var _vOutlineNumber = void 0;

        if (vOutlineLevel > 1) {
          _vOutlineNumber = getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
          pParent = pars[_vOutlineNumber.substr(0, _vOutlineNumber.lastIndexOf('.'))];
        }

        var pNotes = void 0;

        try {
          pNotes = Task[i].getElementsByTagName('Notes')[0].childNodes[1].nodeValue; //this should be a CDATA node
        } catch (error) {
          pNotes = '';
        }

        var pRes = void 0;
        if (typeof assRes[pID] != 'undefined') pRes = assRes[pID];else pRes = '';
        var predecessors = findXMLNode(Task[i], 'PredecessorLink');
        if (typeof predecessors == 'undefined') j = 0;else j = predecessors.length;
        var pDepend = '';

        for (k = 0; k < j; k++) {
          var depUID = getXMLNodeValue(predecessors[k], 'PredecessorUID', 1, -1);
          var depType = getXMLNodeValue(predecessors[k], 'Type', 1, 1);

          if (depUID > 0) {
            if (pDepend.length > 0) pDepend += ',';

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
        if (pGroup > 0) pClass = 'ggroupblack';else if (pMile > 0) pClass = 'gmilestone';else pClass = 'gtaskblue'; // check for split tasks

        var splits = findXMLNode(ass[pID], 'TimephasedData');
        if (typeof splits == 'undefined') j = 0;else j = splits.length;
        var vSplitStart = pStart;
        var vSplitEnd = pEnd;
        var vSubCreated = false;
        var vDepend = pDepend.replace(/,*[0-9]+[FS]F/g, '');

        for (k = 0; k < j; k++) {
          var vDuration = getXMLNodeValue(splits[k], 'Value', 2, '0'); //remove all text

          vDuration = '0' + vDuration.replace(/\D/g, '');
          vDuration *= 1;

          if (vDuration == 0 && !vSubCreated || k + 1 == j && pGroup == 2) {
            // No time booked in the given period (or last entry)
            // Make sure the parent task is set as a combined group
            pGroup = 2; // Handle last loop

            if (k + 1 == j) vDepend = pDepend.replace(/,*[0-9]+[FS]S/g, ''); // Now create a subtask

            maxPID++;
            vSplitEnd = getXMLNodeValue(splits[k], k + 1 == j ? 'Finish' : 'Start', 2, '');
            pGanttVar.AddTaskItem(new _task.TaskItem(maxPID, pName, vSplitStart, vSplitEnd, 'gtaskblue', pLink, pMile, pRes, pComp, 0, pID, pOpen, vDepend, pCaption, pNotes, pGanttVar, pCost, pPlanStart, pPlanEnd, pDuration));
            vSubCreated = true;
            vDepend = '';
          } else if (vDuration != 0 && vSubCreated) {
            vSplitStart = getXMLNodeValue(splits[k], 'Start', 2, '');
            vSubCreated = false;
          }
        }

        if (vSubCreated) pDepend = ''; // Finally add the task

        pGanttVar.AddTaskItem(new _task.TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar, pCost, pPlanStart, pPlanEnd, pDuration));
      }
    }
  } else {
    Task = pXmlDoc.getElementsByTagName('task');
    n = Task.length;

    for (i = 0; i < n; i++) {
      // optional parameters may not have an entry
      // Task ID must NOT be zero otherwise it will be skipped
      var _pID = getXMLNodeValue(Task[i], 'pID', 1, 0);

      if (_pID != 0) {
        var _pName = getXMLNodeValue(Task[i], 'pName', 2, 'No Task Name');

        var _pStart = getXMLNodeValue(Task[i], 'pStart', 2, '');

        var _pEnd = getXMLNodeValue(Task[i], 'pEnd', 2, '');

        var _pPlanStart = getXMLNodeValue(Task[i], 'pPlanStart', 2, '');

        var _pPlanEnd = getXMLNodeValue(Task[i], 'pPlanEnd', 2, '');

        var _pDuration = getXMLNodeValue(Task[i], 'pDuration', 2, '');

        var _pLink = getXMLNodeValue(Task[i], 'pLink', 2, '');

        var _pMile = getXMLNodeValue(Task[i], 'pMile', 1, 0);

        var _pComp = getXMLNodeValue(Task[i], 'pComp', 1, 0);

        var _pCost = getXMLNodeValue(Task[i], 'pCost', 2, 0);

        var _pGroup = getXMLNodeValue(Task[i], 'pGroup', 1, 0);

        var _pParent = getXMLNodeValue(Task[i], 'pParent', 1, 0);

        var _pRes = getXMLNodeValue(Task[i], 'pRes', 2, '');

        var _pOpen = getXMLNodeValue(Task[i], 'pOpen', 1, 1);

        var _pDepend = getXMLNodeValue(Task[i], 'pDepend', 2, '');

        var _pCaption = getXMLNodeValue(Task[i], 'pCaption', 2, '');

        var _pNotes = getXMLNodeValue(Task[i], 'pNotes', 2, '');

        var _pClass = getXMLNodeValue(Task[i], 'pClass', 2, '');

        if (typeof _pClass == 'undefined') {
          if (_pGroup > 0) _pClass = 'ggroupblack';else if (_pMile > 0) _pClass = 'gmilestone';else _pClass = 'gtaskblue';
        } // Finally add the task


        pGanttVar.AddTaskItem(new _task.TaskItem(_pID, _pName, _pStart, _pEnd, _pClass, _pLink, _pMile, _pRes, _pComp, _pGroup, _pParent, _pOpen, _pDepend, _pCaption, _pNotes, pGanttVar, _pCost, _pPlanStart, _pPlanEnd, _pDuration));
      }
    }
  }
};

exports.AddXMLTask = AddXMLTask;

var getXMLProject = function getXMLProject() {
  var vProject = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';

  for (var i = 0; i < this.vTaskList.length; i++) {
    vProject += this.getXMLTask(i, true);
  }

  vProject += '</project>';
  return vProject;
};

exports.getXMLProject = getXMLProject;

var getXMLTask = function getXMLTask(pID, pIdx) {
  var i = 0;
  var vIdx = -1;
  var vTask = '';
  var vOutFrmt = (0, _date_utils.parseDateFormatStr)(this.getDateInputFormat() + ' HH:MI:SS');
  if (pIdx === true) vIdx = pID;else {
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
    vTask += '<pStart>' + (0, _date_utils.formatDateStr)(this.vTaskList[vIdx].getStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pStart>';
    vTask += '<pEnd>' + (0, _date_utils.formatDateStr)(this.vTaskList[vIdx].getEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pEnd>';
    vTask += '<pPlanStart>' + (0, _date_utils.formatDateStr)(this.vTaskList[vIdx].getPlanStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pPlanStart>';
    vTask += '<pPlanEnd>' + (0, _date_utils.formatDateStr)(this.vTaskList[vIdx].getPlanEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pPlanEnd>';
    vTask += '<pDuration>' + this.vTaskList[vIdx].getDuration() + '</pDuration>';
    vTask += '<pClass>' + this.vTaskList[vIdx].getClass() + '</pClass>';
    vTask += '<pLink>' + this.vTaskList[vIdx].getLink() + '</pLink>';
    vTask += '<pMile>' + this.vTaskList[vIdx].getMile() + '</pMile>';
    if (this.vTaskList[vIdx].getResource() != "\xA0") vTask += '<pRes>' + this.vTaskList[vIdx].getResource() + '</pRes>';
    vTask += '<pComp>' + this.vTaskList[vIdx].getCompVal() + '</pComp>';
    vTask += '<pCost>' + this.vTaskList[vIdx].getCost() + '</pCost>';
    vTask += '<pGroup>' + this.vTaskList[vIdx].getGroup() + '</pGroup>';
    vTask += '<pParent>' + this.vTaskList[vIdx].getParent() + '</pParent>';
    vTask += '<pOpen>' + this.vTaskList[vIdx].getOpen() + '</pOpen>';
    vTask += '<pDepend>';
    var vDepList = this.vTaskList[vIdx].getDepend();

    for (i = 0; i < vDepList.length; i++) {
      if (i > 0) vTask += ',';
      if (vDepList[i] > 0) vTask += vDepList[i] + this.vTaskList[vIdx].getDepType()[i];
    }

    vTask += '</pDepend>';
    vTask += '<pCaption>' + this.vTaskList[vIdx].getCaption() + '</pCaption>';
    var vTmpFrag = document.createDocumentFragment();
    var vTmpDiv = (0, _draw_utils.newNode)(vTmpFrag, 'div', null, null, this.vTaskList[vIdx].getNotes().innerHTML);
    vTask += '<pNotes>' + vTmpDiv.innerHTML + '</pNotes>';
    vTask += '</task>';
  }

  return vTask;
};

exports.getXMLTask = getXMLTask;

},{"./task":10,"./utils/date_utils":11,"./utils/draw_utils":12,"./utils/general_utils":13}]},{},[1])(1)
});
