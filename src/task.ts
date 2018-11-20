import { parseDateStr, isIE, stripUnwanted, getOffset, formatDateStr } from "./utils";

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

export const TaskItem = function (pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, 
  pDepend, pCaption, pNotes, pGantt, pCost = null, pPlanStart = null, pPlanEnd = null) {
  var vBenchTime = new Date().getTime();
  var vID = parseInt(document.createTextNode(pID).data);
  var vName = document.createTextNode(pName).data;
  var vStart = new Date(0);
  var vEnd = new Date(0);
  var vPlanStart = null;
  var vPlanEnd = null;
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
  var pPlanStart = pPlanStart
  pPlanStart = null, pPlanEnd


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

  if (pPlanStart != null && pPlanStart != '') {
    vPlanStart = (pPlanStart instanceof Date) ? pPlanStart : parseDateStr(document.createTextNode(pPlanStart).data, vGantt.getDateInputFormat());
    vGroupMinStart = vPlanStart;
  }

  if (pPlanEnd != null && pPlanEnd != '') {
    vPlanEnd = (pPlanEnd instanceof Date) ? pPlanEnd : parseDateStr(document.createTextNode(pPlanEnd).data, vGantt.getDateInputFormat());
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
    }
  }

  this.getID = function () { return vID; };
  this.getName = function () { return vName; };
  this.getStart = function () { return vStart; };
  this.getEnd = function () { return vEnd; };
  this.getPlanStart = function () { return vPlanStart; };
  this.getPlanEnd = function () { return vPlanEnd; };
  this.getCost = function () { return vCost; };
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
  this.setCost = function (pCost) { vCost = pCost; };
  this.setStart = function (pStart) { if (pStart instanceof Date) vStart = pStart; };
  this.setEnd = function (pEnd) { if (pEnd instanceof Date) vEnd = pEnd; };
  this.setPlanStart = function (pPlanStart) { if (pPlanStart instanceof Date) vPlanStart = pPlanStart; };
  this.setPlanEnd = function (pPlanEnd) { if (pPlanEnd instanceof Date) vPlanEnd = pPlanEnd; };
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


export const createTaskInfo = function (pTask) {
  var vTmpDiv;
  var vTaskInfoBox = document.createDocumentFragment();
  var vTaskInfo = this.newNode(vTaskInfoBox, 'div', null, 'gTaskInfo');
  this.newNode(vTaskInfo, 'span', null, 'gTtTitle', pTask.getName());
  if (this.vShowTaskInfoStartDate == 1) {
    vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIsd');
    this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['startdate'] + ': ');
    this.newNode(vTmpDiv, 'span', null, 'gTaskText', formatDateStr(pTask.getStart(), this.vDateTaskDisplayFormat, this.vLangs[this.vLang]));
  }
  if (this.vShowTaskInfoEndDate == 1) {
    vTmpDiv = this.newNode(vTaskInfo, 'div', null, 'gTILine gTIed');
    this.newNode(vTmpDiv, 'span', null, 'gTaskLabel', this.vLangs[this.vLang]['enddate'] + ': ');
    this.newNode(vTmpDiv, 'span', null, 'gTaskText', formatDateStr(pTask.getEnd(), this.vDateTaskDisplayFormat, this.vLangs[this.vLang]));
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
    if (pTask.getNotes()) vTmpDiv.appendChild(pTask.getNotes());
  }
  return vTaskInfoBox;
};



export const AddTaskItem = function (value) {
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

export const AddTaskItemObject = function (object) {
  return this.AddTaskItem(TaskItemObject(object));
}

export const RemoveTaskItem = function (pID) {
  // simply mark the task for removal at this point - actually remove it next time we re-draw the chart
  for (var i = 0; i < this.vTaskList.length; i++) {
    if (this.vTaskList[i].getID() == pID) this.vTaskList[i].setToDelete(true);
    else if (this.vTaskList[i].getParent() == pID) this.RemoveTaskItem(this.vTaskList[i].getID());
  }
  this.vProcessNeeded = true;
};



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