function start(e) {


  var g = new JSGantt.GanttChart(document.getElementById('embedded-Gantt'), 'week');
  if (g.getDivId() != null) {

    // Parameters                     (pID, pName,                  pStart,       pEnd,        pStyle,         pLink (unused)  pLink: pMilpMile: e, pRes,       pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes, pGantt)
    JSGantt.parseJSON('./fixes/data.json', g);

    // SET LANG FROM INPUT
    lang = e && e.target ? e.target.value : 'pt';
    delay = document.getElementById('delay').value;
 
    vUseSingleCell = document.getElementById('useSingleCell').value;
    vShowRes = document.querySelector('#vShowRes:checked') ? 1 : 0;
    vShowCost = document.querySelector('#vShowCost:checked') ? 1 : 0;
    vShowComp = document.querySelector('#vShowComp:checked') ? 1 : 0;
    vShowDur = document.querySelector('#vShowDur:checked') ? 1 : 0;
    vShowStartDate = document.querySelector('#vShowStartDate:checked') ? 1 : 0;
    vShowEndDate = document.querySelector('#vShowEndDate:checked') ? 1 : 0;
    vShowPlanStartDate = document.querySelector('#vShowPlanStartDate:checked') ? 1 : 0;
    vShowPlanEndDate = document.querySelector('#vShowPlanEndDate:checked') ? 1 : 0;
    vShowTaskInfoLink = document.querySelector('#vShowTaskInfoLink:checked') ? 1 : 0;
    vShowEndWeekDate = document.querySelector('#vShowEndWeekDate:checked') ? 1 : 0;

    vAdditionalHeaders = {
      category: {
        title: 'Category'
      },
      sector: {
        title: 'Sector'
      }
    }

    g.setOptions({
      vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,            
      vQuarterColWidth: 36,
      vDateTaskDisplayFormat: 'day dd month yyyy', // Shown in tool tip box
      vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',// Set format to display dates in the "Major" header of the "Day" view
      vWeekMinorDateDisplayFormat: 'dd mon', // Set format to display dates in the "Minor" header of the "Week" view
      vLang: lang,
      vUseSingleCell, // Set the threshold at which we will only use one cell per table row (0 disables).  Helps with rendering performance for large charts.
      vShowRes,
      vShowCost,
      vShowComp,
      vShowDur,
      vShowStartDate,
      vShowEndDate,
      vShowPlanStartDate,
      vShowPlanStartDate,
      vAdditionalHeaders,
      vEvents: {
        taskname: console.log,
        res: console.log,
        dur: console.log,
        comp: console.log,
        startdate: console.log,
        enddate: console.log,
        planstartdate: console.log,
        planenddate: console.log,
        cost: console.log
      },
      vEventClickRow: console.log,
      vShowTaskInfoLink, // Show link in tool tip (0/1)
      vShowEndWeekDate,  // Show/Hide the date for the last day of the week in header for daily view (1/0)
      vTooltipDelay: delay,
      vFormatArr: ['Day', 'Week', 'Month', 'Quarter'], // Even with setUseSingleCell using Hour format on such a large chart can cause issues in some browsers
    });
    //DELAY FROM INPUT


    g.Draw();

  } else {
    alert("Error, unable to create Gantt Chart");
  }
}

start('pt')