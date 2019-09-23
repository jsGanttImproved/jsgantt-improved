"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var task_1 = require("./task");
/**
 *
 * @param pFile
 * @param pGanttlet
 */
exports.parseJSON = function (pFile, pGanttVar, vDebug) {
    if (vDebug === void 0) { vDebug = false; }
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    }
    else { // IE 5/6
        xhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
    }
    xhttp.open('GET', pFile, false);
    xhttp.send(null);
    var bd;
    if (vDebug) {
        bd = new Date();
        console.log('before jsonparse', bd);
    }
    var jsonObj = JSON.parse(xhttp.response);
    if (vDebug) {
        var ad = new Date();
        console.log('after jsonparse', ad, (ad.getTime() - bd.getTime()));
        bd = new Date();
    }
    exports.addJSONTask(pGanttVar, jsonObj);
    if (this.vDebug) {
        var ad = new Date();
        console.log('after addJSONTask', ad, (ad.getTime() - bd.getTime()));
    }
    return jsonObj;
};
exports.parseJSONString = function (pStr, pGanttVar) {
    exports.addJSONTask(pGanttVar, JSON.parse(pStr));
};
exports.addJSONTask = function (pGanttVar, pJsonObj) {
    for (var index = 0; index < pJsonObj.length; index++) {
        var id = void 0;
        var name_1 = void 0;
        var start = void 0;
        var end = void 0;
        var planstart = void 0;
        var planend = void 0;
        var itemClass = void 0;
        var link = '';
        var milestone = 0;
        var resourceName = '';
        var completion = void 0;
        var group = 0;
        var parent_1 = void 0;
        var open_1 = void 0;
        var dependsOn = '';
        var caption = '';
        var notes = '';
        var cost = void 0;
        var duration = '';
        var bartext = '';
        var additionalObject = {};
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
                    name_1 = value;
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
                    parent_1 = value;
                    break;
                case 'popen':
                case 'open':
                    open_1 = value;
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
        pGanttVar.AddTaskItem(new task_1.TaskItem(id, name_1, start, end, itemClass, link, milestone, resourceName, completion, group, parent_1, open_1, dependsOn, caption, notes, pGanttVar, cost, planstart, planend, duration, bartext, additionalObject));
        //}
    }
};
//# sourceMappingURL=json.js.map