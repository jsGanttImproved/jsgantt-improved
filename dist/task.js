"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRows = exports.ClearTasks = exports.RemoveTaskItem = exports.GetTaskByOriginalID = exports.AddTaskItemObject = exports.AddTaskItem = exports.createTaskInfo = exports.TaskItem = exports.TaskItemObject = exports.sortTasks = exports.taskLink = void 0;
var general_utils_1 = require("./utils/general_utils");
var draw_utils_1 = require("./utils/draw_utils");
var date_utils_1 = require("./utils/date_utils");
// function to open window to display task link
var taskLink = function (pRef, pWidth, pHeight) {
    var vWidth, vHeight;
    if (pWidth)
        vWidth = pWidth;
    else
        vWidth = 400;
    if (pHeight)
        vHeight = pHeight;
    else
        vHeight = 400;
    window.open(pRef, 'newwin', 'height=' + vHeight + ',width=' + vWidth); // let OpenWindow = 
};
exports.taskLink = taskLink;
var sortTasks = function (pList, pID, pIdx) {
    if (pList.length < 2) {
        return pIdx;
    }
    var sortIdx = pIdx;
    var sortArr = new Array();
    for (var i = 0; i < pList.length; i++) {
        if (pList[i].getParent() == pID)
            sortArr.push(pList[i]);
    }
    if (sortArr.length > 0) {
        sortArr.sort(function (a, b) {
            var i = a.getStart().getTime() - b.getStart().getTime();
            if (i == 0)
                i = a.getEnd().getTime() - b.getEnd().getTime();
            if (i == 0)
                return a.getID() - b.getID();
            else
                return i;
        });
    }
    for (var j = 0; j < sortArr.length; j++) {
        for (var i = 0; i < pList.length; i++) {
            if (pList[i].getID() == sortArr[j].getID()) {
                pList[i].setSortIdx(sortIdx++);
                sortIdx = (0, exports.sortTasks)(pList, pList[i].getID(), sortIdx);
            }
        }
    }
    return sortIdx;
};
exports.sortTasks = sortTasks;
var TaskItemObject = function (object) {
    var pDataObject = __assign({}, object);
    general_utils_1.internalProperties.forEach(function (property) {
        delete pDataObject[property];
    });
    return new exports.TaskItem(object.pID, object.pName, object.pStart, object.pEnd, object.pClass, object.pLink, object.pMile, object.pRes, object.pComp, object.pGroup, object.pParent, object.pOpen, object.pDepend, object.pCaption, object.pNotes, object.pGantt, object.pCost, object.pPlanStart, object.pPlanEnd, object.pDuration, object.pBarText, object, object.pPlanClass);
};
exports.TaskItemObject = TaskItemObject;
var TaskItem = function (pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt, pCost, pPlanStart, pPlanEnd, pDuration, pBarText, pDataObject, pPlanClass) {
    if (pCost === void 0) { pCost = null; }
    if (pPlanStart === void 0) { pPlanStart = null; }
    if (pPlanEnd === void 0) { pPlanEnd = null; }
    if (pDuration === void 0) { pDuration = null; }
    if (pBarText === void 0) { pBarText = null; }
    if (pDataObject === void 0) { pDataObject = null; }
    if (pPlanClass === void 0) { pPlanClass = null; }
    var vGantt = pGantt ? pGantt : this;
    var _id = document.createTextNode(pID).data;
    var vID = (0, general_utils_1.hashKey)(document.createTextNode(pID).data);
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
    var vPlanClass = document.createTextNode(pPlanClass).data;
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
        parent = (0, general_utils_1.hashKey)(parent).toString();
    }
    var vParent = parent;
    var vOpen = (vGroup == 2) ? 1 : parseInt(document.createTextNode(pOpen).data);
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
        (0, general_utils_1.stripUnwanted)(vNotes);
    }
    if (pStart != null && pStart != '') {
        vStart = (pStart instanceof Date) ? pStart : (0, date_utils_1.parseDateStr)(document.createTextNode(pStart).data, vGantt.getDateInputFormat());
        vGroupMinStart = vStart;
    }
    if (pEnd != null && pEnd != '') {
        vEnd = (pEnd instanceof Date) ? pEnd : (0, date_utils_1.parseDateStr)(document.createTextNode(pEnd).data, vGantt.getDateInputFormat());
        vGroupMinEnd = vEnd;
    }
    if (pPlanStart != null && pPlanStart != '') {
        vPlanStart = (pPlanStart instanceof Date) ? pPlanStart : (0, date_utils_1.parseDateStr)(document.createTextNode(pPlanStart).data, vGantt.getDateInputFormat());
        vGroupMinPlanStart = vPlanStart;
    }
    if (pPlanEnd != null && pPlanEnd != '') {
        vPlanEnd = (pPlanEnd instanceof Date) ? pPlanEnd : (0, date_utils_1.parseDateStr)(document.createTextNode(pPlanEnd).data, vGantt.getDateInputFormat());
        vGroupMinPlanEnd = vPlanEnd;
    }
    function parseDepend(pDep) {
        vDepend = [];
        vDependType = [];
        if (!pDep)
            return;
        var vDepList = (pDep + '').split(',');
        for (var k = 0; k < vDepList.length; k++) {
            if (vDepList[k].toUpperCase().endsWith('SS')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'SS';
            }
            else if (vDepList[k].toUpperCase().endsWith('FF')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'FF';
            }
            else if (vDepList[k].toUpperCase().endsWith('SF')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'SF';
            }
            else if (vDepList[k].toUpperCase().endsWith('FS')) {
                vDepend[k] = vDepList[k].substring(0, vDepList[k].length - 2);
                vDependType[k] = 'FS';
            }
            else {
                vDepend[k] = vDepList[k];
                vDependType[k] = 'FS';
            }
            if (vDepend[k]) {
                vDepend[k] = (0, general_utils_1.hashKey)(vDepend[k]).toString();
            }
        }
    }
    parseDepend(pDepend);
    this.getID = function () { return vID; };
    this.getOriginalID = function () { return _id; };
    this.getGantt = function () { return vGantt; };
    this.getName = function () { return vName; };
    this.getStart = function () {
        if (vStart)
            return vStart;
        else if (vPlanStart)
            return vPlanStart;
        else
            return new Date();
    };
    this.getStartVar = function () {
        return vStart;
    };
    this.hasStart = function () { return !!(vStart || vPlanStart); };
    this.hasEnd = function () { return !!(vEnd || vPlanEnd || (vStart && vDuration)); };
    this.getEnd = function () {
        if (vEnd)
            return vEnd;
        else if (vPlanEnd)
            return vPlanEnd;
        else if (vStart && vDuration) {
            var date = new Date(vStart);
            var vUnits = vDuration.split(' ');
            var value = parseInt(vUnits[0]);
            switch (vUnits[1]) {
                case 'hour':
                    date.setMinutes(date.getMinutes() + (value * 60));
                    break;
                case 'day':
                    date.setMinutes(date.getMinutes() + (value * 60 * 24));
                    break;
                case 'week':
                    date.setMinutes(date.getMinutes() + (value * 60 * 24 * 7));
                    break;
                case 'month':
                    date.setMonth(date.getMonth() + (value));
                    break;
                case 'quarter':
                    date.setMonth(date.getMonth() + (value * 3));
                    break;
            }
            return date;
        }
        else
            return new Date();
    };
    this.getEndVar = function () {
        return vEnd;
    };
    this.getPlanStart = function () { return vPlanStart ? vPlanStart : vStart; };
    this.getPlanClass = function () { return vPlanClass && vPlanClass !== "null" ? vPlanClass : vClass; };
    this.getPlanEnd = function () { return vPlanEnd ? vPlanEnd : vEnd; };
    this.getCost = function () { return vCost; };
    this.getGroupMinStart = function () { return vGroupMinStart; };
    this.getGroupMinEnd = function () { return vGroupMinEnd; };
    this.getGroupMinPlanStart = function () { return vGroupMinPlanStart; };
    this.getGroupMinPlanEnd = function () { return vGroupMinPlanEnd; };
    this.getClass = function () { return vClass; };
    this.getLink = function () { return vLink; };
    this.getMile = function () { return vMile; };
    this.getDepend = function () {
        if (vDepend)
            return vDepend;
        else
            return null;
    };
    this.getDataObject = function () { return vDataObject; };
    this.getDepType = function () { if (vDependType)
        return vDependType;
    else
        return null; };
    this.getCaption = function () { if (vCaption)
        return vCaption;
    else
        return ''; };
    this.getResource = function () { if (vRes)
        return vRes;
    else
        return '\u00A0'; };
    this.getCompVal = function () { if (vComp)
        return vComp;
    else if (vCompVal)
        return vCompVal;
    else
        return 0; };
    this.getCompStr = function () { if (vComp)
        return vComp + '%';
    else if (vCompVal)
        return vCompVal + '%';
    else
        return ''; };
    this.getCompRestStr = function () { if (vComp)
        return (100 - vComp) + '%';
    else if (vCompVal)
        return (100 - vCompVal) + '%';
    else
        return ''; };
    this.getNotes = function () { return vNotes; };
    this.getSortIdx = function () { return vSortIdx; };
    this.getToDelete = function () { return vToDelete; };
    this.getDuration = function (pFormat, pLang) {
        if (vMile) {
            vDuration = '-';
        }
        else if (!vEnd && !vStart && vPlanStart && vPlanEnd) {
            return calculateVDuration(pFormat, pLang, this.getPlanStart(), this.getPlanEnd());
        }
        else if (!vEnd && vDuration) {
            return vDuration;
        }
        else {
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
        }
        // let vTaskEnd = new Date(this.getEnd().getTime());
        // if ((vTaskEnd.getTime() - (vTaskEnd.getTimezoneOffset() * 60000)) % (86400000) == 0) {
        //   vTaskEnd = new Date(vTaskEnd.getFullYear(), vTaskEnd.getMonth(), vTaskEnd.getDate() + 1, vTaskEnd.getHours(), vTaskEnd.getMinutes(), vTaskEnd.getSeconds());
        // }
        // let tmpPer = (getOffset(this.getStart(), vTaskEnd, 999, vUnits)) / 1000;
        var hours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;
        var tmpPer;
        switch (vUnits) {
            case 'hour':
                tmpPer = Math.round(hours);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['hrs'] : pLang['hr']);
                break;
            case 'day':
                tmpPer = Math.round(hours / 24);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['dys'] : pLang['dy']);
                break;
            case 'week':
                tmpPer = Math.round(hours / 24 / 7);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['wks'] : pLang['wk']);
                break;
            case 'month':
                tmpPer = Math.round(hours / 24 / 7 / 4.35);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['mths'] : pLang['mth']);
                break;
            case 'quarter':
                tmpPer = Math.round(hours / 24 / 7 / 13);
                vDuration = tmpPer + ' ' + ((tmpPer != 1) ? pLang['qtrs'] : pLang['qtr']);
                break;
        }
        return vDuration;
    }
    this.getBarText = function () { return vBarText; };
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
    this.getPlanTaskDiv = function () { return vPlanTaskDiv; };
    this.getChildRow = function () { return vChildRow; };
    this.getListChildRow = function () { return vListChildRow; };
    this.getGroupSpan = function () { return vGroupSpan; };
    this.setDepend = function (pDepend) { parseDepend(pDepend); };
    this.setName = function (pName) { vName = pName; };
    this.setNotes = function (pNotes) { vNotes = pNotes; };
    this.setClass = function (pClass) { vClass = pClass; };
    this.setPlanClass = function (pPlanClass) { vPlanClass = pPlanClass; };
    this.setCost = function (pCost) { vCost = pCost; };
    this.setResource = function (pRes) { vRes = pRes; };
    this.setDuration = function (pDuration) { vDuration = pDuration; };
    this.setDataObject = function (pDataObject) { vDataObject = pDataObject; };
    this.setStart = function (pStart) {
        if (pStart instanceof Date) {
            vStart = pStart;
        }
        else {
            var temp = new Date(pStart);
            if (temp instanceof Date && !isNaN(temp.valueOf())) {
                vStart = temp;
            }
        }
    };
    this.setEnd = function (pEnd) {
        if (pEnd instanceof Date) {
            vEnd = pEnd;
        }
        else {
            var temp = new Date(pEnd);
            if (temp instanceof Date && !isNaN(temp.valueOf())) {
                vEnd = temp;
            }
        }
    };
    this.setPlanStart = function (pPlanStart) {
        if (pPlanStart instanceof Date)
            vPlanStart = pPlanStart;
        else
            vPlanStart = new Date(pPlanStart);
    };
    this.setPlanEnd = function (pPlanEnd) {
        if (pPlanEnd instanceof Date)
            vPlanEnd = pPlanEnd;
        else
            vPlanEnd = new Date(pPlanEnd);
    };
    this.setGroupMinStart = function (pStart) { if (pStart instanceof Date)
        vGroupMinStart = pStart; };
    this.setGroupMinEnd = function (pEnd) { if (pEnd instanceof Date)
        vGroupMinEnd = pEnd; };
    this.setLevel = function (pLevel) { vLevel = parseInt(document.createTextNode(pLevel).data); };
    this.setNumKid = function (pNumKid) { vNumKid = parseInt(document.createTextNode(pNumKid).data); };
    this.setWeight = function (pWeight) { vWeight = parseInt(document.createTextNode(pWeight).data); };
    this.setCompVal = function (pCompVal) { vCompVal = parseFloat(document.createTextNode(pCompVal).data); };
    this.setComp = function (pComp) {
        vComp = parseInt(document.createTextNode(pComp).data);
    };
    this.setStartX = function (pX) { x1 = parseInt(document.createTextNode(pX).data); };
    this.setStartY = function (pY) { y1 = parseInt(document.createTextNode(pY).data); };
    this.setEndX = function (pX) { x2 = parseInt(document.createTextNode(pX).data); };
    this.setEndY = function (pY) { y2 = parseInt(document.createTextNode(pY).data); };
    this.setOpen = function (pOpen) { vOpen = parseInt(document.createTextNode(pOpen).data); };
    this.setVisible = function (pVisible) { vVisible = parseInt(document.createTextNode(pVisible).data); };
    this.setSortIdx = function (pSortIdx) { vSortIdx = parseInt(document.createTextNode(pSortIdx).data); };
    this.setToDelete = function (pToDelete) { if (pToDelete)
        vToDelete = true;
    else
        vToDelete = false; };
    this.setParItem = function (pParItem) { if (pParItem)
        vParItem = pParItem; };
    this.setCellDiv = function (pCellDiv) { if (typeof HTMLDivElement !== 'function' || pCellDiv instanceof HTMLDivElement)
        vCellDiv = pCellDiv; }; //"typeof HTMLDivElement !== 'function'" to play nice with ie6 and 7
    this.setGroup = function (pGroup) {
        if (pGroup === true || pGroup === 'true') {
            vGroup = 1;
        }
        else if (pGroup === false || pGroup === 'false') {
            vGroup = 0;
        }
        else {
            vGroup = parseInt(document.createTextNode(pGroup).data);
        }
    };
    this.setBarText = function (pBarText) { if (pBarText)
        vBarText = pBarText; };
    this.setBarDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vBarDiv = pDiv; };
    this.setTaskDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vTaskDiv = pDiv; };
    this.setPlanTaskDiv = function (pDiv) { if (typeof HTMLDivElement !== 'function' || pDiv instanceof HTMLDivElement)
        vPlanTaskDiv = pDiv; };
    this.setChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement)
        vChildRow = pRow; };
    this.setListChildRow = function (pRow) { if (typeof HTMLTableRowElement !== 'function' || pRow instanceof HTMLTableRowElement)
        vListChildRow = pRow; };
    this.setGroupSpan = function (pSpan) { if (typeof HTMLSpanElement !== 'function' || pSpan instanceof HTMLSpanElement)
        vGroupSpan = pSpan; };
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
            pDataObject: vDataObject,
            pPlanClass: vPlanClass
        };
    };
};
exports.TaskItem = TaskItem;
/**
 * @param pTask
 * @param templateStrOrFn template string or function(task). In any case parameters in template string are substituted.
 *        If string - just a static template.
 *        If function(task): string - per task template. Can return null|undefined to fallback to default template.
 *        If function(task): Promise<string>) - async per task template. Tooltip will show 'Loading...' if promise is not yet complete.
 *          Otherwise returned template will be handled in the same manner as in other cases.
 */
