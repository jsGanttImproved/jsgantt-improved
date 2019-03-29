
# Usage #

Creating a basic Gantt Chart

## Include JSGantt CSS and Javascript ##
```html
<link href="jsgantt.css" rel="stylesheet" type="text/css"/>
<script src="jsgantt.js" type="text/javascript"></script>
```

## Create a div element to hold the gantt chart ##
```html
<div style="position:relative" class="gantt" id="GanttChartDIV"></div>
```

## Start a `<script>` block ##
```html
<script type="text/javascript">
```

## Instantiate JSGantt using GanttChart() ##
```javascript
var g = new JSGantt.GanttChart(document.getElementById('GanttChartDIV'), 'day');
```

Method definition: **GanttChart(_pDiv_, _pFormat_)**

| Parameter | Description |
|:--------|:------------------------------------------------|
| _pDiv:_ | (required) this is a DIV object created in HTML |
| _pFormat:_ | (required) used to indicate whether chart should be drawn in "hour", "day", "week", "month", or "quarter" format |

## Customize the look and feel using configuration methods ##
see [Configuration Options](#user-content-options) below

## <a href="user-content-a-using-addtaskitem"></a> Add Tasks ##

### a) Using Method() ###

```javascript

// passing object
g.AddTaskItemObject({
  pID: 1,
  pName: "Define Chart <strong>API</strong>",
  pStart: "2017-02-25",
  pEnd: "2017-03-17",
  pPlanStart: "2017-04-01",
  pPlanEnd: "2017-04-15 12:00",
  pClass: "ggroupblack",
  pLink: "",
  pMile: 0,
  pRes: "Brian",
  pComp: 0,
  pGroup: 1,
  pParent: 0,
  pOpen: 1,
  pDepend: "",
  pCaption: "",
  pCost: 1000,
  pNotes: "Some Notes text",
  category: "My Category",
  sector: "Finance"
});

// or passing parameters
g.AddTaskItem(new JSGantt.TaskItem(1, 'Define Chart API','',          '',          'ggroupblack','', 0, 'Brian', 0,  1,0,1,'','','Some Notes text',g));
```


Method definition:
**TaskItem(_pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt_)**

| Parameter | Description |
|:--------|:------------------------------------------------|
|_pID:_|(required) a unique numeric ID used to identify each row|
|_pName:_|(required) the task Label                               |
|_pStart:_|(required) the task start date, can enter empty date ('') for groups. You can also enter specific time (e.g. 2013-02-20 09:00) for additional precision or half days|
|_pEnd:_|(required) the task end date, can enter empty date ('') for groups|
|_pPlanStart:_|(required) the planed task start date, can enter empty date ('') for groups. You can also enter specific time (e.g. 2013-02-20 09:00) for additional precision or half days|
|_pPlanEnd:_|(required) the task end date planned, can enter empty date ('') for groups|
|_pClass:_|(required) the css class for this task                  |
|_pLink:_|(optional) any http link to be displayed in tool tip as the "More information" link.|
|_pMile:_|(optional) indicates whether this is a milestone task - Numeric; 1 = milestone, 0 = not milestone|
|_pRes:_|(optional) resource name                                |
|_pComp:_|(required) completion percent, numeric                  |
|_pGroup:_|(optional) indicates whether this is a group task (parent) - Numeric; 0 = normal task, 1 = standard group task, 2 = combined group task<sup>*</sup>|
|_pParent:_|(required) identifies a parent pID, this causes this task to be a child of identified task. Numeric, top level tasks should have pParent set to 0|
|_pOpen:_|(required) indicates whether a standard group task is open when chart is first drawn. Value must be set for all items but is only used by standard group tasks.  Numeric, 1 = open, 0 = closed|
|_pDepend:_|(optional) comma separated list of id's this task is dependent on. A line will be drawn from each listed task to this item. Each id can optionally be followed by a dependency type suffix. Valid values are: 'FS' - Finish to Start (default if suffix is omitted), 'SF' - Start to Finish, 'SS' - Start to Start, 'FF' - Finish to Finish. If present the suffix must be added directly to the id e.g. '123SS'|
|_pCaption:_|(optional) caption that will be added after task bar if CaptionType set to "Caption"|
|_pNotes:_|(optional) Detailed task information that will be displayed in tool tip for this task|
|_pGantt:_|(required) javascript JSGantt.GanttChart object from which to take settings.  Defaults to "g" for backwards compatibility|
|_pCost:_| cost of that task, numeric        

<sup>*</sup> Combined group tasks show all sub-tasks on one row. The information displayed in the task list and row caption are taken from the parent task.  Tool tips are generated individually for each sub-task from its own information.  Milestones are not valid as sub-tasks of a combined group task and will not be displayed. No bounds checking of start and end dates of sub-tasks is performed therefore it is possible for these task bars to overlap. Dependencies can be set to and from sub-tasks only.



### b) using parseJSON() with an external JSON file or API ###
```javascript
JSGantt.parseJSON('./fixes/data.json', g);
```


The structure of the JSON file:
```json
{
  "pID": 1,
  "pName": "Define Chart API",
  "pStart": "",
  "pEnd": "",
  "pPlanStart": "",
  "pPlanEnd": "",
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
  "pCost":  "",
  "pNotes": "Some Notes text",
  "category": "My Category",
  "sector": "Finance"
}
```


### <a name="user-content-b-using-parsexml-with-an-external-xml-file"> </a> c) using parseXML() with an external XML file ###
```javascript
JSGantt.parseXML("project.xml",g);
```

Method definition:
**JSGantt.parseXML(_pFile_, _pGanttObj_)**

| Parameter | Description |
|:--------|:------------------------------------------------|
|_pFile:_|(required) this is the filename of the XML|
|_pGanttObj:_|(required) a GanttChart object returned by a call to JSGantt.GanttChart()|

The structure of the native XML file:
```xml
<project>
<task>
	<pID>25</pID>
	<pName>WCF Changes</pName>
	<pStart></pStart>
	<pEnd></pEnd>
  <pPlanStart></pPlanStart>
	<pPlanEnd></PlanEnd>
	<pClass>gtaskred</pClass>
	<pLink></pLink>
	<pMile>0</pMile>
	<pRes></pRes>
	<pComp>0</pComp>
	<pGroup>1</pGroup>
	<pParent>2</pParent>
	<pOpen>1</pOpen>
  <pCost></pCost>
	<pDepend>2,24</pDepend>
	<pCaption>A caption</pCaption>
	<pNotes>Text - can include limited HTML</pNotes>
</task>
</project>
```

Field definitions are as described for the parameters to [TaskItem](#user-content-a-using-addtaskitem) above. The pClass element is optional in XML files and will default to "ggroupblack" for group tasks, "gtaskblue" for normal tasks and "gmilestone" for milestones.  The pGantt element is not required for XML import.

JSGannt Improved will also test the provided XML file to see if it appears to be in Microsoft Project XML format. If so an attempt will be made to load up the project. This feature is experimental, the import is best effort and not guaranteed. Once loaded the project as interpreted by JSGantt Improved can be extracted using the [XML Export methods](#user-content-xml-export) provided.


### c) using parseXMLString() with XML held in a javascript string object ###
```javascript
JSGantt.parseXMLString("<project><task>...</task></project>",g);
```

Method definition:
**JSGantt.parseXML(_pStr_, _pGanttObj_)**

| Parameter | Description |
|:--------|:------------------------------------------------|
|_pStr:_|(required) this is a javascript String containing XML|
|_pGanttObj:_|(required) a GanttChart object returned by a call to JSGantt.GanttChart()|


The XML provided will be parsed in exactly the same way as the contents of an external XML file and hence must match the format as described for [parseXML](#user-content-b-using-parsexml-with-an-external-xml-file) above


### <a name="user-content-xml-export"></a> XML Export ###

The following methods can be used to extract details of tasks in the project in XML format

Method definition: **getXMLProject()**

Returns a string containing the entire project in JSGantt Improved XML format.  Dates will be exported in the currently defined input format as set by setDateInputFormat().

Method definition: **getXMLTask(_pID_, _pIdx_)**

| Parameter | Description |
|:--------|:------------------------------------------------|
| _pID:_ | (required) the numeric ID that identifies the task to extract |
| _pIdx:_ | (optional) Boolean - if present and set to "true" the number passed in the pID parameter is treated as an array index for the task list rather than an ID |

Returns a string containing the specified task item in JSGantt Improved XML format.  Dates will be exported in the currently defined input format as set by setDateInputFormat().


## Call Draw() ##
```javascript
g.Draw();
```

## Updating an existing Gantt Chart ##

It is also possible to delete tasks using RemoveTaskItem() method.
```javascript
g.RemoveTaskItem(11);
```

Method definition:
**RemoveTaskItem(_pID_)**

| Parameter | Description |
|:--------|:------------------------------------------------|
|_pID:_|(required) the unique numeric ID of the item to be removed|

If the task removed is a group item, all child tasks will also be removed.

After adding or removing tasks a call to "g.Draw()" must be made to redraw the chart.

# Options #

You can set Options as an object, following the example:

```javascript

g.setOptions({
  vCaptionType: 'Complete',       
  vQuarterColWidth: 36
});

```

## Switches ##
Many of the features of jsGanttImproved can be customised through the use of setter methods available on the GanttChart object returned by a call to JSGantt.GanttChart()
The following options take a single numeric parameter; a value of 1 will enable the describe functionality, 0 will disable it

| Method | Description |
|:--------|:------------------------------------------------|
|_setUseToolTip():_|Controls the display of tool tip boxes, defaults to 1 (enabled)|
|_setUseFade():_   |Controls use of the fade effect when showing/hiding tool tips, defaults to 1 (enabled)|
|_setUseMove():_   |Controls use of the sliding effect when changing between different task tool tips, defaults to 1 (enabled)|
|_setUseRowHlt():_ |Controls the use of row mouseover highlighting, defaults to 1 (enabled)|
|_setUseSort():_   |Controls whether the task list is sorted into parent task / start time order or is simply displayed in the order created, defaults to 1 (sort enabled)|
|_setShowRes():_   |Controls whether the Resource column is displayed in the task list, defaults to 1 (show column)|
|_setShowDur():_   |Controls whether the Task Duration column is displayed in the task list, defaults to 1 (show column)|
|_setShowComp():_  |Controls whether the Percentage Complete column is displayed in the task list, defaults to 1 (show column)|
|_setShowStartDate():_|Controls whether the Task Start Date column is displayed in the task list, defaults to 1 (show column)|
|_setShowEndDate():_|Controls whether the Task End Date column is displayed in the task list, defaults to 1 (show column)|
|_setShowPlanStartDate():_|Controls whether the Plan Task Start Date column is displayed in the task list, defaults to 1 (show column)|
|_setShowPlanEndDate():_|Controls whether the Task Plan End Date column is displayed in the task list, defaults to 1 (show column)|
|_setShowCost():_|Controls whether the Cost column is displayed in the task list, defaults to 1 (show column)|
|_setAdditionalHeaders():_|Set the object with additional headers to be displayed in the data table. ex : { category: { title: 'Category' } }|
|_setShowTaskInfoRes():_|Controls whether the Resource information is displayed in the task tool tip, defaults to 1 (show information)|
|_setShowTaskInfoDur():_|Controls whether the Task Duration information is displayed in the task tool tip, defaults to 1 (show information)|
|_setShowTaskInfoComp():_|Controls whether the Percentage Complete information is displayed in the task tool tip, defaults to 1 (show information)|
|_setShowTaskInfoStartDate():_|Controls whether the Task Start Date information is displayed in the task tool tip, defaults to 1 (show information)|
|_setShowTaskInfoEndDate():_|Controls whether the Task End Date information is displayed in the task tool tip, defaults to 1 (show information)|
|_setShowTaskInfoLink():_|Controls whether the More Information link is displayed in the task tool tip, defaults to 0 (do NOT show link)|
|_setShowTaskInfoNotes():_|Controls whether the Additional Notes data is displayed in the task tool tip, defaults to 1 (show notes)|
|_setShowEndWeekDate():_|Controls whether the major heading in "Day" view displays the week end-date in the appropriate format (see [below](#user-content-display-date-formats)), defaults to 1 (show date)|
|_setShowDeps():_  |Controls display of dependancy lines, defaults to 1 (show dependencies)|
|_setEvents():_  |Controls events when a task is click in table data. You have to pass an object with the column and function. ex.: ` { taskname: console.log, res: console.log }`|
|_setEventClickRow():_  |Controls events when a task row is cliked. Pass a function to execute ex.: `function(e){console.log(e)}`|
|_setEventsChange():_  |Controls events when a task row is cliked. Pass a function to execute ex.: `{ taskname: function(task, event, cell, column){ console.log(task, event, cell, column); } }`|
|_setAdditionalHeaders:_ |Set object with headers values for additional columns . ex : `{ category: { title: 'Category' }` }|
|_setResources():_  |Set the list of possible resources, must be an array of objects, ex: `[{ id: 1, name: 'Mario' } , { id: 2, name: 'Henrique' }]`| 
|_setEditable():_  |Set with true if you want to edit values in the data table, will show inputs instead of texts| 
|_setDebug():_  |Set with true if you want to see debug in console| 


## Key Values ##
The following options enable functionality using a set of specific key values

| Method | Description |
|:--------|:------------------------------------------------|
|_setShowSelector():_|Controls where the format selector is displayed, accepts multiple parameters. Valid parameter values are "Top", "Bottom". Defaults to "Top".|
|_setFormatArr():_   |Controls which format options are shown in the format selector, accepts multiple parameters. Valid parameter values are "Hour", "Day", "Week", "Month", "Quarter". Defaults to all valid values.|
|_setCaptionType():_ |Controls which task field to use as a caption on the Gantt Chart task bar, accepts a single parameter. Valid parameter values are "None", "Caption", "Resource", "Duration", "Complete". Defaults to "None"|
|_setDateInputFormat():_|Defines the input format used for dates in task creation, accepts a single parameter. Valid parameter values are "yyyy-mm-dd", "dd/mm/yyyy", "mm/dd/yyyy". Defaults to "yyyy-mm-dd"|
|_setScrollTo():_    |Sets the date the Gantt Chart will be scrolled to, specified in the date input format set by setDateInputFormat() above. Also accepts the special value "today". Defaults to minimum display date|
|_setUseSingleCell():_|Sets the threshold total number of cells at which the task list will use a single table cell for each row rather than one cell per period.  Useful to improve performance on large charts.  Numeric, a value of 0 disables this functionality (always use multiple cells), defaults to 25000|
|_setLang():_        |Sets translation to use when drawing the chart.  Defaults to "en" as this is the only language provided in the base installation (see [Internationalisation](#user-content-internationalisation) below for details on how to add more translations.)|

## Layout ##
Most of the look and feel of the Gantt Chart can be controlled using CSS however, as the length of a task bar is determined by column width, the following methods take a single numeric parameter that defines the appropriate column width in pixels.
Note that the task bar sizing code assumes the use of collapsed table borders 1px wide.

| Method | Description |
|:--------|:------------------------------------------------|
|_setHourColWidth():_|Width of Gantt Chart columns in pixels when drawn in "Hour" format. Defaults to 18.|
|_setDayColWidth():_ |Width of Gantt Chart columns in pixels when drawn in "Day" format. Defaults to 18. |
|_setWeekColWidth():_|Width of Gantt Chart columns in pixels when drawn in "Week" format. Defaults to 36.|
|_setMonthColWidth():_|Width of Gantt Chart columns in pixels when drawn in "Month" format. Defaults to 36.|
|_setQuarterColWidth():_|Width of Gantt Chart columns in pixels when drawn in "Quarter" format, although not mandatory it is recommended that this be set to a value divisible by 3. Defaults to 18.|
|_setRowHeight():_|Height of Gantt Chart rows in pixels. Used to route dependency lines near end points. Defaults to 20.|
|_setMinGpLen():_    |Group tasks have their task bars embellished with end points, this value specifies the width of one of these end points in pixels.  A short task bar's length will be rounded up to display either a single or both endpoints correctly. Defaults to 8.|

## <a name="user-content-display-date-formats"></a> Display Date Formats ##
Date display formats can be individually controlled. The methods used to set these display formats each take a single format string parameter.  The format string can be made up of the following components (case sensitive)

| Component | Description |
|:--------|:------------------------------------------------|
|_h_|Hour (1-12)|
|_hh_|Hour (01-12)|
|_pm_|am/pm indicator|
|_PM_|AM/PM indicator|
|_H_|Hour (0-23)|
|_HH_|Hour (01-23)|
|_mi_|Minutes (1-59)|
|_MI_|Minutes (01-59)|
|_d_|Day (1-31) |
|_dd_|Day (01-31)|
|_day_|Abbriviated day of week|
|_DAY_|Day of week|
|_m_|Month (1-12)|
|_mm_|Month (01-12)|
|_mon_|Abbriviated month text|
|_month_|Full month text|
|_yy_|Year, excluding century|
|_yyyy_|Year       |
|_q_|Quarter (1-4)|
|_qq_|Quarter (Q1-Q4)|
|_w_|ISO Week number (1-53)|
|_ww_|ISO Week number (01-53)|
|_week_|Full ISO Week date format|

separated by one of the following characters: **"/\-.,'`<space`>:**

Any text between separators that does not match one of the components above will be checked using a case insensitive match for a valid internationalised string (see [Internationalisation](#user-content-internationalisation) below).  If the value is still not found the text will be output unchanged.

The available date display methods are

| Method | Description |
|:--------|:------------------------------------------------|
|_setDateTaskTableDisplayFormat():_|Date format used for start and end dates in the main task list. Defaults to 'dd/mm/yyyy'.|
|_setDateTaskDisplayFormat():_     |Date format used for start and end dates in task tool tips. Defaults to 'dd month yyyy'. |
|_setHourMajorDateDisplayFormat()_ |Date format used for Gantt Chart major date headings displayed in "Hour" format. Defaults to 'day dd month yyyy'.|
|_setDayMajorDateDisplayFormat():_ |Date format used for Gantt Chart major date headings displayed in "Day" format. Defaults to 'dd/mm/yyyy'.|
|_setWeekMajorDateDisplayFormat():_|Date format used for Gantt Chart major date headings displayed in "Week" format. Defaults to 'yyyy'.|
|_setMonthMajorDateDisplayFormat():_|Date format used for Gantt Chart major date headings displayed in "Month" format. Defaults to 'yyyy'.|
|_setQuarterMajorDateDisplayFormat():_|Date format used for Gantt Chart major date headings displayed in "Year" format. Defaults to 'yyyy'.|
|_setHourMinorDateDisplayFormat()_ |Date format used for Gantt Chart minor date headings displayed in "Hour" format. Defaults to 'HH'.|
|_setDayMinorDateDisplayFormat():_ |Date format used for Gantt Chart minor date headings displayed in "Day" format. Defaults to 'dd'.|
|_setWeekMinorDateDisplayFormat():_|Date format used for Gantt Chart minor date headings displayed in "Week" format. Defaults to 'dd/mm'.|
|_setMonthMinorDateDisplayFormat():_|Date format used for Gantt Chart minor date headings displayed in "Month" format. Defaults to 'mon'.|
|_setQuarterMinorDateDisplayFormat():_|Date format used for Gantt Chart minor date headings displayed in "Year" format. Defaults to 'qq'.|

## <a name="user-content-internationalisation"></a> Internationalisation ##
jsGanttImproved only provides English text however all hard coded strings can be replaced by calling the addLang() method available on the GanttChart object returned by a call to JSGantt.GanttChart()

The addLang() method takes two parameters.  The first is a string identifier for the language, the second is a javascript object containing all the replacement text pairs, the default English settings are:

| Key Value     | Display Text     | Key Value     | Display Text     | Key Value     | Display Text     |
|:--------------|:-----------------|:--------------|:-----------------|:--------------|:-----------------|
|_january_      |January           |_sunday_       |Sunday            |_format_       |Format            |
|_february_     |February          |_monday_       |Monday            |_hour_         |Hour              |
|_march_        |March             |_tuesday_      |Tuesday           |_day_          |Day               |
|_april_        |April             |_wednesday_    |Wednesday         |_week_         |Week              |
|_maylong_      |May               |_thursday_     |Thursday          |_month_        |Month             |
|_june_         |June              |_friday_       |Friday            |_quarter_      |Quarter           |
|_july_         |July              |_saturday_     |Saturday          |_hours_        |Hours             |
|_august_       |August            |_sun_          |Sun               |_days_         |Days              |
|_september_    |September         |_mon_          |Mon               |_weeks_        |Weeks             |
|_october_      |October           |_tue_          |Tue               |_months_       |Months            |
|_november_     |November          |_wed_          |Wed               |_quarters_     |Quarters          |
|_december_     |December          |_thu_          |Thu               |_hr_           |Hr                |
|_jan_          |Jan               |_fri_          |Fri               |_dy_           |Day               |
|_feb_          |Feb               |_sat_          |Sat               |_wk_           |Wk                |
|_mar_          |Mar               |_resource_     |Resource          |_mth_          |Mth               |
|_apr_          |Apr               |_duration_     |Duration          |_qtr_          |Qtr               |
|_may_          |May               |_comp_         |%Comp.            |_hrs_          |Hrs               |
|_jun_          |Jun               |_completion_   |Completion        |_dys_          |Days              |
|_jul_          |Jul               |_startdate_    |Start Date        |_wks_          |Wks               |
|_aug_          |Aug               |_enddate_      |End Date          |_mths_         |Mths              |
|_sep_          |Sep               |_moreinfo_     |More Information  |_qtrs_         |Qtrs              |
|_oct_          |Oct               |_notes_        |Notes             |               |                  |
|_nov_          |Nov               |               |                  |               |                  |
|_dec_          |Dec               |               |                  |               |                  |


When adding a language any translations that are not provided will use the default English language value.  This provides a simple way to override default strings e.g.
```javascript
g.addLang('en2', {'format':'Select', 'comp':'Complete'});
```
would create a language called 'en2' where the text in the format selector was "Select" rather than "Format" and the header for the Percentage Complete column in the task list is "Complete" rather than "% Comp."

Once a translation has been added a call must be made to setLang() with the appropriate language identifier before calling Draw().

## Example Options ##

The configuration options used in the example index file provided are:

```javascript

g.setOptions({
  vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,     
  vQuarterColWidth: 36,
  vDateTaskDisplayFormat: 'day dd month yyyy', // Shown in tool tip box
  vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',// Set format to display dates in the "Major" header of the "Day" view
  vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
  vLang: lang,
  vShowTaskInfoLink: 1, // Show link in tool tip (0/1)
  vShowEndWeekDate: 0,  // Show/Hide the date for the last day of the week in header for daily view (1/0)
  vUseSingleCell: 10000, // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
  vFormatArr: ['Day', 'Week', 'Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
});

```


Putting all this information together the final code to produce the chart included in the example index file provided is as follows:

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
  vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',// Set format to display dates in the "Major" header of the "Day" view
  vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
  vLang: lang,
  vAdditionalHeaders: { // Add data columns to your table
    category: {
      title: 'Category'
    },
    sector: {
      title: 'Sector'
    }
  },
  vShowTaskInfoLink: 1, // Show link in tool tip (0/1)
  vShowEndWeekDate: 0,  // Show/Hide the date for the last day of the week in header for daily view (1/0)
  vUseSingleCell: 10000, // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
  vFormatArr: ['Day', 'Week', 'Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
  vEvents: {
        taskname: console.log,
        res: console.log,
        dur: console.log,
        comp: console.log,
        start: console.log,
        end: console.log,
        planstart: console.log,
        planend: console.log,
        cost: console.log
      },
  vEventClickRow: console.log
});

// Load from a Json url
JSGantt.parseJSON('./fixes/data.json', g);

// Or Adding  Manually
g.AddTaskItemObject({
  pID: 1,
  pName: "Define Chart <strong>API</strong>",
  pStart: "2017-02-25",
  pEnd: "2017-03-17",
  pPlanStart: "2017-04-01",
  pPlanEnd: "2017-04-15 12:00",
  pClass: "ggroupblack",
  pLink: "",
  pMile: 0,
  pRes: "Brian",
  pComp: 0,
  pGroup: 1,
  pParent: 0,
  pOpen: 1,
  pDepend: "",
  pCaption: "",
  pCost: 1000,
  pNotes: "Some Notes text",
  category: "My Category",
  sector: "Finance"
});

g.Draw();

</script>
```


## Troubleshooting

* My grid has a few/lot of columns and i want to resize the space for the chart and data

You can change the CSS and choose the size: 

```css
.gmainright{
	width: 75%;
}
.gmainleft{
	width: 25%;
}
```

Reference: https://github.com/jsGanttImproved/jsgantt-improved/issues/157
