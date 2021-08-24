import * as lang from "./lang";
import {
  mouseOver,
  mouseOut,
  addThisRowListeners,
  addTooltipListeners,
  addScrollListeners,
  addFolderListeners,
  addListenerClickCell,
  addListener,
  addListenerInputCell,
  addListenerDependencies,
  syncScroll,
  updateGridHeaderWidth,
  removeListener,
} from "./events";
import { calculateCurrentDateOffset, getOffset, getScrollbarWidth, printChart } from "./utils/general_utils";
import { createTaskInfo, AddTaskItem, AddTaskItemObject, RemoveTaskItem, processRows, ClearTasks } from "./task";

import { getXMLProject, getXMLTask } from "./xml";
import { COLUMN_ORDER, draw_header, draw_bottom, draw_task_headings } from "./draw_columns";
import { newNode, makeInput, getArrayLocationByID, CalcTaskXY, sLine, drawSelector } from "./utils/draw_utils";
import { drawDependency, DrawDependencies } from "./draw_dependencies";
import { includeGetSet } from "./options";
import { parseDateFormatStr, getMinDate, coerceDate, getMaxDate, formatDateStr, parseDateStr } from "./utils/date_utils";

/**
 * function that loads the main gantt chart properties and functions
 * @param pDiv (required) this is a div object created in HTML
 * @param pFormat (required) - used to indicate whether chart should be drawn in "hour", "day", "week", "month", or "quarter" format
 */
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
    0: true, // sunday
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
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
  this.vColumnOrder = COLUMN_ORDER;
  this.vEditable = false;
  this.vDebug = false;
  this.vShowSelector = new Array("top");
  this.vDateInputFormat = "yyyy-mm-dd";
  this.vDateTaskTableDisplayFormat = parseDateFormatStr("dd/mm/yyyy");
  this.vDateTaskDisplayFormat = parseDateFormatStr("dd month yyyy");
  this.vHourMajorDateDisplayFormat = parseDateFormatStr("day dd month yyyy");
  this.vHourMinorDateDisplayFormat = parseDateFormatStr("HH");
  this.vDayMajorDateDisplayFormat = parseDateFormatStr("dd/mm/yyyy");
  this.vDayMinorDateDisplayFormat = parseDateFormatStr("dd");
  this.vWeekMajorDateDisplayFormat = parseDateFormatStr("yyyy");
  this.vWeekMinorDateDisplayFormat = parseDateFormatStr("dd/mm");
  this.vMonthMajorDateDisplayFormat = parseDateFormatStr("yyyy");
  this.vMonthMinorDateDisplayFormat = parseDateFormatStr("mon");
  this.vQuarterMajorDateDisplayFormat = parseDateFormatStr("yyyy");
  this.vQuarterMinorDateDisplayFormat = parseDateFormatStr("qq");
  this.vUseFullYear = parseDateFormatStr("dd/mm/yyyy");
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
  this.includeGetSet = includeGetSet.bind(this);
  this.includeGetSet();

  this.mouseOver = mouseOver;
  this.mouseOut = mouseOut;
  this.addListener = addListener.bind(this);
  this.removeListener = removeListener.bind(this);

  this.createTaskInfo = createTaskInfo;
  this.AddTaskItem = AddTaskItem;
  this.AddTaskItemObject = AddTaskItemObject;
  this.RemoveTaskItem = RemoveTaskItem;
  this.ClearTasks = ClearTasks;

  this.getXMLProject = getXMLProject;
  this.getXMLTask = getXMLTask;

  this.CalcTaskXY = CalcTaskXY.bind(this);

  // sLine: Draw a straight line (colored one-pixel wide div)
  this.sLine = sLine.bind(this);

  this.drawDependency = drawDependency.bind(this);
  this.DrawDependencies = DrawDependencies.bind(this);
  this.getArrayLocationByID = getArrayLocationByID.bind(this);
  this.drawSelector = drawSelector.bind(this);
  this.printChart = printChart.bind(this);

  this.clearDependencies = function () {
    let parent = this.getLines();
    if (this.vEventsChange.line && typeof this.vEventsChange.line === "function") {
      this.removeListener("click", this.vEventsChange.line, parent);
      this.addListener("click", this.vEventsChange.line, parent);
    }
    while (parent.hasChildNodes()) parent.removeChild(parent.firstChild);
    this.vDepId = 1;
  };

  this.drawListHead = function (vLeftHeader) {
    let vTmpDiv = newNode(vLeftHeader, "div", this.vDivId + "glisthead", "glistlbl gcontainercol");
    const gListLbl = vTmpDiv;
    this.setListBody(vTmpDiv);
    let vTmpTab = newNode(vTmpDiv, "table", null, "gtasktableh");
    let vTmpTBody = newNode(vTmpTab, "tbody");
    let vTmpRow = newNode(vTmpTBody, "tr");
    newNode(vTmpRow, "td", null, "gtasklist", "\u00A0");
    let vTmpCell = newNode(vTmpRow, "td", null, "gspanning gtaskname", null, null, null, null, this.getColumnOrder().length + 1);
    vTmpCell.appendChild(this.drawSelector("top"));

    vTmpRow = newNode(vTmpTBody, "tr");
    newNode(vTmpRow, "td", null, "gtasklist", "\u00A0");
    newNode(vTmpRow, "td", null, "gtaskname", "\u00A0");

    this.getColumnOrder().forEach((column) => {
      if (this[column] == 1 || column === "vAdditionalHeaders") {
        draw_task_headings(column, vTmpRow, this.vLangs, this.vLang, this.vAdditionalHeaders, this.vEvents);
      }
    });
    return gListLbl;
  };

  this.drawListBody = function (vLeftHeader) {
    let vTmpContentTabOuterWrapper = newNode(vLeftHeader, "div", null, "gtasktableouterwrapper");
    let vTmpContentTabWrapper = newNode(vTmpContentTabOuterWrapper, "div", null, "gtasktablewrapper");
    vTmpContentTabWrapper.style.width = `calc(100% + ${getScrollbarWidth()}px)`;
    let vTmpContentTab = newNode(vTmpContentTabWrapper, "table", null, "gtasktable");
    let vTmpContentTBody = newNode(vTmpContentTab, "tbody");
    let vNumRows = 0;
    for (let i = 0; i < this.vTaskList.length; i++) {
      let vBGColor;
      if (this.vTaskList[i].getGroup() == 1) vBGColor = "ggroupitem";
      else vBGColor = "glineitem a";

      let vID = this.vTaskList[i].getID();
      let vTmpRow, vTmpCell;
      if (!(this.vTaskList[i].getParItem() && this.vTaskList[i].getParItem().getGroup() == 2) || this.vTaskList[i].getGroup() == 2) {
        if (this.vTaskList[i].getVisible() == 0) vTmpRow = newNode(vTmpContentTBody, "tr", this.vDivId + "child_" + vID, "gname " + vBGColor, null, null, null, "none");
        else vTmpRow = newNode(vTmpContentTBody, "tr", this.vDivId + "child_" + vID, "gname " + vBGColor);
        this.vTaskList[i].setListChildRow(vTmpRow);
        newNode(vTmpRow, "td", null, "gtasklist", "\u00A0");
        const editableClass = this.vEditable ? "gtaskname gtaskeditable" : "gtaskname";
        vTmpCell = newNode(vTmpRow, "td", null, editableClass);

        let vCellContents = "";
        for (let j = 1; j < this.vTaskList[i].getLevel(); j++) {
          vCellContents += "\u00A0\u00A0\u00A0\u00A0";
        }

        const task = this.vTaskList[i];
        const vEventClickRow = this.vEventClickRow;
        const vEventClickCollapse = this.vEventClickCollapse;
        addListener(
          "click",
          function (e) {
            if (e.target.classList.contains("gfoldercollapse") === false) {
              if (vEventClickRow && typeof vEventClickRow === "function") {
                vEventClickRow(task);
              }
            } else {
              if (vEventClickCollapse && typeof vEventClickCollapse === "function") {
                vEventClickCollapse(task);
              }
            }
          },
          vTmpRow
        );

        if (this.vTaskList[i].getGroup() == 1) {
          let vTmpDiv = newNode(vTmpCell, "div", null, null, vCellContents);
          let vTmpSpan = newNode(vTmpDiv, "span", this.vDivId + "group_" + vID, "gfoldercollapse", this.vTaskList[i].getOpen() == 1 ? "-" : "+");
          this.vTaskList[i].setGroupSpan(vTmpSpan);
          addFolderListeners(this, vTmpSpan, vID);

          const divTask = document.createElement("span");
          divTask.innerHTML = "\u00A0" + this.vTaskList[i].getName();
          vTmpDiv.appendChild(divTask);
          // const text = makeInput(this.vTaskList[i].getName(), this.vEditable, 'text');
          // vTmpDiv.appendChild(document.createNode(text));
          const callback = (task, e) => task.setName(e.target.value);
          addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList, i, "taskname", this.Draw.bind(this));
          addListenerClickCell(vTmpDiv, this.vEvents, this.vTaskList[i], "taskname");
        } else {
          vCellContents += "\u00A0\u00A0\u00A0\u00A0";
          const text = makeInput(this.vTaskList[i].getName(), this.vEditable, "text");
          let vTmpDiv = newNode(vTmpCell, "div", null, null, vCellContents + text);
          const callback = (task, e) => task.setName(e.target.value);
          addListenerInputCell(vTmpCell, this.vEventsChange, callback, this.vTaskList, i, "taskname", this.Draw.bind(this));
          addListenerClickCell(vTmpCell, this.vEvents, this.vTaskList[i], "taskname");
        }

        this.getColumnOrder().forEach((column) => {
          if (this[column] == 1 || column === "vAdditionalHeaders") {
            draw_header(
              column,
              i,
              vTmpRow,
              this.vTaskList,
              this.vEditable,
              this.vEventsChange,
              this.vEvents,
              this.vDateTaskTableDisplayFormat,
              this.vAdditionalHeaders,
              this.vFormat,
              this.vLangs,
              this.vLang,
              this.vResources,
              this.Draw.bind(this)
            );
          }
        });

        vNumRows++;
      }
    }

    // Render no daa in the chart
    if (this.vTaskList.length == 0) {
      let totalColumns = this.getColumnOrder().filter((column) => this[column] == 1 || column === "vAdditionalHeaders").length;
      let vTmpRow = newNode(vTmpContentTBody, "tr", this.vDivId + "child_", "gname ");
      // this.vTaskList[i].setListChildRow(vTmpRow);
      let vTmpCell = newNode(vTmpRow, "td", null, "gtasknolist", "", null, null, null, totalColumns);
      let vOutput = document.createDocumentFragment();
      newNode(vOutput, "div", null, "gtasknolist-label", this.vLangs[this.vLang]["nodata"] + ".");
      vTmpCell.appendChild(vOutput);
    }
    // DRAW the date format selector at bottom left.
    let vTmpRow = newNode(vTmpContentTBody, "tr");
    newNode(vTmpRow, "td", null, "gtasklist", "\u00A0");
    let vTmpCell = newNode(vTmpRow, "td", null, "gspanning gtaskname");
    vTmpCell.appendChild(this.drawSelector("bottom"));

    this.getColumnOrder().forEach((column) => {
      if (this[column] == 1 || column === "vAdditionalHeaders") {
        draw_bottom(column, vTmpRow, this.vAdditionalHeaders);
      }
    });

    // Add some white space so the vertical scroll distance should always be greater
    // than for the right pane (keep to a minimum as it is seen in unconstrained height designs)
    // newNode(vTmpDiv2, 'br');
    // newNode(vTmpDiv2, 'br');

    return {
      vNumRows,
      vTmpContentTabWrapper,
    };
  };

  /**
   *
   * DRAW CHAR HEAD
   *
   */
  this.drawChartHead = function (vMinDate, vMaxDate, vColWidth, vNumRows) {
    let vRightHeader = document.createDocumentFragment();
    let vTmpDiv = newNode(vRightHeader, "div", this.vDivId + "gcharthead", "gchartlbl gcontainercol");
    const gChartLbl = vTmpDiv;
    this.setChartHead(vTmpDiv);
    let vTmpTab = newNode(vTmpDiv, "table", this.vDivId + "chartTableh", "gcharttableh");
    let vTmpTBody = newNode(vTmpTab, "tbody");
    let vTmpRow = newNode(vTmpTBody, "tr");

    let vTmpDate = new Date();
    vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
    if (this.vFormat == "hour") vTmpDate.setHours(vMinDate.getHours());
    else vTmpDate.setHours(0);
    vTmpDate.setMinutes(0);
    vTmpDate.setSeconds(0);
    vTmpDate.setMilliseconds(0);

    let vColSpan = 1;
    // Major Date Header
    while (vTmpDate.getTime() <= vMaxDate.getTime()) {
      let vHeaderCellClass = "gmajorheading";
      let vCellContents = "";

      if (this.vFormat == "day") {
        let colspan = 7;
        if (!this.vShowWeekends) {
          vHeaderCellClass += " headweekends";
          colspan = 5;
        }

        let vTmpCell = newNode(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, colspan);
        vCellContents += formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);
        vTmpDate.setDate(vTmpDate.getDate() + 6);

        if (this.vShowEndWeekDate == 1) vCellContents += " - " + formatDateStr(vTmpDate, this.vDayMajorDateDisplayFormat, this.vLangs[this.vLang]);

        newNode(vTmpCell, "div", null, null, vCellContents, vColWidth * colspan);

        vTmpDate.setDate(vTmpDate.getDate() + 1);
      } else if (this.vFormat == "week") {
        const vTmpCell = newNode(vTmpRow, "td", null, vHeaderCellClass, null, vColWidth);
        newNode(vTmpCell, "div", null, null, formatDateStr(vTmpDate, this.vWeekMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
        vTmpDate.setDate(vTmpDate.getDate() + 7);
      } else if (this.vFormat == "month") {
        vColSpan = 12 - vTmpDate.getMonth();
        if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= 11 - vMaxDate.getMonth();
        const vTmpCell = newNode(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, vColSpan);
        newNode(vTmpCell, "div", null, null, formatDateStr(vTmpDate, this.vMonthMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
        vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
      } else if (this.vFormat == "quarter") {
        vColSpan = 4 - Math.floor(vTmpDate.getMonth() / 3);
        if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= 3 - Math.floor(vMaxDate.getMonth() / 3);
        const vTmpCell = newNode(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, vColSpan);
        newNode(vTmpCell, "div", null, null, formatDateStr(vTmpDate, this.vQuarterMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
        vTmpDate.setFullYear(vTmpDate.getFullYear() + 1, 0, 1);
      } else if (this.vFormat == "hour") {
        vColSpan = 24 - vTmpDate.getHours();
        if (vTmpDate.getFullYear() == vMaxDate.getFullYear() && vTmpDate.getMonth() == vMaxDate.getMonth() && vTmpDate.getDate() == vMaxDate.getDate()) vColSpan -= 23 - vMaxDate.getHours();
        const vTmpCell = newNode(vTmpRow, "td", null, vHeaderCellClass, null, null, null, null, vColSpan);
        newNode(vTmpCell, "div", null, null, formatDateStr(vTmpDate, this.vHourMajorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth * vColSpan);
        vTmpDate.setHours(0);
        vTmpDate.setDate(vTmpDate.getDate() + 1);
      }
    }

    vTmpRow = newNode(vTmpTBody, "tr", null, "footerdays");

    // Minor Date header and Cell Rows
    vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate()); // , vMinDate.getHours()
    if (this.vFormat == "hour") vTmpDate.setHours(vMinDate.getHours());
    let vNumCols: number = 0;

    while (vTmpDate.getTime() <= vMaxDate.getTime()) {
      let vMinorHeaderCellClass = "gminorheading";

      if (this.vFormat == "day") {
        if (vTmpDate.getDay() % 6 == 0) {
          if (!this.vShowWeekends) {
            vTmpDate.setDate(vTmpDate.getDate() + 1);
            continue;
          }
          vMinorHeaderCellClass += "wkend";
        }

        if (vTmpDate <= vMaxDate) {
          const vTmpCell = newNode(vTmpRow, "td", null, vMinorHeaderCellClass);
          newNode(vTmpCell, "div", null, null, formatDateStr(vTmpDate, this.vDayMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
          vNumCols++;
        }

        vTmpDate.setDate(vTmpDate.getDate() + 1);
      } else if (this.vFormat == "week") {
        if (vTmpDate <= vMaxDate) {
          const vTmpCell = newNode(vTmpRow, "td", null, vMinorHeaderCellClass);
          newNode(vTmpCell, "div", null, null, formatDateStr(vTmpDate, this.vWeekMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
          vNumCols++;
        }

        vTmpDate.setDate(vTmpDate.getDate() + 7);
      } else if (this.vFormat == "month") {
        if (vTmpDate <= vMaxDate) {
          const vTmpCell = newNode(vTmpRow, "td", null, vMinorHeaderCellClass);
          newNode(vTmpCell, "div", null, null, formatDateStr(vTmpDate, this.vMonthMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
          vNumCols++;
        }

        vTmpDate.setDate(vTmpDate.getDate() + 1);

        while (vTmpDate.getDate() > 1) {
          vTmpDate.setDate(vTmpDate.getDate() + 1);
        }
      } else if (this.vFormat == "quarter") {
        if (vTmpDate <= vMaxDate) {
          const vTmpCell = newNode(vTmpRow, "td", null, vMinorHeaderCellClass);
          newNode(vTmpCell, "div", null, null, formatDateStr(vTmpDate, this.vQuarterMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
          vNumCols++;
        }

        vTmpDate.setDate(vTmpDate.getDate() + 81);

        while (vTmpDate.getDate() > 1) vTmpDate.setDate(vTmpDate.getDate() + 1);
      } else if (this.vFormat == "hour") {
        for (let i = vTmpDate.getHours(); i < 24; i++) {
          vTmpDate.setHours(i); //works around daylight savings but may look a little odd on days where the clock goes forward
          if (vTmpDate <= vMaxDate) {
            const vTmpCell = newNode(vTmpRow, "td", null, vMinorHeaderCellClass);
            newNode(vTmpCell, "div", null, null, formatDateStr(vTmpDate, this.vHourMinorDateDisplayFormat, this.vLangs[this.vLang]), vColWidth);
            vNumCols++;
          }
        }
        vTmpDate.setHours(0);
        vTmpDate.setDate(vTmpDate.getDate() + 1);
      }
    }
    const vDateRow = vTmpRow;

    // Calculate size of grids  : Plus 3 because 1 border left + 2 of paddings
    let vTaskLeftPx = vNumCols * (vColWidth + 3) + 1;
    // Fix a small space at the end for day
    if (this.vFormat === "day") {
      vTaskLeftPx += 2;
    }
    vTmpTab.style.width = vTaskLeftPx + "px"; // Ensure that the headings has exactly the same width as the chart grid
    // const vTaskPlanLeftPx = (vNumCols * (vColWidth + 3)) + 1;
    let vSingleCell = false;

    if (this.vUseSingleCell !== 0 && this.vUseSingleCell < vNumCols * vNumRows) vSingleCell = true;

    newNode(vTmpDiv, "div", null, "rhscrpad", null, null, vTaskLeftPx + 1);

    vTmpDiv = newNode(vRightHeader, "div", null, "glabelfooter");

    return { gChartLbl, vTaskLeftPx, vSingleCell, vDateRow, vRightHeader, vNumCols };
  };

  /**
   *
   * DRAW CHART BODY
   *
   */
  this.drawCharBody = function (vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl, vMinDate, vMaxDate, vSingleCell, vNumCols, vColWidth, vDateRow) {
    let vRightTable = document.createDocumentFragment();
    const vTmpDiv = newNode(vRightTable, "div", this.vDivId + "gchartbody", "gchartgrid gcontainercol");
    this.setChartBody(vTmpDiv);
    const vTmpTab = newNode(vTmpDiv, "table", this.vDivId + "chartTable", "gcharttable", null, vTaskLeftPx);
    this.setChartTable(vTmpTab);
    newNode(vTmpDiv, "div", null, "rhscrpad", null, null, vTaskLeftPx + 1);
    const vTmpTBody = newNode(vTmpTab, "tbody");
    const vTmpTFoot = newNode(vTmpTab, "tfoot");

    syncScroll([vTmpContentTabWrapper, vTmpDiv], "scrollTop");
    syncScroll([gChartLbl, vTmpDiv], "scrollLeft");
    syncScroll([vTmpContentTabWrapper, gListLbl], "scrollLeft");

    // Draw each row

    let i = 0;
    let j = 0;
    let bd;
    if (this.vDebug) {
      bd = new Date();
      console.info("before tasks loop", bd);
    }
    for (i = 0; i < this.vTaskList.length; i++) {
      let curTaskStart = this.vTaskList[i].getStart() ? this.vTaskList[i].getStart() : this.vTaskList[i].getPlanStart();
      let curTaskEnd = this.vTaskList[i].getEnd() ? this.vTaskList[i].getEnd() : this.vTaskList[i].getPlanEnd();

      const vTaskLeftPx = getOffset(vMinDate, curTaskStart, vColWidth, this.vFormat, this.vShowWeekends);
      const vTaskRightPx = getOffset(curTaskStart, curTaskEnd, vColWidth, this.vFormat, this.vShowWeekends);

      let curTaskPlanStart, curTaskPlanEnd;

      curTaskPlanStart = this.vTaskList[i].getPlanStart();
      curTaskPlanEnd = this.vTaskList[i].getPlanEnd();
      let vTaskPlanLeftPx = 0;
      let vTaskPlanRightPx = 0;
      if (curTaskPlanStart && curTaskPlanEnd) {
        vTaskPlanLeftPx = getOffset(vMinDate, curTaskPlanStart, vColWidth, this.vFormat, this.vShowWeekends);
        vTaskPlanRightPx = getOffset(curTaskPlanStart, curTaskPlanEnd, vColWidth, this.vFormat, this.vShowWeekends);
      }

      const vID = this.vTaskList[i].getID();
      let vComb = this.vTaskList[i].getParItem() && this.vTaskList[i].getParItem().getGroup() == 2;
      let vCellFormat = "";
      let vTmpDiv = null;
      let vTmpItem = this.vTaskList[i];
      let vCaptClass = null;
      // set cell width only for first row because of table-layout:fixed
      let taskCellWidth = i === 0 ? vColWidth : null;
      if (this.vTaskList[i].getMile() && !vComb) {
        let vTmpRow = newNode(vTmpTBody, "tr", this.vDivId + "childrow_" + vID, "gmileitem gmile" + this.vFormat, null, null, null, this.vTaskList[i].getVisible() == 0 ? "none" : null);
        this.vTaskList[i].setChildRow(vTmpRow);
        addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);

        const vTmpCell = newNode(vTmpRow, "td", null, "gtaskcell gtaskcellmile", null, vColWidth, null, null, null);

        vTmpDiv = newNode(vTmpCell, "div", null, "gtaskcelldiv", "\u00A0\u00A0");
        vTmpDiv = newNode(vTmpDiv, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer", null, 12, vTaskLeftPx + vTaskRightPx - 6);

        this.vTaskList[i].setBarDiv(vTmpDiv);
        let vTmpDiv2 = newNode(vTmpDiv, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getClass(), null, 12);
        this.vTaskList[i].setTaskDiv(vTmpDiv2);

        if (this.vTaskList[i].getCompVal() < 100) vTmpDiv2.appendChild(document.createTextNode("\u25CA"));
        else {
          vTmpDiv2 = newNode(vTmpDiv2, "div", null, "gmilediamond");
          newNode(vTmpDiv2, "div", null, "gmdtop");
          newNode(vTmpDiv2, "div", null, "gmdbottom");
        }

        vCaptClass = "gmilecaption";
        if (!vSingleCell && !vComb) {
          this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
        }
      } else {
        let vTaskWidth = vTaskRightPx;

        // Draw Group Bar which has outer div with inner group div
        // and several small divs to left and right to create angled-end indicators
        if (this.vTaskList[i].getGroup()) {
          vTaskWidth = vTaskWidth > this.vMinGpLen && vTaskWidth < this.vMinGpLen * 2 ? this.vMinGpLen * 2 : vTaskWidth; // Expand to show two end points
          vTaskWidth = vTaskWidth < this.vMinGpLen ? this.vMinGpLen : vTaskWidth; // expand to show one end point

          const vTmpRow = newNode(
            vTmpTBody,
            "tr",
            this.vDivId + "childrow_" + vID,
            (this.vTaskList[i].getGroup() == 2 ? "glineitem gitem" : "ggroupitem ggroup") + this.vFormat,
            null,
            null,
            null,
            this.vTaskList[i].getVisible() == 0 ? "none" : null
          );
          this.vTaskList[i].setChildRow(vTmpRow);
          addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);

          const vTmpCell = newNode(vTmpRow, "td", null, "gtaskcell gtaskcellbar", null, vColWidth, null, null);

          vTmpDiv = newNode(vTmpCell, "div", null, "gtaskcelldiv", "\u00A0\u00A0");
          this.vTaskList[i].setCellDiv(vTmpDiv);
          if (this.vTaskList[i].getGroup() == 1) {
            vTmpDiv = newNode(vTmpDiv, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer", null, vTaskWidth, vTaskLeftPx);
            this.vTaskList[i].setBarDiv(vTmpDiv);
            const vTmpDiv2 = newNode(vTmpDiv, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getClass(), null, vTaskWidth);
            this.vTaskList[i].setTaskDiv(vTmpDiv2);

            newNode(vTmpDiv2, "div", this.vDivId + "complete_" + vID, this.vTaskList[i].getClass() + "complete", null, this.vTaskList[i].getCompStr());

            newNode(vTmpDiv, "div", null, this.vTaskList[i].getClass() + "endpointleft");
            if (vTaskWidth >= this.vMinGpLen * 2) newNode(vTmpDiv, "div", null, this.vTaskList[i].getClass() + "endpointright");

            vCaptClass = "ggroupcaption";
          }

          if (!vSingleCell && !vComb) {
            this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
          }
        } else {
          vTaskWidth = vTaskWidth <= 0 ? 1 : vTaskWidth;

          /**
           * DRAW THE BOXES FOR GANTT
           */
          let vTmpDivCell, vTmpRow;
          if (vComb) {
            vTmpDivCell = vTmpDiv = this.vTaskList[i].getParItem().getCellDiv();
          } else {
            // Draw Task Bar which has colored bar div
            var differentDatesHighlight = "";
            if (this.vTaskList[i].getEnd() && this.vTaskList[i].getPlanEnd() && this.vTaskList[i].getStart() && this.vTaskList[i].getPlanStart())
              if (Date.parse(this.vTaskList[i].getEnd()) !== Date.parse(this.vTaskList[i].getPlanEnd()) || Date.parse(this.vTaskList[i].getStart()) !== Date.parse(this.vTaskList[i].getPlanStart()))
                differentDatesHighlight = "gitemdifferent ";
            vTmpRow = newNode(vTmpTBody, "tr", this.vDivId + "childrow_" + vID, `glineitem ${differentDatesHighlight}gitem` + this.vFormat, null, null, null, this.vTaskList[i].getVisible() == 0 ? "none" : null);
            this.vTaskList[i].setChildRow(vTmpRow);
            addThisRowListeners(this, this.vTaskList[i].getListChildRow(), vTmpRow);

            const vTmpCell = newNode(vTmpRow, "td", null, "gtaskcell gtaskcellcolorbar", null, taskCellWidth, null, null);
            vTmpDivCell = vTmpDiv = newNode(vTmpCell, "div", null, "gtaskcelldiv", "\u00A0\u00A0");
          }

          // DRAW TASK BAR
          vTmpDiv = newNode(vTmpDiv, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer", null, vTaskWidth, vTaskLeftPx);
          this.vTaskList[i].setBarDiv(vTmpDiv);
          let vTmpDiv2;
          if (this.vTaskList[i].getStartVar()) {
            // textbar
            vTmpDiv2 = newNode(vTmpDiv, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getClass(), null, vTaskWidth);
            if (this.vTaskList[i].getBarText()) {
              newNode(vTmpDiv2, "span", this.vDivId + "tasktextbar_" + vID, "textbar", this.vTaskList[i].getBarText(), this.vTaskList[i].getCompRestStr());
            }
            this.vTaskList[i].setTaskDiv(vTmpDiv2);
          }

          // PLANNED
          // If exist and one of them are different, show plan bar... show if there is no real vStart as well (just plan dates)
          if (vTaskPlanLeftPx && (vTaskPlanLeftPx != vTaskLeftPx || vTaskPlanRightPx != vTaskRightPx || !this.vTaskList[i].getStartVar())) {
            const vTmpPlanDiv = newNode(vTmpDivCell, "div", this.vDivId + "bardiv_" + vID, "gtaskbarcontainer gplan", null, vTaskPlanRightPx, vTaskPlanLeftPx);
            const vTmpPlanDiv2 = newNode(vTmpPlanDiv, "div", this.vDivId + "taskbar_" + vID, this.vTaskList[i].getPlanClass() + " gplan", null, vTaskPlanRightPx);
            this.vTaskList[i].setPlanTaskDiv(vTmpPlanDiv2);
          }

          // and opaque completion div
          if (vTmpDiv2) {
            newNode(vTmpDiv2, "div", this.vDivId + "complete_" + vID, this.vTaskList[i].getClass() + "complete", null, this.vTaskList[i].getCompStr());
          }

          // caption
          if (vComb) vTmpItem = this.vTaskList[i].getParItem();
          if (!vComb || (vComb && this.vTaskList[i].getParItem().getEnd() == this.vTaskList[i].getEnd())) vCaptClass = "gcaption";

          // Background cells
          if (!vSingleCell && !vComb && vTmpRow) {
            this.drawColsChart(vNumCols, vTmpRow, taskCellWidth, vMinDate, vMaxDate);
          }
        }
      }

      if (this.getCaptionType() && vCaptClass !== null) {
        let vCaptionStr: any;
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
        newNode(vTmpDiv, "div", null, vCaptClass, vCaptionStr, 120, vCaptClass == "gmilecaption" ? 12 : 0);
      }

      // Add Task Info div for tooltip
      if (this.vTaskList[i].getTaskDiv() && vTmpDiv) {
        const vTmpDiv2 = newNode(vTmpDiv, "div", this.vDivId + "tt" + vID, null, null, null, null, "none");
        const { component, callback } = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate);
        vTmpDiv2.appendChild(component);
        addTooltipListeners(this, this.vTaskList[i].getTaskDiv(), vTmpDiv2, callback);
      }
      // Add Plan Task Info div for tooltip
      if (this.vTaskList[i].getPlanTaskDiv() && vTmpDiv) {
        const vTmpDiv2 = newNode(vTmpDiv, "div", this.vDivId + "tt" + vID, null, null, null, null, "none");
        const { component, callback } = this.createTaskInfo(this.vTaskList[i], this.vTooltipTemplate);
        vTmpDiv2.appendChild(component);
        addTooltipListeners(this, this.vTaskList[i].getPlanTaskDiv(), vTmpDiv2, callback);
      }
    }

    // Include the footer with the days/week/month...
    if (vSingleCell) {
      const vTmpTFootTRow = newNode(vTmpTFoot, "tr");
      const vTmpTFootTCell = newNode(vTmpTFootTRow, "td", null, null, null, "100%");
      const vTmpTFootTCellTable = newNode(vTmpTFootTCell, "table", null, "gcharttableh", null, "100%");
      const vTmpTFootTCellTableTBody = newNode(vTmpTFootTCellTable, "tbody");
      vTmpTFootTCellTableTBody.appendChild(vDateRow.cloneNode(true));
    } else {
      vTmpTFoot.appendChild(vDateRow.cloneNode(true));
    }

    return { vRightTable };
  };

  this.drawColsChart = function (vNumCols, vTmpRow, taskCellWidth, pStartDate = null, pEndDate = null) {
    let columnCurrentDay = null;
    // Find the Current day cell to put a different class
    if (this.vShowWeekends !== false && pStartDate && pEndDate && (this.vFormat == "day" || this.vFormat == "week")) {
      let curTaskStart = new Date(pStartDate.getTime());
      let curTaskEnd = new Date();
      let onePeriod = 3600000;
      if (this.vFormat == "day") {
        onePeriod *= 24;
      } else if (this.vFormat == "week") {
        onePeriod *= 24 * 7;
      }
      columnCurrentDay = Math.floor(calculateCurrentDateOffset(curTaskStart, curTaskEnd) / onePeriod) - 1;
    }

    for (let j = 0; j < vNumCols - 1; j++) {
      let vCellFormat = "gtaskcell gtaskcellcols";
      if (this.vShowWeekends !== false && this.vFormat == "day" && (j % 7 == 4 || j % 7 == 5)) {
        vCellFormat = "gtaskcellwkend";
      }
      //When is the column is the current day/week,give a different class
      else if ((this.vFormat == "week" || this.vFormat == "day") && j === columnCurrentDay) {
        vCellFormat = "gtaskcellcurrent";
      }
      newNode(vTmpRow, "td", null, vCellFormat, "\u00A0\u00A0", taskCellWidth);
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
    let vMaxDate = new Date();
    let vMinDate = new Date();
    let vColWidth = 0;
    let bd;

    if (this.vEvents && this.vEvents.beforeDraw) {
      this.vEvents.beforeDraw();
    }

    if (this.vDebug) {
      bd = new Date();
      console.info("before draw", bd);
    }

    // Process all tasks, reset parent date and completion % if task list has altered
    if (this.vProcessNeeded) processRows(this.vTaskList, 0, -1, 1, 1, this.getUseSort(), this.vDebug);
    this.vProcessNeeded = false;

    // get overall min/max dates plus padding
    vMinDate = getMinDate(this.vTaskList, this.vFormat, this.getMinDate() && coerceDate(this.getMinDate()));
    vMaxDate = getMaxDate(this.vTaskList, this.vFormat, this.getMaxDate() && coerceDate(this.getMaxDate()));

    // Calculate chart width variables.
    if (this.vFormat == "day") vColWidth = this.vDayColWidth;
    else if (this.vFormat == "week") vColWidth = this.vWeekColWidth;
    else if (this.vFormat == "month") vColWidth = this.vMonthColWidth;
    else if (this.vFormat == "quarter") vColWidth = this.vQuarterColWidth;
    else if (this.vFormat == "hour") vColWidth = this.vHourColWidth;

    // DRAW the Left-side of the chart (names, resources, comp%)
    let vLeftHeader = document.createDocumentFragment();

    /**
     * LIST HEAD
     */
    const gListLbl = this.drawListHead(vLeftHeader);

    /**
     * LIST BODY
     */
    const { vNumRows, vTmpContentTabWrapper } = this.drawListBody(vLeftHeader);

    /**
     * CHART HEAD
     */
    const { gChartLbl, vTaskLeftPx, vSingleCell, vRightHeader, vDateRow, vNumCols } = this.drawChartHead(vMinDate, vMaxDate, vColWidth, vNumRows);

    /**
     * CHART GRID
     */
    const { vRightTable } = this.drawCharBody(vTaskLeftPx, vTmpContentTabWrapper, gChartLbl, gListLbl, vMinDate, vMaxDate, vSingleCell, vNumCols, vColWidth, vDateRow);

    if (this.vDebug) {
      const ad = new Date();
      console.info("after tasks loop", ad, ad.getTime() - bd.getTime());
    }

    // MAIN VIEW: Appending all generated components to main view
    while (this.vDiv.hasChildNodes()) this.vDiv.removeChild(this.vDiv.firstChild);
    const vTmpDiv = newNode(this.vDiv, "div", null, "gchartcontainer");
    vTmpDiv.style.height = this.vTotalHeight;

    let leftvTmpDiv = newNode(vTmpDiv, "div", null, "gmain gmainleft");
    leftvTmpDiv.appendChild(vLeftHeader);
    // leftvTmpDiv.appendChild(vLeftTable);

    let rightvTmpDiv = newNode(vTmpDiv, "div", null, "gmain gmainright");
    rightvTmpDiv.appendChild(vRightHeader);
    rightvTmpDiv.appendChild(vRightTable);

    vTmpDiv.appendChild(leftvTmpDiv);
    vTmpDiv.appendChild(rightvTmpDiv);

    newNode(vTmpDiv, "div", null, "ggridfooter");
    const vTmpDiv2 = newNode(this.getChartBody(), "div", this.vDivId + "Lines", "glinediv");
    if (this.vEvents.onLineContainerHover && typeof this.vEvents.onLineContainerHover === "function") {
      addListener("mouseover", this.vEvents.onLineContainerHover, vTmpDiv2);
      addListener("mouseout", this.vEvents.onLineContainerHover, vTmpDiv2);
    }
    vTmpDiv2.style.visibility = "hidden";
    this.setLines(vTmpDiv2);

    /* Quick hack to show the generated HTML on older browsers
          let tmpGenSrc=document.createElement('textarea');
          tmpGenSrc.appendChild(document.createTextNode(vTmpDiv.innerHTML));
          vDiv.appendChild(tmpGenSrc);
    //*/

    // LISTENERS: Now all the content exists, register scroll listeners
    addScrollListeners(this);

    // SCROLL: now check if we are actually scrolling the pane
    if (this.vScrollTo != "") {
      let vScrollDate = new Date(vMinDate.getTime());
      let vScrollPx = 0;

      if (this.vScrollTo.substr && this.vScrollTo.substr(0, 2) == "px") {
        vScrollPx = parseInt(this.vScrollTo.substr(2));
      } else {
        if (this.vScrollTo === "today") {
          vScrollDate = new Date();
        } else if (this.vScrollTo instanceof Date) {
          vScrollDate = this.vScrollTo;
        } else {
          vScrollDate = parseDateStr(this.vScrollTo, this.getDateInputFormat());
        }

        if (this.vFormat == "hour") vScrollDate.setMinutes(0, 0, 0);
        else vScrollDate.setHours(0, 0, 0, 0);
        vScrollPx = getOffset(vMinDate, vScrollDate, vColWidth, this.vFormat, this.vShowWeekends) - 30;
      }
      this.getChartBody().scrollLeft = vScrollPx;
    }

    if (vMinDate.getTime() <= new Date().getTime() && vMaxDate.getTime() >= new Date().getTime()) {
      this.vTodayPx = getOffset(vMinDate, new Date(), vColWidth, this.vFormat, this.vShowWeekends);
    } else this.vTodayPx = -1;

    // DEPENDENCIES: Draw lines of Dependencies
    let bdd;
    if (this.vDebug) {
      bdd = new Date();
      console.info("before DrawDependencies", bdd);
    }
    if (this.vEvents && typeof this.vEvents.beforeLineDraw === "function") {
      this.vEvents.beforeLineDraw();
    }
    this.DrawDependencies(this.vDebug);
    addListenerDependencies(this.vLineOptions);

    // EVENTS
    if (this.vEvents && typeof this.vEvents.afterLineDraw === "function") {
      this.vEvents.afterLineDraw();
    }
    if (this.vDebug) {
      const ad = new Date();
      console.info("after DrawDependencies", ad, ad.getTime() - bdd.getTime());
    }

    this.drawComplete(vMinDate, vColWidth, bd);
  };

  /**
   * Actions after all the render process
   */
  this.drawComplete = function (vMinDate, vColWidth, bd) {
    if (this.vDebug) {
      const ad = new Date();
      console.info("after draw", ad, ad.getTime() - bd.getTime());
    }

    updateGridHeaderWidth(this);
    this.chartRowDateToX = function (date) {
      return getOffset(vMinDate, date, vColWidth, this.vFormat, this.vShowWeekends);
    };

    if (this.vEvents && this.vEvents.afterDraw) {
      this.vEvents.afterDraw();
    }
  };

  if (this.vDiv && this.vDiv.nodeName && this.vDiv.nodeName.toLowerCase() == "div") this.vDivId = this.vDiv.id;
}; //GanttChart
