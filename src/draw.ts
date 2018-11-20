import * as lang from './lang';
import { mouseOver, mouseOut, addThisRowListeners, addTooltipListeners, addScrollListeners, addFormatListeners, moveToolTip, addFolderListeners } from "./events";
import {
  parseDateFormatStr, formatDateStr, getOffset, parseDateStr, getZoomFactor,
  getScrollPositions, getMaxDate, getMinDate
} from './utils';
import { sortTasks, TaskItemObject } from './task';

// Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
export const processRows = function (pList, pID, pRow, pLevel, pOpen, pUseSort) {
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
    if (i >= 0 && pList[i].getID() == pID) vCurItem = pList[i];
  }

  for (i = 0; i < pList.length; i++) {
    if (pList[i].getParent() == pID) {
      vVisible = pOpen;
      pList[i].setParItem(vCurItem);
      pList[i].setVisible(vVisible);
      if (vVisible == 1 && pList[i].getOpen() == 0) vVisible = 0;

      if (pList[i].getMile() && pList[i].getParItem() && pList[i].getParItem().getGroup() == 2) {//remove milestones owned by combined groups
        pList.splice(i, 1);
        i--;
        continue;
      }

      pList[i].setLevel(vLevel);

      if (pList[i].getGroup()) {
        if (pList[i].getParItem() && pList[i].getParItem().getGroup() == 2) pList[i].setGroup(2);
        processRows(vList, pList[i].getID(), i, vLevel + 1, vVisible, 0);
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
    sortTasks(pList, 0, 0);
    pList.sort(function (a, b) { return a.getSortIdx() - b.getSortIdx(); });
  }
  if (pID == 0 && pUseSort != 1) // Need to sort combined tasks regardless
  {
    for (i = 0; i < pList.length; i++) {
      if (pList[i].getGroup() == 2) {
        vComb = true;
        sortTasks(pList, pList[i].getID(), pList[i].getSortIdx() + 1);
      }
    }
    if (vComb == true) pList.sort(function (a, b) { return a.getSortIdx() - b.getSortIdx(); });
  }
};



// function that loads the main gantt chart properties and functions
// pDiv: (required) this is a div object created in HTML
// pFormat: (required) - used to indicate whether chart should be drawn in "hour", "day", "week", "month", or "quarter" format
export const GanttChart = function (pDiv, pFormat) {
  var vDiv = pDiv;
  var vFormat = pFormat;
  var vDivId = null;
  var vUseFade = 1;
  var vUseMove = 1;
  var vUseRowHlt = 1;
  var vUseToolTip = 1;
  var vUseSort = 1;
  var vUseSingleCell = 25000;
  var vShowRes = 1;
  var vShowDur = 1;
  var vShowComp = 1;
  var vShowStartDate = 1;
  var vShowEndDate = 1;
  var vShowEndWeekDate = 1;
  var vShowTaskInfoRes = 1;
  var vShowTaskInfoDur = 1;
  var vShowTaskInfoComp = 1;
  var vShowTaskInfoStartDate = 1;
  var vShowTaskInfoEndDate = 1;
  var vShowTaskInfoNotes = 1;
  var vShowTaskInfoLink = 0;
  var vShowDeps = 1;
  var vShowSelector = new Array('top');
  var vDateInputFormat = 'yyyy-mm-dd';
  var vDateTaskTableDisplayFormat = parseDateFormatStr('dd/mm/yyyy');
  var vDateTaskDisplayFormat = parseDateFormatStr('dd month yyyy');
  var vHourMajorDateDisplayFormat = parseDateFormatStr('day dd month yyyy');
  var vHourMinorDateDisplayFormat = parseDateFormatStr('HH');
  var vDayMajorDateDisplayFormat = parseDateFormatStr('dd/mm/yyyy');
  var vDayMinorDateDisplayFormat = parseDateFormatStr('dd');
  var vWeekMajorDateDisplayFormat = parseDateFormatStr('yyyy');
  var vWeekMinorDateDisplayFormat = parseDateFormatStr('dd/mm');
  var vMonthMajorDateDisplayFormat = parseDateFormatStr('yyyy');
  var vMonthMinorDateDisplayFormat = parseDateFormatStr('mon');
  var vQuarterMajorDateDisplayFormat = parseDateFormatStr('yyyy');
  var vQuarterMinorDateDisplayFormat = parseDateFormatStr('qq');
  var vUseFullYear = parseDateFormatStr('dd/mm/yyyy');
  var vCaptionType;
  var vDepId = 1;
  var vTaskList = new Array();
  var vFormatArr = new Array('hour', 'day', 'week', 'month', 'quarter');
  var vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  var vProcessNeeded = true;
  var vMinGpLen = 8;
  var vScrollTo = '';
  var vHourColWidth = 18;
  var vDayColWidth = 18;
  var vWeekColWidth = 36;
  var vMonthColWidth = 36;
  var vQuarterColWidth = 18;
  var vRowHeight = 20;
  var vTodayPx = -1;
  var vLangs = lang;
  var vLang = navigator.language && navigator.language in lang ? navigator.language : 'en';
  var vChartBody = null;
  var vChartHead = null;
  var vListBody = null;
  var vChartTable = null;
  var vLines = null;
  var vTimer = 20;
  var vTooltipDelay = 1500;

  this.setUseFade = function (pVal) { vUseFade = pVal; };
  this.setUseMove = function (pVal) { vUseMove = pVal; };
  this.setUseRowHlt = function (pVal) { vUseRowHlt = pVal; };
  this.setUseToolTip = function (pVal) { vUseToolTip = pVal; };
  this.setUseSort = function (pVal) { vUseSort = pVal; };
  this.setUseSingleCell = function (pVal) { vUseSingleCell = pVal * 1; };
  this.setFormatArr = function () {
    var vValidFormats = 'hour day week month quarter';
    vFormatArr = new Array();
    for (var i = 0, j = 0; i < arguments.length; i++) {
      if (vValidFormats.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
        vFormatArr[j++] = arguments[i].toLowerCase();
        var vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
        vValidFormats = vValidFormats.replace(vRegExp, '');
      }
    }
  };
  this.setShowRes = function (pVal) { vShowRes = pVal; };
  this.setShowDur = function (pVal) { vShowDur = pVal; };
  this.setShowComp = function (pVal) { vShowComp = pVal; };
  this.setShowStartDate = function (pVal) { vShowStartDate = pVal; };
  this.setShowEndDate = function (pVal) { vShowEndDate = pVal; };
  this.setShowTaskInfoRes = function (pVal) { vShowTaskInfoRes = pVal; };
  this.setShowTaskInfoDur = function (pVal) { vShowTaskInfoDur = pVal; };
  this.setShowTaskInfoComp = function (pVal) { vShowTaskInfoComp = pVal; };
  this.setShowTaskInfoStartDate = function (pVal) { vShowTaskInfoStartDate = pVal; };
  this.setShowTaskInfoEndDate = function (pVal) { vShowTaskInfoEndDate = pVal; };
  this.setShowTaskInfoNotes = function (pVal) { vShowTaskInfoNotes = pVal; };
  this.setShowTaskInfoLink = function (pVal) { vShowTaskInfoLink = pVal; };
  this.setShowEndWeekDate = function (pVal) { vShowEndWeekDate = pVal; };
  this.setShowSelector = function () {
    var vValidSelectors = 'top bottom';
    vShowSelector = new Array();
    for (var i = 0, j = 0; i < arguments.length; i++) {
      if (vValidSelectors.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
        vShowSelector[j++] = arguments[i].toLowerCase();
        var vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
        vValidSelectors = vValidSelectors.replace(vRegExp, '');
      }
    }
  };
  this.setShowDeps = function (pVal) { vShowDeps = pVal; };
  this.setDateInputFormat = function (pVal) { vDateInputFormat = pVal; };
  this.setDateTaskTableDisplayFormat = function (pVal) { vDateTaskTableDisplayFormat = parseDateFormatStr(pVal); };
  this.setDateTaskDisplayFormat = function (pVal) { vDateTaskDisplayFormat = parseDateFormatStr(pVal); };
  this.setHourMajorDateDisplayFormat = function (pVal) { vHourMajorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setHourMinorDateDisplayFormat = function (pVal) { vHourMinorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setDayMajorDateDisplayFormat = function (pVal) { vDayMajorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setDayMinorDateDisplayFormat = function (pVal) { vDayMinorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setWeekMajorDateDisplayFormat = function (pVal) { vWeekMajorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setWeekMinorDateDisplayFormat = function (pVal) { vWeekMinorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setMonthMajorDateDisplayFormat = function (pVal) { vMonthMajorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setMonthMinorDateDisplayFormat = function (pVal) { vMonthMinorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setQuarterMajorDateDisplayFormat = function (pVal) { vQuarterMajorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setQuarterMinorDateDisplayFormat = function (pVal) { vQuarterMinorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setCaptionType = function (pType) { vCaptionType = pType; };
  this.setFormat = function (pFormat) {
    vFormat = pFormat;
    this.Draw();
  };
  this.setMinGpLen = function (pMinGpLen) { vMinGpLen = pMinGpLen; };
  this.setScrollTo = function (pDate) { vScrollTo = pDate; };
  this.setHourColWidth = function (pWidth) { vHourColWidth = pWidth; };
  this.setDayColWidth = function (pWidth) { vDayColWidth = pWidth; };
  this.setWeekColWidth = function (pWidth) { vWeekColWidth = pWidth; };
  this.setMonthColWidth = function (pWidth) { vMonthColWidth = pWidth; };
  this.setQuarterColWidth = function (pWidth) { vQuarterColWidth = pWidth; };
  this.setRowHeight = function (pHeight) { vRowHeight = pHeight; };
  this.setLang = function (pLang) { if (vLangs[pLang]) vLang = pLang; };
  this.setChartBody = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) vChartBody = pDiv; };
  this.setChartHead = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) vChartHead = pDiv; };
  this.setListBody = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) vListBody = pDiv; };
  this.setChartTable = function (pTable) { if (typeof HTMLTableElement !== 'function' || pTable instanceof HTMLTableElement) vChartTable = pTable; };
  this.setLines = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) vLines = pDiv; };
  this.setTimer = function (pVal) { vTimer = pVal * 1; };
  this.setTooltipDelay = function (pVal) { vTooltipDelay = pVal * 1; };
  this.addLang = function (pLang, pVals) {
    if (!vLangs[pLang]) {
      vLangs[pLang] = new Object();
      for (var vKey in vLangs['en']) vLangs[pLang][vKey] = (pVals[vKey]) ? document.createTextNode(pVals[vKey]).data : vLangs['en'][vKey];
    }
  };

  this.getDivId = function () { return vDivId; };
  this.getUseFade = function () { return vUseFade; };
  this.getUseMove = function () { return vUseMove; };
  this.getUseRowHlt = function () { return vUseRowHlt; };
  this.getUseToolTip = function () { return vUseToolTip; };
  this.getUseSort = function () { return vUseSort; };
  this.getUseSingleCell = function () { return vUseSingleCell; };
  this.getFormatArr = function () { return vFormatArr; };
  this.getShowRes = function () { return vShowRes; };
  this.getShowDur = function () { return vShowDur; };
  this.getShowComp = function () { return vShowComp; };
  this.getShowStartDate = function () { return vShowStartDate; };
  this.getShowEndDate = function () { return vShowEndDate; };
  this.getShowTaskInfoRes = function () { return vShowTaskInfoRes; };
  this.getShowTaskInfoDur = function () { return vShowTaskInfoDur; };
  this.getShowTaskInfoComp = function () { return vShowTaskInfoComp; };
  this.getShowTaskInfoStartDate = function () { return vShowTaskInfoStartDate; };
  this.getShowTaskInfoEndDate = function () { return vShowTaskInfoEndDate; };
  this.getShowTaskInfoNotes = function () { return vShowTaskInfoNotes; };
  this.getShowTaskInfoLink = function () { return vShowTaskInfoLink; };
  this.getShowEndWeekDate = function () { return vShowEndWeekDate; };
  this.getShowSelector = function () { return vShowSelector; };
  this.getShowDeps = function () { return vShowDeps; };
  this.getDateInputFormat = function () { return vDateInputFormat; };
  this.getDateTaskTableDisplayFormat = function () { return vDateTaskTableDisplayFormat; };
  this.getDateTaskDisplayFormat = function () { return vDateTaskDisplayFormat; };
  this.getHourMajorDateDisplayFormat = function () { return vHourMajorDateDisplayFormat; };
  this.getHourMinorDateDisplayFormat = function () { return vHourMinorDateDisplayFormat; };
  this.getDayMajorDateDisplayFormat = function () { return vDayMajorDateDisplayFormat; };
  this.getDayMinorDateDisplayFormat = function () { return vDayMinorDateDisplayFormat; };
  this.getWeekMajorDateDisplayFormat = function () { return vWeekMajorDateDisplayFormat; };
  this.getWeekMinorDateDisplayFormat = function () { return vWeekMinorDateDisplayFormat; };
  this.getMonthMajorDateDisplayFormat = function () { return vMonthMajorDateDisplayFormat; };
  this.getMonthMinorDateDisplayFormat = function () { return vMonthMinorDateDisplayFormat; };
  this.getQuarterMajorDateDisplayFormat = function () { return vQuarterMajorDateDisplayFormat; };
  this.getQuarterMinorDateDisplayFormat = function () { return vQuarterMinorDateDisplayFormat; };
  this.getCaptionType = function () { return vCaptionType; };
  this.getMinGpLen = function () { return vMinGpLen; };
  this.getScrollTo = function () { return vScrollTo; };
  this.getHourColWidth = function () { return vHourColWidth; };
  this.getDayColWidth = function () { return vDayColWidth; };
  this.getWeekColWidth = function () { return vWeekColWidth; };
  this.getMonthColWidth = function () { return vMonthColWidth; };
  this.getQuarterColWidth = function () { return vQuarterColWidth; };
  this.getRowHeight = function () { return vRowHeight; };
  this.getChartBody = function () { return vChartBody; };
  this.getChartHead = function () { return vChartHead; };
  this.getListBody = function () { return vListBody; };
  this.getChartTable = function () { return vChartTable; };
  this.getLines = function () { return vLines; };
  this.getTimer = function () { return vTimer; };
  this.getTooltipDelay = function () { return vTooltipDelay; };

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

  this.AddTaskItem = function (value) {
    var vExists = false;
    for (var i = 0; i < vTaskList.length; i++) {
      if (vTaskList[i].getID() == value.getID()) {
        i = vTaskList.length;
        vExists = true;
      }
    }
    if (!vExists) {
      vTaskList.push(value);
      vProcessNeeded = true;
    }
  };

  this.AddTaskItemObject = function (object) {
    return this.AddTaskItem(TaskItemObject(object));
  }

  this.RemoveTaskItem = function (pID) {
    // simply mark the task for removal at this point - actually remove it next time we re-draw the chart
    for (var i = 0; i < vTaskList.length; i++) {
      if (vTaskList[i].getID() == pID) vTaskList[i].setToDelete(true);
      else if (vTaskList[i].getParent() == pID) this.RemoveTaskItem(vTaskList[i].getID());
    }
    vProcessNeeded = true;
  };

  this.getList = function () { return vTaskList; };

  this.clearDependencies = function () {
    var parent = this.getLines();
    while (parent.hasChildNodes()) parent.removeChild(parent.firstChild);
    vDepId = 1;
  };


  // sLine: Draw a straight line (colored one-pixel wide div)
  this.sLine = function (x1, y1, x2, y2, pClass) {
    var vLeft = Math.min(x1, x2);
    var vTop = Math.min(y1, y2);
    var vWid = Math.abs(x2 - x1) + 1;
    var vHgt = Math.abs(y2 - y1) + 1;

    var vTmpDiv = document.createElement('div');
    vTmpDiv.id = vDivId + 'line' + vDepId++;
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
    if (vTodayPx >= 0) this.sLine(vTodayPx, 0, vTodayPx, this.getChartTable().offsetHeight - 1, 'gCurDate');
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
    var vNumCols = 0;
    var vNumRows = 0;
    var vSingleCell = false;
    var vID = 0;
    var vMainTable = '';
    var vDateRow = null;
    var vFirstCellItemRowStr = '';
    var vItemRowStr = '';
    var vColWidth = 0;
    var vColUnit = 0;
    var vChild;
    var vGroup;
    var vTaskDiv;
    var vParDiv;

    if (vTaskList.length > 0) {
      // Process all tasks, reset parent date and completion % if task list has altered
      if (vProcessNeeded) processRows(vTaskList, 0, -1, 1, 1, this.getUseSort());
      vProcessNeeded = false;

      // get overall min/max dates plus padding
      vMinDate = getMinDate(vTaskList, vFormat);
      vMaxDate = getMaxDate(vTaskList, vFormat);

      // Calculate chart width variables.
      if (vFormat == 'day') vColWidth = vDayColWidth;
      else if (vFormat == 'week') vColWidth = vWeekColWidth;
      else if (vFormat == 'month') vColWidth = vMonthColWidth;
      else if (vFormat == 'quarter') vColWidth = vQuarterColWidth;
      else if (vFormat == 'hour') vColWidth = vHourColWidth;

      // DRAW the Left-side of the chart (names, resources, comp%)
      var vLeftHeader = document.createDocumentFragment();

      var vTmpDiv = this.newNode(vLeftHeader, 'div', vDivId + 'glisthead', 'glistlbl gcontainercol');
      var vTmpTab = this.newNode(vTmpDiv, 'table', null, 'gtasktableh');
      var vTmpTBody = this.newNode(vTmpTab, 'tbody');
      var vTmpRow = this.newNode(vTmpTBody, 'tr');
      this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
      var vTmpCell = this.newNode(vTmpRow, 'td', null, 'gspanning gtaskname');
      vTmpCell.appendChild(this.drawSelector('top'));
      if (vShowRes == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
      if (vShowDur == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');
      if (vShowComp == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
      if (vShowStartDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
      if (vShowEndDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');

      vTmpRow = this.newNode(vTmpTBody, 'tr');
      this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
      this.newNode(vTmpRow, 'td', null, 'gtaskname', '\u00A0');
      if (vShowRes == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading gresource', vLangs[vLang]['resource']);
      if (vShowDur == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading gduration', vLangs[vLang]['duration']);
      if (vShowComp == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading gpccomplete', vLangs[vLang]['comp']);
      if (vShowStartDate == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading gstartdate', vLangs[vLang]['startdate']);
      if (vShowEndDate == 1) this.newNode(vTmpRow, 'td', null, 'gtaskheading genddate', vLangs[vLang]['enddate']);

      var vLeftTable = document.createDocumentFragment();
      var vTmpDiv2 = this.newNode(vLeftTable, 'div', vDivId + 'glistbody', 'glistgrid gcontainercol');
      this.setListBody(vTmpDiv2);
      vTmpTab = this.newNode(vTmpDiv2, 'table', null, 'gtasktable');
      vTmpTBody = this.newNode(vTmpTab, 'tbody');

      for (i = 0; i < vTaskList.length; i++) {
        if (vTaskList[i].getGroup() == 1) var vBGColor = 'ggroupitem';
        else vBGColor = 'glineitem';

        vID = vTaskList[i].getID();

        if ((!(vTaskList[i].getParItem() && vTaskList[i].getParItem().getGroup() == 2)) || vTaskList[i].getGroup() == 2) {
          if (vTaskList[i].getVisible() == 0) vTmpRow = this.newNode(vTmpTBody, 'tr', vDivId + 'child_' + vID, 'gname ' + vBGColor, null, null, null, 'none');
          else vTmpRow = this.newNode(vTmpTBody, 'tr', vDivId + 'child_' + vID, 'gname ' + vBGColor);
          vTaskList[i].setListChildRow(vTmpRow);
          this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
          vTmpCell = this.newNode(vTmpRow, 'td', null, 'gtaskname');

          var vCellContents = '';
          for (j = 1; j < vTaskList[i].getLevel(); j++) {
            vCellContents += '\u00A0\u00A0\u00A0\u00A0';
          }

          if (vTaskList[i].getGroup() == 1) {
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, vCellContents);
            var vTmpSpan = this.newNode(vTmpDiv, 'span', vDivId + 'group_' + vID, 'gfoldercollapse', (vTaskList[i].getOpen() == 1) ? '-' : '+');
            vTaskList[i].setGroupSpan(vTmpSpan);
            addFolderListeners(this, vTmpSpan, vID);
            vTmpDiv.appendChild(document.createTextNode('\u00A0' + vTaskList[i].getName()));
          }
          else {
            vCellContents += '\u00A0\u00A0\u00A0\u00A0';
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, vCellContents + vTaskList[i].getName());
          }

          if (vShowRes == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gresource');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, vTaskList[i].getResource());
          }
          if (vShowDur == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gduration');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, vTaskList[i].getDuration(vFormat, vLangs[vLang]));
          }
          if (vShowComp == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gpccomplete');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, vTaskList[i].getCompStr());
          }
          if (vShowStartDate == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gstartdate');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTaskList[i].getStart(), vDateTaskTableDisplayFormat, vLangs[vLang]));
          }
          if (vShowEndDate == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'genddate');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTaskList[i].getEnd(), vDateTaskTableDisplayFormat, vLangs[vLang]));
          }
          vNumRows++;
        }
      }

      // DRAW the date format selector at bottom left.
      vTmpRow = this.newNode(vTmpTBody, 'tr');
      this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
      vTmpCell = this.newNode(vTmpRow, 'td', null, 'gspanning gtaskname');
      vTmpCell.appendChild(this.drawSelector('bottom'));
      if (vShowRes == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
      if (vShowDur == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');
      if (vShowComp == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
      if (vShowStartDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
      if (vShowEndDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');
      // Add some white space so the vertical scroll distance should always be greater
      // than for the right pane (keep to a minimum as it is seen in unconstrained height designs)
      this.newNode(vTmpDiv2, 'br');
      this.newNode(vTmpDiv2, 'br');

      // Draw the Chart Rows
      var vRightHeader = document.createDocumentFragment();
      vTmpDiv = this.newNode(vRightHeader, 'div', vDivId + 'gcharthead', 'gchartlbl gcontainercol');
      this.setChartHead(vTmpDiv);
      vTmpTab = this.newNode(vTmpDiv, 'table', vDivId + 'chartTableh', 'gcharttableh');
      vTmpTBody = this.newNode(vTmpTab, 'tbody');
      vTmpRow = this.newNode(vTmpTBody, 'tr');

      vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
      if (vFormat == 'hour') vTmpDate.setHours(vMinDate.getHours());
      else vTmpDate.setHours(0);
      vTmpDate.setMinutes(0);
      vTmpDate.setSeconds(0);
      vTmpDate.setMilliseconds(0);

      var vColSpan = 1;
      // Major Date Header
      while (vTmpDate.getTime() <= vMaxDate.getTime()) {
        var vHeaderCellClass = 'gmajorheading';
        vCellContents = '';

        if (vFormat == 'day') {
          vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, 7);
          vCellContents += formatDateStr(vTmpDate, vDayMajorDateDisplayFormat, vLangs[vLang]);
          vTmpDate.setDate(vTmpDate.getDate() + 6);

          if (vShowEndWeekDate == 1) vCellContents += ' - ' + formatDateStr(vTmpDate, vDayMajorDateDisplayFormat, vLangs[vLang]);

          this.newNode(vTmpCell, 'div', null, null, vCellContents, vColWidth * 7);
          vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
        else if (vFormat == 'week') {
          vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, vColWidth);
          this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, vWeekMajorDateDisplayFormat, vLangs[vLang]), vColWidth);
          vTmpDate.setDate(vTmpDate.getDate() + 7);
        }
        else if (vFormat == 'month') {
          vColSpan = (12 - vTmpDate.getMonth());
          if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= (11 - vMaxDate.getMonth());
          vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
          this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, vMonthMajorDateDisplayFormat, vLangs[vLang]), vColWidth * vColSpan);
          vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
        }
        else if (vFormat == 'quarter') {
          vColSpan = (4 - Math.floor(vTmpDate.getMonth() / 3));
          if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= (3 - Math.floor(vMaxDate.getMonth() / 3));
          vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
          this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, vQuarterMajorDateDisplayFormat, vLangs[vLang]), vColWidth * vColSpan);
          vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
        }
        else if (vFormat == 'hour') {
          vColSpan = (24 - vTmpDate.getHours());
          if (vTmpDate.getFullYear() == vMaxDate.getFullYear() &&
            vTmpDate.getMonth() == vMaxDate.getMonth() &&
            vTmpDate.getDate() == vMaxDate.getDate()) vColSpan -= (23 - vMaxDate.getHours());
          vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass, null, null, null, null, vColSpan);
          this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, vHourMajorDateDisplayFormat, vLangs[vLang]), vColWidth * vColSpan);
          vTmpDate.setHours(0);
          vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
      }

      vTmpRow = this.newNode(vTmpTBody, 'tr');

      // Minor Date header and Cell Rows
      vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate()); // , vMinDate.getHours()
      if (vFormat == 'hour') vTmpDate.setHours(vMinDate.getHours());
      vNumCols = 0;

      while (vTmpDate.getTime() <= vMaxDate.getTime()) {
        vHeaderCellClass = 'gminorheading';
        var vCellClass = 'gtaskcell';

        if (vFormat == 'day') {
          if (vTmpDate.getDay() % 6 == 0) {
            vHeaderCellClass += 'wkend';
            vCellClass += 'wkend';
          }

          if (vTmpDate <= vMaxDate) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
            this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, vDayMinorDateDisplayFormat, vLangs[vLang]), vColWidth);
            vNumCols++;
          }

          vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
        else if (vFormat == 'week') {
          if (vTmpDate <= vMaxDate) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
            this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, vWeekMinorDateDisplayFormat, vLangs[vLang]), vColWidth);
            vNumCols++;
          }

          vTmpDate.setDate(vTmpDate.getDate() + 7);
        }
        else if (vFormat == 'month') {
          if (vTmpDate <= vMaxDate) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
            this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, vMonthMinorDateDisplayFormat, vLangs[vLang]), vColWidth);
            vNumCols++;
          }

          vTmpDate.setDate(vTmpDate.getDate() + 1);

          while (vTmpDate.getDate() > 1) {
            vTmpDate.setDate(vTmpDate.getDate() + 1);
          }
        }
        else if (vFormat == 'quarter') {
          if (vTmpDate <= vMaxDate) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
            this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, vQuarterMinorDateDisplayFormat, vLangs[vLang]), vColWidth);
            vNumCols++;
          }

          vTmpDate.setDate(vTmpDate.getDate() + 81);

          while (vTmpDate.getDate() > 1) vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
        else if (vFormat == 'hour') {
          for (i = vTmpDate.getHours(); i < 24; i++) {
            vTmpDate.setHours(i);//works around daylight savings but may look a little odd on days where the clock goes forward
            if (vTmpDate <= vMaxDate) {
              vTmpCell = this.newNode(vTmpRow, 'td', null, vHeaderCellClass);
              this.newNode(vTmpCell, 'div', null, null, formatDateStr(vTmpDate, vHourMinorDateDisplayFormat, vLangs[vLang]), vColWidth);
              vNumCols++;
            }
          }
          vTmpDate.setHours(0);
          vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
      }
      vDateRow = vTmpRow;

      vTaskLeftPx = (vNumCols * (vColWidth + 1)) + 1;

      if (vUseSingleCell != 0 && vUseSingleCell < (vNumCols * vNumRows)) vSingleCell = true;

      this.newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);

      vTmpDiv = this.newNode(vRightHeader, 'div', null, 'glabelfooter');

      var vRightTable = document.createDocumentFragment();
      vTmpDiv = this.newNode(vRightTable, 'div', vDivId + 'gchartbody', 'gchartgrid gcontainercol');
      this.setChartBody(vTmpDiv);
      vTmpTab = this.newNode(vTmpDiv, 'table', vDivId + 'chartTable', 'gcharttable', null, vTaskLeftPx);
      this.setChartTable(vTmpTab);
      this.newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);
      vTmpTBody = this.newNode(vTmpTab, 'tbody');

      // Draw each row

      var i = 0;
      var j = 0;
      for (i = 0; i < vTaskList.length; i++) {
        var curTaskStart = vTaskList[i].getStart();
        var curTaskEnd = vTaskList[i].getEnd();
        if ((curTaskEnd.getTime() - (curTaskEnd.getTimezoneOffset() * 60000)) % (86400000) == 0) curTaskEnd = new Date(curTaskEnd.getFullYear(), curTaskEnd.getMonth(), curTaskEnd.getDate() + 1, curTaskEnd.getHours(), curTaskEnd.getMinutes(), curTaskEnd.getSeconds()); // add 1 day here to simplify calculations below

        vTaskLeftPx = getOffset(vMinDate, curTaskStart, vColWidth, vFormat);
        vTaskRightPx = getOffset(curTaskStart, curTaskEnd, vColWidth, vFormat);

        vID = vTaskList[i].getID();
        var vComb = (vTaskList[i].getParItem() && vTaskList[i].getParItem().getGroup() == 2);
        var vCellFormat = '';

        var vTmpItem = vTaskList[i];
        var vCaptionStr = '';
        var vCaptClass = null;
        if (vTaskList[i].getMile() && !vComb) {
          vTmpRow = this.newNode(vTmpTBody, 'tr', vDivId + 'childrow_' + vID, 'gmileitem gmile' + vFormat, null, null, null, ((vTaskList[i].getVisible() == 0) ? 'none' : null));
          vTaskList[i].setChildRow(vTmpRow);
          addThisRowListeners(this, vTaskList[i].getListChildRow(), vTmpRow);
          vTmpCell = this.newNode(vTmpRow, 'td', null, 'gtaskcell');
          vTmpDiv = this.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
          vTmpDiv = this.newNode(vTmpDiv, 'div', vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, 12, vTaskLeftPx - 6);
          vTaskList[i].setBarDiv(vTmpDiv);
          vTmpDiv2 = this.newNode(vTmpDiv, 'div', vDivId + 'taskbar_' + vID, vTaskList[i].getClass(), null, 12);
          vTaskList[i].setTaskDiv(vTmpDiv2);

          if (vTaskList[i].getCompVal() < 100)
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
              if (vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5))) vCellFormat = 'gtaskcellwkend';
              else vCellFormat = 'gtaskcell';
              this.newNode(vTmpRow, 'td', null, vCellFormat, '\u00A0\u00A0');
            }
          }
        }
        else {
          vTaskWidth = vTaskRightPx;

          // Draw Group Bar which has outer div with inner group div and several small divs to left and right to create angled-end indicators
          if (vTaskList[i].getGroup()) {
            vTaskWidth = (vTaskWidth > vMinGpLen && vTaskWidth < vMinGpLen * 2) ? vMinGpLen * 2 : vTaskWidth; // Expand to show two end points
            vTaskWidth = (vTaskWidth < vMinGpLen) ? vMinGpLen : vTaskWidth; // expand to show one end point

            vTmpRow = this.newNode(vTmpTBody, 'tr', vDivId + 'childrow_' + vID, ((vTaskList[i].getGroup() == 2) ? 'glineitem gitem' : 'ggroupitem ggroup') + vFormat, null, null, null, ((vTaskList[i].getVisible() == 0) ? 'none' : null));
            vTaskList[i].setChildRow(vTmpRow);
            addThisRowListeners(this, vTaskList[i].getListChildRow(), vTmpRow);
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gtaskcell');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
            vTaskList[i].setCellDiv(vTmpDiv);
            if (vTaskList[i].getGroup() == 1) {
              vTmpDiv = this.newNode(vTmpDiv, 'div', vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, vTaskLeftPx);
              vTaskList[i].setBarDiv(vTmpDiv);
              vTmpDiv2 = this.newNode(vTmpDiv, 'div', vDivId + 'taskbar_' + vID, vTaskList[i].getClass(), null, vTaskWidth);
              vTaskList[i].setTaskDiv(vTmpDiv2);

              this.newNode(vTmpDiv2, 'div', vDivId + 'complete_' + vID, vTaskList[i].getClass() + 'complete', null, vTaskList[i].getCompStr());

              this.newNode(vTmpDiv, 'div', null, vTaskList[i].getClass() + 'endpointleft');
              if (vTaskWidth >= vMinGpLen * 2) this.newNode(vTmpDiv, 'div', null, vTaskList[i].getClass() + 'endpointright');

              vCaptClass = 'ggroupcaption';
            }

            if (!vSingleCell && !vComb) {
              vCellFormat = '';
              for (j = 0; j < vNumCols - 1; j++) {
                if (vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5))) vCellFormat = 'gtaskcellwkend';
                else vCellFormat = 'gtaskcell';
                this.newNode(vTmpRow, 'td', null, vCellFormat, '\u00A0\u00A0');
              }
            }
          }
          else {
            vTaskWidth = (vTaskWidth <= 0) ? 1 : vTaskWidth;

            if (vComb) {
              vTmpDiv = vTaskList[i].getParItem().getCellDiv();
            }
            else {
              vTmpRow = this.newNode(vTmpTBody, 'tr', vDivId + 'childrow_' + vID, 'glineitem gitem' + vFormat, null, null, null, ((vTaskList[i].getVisible() == 0) ? 'none' : null));
              vTaskList[i].setChildRow(vTmpRow);
              addThisRowListeners(this, vTaskList[i].getListChildRow(), vTmpRow);
              vTmpCell = this.newNode(vTmpRow, 'td', null, 'gtaskcell');
              vTmpDiv = this.newNode(vTmpCell, 'div', null, 'gtaskcelldiv', '\u00A0\u00A0');
            }
            // Draw Task Bar which has colored bar div, and opaque completion div
            vTmpDiv = this.newNode(vTmpDiv, 'div', vDivId + 'bardiv_' + vID, 'gtaskbarcontainer', null, vTaskWidth, vTaskLeftPx);
            vTaskList[i].setBarDiv(vTmpDiv);
            vTmpDiv2 = this.newNode(vTmpDiv, 'div', vDivId + 'taskbar_' + vID, vTaskList[i].getClass(), null, vTaskWidth);
            vTaskList[i].setTaskDiv(vTmpDiv2);
            this.newNode(vTmpDiv2, 'div', vDivId + 'complete_' + vID, vTaskList[i].getClass() + 'complete', null, vTaskList[i].getCompStr());

            if (vComb) vTmpItem = vTaskList[i].getParItem();
            if (!vComb || (vComb && vTaskList[i].getParItem().getEnd() == vTaskList[i].getEnd())) vCaptClass = 'gcaption';

            if (!vSingleCell && !vComb) {
              vCellFormat = '';
              for (j = 0; j < vNumCols - 1; j++) {
                if (vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5))) vCellFormat = 'gtaskcellwkend';
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
            case 'Duration': vCaptionStr = vTmpItem.getDuration(vFormat, vLangs[vLang]); break;
            case 'Complete': vCaptionStr = vTmpItem.getCompStr(); break;
          }
          this.newNode(vTmpDiv, 'div', null, vCaptClass, vCaptionStr, 120, (vCaptClass == 'gmilecaption') ? 12 : 0);
        }

        if (vTaskList[i].getTaskDiv() && vTmpDiv) {
          // Add Task Info div for tooltip
          vTmpDiv2 = this.newNode(vTmpDiv, 'div', vDivId + 'tt' + vID, null, null, null, null, 'none');
          vTmpDiv2.appendChild(this.createTaskInfo(vTaskList[i]));
          addTooltipListeners(this, vTaskList[i].getTaskDiv(), vTmpDiv2);
        }
      }

      if (!vSingleCell) vTmpTBody.appendChild(vDateRow.cloneNode(true));

      while (vDiv.hasChildNodes()) vDiv.removeChild(vDiv.firstChild);
      vTmpDiv = this.newNode(vDiv, 'div', null, 'gchartcontainer');
      vTmpDiv.appendChild(vLeftHeader);
      vTmpDiv.appendChild(vRightHeader);
      vTmpDiv.appendChild(vLeftTable);
      vTmpDiv.appendChild(vRightTable);
      this.newNode(vTmpDiv, 'div', null, 'ggridfooter');
      vTmpDiv2 = this.newNode(this.getChartBody(), 'div', vDivId + 'Lines', 'glinediv');
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
      if (vScrollTo != '') {
        var vScrollDate = new Date(vMinDate.getTime());
        var vScrollPx = 0;

        if (vScrollTo.substr(0, 2) == 'px') {
          vScrollPx = parseInt(vScrollTo.substr(2));
        }
        else {
          vScrollDate = parseDateStr(vScrollTo, this.getDateInputFormat());
          if (vFormat == 'hour') vScrollDate.setMinutes(0, 0, 0);
          else vScrollDate.setHours(0, 0, 0, 0);
          vScrollPx = getOffset(vMinDate, vScrollDate, vColWidth, vFormat);
        }
        this.getChartBody().scrollLeft = vScrollPx;
      }

      if (vMinDate.getTime() <= (new Date()).getTime() && vMaxDate.getTime() >= (new Date()).getTime()) vTodayPx = getOffset(vMinDate, new Date(), vColWidth, vFormat);
      else vTodayPx = -1;
      this.DrawDependencies();
    }
  }; //this.draw

  this.mouseOver = mouseOver;

  this.mouseOut = mouseOut;

  this.drawSelector = function (pPos) {
    var vOutput = document.createDocumentFragment();
    var vDisplay = false;

    for (var i = 0; i < vShowSelector.length && !vDisplay; i++) {
      if (vShowSelector[i].toLowerCase() == pPos.toLowerCase()) vDisplay = true;
    }

    if (vDisplay) {
      var vTmpDiv = this.newNode(vOutput, 'div', null, 'gselector', vLangs[vLang]['format'] + ':');

      if (vFormatArr.join().toLowerCase().indexOf('hour') != -1)
        addFormatListeners(this, 'hour', this.newNode(vTmpDiv, 'span', vDivId + 'formathour' + pPos, 'gformlabel' + ((vFormat == 'hour') ? ' gselected' : ''), vLangs[vLang]['hour']));

      if (vFormatArr.join().toLowerCase().indexOf('day') != -1)
        addFormatListeners(this, 'day', this.newNode(vTmpDiv, 'span', vDivId + 'formatday' + pPos, 'gformlabel' + ((vFormat == 'day') ? ' gselected' : ''), vLangs[vLang]['day']));

      if (vFormatArr.join().toLowerCase().indexOf('week') != -1)
        addFormatListeners(this, 'week', this.newNode(vTmpDiv, 'span', vDivId + 'formatweek' + pPos, 'gformlabel' + ((vFormat == 'week') ? ' gselected' : ''), vLangs[vLang]['week']));

      if (vFormatArr.join().toLowerCase().indexOf('month') != -1)
        addFormatListeners(this, 'month', this.newNode(vTmpDiv, 'span', vDivId + 'formatmonth' + pPos, 'gformlabel' + ((vFormat == 'month') ? ' gselected' : ''), vLangs[vLang]['month']));

      if (vFormatArr.join().toLowerCase().indexOf('quarter') != -1)
        addFormatListeners(this, 'quarter', this.newNode(vTmpDiv, 'span', vDivId + 'formatquarter' + pPos, 'gformlabel' + ((vFormat == 'quarter') ? ' gselected' : ''), vLangs[vLang]['quarter']));
    }
    else {
      this.newNode(vOutput, 'div', null, 'gselector');
    }
    return vOutput;
  };

  this.createTaskInfo = function (pTask) {
    var vTmpDiv;
    var vTaskInfoBox = document.createDocumentFragment();
    var vTaskInfo = this.newNode(vTaskInfoBox, 'div', null, 'gTaskInfo');
    this.newNode(vTaskInfo, 'span', null, 'gTtTitle', pTask.getName());
    if (vShowTaskInfoStartDate == 1) {
      vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIsd');
      this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', vLangs[vLang]['startdate'] + ': ');
      this.newNode(vTmpDiv, 'span', null, 'gTaskText', formatDateStr(pTask.getStart(), vDateTaskDisplayFormat, vLangs[vLang]));
    }
    if (vShowTaskInfoEndDate == 1) {
      vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIed');
      this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', vLangs[vLang]['enddate'] + ': ');
      this.newNode(vTmpDiv, 'span', null, 'gTaskText', formatDateStr(pTask.getEnd(), vDateTaskDisplayFormat, vLangs[vLang]));
    }
    if (vShowTaskInfoDur == 1 && !pTask.getMile()) {
      vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTId');
      this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', vLangs[vLang]['duration'] + ': ');
      this.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getDuration(vFormat, vLangs[vLang]));
    }
    if (vShowTaskInfoComp == 1) {
      vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIc');
      this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', vLangs[vLang]['completion'] + ': ');
      this.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getCompStr());
    }
    if (vShowTaskInfoRes == 1) {
      vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIr');
      this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', vLangs[vLang]['resource'] + ': ');
      this.newNode(vTmpDiv, 'span', null, 'gTaskText', pTask.getResource());
    }
    if (vShowTaskInfoLink == 1 && pTask.getLink() != '') {
      vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIl');
      var vTmpNode = this.newNode(vTmpDiv, 'span', null, 'gTaskLabel');
      vTmpNode = this.newNode(vTmpNode, 'a', null, 'gTaskText', vLangs[vLang]['moreinfo']);
      vTmpNode.setAttribute('href', pTask.getLink());
    }
    if (vShowTaskInfoNotes == 1) {
      vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIn');
      this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', vLangs[vLang]['notes'] + ': ');
      if (pTask.getNotes()) vTmpDiv.appendChild(pTask.getNotes());
    }
    return vTaskInfoBox;
  };

  this.getXMLProject = function () {
    var vProject = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
    for (var i = 0; i < vTaskList.length; i++) {
      vProject += this.getXMLTask(i, true);
    }
    vProject += '</project>';
    return vProject;
  };

  this.getXMLTask = function (pID, pIdx) {
    var i = 0;
    var vIdx = -1;
    var vTask = '';
    var vOutFrmt = parseDateFormatStr(this.getDateInputFormat() + ' HH:MI');
    if (pIdx === true) vIdx = pID;
    else {
      for (i = 0; i < vTaskList.length; i++) {
        if (vTaskList[i].getID() == pID) { vIdx = i; break; }
      }
    }
    if (vIdx >= 0 && vIdx < vTaskList.length) {
      /* Simplest way to return case sensitive node names is to just build a string */
      vTask = '<task>';
      vTask += '<pID>' + vTaskList[vIdx].getID() + '</pID>';
      vTask += '<pName>' + vTaskList[vIdx].getName() + '</pName>';
      vTask += '<pStart>' + formatDateStr(vTaskList[vIdx].getStart(), vOutFrmt, vLangs[vLang]) + '</pStart>';
      vTask += '<pEnd>' + formatDateStr(vTaskList[vIdx].getEnd(), vOutFrmt, vLangs[vLang]) + '</pEnd>';
      vTask += '<pClass>' + vTaskList[vIdx].getClass() + '</pClass>';
      vTask += '<pLink>' + vTaskList[vIdx].getLink() + '</pLink>';
      vTask += '<pMile>' + vTaskList[vIdx].getMile() + '</pMile>';
      if (vTaskList[vIdx].getResource() != '\u00A0') vTask += '<pRes>' + vTaskList[vIdx].getResource() + '</pRes>';
      vTask += '<pComp>' + vTaskList[vIdx].getCompVal() + '</pComp>';
      vTask += '<pCost>' + vTaskList[vIdx].getCost() + '</pCost>';
      vTask += '<pGroup>' + vTaskList[vIdx].getGroup() + '</pGroup>';
      vTask += '<pParent>' + vTaskList[vIdx].getParent() + '</pParent>';
      vTask += '<pOpen>' + vTaskList[vIdx].getOpen() + '</pOpen>';
      vTask += '<pDepend>';
      var vDepList = vTaskList[vIdx].getDepend();
      for (i = 0; i < vDepList.length; i++) {
        if (i > 0) vTask += ',';
        if (vDepList[i] > 0) vTask += vDepList[i] + vTaskList[vIdx].getDepType()[i];
      }
      vTask += '</pDepend>';
      vTask += '<pCaption>' + vTaskList[vIdx].getCaption() + '</pCaption>';

      var vTmpFrag = document.createDocumentFragment();
      var vTmpDiv = this.newNode(vTmpFrag, 'div', null, null, vTaskList[vIdx].getNotes().innerHTML);
      vTask += '<pNotes>' + vTmpDiv.innerHTML + '</pNotes>';
      vTask += '</task>';
    }
    return vTask;
  };
  if (vDiv && vDiv.nodeName.toLowerCase() == 'div') vDivId = vDiv.id;
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
