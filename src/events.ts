import {
  delayedHide, changeFormat, stripIds, isIE, findObj, fadeToolTip, getScrollbarWidth,
  isParentElementOrSelf, updateFlyingObj
} from "./utils/general_utils";

// Function to open/close and hide/show children of specified task
export const folder = function (pID, ganttObj) {
  let vList = ganttObj.getList();

  ganttObj.clearDependencies(); // clear these first so slow rendering doesn't look odd

  for (let i = 0; i < vList.length; i++) {
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
  let bd;
  if (this.vDebug) {
    bd = new Date();
    console.info('after drawDependency', bd);
  }
  ganttObj.DrawDependencies(this.vDebug);
  if (this.vDebug) {
    const ad = new Date();
    console.info('after drawDependency', ad, (ad.getTime() - bd.getTime()));
  }
};

export const hide = function (pID, ganttObj) {
  let vList = ganttObj.getList();
  let vID = 0;

  for (let i = 0; i < vList.length; i++) {
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
  let vList = ganttObj.getList();
  let vID = 0;
  let vState = '';

  for (let i = 0; i < vList.length; i++) {
    if (vList[i].getParent() == pID) {
      if (!vList[i].getParItem()) {
        console.error(`Cant find parent on who event (maybe problems with Task ID and Parent Id mixes?)`);
      }
      if (vList[i].getParItem().getGroupSpan()) {
        if (isIE()) vState = vList[i].getParItem().getGroupSpan().innerText;
        else vState = vList[i].getParItem().getGroupSpan().textContent;
      }
      i = vList.length;
    }
  }

  for (let i = 0; i < vList.length; i++) {
    if (vList[i].getParent() == pID) {
      let vChgState = false;
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


export const mouseOver = function (pObj1, pObj2) {
  if (this.getUseRowHlt()) {
    pObj1.className += ' gitemhighlight';
    pObj2.className += ' gitemhighlight';
  }
};

export const mouseOut = function (pObj1, pObj2) {
  if (this.getUseRowHlt()) {
    pObj1.className = pObj1.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
    pObj2.className = pObj2.className.replace(/(?:^|\s)gitemhighlight(?!\S)/g, '');
  }
};

export const showToolTip = function (pGanttChartObj, e, pContents, pWidth, pTimer) {
  let vTtDivId = pGanttChartObj.getDivId() + 'JSGanttToolTip';
  let vMaxW = 500;
  let vMaxAlpha = 100;
  let vShowing = pContents.id;

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
      pGanttChartObj.vTool.style.left = Math.floor(((e) ? e.clientX : (<MouseEvent>window.event).clientX) / 2) + 'px';
      pGanttChartObj.vTool.style.top = Math.floor(((e) ? e.clientY : (<MouseEvent>window.event).clientY) / 2) + 'px';
      this.addListener('mouseover', function () { clearTimeout(pGanttChartObj.vTool.delayTimeout); }, pGanttChartObj.vTool);
      this.addListener('mouseout', function () { delayedHide(pGanttChartObj, pGanttChartObj.vTool, pTimer); }, pGanttChartObj.vTool);
    }
    clearTimeout(pGanttChartObj.vTool.delayTimeout);

    const newHTML = pContents.innerHTML;

    if (pGanttChartObj.vTool.vToolCont.getAttribute("content") !== newHTML) {
      pGanttChartObj.vTool.vToolCont.innerHTML = pContents.innerHTML;
      // as we are allowing arbitrary HTML we should remove any tag ids to prevent duplication
      stripIds(pGanttChartObj.vTool.vToolCont);
      pGanttChartObj.vTool.vToolCont.setAttribute("content", newHTML);
    }

    if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing || pGanttChartObj.vTool.style.visibility != 'visible') {
      if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing) {
        pGanttChartObj.vTool.vToolCont.setAttribute('showing', vShowing);
      }

      pGanttChartObj.vTool.style.visibility = 'visible';
      // Rather than follow the mouse just have it stay put
      updateFlyingObj(e, pGanttChartObj, pTimer);
      pGanttChartObj.vTool.style.width = (pWidth) ? pWidth + 'px' : 'auto';
      if (!pWidth && isIE()) {
        pGanttChartObj.vTool.style.width = pGanttChartObj.vTool.offsetWidth;
      }
      if (pGanttChartObj.vTool.offsetWidth > vMaxW) { pGanttChartObj.vTool.style.width = vMaxW + 'px'; }
    }

    if (pGanttChartObj.getUseFade()) {
      clearInterval(pGanttChartObj.vTool.fadeInterval);
      pGanttChartObj.vTool.fadeInterval = setInterval(function () { fadeToolTip(1, pGanttChartObj.vTool, vMaxAlpha); }, pTimer);
    }
    else {
      pGanttChartObj.vTool.style.opacity = vMaxAlpha * 0.01;
      pGanttChartObj.vTool.style.filter = 'alpha(opacity=' + vMaxAlpha + ')';
    }
  }
};




export const addListener = function (eventName, handler, control) {
  // Check if control is a string
  if (control === String(control)) control = findObj(control);

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

export const removeListener = function (eventName, handler, control) {
  // Check if control is a string
  if (control === String(control)) control = findObj(control);
  if (control.removeEventListener) {
    //Standard W3C
    return control.removeEventListener(eventName, handler, false);
  } else if (control.detachEvent) {
    //IExplore
    return control.attachEvent('on' + eventName, handler);
  } else {
    return false;
  }
};

export const syncScroll = function (elements, attrName) {
  let syncFlags = new Map(elements.map(e => [e, false]));

  function scrollEvent(e) {
    if (!syncFlags.get(e.target)) {
      for (const el of elements) {
        if (el !== e.target) {
          syncFlags.set(el, true);
          el[attrName] = e.target[attrName];
        }
      }
    }

    syncFlags.set(e.target, false);
  }

  for (const el of elements) {
    el.addEventListener('scroll', scrollEvent);
  }
}

export const addTooltipListeners = function (pGanttChart, pObj1, pObj2, callback) {
  let isShowingTooltip = false;

  addListener('mouseover', function (e) {
    if (isShowingTooltip || !callback) {
      showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
    } else if (callback) {
      isShowingTooltip = true;
      const promise = callback();
      showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
      if (promise && promise.then) {
        promise.then(() => {
          if (pGanttChart.vTool.vToolCont.getAttribute('showing') === pObj2.id &&
            pGanttChart.vTool.style.visibility === 'visible') {
            showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer());
          }
        });
      }
    }
  }, pObj1);

  addListener('mouseout', function (e) {
    const outTo = e.relatedTarget;
    if (isParentElementOrSelf(outTo, pObj1) || (pGanttChart.vTool && isParentElementOrSelf(outTo, pGanttChart.vTool))) {
      // not actually out
    } else {
      isShowingTooltip = false;
    }

    delayedHide(pGanttChart, pGanttChart.vTool, pGanttChart.getTimer());
  }, pObj1);
};

export const addThisRowListeners = function (pGanttChart, pObj1, pObj2) {
  addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj1);
  addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj2);
  addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj1);
  addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj2);
};

