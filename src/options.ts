import { parseDateFormatStr } from "./utils";

export const includeGetSet = function () {


  /**
   * SETTERS 
   */
  this.setOptions = function (options) {
    const keys = Object.keys(options);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = options[key];
      if (key === 'vResources') {
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
  }
  this.setUseFade = function (pVal) { this.vUseFade = pVal; };
  this.setUseMove = function (pVal) { this.vUseMove = pVal; };
  this.setUseRowHlt = function (pVal) { this.vUseRowHlt = pVal; };
  this.setUseToolTip = function (pVal) { this.vUseToolTip = pVal; };
  this.setUseSort = function (pVal) { this.vUseSort = pVal; };
  this.setUseSingleCell = function (pVal) { this.vUseSingleCell = pVal * 1; };
  this.setFormatArr = function () {
    let vValidFormats = 'hour day week month quarter';
    this.vFormatArr = new Array();
    for (let i = 0, j = 0; i < arguments.length; i++) {
      if (vValidFormats.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
        this.vFormatArr[j++] = arguments[i].toLowerCase();
        let vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
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
    let vValidSelectors = 'top bottom';
    this.vShowSelector = new Array();
    for (let i = 0, j = 0; i < arguments.length; i++) {
      if (vValidSelectors.indexOf(arguments[i].toLowerCase()) != -1 && arguments[i].length > 1) {
        this.vShowSelector[j++] = arguments[i].toLowerCase();
        let vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
        vValidSelectors = vValidSelectors.replace(vRegExp, '');
      }
    }
  };
  this.setShowDeps = function (pVal) { this.vShowDeps = pVal; };
  this.setDateInputFormat = function (pVal) { this.vDateInputFormat = pVal; };
  this.setDateTaskTableDisplayFormat = function (pVal) { this.vDateTaskTableDisplayFormat = parseDateFormatStr(pVal); };
  this.setDateTaskDisplayFormat = function (pVal) { this.vDateTaskDisplayFormat = parseDateFormatStr(pVal); };
  this.setHourMajorDateDisplayFormat = function (pVal) { this.vHourMajorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setHourMinorDateDisplayFormat = function (pVal) { this.vHourMinorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setDayMajorDateDisplayFormat = function (pVal) { this.vDayMajorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setDayMinorDateDisplayFormat = function (pVal) { this.vDayMinorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setWeekMajorDateDisplayFormat = function (pVal) { this.vWeekMajorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setWeekMinorDateDisplayFormat = function (pVal) { this.vWeekMinorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setMonthMajorDateDisplayFormat = function (pVal) { this.vMonthMajorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setMonthMinorDateDisplayFormat = function (pVal) { this.vMonthMinorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setQuarterMajorDateDisplayFormat = function (pVal) { this.vQuarterMajorDateDisplayFormat = parseDateFormatStr(pVal); };
  this.setQuarterMinorDateDisplayFormat = function (pVal) { this.vQuarterMinorDateDisplayFormat = parseDateFormatStr(pVal); };
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
  this.setLang = function (pLang) { if (this.vLangs[pLang]) this.vLang = pLang; };
  this.setChartBody = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vChartBody = pDiv; };
  this.setChartHead = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vChartHead = pDiv; };
  this.setListBody = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vListBody = pDiv; };
  this.setChartTable = function (pTable) { if (typeof HTMLTableElement !== 'function' || pTable instanceof HTMLTableElement) this.vChartTable = pTable; };
  this.setLines = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) this.vLines = pDiv; };
  this.setTimer = function (pVal) { this.vTimer = pVal * 1; };
  this.setTooltipDelay = function (pVal) { this.vTooltipDelay = pVal * 1; };
  this.addLang = function (pLang, pVals) {
    if (!this.vLangs[pLang]) {
      this.vLangs[pLang] = new Object();
      for (let vKey in this.vLangs['en']) this.vLangs[pLang][vKey] = (pVals[vKey]) ? document.createTextNode(pVals[vKey]).data : this.vLangs['en'][vKey];
    }
  };
  this.setEvents = function (pEvents) { this.vEvents = pEvents; };
  this.setEventsChange = function (pEventsChange) { this.vEventsChange = pEventsChange; };
  this.setEventClickRow = function (fn) { this.vEventClickRow = fn; };
  this.setResources = function (resources) { this.vResources = resources; };
  this.setAdditionalHeaders = function (headers) { this.vAdditionalHeaders = headers; };
  this.setEditable = function (editable) { this.vEditable = editable; }
  this.setDebug = function (debug) { this.vDebug = debug; }
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
}