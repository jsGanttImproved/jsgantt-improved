declare var JSGantt: any;

export const parseXML = function (pFile, pGanttVar) {
  if ((<any>window).XMLHttpRequest) {
    var xhttp = new (<any>window).XMLHttpRequest();
  } else {	// IE 5/6
    xhttp = new (<any>window).ActiveXObject('Microsoft.XMLHTTP');
  }

  xhttp.open('GET', pFile, false);
  xhttp.send(null);
  var xmlDoc = xhttp.responseXML;

  JSGantt.AddXMLTask(pGanttVar, xmlDoc);
};

export const parseXMLString = function (pStr, pGanttVar) {
  if (typeof (<any>window).DOMParser != 'undefined') {
    var xmlDoc = (new (<any>window).DOMParser()).parseFromString(pStr, 'text/xml');
  } else if (typeof (<any>window).ActiveXObject != 'undefined' &&
    new (<any>window).ActiveXObject('Microsoft.XMLDOM')) {
    xmlDoc = new (<any>window).ActiveXObject('Microsoft.XMLDOM');
    xmlDoc.async = 'false';
    xmlDoc.loadXML(pStr);
  }

  JSGantt.AddXMLTask(pGanttVar, xmlDoc);
};


export const findXMLNode = function (pRoot, pNodeName) {
  var vRetValue;

  try {
    vRetValue = pRoot.getElementsByTagName(pNodeName);
  } catch (error) { ; } // do nothing, we'll return undefined

  return vRetValue;
};