var createTaskInfo = function (pTask, templateStrOrFn) {
    var _this = this;
    if (templateStrOrFn === void 0) { templateStrOrFn = null; }
    var vTmpDiv;
    var vTaskInfoBox = document.createDocumentFragment();
    var vTaskInfo = (0, draw_utils_1.newNode)(vTaskInfoBox, 'div', null, 'gTaskInfo');
    var setupTemplate = function (template) {
        vTaskInfo.innerHTML = "";
        if (template) {
            var allData_1 = pTask.getAllData();
            general_utils_1.internalProperties.forEach(function (key) {
                var lang;
                if (general_utils_1.internalPropertiesLang[key]) {
                    lang = _this.vLangs[_this.vLang][general_utils_1.internalPropertiesLang[key]];
                }
                if (!lang) {
                    lang = key;
                }
                var val = allData_1[key];
                template = template.replace("{{".concat(key, "}}"), val);
                if (lang) {
                    template = template.replace("{{Lang:".concat(key, "}}"), lang);
                }
                else {
                    template = template.replace("{{Lang:".concat(key, "}}"), key);
                }
            });
            (0, draw_utils_1.newNode)(vTaskInfo, 'span', null, 'gTtTemplate', template);
        }
        else {
            (0, draw_utils_1.newNode)(vTaskInfo, 'span', null, 'gTtTitle', pTask.getName());
            if (_this.vShowTaskInfoStartDate == 1) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIsd');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['startdate'] + ': ');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskText', (0, date_utils_1.formatDateStr)(pTask.getStart(), _this.vDateTaskDisplayFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoEndDate == 1) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIed');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['enddate'] + ': ');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskText', (0, date_utils_1.formatDateStr)(pTask.getEnd(), _this.vDateTaskDisplayFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoDur == 1 && !pTask.getMile()) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTId');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['dur'] + ': ');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskText', pTask.getDuration(_this.vFormat, _this.vLangs[_this.vLang]));
            }
            if (_this.vShowTaskInfoComp == 1) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIc');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['completion'] + ': ');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskText', pTask.getCompStr());
            }
            if (_this.vShowTaskInfoRes == 1) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIr');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['res'] + ': ');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskText', pTask.getResource());
            }
            if (_this.vShowTaskInfoLink == 1 && pTask.getLink() != '') {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIl');
                var vTmpNode = (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel');
                vTmpNode = (0, draw_utils_1.newNode)(vTmpNode, 'a', null, 'gTaskText', _this.vLangs[_this.vLang]['moreinfo']);
                vTmpNode.setAttribute('href', pTask.getLink());
            }
            if (_this.vShowTaskInfoNotes == 1) {
                vTmpDiv = (0, draw_utils_1.newNode)(vTaskInfo, 'div', null, 'gTILine gTIn');
                (0, draw_utils_1.newNode)(vTmpDiv, 'span', null, 'gTaskLabel', _this.vLangs[_this.vLang]['notes'] + ': ');
                if (pTask.getNotes())
                    vTmpDiv.appendChild(pTask.getNotes());
            }
        }
    };
    var callback;
    if (typeof templateStrOrFn === 'function') {
        callback = function () {
            var strOrPromise = templateStrOrFn(pTask);
            if (!strOrPromise || typeof strOrPromise === 'string') {
                setupTemplate(strOrPromise);
            }
            else if (strOrPromise.then) {
                setupTemplate(_this.vLangs[_this.vLang]['tooltipLoading'] || _this.vLangs['en']['tooltipLoading']);
                return strOrPromise.then(setupTemplate);
            }
        };
    }
    else {
        setupTemplate(templateStrOrFn);
    }
    return { component: vTaskInfoBox, callback: callback };
};
exports.createTaskInfo = createTaskInfo;
var AddTaskItem = function (value) {
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
    return value.getID();
};
exports.AddTaskItem = AddTaskItem;
var AddTaskItemObject = function (object) {
    if (!object.pGantt) {
        object.pGantt = this;
    }
    return this.AddTaskItem((0, exports.TaskItemObject)(object));
};
exports.AddTaskItemObject = AddTaskItemObject;
var GetTaskByOriginalID = function (pOriginalID) {
    var id = String(pOriginalID);
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getOriginalID() === id)
            return this.vTaskList[i];
    }
    return null;
};
exports.GetTaskByOriginalID = GetTaskByOriginalID;
var RemoveTaskItem = function (pID) {
    // Accept either the internal vID or the original string ID.
    // Resolve an original ID to its vID so the recursive child-removal still works.
    var vID = pID;
    var asString = String(pID);
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getOriginalID() === asString) {
            vID = this.vTaskList[i].getID();
            break;
        }
    }
    // simply mark the task for removal at this point - actually remove it next time we re-draw the chart
    for (var i = 0; i < this.vTaskList.length; i++) {
        if (this.vTaskList[i].getID() == vID)
            this.vTaskList[i].setToDelete(true);
        else if (this.vTaskList[i].getParent() == vID)
            this.RemoveTaskItem(this.vTaskList[i].getID());
    }
    this.vProcessNeeded = true;
};
exports.RemoveTaskItem = RemoveTaskItem;
var ClearTasks = function () {
    var _this = this;
    this.vTaskList.map(function (task) { return _this.RemoveTaskItem(task.getID()); });
    this.vProcessNeeded = true;
};
exports.ClearTasks = ClearTasks;
// Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
var processRows = function (pList, pID, pRow, pLevel, pOpen, pUseSort, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
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
        if (i >= 0 && pList[i].getID() == pID)
            vCurItem = pList[i];
    }
    for (i = 0; i < pList.length; i++) {
        if (pList[i].getParent() == pID) {
            vVisible = pOpen;
            pList[i].setParItem(vCurItem);
            pList[i].setVisible(vVisible);
            if (vVisible == 1 && pList[i].getOpen() == 0)
                vVisible = 0;
            if (pList[i].getMile() && pList[i].getParItem() && pList[i].getParItem().getGroup() == 2) { //remove milestones owned by combined groups
                pList.splice(i, 1);
                i--;
                continue;
            }
            pList[i].setLevel(vLevel);
            if (pList[i].getGroup()) {
                if (pList[i].getParItem() && pList[i].getParItem().getGroup() == 2)
                    pList[i].setGroup(2);
                (0, exports.processRows)(vList, pList[i].getID(), i, vLevel + 1, vVisible, 0);
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
        var bd = void 0;
        if (vDebug) {
            bd = new Date();
            console.info('before afterTasks', bd);
        }
        (0, exports.sortTasks)(pList, 0, 0);
        if (vDebug) {
            var ad = new Date();
            console.info('after afterTasks', ad, (ad.getTime() - bd.getTime()));
        }
        pList.sort(function (a, b) { return a.getSortIdx() - b.getSortIdx(); });
    }
    if (pID == 0 && pUseSort != 1) // Need to sort combined tasks regardless
     {
        for (i = 0; i < pList.length; i++) {
            if (pList[i].getGroup() == 2) {
                vComb = true;
                var bd = void 0;
                if (vDebug) {
                    bd = new Date();
                    console.info('before sortTasks', bd);
                }
                (0, exports.sortTasks)(pList, pList[i].getID(), pList[i].getSortIdx() + 1);
                if (vDebug) {
                    var ad = new Date();
                    console.info('after sortTasks', ad, (ad.getTime() - bd.getTime()));
                }
            }
        }
        if (vComb == true)
            pList.sort(function (a, b) { return a.getSortIdx() - b.getSortIdx(); });
    }
};
exports.processRows = processRows;
