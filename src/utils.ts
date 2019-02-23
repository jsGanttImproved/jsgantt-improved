
export const internalProperties = ['pID','pName','pStart','pEnd','pClass','pLink','pMile','pRes','pComp','pGroup','pParent',
'pOpen','pDepend','pCaption','pNotes','pGantt','pCost','pPlanStart','pPlanEnd'];

export const getMinDate = function (pList, pFormat) {
  let vDate = new Date();
  vDate.setTime(pList[0].getStart().getTime());

  // Parse all Task End dates to find min
  for (let i = 0; i < pList.length; i++) {
    if (pList[i].getStart().getTime() < vDate.getTime()) vDate.setTime(pList[i].getStart().getTime());
  }

  // Adjust min date to specific format boundaries (first of week or first of month)
  if (pFormat == 'day') {
    vDate.setDate(vDate.getDate() - 1);
    while (vDate.getDay() % 7 != 1) vDate.setDate(vDate.getDate() - 1);
  }
  else if (pFormat == 'week') {
    vDate.setDate(vDate.getDate() - 1);
    while (vDate.getDay() % 7 != 1) vDate.setDate(vDate.getDate() - 1);
  }
  else if (pFormat == 'month') {
    vDate.setDate(vDate.getDate() - 15);
    while (vDate.getDate() > 1) vDate.setDate(vDate.getDate() - 1);
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
    while (vDate.getHours() % 6 != 0) vDate.setHours(vDate.getHours() - 1);
  }

  if (pFormat == 'hour') vDate.setMinutes(0, 0);
  else vDate.setHours(0, 0, 0);
  return (vDate);
};

export const getMaxDate = function (pList, pFormat) {
  let vDate = new Date();

  vDate.setTime(pList[0].getEnd().getTime());

  // Parse all Task End dates to find max
  for (let i = 0; i < pList.length; i++) {
    if (pList[i].getEnd().getTime() > vDate.getTime()) vDate.setTime(pList[i].getEnd().getTime());
  }

  // Adjust max date to specific format boundaries (end of week or end of month)
  if (pFormat == 'day') {
    vDate.setDate(vDate.getDate() + 1);

    while (vDate.getDay() % 7 != 0) vDate.setDate(vDate.getDate() + 1);
  }
  else if (pFormat == 'week') {
    //For weeks, what is the last logical boundary?
    vDate.setDate(vDate.getDate() + 1);

    while (vDate.getDay() % 7 != 0) vDate.setDate(vDate.getDate() + 1);
  }
  else if (pFormat == 'month') {
    // Set to last day of current Month
    while (vDate.getDate() > 1) vDate.setDate(vDate.getDate() + 1);
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
    if (vDate.getHours() == 0) vDate.setDate(vDate.getDate() + 1);
    vDate.setHours(vDate.getHours() + 1);

    while (vDate.getHours() % 6 != 5) vDate.setHours(vDate.getHours() + 1);
  }
  return (vDate);
};


export const findObj = function (theObj, theDoc = null) {
  let p, i, foundObj;
  if (!theDoc) theDoc = document;
  if (document.getElementById) foundObj = document.getElementById(theObj);
  return foundObj;
};

export const changeFormat = function (pFormat, ganttObj) {
  if (ganttObj) ganttObj.setFormat(pFormat);
  else alert('Chart undefined');
};

