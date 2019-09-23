"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("../events");
exports.makeInput = function (formattedValue, editable, type, value, choices) {
    if (type === void 0) { type = 'text'; }
    if (value === void 0) { value = null; }
    if (choices === void 0) { choices = null; }
    if (!value) {
        value = formattedValue;
    }
    if (editable) {
        switch (type) {
            case 'date':
                // Take timezone into account before converting to ISO String
                value = value ? new Date(value.getTime() - (value.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
                return "<input class=\"gantt-inputtable\" type=\"date\" value=\"" + value + "\">";
            case 'resource':
                if (choices) {
                    var found = choices.filter(function (c) { return c.id == value || c.name == value; });
                    if (found && found.length > 0) {
                        value = found[0].id;
                    }
                    else {
                        choices.push({ id: value, name: value });
                    }
                    return "<select>" + choices.map(function (c) { return "<option value=\"" + c.id + "\" " + (value == c.id ? 'selected' : '') + " >" + c.name + "</option>"; }).join('') + "</select>";
                }
                else {
                    return "<input class=\"gantt-inputtable\" type=\"text\" value=\"" + (value ? value : '') + "\">";
                }
            case 'cost':
                return "<input class=\"gantt-inputtable\" type=\"number\" max=\"100\" min=\"0\" value=\"" + (value ? value : '') + "\">";
            default:
                return "<input class=\"gantt-inputtable\" value=\"" + (value ? value : '') + "\">";
        }
    }
    else {
        return formattedValue;
    }
};
exports.newNode = function (pParent, pNodeType, pId, pClass, pText, pWidth, pLeft, pDisplay, pColspan, pAttribs) {
    if (pId === void 0) { pId = null; }
    if (pClass === void 0) { pClass = null; }
    if (pText === void 0) { pText = null; }
    if (pWidth === void 0) { pWidth = null; }
    if (pLeft === void 0) { pLeft = null; }
    if (pDisplay === void 0) { pDisplay = null; }
    if (pColspan === void 0) { pColspan = null; }
    if (pAttribs === void 0) { pAttribs = null; }
    var vNewNode = pParent.appendChild(document.createElement(pNodeType));
    if (pAttribs) {
        for (var i = 0; i + 1 < pAttribs.length; i += 2) {
            vNewNode.setAttribute(pAttribs[i], pAttribs[i + 1]);
        }
    }
    if (pId)
        vNewNode.id = pId; // I wish I could do this with setAttribute but older IEs don't play nice
    if (pClass)
        vNewNode.className = pClass;
    if (pWidth)
        vNewNode.style.width = (isNaN(pWidth * 1)) ? pWidth : pWidth + 'px';
    if (pLeft)
        vNewNode.style.left = (isNaN(pLeft * 1)) ? pLeft : pLeft + 'px';
    if (pText) {
        if (pText.indexOf && pText.indexOf('<') === -1) {
            vNewNode.appendChild(document.createTextNode(pText));
        }
        else {
            vNewNode.insertAdjacentHTML('beforeend', pText);
        }
    }
    if (pDisplay)
        vNewNode.style.display = pDisplay;
    if (pColspan)
        vNewNode.colSpan = pColspan;
    return vNewNode;
};
exports.getArrayLocationByID = function (pId) {
    var vList = this.getList();
    for (var i = 0; i < vList.length; i++) {
        if (vList[i].getID() == pId)
            return i;
    }
    return -1;
};
exports.CalcTaskXY = function () {
    var vID;
    var vList = this.getList();
    var vBarDiv;
    var vTaskDiv;
    var vParDiv;
    var vLeft, vTop, vWidth;
    var vHeight = Math.floor((this.getRowHeight() / 2));
    for (var i = 0; i < vList.length; i++) {
        vID = vList[i].getID();
        vBarDiv = vList[i].getBarDiv();
        vTaskDiv = vList[i].getTaskDiv();
        if ((vList[i].getParItem() && vList[i].getParItem().getGroup() == 2)) {
            vParDiv = vList[i].getParItem().getChildRow();
        }
        else
            vParDiv = vList[i].getChildRow();
        if (vBarDiv) {
            vList[i].setStartX(vBarDiv.offsetLeft + 1);
            vList[i].setStartY(vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1);
            vList[i].setEndX(vBarDiv.offsetLeft + vBarDiv.offsetWidth + 1);
            vList[i].setEndY(vParDiv.offsetTop + vBarDiv.offsetTop + vHeight - 1);
        }
    }
};
exports.sLine = function (x1, y1, x2, y2, pClass) {
    var vLeft = Math.min(x1, x2);
    var vTop = Math.min(y1, y2);
    var vWid = Math.abs(x2 - x1) + 1;
    var vHgt = Math.abs(y2 - y1) + 1;
    var vTmpDiv = document.createElement('div');
    vTmpDiv.id = this.vDivId + 'line' + this.vDepId++;
    vTmpDiv.style.position = 'absolute';
    vTmpDiv.style.overflow = 'hidden';
    vTmpDiv.style.zIndex = '0';
    vTmpDiv.style.left = vLeft + 'px';
    vTmpDiv.style.top = vTop + 'px';
    vTmpDiv.style.width = vWid + 'px';
    vTmpDiv.style.height = vHgt + 'px';
    vTmpDiv.style.visibility = 'visible';
    if (vWid == 1)
        vTmpDiv.className = 'glinev';
    else
        vTmpDiv.className = 'glineh';
    if (pClass)
        vTmpDiv.className += ' ' + pClass;
    this.getLines().appendChild(vTmpDiv);
    if (this.vEvents.onLineDraw && typeof this.vEvents.onLineDraw === 'function') {
        this.vEvents.onLineDraw(vTmpDiv);
    }
    return vTmpDiv;
};
exports.drawSelector = function (pPos) {
    var vOutput = document.createDocumentFragment();
    var vDisplay = false;
    for (var i = 0; i < this.vShowSelector.length && !vDisplay; i++) {
        if (this.vShowSelector[i].toLowerCase() == pPos.toLowerCase())
            vDisplay = true;
    }
    if (vDisplay) {
        var vTmpDiv = exports.newNode(vOutput, 'div', null, 'gselector', this.vLangs[this.vLang]['format'] + ':');
        if (this.vFormatArr.join().toLowerCase().indexOf('hour') != -1)
            events_1.addFormatListeners(this, 'hour', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formathour' + pPos, 'gformlabel' + ((this.vFormat == 'hour') ? ' gselected' : ''), this.vLangs[this.vLang]['hour']));
        if (this.vFormatArr.join().toLowerCase().indexOf('day') != -1)
            events_1.addFormatListeners(this, 'day', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatday' + pPos, 'gformlabel' + ((this.vFormat == 'day') ? ' gselected' : ''), this.vLangs[this.vLang]['day']));
        if (this.vFormatArr.join().toLowerCase().indexOf('week') != -1)
            events_1.addFormatListeners(this, 'week', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatweek' + pPos, 'gformlabel' + ((this.vFormat == 'week') ? ' gselected' : ''), this.vLangs[this.vLang]['week']));
        if (this.vFormatArr.join().toLowerCase().indexOf('month') != -1)
            events_1.addFormatListeners(this, 'month', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatmonth' + pPos, 'gformlabel' + ((this.vFormat == 'month') ? ' gselected' : ''), this.vLangs[this.vLang]['month']));
        if (this.vFormatArr.join().toLowerCase().indexOf('quarter') != -1)
            events_1.addFormatListeners(this, 'quarter', exports.newNode(vTmpDiv, 'span', this.vDivId + 'formatquarter' + pPos, 'gformlabel' + ((this.vFormat == 'quarter') ? ' gselected' : ''), this.vLangs[this.vLang]['quarter']));
    }
    else {
        exports.newNode(vOutput, 'div', null, 'gselector');
    }
    return vOutput;
};
//# sourceMappingURL=draw_utils.js.map