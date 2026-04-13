let dataurl;
let jsonObj;
let g;

function start(e) {
  g = new JSGantt.GanttChart(document.getElementById("embedded-Gantt"), "week");
  if (g.getDivId() != null) {
    const newDataurl = document.getElementById("dataurl").value ? document.getElementById("dataurl").value : "./fixes/data.json";
    const vDebug = document.querySelector("#debug:checked") ? true : false;
    //vDebug = true;
    const vEditable = document.querySelector("#editable:checked") ? true : false;
    const vUseSort = document.querySelector("#sort:checked") ? true : false;
    const newtooltiptemplate = document.getElementById("tooltiptemplate").value ? document.getElementById("tooltiptemplate").value : null;
    let vColumnOrder;
    if (document.querySelector("#vColumnOrder").value) {
      vColumnOrder = document.querySelector("#vColumnOrder").value.split(",");
    }

    const vScrollTo = "today"; // or new Date() or a Date object with a specific date

    // SET LANG FROM INPUT
    lang = e && e.target ? e.target.value : "en";
    delay = document.getElementById("delay").value;

    vUseSingleCell = document.getElementById("useSingleCell").value;
    vShowRes = document.querySelector("#vShowRes:checked") ? 1 : 0;
    vShowCost = document.querySelector("#vShowCost:checked") ? 1 : 0;
    vShowAddEntries = document.querySelector("#vShowAddEntries:checked") ? 1 : 0;
    vShowComp = document.querySelector("#vShowComp:checked") ? 1 : 0;
    vShowDur = document.querySelector("#vShowDur:checked") ? 1 : 0;
    vShowStartDate = document.querySelector("#vShowStartDate:checked") ? 1 : 0;
    vShowEndDate = document.querySelector("#vShowEndDate:checked") ? 1 : 0;
    vShowPlanStartDate = document.querySelector("#vShowPlanStartDate:checked") ? 1 : 0;
    vShowPlanEndDate = document.querySelector("#vShowPlanEndDate:checked") ? 1 : 0;
    vShowTaskInfoLink = document.querySelector("#vShowTaskInfoLink:checked") ? 1 : 0;
    vShowEndWeekDate = document.querySelector("#vShowEndWeekDate:checked") ? 1 : 0;
    vTotalHeight = document.querySelector("#vTotalHeight").value || undefined;

    vShowWeekends = document.querySelector("#vShowWeekends:checked") ? 1 : 0;

    vMinDate = document.querySelector("#vMinDate").value;
    vMaxDate = document.querySelector("#vMaxDate").value;

    vAdditionalHeaders = {
      category: {
        title: "Category",
      },
      sector: {
        title: "Sector",
      },
    };

    g.setOptions({
      vCaptionType: "Complete", // Set to Show Caption : None,Caption,Resource,Duration,Complete,
      vQuarterColWidth: 36,
      vDateTaskDisplayFormat: "day dd month yyyy", // Shown in tool tip box
      // {{token}} syntax (issue #382): text outside {{}} is treated as a literal label.
      // "Week" and "week" stay as-is; only {{ww}}, {{mon}}, {{yyyy}} etc. are substituted.
      vDayMajorDateDisplayFormat: "{{dd}} {{mon}}",                  // combined with vShowEndWeekDate gives "28 Apr - 04 May"
      vWeekMajorDateDisplayFormat: "{{yyyy}}",                       // major heading groups all weeks in a year; show year only
      vWeekMinorDateDisplayFormat: "{{dd}} {{mon}}",                // equivalent to legacy "dd mon" but explicit
      vLang: lang,
      vUseSingleCell, // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
      vShowRes,
      vShowCost,
      vShowAddEntries,
      vShowComp,
      vShowDur,
      vShowStartDate,
      vShowEndDate,
      vShowPlanStartDate,
      vShowPlanEndDate,
      vTotalHeight,
      vMinDate,
      vMaxDate,
      // EVENTs
      vEvents: {
        taskname: console.log,
        res: console.log,
        dur: console.log,
        comp: console.log,
        start: console.log,
        end: console.log,
        planstart: console.log,
        planend: console.log,
        cost: console.log,
        additional_category: console.log,
        beforeDraw: () => console.log("before draw listener"),
        afterDraw: () => {
          console.log("after draw listener");
          if (document.querySelector("#customElements:checked")) {
            drawCustomElements(g);
          }
        },
      },
      vEventsChange: {
        taskname: editValue, // if you need to use the this scope, do: editValue.bind(this)
        res: editValue,
        dur: editValue,
        comp: editValue,
        start: editValue,
        end: editValue,
        planstart: editValue,
        planend: editValue,
        cost: editValue,
      },
      vEventClickRow: console.log,
      vEventClickCollapse: console.log,

      vResources: [
        { id: 0, name: "Anybody" },
        { id: 1, name: "Mario" },
        { id: 2, name: "Henrique" },
        { id: 3, name: "Pedro" },
      ],

      vShowTaskInfoLink, // Show link in tool tip (0/1)
      vShowEndWeekDate, // Show/Hide the date for the last day of the week in header for daily view (1/0)
      vShowWeekends, // Show weekends days in the vFormat day
      vTooltipDelay: delay,
      vTooltipTemplate: document.querySelector("#dynamicTooltip:checked") ? generateTooltip : newtooltiptemplate,
      vDebug,
      vEditable,
      vColumnOrder,
      vScrollTo,
      vUseSort,
      vFormat: "week",
      vFormatArr: ["Day", "Week", "Month", "Quarter"], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
    });
    //DELAY FROM INPUT

    // Teste manual add task
    // g.AddTaskItemObject({
    //   pID: 100,
    //   pName: "Task 1",
    //   pStart: "2018-09-05",
    //   pEnd: "2018-09-11",
    //   pLink: "",
    //   pClass: "gtaskgreen",
    //   pMile: 0,
    //   pComp: 100,
    //   pGroup: 0,
    //   pParent: 0,
    //   pOpen: 1,
    //   pNotes: "",
    //   category: 'test'
    // });

    // Parameters                     (pID, pName,                  pStart,       pEnd,        pStyle,         pLink (unused)  pLink: pMilpMile: e, pRes,       pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt)
    if (dataurl !== newDataurl) {
      dataurl = newDataurl;
      JSGantt.parseJSON(dataurl, g, vDebug).then((j) => (jsonObj = j));
    } else {
      JSGantt.addJSONTask(g, jsonObj);
    }
    /* 
    // Add Custom tasks programatically
    g.AddTaskItem(new JSGantt.TaskItem(1, 'Task Objects', '', '', 'ggroupblack', '', 0, 'Shlomy', 40, 1, 0, '', '', '', '', g));
    g.AddTaskItem(new JSGantt.TaskItem(121, 'Constructor Proc', '2019-08-20', '2020-03-06', 'gtaskblue', '', 0, 'Brian T.', 60, 0, 1, 1, '', '', '', g));
    g.AddTaskItem(new JSGantt.TaskItem(122, 'Task Variables', '2019-08-20', '2020-03-06', 'gtaskred', '', 0, 'Brian', 60, 0, 1, 1, 121, '', '', g));
    g.AddTaskItem(new JSGantt.TaskItem(123, 'Task by Minute/Hour', '2019-08-20', '2020-03-06 12:00', 'gtaskyellow', '', 0, 'Ilan', 60, 0, 1, 1, '', '', '', g));
    g.AddTaskItem(new JSGantt.TaskItem(124, 'Task Functions', '2019-08-20', '2020-03-06', 'gtaskred', '', 0, 'Anyone', 60, 0, 1, 1, '123', 'This is a caption', null, g));
    */

    if (vDebug) {
      bd = new Date();
      console.log("before reloading", bd);
    }
    g.Draw();
    //JSGantt.criticalPath(jsonObj)
    if (vDebug) {
      const ad = new Date();
      console.log("after reloading: total time", ad, ad.getTime() - bd.getTime());
    }
  } else {
    alert("Error, unable to create Gantt Chart");
  }

  // document.getElementById("idMainLeft").onscroll = () => {
  //   scrollingTwoMains('idMainLeft', 'idMainRight');
  // };

  // document.getElementById('idMainRight').onscroll = () => {
  //   scrollingTwoMains('idMainRight', 'idMainLeft');
  // };
}

