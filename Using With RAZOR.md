#Using jsGanttImproved with ASP.Net MVC and Razor

Using jsGanttImproved with ASP.Net MVC and the Razor markup language is easy. When creating an ASP.Net MVC project in Visual Studio, jQuery is an included library. Developers can use this to add a Gantt chart to thier project with the jsGanttImproved library.

1. **Download the library** - Use the download link above to download the library as an archive. From the archive, add the jsgantt.js file to your project Scripts folder and add the jsgantt.css to your project Content folder.
2. **Load the Library files on your page** - If using the ASP.Net Bundling feature, create bundles for the jsGanttImproved style sheet and the javascript library.

##In BundleConfig.cs
```c#
            bundles.Add(new StyleBundle("~/Content/jsgantt").Include(
                      "~/Content/jsgantt.css"));

            bundles.Add(new ScriptBundle("~/bundles/jsgantt").Include(
                      "~/Scripts/jsgantt.js"));
```
##On the desired page
```c#
@section css {
    @Styles.Render("~/Content/jsgantt")
}
```
##and 
```c#
@section Scripts {
    @Scripts.Render("~/bundles/jsgantt")
}
```

3. On the desred page, add a div with an id - 
```html
        <div style="position: relative" class="gantt" id="ProjectGantt">
        </div>
```

4. Add a script block to the Scripts section and instatiate the Gantt chart
```c#
@section Scripts {
    @Scripts.Render("~/bundles/jsgantt")

    <script>
        var chartDiv = $('#ProjectGantt')[0]; // Get the Dom object from the jQuery object
        var g = new JSGantt.GanttChart(chartDiv, 'day'); // Create a day based Gantt chart

        if (g.getDivId() != null) {
            g.setCaptionType('Complete');
            g.setQuarterColWidth(36);
            g.setDateTaskDisplayFormat('day dd month yyyy');
            g.setDayMajorDateDisplayFormat('mon yyyy - Week ww');
            g.setWeekMinorDateDisplayFormat('dd mon');
            g.setShowTaskInfoLink(1);
            g.setShowEndWeekDate(0);
            g.setUseSingleCell(10000);
            g.setFormatArr('Day', 'Week', 'Month', 'Quarter');
            
            // ... 
        }
    </script>
}
```
5. Add the code to load the items

```javascript
            JSGantt.parseJSON('project.json', g);
```

6. Call the Draw method on the Gantt chart object
```javascript
            g.Draw();
```
## Full Script Section
```c#
@section Scripts {
    @Scripts.Render("~/bundles/jsgantt")

    <script>
        var chartDiv = $('#ProjectGantt')[0]; // Get the Dom object from the jQuery object
        var g = new JSGantt.GanttChart(chartDiv, 'day'); // Create a day based Gantt chart

        if (g.getDivId() != null) {
            g.setCaptionType('Complete');
            g.setQuarterColWidth(36);
            g.setDateTaskDisplayFormat('day dd month yyyy');
            g.setDayMajorDateDisplayFormat('mon yyyy - Week ww');
            g.setWeekMinorDateDisplayFormat('dd mon');
            g.setShowTaskInfoLink(1);
            g.setShowEndWeekDate(0);
            g.setUseSingleCell(10000);
            g.setFormatArr('Day', 'Week', 'Month', 'Quarter');
            
            JSGantt.parseJSON('project.json', g);
            
            g.Draw();
        }
    </script>
}
```
