import { TaskItem } from "./task";

/**
 * 
 * @param pFile 
 * @param pGanttlet 
 */
export const parseJSON = function (pFile, pGanttVar, vDebug = false) {
  let xhttp;
  if ((<any>window).XMLHttpRequest) {
    xhttp = new XMLHttpRequest();
  } else {	// IE 5/6
    xhttp = new (<any>window).ActiveXObject('Microsoft.XMLHTTP');
  }
  xhttp.open('GET', pFile, false);
  xhttp.send(null);
  
  let bd;
  if (vDebug) {
    bd = new Date();
    console.log('before jsonparse', bd);
  }
  let jsonObj = JSON.parse(xhttp.response);
  if (vDebug) {
    const ad = new Date();
    console.log('after jsonparse', ad, (ad.getTime() - bd.getTime()));
    bd = new Date();
  }

  addJSONTask(pGanttVar, jsonObj);
  if (this.vDebug) {
    const ad = new Date();
    console.log('after addJSONTask', ad, (ad.getTime() - bd.getTime()));
  }
  return jsonObj;
};

export const parseJSONString = function (pStr, pGanttVar) {
  addJSONTask(pGanttVar, eval('(' + pStr + ')'));
};

export const addJSONTask = function (pGanttVar, pJsonObj) {
  if ({}.toString.call(pJsonObj) === '[object Array]') {
    for (let index = 0; index < pJsonObj.length; index++) {
      let id;
      let name;
      let start;
      let end;
      let planstart;
      let planend;
      let itemClass;
      let link = '';
      let milestone = 0;
      let resourceName = '';
      let completion;
      let group = 0;
      let parent;
      let open;
      let dependsOn = '';
      let caption = '';
      let notes = '';
      let cost;
      const additionalObject = {};

      for (let prop in pJsonObj[index]) {
        let property = prop;
        let value = pJsonObj[index][property];
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
          default:
            additionalObject[property.toLowerCase()] = value;
        }
      }

      //if (id != undefined && !isNaN(parseInt(id)) && isFinite(id) && name && start && end && itemClass && completion != undefined && !isNaN(parseFloat(completion)) && isFinite(completion) && !isNaN(parseInt(parent)) && isFinite(parent)) {
      pGanttVar.AddTaskItem(new TaskItem(id, name, start, end, itemClass, link, milestone, resourceName, completion, group, parent, open, dependsOn, caption, notes, pGanttVar, cost, planstart, planend, additionalObject));
      //}
    }
  }
};