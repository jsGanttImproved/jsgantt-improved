import { parseDateStr, isIE, stripUnwanted, getOffset } from "./utils";

declare var g: any;

// Function to open/close and hide/show children of specified task
export const folder = function (pID, ganttObj) {
  var vList = ganttObj.getList();
  var vDivId = ganttObj.getDivId();

  ganttObj.clearDependencies(); // clear these first so slow rendering doesn't look odd

  for (var i = 0; i < vList.length; i++) {
    if (vList[i].getID() == pID) {
      if (vList[i].getOpen() == 1) {
        vList[i].setOpen(0);
        hide(pID, ganttObj);

        if (isIE())
          vList[i].getGroupSpan().innerText = '+';
        else
          vList[i].getGroupSpan().textContent = '+';
      }
      else {
        vList[i].setOpen(1);
        show(pID, 1, ganttObj);

        if (isIE())
          vList[i].getGroupSpan().innerText = '-';
        else
          vList[i].getGroupSpan().textContent = '-';
      }
    }
  }
  ganttObj.DrawDependencies();
};

export const hide = function (pID, ganttObj) {
  var vList = ganttObj.getList();
  var vID = 0;
  var vDivId = ganttObj.getDivId();

  for (var i = 0; i < vList.length; i++) {
    if (vList[i].getParent() == pID) {
      vID = vList[i].getID();
      // it's unlikely but if the task list has been updated since
      // the chart was drawn some of the rows may not exist
      if (vList[i].getListChildRow()) vList[i].getListChildRow().style.display = 'none';
      if (vList[i].getChildRow()) vList[i].getChildRow().style.display = 'none';
      vList[i].setVisible(0);
      if (vList[i].getGroup()) hide(vID, ganttObj);
    }
  }
};

// Function to show children of specified task
export const show = function (pID, pTop, ganttObj) {
  var vList = ganttObj.getList();
  var vID = 0;
  var vDivId = ganttObj.getDivId();
  var vState = '';

  for (var i = 0; i < vList.length; i++) {
    if (vList[i].getParent() == pID) {
      if (vList[i].getParItem().getGroupSpan()) {
        if (isIE()) vState = vList[i].getParItem().getGroupSpan().innerText;
        else vState = vList[i].getParItem().getGroupSpan().textContent;
      }
      i = vList.length;
    }
  }

  for (i = 0; i < vList.length; i++) {
    if (vList[i].getParent() == pID) {
      var vChgState = false;
      vID = vList[i].getID();

      if (pTop == 1 && vState == '+') vChgState = true;
      else if (vState == '-') vChgState = true;
      else if (vList[i].getParItem() && vList[i].getParItem().getGroup() == 2) vList[i].setVisible(1);

      if (vChgState) {
        if (vList[i].getListChildRow()) vList[i].getListChildRow().style.display = '';
        if (vList[i].getChildRow()) vList[i].getChildRow().style.display = '';
        vList[i].setVisible(1);
      }
      if (vList[i].getGroup()) show(vID, 0, ganttObj);
    }
  }
};

// function to open window to display task link
export const taskLink = function (pRef, pWidth, pHeight) {

  if (pWidth) var vWidth = pWidth; else vWidth = 400;
  if (pHeight) var vHeight = pHeight; else vHeight = 400;

  var OpenWindow = window.open(pRef, 'newwin', 'height=' + vHeight + ',width=' + vWidth);
};


export const sortTasks = function (pList, pID, pIdx) {
  var sortIdx = pIdx;
  var sortArr = new Array();

  for (var i = 0; i < pList.length; i++) {
    if (pList[i].getParent() == pID) sortArr.push(pList[i]);
  }

  if (sortArr.length > 0) {
    sortArr.sort(function (a, b) {
      var i = a.getStart().getTime() - b.getStart().getTime();
      if (i == 0) i = a.getEnd().getTime() - b.getEnd().getTime();
      if (i == 0) return a.getID() - b.getID();
      else return i;
    });
  }

  for (var j = 0; j < sortArr.length; j++) {
    for (i = 0; i < pList.length; i++) {
      if (pList[i].getID() == sortArr[j].getID()) {
        pList[i].setSortIdx(sortIdx++);
        sortIdx = sortTasks(pList, pList[i].getID(), sortIdx);
      }
    }
  }
  return sortIdx;
};


export const TaskItemObject = function (object) {
  return new TaskItem(object.pID,
    object.pName,
    object.pStart,
    object.pEnd,
    object.pClass,
    object.pLink,
    object.pMile,
    object.pRes,
    object.pComp,
    object.pGroup,
    object.pParent,
    object.pOpen,
    object.pDepend,
    object.pCaption,
    object.pNotes,
    object.pGantt,
    object.pCost);
}