// pType can be 1=numeric, 2=String, all other values just return raw data
export const getXMLNodeValue = function (pRoot, pNodeName, pType, pDefault) {
  var vRetValue;

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
  var project = '';
  var vMSP = false;
  var Task;
  var n = 0;
  var m = 0;
  var i = 0;
  var j = 0;
  var k = 0;
  var maxPID = 0;
  var ass = new Array();
  var assRes = new Array();
  var res = new Array();
  var pars = new Array();

  var projNode = JSGantt.findXMLNode(pXmlDoc, 'Project');
  if (typeof projNode != 'undefined' && projNode.length > 0) project = projNode[0].getAttribute('xmlns');

  if (project == 'http://schemas.microsoft.com/project') {
    vMSP = true;
    pGanttVar.setDateInputFormat('yyyy-mm-dd');
    Task = JSGantt.findXMLNode(pXmlDoc, 'Task');
    if (typeof Task == 'undefined') n = 0;
    else n = Task.length;

    var resources = JSGantt.findXMLNode(pXmlDoc, 'Resource');
    if (typeof resources == 'undefined') { n = 0; m = 0; }
    else m = resources.length;

    for (i = 0; i < m; i++) {
      var resname = JSGantt.getXMLNodeValue(resources[i], 'Name', 2, '');
      var uid = JSGantt.getXMLNodeValue(resources[i], 'UID', 1, -1);

      if (resname.length > 0 && uid > 0) res[uid] = resname;
    }

    var assignments = JSGantt.findXMLNode(pXmlDoc, 'Assignment');
    if (typeof assignments == 'undefined') j = 0;
    else j = assignments.length;

    for (i = 0; i < j; i++) {
      var resUID = JSGantt.getXMLNodeValue(assignments[i], 'ResourceUID', 1, -1);
      uid = JSGantt.getXMLNodeValue(assignments[i], 'TaskUID', 1, -1);

      if (uid > 0) {
        if (resUID > 0) assRes[uid] = res[resUID];
        ass[uid] = assignments[i];
      }
    }

    // Store information about parent UIDs in an easily searchable form
    for (i = 0; i < n; i++) {
      uid = JSGantt.getXMLNodeValue(Task[i], 'UID', 1, 0);

      if (uid != 0) var vOutlineNumber = JSGantt.getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
      if (uid > 0) pars[vOutlineNumber] = uid;
      if (uid > maxPID) maxPID = uid;
    }

    for (i = 0; i < n; i++) {
      // optional parameters may not have an entry
      // Task ID must NOT be zero otherwise it will be skipped
      var pID = JSGantt.getXMLNodeValue(Task[i], 'UID', 1, 0);

      if (pID != 0) {
        var pName = JSGantt.getXMLNodeValue(Task[i], 'Name', 2, 'No Task Name');
        var pStart = JSGantt.getXMLNodeValue(Task[i], 'Start', 2, '');
        var pEnd = JSGantt.getXMLNodeValue(Task[i], 'Finish', 2, '');
        var pLink = JSGantt.getXMLNodeValue(Task[i], 'HyperlinkAddress', 2, '');
        var pMile = JSGantt.getXMLNodeValue(Task[i], 'Milestone', 1, 0);
        var pComp = JSGantt.getXMLNodeValue(Task[i], 'PercentWorkComplete', 1, 0);
        var pGroup = JSGantt.getXMLNodeValue(Task[i], 'Summary', 1, 0);

        var pParent = 0;

        var vOutlineLevel = JSGantt.getXMLNodeValue(Task[i], 'OutlineLevel', 1, 0);
        if (vOutlineLevel > 1) {
          vOutlineNumber = JSGantt.getXMLNodeValue(Task[i], 'OutlineNumber', 2, '0');
          pParent = pars[vOutlineNumber.substr(0, vOutlineNumber.lastIndexOf('.'))];
        }

        try {
          var pNotes = Task[i].getElementsByTagName('Notes')[0].childNodes[1].nodeValue; //this should be a CDATA node
        } catch (error) { pNotes = ''; }

        if (typeof assRes[pID] != 'undefined') var pRes = assRes[pID];
        else pRes = '';

        var predecessors = JSGantt.findXMLNode(Task[i], 'PredecessorLink');
        if (typeof predecessors == 'undefined') j = 0;
        else j = predecessors.length;
        var pDepend = '';

        for (k = 0; k < j; k++) {
          var depUID = JSGantt.getXMLNodeValue(predecessors[k], 'PredecessorUID', 1, -1);
          var depType = JSGantt.getXMLNodeValue(predecessors[k], 'Type', 1, 1);

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

        var pOpen = 1;
        var pCaption = '';

        if (pGroup > 0) var pClass = 'ggroupblack';
        else if (pMile > 0) pClass = 'gmilestone';
        else pClass = 'gtaskblue';

        // check for split tasks

        var splits = JSGantt.findXMLNode(ass[pID], 'TimephasedData');
        if (typeof splits == 'undefined') j = 0;
        else j = splits.length;

        var vSplitStart = pStart;
        var vSplitEnd = pEnd;
        var vSubCreated = false;
        var vDepend = pDepend.replace(/,*[0-9]+[FS]F/g, '');

        for (k = 0; k < j; k++) {
          var vDuration = JSGantt.getXMLNodeValue(splits[k], 'Value', 2, '0');
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
            vSplitEnd = JSGantt.getXMLNodeValue(splits[k], (k + 1 == j) ? 'Finish' : 'Start', 2, '');
            pGanttVar.AddTaskItem(new JSGantt.TaskItem(maxPID, pName, vSplitStart, vSplitEnd, 'gtaskblue', pLink, pMile, pRes, pComp, 0, pID, pOpen, vDepend, pCaption, pNotes, pGanttVar));
            vSubCreated = true;
            vDepend = '';
          }
          else if (vDuration != 0 && vSubCreated) {
            vSplitStart = JSGantt.getXMLNodeValue(splits[k], 'Start', 2, '');
            vSubCreated = false;
          }
        }
        if (vSubCreated) pDepend = '';

        // Finally add the task
        pGanttVar.AddTaskItem(new JSGantt.TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar));
      }
    }
  }
  else {
    Task = pXmlDoc.getElementsByTagName('task');
    n = Task.length;

    for (i = 0; i < n; i++) {
      // optional parameters may not have an entry
      // Task ID must NOT be zero otherwise it will be skipped
      pID = JSGantt.getXMLNodeValue(Task[i], 'pID', 1, 0);

      if (pID != 0) {
        pName = JSGantt.getXMLNodeValue(Task[i], 'pName', 2, 'No Task Name');
        pStart = JSGantt.getXMLNodeValue(Task[i], 'pStart', 2, '');
        pEnd = JSGantt.getXMLNodeValue(Task[i], 'pEnd', 2, '');
        pLink = JSGantt.getXMLNodeValue(Task[i], 'pLink', 2, '');
        pMile = JSGantt.getXMLNodeValue(Task[i], 'pMile', 1, 0);
        pComp = JSGantt.getXMLNodeValue(Task[i], 'pComp', 1, 0);
        pGroup = JSGantt.getXMLNodeValue(Task[i], 'pGroup', 1, 0);
        pParent = JSGantt.getXMLNodeValue(Task[i], 'pParent', 1, 0);
        pRes = JSGantt.getXMLNodeValue(Task[i], 'pRes', 2, '');
        pOpen = JSGantt.getXMLNodeValue(Task[i], 'pOpen', 1, 1);
        pDepend = JSGantt.getXMLNodeValue(Task[i], 'pDepend', 2, '');
        pCaption = JSGantt.getXMLNodeValue(Task[i], 'pCaption', 2, '');
        pNotes = JSGantt.getXMLNodeValue(Task[i], 'pNotes', 2, '');
        pClass = JSGantt.getXMLNodeValue(Task[i], 'pClass', 2);
        if (typeof pClass == 'undefined') {
          if (pGroup > 0) pClass = 'ggroupblack';
          else if (pMile > 0) pClass = 'gmilestone';
          else pClass = 'gtaskblue';
        }

        // Finally add the task
        pGanttVar.AddTaskItem(new JSGantt.TaskItem(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGanttVar));
      }
    }
  }
};
