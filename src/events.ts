declare var JSGantt: any;

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
      pGanttChartObj.vTool.style.left = Math.floor(((e) ? e.clientX : (<MouseEvent>window.event).clientX) / 2) + 'px';
      pGanttChartObj.vTool.style.top = Math.floor(((e) ? e.clientY : (<MouseEvent>window.event).clientY) / 2) + 'px';
      this.addListener('mouseover', function () { clearTimeout(pGanttChartObj.vTool.delayTimeout); }, pGanttChartObj.vTool);
      this.addListener('mouseout', function () { JSGantt.delayedHide(pGanttChartObj, pGanttChartObj.vTool, pTimer); }, pGanttChartObj.vTool);
    }
    clearTimeout(pGanttChartObj.vTool.delayTimeout);
    if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing || pGanttChartObj.vTool.style.visibility != 'visible') {
      if (pGanttChartObj.vTool.vToolCont.getAttribute('showing') != vShowing) {
        pGanttChartObj.vTool.vToolCont.setAttribute('showing', vShowing);

        pGanttChartObj.vTool.vToolCont.innerHTML = pContents.innerHTML;
        // as we are allowing arbitrary HTML we should remove any tag ids to prevent duplication
        JSGantt.stripIds(pGanttChartObj.vTool.vToolCont);
      }

      pGanttChartObj.vTool.style.visibility = 'visible';
      // Rather than follow the mouse just have it stay put
      JSGantt.updateFlyingObj(e, pGanttChartObj, pTimer);
      pGanttChartObj.vTool.style.width = (pWidth) ? pWidth + 'px' : 'auto';
      if (!pWidth && JSGantt.isIE()) {
        pGanttChartObj.vTool.style.width = pGanttChartObj.vTool.offsetWidth;
      }
      if (pGanttChartObj.vTool.offsetWidth > vMaxW) { pGanttChartObj.vTool.style.width = vMaxW + 'px'; }
    }

    if (pGanttChartObj.getUseFade()) {
      clearInterval(pGanttChartObj.vTool.fadeInterval);
      pGanttChartObj.vTool.fadeInterval = setInterval(function () { JSGantt.fadeToolTip(1, pGanttChartObj.vTool, vMaxAlpha); }, pTimer);
    }
    else {
      pGanttChartObj.vTool.style.opacity = vMaxAlpha * 0.01;
      pGanttChartObj.vTool.style.filter = 'alpha(opacity=' + vMaxAlpha + ')';
    }
  }
};

export const hideToolTip = function (pGanttChartObj, pTool, pTimer) {
  if (pGanttChartObj.getUseFade()) {
    clearInterval(pTool.fadeInterval);
    pTool.fadeInterval = setInterval(function () { JSGantt.fadeToolTip(-1, pTool, 0); }, pTimer);
  }
  else {
    pTool.style.opacity = 0;
    pTool.style.filter = 'alpha(opacity=0)';
    pTool.style.visibility = 'hidden';
  }
};

export const fadeToolTip = function (pDirection, pTool, pMaxAlpha) {
  var vIncrement = parseInt(pTool.getAttribute('fadeIncrement'));
  var vAlpha = pTool.getAttribute('currentOpacity');
  var vCurAlpha = parseInt(vAlpha);
  if ((vCurAlpha != pMaxAlpha && pDirection == 1) || (vCurAlpha != 0 && pDirection == -1)) {
    var i = vIncrement;
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

export const moveToolTip = function (pNewX, pNewY, pTool) {
  var vSpeed = parseInt(pTool.getAttribute('moveSpeed'));
  var vOldX = parseInt(pTool.style.left);
  var vOldY = parseInt(pTool.style.top);

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
