import { addFormatListeners } from "../events";

export const makeInput = function (formattedValue, editable, type = 'text', value = null, choices = null) {
  if (!value) {
    value = formattedValue;
  }
  if (editable) {
    switch (type) {
      case 'date':
        // Take timezone into account before converting to ISO String
        value = value ? new Date(value.getTime() - (value.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
        return `<input class="gantt-inputtable" type="date" value="${value}">`;
      case 'resource':
        if (choices) {
          const found = choices.filter(c => c.id == value || c.name == value);
          if (found && found.length > 0) {
            value = found[0].id;
          } else {
            choices.push({ id: value, name: value });
          }
          return `<select>` + choices.map(c => `<option value="${c.id}" ${value == c.id ? 'selected' : ''} >${c.name}</option>`).join('') + `</select>`;
        } else {
          return `<input class="gantt-inputtable" type="text" value="${value ? value : ''}">`;
        }
      case 'cost':
        return `<input class="gantt-inputtable" type="number" max="100" min="0" value="${value ? value : ''}">`;
      default:
        return `<input class="gantt-inputtable" value="${value ? value : ''}">`;
    }
  } else {
    return formattedValue;
  }
}

export const newNode = function (pParent, pNodeType, pId = null, pClass = null, pText = null,
  pWidth = null, pLeft = null, pDisplay = null, pColspan = null, pAttribs = null) {
  let vNewNode = pParent.appendChild(document.createElement(pNodeType));
  if (pAttribs) {
    for (let i = 0; i + 1 < pAttribs.length; i += 2) {
      vNewNode.setAttribute(pAttribs[i], pAttribs[i + 1]);
    }
  }
  if (pId) vNewNode.id = pId; // I wish I could do this with setAttribute but older IEs don't play nice
  if (pClass) vNewNode.className = pClass;
  if (pWidth) vNewNode.style.width = (isNaN(pWidth * 1)) ? pWidth : pWidth + 'px';
  if (pLeft) vNewNode.style.left = (isNaN(pLeft * 1)) ? pLeft : pLeft + 'px';
  if (pText) {
    if (pText.indexOf && pText.indexOf('<') === -1) {
      vNewNode.appendChild(document.createTextNode(pText));
    } else {
      vNewNode.insertAdjacentHTML('beforeend', pText);
    }
  }
  if (pDisplay) vNewNode.style.display = pDisplay;
  if (pColspan) vNewNode.colSpan = pColspan;
  return vNewNode;
};



export const getArrayLocationByID = function (pId) {
  let vList = this.getList();
  for (let i = 0; i < vList.length; i++) {
    if (vList[i].getID() == pId)
      return i;
  }
  return -1;
};

export const CalcTaskXY = function () {
  let vID;
  let vList = this.getList();
  let vBarDiv;
  let vTaskDiv;
  let vParDiv;
  let vLeft, vTop, vWidth;
  let vHeight = Math.floor((this.getRowHeight() / 2));

  for (let i = 0; i < vList.length; i++) {
    vID = vList[i].getID();
    vBarDiv = vList[i].getBarDiv();
    vTaskDiv = vList[i].getTaskDiv();
    if ((vList[i].getParItem() && vList[i].getParItem().getGroup() == 2)) {
      vParDiv = vList[i].getParItem().getChildRow();
    }
    else vParDiv = vList[i].getChildRow();

    if (vBarDiv) {
      vList[i].setStartX(vBarDiv.offsetLeft + 1);
      vList[i].setStartY(vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1);
      vList[i].setEndX(vBarDiv.offsetLeft + vBarDiv.offsetWidth + 1);
      vList[i].setEndY(vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1);
    }
  }
};

export const sLine = function (x1, y1, x2, y2, pClass) {
  let vLeft = Math.min(x1, x2);
  let vTop = Math.min(y1, y2);
  let vWid = Math.abs(x2 - x1) + 1;
  let vHgt = Math.abs(y2 - y1) + 1;

  let vTmpDiv = document.createElement('div');
  vTmpDiv.id = this.vDivId + 'line' + this.vDepId++;
  vTmpDiv.style.position = 'absolute';
  vTmpDiv.style.overflow = 'hidden';
  vTmpDiv.style.zIndex = '0';
  vTmpDiv.style.left = vLeft + 'px';
  vTmpDiv.style.top = vTop + 'px';
  vTmpDiv.style.width = vWid + 'px';
  vTmpDiv.style.height = vHgt + 'px';

  vTmpDiv.style.visibility = 'visible';

  if (vWid == 1) vTmpDiv.className = 'glinev';
  else vTmpDiv.className = 'glineh';

  if (pClass) vTmpDiv.className += ' ' + pClass;

  this.getLines().appendChild(vTmpDiv);

  if (this.vEvents.onLineDraw && typeof this.vEvents.onLineDraw === 'function' ) {
    this.vEvents.onLineDraw(vTmpDiv);
  }

  return vTmpDiv;
};

export const drawSelector = function (pPos) {
  let vOutput = document.createDocumentFragment();
  let vDisplay = false;

  for (let i = 0; i < this.vShowSelector.length && !vDisplay; i++) {
    if (this.vShowSelector[i].toLowerCase() == pPos.toLowerCase()) vDisplay = true;
  }

  if (vDisplay) {
    let vTmpDiv = newNode(vOutput, 'div', null, 'gselector', this.vLangs[this.vLang]['format'] + ':');

    if (this.vFormatArr.join().toLowerCase().indexOf('hour') != -1)
      addFormatListeners(this, 'hour', newNode(vTmpDiv, 'span', this.vDivId + 'formathour' + pPos, 'gformlabel' + ((this.vFormat == 'hour') ? ' gselected' : ''), this.vLangs[this.vLang]['hour']));

    if (this.vFormatArr.join().toLowerCase().indexOf('day') != -1)
      addFormatListeners(this, 'day', newNode(vTmpDiv, 'span', this.vDivId + 'formatday' + pPos, 'gformlabel' + ((this.vFormat == 'day') ? ' gselected' : ''), this.vLangs[this.vLang]['day']));

    if (this.vFormatArr.join().toLowerCase().indexOf('week') != -1)
      addFormatListeners(this, 'week', newNode(vTmpDiv, 'span', this.vDivId + 'formatweek' + pPos, 'gformlabel' + ((this.vFormat == 'week') ? ' gselected' : ''), this.vLangs[this.vLang]['week']));

    if (this.vFormatArr.join().toLowerCase().indexOf('month') != -1)
      addFormatListeners(this, 'month', newNode(vTmpDiv, 'span', this.vDivId + 'formatmonth' + pPos, 'gformlabel' + ((this.vFormat == 'month') ? ' gselected' : ''), this.vLangs[this.vLang]['month']));

    if (this.vFormatArr.join().toLowerCase().indexOf('quarter') != -1)
      addFormatListeners(this, 'quarter', newNode(vTmpDiv, 'span', this.vDivId + 'formatquarter' + pPos, 'gformlabel' + ((this.vFormat == 'quarter') ? ' gselected' : ''), this.vLangs[this.vLang]['quarter']));
  }
  else {
    newNode(vOutput, 'div', null, 'gselector');
  }
  return vOutput;
};