export const TaskItem = function (pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt, pCost = null) {
  var vBenchTime = new Date().getTime();
  var vID = parseInt(document.createTextNode(pID).data);
  var vName = document.createTextNode(pName).data;
  var vStart = new Date(0);
  var vEnd = new Date(0);
  var vGroupMinStart = null;
  var vGroupMinEnd = null;
  var vClass = document.createTextNode(pClass).data;
  var vLink = document.createTextNode(pLink).data;
  var vMile = parseInt(document.createTextNode(pMile).data);
  var vRes = document.createTextNode(pRes).data;
  var vComp = parseFloat(document.createTextNode(pComp).data);
  var vCost = parseInt(document.createTextNode(pCost).data)
  var vGroup = parseInt(document.createTextNode(pGroup).data);
  var vParent = document.createTextNode(pParent).data;
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
  var vGantt = pGantt ? pGantt : g; //hack for backwards compatibility
  var vBarDiv = null;
  var vTaskDiv = null;
  var vListChildRow = null;
  var vChildRow = null;
  var vGroupSpan = null;

  vNotes = document.createElement('span');
  vNotes.className = 'gTaskNotes';
  if (pNotes != null) {
    vNotes.innerHTML = pNotes;
    stripUnwanted(vNotes);
  }

  if (pStart != null && pStart != '') {
    vStart = (pStart instanceof Date) ? pStart : parseDateStr(document.createTextNode(pStart).data, vGantt.getDateInputFormat());
    vGroupMinStart = vStart;
  }

  if (pEnd != null && pEnd != '') {
    vEnd = (pEnd instanceof Date) ? pEnd : parseDateStr(document.createTextNode(pEnd).data, vGantt.getDateInputFormat());
    vGroupMinEnd = vEnd;
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
    }
  }

  this.getID = function () { return vID; };
  this.getName = function () { return vName; };
  this.getStart = function () { return vStart; };
  this.getEnd = function () { return vEnd; };
  this.getGroupMinStart = function () { return vGroupMinStart; };
  this.getGroupMinEnd = function () { return vGroupMinEnd; };
  this.getClass = function () { return vClass; };
  this.getLink = function () { return vLink; };
  this.getMile = function () { return vMile; };
  this.getDepend = function () { if (vDepend) return vDepend; else return null; };
  this.getDepType = function () { if (vDependType) return vDependType; else return null; };
  this.getCaption = function () { if (vCaption) return vCaption; else return ''; };
  this.getResource = function () { if (vRes) return vRes; else return '\u00A0'; };
  this.getCost = function () {
    if (vCost) return vCost;
    else return 0;
  };
  this.getCompVal = function () { if (vComp) return vComp; else return 0; };
  this.getCompStr = function () { if (vComp) return vComp + '%'; else return ''; };
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
        case 'week': vUnits = 'day'; break;
        case 'month': vUnits = 'week'; break;
        case 'quarter': vUnits = 'month'; break;
        default: vUnits = pFormat; break;
      }

      if ((vTaskEnd.getTime() - (vTaskEnd.getTimezoneOffset() * 60000)) % (86400000) == 0) {
        vTaskEnd = new Date(vTaskEnd.getFullYear(), vTaskEnd.getMonth(), vTaskEnd.getDate() + 1, vTaskEnd.getHours(), vTaskEnd.getMinutes(), vTaskEnd.getSeconds());
      }
      var tmpPer = (getOffset(this.getStart(), vTaskEnd, 999, vUnits)) / 1000;
      if (Math.floor(tmpPer) != tmpPer) tmpPer = Math.round(tmpPer * 10) / 10;
      switch (vUnits) {
        case 'hour': vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['hrs'] : pLang['hr']); break;
        case 'day': vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['dys'] : pLang['dy']); break;
        case 'week': vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['wks'] : pLang['wk']); break;
        case 'month': vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['mths'] : pLang['mth']); break;
        case 'quarter': vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['qtrs'] : pLang['qtr']); break;
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
  this.setStart = function (pStart) { if (pStart instanceof Date) vStart = pStart; };
  this.setEnd = function (pEnd) { if (pEnd instanceof Date) vEnd = pEnd; };
  this.setGroupMinStart = function (pStart) { if (pStart instanceof Date) vGroupMinStart = pStart; };
  this.setGroupMinEnd = function (pEnd) { if (pEnd instanceof Date) vGroupMinEnd = pEnd; };
  this.setLevel = function (pLevel) { vLevel = parseInt(document.createTextNode(pLevel).data); };
  this.setNumKid = function (pNumKid) { vNumKid = parseInt(document.createTextNode(pNumKid).data); };
  this.setWeight = function (pWeight) { vWeight = parseInt(document.createTextNode(pWeight).data); };
  this.setCompVal = function (pCompVal) { vComp = parseFloat(document.createTextNode(pCompVal).data); };
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
  this.setToDelete = function (pToDelete) { if (pToDelete) vToDelete = true; else vToDelete = false; };
  this.setParItem = function (pParItem) { if (pParItem) vParItem = pParItem; };
  this.setCellDiv = function (pCellDiv) { if (typeof HTMLDivElement !== 'function' || pCellDiv instanceof HTMLDivElement) vCellDiv = pCellDiv; }; //"typeof HTMLDivElement !== 'function'" to play nice with ie6 and 7
  this.setGroup = function (pGroup) { vGroup = parseInt(document.createTextNode(pGroup).data); };
  this.setBarDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) vBarDiv = pDiv; };
  this.setTaskDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement) vTaskDiv = pDiv; };
  this.setChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement) vChildRow = pRow; };
  this.setListChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement) vListChildRow = pRow; };
  this.setGroupSpan = function (pSpan) { if (typeof HTMLSpanElement !== 'function' || pSpan instanceof HTMLSpanElement) vGroupSpan = pSpan; };
};

