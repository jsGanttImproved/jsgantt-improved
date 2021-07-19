import { TaskItem } from "./task";
import { makeRequest } from "./utils/general_utils";

/**
 * 
 * @param pFile 
 * @param pGanttlet 
 */
export const parseJSON = async function (pFile, pGanttVar, vDebug = false, redrawAfter = true) {
  const jsonObj = await makeRequest(pFile, true, true);
  let bd;
  if (vDebug) {
    bd = new Date();
    console.info('before jsonparse', bd);
  }
  addJSONTask(pGanttVar, jsonObj);
  if (this.vDebug) {
    const ad = new Date();
    console.info('after addJSONTask', ad, (ad.getTime() - bd.getTime()));
  }
  if(redrawAfter){
    pGanttVar.Draw();
  }
  return jsonObj;
};

export const parseJSONString = function (pStr, pGanttVar) {
  addJSONTask(pGanttVar, JSON.parse(pStr));
};

export const addJSONTask = function (pGanttVar, pJsonObj) {
  for (let index = 0; index < pJsonObj.length; index++) {
    let id;
    let name;
    let start;
    let end;
    let planstart;
    let planend;
    let itemClass;
    let planClass;
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
    let duration = '';
    let bartext = '';
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
        case 'pplanclass':
        case 'planclass':
          planClass = value;
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
        case 'duration':
        case 'pduration':
          duration = value;
          break;
        case 'bartext':
        case 'pbartext':
          bartext = value;
          break;
        default:
          additionalObject[property.toLowerCase()] = value;
      }
    }

    //if (id != undefined && !isNaN(parseInt(id)) && isFinite(id) && name && start && end && itemClass && completion != undefined && !isNaN(parseFloat(completion)) && isFinite(completion) && !isNaN(parseInt(parent)) && isFinite(parent)) {
    pGanttVar.AddTaskItem(new TaskItem(id, name, start, end, itemClass, link,
      milestone, resourceName, completion, group, parent, open, dependsOn,
      caption, notes, pGanttVar, cost, planstart, planend, duration, bartext,
      additionalObject, planClass));
    //}
  }
};