export const updateGridHeaderWidth = function (pGanttChart) {
  const head = pGanttChart.getChartHead();
  const body = pGanttChart.getChartBody();
  if (!head || !body) return;
  const isScrollVisible = body.scrollHeight > body.clientHeight;
  if (isScrollVisible) {
    head.style.width = `calc(100% - ${getScrollbarWidth()}px)`;
  } else {
    head.style.width = '100%';
  }
}

export const addFolderListeners = function (pGanttChart, pObj, pID) {
  addListener('click', function () {
    folder(pID, pGanttChart);
    updateGridHeaderWidth(pGanttChart);
  }, pObj);
};

export const addFormatListeners = function (pGanttChart, pFormat, pObj) {
  addListener('click', function () { changeFormat(pFormat, pGanttChart); }, pObj);
};

export const addScrollListeners = function (pGanttChart) {
  addListener('resize', function () { pGanttChart.getChartHead().scrollLeft = pGanttChart.getChartBody().scrollLeft; }, window);
  addListener('resize', function () {
    pGanttChart.getListBody().scrollTop = pGanttChart.getChartBody().scrollTop;
  }, window);
};

export const addListenerClickCell = function (vTmpCell, vEvents, task, column) {
  addListener('click', function (e) {
    if (e.target.classList.contains('gfoldercollapse') === false &&
      vEvents[column] && typeof vEvents[column] === 'function') {
      vEvents[column](task, e, vTmpCell, column);
    }
  }, vTmpCell);
}

export const addListenerInputCell = function (vTmpCell, vEventsChange, callback, tasks, index, column, draw = null, event = 'blur') {
  const task = tasks[index];
  if (vTmpCell.children[0] && vTmpCell.children[0].children && vTmpCell.children[0].children[0]) {
    const tagName = vTmpCell.children[0].children[0].tagName;
    const selectInputOrButton = tagName === 'SELECT' || tagName === 'INPUT' || tagName === 'BUTTON';
    if (selectInputOrButton) {
      addListener(event, function (e) {
        if (callback) {
          callback(task, e);
        }
        if (vEventsChange[column] && typeof vEventsChange[column] === 'function') {
          const q = vEventsChange[column](tasks, task, e, vTmpCell, vColumnsNames[column]);
          if (q && q.then) {
            q.then(e => draw());
          } else {
            draw();
          }
        } else {
          draw();
        }
      }, vTmpCell.children[0].children[0]);
    }
  }
}

export const addListenerDependencies = function (vLineOptions) {
  const elements = document.querySelectorAll('.gtaskbarcontainer');
  for (let i = 0; i < elements.length; i++) {
    const taskDiv = elements[i];
    taskDiv.addEventListener('mouseover', e => {
      toggleDependencies(e, vLineOptions);
    });
    taskDiv.addEventListener('mouseout', e => {
      toggleDependencies(e, vLineOptions);
    });
  }
}

const toggleDependencies = function (e, vLineOptions) {
  const target: any = e.currentTarget;
  const ids = target.getAttribute('id').split('_');
  let style = vLineOptions && vLineOptions.borderStyleHover !== undefined ? vLineOptions.hoverStyle : 'groove';
  if (e.type === 'mouseout') {
    style = '';
  }
  if (ids.length > 1) {
    const frameZones = Array.from(document.querySelectorAll(`.gDepId${ids[1]}`));
    frameZones.forEach((c: any) => {
      c.style.borderStyle = style;
    });
    // document.querySelectorAll(`.gDepId${ids[1]}`).forEach((c: any) => {
    // c.style.borderStyle = style;
    // });
  }
}

const vColumnsNames = {
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
}
