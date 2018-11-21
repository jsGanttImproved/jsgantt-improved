import * as lang from './lang';
import { mouseOver, mouseOut, addThisRowListeners, addTooltipListeners, addScrollListeners, addFormatListeners, moveToolTip, addFolderListeners } from "./events";
import {
  parseDateFormatStr, formatDateStr, getOffset, parseDateStr, getZoomFactor,
  getScrollPositions, getMaxDate, getMinDate
} from './utils';
import { createTaskInfo, AddTaskItem, AddTaskItemObject, RemoveTaskItem, processRows } from './task';
import { includeGetSet } from './options';
import { getXMLProject, getXMLTask } from './xml';




// function that loads the main gantt chart properties and functions
// pDiv: (required) this is a div object created in HTML
// pFormat: (required) - used to indicate whether chart should be drawn in "hour", "day", "week", "month", or "quarter" format
export const GanttChart = function (pDiv, pFormat) {
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
  this.vShowDeps = 1;
  this.vShowSelector = new Array('top');
  this.vDateInputFormat = 'yyyy-mm-dd';
  this.vDateTaskTableDisplayFormat = parseDateFormatStr('dd/mm/yyyy');
  this.vDateTaskDisplayFormat = parseDateFormatStr('dd month yyyy');
  this.vHourMajorDateDisplayFormat = parseDateFormatStr('day dd month yyyy');
  this.vHourMinorDateDisplayFormat = parseDateFormatStr('HH');
  this.vDayMajorDateDisplayFormat = parseDateFormatStr('dd/mm/yyyy');
  this.vDayMinorDateDisplayFormat = parseDateFormatStr('dd');
  this.vWeekMajorDateDisplayFormat = parseDateFormatStr('yyyy');
  this.vWeekMinorDateDisplayFormat = parseDateFormatStr('dd/mm');
  this.vMonthMajorDateDisplayFormat = parseDateFormatStr('yyyy');
  this.vMonthMinorDateDisplayFormat = parseDateFormatStr('mon');
  this.vQuarterMajorDateDisplayFormat = parseDateFormatStr('yyyy');
  this.vQuarterMinorDateDisplayFormat = parseDateFormatStr('qq');
  this.vUseFullYear = parseDateFormatStr('dd/mm/yyyy');
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
  this.includeGetSet = includeGetSet.bind(this);
  this.includeGetSet();

  this.mouseOver = mouseOver;
  this.mouseOut = mouseOut;

  this.createTaskInfo = createTaskInfo;
  this.AddTaskItem = AddTaskItem;
  this.AddTaskItemObject = AddTaskItemObject;
  this.RemoveTaskItem = RemoveTaskItem;

  this.getXMLProject = getXMLProject;
  this.getXMLTask = getXMLTask;

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
      else vParDiv = vList[i].getChildRow();

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
    while (parent.hasChildNodes()) parent.removeChild(parent.firstChild);
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

    if (vWid == 1) vTmpDiv.className = 'glinev';
    else vTmpDiv.className = 'glineh';

    if (pClass) vTmpDiv.className += ' ' + pClass;

    this.getLines().appendChild(vTmpDiv);

    return vTmpDiv;
  };

  this.drawDependency = function (x1, y1, x2, y2, pType, pClass) {
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
        if (x1 < x2) vShort *= -1;
        else vShort = x2 - x1 - (2 * vShort);
        break;
      case 'FF':
        if (x1 <= x2) vShort = x2 - x1 + (2 * vShort);
        vDir = -1;
        break;
      default:
        if (x1 + 10 >= x2 && y1 != y2) vBend = true;
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
    else this.sLine(x1, y1, x2 - (1 * vDir), y2, pClass);

    var vTmpDiv = this.sLine(x2, y2, x2 - 3 - ((vDir < 0) ? 1 : 0), y2 - 3 - ((vDir < 0) ? 1 : 0), pClass + "Arw");
    vTmpDiv.style.width = '0px';
    vTmpDiv.style.height = '0px';
  };

  this.DrawDependencies = function () {
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
                if (vDependType[k] == 'SS') this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'SS', 'gDepSS');
                else if (vDependType[k] == 'FF') this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getEndX(), vList[i].getEndY(), 'FF', 'gDepFF');
                else if (vDependType[k] == 'SF') this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getEndX(), vList[i].getEndY(), 'SF', 'gDepSF');
                else if (vDependType[k] == 'FS') this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'FS', 'gDepFS');
              }
            }
          }
        }
      }
    }
    // draw the current date line
    if (this.vTodayPx >= 0) this.sLine(this.vTodayPx, 0, this.vTodayPx, this.getChartTable().offsetHeight - 1, 'gCurDate');
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
    // I wish I could do this with setAttribute but older IEs don't play nice
    if (pId) vNewNode.id = pId;
    if (pClass) vNewNode.className = pClass;
    if (pWidth) vNewNode.style.width = (isNaN(pWidth * 1)) ? pWidth : pWidth + 'px';
    if (pLeft) vNewNode.style.left = (isNaN(pLeft * 1)) ? pLeft : pLeft + 'px';
    if (pText) vNewNode.appendChild(document.createTextNode(pText));
    if (pDisplay) vNewNode.style.display = pDisplay;
    if (pColspan) vNewNode.colSpan = pColspan;
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
    var vTaskPlanWidth = 1;

    var vNumCols = 0;
    var vNumRows = 0;
    var vSingleCell = false;
    var vID = 0;
    // var vMainTable = '';
    var vDateRow = null;
    // var vFirstCellItemRowStr = '';
    // var vItemRowStr = '';
    var vColWidth = 0;
    // var vColUnit = 0;
    // var vChild;
    // var vGroup;
    // var vTaskDiv;
    // var vParDiv;

    if (this.vTaskList.length > 0) {
      // Process all tasks, reset parent date and completion % if task list has altered
      if (this.vProcessNeeded) processRows(this.vTaskList, 0, -1, 1, 1, this.getUseSort());
      this.vProcessNeeded = false;

      // get overall min/max dates plus padding
      vMinDate = getMinDate(this.vTaskList, this.vFormat);
      vMaxDate = getMaxDate(this.vTaskList, this.vFormat);

      // Calculate chart width variables.
      if (this.vFormat == 'day') vColWidth = this.vDayColWidth;
      else if (this.vFormat == 'week') vColWidth = this.vWeekColWidth;
      else if (this.vFormat == 'month') vColWidth = this.vMonthColWidth;
      else if (this.vFormat == 'quarter') vColWidth = this.vQuarterColWidth;
      else if (this.vFormat == 'hour') vColWidth = this.vHourColWidth;

      // DRAW the Left-side of the chart (names, resources, comp%)
      var vLeftHeader = document.createDocumentFragment();

      var vTmpDiv = this.newNode(vLeftHeader, 'div', this.vDivId + 'glisthead', 'glistlbl gcontainercol');
      var vTmpTab = this.newNode(vTmpDiv, 'table', null, 'gtasktableh');
      var vTmpTBody = this.newNode(vTmpTab, 'tbody');
      var vTmpRow = this.newNode(vTmpTBody, 'tr');
      this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
      var vTmpCell = this.newNode(vTmpRow, 'td', null, 'gspanning gtaskname');
      vTmpCell.appendChild(this.drawSelector('top'));
      if (this.vShowRes == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
      if (this.vShowDur == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');
      if (this.vShowComp == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
      if (this.vShowStartDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
      if (this.vShowEndDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');
      if (this.vShowPlanStartDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
      if (this.vShowPlanEndDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gplanenddate', '\u00A0');
      if (this.vShowCost == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gcost', '\u00A0');

      vTmpRow = this.newNode(vTmpTBody, 'tr');
      this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
      this.newNode(vTmpRow, 'td', null, 'gtaskname', '\u00A0');
      if (this.vShowRes == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading gresource', this.vLangs[this.vLang]['resource']);
      if (this.vShowDur == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading gduration', this.vLangs[this.vLang]['duration']);
      if (this.vShowComp == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading gpccomplete', this.vLangs[this.vLang]['comp']);
      if (this.vShowStartDate == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading gstartdate', this.vLangs[this.vLang]['startdate']);
      if (this.vShowEndDate == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading genddate', this.vLangs[this.vLang]['enddate']);
      if (this.vShowPlanStartDate == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading gplanstartdate', this.vLangs[this.vLang]['planstartdate']);
      if (this.vShowPlanEndDate == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading gplanenddate', this.vLangs[this.vLang]['planenddate']);
      if (this.vShowCost == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading gcost', this.vLangs[this.vLang]['cost']);

      var vLeftTable = document.createDocumentFragment();
      var vTmpDiv2 = this.newNode(vLeftTable, 'div', this.vDivId + 'glistbody', 'glistgrid gcontainercol');
      this.setListBody(vTmpDiv2);
      vTmpTab = this.newNode(vTmpDiv2, 'table', null, 'gtasktable');
      vTmpTBody = this.newNode(vTmpTab, 'tbody');

      for (i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getGroup() == 1) var vBGColor = 'ggroupitem';
        else vBGColor = 'glineitem';

        vID = this.vTaskList[i].getID();

        if ((!(this.vTaskList[i].getParItem() && this.vTaskList[i].getParItem().getGroup() == 2)) || this.vTaskList[i].getGroup() == 2) {
          if (this.vTaskList[i].getVisible() == 0) vTmpRow = this.newNode(vTmpTBody, 'tr', this.vDivId + 'child_' + vID, 'gname ' + vBGColor, null, null, null, 'none');
          else vTmpRow = this.newNode(vTmpTBody, 'tr', this.vDivId + 'child_' + vID, 'gname ' + vBGColor);
          this.vTaskList[i].setListChildRow(vTmpRow);
          this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
          vTmpCell = this.newNode(vTmpRow, 'td', null, 'gtaskname');

          var vCellContents = '';
          for (j = 1; j < this.vTaskList[i].getLevel(); j++) {
            vCellContents += '\u00A0\u00A0\u00A0\u00A0';
          }

          if (this.vTaskList[i].getGroup() == 1) {
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, vCellContents);
            var vTmpSpan = this.newNode(vTmpDiv, 'span', this.vDivId + 'group_' + vID, 'gfoldercollapse', (this.vTaskList[i].getOpen() == 1) ? '-' : '+');
            this.vTaskList[i].setGroupSpan(vTmpSpan);
            addFolderListeners(this, vTmpSpan, vID);
            vTmpDiv.appendChild(document.createTextNode('\u00A0' + this.vTaskList[i].getName()));
          }
          else {
            vCellContents += '\u00A0\u00A0\u00A0\u00A0';
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, vCellContents + this.vTaskList[i].getName());
          }

          if (this.vShowRes == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gresource');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, this.vTaskList[i].getResource());
          }
          if (this.vShowDur == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gduration');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, this.vTaskList[i].getDuration(this.vFormat, this.vLangs[this.vLang]));
          }
          if (this.vShowComp == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gpccomplete');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, this.vTaskList[i].getCompStr());
          }
          if (this.vShowStartDate == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gstartdate');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, formatDateStr(this.vTaskList[i].getStart(), this.vDateTaskTableDisplayFormat, this.vLangs[this.vLang]));
          }
          if (this.vShowEndDate == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'genddate');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, formatDateStr(this.vTaskList[i].getEnd(), this.vDateTaskTableDisplayFormat, this.vLangs[this.vLang]));
          }
          if (this.vShowPlanStartDate == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gplanstartdate');
            const v = this.vTaskList[i].getPlanStart() ? formatDateStr(this.vTaskList[i].getPlanStart(), this.vDateTaskTableDisplayFormat, this.vLangs[this.vLang]) : '';
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, v);
          }
          if (this.vShowPlanEndDate == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gplanenddate');
            const v = this.vTaskList[i].getPlanEnd() ? formatDateStr(this.vTaskList[i].getPlanEnd(), this.vDateTaskTableDisplayFormat, this.vLangs[this.vLang]) : '';
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, v);
          }
          if (this.vShowCost == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gcost');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, this.vTaskList[i].getCost());
          }
          vNumRows++;
        }
      }

      // DRAW the date format selector at bottom left.
      vTmpRow = this.newNode(vTmpTBody, 'tr');
      this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
      vTmpCell = this.newNode(vTmpRow, 'td', null, 'gspanning gtaskname');
      vTmpCell.appendChild(this.drawSelector('bottom'));
      if (this.vShowRes == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
      if (this.vShowDur == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');
      if (this.vShowComp == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
      if (this.vShowStartDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
      if (this.vShowEndDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');
      if (this.vShowPlanStartDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gplanstartdate', '\u00A0');
      if (this.vShowPlanEndDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gplanenddate', '\u00A0');
      // Add some white space so the vertical scroll distance should always be greater
      // than for the right pane (keep to a minimum as it is seen in unconstrained height designs)
      this.newNode(vTmpDiv2, 'br');
      this.newNode(vTmpDiv2, 'br');

      // Draw the Chart Rows
      var vRightHeader = document.createDocumentFragment();
      vTmpDiv = this.newNode(vRightHeader, 'div', this.vDivId + 'gcharthead', 'gchartlbl gcontainercol');
      this.setChartHead(vTmpDiv);
      vTmpTab = this.newNode(vTmpDiv, 'table', this.vDivId + 'chartTableh', 'gcharttableh');
      vTmpTBody = this.newNode(vTmpTab, 'tbody');
      vTmpRow = this.newNode(vTmpTBody, 'tr');

      vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
      if (this.vFormat == 'hour') vTmpDate.setHours(vMinDate.getHours());
      else vTmpDate.setHours(0);
      vTmpDate.setMinutes(0);
      vTmpDate.setSeconds(0);
      vTmpDate.setMilliseconds(0);

      var vColSpan = 1;
      // Major Date Header
      while (vTmpDate.getTime() <= vMaxDate.getTime()) {
        var vHeaderCellClass = 'gmajorheading';
        vCellContents = '';

        if (this.vFormat == 'day') {
          vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, 7);
          vCellContents += formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
          vTmpDate.setDate(vTmpDate.getDate() + 6);

          if (this.vShowEndWeekDate == 1) vCellContents += ' - ' + formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);

          this.newNode(vTmpCell, 'div', null, null, vCellContents, vColWidth * 7);
          vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
        else if (this.vFormat == 'week') {
          vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, vColWidth);
          this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vWeekMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
          vTmpDate.setDate(vTmpDate.getDate() + 7);
        }
        else if (this.vFormat == 'month') {
          vColSpan = (12 - vTmpDate.getMonth());
          if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= (11 - vMaxDate.getMonth());
          vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
          this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vMonthMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
          vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
        }
        else if (this.vFormat == 'quarter') {
          vColSpan = (4 - Math.floor(vTmpDate.getMonth() / 3));
          if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= (3 - Math.floor(vMaxDate.getMonth() / 3));
          vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
          this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vQuarterMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
          vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
        }
        else if (this.vFormat == 'hour') {
          vColSpan = (24 - vTmpDate.getHours());
          if (vTmpDate.getFullYear() == vMaxDate.getFullYear() &&
            vTmpDate.getMonth() == vMaxDate.getMonth() &&
            vTmpDate.getDate() == vMaxDate.getDate()) vColSpan -= (23 - vMaxDate.getHours());
          vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
          this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vHourMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
          vTmpDate.setHours(0);
          vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
      }

      vTmpRow = this.newNode(vTmpTBody, 'tr');

      // Minor Date header and Cell Rows
      vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate()); // , vMinDate.getHours()
      if (this.vFormat == 'hour') vTmpDate.setHours(vMinDate.getHours());
      vNumCols = 0;

      while (vTmpDate.getTime() <= vMaxDate.getTime()) {
        vHeaderCellClass = 'gminorheading';
        var vCellClass = 'gtaskcell';

        if (this.vFormat == 'day') {
          if (vTmpDate.getDay() % 6 == 0) {
            vHeaderCellClass += 'wkend';
            vCellClass += 'wkend';
          }

          if (vTmpDate <= vMaxDate) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
            this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vDayMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
            vNumCols++;
          }

          vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
        else if (this.vFormat == 'week') {
          if (vTmpDate <= vMaxDate) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
            this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vWeekMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
            vNumCols++;
          }

          vTmpDate.setDate(vTmpDate.getDate() + 7);
        }
        else if (this.vFormat == 'month') {
          if (vTmpDate <= vMaxDate) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
            this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vMonthMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
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
            this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vQuarterMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
            vNumCols++;
          }

          vTmpDate.setDate(vTmpDate.getDate() + 81);

          while (vTmpDate.getDate() > 1) vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
        else if (this.vFormat == 'hour') {
          for (i = vTmpDate.getHours(); i < 24; i++) {
            vTmpDate.setHours(i);//works around daylight savings but may look a little odd on days where the clock goes forward
            if (vTmpDate <= vMaxDate) {
              vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
              this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, this.vHourMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
              vNumCols++;
            }
          }
          vTmpDate.setHours(0);
          vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
      }
      vDateRow = vTmpRow;

      vTaskLeftPx = (vNumCols * (vColWidth + 1)) + 1;
      vTaskPlanLeftPx = (vNumCols * (vColWidth + 1)) + 1;

      if (this.vUseSingleCell != 0 && this.vUseSingleCell < (vNumCols * vNumRows)) vSingleCell = true;

      this.newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);

      vTmpDiv = this.newNode(vRightHeader, 'div', null, 'glabelfooter');

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
      for (i = 0; i < this.vTaskList.length; i++) {
        var curTaskStart = this.vTaskList[i].getStart();
        var curTaskEnd = this.vTaskList[i].getEnd();
        if ((curTaskEnd.getTime() - (curTaskEnd.getTimezoneOffset() * 60000)) % (86400000) == 0) curTaskEnd = new Date(curTaskEnd.getFullYear(), curTaskEnd.getMonth(), curTaskEnd.getDate() + 1, curTaskEnd.getHours(), curTaskEnd.getMinutes(), curTaskEnd.getSeconds()); // add 1 day here to simplify calculations below



        vTaskLeftPx = getOffset(vMinDate, curTaskStart, vColWidth, this.vFormat);
        vTaskRightPx = getOffset(curTaskStart, curTaskEnd, vColWidth, this.vFormat);

        let curTaskPlanStart, curTaskPlanEnd;

        curTaskPlanStart = this.vTaskList[i].getPlanStart();
        curTaskPlanEnd = this.vTaskList[i].getPlanEnd();

        if (curTaskPlanStart && curTaskPlanEnd) {
          if ((curTaskPlanEnd.getTime() - (curTaskPlanEnd.getTimezoneOffset() * 60000)) % (86400000) == 0) curTaskPlanEnd = new Date(curTaskPlanEnd.getFullYear(), curTaskPlanEnd.getMonth(), curTaskPlanEnd.getDate() + 1, curTaskPlanEnd.getHours(), curTaskPlanEnd.getMinutes(), curTaskPlanEnd.getSeconds()); // add 1 day here to simplify calculations below

          vTaskPlanLeftPx = getOffset(vMinDate, curTaskPlanStart, vColWidth, this.vFormat);
          vTaskPlanRightPx = getOffset(curTaskPlanStart, curTaskPlanEnd, vColWidth, this.vFormat);
        }else {
          vTaskPlanLeftPx = vTaskPlanRightPx = 0;
        }


        vID = this.vTaskList[i].getID();
        var vComb = (this.vTaskList[i].getParItem() && this.vTaskList[i].getParItem().getGroup() == 2);
        var vCellFormat = '';

        var vTmpItem = this.vTaskList[i];
        var vCaptionStr = '';
        var vCaptClass = null;
        if (this.vTaskList[i].getMile() && !vComb) {
          vTmpRow = this.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'gmileitem gmile' + this.vFormat, null, null, null, ((this.vTaskList[i].getVisible() == 0) ? 'none' : null));
          this.vTaskList[i].setChildRow(vTmpRow);
          addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);
          vTmpCell = this.newNode(vTmpRow, 'td', null, 'gtaskcell');
          vTmpDiv = this.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
          vTmpDiv = this.newNode(vTmpDiv, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, 12, vTaskLeftPx - 6);
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
              if (this.vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5))) vCellFormat = 'gtaskcellwkend';
              else vCellFormat = 'gtaskcell';
              this.newNode(vTmpRow, 'td', null, vCellFormat, '\u00A0\u00A0');
            }
          }
        }
        else {
          vTaskWidth = vTaskRightPx;

          // Draw Group Bar which has outer div with inner group div and several small divs to left and right to create angled-end indicators
          if (this.vTaskList[i].getGroup()) {
            vTaskWidth = (vTaskWidth > this.vMinGpLen && vTaskWidth < this.vMinGpLen * 2) ? this.vMinGpLen * 2 : vTaskWidth; // Expand to show two end points
            vTaskWidth = (vTaskWidth < this.vMinGpLen) ? this.vMinGpLen : vTaskWidth; // expand to show one end point

            vTmpRow = this.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, ((this.vTaskList[i].getGroup() == 2) ? 'glineitem gitem' : 'ggroupitem ggroup') + this.vFormat, null, null, null, ((this.vTaskList[i].getVisible() == 0) ? 'none' : null));
            this.vTaskList[i].setChildRow(vTmpRow);
            addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);
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
              if (vTaskWidth >= this.vMinGpLen * 2) this.newNode(vTmpDiv, 'div', null, this.vTaskList[i].getClass() + 'endpointright');

              vCaptClass = 'ggroupcaption';
            }

            if (!vSingleCell && !vComb) {
              vCellFormat = '';
              for (j = 0; j < vNumCols - 1; j++) {
                if (this.vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5))) vCellFormat = 'gtaskcellwkend';
                else vCellFormat = 'gtaskcell';
                this.newNode(vTmpRow, 'td', null, vCellFormat, '\u00A0\u00A0');
              }
            }
          }
          else {
            vTaskWidth = (vTaskWidth <= 0) ? 1 : vTaskWidth;


            /**
             * DRAW THE BOXES FOR GANTT
             */
            let vTmpDivCell;
            if (vComb) {
              vTmpDivCell = vTmpDiv = this.vTaskList[i].getParItem().getCellDiv();
            }
            else {
              // Draw Task Bar which has colored bar div
              vTmpRow = this.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'glineitem gitem' + this.vFormat, null, null, null, ((this.vTaskList[i].getVisible() == 0) ? 'none' : null));
              this.vTaskList[i].setChildRow(vTmpRow);
              addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);
              vTmpCell = this.newNode(vTmpRow, 'td', null, 'gtaskcell');
              vTmpDivCell = vTmpDiv = this.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
            }

            // draw the lines for dependecies
            vTmpDiv = this.newNode(vTmpDiv, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, vTaskLeftPx);
            this.vTaskList[i].setBarDiv(vTmpDiv);
            vTmpDiv2 = this.newNode(vTmpDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass(), null, vTaskWidth);
            this.vTaskList[i].setTaskDiv(vTmpDiv2);

            // PLANNED
            if (vTaskPlanLeftPx) { // vTaskPlanRightPx vTaskPlanLeftPx
              const vTmpPlanDiv = this.newNode(vTmpDivCell, 'div', this.vDivId + 'bardiv_' + vID, 'gtaskbarcontainer gplan', null, vTaskPlanRightPx, vTaskPlanLeftPx);
              const vTmpDiv3 = this.newNode(vTmpPlanDiv, 'div', this.vDivId + 'taskbar_' + vID, this.vTaskList[i].getClass() + ' gplan', null, vTaskPlanRightPx);
            }


            // and opaque completion div
            this.newNode(vTmpDiv2, 'div', this.vDivId + 'complete_' + vID, this.vTaskList[i].getClass() + 'complete', null, this.vTaskList[i].getCompStr());

            // caption
            if (vComb) vTmpItem = this.vTaskList[i].getParItem();
            if (!vComb || (vComb && this.vTaskList[i].getParItem().getEnd() == this.vTaskList[i].getEnd())) vCaptClass = 'gcaption';

            // Background cells
            if (!vSingleCell && !vComb) {
              vCellFormat = '';
              for (j = 0; j < vNumCols - 1; j++) {
                if (this.vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5))) vCellFormat = 'gtaskcellwkend';
                else vCellFormat = 'gtaskcell';
                this.newNode(vTmpRow, 'td', null, vCellFormat, '\u00A0\u00A0');
              }
            }
          }
        }

        if (this.getCaptionType() && vCaptClass !== null) {
          let vCaptionStr: any;
          switch (this.getCaptionType()) {
            case 'Caption': vCaptionStr = vTmpItem.getCaption(); break;
            case 'Resource': vCaptionStr = vTmpItem.getResource(); break;
            case 'Duration': vCaptionStr = vTmpItem.getDuration(this.vFormat, this.vLangs[this.vLang]); break;
            case 'Complete': vCaptionStr = vTmpItem.getCompStr(); break;
          }
          this.newNode(vTmpDiv, 'div', null, vCaptClass, vCaptionStr, 120, (vCaptClass == 'gmilecaption') ? 12 : 0);
        }

        // Add Task Info div for tooltip
        if (this.vTaskList[i].getTaskDiv() && vTmpDiv) {
          vTmpDiv2 = this.newNode(vTmpDiv, 'div', this.vDivId + 'tt' + vID, null, null, null, null, 'none');
          vTmpDiv2.appendChild(this.createTaskInfo(this.vTaskList[i]));
          addTooltipListeners(this, this.vTaskList[i].getTaskDiv(), vTmpDiv2);
        }
      }

      if (!vSingleCell) vTmpTBody.appendChild(vDateRow.cloneNode(true));

      while (this.vDiv.hasChildNodes()) this.vDiv.removeChild(this.vDiv.firstChild);
      vTmpDiv = this.newNode(this.vDiv, 'div', null, 'gchartcontainer');
      vTmpDiv.appendChild(vLeftHeader);
      vTmpDiv.appendChild(vRightHeader);
      vTmpDiv.appendChild(vLeftTable);
      vTmpDiv.appendChild(vRightTable);
      this.newNode(vTmpDiv, 'div', null, 'ggridfooter');
      vTmpDiv2 = this.newNode(this.getChartBody(), 'div', this.vDivId + 'Lines', 'glinediv');
      vTmpDiv2.style.visibility = 'hidden';
      this.setLines(vTmpDiv2);

      /* Quick hack to show the generated HTML on older browsers - add a '/' to the begining of this line to activate
            var tmpGenSrc=document.createElement('textarea');
            tmpGenSrc.appendChild(document.createTextNode(vTmpDiv.innerHTML));
            vDiv.appendChild(tmpGenSrc);
      //*/
      // Now all the content exists, register scroll listeners
      addScrollListeners(this);

      // now check if we are actually scrolling the pane
      if (this.vScrollTo != '') {
        var vScrollDate = new Date(vMinDate.getTime());
        var vScrollPx = 0;

        if (this.vScrollTo.substr(0, 2) == 'px') {
          vScrollPx = parseInt(this.vScrollTo.substr(2));
        }
        else {
          vScrollDate = parseDateStr(this.vScrollTo, this.getDateInputFormat());
          if (this.vFormat == 'hour') vScrollDate.setMinutes(0, 0, 0);
          else vScrollDate.setHours(0, 0, 0, 0);
          vScrollPx = getOffset(vMinDate, vScrollDate, vColWidth, this.vFormat);
        }
        this.getChartBody().scrollLeft = vScrollPx;
      }

      if (vMinDate.getTime() <= (new Date()).getTime() && vMaxDate.getTime() >= (new Date()).getTime()) this.vTodayPx = getOffset(vMinDate, new Date(), vColWidth, this.vFormat);
      else this.vTodayPx = -1;
      this.DrawDependencies();
    }
  }; //this.draw



  this.drawSelector = function (pPos) {
    var vOutput = document.createDocumentFragment();
    var vDisplay = false;

    for (var i = 0; i < this.vShowSelector.length && !vDisplay; i++) {
      if (this.vShowSelector[i].toLowerCase() == pPos.toLowerCase()) vDisplay = true;
    }

    if (vDisplay) {
      var vTmpDiv = this.newNode(vOutput, 'div', null, 'gselector', this.vLangs[this.vLang]['format'] + ':');

      if (this.vFormatArr.join().toLowerCase().indexOf('hour') != -1)
        addFormatListeners(this, 'hour', this.newNode(vTmpDiv, 'span', this.vDivId + 'formathour' + pPos, 'gformlabel' + ((this.vFormat == 'hour') ? ' gselected' : ''), this.vLangs[this.vLang]['hour']));

      if (this.vFormatArr.join().toLowerCase().indexOf('day') != -1)
        addFormatListeners(this, 'day', this.newNode(vTmpDiv, 'span', this.vDivId + 'formatday' + pPos, 'gformlabel' + ((this.vFormat == 'day') ? ' gselected' : ''), this.vLangs[this.vLang]['day']));

      if (this.vFormatArr.join().toLowerCase().indexOf('week') != -1)
        addFormatListeners(this, 'week', this.newNode(vTmpDiv, 'span', this.vDivId + 'formatweek' + pPos, 'gformlabel' + ((this.vFormat == 'week') ? ' gselected' : ''), this.vLangs[this.vLang]['week']));

      if (this.vFormatArr.join().toLowerCase().indexOf('month') != -1)
        addFormatListeners(this, 'month', this.newNode(vTmpDiv, 'span', this.vDivId + 'formatmonth' + pPos, 'gformlabel' + ((this.vFormat == 'month') ? ' gselected' : ''), this.vLangs[this.vLang]['month']));

      if (this.vFormatArr.join().toLowerCase().indexOf('quarter') != -1)
        addFormatListeners(this, 'quarter', this.newNode(vTmpDiv, 'span', this.vDivId + 'formatquarter' + pPos, 'gformlabel' + ((this.vFormat == 'quarter') ? ' gselected' : ''), this.vLangs[this.vLang]['quarter']));
    }
    else {
      this.newNode(vOutput, 'div', null, 'gselector');
    }
    return vOutput;
  };


  if (this.vDiv && this.vDiv.nodeName.toLowerCase() == 'div') this.vDivId = this.vDiv.id;
}; //GanttChart


