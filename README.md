[![Build Status](https://travis-ci.org/mariohmol/jsgantt-improved.svg?branch=master)](https://travis-ci.org/mariohmol/jsgantt-improved)


A fully featured gantt chart component built entirely in Javascript, CSS and AJAX. It is lightweight and there is no need of external libraries or additional images. 


![Demo Image](/demo/demo.png)


Start using with including the files `jsgantt.js` and `jsgantt.css` that are inside `demo/` folder.

Or install and use in JS 

`npm install jsgantt-improved`

Import in your JS `import {JSGantt} from 'jsgantt-improved';`

For **Angular** use the component [ng-gantt](https://github.com/mariohmol/ng-gantt) 




## Example

You can view a live example at 

https://mariohmol.github.io/jsgantt-improved/demo


## Easy to Use

```html
<link href="jsgantt.css" rel="stylesheet" type="text/css"/>
<script src="jsgantt.js" type="text/javascript"></script>

<div style="position:relative" class="gantt" id="GanttChartDIV"></div>

<script>

var g = new JSGantt.GanttChart(document.getElementById('GanttChartDIV'), 'day');

g.setOptions({
  vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,     
  vQuarterColWidth: 36,
  vDateTaskDisplayFormat: 'day dd month yyyy', // Shown in tool tip box
  vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',// Set format to dates in the "Major" header of the "Day" view
  vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
  vLang: 'en',
  vShowTaskInfoLink: 1, // Show link in tool tip (0/1)
  vShowEndWeekDate: 0,  // Show/Hide the date for the last day of the week in header for daily
  vUseSingleCell: 10000, // Set the threshold cell per table row (Helps performance for large data.
  vFormatArr: ['Day', 'Week', 'Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
});

// Load from a Json url
JSGantt.parseJSON('./fixes/data.json', g);

// Or Adding  Manually
g.AddTaskItemObject({
  "pID": 1,
  "pName": "Define Chart API",
  "pStart": "2017-02-25",
  "pEnd": "2017-03-17",
  "pPlanStart": "2017-04-01",
  "pPlanEnd": "2017-04-15 12:00",
  "pClass": "ggroupblack",
  "pLink": "",
  "pMile": 0,
  "pRes": "Brian",
  "pComp": 0,
  "pGroup": 1,
  "pParent": 0,
  "pOpen": 1,
  "pDepend": "",
  "pCaption": "",
  "pCost": 1000,
  "pNotes": "Some Notes text"
});

g.Draw();

</script>
```

## Features

  * Tasks & Collapsible Task Groups
  * Dependencies
  * Task Completion
  * Task Styling
  * Milestones
  * Resources
  * Costs
  * Plan Start and End Dates
  * Gantt with Planned vs Executed
  * Dynamic Loading of Tasks
  * Dynamic change of format: Hour, Day, Week, Month, Quarter
  * Load Gantt from XML and JSON
    * From external files (including experimental support for MS Project XML files)
    * From JavaScript Strings
  * Support for Internationalization 

## Documentation

See the [Documentation](./Documentation.md) wiki page or the included ``demo/index.html`` file for instructions on use.

Project based on https://code.google.com/p/jsgantt/.


## Want to Collaborate?

Clone this repo and run `npm run demo-full`, this will start a `localhost:8080` with a live  example. 
Do your change in `src` and restart this command to test.

For testing use `npm run test` with e2e tests.
