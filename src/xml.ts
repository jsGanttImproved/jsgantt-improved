import { TaskItem } from "./task";
import { formatDateStr, parseDateFormatStr } from "./utils";

export const parseXML = function (pFile, pGanttVar) {
  let xhttp;
  if ((<any>window).XMLHttpRequest) {
    xhttp = new (<any>window).XMLHttpRequest();
  } else {	// IE 5/6
    xhttp = new (<any>window).ActiveXObject('Microsoft.XMLHTTP');
  }

  xhttp.open('GET', pFile, false);
  xhttp.send(null);
  let xmlDoc = xhttp.responseXML;

  AddXMLTask(pGanttVar, xmlDoc);
};

export const parseXMLString = function (pStr, pGanttVar) {
  let xmlDoc;
  if (typeof (<any>window).DOMParser != 'undefined') {
    xmlDoc = (new (<any>window).DOMParser()).parseFromString(pStr, 'text/xml');
  } else if (typeof (<any>window).ActiveXObject != 'undefined' &&
    new (<any>window).ActiveXObject('Microsoft.XMLDOM')) {
    xmlDoc = new (<any>window).ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = 'false';
    xmlDoc.loadXML(pStr);
  }

  AddXMLTask(pGanttVar, xmlDoc);
};


export const findXMLNode = function (pRoot, pNodeName) {
  let vRetValue;

  try {
    vRetValue = pRoot.getElementsByTagName(pNodeName);
  } catch (error) { ; } // do nothing, we'll return undefined

  return vRetValue;
};

// pType can be 1=numeric, 2=String, all other values just return raw data
export const getXMLNodeValue = function (pRoot, pNodeName, pType, pDefault) {
  let vRetValue;

  try {
    vRetValue = pRoot.getElementsByTagName(pNodeName)[0].childNodes[0].nodeValue;
  } catch (error) {
    if (typeof pDefault != 'undefined') vRetValue = pDefault;
  }

  if (typeof vRetValue != 'undefined' && vRetValue != null) {
    if (pType == 1) vRetValue *= 1;
    else if (pType == 2) vRetValue = vRetValue.toString();
  }
  return vRetValue;
};

