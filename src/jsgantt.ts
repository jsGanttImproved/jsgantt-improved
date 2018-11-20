/*
	   _        ___            _   _    _____                                        _
	  (_)___   / _ \__ _ _ __ | |_| |_  \_   \_ __ ___  _ __  _ __ _____   _____  __| |
	  | / __| / /_\/ _` | '_ \| __| __|  / /\/ '_ ` _ \| '_ \| '__/ _ \ \ / / _ \/ _` |
	  | \__ \/ /_\\ (_| | | | | |_| |_/\/ /_ | | | | | | |_) | | | (_) \ V /  __/ (_| |
	 _/ |___/\____/\__,_|_| |_|\__|\__\____/ |_| |_| |_| .__/|_|  \___/ \_/ \___|\__,_|
	|__/                                               |_|
	jsGanttImproved 1.7.5.4

	The current version of this code can be found at https://github.com/jsGanttImproved/jsgantt-improved/

	* Copyright (c) 2013-2018, Paul Geldart, Eduardo Rodrigues and Ricardo Cardoso.
	*
	* Redistribution and use in source and binary forms, with or without
	* modification, are permitted provided that the following conditions are met:
	*     * Redistributions of source code must retain the above copyright
	*       notice, this list of conditions and the following disclaimer.
	*     * Redistributions in binary form must reproduce the above copyright
	*       notice, this list of conditions and the following disclaimer in the
	*       documentation and/or other materials provided with the distribution.
	*     * Neither the name of Paul Geldart, Eduardo Rodrigues and Ricardo Cardoso nor the names of its contributors
	*       may be used to endorse or promote products derived from this software
	*       without specific prior written permission.
	*
	* THIS SOFTWARE IS PROVIDED BY PAUL GELDART, EDUARDO RODRIGUES AND RICARDO CARDOSO ''AS IS'' AND ANY EXPRESS OR
	* IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	* OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	* IN NO EVENT SHALL PAUL GELDART, EDUARDO RODRIGUES AND RICARDO CARDOSO BE LIABLE FOR ANY DIRECT,
	* INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

	This project is based on jsGantt 1.2, (which can be obtained from
	https://code.google.com/p/jsgantt/) and remains under the original BSD license.
	The original project license follows:

	Copyright (c) 2009, Shlomy Gantz BlueBrick Inc.

	* Redistribution and use in source and binary forms, with or without
	* modification, are permitted provided that the following conditions are met:
	*     * Redistributions of source code must retain the above copyright
	*       notice, this list of conditions and the following disclaimer.
	*     * Redistributions in binary form must reproduce the above copyright
	*       notice, this list of conditions and the following disclaimer in the
	*       documentation and/or other materials provided with the distribution.
	*     * Neither the name of Shlomy Gantz or BlueBrick Inc. nor the
	*       names of its contributors may be used to endorse or promote products
	*       derived from this software without specific prior written permission.
	*
	* THIS SOFTWARE IS PROVIDED BY SHLOMY GANTZ/BLUEBRICK INC. ''AS IS'' AND ANY
	* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	* DISCLAIMED. IN NO EVENT SHALL SHLOMY GANTZ/BLUEBRICK INC. BE LIABLE FOR ANY
	* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import { showToolTip, hideToolTip, fadeToolTip, moveToolTip } from "./events";
import { getMinDate, getMaxDate, findObj, changeFormat, parseDateStr, formatDateStr, parseDateFormatStr, stripIds, stripUnwanted, delayedHide, getOffset, getScrollPositions, isIE, benchMark, getIsoWeek, getZoomFactor } from "./utils";
import { parseXML, parseXMLString, findXMLNode, getXMLNodeValue, AddXMLTask } from './xml';
import { folder, hide, show, taskLink, sortTasks, TaskItem } from "./task";
import { processRows, GanttChart, updateFlyingObj } from "./draw";
import { parseJSON, parseJSONString, addJSONTask } from "./json";

export let JSGantt; if (!JSGantt) JSGantt = {};

JSGantt.isIE = isIE;
JSGantt.TaskItem = TaskItem;
JSGantt.GanttChart = GanttChart;
JSGantt.updateFlyingObj = updateFlyingObj;
JSGantt.showToolTip = showToolTip;

JSGantt.stripIds = stripIds;
JSGantt.stripUnwanted = stripUnwanted;
JSGantt.delayedHide = delayedHide;

JSGantt.hideToolTip = hideToolTip;
JSGantt.fadeToolTip = fadeToolTip;
JSGantt.moveToolTip = moveToolTip;

JSGantt.getZoomFactor = getZoomFactor;

JSGantt.getOffset = getOffset;
JSGantt.getScrollPositions = getScrollPositions;
JSGantt.processRows = processRows;
JSGantt.sortTasks = sortTasks;

// Used to determine the minimum date of all tasks and set lower bound based on format
JSGantt.getMinDate = getMinDate;

// Used to determine the maximum date of all tasks and set upper bound based on format
JSGantt.getMaxDate = getMaxDate;

// This function finds the document id of the specified object
JSGantt.findObj = findObj;

JSGantt.changeFormat = changeFormat;

// Tasks
JSGantt.folder = folder;
JSGantt.hide = hide;
JSGantt.show = show;
JSGantt.taskLink = taskLink;

JSGantt.parseDateStr = parseDateStr;
JSGantt.formatDateStr = formatDateStr;
JSGantt.parseDateFormatStr = parseDateFormatStr;

// XML 
JSGantt.parseXML = parseXML;
JSGantt.parseXMLString = parseXMLString;
JSGantt.findXMLNode = findXMLNode;
JSGantt.getXMLNodeValue = getXMLNodeValue;
JSGantt.AddXMLTask = AddXMLTask;

// JSON
JSGantt.parseJSON = parseJSON;
JSGantt.parseJSONString = parseJSONString;
JSGantt.addJSONTask = addJSONTask;

JSGantt.benchMark = benchMark;
JSGantt.getIsoWeek = getIsoWeek;

JSGantt.addListener = function (eventName, handler, control) {
  // Check if control is a string
  if (control === String(control)) control = JSGantt.findObj(control);

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

JSGantt.addTooltipListeners = function (pGanttChart, pObj1, pObj2) {
  JSGantt.addListener('mouseover', function (e) { JSGantt.showToolTip(pGanttChart, e, pObj2, null, pGanttChart.getTimer()); }, pObj1);
  JSGantt.addListener('mouseout', function (e) { JSGantt.delayedHide(pGanttChart, pGanttChart.vTool, pGanttChart.getTimer()); }, pObj1);
};

JSGantt.addThisRowListeners = function (pGanttChart, pObj1, pObj2) {
  JSGantt.addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj1);
  JSGantt.addListener('mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj2);
  JSGantt.addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj1);
  JSGantt.addListener('mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj2);
};

JSGantt.addFolderListeners = function (pGanttChart, pObj, pID) {
  JSGantt.addListener('click', function () { JSGantt.folder(pID, pGanttChart); }, pObj);
};

JSGantt.addFormatListeners = function (pGanttChart, pFormat, pObj) {
  JSGantt.addListener('click', function () { JSGantt.changeFormat(pFormat, pGanttChart); }, pObj);
};

JSGantt.addScrollListeners = function (pGanttChart) {
  JSGantt.addListener('scroll', function () { pGanttChart.getChartBody().scrollTop = pGanttChart.getListBody().scrollTop; }, pGanttChart.getListBody());
  JSGantt.addListener('scroll', function () { pGanttChart.getListBody().scrollTop = pGanttChart.getChartBody().scrollTop; }, pGanttChart.getChartBody());
  JSGantt.addListener('scroll', function () { pGanttChart.getChartHead().scrollLeft = pGanttChart.getChartBody().scrollLeft; }, pGanttChart.getChartBody());
  JSGantt.addListener('scroll', function () { pGanttChart.getChartBody().scrollLeft = pGanttChart.getChartHead().scrollLeft; }, pGanttChart.getChartHead());
  JSGantt.addListener('resize', function () { pGanttChart.getChartHead().scrollLeft = pGanttChart.getChartBody().scrollLeft; }, window);
  JSGantt.addListener('resize', function () { pGanttChart.getListBody().scrollTop = pGanttChart.getChartBody().scrollTop; }, window);
};