function scrollingTwoMains(mainMoving, mainMoved) {
  document.getElementById(mainMoved).scrollTop = document.getElementById(mainMoving).scrollTop;
}

function clearTasks() {
  g.ClearTasks();
  g.Draw();
}

function printTasksInConsole() {
  const tasks = g.vTaskList.map((e) => ({ ...e.getAllData(), ...e.getDataObject() }));
  console.log(tasks);
}

function printChart() {
  let width, height;
  [width, height] = document.querySelector("#print_page_size").value.split(",");
  g.printChart(width, height);
}

function editValue(list, task, event, cell, column) {
  console.log(list, task, event, cell, column);
  const found = list.find((item) => item.pID == task.getOriginalID());
  if (!found) {
    return;
  } else {
    found[column] = event ? event.target.value : "";
  }
}

function drawCustomElements(g) {
  for (const item of g.getList()) {
    const dataObj = item.getDataObject();
    if (dataObj && dataObj.deadline) {
      const x = g.chartRowDateToX(new Date(dataObj.deadline));
      const td = item.getChildRow().querySelector("td");
      td.style.position = "relative";
      const div = document.createElement("div");
      div.style.left = `${x}px`;
      div.classList.add("deadline-line");
      td.appendChild(div);
    }
  }
}

/**
 * Load a named bug-scenario JSON file and re-draw the chart.
 *
 * @param {string} name - filename without extension, relative to ./fixes/
 * @param {string} format - chart format to use ('day', 'week', 'month', ...)
 */