export const AddXMLTask = function (pGanttVar, pXmlDoc) {
  let project = '';
  let vMSP = false;
  let Task;
  let n = 0;
  let m = 0;
  let i = 0;
  let j = 0;
  let k = 0;
  let maxPID = 0;
  let ass = new Array();
  let assRes = new Array();
  let res = new Array();
  let pars = new Array();

  let projNode = findXMLNode(pXmlDoc, 'Project');
  if (typeof projNode != 'undefined' && projNode.length > 0) project = projNode[0].getAttribute('xmlns');

  if (project == 'http://schemas.microsoft.com/project') {
    vMSP = true;
    pGanttVar.setDateInputFormat('yyyy-mm-dd');
    Task = findXMLNode(pXmlDoc, 'Task');
    if (typeof Task == 'undefined') n = 0;
    else n = Task.length;

    let resources = findXMLNode(pXmlDoc, 'Resource');
    if (typeof resources == 'undefined') { n = 0; m = 0; }
    else m = resources.length;

    for (i = 0; i < m; i++) {
      let resname = getXMLNodeValue(resources[i], 'Name', 2, '');
      let uid = getXMLNodeValue(resources[i], 'UID', 1, -1);

      if (resname.length > 0 && uid > 0) res[uid] = resname;
    }

    let assignments = findXMLNode(pXmlDoc, 'Assignment');
    if (typeof assignments == 'undefined') j = 0;
    else j = assignments.length;
    
    for (i = 0; i < j; i++) {
      let uid;
      let resUID = getXMLNodeValue(assignments[i], 'ResourceUID', 1, -1);
      uid = getXMLNodeValue(assignments[i], 'TaskUID', 1, -1);

      if (uid > 0) {
        if (resUID > 0) assRes[uid] = res[resUID];
        ass[uid] = assignments[i];
      }
    }

    // Store information about parent UIDs in an easily searchable form
    for (i = 0; i < n; i++) {
      let uid;
      uid = getXMLNodeValue(Task[i], 'UID', 1, 0);
      let vOutlineNumber;
      if (uid != 0) vOutlineNumber = getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
      if (uid > 0) pars[vOutlineNumber] = uid;
      if (uid > maxPID) maxPID = uid;
    }

    for (i = 0; i < n; i++) {
      // optional parameters may not have an entry
      // Task ID must NOT be zero otherwise it will be skipped
      let pID = getXMLNodeValue(Task[i], 'UID', 1, 0);

      if (pID != 0) {
        let pName = getXMLNodeValue(Task[i], 'Name', 2, 'No Task Name');
        let pStart = getXMLNodeValue(Task[i], 'Start', 2, '');
        let pEnd = getXMLNodeValue(Task[i], 'Finish', 2, '');
        let pLink = getXMLNodeValue(Task[i], 'HyperlinkAddress', 2, '');
        let pMile = getXMLNodeValue(Task[i], 'Milestone', 1, 0);
        let pComp = getXMLNodeValue(Task[i], 'PercentWorkComplete', 1, 0);
        let pCost = getXMLNodeValue(Task[i], 'Cost', 2, 0);
        let pGroup = getXMLNodeValue(Task[i], 'Summary', 1, 0);

        let pParent = 0;

        let vOutlineLevel = getXMLNodeValue(Task[i], 'OutlineLevel', 1, 0);
        let vOutlineNumber;
        if (vOutlineLevel > 1) {
          vOutlineNumber = getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
          pParent = pars[vOutlineNumber.substr(0, vOutlineNumber.lastIndexOf('.'))];
        }

        let pNotes;
        try {
          pNotes = Task[i].getElementsByTagName('Notes')[0].childNodes[1].nodeValue; //this should be a CDATA node
        } catch (error) { pNotes = ''; }

        let pRes;
        if (typeof assRes[pID] != 'undefined') pRes = assRes[pID];
        else pRes = '';

        let predecessors = findXMLNode(Task[i], 'PredecessorLink');
        if (typeof predecessors == 'undefined') j = 0;
        else j = predecessors.length;
        let pDepend = '';

        for (k = 0; k < j; k++) {
          let depUID = getXMLNodeValue(predecessors[k], 'PredecessorUID', 1, -1);
          let depType = getXMLNodeValue(predecessors[k], 'Type', 1, 1);

          if (depUID > 0) {
            if (pDepend.length > 0) pDepend += ',';
            switch (depType) {
              case 0: pDepend += depUID + 'FF'; break;
              case 1: pDepend += depUID + 'FS'; break;
              case 2: pDepend += depUID + 'SF'; break;
              case 3: pDepend += depUID + 'SS'; break;
              default: pDepend += depUID + 'FS'; break;
            }
          }
        }

        let pOpen = 1;
        let pCaption = '';

        let pClass;
        if (pGroup > 0) pClass = 'ggroupblack';
        else if (pMile > 0) pClass = 'gmilestone';
        else pClass = 'gtaskblue';

        // check for split tasks

        let splits = findXMLNode(ass[pID], 'TimephasedData');
        if (typeof splits == 'undefined') j = 0;
        else j = splits.length;

        let vSplitStart = pStart;
        let vSplitEnd = pEnd;
        let vSubCreated = false;
        let vDepend = pDepend.replace(/,*[0-9]+[FS]F/g, '');

        for (k = 0; k < j; k++) {
          let vDuration = getXMLNodeValue(splits[k], 'Value', 2, '0');
          //remove all text
          vDuration = '0' + vDuration.replace(/\D/g, '');
          vDuration *= 1;
          if ((vDuration == 0 && !vSubCreated) || (k + 1 == j && pGroup == 2)) {
            // No time booked in the given period (or last entry)
            // Make sure the parent task is set as a combined group
            pGroup = 2;
            // Handle last loop
            if (k + 1 == j) vDepend = pDepend.replace(/,*[0-9]+[FS]S/g, '');
            // Now create a subtask
            maxPID++;
            vSplitEnd = getXMLNodeValue(splits[k], (k + 1 == j) ? 'Finish' : 'Start', 2, '');
            pGanttVar.AddTaskItem(new TaskItem(maxPID, pName, vSplitStart, vSplitEnd, 'gtaskblue', pLink, pMile, pRes, pComp, 0, pID, pOpen, vDepend, pCaption, pNotes, pGanttVar, pCost));
            vSubCreated = true;
            vDepend = '';
          }
          else if (vDuration != 0 && vSubCreated) {
            vSplitStart = getXMLNodeValue(splits[k], 'Start', 2, '');
            vSubCreated = false;
          }
        }
        if (vSubCreated) pDepend = '';

        // Finally add the task
        pGanttVar.AddTaskItem(new TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar, pCost));
      }
    }
  }
  else {
    Task = pXmlDoc.getElementsByTagName('task');
    n = Task.length;

    for (i = 0; i < n; i++) {
      // optional parameters may not have an entry
      // Task ID must NOT be zero otherwise it will be skipped
      let pID = getXMLNodeValue(Task[i], 'pID', 1, 0);

      if (pID != 0) {
        let pName = getXMLNodeValue(Task[i], 'pName', 2, 'No Task Name');
        let pStart = getXMLNodeValue(Task[i], 'pStart', 2, '');
        let pEnd = getXMLNodeValue(Task[i], 'pEnd', 2, '');
        let pLink = getXMLNodeValue(Task[i], 'pLink', 2, '');
        let pMile = getXMLNodeValue(Task[i], 'pMile', 1, 0);
        let pComp = getXMLNodeValue(Task[i], 'pComp', 1, 0);
        let pCost = getXMLNodeValue(Task[i], 'pCost', 2, 0);
        let pGroup = getXMLNodeValue(Task[i], 'pGroup', 1, 0);
        let pParent = getXMLNodeValue(Task[i], 'pParent', 1, 0);
        let pRes = getXMLNodeValue(Task[i], 'pRes', 2, '');
        let pOpen = getXMLNodeValue(Task[i], 'pOpen', 1, 1);
        let pDepend = getXMLNodeValue(Task[i], 'pDepend', 2, '');
        let pCaption = getXMLNodeValue(Task[i], 'pCaption', 2, '');
        let pNotes = getXMLNodeValue(Task[i], 'pNotes', 2, '');
        let pClass = getXMLNodeValue(Task[i], 'pClass', 2, '');
        if (typeof pClass == 'undefined') {
          if (pGroup > 0) pClass = 'ggroupblack';
          else if (pMile > 0) pClass = 'gmilestone';
          else pClass = 'gtaskblue';
        }

        // Finally add the task
        pGanttVar.AddTaskItem(new TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar, pCost));
      }
    }
  }


};


