import { delayedHide, changeFormat, stripIds, isIE, findObj, fadeToolTip } from "./utils";
import { folder } from "./task";
import { updateFlyingObj } from "./draw";

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
    if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing || pGanttChartObj.vTool.style.visibility != 'visible') {
      if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing) {
        pGanttChartObj.vTool.vToolCont.setAttribute('showing', vShowing);

        pGanttChartObj.vTool.vToolCont.innerHTML = pContents.innerHTML;
        // as we are allowing arbitrary HTML we should remove any tag ids to prevent duplication
        stripIds(pGanttChartObj.vTool.vToolCont);
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


export const addTooltipListeners = function (pGanttChart, pObj1, pObj2) {
  addListener('mouseover', function (e) { showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer()); }, pObj1);
  addListener('mouseout', function (e) { delayedHide(pGanttChart, pGanttChart.vTool, pGanttChart.getTimer()); }, pObj1);
};

export const addThisRowListeners = function (pGanttChart, pObj1, pObj2) {
  addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj1);
  addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj2);
  addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj1);
  addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj2);
};

export const addFolderListeners = function (pGanttChart, pObj, pID) {
  addListener('click', function () { folder(pID, pGanttChart); }, pObj);
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
      vEvents[column](task, e, vTmpCell);
    }
  }, vTmpCell);
}

export const addListenerInputCell = function (vTmpCell, vEventsChange, callback, task, column, draw = null, event = 'blur') {
  if (vTmpCell.children[0] && vTmpCell.children[0].children && vTmpCell.children[0].children[0]) {
    addListener(event, function (e) {
      if (callback) {
        callback(task, e);
      }
      if (vEventsChange[column] && typeof vEventsChange[column] === 'function') {
        const q = vEventsChange[column](task, e, vTmpCell, vColumnsNames[column]);
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

export const addListenerDependencies = function () {
  const elements = document.querySelectorAll('.gtaskbarcontainer');
  for (let i = 0; i < elements.length; i++) {
    const taskDiv = elements[i];
    taskDiv.addEventListener('mouseover', e => {
      toggleDependencies(e);
    });
    taskDiv.addEventListener('mouseout', e => {
      toggleDependencies(e);
    });
  }
}

const toggleDependencies = function (e) {
  const target: any = e.currentTarget;
  const ids = target.getAttribute('id').split('_');
  let style = 'groove';
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

// "pID": 122
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