function loadBugScenario(name, format) {
  const scenarioUrl = './fixes/' + name + '.json';
  g = new JSGantt.GanttChart(document.getElementById("embedded-Gantt"), format || "week");
  g.setOptions({
    vCaptionType: "Caption",
    vLang: "en",
    vFormat: format || "week",
    vFormatArr: ["Day", "Week", "Month", "Quarter"],
    vShowRes: 0,
    vShowCost: 0,
    vShowComp: 1,
    vShowDur: 0,
    vShowStartDate: 1,
    vShowEndDate: 1,
    vShowPlanStartDate: 1,
    vShowPlanEndDate: 1,
    vShowTaskInfoLink: 1,
    vShowEndWeekDate: 1,
    vEditable: false,
    vWeekMinorDateDisplayFormat: "{{dd}} {{mon}}",
    vDayMajorDateDisplayFormat: "{{dd}} {{mon}}",
    vWeekMajorDateDisplayFormat: "{{yyyy}}",
  });
  JSGantt.parseJSON(scenarioUrl, g).then(() => g.Draw());
}

function generateTooltip(task) {
  // default tooltip for level 1
  if (task.getLevel() === 1) return;

  // string tooltip for level 2. Show completed/total child count and current timestamp
  if (task.getLevel() === 2) {
    let childCount = 0;
    let complete = 0;
    for (const item of g.getList()) {
      if (item.getParent() == task.getID()) {
        if (item.getCompVal() === 100) {
          complete++;
        }
        childCount++;
      }
    }
    console.log(`Generated dynamic sync template for '${task.getName()}'`);
    return `
      <dl>
        <dt>Name:</dt><dd>{{pName}}</dd>
        <dt>Complete child tasks:</dt><dd style="color:${complete === childCount ? "green" : "red"}">${complete}/${childCount}</dd>
        <dt>Tooltip generated at:</dt><dd>${new Date()}</dd>
      </dl>
    `;
  }

  // async tooltip for level 3 and below
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 3000;
    setTimeout(() => {
      console.log(`Generated dynamic async template for '${task.getName()}'`);
      resolve(`Tooltip content from the promise after ${Math.round(delay)}ms`);
    }, delay);
  });
}

// ─── Issue #376 demo ─────────────────────────────────────────────────────────
// Demonstrates GetTaskByOriginalID and RemoveTaskItem with original string IDs.
// Tasks are loaded via parseXMLString so their internal vIDs differ from the
// human-readable IDs in the source XML.

const DEMO_376_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project>
  <task>
    <pID>TASK-1</pID><pName>Alpha (group)</pName>
    <pStart>2026-04-01</pStart><pEnd>2026-04-30</pEnd>
    <pClass>gtaskblue</pClass><pGroup>1</pGroup><pParent>0</pParent><pOpen>1</pOpen>
  </task>
  <task>
    <pID>TASK-2</pID><pName>Beta (child of TASK-1)</pName>
    <pStart>2026-04-01</pStart><pEnd>2026-04-15</pEnd>
    <pClass>gtaskgreen</pClass><pGroup>0</pGroup><pParent>TASK-1</pParent><pOpen>1</pOpen>
  </task>
  <task>
    <pID>TASK-3</pID><pName>Gamma (standalone)</pName>
    <pStart>2026-04-16</pStart><pEnd>2026-04-30</pEnd>
    <pClass>gtaskred</pClass><pGroup>0</pGroup><pParent>0</pParent><pOpen>1</pOpen>
  </task>
