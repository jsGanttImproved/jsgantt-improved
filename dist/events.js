"use strict";
exports.__esModule = true;
exports.addListenerDependencies = exports.addListenerInputCell = exports.addListenerClickCell = exports.addScrollListeners = exports.addFormatListeners = exports.addFolderListeners = exports.updateGridHeaderWidth = exports.addThisRowListeners = exports.addTooltipListeners = exports.syncScroll = exports.removeListener = exports.addListener = exports.showToolTip = exports.mouseOut = exports.mouseOver = exports.show = exports.hide = exports.folder = void 0;
var general_utils_1 = require("./utils/general_utils");
// Function to open/close and hide/show children of specified task
var folder = function (pID, ganttObj) {
    var vList = ganttObj.getList();
    ganttObj.clearDependencies(); // clear these first so slow rendering doesn't look odd
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getID() == pID) {
            if (vList[i].getOpen() == 1) {
                vList[i].setOpen(0);
                (0, exports.hide)(pID, ganttObj);
                if ((0, general_utils_1.isIE)())
                    vList[i].getGroupSpan().innerText = '+';
                else
                    vList[i].getGroupSpan().textContent = '+';
            }
            else {
                vList[i].setOpen(1);
                (0, exports.show)(pID, 1, ganttObj);
                if ((0, general_utils_1.isIE)())
                    vList[i].getGroupSpan().innerText = '-';
                else
                    vList[i].getGroupSpan().textContent = '-';
            }
        }
    }
    var bd;
    if (ganttObj.vDebug) {
        bd = new Date();
        console.info('after drawDependency', bd);
    }
    ganttObj.DrawDependencies(ganttObj.vDebug);
    if (ganttObj.vDebug) {
        var ad = new Date();
        console.info('after drawDependency', ad, (ad.getTime() - bd.getTime()));
    }
};
exports.folder = folder;
var hide = function (pID, ganttObj) {
    var vList = ganttObj.getList();
    var vID = 0;
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            vID = vList[i].getID();
            // it's unlikely but if the task list has been updated since
            // the chart was drawn some of the rows may not exist
            if (vList[i].getListChildRow())
                vList[i].getListChildRow().style.display = 'none';
            if (vList[i].getChildRow())
                vList[i].getChildRow().style.display = 'none';
            vList[i].setVisible(0);
            if (vList[i].getGroup())
                (0, exports.hide)(vID, ganttObj);
        }
    }
};
exports.hide = hide;
// Function to show children of specified task
var show = function (pID, pTop, ganttObj) {
    var vList = ganttObj.getList();
    var vID = 0;
    var vState = '';
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            if (!vList[i].getParItem()) {
                console.error("Cant find parent on who event (maybe problems with Task ID and Parent Id mixes?)");
            }
            if (vList[i].getParItem().getGroupSpan()) {
                if ((0, general_utils_1.isIE)())
                    vState = vList[i].getParItem().getGroupSpan().innerText;
                else
                    vState = vList[i].getParItem().getGroupSpan().textContent;
            }
            i = vList.length;
        }
    }
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getParent() == pID) {
            var vChgState = false;
            vID = vList[i].getID();
            if (pTop == 1 && vState == '+')
                vChgState = true;
            else if (vState == '-')
                vChgState = true;
            else if (vList[i].getParItem() && vList[i].getParItem().getGroup() == 2)
                vList[i].setVisible(1);
            if (vChgState) {
                if (vList[i].getListChildRow())
                    vList[i].getListChildRow().style.display = '';
                if (vList[i].getChildRow())
                    vList[i].getChildRow().style.display = '';
                vList[i].setVisible(1);
            }
            if (vList[i].getGroup())
                (0, exports.show)(vID, 0, ganttObj);
        }
    }
};
exports.show = show;
var mouseOver = function (pObj1, pObj2) {
    if (this.getUseRowHlt()) {
        pObj1.className += ' gitemhighlight';
        pObj2.className += ' gitemhighlight';
    }
};
exports.mouseOver = mouseOver;
var mouseOut = function (pObj1, pObj2) {
    if (this.getUseRowHlt()) {
        pObj1.className = pObj1.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
        pObj2.className = pObj2.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
    }
};
exports.mouseOut = mouseOut;
var showToolTip = function (pGanttChartObj, e, pContents, pWidth, pTimer) {
    var vTtDivId = pGanttChartObj.getDivId() + 'JSGanttToolTip';
    var vMaxW = 500;
    var vMaxAlpha = 100;
    var vShowing = pContents.id;
    if (pGanttChartObj.getUseToolTip()) {
        if (pGanttChartObj.vTool == null) {
            pGanttChartObj.vTool = document.createElement('div');
            pGanttChartObj.vTool.id = vTtDivId;
            pGanttChartObj.vTool.className = 'JSGanttToolTip';
            pGanttChartObj.vTool.vToolCont = document.createElement('div');
            pGanttChartObj.vTool.vToolCont.id = vTtDivId + 'cont';
            pGanttChartObj.vTool.vToolCont.className = 'JSGanttToolTipcont';
            pGanttChartObj.vTool.vToolCont.setAttribute('showing', '');
            pGanttChartObj.vTool.appendChild(pGanttChartObj.vTool.vToolCont);
            document.body.appendChild(pGanttChartObj.vTool);
            pGanttChartObj.vTool.style.opacity = 0;
            pGanttChartObj.vTool.setAttribute('currentOpacity', 0);
            pGanttChartObj.vTool.setAttribute('fadeIncrement', 10);
            pGanttChartObj.vTool.setAttribute('moveSpeed', 10);
            pGanttChartObj.vTool.style.filter = 'alpha(opacity=0)';
            pGanttChartObj.vTool.style.visibility = 'hidden';
            pGanttChartObj.vTool.style.left = Math.floor(((e) ? e.clientX : window.event.clientX) / 2) + 'px';
            pGanttChartObj.vTool.style.top = Math.floor(((e) ? e.clientY : window.event.clientY) / 2) + 'px';
            addListener('mouseover', function () { clearTimeout(pGanttChartObj.vTool.delayTimeout); }, pGanttChartObj.vTool);
            addListener('mouseout', function () { (0, general_utils_1.delayedHide)(pGanttChartObj, pGanttChartObj.vTool, pTimer); }, pGanttChartObj.vTool);
        }
        clearTimeout(pGanttChartObj.vTool.delayTimeout);
        var newHTML = pContents.innerHTML;
        if (pGanttChartObj.vTool.vToolCont.getAttribute("content") !== newHTML) {
            pGanttChartObj.vTool.vToolCont.innerHTML = pContents.innerHTML;
            // as we are allowing arbitrary HTML we should remove any tag ids to prevent duplication
            (0, general_utils_1.stripIds)(pGanttChartObj.vTool.vToolCont);
            pGanttChartObj.vTool.vToolCont.setAttribute("content", newHTML);
        }
        if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing || pGanttChartObj.vTool.style.visibility != 'visible') {
            if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing) {
                pGanttChartObj.vTool.vToolCont.setAttribute('showing', vShowing);
            }
            pGanttChartObj.vTool.style.visibility = 'visible';
            // Rather than follow the mouse just have it stay put
            (0, general_utils_1.updateFlyingObj)(e, pGanttChartObj, pTimer);
            pGanttChartObj.vTool.style.width = (pWidth) ? pWidth + 'px' : 'auto';
            if (!pWidth && (0, general_utils_1.isIE)()) {
                pGanttChartObj.vTool.style.width = pGanttChartObj.vTool.offsetWidth;
            }
            if (pGanttChartObj.vTool.offsetWidth > vMaxW) {
                pGanttChartObj.vTool.style.width = vMaxW + 'px';
            }
        }
        if (pGanttChartObj.getUseFade()) {
            clearInterval(pGanttChartObj.vTool.fadeInterval);
            pGanttChartObj.vTool.fadeInterval = setInterval(function () { (0, general_utils_1.fadeToolTip)(1, pGanttChartObj.vTool, vMaxAlpha); }, pTimer);
        }
        else {
            pGanttChartObj.vTool.style.opacity = vMaxAlpha * 0.01;
            pGanttChartObj.vTool.style.filter = 'alpha(opacity=' + vMaxAlpha + ')';
        }
    }
};
exports.showToolTip = showToolTip;
var addListener = function (eventName, handler, control) {
    // Check if control is a string
    if (control === String(control))
        control = (0, general_utils_1.findObj)(control);
    if (control.addEventListener) //Standard W3C
     {
        return control.addEventListener(eventName, handler, false);
    }
    else if (control.attachEvent) //IExplore
     {
        return control.attachEvent('on' + eventName, handler);
    }
    else {
        return false;
    }
};
exports.addListener = addListener;
var removeListener = function (eventName, handler, control) {
    // Check if control is a string
    if (control === String(control))
        control = (0, general_utils_1.findObj)(control);
    if (control.removeEventListener) {
        //Standard W3C
        return control.removeEventListener(eventName, handler, false);
    }
    else if (control.detachEvent) {
        //IExplore
        return control.attachEvent('on' + eventName, handler);
    }
    else {
        return false;
    }
};
exports.removeListener = removeListener;
var syncScroll = function (elements, attrName) {
    var syncFlags = new Map(elements.map(function (e) { return [e, false]; }));
    function scrollEvent(e) {
        if (!syncFlags.get(e.target)) {
            for (var _i = 0, elements_2 = elements; _i < elements_2.length; _i++) {
                var el = elements_2[_i];
                if (el !== e.target) {
                    syncFlags.set(el, true);
                    el[attrName] = e.target[attrName];
                }
            }
        }
        syncFlags.set(e.target, false);
    }
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var el = elements_1[_i];
        el.addEventListener('scroll', scrollEvent);
    }
};
exports.syncScroll = syncScroll;
var addTooltipListeners = function (pGanttChart, pObj1, pObj2, callback) {
    var isShowingTooltip = false;
    (0, exports.addListener)('mouseover', function (e) {
        if (isShowingTooltip || !callback) {
            (0, exports.showToolTip)(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
        }
        else if (callback) {
            isShowingTooltip = true;
            var promise = callback();
            (0, exports.showToolTip)(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
            if (promise && promise.then) {
                promise.then(function () {
                    if (pGanttChart.vTool.vToolCont.getAttribute('showing') === pObj2.id &&
                        pGanttChart.vTool.style.visibility === 'visible') {
                        (0, exports.showToolTip)(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
                    }
                });
            }
        }
    }, pObj1);
    (0, exports.addListener)('mouseout', function (e) {
        var outTo = e.relatedTarget;
        if ((0, general_utils_1.isParentElementOrSelf)(outTo, pObj1) || (pGanttChart.vTool && (0, general_utils_1.isParentElementOrSelf)(outTo, pGanttChart.vTool))) {
            // not actually out
        }
        else {
            isShowingTooltip = false;
        }
        (0, general_utils_1.delayedHide)(pGanttChart, pGanttChart.vTool, pGanttChart.getTimer());
    }, pObj1);
};
exports.addTooltipListeners = addTooltipListeners;
var addThisRowListeners = function (pGanttChart, pObj1, pObj2) {
    (0, exports.addListener)('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj1);
    (0, exports.addListener)('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj2);
    (0, exports.addListener)('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj1);
    (0, exports.addListener)('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj2);
};
exports.addThisRowListeners = addThisRowListeners;
var updateGridHeaderWidth = function (pGanttChart) {
    var head = pGanttChart.getChartHead();
    var body = pGanttChart.getChartBody();
    if (!head || !body)
        return;
    var isScrollVisible = body.scrollHeight > body.clientHeight;
    if (isScrollVisible) {
        head.style.width = "calc(100% - ".concat((0, general_utils_1.getScrollbarWidth)(), "px)");
    }
    else {
        head.style.width = '100%';
    }
};
exports.updateGridHeaderWidth = updateGridHeaderWidth;
var addFolderListeners = function (pGanttChart, pObj, pID) {
    (0, exports.addListener)('click', function () {
        (0, exports.folder)(pID, pGanttChart);
        (0, exports.updateGridHeaderWidth)(pGanttChart);
    }, pObj);
};
exports.addFolderListeners = addFolderListeners;
var addFormatListeners = function (pGanttChart, pFormat, pObj) {
    (0, exports.addListener)('click', function () { (0, general_utils_1.changeFormat)(pFormat, pGanttChart); }, pObj);
};
exports.addFormatListeners = addFormatListeners;
var addScrollListeners = function (pGanttChart) {
    (0, exports.addListener)('resize', function () { pGanttChart.getChartHead().scrollLeft = pGanttChart.getChartBody().scrollLeft; }, window);
    (0, exports.addListener)('resize', function () {
        pGanttChart.getListBody().scrollTop = pGanttChart.getChartBody().scrollTop;
    }, window);
};
exports.addScrollListeners = addScrollListeners;
var addListenerClickCell = function (vTmpCell, vEvents, task, column) {
    (0, exports.addListener)('click', function (e) {
        if (e.target.classList.contains('gfoldercollapse') === false &&
            vEvents[column] && typeof vEvents[column] === 'function') {
            vEvents[column](task, e, vTmpCell, column);
        }
    }, vTmpCell);
};
exports.addListenerClickCell = addListenerClickCell;
var addListenerInputCell = function (vTmpCell, vEventsChange, callback, tasks, index, column, draw, event) {
    if (draw === void 0) { draw = null; }
    if (event === void 0) { event = 'blur'; }
    var task = tasks[index];
    if (vTmpCell.children[0] && vTmpCell.children[0].children && vTmpCell.children[0].children[0]) {
        var tagName = vTmpCell.children[0].children[0].tagName;
        var selectInputOrButton = tagName === 'SELECT' || tagName === 'INPUT' || tagName === 'BUTTON';
        if (selectInputOrButton) {
            (0, exports.addListener)(event, function (e) {
                if (callback) {
                    callback(task, e);
                }
                if (vEventsChange[column] && typeof vEventsChange[column] === 'function') {
                    var q = vEventsChange[column](tasks, task, e, vTmpCell, vColumnsNames[column]);
                    if (q && q.then) {
                        q.then(function (e) { return draw(); });
                    }
                    else {
                        draw();
                    }
                }
                else {
                    draw();
                }
            }, vTmpCell.children[0].children[0]);
        }
    }
};
exports.addListenerInputCell = addListenerInputCell;
var addListenerDependencies = function (vLineOptions) {
    var elements = document.querySelectorAll('.gtaskbarcontainer');
    for (var i = 0; i < elements.length; i++) {
        var taskDiv = elements[i];
        taskDiv.addEventListener('mouseover', function (e) {
            toggleDependencies(e, vLineOptions);
        });
        taskDiv.addEventListener('mouseout', function (e) {
            toggleDependencies(e, vLineOptions);
        });
    }
};
exports.addListenerDependencies = addListenerDependencies;
var toggleDependencies = function (e, vLineOptions) {
    var target = e.currentTarget;
    var ids = target.getAttribute('id').split('_');
    var style = vLineOptions && vLineOptions.borderStyleHover !== undefined ? vLineOptions.hoverStyle : 'groove';
    if (e.type === 'mouseout') {
        style = '';
    }
    if (ids.length > 1) {
        var frameZones = Array.from(document.querySelectorAll(".gDepId".concat(ids[1])));
        frameZones.forEach(function (c) {
            c.style.borderStyle = style;
        });
        // document.querySelectorAll(`.gDepId${ids[1]}`).forEach((c: any) => {
        // c.style.borderStyle = style;
        // });
    }
};
var vColumnsNames = {
    taskname: 'pName',
    res: 'pRes',
    dur: '',
    comp: 'pComp',
    start: 'pStart',
    end: 'pEnd',
    planstart: 'pPlanStart',
    planend: 'pPlanEnd',
    link: 'pLink',
    cost: 'pCost',
    mile: 'pMile',
    group: 'pGroup',
    parent: 'pParent',
    open: 'pOpen',
    depend: 'pDepend',
    caption: 'pCaption',
    note: 'pNotes'
};
