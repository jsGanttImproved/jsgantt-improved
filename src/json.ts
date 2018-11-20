import { TaskItem } from "./task";

/**
 * 
 * @param pFile 
 * @param pGanttVar 
 */
export const parseJSON = function (pFile, pGanttVar) {
  if ((<any>window).XMLHttpRequest) {
    var xhttp = new XMLHttpRequest();
  } else {	// IE 5/6
    xhttp = new (<any>window).ActiveXObject('Microsoft.XMLHTTP');
  }

  xhttp.open('GET', pFile, false);
  xhttp.send(null);
  var jsonObj = eval('(' + xhttp.response + ')');

  addJSONTask(pGanttVar, jsonObj);
};

export const parseJSONString = function (pStr, pGanttVar) {
  addJSONTask(pGanttVar, eval('(' + pStr + ')'));
};

export const addJSONTask = function (pGanttVar, pJsonObj) {
  if ({}.toString.call(pJsonObj) === '[object Array]') {
    for (var index = 0; index < pJsonObj.length; index++) {
      var id;
      var name;
      var start;
      var end;
      var planstart;
      var planend;
      var itemClass;
      var link = '';
      var milestone = 0;
      var resourceName = '';
      var completion;
      var group = 0;
      var parent;
      var open;
      var dependsOn = '';
      var caption = '';
      var notes = '';
      var cost;

      for (var prop in pJsonObj[index]) {
        var property = prop;
        var value = pJsonObj[index][property];
        switch (property.toLowerCase()) {
          case 'pid':
          case 'id':
            id = value;
            break;
          case 'pname':
          case 'name':
            name = value;
            break;
          case 'pstart':
          case 'start':
            start = value;
            break;
          case 'pend':
          case 'end':
            end = value;
            break;
          case 'pplanstart':
          case 'planstart':
            planstart = value;
            break;
          case 'pplanend':
          case 'planend':
            planend = value;
            break;
          case 'pclass':
          case 'class':
            itemClass = value;
            break;
          case 'plink':
          case 'link':
            link = value;
            break;
          case 'pmile':
          case 'mile':
            milestone = value;
            break;
          case 'pres':
          case 'res':
            resourceName = value;
            break;
          case 'pcomp':
          case 'comp':
            completion = value;
            break;
          case 'pgroup':
          case 'group':
            group = value;
            break;
          case 'pparent':
          case 'parent':
            parent = value;
            break;
          case 'popen':
          case 'open':
            open = value;
            break;
          case 'pdepend':
          case 'depend':
            dependsOn = value;
            break;
          case 'pcaption':
          case 'caption':
            caption = value;
            break;
          case 'pnotes':
          case 'notes':
            notes = value;
            break;
          case 'pcost':
          case 'cost':
            cost = value;
            break;
        }
      }

      //if (id != undefined && !isNaN(parseInt(id)) && isFinite(id) && name && start && end && itemClass && completion != undefined && !isNaN(parseFloat(completion)) && isFinite(completion) && !isNaN(parseInt(parent)) && isFinite(parent)) {
      pGanttVar.AddTaskItem(new TaskItem(id, name, start, end, itemClass, link, milestone, resourceName, completion, group, parent, open, dependsOn, caption, notes, pGanttVar, cost, planstart, planend));
      //}
    }
  }
};