import * as lang from './lang';
import {
  mouseOver, mouseOut, addThisRowListeners, addTooltipListeners, addScrollListeners, addFormatListeners, moveToolTip,
  addFolderListeners, addListenerClickCell, addListener, addListenerInputCell, addListenerDependencies
} from "./events";
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
    0: true, // sunday
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
    let vID;
    let vList = this.getList();
    let vBarDiv;
    let vTaskDiv;
    let vParDiv;
    let vLeft, vTop, vWidth;
    let vHeight = Math.floor((this.getRowHeight() / 2));

    for (let i = 0; i < vList.length; i++) {
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
    let parent = this.getLines();
    while (parent.hasChildNodes()) parent.removeChild(parent.firstChild);
    this.vDepId = 1;
  };


  // sLine: Draw a straight line (colored one-pixel wide div)
  this.sLine = function (x1, y1, x2, y2, pClass) {
    let vLeft = Math.min(x1, x2);
    let vTop = Math.min(y1, y2);
    let vWid = Math.abs(x2 - x1) + 1;
    let vHgt = Math.abs(y2 - y1) + 1;

    let vTmpDiv = document.createElement('div');
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
    let vDir = 1;
    let vBend = false;
    let vShort = 4;
    let vRow = Math.floor(this.getRowHeight() / 2);

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

    let vTmpDiv = this.sLine(x2, y2, x2 - 3 - ((vDir < 0) ? 1 : 0), y2 - 3 - ((vDir < 0) ? 1 : 0), pClass + "Arw");
    vTmpDiv.style.width = '0px';
    vTmpDiv.style.height = '0px';
  };

  this.DrawDependencies = function (vDebug = false) {
    if (this.getShowDeps() == 1) {
      //First recalculate the x,y
      this.CalcTaskXY();
      this.clearDependencies();

      let vList = this.getList();
      for (let i = 0; i < vList.length; i++) {
        let vDepend = vList[i].getDepend();
        let vDependType = vList[i].getDepType();
        let n = vDepend.length;

        if (n > 0 && vList[i].getVisible() == 1) {
          for (let k = 0; k < n; k++) {
            let vTask = this.getArrayLocationByID(vDepend[k]);
            if (vTask >= 0 && vList[vTask].getGroup() != 2) {
              if (vList[vTask].getVisible() == 1) {
                if (vDebug) {
                  console.log(`init drawDependency `, vList[vTask].getID(), new Date());
                }
                const cssClass = 'gDepId' + vList[vTask].getID();
                if (vDependType[k] == 'SS') this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'SS', cssClass + ' gDepSS');
                else if (vDependType[k] == 'FF') this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getEndX(), vList[i].getEndY(), 'FF', cssClass + ' gDepFF');
                else if (vDependType[k] == 'SF') this.drawDependency(vList[vTask].getStartX() - 1, vList[vTask].getStartY(), vList[i].getEndX(), vList[i].getEndY(), 'SF', cssClass + ' gDepSF');
                else if (vDependType[k] == 'FS') this.drawDependency(vList[vTask].getEndX(), vList[vTask].getEndY(), vList[i].getStartX() - 1, vList[i].getStartY(), 'FS', cssClass + ' gDepFS');
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
    let vList = this.getList();
    for (let i = 0; i < vList.length; i++) {
      if (vList[i].getID() == pId)
        return i;
    }
    return -1;
  };

  this.newNode = function (pParent, pNodeType, pId, pClass, pText, pWidth, pLeft, pDisplay, pColspan, pAttribs) {
    let vNewNode = pParent.appendChild(document.createElement(pNodeType));
    if (pAttribs) {
      for (let i = 0; i + 1 < pAttribs.length; i += 2) {
        vNewNode.setAttribute(pAttribs[i], pAttribs[i + 1]);
      }
    }
    if (pId) vNewNode.id = pId; // I wish I could do this with setAttribute but older IEs don't play nice
    if (pClass) vNewNode.className = pClass;
    if (pWidth) vNewNode.style.width = (isNaN(pWidth * 1)) ? pWidth : pWidth + 'px';
    if (pLeft) vNewNode.style.left = (isNaN(pLeft * 1)) ? pLeft : pLeft + 'px';
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

  this.Draw = function () {
    let vMaxDate = new Date();
    let vMinDate = new Date();
    let vTmpDate = new Date();
    let vTaskLeftPx = 0;
    let vTaskRightPx = 0;
    let vTaskWidth = 1;

    let vTaskPlanLeftPx = 0;
    let vTaskPlanRightPx = 0;

    let vNumCols = 0;
    let vNumRows = 0;
    let vSingleCell = false;
    let vID = 0;
    let vDateRow = null;
    let vColWidth = 0;
    let bd;
    if (this.vDebug) {
      bd = new Date();
      console.log('before draw', bd);
    }
    if (this.vTaskList.length > 0) {
      // Process all tasks, reset parent date and completion % if task list has altered
      if (this.vProcessNeeded) processRows(this.vTaskList, 0, -1, 1, 1, this.getUseSort(), this.vDebug);
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
      let vLeftHeader = document.createDocumentFragment();


      /**
       * LIST HEAD 
       * 
       * 
       * 
       * HEADINGS
      */
      let vTmpDiv = this.newNode(vLeftHeader, 'div', this.vDivId + 'glisthead', 'glistlbl gcontainercol');
      this.setListBody(vTmpDiv);
      let vTmpTab = this.newNode(vTmpDiv, 'table', null, 'gtasktableh');
      let vTmpTBody = this.newNode(vTmpTab, 'tbody');
      let vTmpRow = this.newNode(vTmpTBody, 'tr');
      this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
      let vTmpCell = this.newNode(vTmpRow, 'td', null, 'gspanning gtaskname');
      vTmpCell.appendChild(this.drawSelector('top'));
      if (this.vShowRes == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gresource', '\u00A0');
      if (this.vShowDur == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gduration', '\u00A0');
      if (this.vShowComp == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gpccomplete', '\u00A0');
      if (this.vShowStartDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
      if (this.vShowEndDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning genddate', '\u00A0');
      if (this.vShowPlanStartDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gstartdate', '\u00A0');
      if (this.vShowPlanEndDate == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gplanenddate', '\u00A0');
      if (this.vShowCost == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gcost', '\u00A0');
      if (this.vAdditionalHeaders) {
        for (const key in this.vAdditionalHeaders) {
          const header = this.vAdditionalHeaders[key];
          const css = header.class ? header.class : `gadditional-${key}`;
          this.newNode(vTmpRow, 'td', null, `gspanning gadditional ${css}`, '\u00A0');
        }
      }

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
      if (this.vAdditionalHeaders) {
        for (const key in this.vAdditionalHeaders) {
          const header = this.vAdditionalHeaders[key];
          const text = header.translate ? this.vLangs[this.vLang][header.translate] : header.title;
          const css = header.class ? header.class : `gadditional-${key}`;
          this.newNode(vTmpRow, 'td', null, `gtaskheading gadditional ${css}`, text);
        }
      }


      /**
       * LIST BODY 
       * 
       * 
      */
      let vTmpDiv2;

      for (let i = 0; i < this.vTaskList.length; i++) {
        let vBGColor;
        if (this.vTaskList[i].getGroup() == 1) vBGColor = 'ggroupitem';
        else vBGColor = 'glineitem';

        vID = this.vTaskList[i].getID();

        if ((!(this.vTaskList[i].getParItem() && this.vTaskList[i].getParItem().getGroup() == 2)) || this.vTaskList[i].getGroup() == 2) {
          if (this.vTaskList[i].getVisible() == 0) vTmpRow = this.newNode(vTmpTBody, 'tr', this.vDivId + 'child_' + vID, 'gname ' + vBGColor, null, null, null, 'none');
          else vTmpRow = this.newNode(vTmpTBody, 'tr', this.vDivId + 'child_' + vID, 'gname ' + vBGColor);
          this.vTaskList[i].setListChildRow(vTmpRow);
          this.newNode(vTmpRow, 'td', null, 'gtasklist', '\u00A0');
          vTmpCell = this.newNode(vTmpRow, 'td', null, 'gtaskname');

          let vCellContents = '';
          for (let j = 1; j < this.vTaskList[i].getLevel(); j++) {
            vCellContents += '\u00A0\u00A0\u00A0\u00A0';
          }

          const task = this.vTaskList[i];
          const vEventClickRow = this.vEventClickRow;
          addListener('click', function (e) {
            if (e.target.classList.contains('gfoldercollapse') === false &&
              vEventClickRow && typeof vEventClickRow === "function") {
              vEventClickRow(task);
            }
          }, vTmpRow);

          if (this.vTaskList[i].getGroup() == 1) {
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, vCellContents);
            let vTmpSpan = this.newNode(vTmpDiv, 'span', this.vDivId + 'group_' + vID, 'gfoldercollapse', (this.vTaskList[i].getOpen() == 1) ? '-' : '+');
            this.vTaskList[i].setGroupSpan(vTmpSpan);
            addFolderListeners(this, vTmpSpan, vID);
            
            const divTask = document.createElement('span')
            divTask.innerHTML = '\u00A0' + this.vTaskList[i].getName()
            vTmpDiv.appendChild(divTask);
            // const text = makeInput(this.vTaskList[i].getName(), this.vEditable, 'text');
            // vTmpDiv.appendChild(document.createNode(text));
            const callback = (task, e) => task.setName(e.target.value);
            addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'taskname', this.Draw.bind(this));
            addListenerClickCell(vTmpDiv, this.vEvents, this.vTaskList[i], 'taskname');
          }
          else {
            vCellContents += '\u00A0\u00A0\u00A0\u00A0';
            const text = makeInput(this.vTaskList[i].getName(), this.vEditable, 'text');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, vCellContents + text);
            const callback = (task, e) => task.setName(e.target.value);
            addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'taskname', this.Draw.bind(this));
            addListenerClickCell(vTmpCell, this.vEvents, this.vTaskList[i], 'taskname');
          }

          if (this.vShowRes == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gresource');
            const text = makeInput(this.vTaskList[i].getResource(), this.vEditable, 'resource', this.vTaskList[i].getResource(), this.vResources);
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, text);
            const callback = (task, e) => task.setResource(e.target.value);
            addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'res', this.Draw.bind(this), 'change');
            addListenerClickCell(vTmpCell, this.vEvents, this.vTaskList[i], 'res');
          }
          if (this.vShowDur == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gduration');
            const text = makeInput(this.vTaskList[i].getDuration(this.vFormat, this.vLangs[this.vLang]), this.vEditable, 'text', this.vTaskList[i].getDuration());
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, text);
            const callback = (task, e) => task.setDuration(e.target.value);
            addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'dur', this.Draw.bind(this));
            addListenerClickCell(vTmpCell, this.vEvents, this.vTaskList[i], 'dur');
          }
          if (this.vShowComp == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gpccomplete');
            const text = makeInput(this.vTaskList[i].getCompStr(), this.vEditable, 'percentage', this.vTaskList[i].getCompVal());
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, text);
            const callback = (task, e) => task.setCompVal(e.target.value);
            addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'comp', this.Draw.bind(this));
            addListenerClickCell(vTmpCell, this.vEvents, this.vTaskList[i], 'comp');
          }
          if (this.vShowStartDate == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gstartdate');
            const v = formatDateStr(this.vTaskList[i].getStart(), this.vDateTaskTableDisplayFormat, this.vLangs[this.vLang]);
            const text = makeInput(v, this.vEditable, 'date', this.vTaskList[i].getStart());
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, text);
            const callback = (task, e) => task.setStart(e.target.value);
            addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'start', this.Draw.bind(this));
            addListenerClickCell(vTmpCell, this.vEvents, this.vTaskList[i], 'start');
          }
          if (this.vShowEndDate == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'genddate');
            const v = formatDateStr(this.vTaskList[i].getEnd(), this.vDateTaskTableDisplayFormat, this.vLangs[this.vLang]);
            const text = makeInput(v, this.vEditable, 'date', this.vTaskList[i].getEnd());
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, text);
            const callback = (task, e) => task.setEnd(e.target.value);
            addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'end', this.Draw.bind(this));
            addListenerClickCell(vTmpCell, this.vEvents, this.vTaskList[i], 'end');
          }
          if (this.vShowPlanStartDate == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gplanstartdate');
            const v = this.vTaskList[i].getPlanStart() ? formatDateStr(this.vTaskList[i].getPlanStart(), this.vDateTaskTableDisplayFormat, this.vLangs[this.vLang]) : '';
            const text = makeInput(v, this.vEditable, 'date', this.vTaskList[i].getPlanStart());
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, text);
            const callback = (task, e) => task.setPlanStart(e.target.value);
            addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'planstart', this.Draw.bind(this));
            addListenerClickCell(vTmpCell, this.vEvents, this.vTaskList[i], 'planstart');
          }
          if (this.vShowPlanEndDate == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gplanenddate');
            const v = this.vTaskList[i].getPlanEnd() ? formatDateStr(this.vTaskList[i].getPlanEnd(), this.vDateTaskTableDisplayFormat, this.vLangs[this.vLang]) : '';
            const text = makeInput(v, this.vEditable, 'date', this.vTaskList[i].getPlanEnd());
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, text);
            const callback = (task, e) => task.setPlanEnd(e.target.value);
            addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'planend', this.Draw.bind(this));
            addListenerClickCell(vTmpCell, this.vEvents, this.vTaskList[i], 'planend');
          }
          if (this.vShowCost == 1) {
            vTmpCell = this.newNode(vTmpRow, 'td', null, 'gcost');
            const text = makeInput(this.vTaskList[i].getCost(), this.vEditable, 'cost');
            vTmpDiv = this.newNode(vTmpCell, 'div', null, null, text);
            const callback = (task, e) => task.setCost(e.target.value);
            addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'cost', this.Draw.bind(this));
            addListenerClickCell(vTmpCell, this.vEvents, this.vTaskList[i], 'cost');
          }
          if (this.vAdditionalHeaders) {
            for (const key in this.vAdditionalHeaders) {
              const header = this.vAdditionalHeaders[key];
              const css = header.class ? header.class : `gadditional-${key}`;
              const data = this.vTaskList[i].getDataObject();
              if (data) {
                vTmpCell = this.newNode(vTmpRow, 'td', null, `gadditional ${css}`);
              }
              // const callback = (task, e) => task.setCost(e.target.value);
              // addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList[i], 'costdate');
              vTmpDiv = this.newNode(vTmpCell, 'div', null, null, data ? data[key] : '');
            }
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
      if (this.vShowCost == 1) this.newNode(vTmpRow, 'td', null, 'gspanning gcost', '\u00A0');
      if (this.vAdditionalHeaders) {
        for (const key in this.vAdditionalHeaders) {
          const header = this.vAdditionalHeaders[key];
          const css = header.class ? header.class : `gadditional-${key}`;
          this.newNode(vTmpRow, 'td', null, `gspanning gadditional ${css}`, '\u00A0');
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
      let vRightHeader = document.createDocumentFragment();
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

      let vColSpan = 1;
      // Major Date Header
      while (vTmpDate.getTime() <= vMaxDate.getTime()) {
        let vHeaderCellClass = 'gmajorheading';
        let vCellContents = '';

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
        let vHeaderCellClass = 'gminorheading';

        if (this.vFormat == 'day') {
          if (vTmpDate.getDay() % 6 == 0) {
            vHeaderCellClass += 'wkend';
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
          for (let i = vTmpDate.getHours(); i < 24; i++) {
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

      // Calculate size of grids  : Plus 3 because 1 border left + 2 of paddings
      vTaskLeftPx = (vNumCols * (vColWidth + 3)) + 1;
      // Fix a small space at the end for day
      if (this.vFormat === 'day') {
        vTaskLeftPx += 2;
      }
      vTmpTab.style.width = vTaskLeftPx+'px'; // Ensure that the headings has exactly the same width as the chart grid
      vTaskPlanLeftPx = (vNumCols * (vColWidth + 3)) + 1;

      if (this.vUseSingleCell != 0 && this.vUseSingleCell < (vNumCols * vNumRows)) vSingleCell = true;

      this.newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);

      vTmpDiv = this.newNode(vRightHeader, 'div', null, 'glabelfooter');



      /**
       * CHART GRID
       * 
       * 
       * 
       */
      let vRightTable = document.createDocumentFragment();
      vTmpDiv = this.newNode(vRightTable, 'div', this.vDivId + 'gchartbody', 'gchartgrid gcontainercol');
      this.setChartBody(vTmpDiv);
      vTmpTab = this.newNode(vTmpDiv, 'table', this.vDivId + 'chartTable', 'gcharttable', null, vTaskLeftPx);
      this.setChartTable(vTmpTab);
      this.newNode(vTmpDiv, 'div', null, 'rhscrpad', null, null, vTaskLeftPx + 1);
      vTmpTBody = this.newNode(vTmpTab, 'tbody');

      // Draw each row

      let i = 0;
      let j = 0;
      let bd;
      if (this.vDebug) {
        bd = new Date();
        console.log('before tasks loop', bd);
      }
      for (i = 0; i < this.vTaskList.length; i++) {
        let curTaskStart = this.vTaskList[i].getStart() ? this.vTaskList[i].getStart() : this.vTaskList[i].getPlanStart();
        let curTaskEnd = this.vTaskList[i].getEnd() ? this.vTaskList[i].getEnd() : this.vTaskList[i].getPlanEnd();
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
        } else {
          vTaskPlanLeftPx = vTaskPlanRightPx = 0;
        }


        vID = this.vTaskList[i].getID();
        let vComb = (this.vTaskList[i].getParItem() && this.vTaskList[i].getParItem().getGroup() == 2);
        let vCellFormat = '';

        let vTmpItem = this.vTaskList[i];
        let vCaptClass = null;
        if (this.vTaskList[i].getMile() && !vComb) {
          vTmpRow = this.newNode(vTmpTBody, 'tr', this.vDivId + 'childrow_' + vID, 'gmileitem gmile' + this.vFormat, null, null, null, ((this.vTaskList[i].getVisible() == 0) ? 'none' : null));
          this.vTaskList[i].setChildRow(vTmpRow);
          addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);
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
              if (this.vFormat == 'day' && ((j % 7 == 4) || (j % 7 == 5))) vCellFormat = 'gtaskcellwkend';
              else vCellFormat = 'gtaskcell';
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
            if (vTaskPlanLeftPx && vTaskPlanLeftPx != vTaskLeftPx) { // vTaskPlanRightPx vTaskPlanLeftPx
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
      if (this.vDebug) {
        const ad = new Date();
        console.log('after tasks loop', ad, (ad.getTime() - bd.getTime()));
      }
      if (!vSingleCell) {
        vTmpTBody.appendChild(vDateRow.cloneNode(true));
      } else if (this.vFormat == 'day') {
        vTmpTBody.appendChild(vTmpRow.cloneNode(true));
      }


      // MAIN VIEW: Appending all generated components to main view
      while (this.vDiv.hasChildNodes()) this.vDiv.removeChild(this.vDiv.firstChild);
      vTmpDiv = this.newNode(this.vDiv, 'div', null, 'gchartcontainer');

      let leftvTmpDiv = this.newNode(vTmpDiv, 'div', null, 'gmain gmainleft');
      leftvTmpDiv.appendChild(vLeftHeader);
      // leftvTmpDiv.appendChild(vLeftTable);

      let rightvTmpDiv = this.newNode(vTmpDiv, 'div', null, 'gmain gmainright');
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
      addScrollListeners(this);

      // now check if we are actually scrolling the pane
      if (this.vScrollTo != '') {
        let vScrollDate = new Date(vMinDate.getTime());
        let vScrollPx = 0;

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

      // Dependencies
      let bdd;
      if (this.vDebug) {
        bdd = new Date();
        console.log('before DrawDependencies', bdd);
      }
      this.DrawDependencies(this.vDebug);
      addListenerDependencies();
      if (this.vDebug) {
        const ad = new Date();
        console.log('after DrawDependencies', ad, (ad.getTime() - bdd.getTime()));
      }
    }
    if (this.vDebug) {
      const ad = new Date();
      console.log('after draw', ad, (ad.getTime() - bd.getTime()));
    }
  }; //this.draw



  this.drawSelector = function (pPos) {
    let vOutput = document.createDocumentFragment();
    let vDisplay = false;

    for (let i = 0; i < this.vShowSelector.length && !vDisplay; i++) {
      if (this.vShowSelector[i].toLowerCase() == pPos.toLowerCase()) vDisplay = true;
    }

    if (vDisplay) {
      let vTmpDiv = this.newNode(vOutput, 'div', null, 'gselector', this.vLangs[this.vLang]['format'] + ':');

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

const makeInput = function (formattedValue, editable, type = 'text', value = null, choices = null) {
  if (!value) {
    value = formattedValue;
  }
  if (editable) {
    switch (type) {
      case 'date':
        value = value ? value.toISOString().split('T')[0] : ''
        return `<input class="gantt-inputtable" type="date" value="${value}">`;
      case 'resource':
        if (choices) {
          const found = choices.find(c => c.id == value || c.name == value);
          if (found) {
            value = found.id;
          } else {
            choices.push({ id: value, name: value });
          }
          return `<select>` + choices.map(c => `<option value="${c.id}" ${value == c.id ? 'selected' : ''} >${c.name}</option>`).join('') + `</select>`;
        } else {
          return `<input class="gantt-inputtable" type="text" value="${value ? value : ''}">`;
        }
      case 'cost':
        return `<input class="gantt-inputtable" type="number" max="100" min="0" value="${value ? value : ''}">`;
      default:
        return `<input class="gantt-inputtable" value="${value ? value : ''}">`;
    }
  } else {
    return formattedValue;
  }
}

export const updateFlyingObj = function (e, pGanttChartObj, pTimer) {
  let vCurTopBuf = 3;
  let vCurLeftBuf = 5;
  let vCurBotBuf = 3;
  let vCurRightBuf = 15;
  let vMouseX = (e) ? e.clientX : (<MouseEvent>window.event).clientX;
  let vMouseY = (e) ? e.clientY : (<MouseEvent>window.event).clientY;
  let vViewportX = document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
  let vViewportY = document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  let vNewX = vMouseX;
  let vNewY = vMouseY;

  if (navigator.appName.toLowerCase() == 'microsoft internet explorer') {
    // the clientX and clientY properties include the left and top borders of the client area
    vMouseX -= document.documentElement.clientLeft;
    vMouseY -= document.documentElement.clientTop;

    let vZoomFactor = getZoomFactor();
    if (vZoomFactor != 1) {// IE 7 at non-default zoom level
      vMouseX = Math.round(vMouseX / vZoomFactor);
      vMouseY = Math.round(vMouseY / vZoomFactor);
    }
  }

  let vScrollPos = getScrollPositions();

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