export const getXMLProject = function () {
  let vProject = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
  for (let i = 0; i < this.vTaskList.length; i++) {
    vProject += this.getXMLTask(i, true);
  }
  vProject += '</project>';
  return vProject;
};

export const getXMLTask = function (pID, pIdx) {
  let i = 0;
  let vIdx = -1;
  let vTask = '';
  let vOutFrmt = parseDateFormatStr(this.getDateInputFormat() + ' HH:MI');
  if (pIdx === true) vIdx = pID;
  else {
    for (i = 0; i < this.vTaskList.length; i++) {
      if (this.vTaskList[i].getID() == pID) { vIdx = i; break; }
    }
  }
  if (vIdx >= 0 && vIdx < this.vTaskList.length) {
    /* Simplest way to return case sensitive node names is to just build a string */
    vTask = '<task>';
    vTask += '<pID>' + this.vTaskList[vIdx].getID() + '</pID>';
    vTask += '<pName>' + this.vTaskList[vIdx].getName() + '</pName>';
    vTask += '<pStart>' + formatDateStr(this.vTaskList[vIdx].getStart(), vOutFrmt, this.vLangs[this.vLang]) + '</pStart>';
    vTask += '<pEnd>' + formatDateStr(this.vTaskList[vIdx].getEnd(), vOutFrmt, this.vLangs[this.vLang]) + '</pEnd>';
    vTask += '<pClass>' + this.vTaskList[vIdx].getClass() + '</pClass>';
    vTask += '<pLink>' + this.vTaskList[vIdx].getLink() + '</pLink>';
    vTask += '<pMile>' + this.vTaskList[vIdx].getMile() + '</pMile>';
    if (this.vTaskList[vIdx].getResource() != '\u00A0') vTask += '<pRes>' + this.vTaskList[vIdx].getResource() + '</pRes>';
    vTask += '<pComp>' + this.vTaskList[vIdx].getCompVal() + '</pComp>';
    vTask += '<pCost>' + this.vTaskList[vIdx].getCost() + '</pCost>';
    vTask += '<pGroup>' + this.vTaskList[vIdx].getGroup() + '</pGroup>';
    vTask += '<pParent>' + this.vTaskList[vIdx].getParent() + '</pParent>';
    vTask += '<pOpen>' + this.vTaskList[vIdx].getOpen() + '</pOpen>';
    vTask += '<pDepend>';
    let vDepList = this.vTaskList[vIdx].getDepend();
    for (i = 0; i < vDepList.length; i++) {
      if (i > 0) vTask += ',';
      if (vDepList[i] > 0) vTask += vDepList[i] + this.vTaskList[vIdx].getDepType()[i];
    }
    vTask += '</pDepend>';
    vTask += '<pCaption>' + this.vTaskList[vIdx].getCaption() + '</pCaption>';

    let vTmpFrag = document.createDocumentFragment();
    let vTmpDiv = this.newNode(vTmpFrag, 'div', null, null, this.vTaskList[vIdx].getNotes().innerHTML);
    vTask += '<pNotes>' + vTmpDiv.innerHTML + '</pNotes>';
    vTask += '</task>';
  }
  return vTask;
};