export const parseDateStr = function (pDateStr, pFormatStr) {
  let vDate = new Date();
  let vDateParts = pDateStr.split(/[^0-9]/);
  if (pDateStr.length >= 10 && vDateParts.length >= 3) {
    while (vDateParts.length < 5) vDateParts.push(0);

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

export const formatDateStr = function (pDate, pDateFormatArr, pL) {
  let vDateStr = '';

  let vYear2Str = pDate.getFullYear().toString().substring(2, 4);
  let vMonthStr = (pDate.getMonth() + 1) + '';
  let vMonthArr = new Array(pL['january'], pL['february'], pL['march'], pL['april'], pL['maylong'], pL['june'], pL['july'], pL['august'], pL['september'], pL['october'], pL['november'], pL['december']);
  let vDayArr = new Array(pL['sunday'], pL['monday'], pL['tuesday'], pL['wednesday'], pL['thursday'], pL['friday'], pL['saturday']);
  let vMthArr = new Array(pL['jan'], pL['feb'], pL['mar'], pL['apr'], pL['may'], pL['jun'], pL['jul'], pL['aug'], pL['sep'], pL['oct'], pL['nov'], pL['dec']);
  let vDyArr = new Array(pL['sun'], pL['mon'], pL['tue'], pL['wed'], pL['thu'], pL['fri'], pL['sat']);

  for (let i = 0; i < pDateFormatArr.length; i++) {
    switch (pDateFormatArr[i]) {
      case 'dd':
        if (pDate.getDate() < 10) vDateStr += '0'; // now fall through
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
        if (parseInt(vMonthStr, 10) < 10) vDateStr += '0'; // now fall through
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
        if ((((pDate.getHours() % 12) == 0) ? 12 : pDate.getHours() % 12) < 10) vDateStr += '0'; // now fall through
      case 'h':
        vDateStr += ((pDate.getHours() % 12) == 0) ? 12 : pDate.getHours() % 12;
        break;
      case 'HH':
        if ((pDate.getHours()) < 10) vDateStr += '0'; // now fall through
      case 'H':
        vDateStr += (pDate.getHours());
        break;
      case 'MI':
        if (pDate.getMinutes() < 10) vDateStr += '0'; // now fall through
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
        if (getIsoWeek(pDate) < 10) vDateStr += '0'; // now fall through
      case 'w':
        vDateStr += getIsoWeek(pDate);
        break;
      case 'week':
        let vWeekNum = getIsoWeek(pDate);
        let vYear = pDate.getFullYear();
        let vDayOfWeek = (pDate.getDay() == 0) ? 7 : pDate.getDay();
        if (vWeekNum >= 52 && parseInt(vMonthStr, 10) === 1) vYear--;
        if (vWeekNum == 1 && parseInt(vMonthStr, 10) === 12) vYear++;
        if (vWeekNum < 10) vWeekNum = parseInt('0' + vWeekNum, 10);

        vDateStr += vYear + '-W' + vWeekNum + '-' + vDayOfWeek;
        break;
      default:
        if (pL[pDateFormatArr[i].toLowerCase()]) vDateStr += pL[pDateFormatArr[i].toLowerCase()];
        else vDateStr += pDateFormatArr[i];
        break;
    }
  }
  return vDateStr;
};

export const parseDateFormatStr = function (pFormatStr) {
  let vComponantStr = '';
  let vCurrChar = '';
  let vSeparators = new RegExp('[\/\\ -.,\'":]');
  let vDateFormatArray = new Array();

  for (let i = 0; i < pFormatStr.length; i++) {
    vCurrChar = pFormatStr.charAt(i);
    if ((vCurrChar.match(vSeparators)) || (i + 1 == pFormatStr.length)) // separator or end of string
    {
      if ((i + 1 == pFormatStr.length) && (!(vCurrChar.match(vSeparators)))) // at end of string add any non-separator chars to the current component
      {
        vComponantStr += vCurrChar;
      }
      vDateFormatArray.push(vComponantStr);
      if (vCurrChar.match(vSeparators)) vDateFormatArray.push(vCurrChar);
      vComponantStr = '';
    }
    else {
      vComponantStr += vCurrChar;
    }

  }
  return vDateFormatArray;
};


export const stripIds = function (pNode) {
  for (let i = 0; i < pNode.childNodes.length; i++) {
    if ('removeAttribute' in pNode.childNodes[i]) pNode.childNodes[i].removeAttribute('id');
    if (pNode.childNodes[i].hasChildNodes()) stripIds(pNode.childNodes[i]);
  }
};

export const stripUnwanted = function (pNode) {
  let vAllowedTags = new Array('#text', 'p', 'br', 'ul', 'ol', 'li', 'div', 'span', 'img');
  for (let i = 0; i < pNode.childNodes.length; i++) {
    /* versions of IE<9 don't support indexOf on arrays so add trailing comma to the joined array and lookup value to stop substring matches */
    if ((vAllowedTags.join().toLowerCase() + ',').indexOf(pNode.childNodes[i].nodeName.toLowerCase() + ',') == -1) {
      pNode.replaceChild(document.createTextNode(pNode.childNodes[i].outerHTML), pNode.childNodes[i]);
    }
    if (pNode.childNodes[i].hasChildNodes()) stripUnwanted(pNode.childNodes[i]);
  }
};

export const delayedHide = function (pGanttChartObj, pTool, pTimer) {
  let vDelay = pGanttChartObj.getTooltipDelay() || 1500;
  if (pTool) pTool.delayTimeout = setTimeout(function () { hideToolTip(pGanttChartObj, pTool, pTimer); }, vDelay);
};

export const getZoomFactor = function () {
  let vFactor = 1;
  if (document.body.getBoundingClientRect) {
    // rect is only in physical pixel size in IE before version 8
    let vRect = document.body.getBoundingClientRect();
    let vPhysicalW = vRect.right - vRect.left;
    let vLogicalW = document.body.offsetWidth;

    // the zoom level is always an integer percent value
    vFactor = Math.round((vPhysicalW / vLogicalW) * 100) / 100;
  }
  return vFactor;
};


export const benchMark = function (pItem) {
  let vEndTime = new Date().getTime();
  alert(pItem + ': Elapsed time: ' + ((vEndTime - this.vBenchTime) / 1000) + ' seconds.');
  this.vBenchTime = new Date().getTime();
};

export const getIsoWeek = function (pDate) {
  // We have to compare against the monday of the first week of the year containing 04 jan *not* 01/01
  // 60*60*24*1000=86400000
  let dayMiliseconds = 86400000;
  let keyDay = new Date(pDate.getFullYear(), 0, 4, 0, 0, 0);
  let keyDayOfWeek = (keyDay.getDay() == 0) ? 6 : keyDay.getDay() - 1; // define monday as 0
  let firstMondayYearTime = keyDay.getTime() - (keyDayOfWeek * dayMiliseconds);
  let thisDate = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate(), 0, 0, 0); // This at 00:00:00
  let thisTime = thisDate.getTime();
  let daysFromFirstMonday = Math.round(((thisTime - firstMondayYearTime) / dayMiliseconds));
  let lastWeek = 99;
  let thisWeek = 99;

  let firstMondayYear = new Date(firstMondayYearTime);

  thisWeek = Math.ceil((daysFromFirstMonday + 1) / 7);

  if (thisWeek <= 0) thisWeek = getIsoWeek(new Date(pDate.getFullYear() - 1, 11, 31, 0, 0, 0));
  else if (thisWeek == 53 && (new Date(pDate.getFullYear(), 0, 1, 0, 0, 0)).getDay() != 4 && (new Date(pDate.getFullYear(), 11, 31, 0, 0, 0)).getDay() != 4) thisWeek = 1;
  return thisWeek;
};

export const getScrollPositions = function () {
  let vScrollLeft = window.pageXOffset;
  let vScrollTop = window.pageYOffset;
  if (!('pageXOffset' in window))	// Internet Explorer before version 9
  {
    let vZoomFactor = getZoomFactor();
    vScrollLeft = Math.round(document.documentElement.scrollLeft / vZoomFactor);
    vScrollTop = Math.round(document.documentElement.scrollTop / vZoomFactor);
  }
  return { x: vScrollLeft, y: vScrollTop };
};

export const getOffset = function (pStartDate, pEndDate, pColWidth, pFormat) {
  const DAY_CELL_MARGIN_WIDTH = 3; // Cell margin for 'day' format
  const WEEK_CELL_MARGIN_WIDTH = 3; // Cell margin for 'week' format
  const MONTH_CELL_MARGIN_WIDTH = 1; // Cell margin for 'month' format
  const QUARTER_CELL_MARGIN_WIDTH = 1; // Cell margin for 'quarter' format
  const HOUR_CELL_MARGIN_WIDTH = 3; // Cell margin for 'hour' format

  let vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  let curTaskStart = new Date(pStartDate.getTime());
  let curTaskEnd = new Date(pEndDate.getTime());
  let vTaskRightPx = 0;
  let tmpTaskStart = Date.UTC(curTaskStart.getFullYear(), curTaskStart.getMonth(), curTaskStart.getDate(), curTaskStart.getHours(), 0, 0);
  let tmpTaskEnd = Date.UTC(curTaskEnd.getFullYear(), curTaskEnd.getMonth(), curTaskEnd.getDate(), curTaskEnd.getHours(), 0, 0);

  let vTaskRight = (tmpTaskEnd - tmpTaskStart) / 3600000; // Length of task in hours

  let vPosTmpDate;
  if (pFormat == 'day') {
    vTaskRightPx = Math.ceil((vTaskRight / 24) * (pColWidth + DAY_CELL_MARGIN_WIDTH) - 1);
  }
  else if (pFormat == 'week') {
    vTaskRightPx = Math.ceil((vTaskRight / (24 * 7)) * (pColWidth + WEEK_CELL_MARGIN_WIDTH) - 1);
  }
  else if (pFormat == 'month') {
    let vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
    vPosTmpDate = new Date(curTaskEnd.getTime());
    vPosTmpDate.setDate(curTaskStart.getDate());
    let vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (86400000);

    vTaskRightPx = Math.ceil((vMonthsDiff * (pColWidth + MONTH_CELL_MARGIN_WIDTH)) + (vDaysCrctn * (pColWidth / vMonthDaysArr[curTaskEnd.getMonth()])) - 1);
  }
  else if (pFormat == 'quarter') {
    let vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
    vPosTmpDate = new Date(curTaskEnd.getTime());
    vPosTmpDate.setDate(curTaskStart.getDate());
    let vDaysCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (86400000);

    vTaskRightPx = Math.ceil((vMonthsDiff * ((pColWidth + QUARTER_CELL_MARGIN_WIDTH) / 3)) + (vDaysCrctn * (pColWidth / 90)) - 1);
  }
  else if (pFormat == 'hour') {
    // can't just calculate sum because of daylight savings changes
    vPosTmpDate = new Date(curTaskEnd.getTime());
    vPosTmpDate.setMinutes(curTaskStart.getMinutes(), 0);
    let vMinsCrctn = (curTaskEnd.getTime() - vPosTmpDate.getTime()) / (3600000);

    vTaskRightPx = Math.ceil((vTaskRight * (pColWidth + HOUR_CELL_MARGIN_WIDTH)) + (vMinsCrctn * (pColWidth)));
  }
  return vTaskRightPx;
};

export const isIE = function () {
  if (typeof document.all != 'undefined') {
    if ('pageXOffset' in window) return false;	// give IE9 and above the benefit of the doubt!
    else return true;
  }
  else return false;
};

export const hideToolTip = function (pGanttChartObj, pTool, pTimer) {
  if (pGanttChartObj.getUseFade()) {
    clearInterval(pTool.fadeInterval);
    pTool.fadeInterval = setInterval(function () { fadeToolTip(-1, pTool, 0); }, pTimer);
  }
  else {
    pTool.style.opacity = 0;
    pTool.style.filter = 'alpha(opacity=0)';
    pTool.style.visibility = 'hidden';
  }
};



export const fadeToolTip = function (pDirection, pTool, pMaxAlpha) {
  let vIncrement = parseInt(pTool.getAttribute('fadeIncrement'));
  let vAlpha = pTool.getAttribute('currentOpacity');
  let vCurAlpha = parseInt(vAlpha);
  if ((vCurAlpha != pMaxAlpha && pDirection == 1) || (vCurAlpha != 0 && pDirection == -1)) {
    let i = vIncrement;
    if (pMaxAlpha - vCurAlpha < vIncrement && pDirection == 1) {
      i = pMaxAlpha - vCurAlpha;
    } else if (vAlpha < vIncrement && pDirection == -1) {
      i = vCurAlpha;
    }
    vAlpha = vCurAlpha + (i * pDirection);
    pTool.style.opacity = vAlpha * 0.01;
    pTool.style.filter = 'alpha(opacity=' + vAlpha + ')';
    pTool.setAttribute('currentOpacity', vAlpha);
  } else {
    clearInterval(pTool.fadeInterval);
    if (pDirection == -1) {
      pTool.style.opacity = 0;
      pTool.style.filter = 'alpha(opacity=0)';
      pTool.style.visibility = 'hidden';
    }
  }
};


export const hashString = function (key) {
  if (!key) {
    key = 'default';
  }
  key += '';
  let hash = 5381;
  for (let i = 0; i < key.length; i++) {
    if (key.charCodeAt) {
      // tslint:disable-next-line:no-bitwise
      hash = (hash << 5) + hash + key.charCodeAt(i);
    }
    // tslint:disable-next-line:no-bitwise
    hash = hash & hash;
  }
  // tslint:disable-next-line:no-bitwise
  return hash >>> 0;
}

export const hashKey = function (key) {
  return this.hashString(key) % 10000;
}

export const criticalPath = function (tasks) {
  const path = {};
  // calculate duration
  tasks.forEach(task => {
    task.duration = new Date(task.pEnd).getTime() - new Date(task.pStart).getTime();
  });

  tasks.forEach(task => {
    if (!path[task.pID]) {
      path[task.pID] = task;
    }
    if (!path[task.pParent]) {
      path[task.pParent] = {
        childrens: []
      }
    }
    // console.log(path);
    if (!path[task.pID].childrens) {
      path[task.pID].childrens = [];
    }
    path[task.pParent].childrens.push(task);
    let max = path[task.pParent].childrens[0].duration;
    path[task.pParent].childrens.forEach(t => {
      if (t.duration > max) {
        max = t.duration;
      }
    });
    path[task.pParent].duration = max;
  });

  const finalNodes = { 0: path[0] };
  let node = path[0];
  while (node) {
    if (node.childrens.length > 0) {
      let found = node.childrens[0];
      let max = found.duration;
      node.childrens.forEach(c => {
        if (c.duration > max) {
          found = c;
          max = c.duration;
        }
      });
      finalNodes[found.pID] = found;
      node = found;
    } else {
      node = null;
    }
  }
}