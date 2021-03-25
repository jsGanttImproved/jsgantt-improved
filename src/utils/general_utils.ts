export const internalProperties = ['pID', 'pName', 'pStart', 'pEnd', 'pClass', 'pLink', 'pMile', 'pRes', 'pComp', 'pGroup', 'pParent',
  'pOpen', 'pDepend', 'pCaption', 'pNotes', 'pGantt', 'pCost', 'pPlanStart', 'pPlanEnd'];

export const internalPropertiesLang = {
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
  'pPlanEnd': 'planenddate'
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

let scrollbarWidth = undefined;
export const getScrollbarWidth = function () {
  if (scrollbarWidth) return scrollbarWidth;

  const outer = document.createElement('div');
  outer.className = 'gscrollbar-calculation-container';
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}

export const calculateCurrentDateOffset = function(curTaskStart, curTaskEnd){
  let tmpTaskStart = Date.UTC(curTaskStart.getFullYear(), curTaskStart.getMonth(), curTaskStart.getDate(), curTaskStart.getHours(), 0, 0);
  let tmpTaskEnd = Date.UTC(curTaskEnd.getFullYear(), curTaskEnd.getMonth(), curTaskEnd.getDate(), curTaskEnd.getHours(), 0, 0);
  return (tmpTaskEnd - tmpTaskStart);
}

export const getOffset = function (pStartDate, pEndDate, pColWidth, pFormat, pShowWeekends) {
  const DAY_CELL_MARGIN_WIDTH = 3; // Cell margin for 'day' format
  const WEEK_CELL_MARGIN_WIDTH = 3; // Cell margin for 'week' format
  const MONTH_CELL_MARGIN_WIDTH = 3; // Cell margin for 'month' format
  const QUARTER_CELL_MARGIN_WIDTH = 3; // Cell margin for 'quarter' format
  const HOUR_CELL_MARGIN_WIDTH = 3; // Cell margin for 'hour' format

  let vMonthDaysArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  let curTaskStart = new Date(pStartDate.getTime());
  let curTaskEnd = new Date(pEndDate.getTime());
  let vTaskRightPx = 0;

  // Length of task in hours
  const oneHour = 3600000;
  let vTaskRight = calculateCurrentDateOffset(curTaskStart, curTaskEnd) / oneHour ;

  let vPosTmpDate;
  if (pFormat == 'day') {
    if (!pShowWeekends) {
      let start = curTaskStart;
      let end = curTaskEnd;
      let countWeekends = 0;
      while (start < end) {
        const day = start.getDay();
        if (day === 6 || day == 0) {
          countWeekends++
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
    pTool.vToolCont.setAttribute("showing", null);
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
      pTool.vToolCont.setAttribute("showing", null);
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
  return this.hashString(key);
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

export function isParentElementOrSelf(child, parent) {
  while (child) {
    if (child === parent) return true;
    child = child.parentElement;
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
  let screenX = screen.availWidth || window.innerWidth;
  let screenY = screen.availHeight || window.innerHeight;
  let vOldX = parseInt(pGanttChartObj.vTool.style.left);
  let vOldY = parseInt(pGanttChartObj.vTool.style.top);

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
  let outViewport = Math.abs(vOldX - vNewX) > screenX || Math.abs(vOldY - vNewY) > screenY

  if (pGanttChartObj.getUseMove() && !outViewport) {
    clearInterval(pGanttChartObj.vTool.moveInterval);
    pGanttChartObj.vTool.moveInterval = setInterval(function () { moveToolTip(vNewX, vNewY, pGanttChartObj.vTool, pTimer); }, pTimer);
  }
  else {
    pGanttChartObj.vTool.style.left = vNewX + 'px';
    pGanttChartObj.vTool.style.top = vNewY + 'px';
  }
};


export const moveToolTip = function (pNewX, pNewY, pTool, timer) {
  let vSpeed = parseInt(pTool.getAttribute('moveSpeed'));
  let vOldX = parseInt(pTool.style.left);
  let vOldY = parseInt(pTool.style.top);

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

export const makeRequest = (pFile, json = true, vDebug = false) => {
  if ((<any>window).fetch) {
    const f = fetch(pFile);
    if (json) {
      return f.then(res => res.json())
    } else {
      return f;
    }
  } else {
    return makeRequestOldBrowsers(pFile, vDebug)
      .then((xhttp: any) => {
        if (json) {
          let jsonObj = JSON.parse(xhttp.response);
          return jsonObj;
        } else {
          let xmlDoc = xhttp.responseXML;
          return xmlDoc;
        }
      });
  }
};

export const makeRequestOldBrowsers = (pFile, vDebug = false) => {
  return new Promise((resolve, reject) => {

    let bd;
    if (vDebug) {
      bd = new Date();
      console.info('before jsonparse', bd);
    }

    let xhttp;
    if ((<any>window).XMLHttpRequest) {
      xhttp = new XMLHttpRequest();
    } else {	// IE 5/6
      xhttp = new (<any>window).ActiveXObject('Microsoft.XMLHTTP');
    }

    xhttp.open('GET', pFile, true);
    xhttp.send(null);

    xhttp.onload = function (e) {
      if (xhttp.readyState === 4) {
        if (xhttp.status === 200) {
          // resolve(xhttp.responseText);
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


export const calculateStartEndFromDepend = (tasksList) => {

}

export const printChart = ( width, height, css = undefined ) =>
{
  if ( css === undefined )
  {
    css = // Default injected CSS
    `@media print {
        @page {
          size: ${width}mm ${height}mm;
        }
        /* set gantt container to the same width as the page */
        .gchartcontainer {
            width: ${width}mm;
        }
    };`;
  }

  const $container = document.querySelector( '.gchartcontainer' );
  $container.insertAdjacentHTML( 'afterbegin', `<style>${css}</style>` );

  // Remove the print CSS when the print dialog is closed
  window.addEventListener( 'afterprint', () => {
    $container.removeChild( $container.children[0] );
  }, { 'once': true } );

  // Trigger the print
  window.print();
};