export const updateFlyingObj = function (e, pGanttChartObj, pTimer) {
  var vCurTopBuf = 3;
  var vCurLeftBuf = 5;
  var vCurBotBuf = 3;
  var vCurRightBuf = 15;
  var vMouseX = (e) ? e.clientX : (<MouseEvent>window.event).clientX;
  var vMouseY = (e) ? e.clientY : (<MouseEvent>window.event).clientY;
  var vViewportX = document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
  var vViewportY = document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  var vNewX = vMouseX;
  var vNewY = vMouseY;

  if (navigator.appName.toLowerCase() == 'microsoft internet explorer') {
    // the clientX and clientY properties include the left and top borders of the client area
    vMouseX -= document.documentElement.clientLeft;
    vMouseY -= document.documentElement.clientTop;

    var vZoomFactor = getZoomFactor();
    if (vZoomFactor != 1) {// IE 7 at non-default zoom level
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
    if (vMouseX + vCurRightBuf + pGanttChartObj.vTool.offsetWidth > vViewportX) vNewX = vScrollPos.x;
    else vNewX = vMouseX + vScrollPos.x + vCurRightBuf;
  }
  else vNewX = vMouseX + vScrollPos.x - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth;

  /* Code for positioned below the mouse by default */
  if (vMouseY + vCurBotBuf + pGanttChartObj.vTool.offsetHeight > vViewportY) {
    if (vMouseY - vCurTopBuf - pGanttChartObj.vTool.offsetHeight < 0) vNewY = vScrollPos.y;
    else vNewY = vMouseY + vScrollPos.y - vCurTopBuf - pGanttChartObj.vTool.offsetHeight;
  }
  else vNewY = vMouseY + vScrollPos.y + vCurBotBuf;

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
    pGanttChartObj.vTool.moveInterval = setInterval(function () { moveToolTip(vNewX, vNewY, pGanttChartObj.vTool, pTimer); }, pTimer);
  }
  else {
    pGanttChartObj.vTool.style.left = vNewX + 'px';
    pGanttChartObj.vTool.style.top = vNewY + 'px';
  }
};
