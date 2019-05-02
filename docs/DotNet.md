## Page_Load method in Code behind of the asp .NET page
 
 ```C#  
protected void Page_Load(object sender, EventArgs e)
 {
            projects = sqlManager.ExecutePortfolioView();

            HiddenField.Value = JsonConvert.SerializeObject(projects);
}
```


## Asp page:

```html
<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Gantt.aspx.cs" Inherits="Links2.WebUI.Gannt" %>

<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">
    
    



    <link href="assets/css/jsgantt.css" rel="stylesheet" type="text/css"/>
    <script src="Scripts/jsgantt.js" type="text/javascript"></script>
    <script src="https://code.jquery.com/jquery-git.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js"></script>

    <style>
        .box {
          display: inline-block;
          height: 20px;
          width: 20px;
          border: 2px solid;
        }
        .chartlegend 
        {
            border:1px solid none;
            text-align:right;
            margin-bottom: 30px;            
        }

        .chartlegenditem
        {
            float: right;
            margin-right: 1%;
            filter: alpha(opacity=90);
            opacity: 0.9;
            margin-top: 1px;
        }

        .body-content {
        width: 1800px !important;
    }

    </style>

   
    <%--<input type="button" id="click" value="Export to PDF"/>--%>

    <div class="chartlegend" id="ChartLegendDIV" style="width:1800;"></div>
    <div style="position:relative" class="gantt" id="GanttChartDIV"></div>
    <asp:HiddenField ID="HiddenField" runat="server" />
        <script type="text/javascript">

            var colourList = {
                L1:
                {
                    Title: 'Executing',
                    Colour: '#50C13A'
                },
                L2:
                {
                    Title: 'At Risk',
                    Colour: '#F7E438'
                },
                L3:
                {
                    Title: 'To Do',
                    Colour: '#A9A9A9'
                },
                L4:
                {
                    Title: 'On Hold',
                    Colour: '#2F4F4F'
                },
                L5:
                {
                    Title: 'Planning',
                    Colour: '#3A84C3'
                },
                L6:
                {
                    Title: 'Late',
                    Colour: '#C43A3A'
                },
                L7:
                {
                    Title: 'Initiating',
                    Colour: '#F0F8FF'
                },
                L8:
                {
                    Title: 'Complete',
                    Colour: '#000000'
                }
            };

            colorize = function (colorList)
            {
                    var container = document.getElementById('ChartLegendDIV');
  
                for (var key in colorList) {

                        var details = colorList[key];

                        var boxContainer = document.createElement("DIV");
                        boxContainer.className = 'chartlegenditem';                                               
                        var box = document.createElement("DIV");
                        var label = document.createElement("SPAN");

                        label.innerHTML = details['Title'];
                        box.className = "box";
                        box.style.backgroundColor = details['Colour'];

                        boxContainer.appendChild(box);
                        boxContainer.appendChild(label);

                        container.appendChild(boxContainer);

                   }
            }

            colorize(colourList);

            var g = new JSGantt.GanttChart(document.getElementById('GanttChartDIV'), 'month');

            var list = document.getElementById('<%= HiddenField.ClientID %>').value;

            var result = JSON.parse(list);
               
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



            g.setOptions({
                vCaptionType: 'Complete',  // Set to Show Caption : None,Caption,Resource,Duration,Complete,     
                vQuarterColWidth: 46, 
                vAdditionalHeaders: { // Add data columns to your table
                        ID:
                        {
                            title: 'ID'
                        },
                        PM:
                        {
                            title: 'PM'
                        },
                        Sponsor:
                        {
                            title: 'Sponsor'
                        }                    
                    },
               
                vDayMajorDateDisplayFormat: 'mon yyyy - Week ww',
            });

            //g.AddTaskItemObject({
            //  pID: 1,
            //  pName: "Define Chart <strong>API</strong>",
            //  pStart: "2017-02-25",
            //  pEnd: "2017-03-17",
            //  pPlanStart: "2017-04-01",
            //  pPlanEnd: "2017-04-15 12:00",
            //  pClass: "ggroupblack",
            //  pLink: "",
            //  pMile: 0,
            //  pRes: "Brian",
            //  pComp: 0,
            //  pGroup: 1,
            //  pParent: 0,
            //  pOpen: 1,
            //  pDepend: "",
            //  pCaption: "",
            //  pCost: 1000,
            //  pNotes: "Some Notes text",
            //  category: "My Category",
            //  sector: "Finance"
            //});

            // or passing parameters

            g.setShowRes(0);
            g.setShowStartDate(0);
            g.setShowEndDate(0);
            g.setShowComp(0);
            g.setShowDur(0);
            g.setScrollTo("today");
            g.setFormatArr('Month', 'Quarter');
            g.setTooltipDelay(200);

            g.AddTaskItem(new JSGantt.TaskItem(1, 'Core', '', '', 'ggroupblack', '', 0, 'Padraic', 0, 1, 0, 1, '', '', '', 'Padraic', g));
            g.AddTaskItem(new JSGantt.TaskItem(2, 'SHP', '', '', 'ggroupblack', '', 0, 'Padraic', 0, 1, 0, 1, '', '', '', 'Padraic', g));
            //g.AddTaskItem(new JSGantt.TaskItem(3, 'Undefined', '', '', 'ggroupblack', '', 0, 'Padraic', 0, 1, 0, 1, '', '', '', 'Padraic', g));
            g.AddTaskItem(new JSGantt.TaskItem(4, 'DES', '', '', 'ggroupblack', '', 0, 'Padraic', 0, 1, 1, 1, '', '', '', 'Padraic', g));
            g.AddTaskItem(new JSGantt.TaskItem(5, 'SES', '', '', 'ggroupblack', '', 0, 'Padraic', 0, 1, 1, 1, '', '', '', 'Padraic', g));
            g.AddTaskItem(new JSGantt.TaskItem(6, 'SDC', '', '', 'ggroupblack', '', 0, 'Padraic', 0, 1, 1, 1, '', '', '', 'Padraic', g));
            g.AddTaskItem(new JSGantt.TaskItem(7, 'PCT', '', '', 'ggroupblack', '', 0, 'Padraic', 0, 1, 1, 1, '', '', '', 'Padraic', g));
            g.AddTaskItem(new JSGantt.TaskItem(8, 'PTA', '', '', 'ggroupblack', '', 0, 'Padraic',   0, 1, 1, 1, '', '', '', 'Padraic', g));


            var IsFirstIteration = true;
            var IsUndefinedTypePresent = false;

            for (var i = 0; i < result.length; i++)
            {
                var statusColour = 'gtaskblack';

                var row = result[i];
                var name = row["Name"];
                var id = row["ID"];
                var start = row["Start"].split('T')[0];
                var finish = row["Finish"].split('T')[0];
                var percentageComplete = row["PercentageComplete"];
                var status = row["Status"];
                var cValue = row["CValue"];
                var pm = row["ProjectManager"];
                var sponsor = row["Sponsor"];
                var valuestream = row["ValueStream"];
                var comments = row["Comments"];

                // Set the parent as undefined by default.
                var parent = 3;

                if (row["SubParent"] != 9) {
                    parent = row["SubParent"];
                }
                else
                {
                    parent = row["Parent"];
                } 

                if (IsFirstIteration)
                {
                    parent = 3;
                    IsFirstIteration = false;
                }

                if (parent == 3 && !IsUndefinedTypePresent)
                {
                    g.AddTaskItem(new JSGantt.TaskItem(3, 'Undefined', '', '', 'ggroupblack', '', 0, 'Padraic', 0, 1, 0, 1, '', '', '', 'Padraic', g));
                    IsUndefinedTypePresent = true;
                }

                //if (percentageComplete == 0)
                //{
                //    percentageComplete = 0.001;
                //}

                switch (cValue) {
                    // Executing
                    case 333:
                        statusColour = 'gtaskgreen';
                        break;
                    // At Risk
                    case 334:
                        statusColour = 'gtaskyellow';
                        break;
                    // Late
                    case 335:
                        statusColour = 'gtaskred';
                        break;
                    // On Hold
                    case 336:
                        statusColour = 'gtaskslategray';
                        break;
                    // Planning
                    case 337:
                        statusColour = 'gtaskblue';
                        break;
                    // To Do
                    case 338:
                        statusColour = 'gtaskgray';
                        break;
                     // Initiating
                    case 350:
                        statusColour = 'gtaskaliceblue';
                        break;
                     // Complete
                    case 351:
                        statusColour = 'gtaskblack';
                        break;
                    default:
                        statusColour = 'gtaskpink';
                        break;
                }
                                
                g.AddTaskItemObject(
                    {                        
                        pID: i + 8,
                        pName: name,
                        pStart: start,
                        pEnd: finish,
                        pLink: '',
                        pClass: statusColour,
                        pMile: 0,
                        pRes: pm,
                        pComp: percentageComplete,
                        pGroup: 0,
                        pParent: parent,
                        pOpen: 1,
                        pNotes: comments,
                        ID: id,
                        PM: pm,
                        Sponsor: sponsor
                }
                );
            }
                        
            g.Draw()

            document.write("<br><br><br><br>");

            //document.getElementById("click").onclick = function ()
            //{
            //    // Default export is a4 paper, portrait, using milimeters for units
            //    var doc = new jsPDF();

            //    //doc.addHTML($('GanttChartDIV')[0], 15, 15, {
            //    //    'background': '#fff',
            //    //});

            //    doc.fromHTML($('GanttChartDIV').html(), 10, 10, {'width' : 340});
            //    doc.save("Test.pdf");

            //    //var doc = new jsPDF();
            //    //doc.addHTML($('#content')[0], 15, 15, {
            //    //    'background': '#fff',
            //    //    }, function() {
            //    //    doc.save('sample-file.pdf');
            //    //});

            //}              

        </script>
        
</asp:Content>
```