</project>`;

function load376Demo() {
  g = new JSGantt.GanttChart(document.getElementById("embedded-Gantt"), "month");
  g.setOptions({
    vCaptionType: "Caption",
    vLang: "en",
    vFormat: "month",
    vFormatArr: ["Week", "Month"],
    vShowRes: 0, vShowCost: 0, vShowComp: 0, vShowDur: 0,
    vShowStartDate: 1, vShowEndDate: 1,
    vEditable: false,
  });
  JSGantt.parseXMLString(DEMO_376_XML, g);
  g.Draw();
  document.getElementById("demo376-controls").style.display = "block";
  document.getElementById("demo376-status").textContent = "Chart loaded with TASK-1, TASK-2, TASK-3";
}

function demo376Search() {
  const id = document.getElementById("demo376-id").value.trim();
  const task = g.GetTaskByOriginalID(id);
  const status = document.getElementById("demo376-status");
  if (task) {
    status.style.color = "#007700";
    status.textContent = 'Found: "' + task.getName() + '" (internal vID: ' + task.getID() + ')';
  } else {
    status.style.color = "#cc0000";
    status.textContent = 'No task with original ID "' + id + '"';
  }
}

function demo376Remove() {
  const id = document.getElementById("demo376-id").value.trim();
  const before = g.vTaskList.filter(t => !t.getToDelete()).length;
  g.RemoveTaskItem(id);
  g.Draw();
  const after = g.vTaskList.filter(t => !t.getToDelete()).length;
  const removed = before - after;
  const status = document.getElementById("demo376-status");
  if (removed > 0) {
    status.style.color = "#007700";
    status.textContent = 'Removed ' + removed + ' task(s) with original ID "' + id + '" (including children)';
  } else {
    status.style.color = "#cc0000";
    status.textContent = 'No task found with original ID "' + id + '"';
  }
}

// ─── Issue #346 demo ─────────────────────────────────────────────────────────
// Demonstrates setTooltipTemplateDelimiter(open, close).
// Django and other frameworks use {{ }} in their own template engines, which
// conflicts with jsGantt's default tooltip template syntax. This demo lets you
// switch between the default {{ }} delimiters and a custom {[ ]} pair.

function load346Demo(mode) {
  const useCustom = mode === 'custom';
  const open  = useCustom ? '{[' : '{{';
  const close = useCustom ? ']}' : '}}';
  const tmpl  = `<div><strong>${open}pName${close}</strong></div>`
              + `<div>Resource: ${open}pRes${close}</div>`
              + `<div>Start: ${open}pStart${close} → End: ${open}pEnd${close}</div>`;

  g = new JSGantt.GanttChart(document.getElementById("embedded-Gantt"), "month");
  g.setOptions({
    vFormat: "month",
    vFormatArr: ["Week", "Month"],
    vShowRes: 1, vShowCost: 0, vShowComp: 0, vShowDur: 0,
    vShowStartDate: 1, vShowEndDate: 1,
    vShowTaskInfoLink: 1,
    vEditable: false,
    vTooltipTemplate: tmpl,
  });
  if (useCustom) g.setTooltipTemplateDelimiter(open, close);

  g.AddTaskItem(new JSGantt.TaskItem(1, "Design",     "2026-04-01", "2026-04-14", "gtaskblue",  "", 0, "Alice",   0, 0, 0, 1, "", "", "", g));
  g.AddTaskItem(new JSGantt.TaskItem(2, "Development","2026-04-07", "2026-04-28", "gtaskgreen", "", 0, "Bob",     0, 0, 0, 1, "1", "", "", g));
  g.AddTaskItem(new JSGantt.TaskItem(3, "QA Review",  "2026-04-21", "2026-04-30", "gtaskyellow","", 0, "Charlie", 0, 0, 0, 1, "2", "", "", g));
  g.Draw();

  document.getElementById("demo346-info").style.display = "block";
  document.getElementById("demo346-template").textContent = tmpl;
  document.getElementById("demo346-delimiters").textContent =
    useCustom ? `open="${open}"  close="${close}"  (custom — Django-safe)` : `open="${open}"  close="${close}"  (default)`;
}

function load68Demo(workingDays) {
  g = new JSGantt.GanttChart(document.getElementById("embedded-Gantt"), "day");
  g.setOptions({
    vFormat: "day",
    vFormatArr: ["Day"],
    vShowDur: 1,
    vShowRes: 0, vShowCost: 0, vShowComp: 0,
    vShowStartDate: 1, vShowEndDate: 1,
    vEditable: false,
  });
  if (workingDays) g.setWorkingDays(workingDays);
  g.AddTaskItem(new JSGantt.TaskItem(1, "Task A (Mon–Mon)", "2025-01-06", "2025-01-13", "gtaskblue", "", 0, "Me", 0, 0, 0, 1, "", "", "", g));
  g.AddTaskItem(new JSGantt.TaskItem(2, "Task B (Mon–Fri)", "2025-01-13", "2025-01-17", "gtaskgreen", "", 0, "Me", 0, 0, 0, 1, "", "", "", g));
  g.Draw();
  var dur = "";
  var cell = document.querySelector("#embedded-Gantt .gduration div");
  if (cell) dur = cell.innerText.trim();
  document.getElementById("demo68-status").textContent = dur || "(draw to see)";
}

start("pt");
