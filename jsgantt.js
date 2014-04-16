/*
	   _   ___  _____   _   _
	  (_) / _ \ \_   \ / | / |
	  | |/ /_\/  / /\/ | | | |
	  | / /_\\/\/ /_   | |_| |
	 _/ \____/\____/   |_(_)_|
	|__/
	jsGanttImproved 1.1
	Copyright (c) 2013-2014, Paul Geldart All rights reserved.

	The current version of this code can be found at https://code.google.com/p/jsgantt-improved/


	* Copyright (c) 2013-2014, Paul Geldart.
	* All rights reserved.
	*
	* Redistribution and use in source and binary forms, with or without
	* modification, are permitted provided that the following conditions are met:
	*     * Redistributions of source code must retain the above copyright
	*       notice, this list of conditions and the following disclaimer.
	*     * Redistributions in binary form must reproduce the above copyright
	*       notice, this list of conditions and the following disclaimer in the
	*       documentation and/or other materials provided with the distribution.
	*     * Neither the name of Paul Geldart nor the names of its contributors
	*       may be used to endorse or promote products derived from this software
	*       without specific prior written permission.
	*
	* THIS SOFTWARE IS PROVIDED BY PAUL GELDART. ''AS IS'' AND ANY EXPRESS OR
	* IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
	* OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
	* IN NO EVENT SHALL SHLOMY GANTZ/BLUEBRICK INC. BE LIABLE FOR ANY DIRECT,
	* INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

	This project is based on jsGantt 1.2, (which can be obtained from
	https://code.google.com/p/jsgantt/ ) and remains under the original BSD license.
	The original project license follows:

	Copyright (c) 2009, Shlomy Gantz BlueBrick Inc. All rights reserved.

	* Redistribution and use in source and binary forms, with or without
	* modification, are permitted provided that the following conditions are met:
	*     * Redistributions of source code must retain the above copyright
	*       notice, this list of conditions and the following disclaimer.
	*     * Redistributions in binary form must reproduce the above copyright
	*       notice, this list of conditions and the following disclaimer in the
	*       documentation and/or other materials provided with the distribution.
	*     * Neither the name of Shlomy Gantz or BlueBrick Inc. nor the
	*       names of its contributors may be used to endorse or promote products
	*       derived from this software without specific prior written permission.
	*
	* THIS SOFTWARE IS PROVIDED BY SHLOMY GANTZ/BLUEBRICK INC. ''AS IS'' AND ANY
	* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	* DISCLAIMED. IN NO EVENT SHALL SHLOMY GANTZ/BLUEBRICK INC. BE LIABLE FOR ANY
	* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TOR
	* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var JSGantt; if (!JSGantt) JSGantt = {};

var vTimeout = 0;
var vBenchTime = new Date().getTime();

JSGantt.isIE = function ()
{
	if(typeof document.all != 'undefined')
	{
		if ('pageXOffset' in window) return false;	// give IE9 and above the benefit of the doubt!
		else return true;
	}
	else return false;
}

JSGantt.TaskItem = function(pID, pName, pStart, pEnd, pClass, pLink, pMile, pRes, pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes)
{

    var vID    = parseInt(document.createTextNode(pID).data);
    var vName  = document.createTextNode(pName).data;
    var vStart = new Date(0);
    var vEnd   = new Date(0);
    var vClass = document.createTextNode(pClass).data;
    var vLink  = document.createTextNode(pLink).data;
    var vMile  = parseInt(document.createTextNode(pMile).data);
    var vRes   = document.createTextNode(pRes).data;
    var vComp  = parseInt(document.createTextNode(pComp).data);
    var vGroup = parseInt(document.createTextNode(pGroup).data);
    var vParent = document.createTextNode(pParent).data;
    var vOpen   = parseInt(document.createTextNode(pOpen).data);
    var vDepend = new Array();
    var vDependType = new Array();
    var vCaption = document.createTextNode(pCaption).data;
    var vDuration = '';
    var vLevel = 0;
    var vNumKid = 0;
    var vVisible = 1;
    var vSortIdx = 0;
    var vToDelete = false;
    var x1, y1, x2, y2;
    var vNotes;

	if ( pNotes != null )
	{
		var tmpDiv = document.createElement('div');
		tmpDiv.innerHTML = pNotes;
		JSGantt.stripUnwanted(tmpDiv);
	    vNotes = tmpDiv.innerHTML;
	}

    if (vGroup != 1)
    {
		vStart = JSGantt.parseDateStr(document.createTextNode(pStart).data,g.getDateInputFormat());
		vEnd   = JSGantt.parseDateStr(document.createTextNode(pEnd).data,g.getDateInputFormat());
	}

	if ( pDepend != null )
	{
		var vDependStr = pDepend + '';
		var vDepList = vDependStr.split(',');
		var n = vDepList.length;

		for(var k=0;k<n;k++)
		{
			if(vDepList[k].toUpperCase().indexOf('SS')!=-1)
			{
				vDepend[k]=vDepList[k].substring(0,vDepList[k].toUpperCase().indexOf('SS'));
				vDependType[k]='SS';
			}
			else if(vDepList[k].toUpperCase().indexOf('FF')!=-1)
			{
				vDepend[k]=vDepList[k].substring(0,vDepList[k].toUpperCase().indexOf('FF'));
				vDependType[k]='FF';
			}
			else if(vDepList[k].toUpperCase().indexOf('SF')!=-1)
			{
				vDepend[k]=vDepList[k].substring(0,vDepList[k].toUpperCase().indexOf('SF'));
				vDependType[k]='SF';
			}
			else if(vDepList[k].toUpperCase().indexOf('FS')!=-1)
			{
				vDepend[k]=vDepList[k].substring(0,vDepList[k].toUpperCase().indexOf('FS'));
				vDependType[k]='FS';
			}
			else
			{
				vDepend[k]=vDepList[k];
				vDependType[k]='FS';
			}
		}
	}

    this.getID       = function(){ return vID };
    this.getName     = function(){ return vName };
    this.getStart    = function(){ return vStart};
    this.getEnd      = function(){ return vEnd  };
    this.getClass    = function(){ return vClass};
    this.getLink     = function(){ return vLink };
    this.getMile     = function(){ return vMile };
    this.getDepend   = function(){ if(vDepend) return vDepend; else return null };
    this.getDepType  = function(){ if(vDependType) return vDependType; else return null };
    this.getCaption  = function(){ if(vCaption) return vCaption; else return ''; };
    this.getResource = function(){ if(vRes) return vRes; else return '&nbsp;';  };
    this.getCompVal  = function(){ if(vComp) return vComp; else return 0; };
    this.getCompStr  = function(){ if(vComp) return vComp+'%'; else return ''; };
    this.getNotes    = function(){ if(vNotes) return vNotes; else return ''; };
    this.getSortIdx  = function(){ return vSortIdx };
    this.getToDelete = function(){ return vToDelete };

    this.getDuration = function(vFormat)
	{
        if (vMile)
		{
            vDuration = '-';
		}
        else
		{ //if(vFormat == 'day'){
			tmpPer =  Math.ceil((this.getEnd() - this.getStart()) /  (24 * 60 * 60 * 100) + 10)/10;
			if(Math.floor(tmpPer) != tmpPer) tmpPer--;
			if(tmpPer == 1)  vDuration = '1 Day';
			else             vDuration = tmpPer + ' Days';
		}

		/*
			else if(vFormat == 'week')
			{
			tmpPer =  ((this.getEnd() - this.getStart()) /  (24 * 60 * 60 * 100) + 10)/70;
			if(Math.floor(tmpPer) != tmpPer) tmpPer--;
			if(tmpPer == 1)  vDuration = '1 Week';
			else             vDuration = tmpPer + ' Weeks';
			}

			else if(vFormat == 'month')
			{
			tmpPer =  ((this.getEnd() - this.getStart()) /  (24 * 60 * 60 * 100) + 10)/300;
			if(Math.floor(tmpPer) != tmpPer) tmpPer--;
			if(tmpPer == 1) vDuration = '1 Month';
			else            vDuration = tmpPer + ' Months';
			}

			else if(vFormat == 'quater')
			{
			tmpPer =  ((this.getEnd() - this.getStart()) /  (24 * 60 * 60 * 100) + 10)/1200;
			if(Math.floor(tmpPer) != tmpPer) tmpPer--;
			if(tmpPer == 1) vDuration = '1 Qtr';
			else            vDuration = tmpPer + ' Qtrs';
			}
		*/
		return( vDuration )
	};

	this.getParent   = function(){ return vParent };
	this.getGroup    = function(){ return vGroup };
	this.getOpen     = function(){ return vOpen };
	this.getLevel    = function(){ return vLevel };
	this.getNumKids  = function(){ return vNumKid };
	this.getStartX   = function(){ return x1 };
	this.getStartY   = function(){ return y1 };
	this.getEndX     = function(){ return x2 };
	this.getEndY     = function(){ return y2 };
	this.getVisible  = function(){ return vVisible };
	this.setDepend   = function(pDepend){ vDepend = pDepend;};
	this.setStart    = function(pStart){ vStart = pStart;};
	this.setEnd      = function(pEnd){ vEnd   = pEnd;  };
	this.setLevel    = function(pLevel){ vLevel = pLevel;};
	this.setNumKid   = function(pNumKid){ vNumKid = pNumKid;};
	this.setCompVal  = function(pCompVal){ vComp = pCompVal;};
	this.setStartX   = function(pX){ x1 = pX; };
	this.setStartY   = function(pY){ y1 = pY; };
	this.setEndX     = function(pX){ x2 = pX; };
	this.setEndY     = function(pY){ y2 = pY; };
	this.setOpen     = function(pOpen){ vOpen = pOpen; };
	this.setVisible  = function(pVisible){ vVisible = pVisible; };
	this.setSortIdx  = function(pSortIdx){ vSortIdx = pSortIdx; };
	this.setToDelete = function(pToDelete){ vToDelete = pToDelete; };
}


// function that loads the main gantt chart properties and functions
// pDiv: (required) this is a div object created in HTML
// pFormat: (required) - used to indicate whether chart should be drawn in "day", "week", "month", or "quarter" format
JSGantt.GanttChart =  function( pDiv, pFormat )
{
	var vDiv      = pDiv;
	var vFormat   = pFormat;
	var vUseFade = 1;
	var vUseMove = 1;
	var vUseRowHlt = 1;
	var vUseToolTip = 1;
	var vUseSort = 1;
	var vUseSingleCell = 0;
	var vShowRes  = 1;
	var vShowDur  = 1;
	var vShowComp = 1;
	var vShowStartDate = 1;
	var vShowEndDate = 1;
	var vShowEndWeekDate = 1;
	var vShowTaskInfoRes  = 1;
	var vShowTaskInfoDur  = 1;
	var vShowTaskInfoComp = 1;
	var vShowTaskInfoStartDate = 1;
	var vShowTaskInfoEndDate = 1;
	var vShowTaskInfoNotes  = 1;
	var vShowTaskInfoLink = 0;
	var vShowDeps = 1;
	var vShowSelector = new Array("Top");
	var vDateInputFormat = "yyyy-mm-dd";
	var vDateTaskTableDisplayFormat = JSGantt.parseDateFormatStr("dd/mm/yyyy");
	var vDateTaskDisplayFormat = JSGantt.parseDateFormatStr("dd month yyyy");
	var vDayMajorDateDisplayFormat = JSGantt.parseDateFormatStr("dd/mm/yyyy");
	var vDayMinorDateDisplayFormat = JSGantt.parseDateFormatStr("dd");
	var vWeekMajorDateDisplayFormat = JSGantt.parseDateFormatStr("yyyy");
	var vWeekMinorDateDisplayFormat = JSGantt.parseDateFormatStr("dd/mm");
	var vMonthMajorDateDisplayFormat = JSGantt.parseDateFormatStr("yyyy");
	var vMonthMinorDateDisplayFormat = JSGantt.parseDateFormatStr("mon");
	var vQuarterMajorDateDisplayFormat = JSGantt.parseDateFormatStr("yyyy");
	var vQuarterMinorDateDisplayFormat = JSGantt.parseDateFormatStr("qq");
	var vUseFullYear = JSGantt.parseDateFormatStr("dd/mm/yyyy");
	var vCaptionType;
	var vDepId = 1;
	var vTaskList     = new Array();
	var vFormatArr	= new Array("Day","Week","Month","Quarter");
	var vMonthDaysArr = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	var vProcessNeeded=true;
    var vMinGpLen = 8;
    var vScrollTo = '';
    var vDayColWidth = 18;
    var vWeekColWidth = 36;
    var vMonthColWidth = 36;
    var vQuarterColWidth = 18;
    var vRowHeight = 20;
    var vTodayPx = -1;

	this.setUseFade = function(pVal){ vUseFade = pVal; };
	this.setUseMove = function(pVal){ vUseMove = pVal; };
	this.setUseRowHlt = function(pVal){ vUseRowHlt = pVal; };
	this.setUseToolTip = function(pVal){ vUseToolTip = pVal; };
	this.setUseSort = function(pVal){ vUseSort = pVal; };
	this.setUseSingleCell = function(pVal){ vUseSingleCell = pVal; };
	this.setFormatArr = function()
	{
		var vValidFormats = "Day Week Month Quarter";
		vFormatArr = new Array();
		for(var i = 0, j = 0; i < arguments.length; i++)
		{
			if (vValidFormats.indexOf(arguments[i])!=-1)
			{
				vFormatArr[j++] = arguments[i];
				vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
				vValidFormats = vValidFormats.replace( vRegExp , '' );
			}
		}
	};
	this.setShowRes  = function(pVal){ vShowRes  = pVal; };
	this.setShowDur  = function(pVal){ vShowDur  = pVal; };
	this.setShowComp = function(pVal){ vShowComp = pVal; };
	this.setShowStartDate = function(pVal){ vShowStartDate = pVal; };
	this.setShowEndDate = function(pVal){ vShowEndDate = pVal; };
	this.setShowTaskInfoRes  = function(pVal){ vShowTaskInfoRes  = pVal; };
	this.setShowTaskInfoDur  = function(pVal){ vShowTaskInfoDur  = pVal; };
	this.setShowTaskInfoComp = function(pVal){ vShowTaskInfoComp = pVal; };
	this.setShowTaskInfoStartDate = function(pVal){ vShowTaskInfoStartDate = pVal; };
	this.setShowTaskInfoEndDate = function(pVal){ vShowTaskInfoEndDate = pVal; };
	this.setShowTaskInfoNotes  = function(pVal){ vShowTaskInfoNotes  = pVal; };
	this.setShowTaskInfoLink  = function(pVal){ vShowTaskInfoLink  = pVal; };
	this.setShowEndWeekDate = function(pVal){ vShowEndWeekDate = pVal; };
	this.setShowSelector = function()
	{
		var vValidSelectors = "Top Bottom";
		vShowSelector = new Array();
		for(var i = 0, j = 0; i < arguments.length; i++)
		{
			if (vValidSelectors.indexOf(arguments[i])!=-1)
			{
				vShowSelector[j++] = arguments[i];
				vRegExp = new RegExp('(?:^|\s)' + arguments[i] + '(?!\S)', 'g');
				vValidSelectors = vValidSelectors.replace( vRegExp , '' );
			}
		}
	};
	this.setShowDeps = function(pVal){ vShowDeps = pVal };
	this.setDateInputFormat = function(pVal){ vDateInputFormat = pVal; };
	this.setDateTaskTableDisplayFormat = function(pVal){ vDateTaskTableDisplayFormat = JSGantt.parseDateFormatStr(pVal); };
	this.setDateTaskDisplayFormat = function(pVal){ vDateTaskDisplayFormat = JSGantt.parseDateFormatStr(pVal); };
	this.setDayMajorDateDisplayFormat = function(pVal){ vDayMajorDateDisplayFormat = JSGantt.parseDateFormatStr(pVal); };
	this.setDayMinorDateDisplayFormat = function(pVal){ vDayMinorDateDisplayFormat = JSGantt.parseDateFormatStr(pVal); };
	this.setWeekMajorDateDisplayFormat = function(pVal){ vWeekMajorDateDisplayFormat = JSGantt.parseDateFormatStr(pVal); };
	this.setWeekMinorDateDisplayFormat = function(pVal){ vWeekMinorDateDisplayFormat = JSGantt.parseDateFormatStr(pVal); };
	this.setMonthMajorDateDisplayFormat = function(pVal){ vMonthMajorDateDisplayFormat = JSGantt.parseDateFormatStr(pVal); };
	this.setMonthMinorDateDisplayFormat = function(pVal){ vMonthMinorDateDisplayFormat = JSGantt.parseDateFormatStr(pVal); };
	this.setQuarterMajorDateDisplayFormat = function(pVal){ vQuarterMajorDateDisplayFormat = JSGantt.parseDateFormatStr(pVal); };
	this.setQuarterMinorDateDisplayFormat = function(pVal){ vQuarterMinorDateDisplayFormat = JSGantt.parseDateFormatStr(pVal); };
	this.setCaptionType = function(pType){ vCaptionType = pType };
	this.setFormat = function(pFormat)
	{
		vFormat = pFormat;
		this.Draw();
	};
	this.setMinGpLen = function(pMinGpLen){ vMinGpLen = pMinGpLen; };
	this.setScrollTo = function(pDate){ vScrollTo = pDate };
	this.setDayColWidth = function(pWidth){ vDayColWidth = pWidth };
	this.setWeekColWidth = function(pWidth){ vWeekColWidth = pWidth };
	this.setMonthColWidth = function(pWidth){ vMonthColWidth = pWidth };
	this.setQuarterColWidth = function(pWidth){ vQuarterColWidth = pWidth };
	this.setRowHeight = function(pHeight){ vRowHeight = pHeight };

	this.getUseFade = function(){ return vUseFade };
	this.getUseMove = function(){ return vUseMove };
	this.getUseRowHlt = function(){ return vUseRowHlt };
	this.getUseToolTip = function(){ return vUseToolTip };
	this.getUseSort = function(){ return vUseSort };
	this.getUseSingleCell = function(){ return vUseSingleCell };
	this.getFormatArr  = function(){ return vFormatArr };
	this.getShowRes  = function(){ return vShowRes };
	this.getShowDur  = function(){ return vShowDur };
	this.getShowComp = function(){ return vShowComp };
	this.getShowStartDate = function(){ return vShowStartDate };
	this.getShowEndDate = function(){ return vShowEndDate };
	this.getShowTaskInfoRes  = function(){ return vShowTaskInfoRes };
	this.getShowTaskInfoDur  = function(){ return vShowTaskInfoDur };
	this.getShowTaskInfoComp = function(){ return vShowTaskInfoComp };
	this.getShowTaskInfoStartDate = function(){ return vShowTaskInfoStartDate };
	this.getShowTaskInfoEndDate = function(){ return vShowTaskInfoEndDate };
	this.getShowTaskInfoNotes = function(){ return vShowTaskInfoNotes };
	this.getShowTaskInfoLink = function(){ return vShowTaskInfoLink };
	this.getShowEndWeekDate = function(){ return vShowEndWeekDate };
	this.getShowSelector = function(){ return vShowSelector };
	this.getShowDeps = function(){ return vShowDeps };
	this.getDateInputFormat = function(){ return vDateInputFormat };
	this.getDateTaskTableDisplayFormat = function(){ return vDateTaskTableDisplayFormat };
	this.getDateTaskDisplayFormat = function(){ return vDateTaskDisplayFormat };
	this.getDayMajorDateDisplayFormat = function(){ return vDayMajorDateDisplayFormat };
	this.getDayMinorDateDisplayFormat = function(){ return vDayMinorDateDisplayFormat };
	this.getWeekMajorDateDisplayFormat = function(){ return vWeekMajorDateDisplayFormat };
	this.getWeekMinorDateDisplayFormat = function(){ return vWeekMinorDateDisplayFormat };
	this.getMonthMajorDateDisplayFormat = function(){ return vMonthMajorDateDisplayFormat };
	this.getMonthMinorDateDisplayFormat = function(){ return vMonthMinorDateDisplayFormat };
	this.getQuarterMajorDateDisplayFormat = function(){ return vQuarterMajorDateDisplayFormat };
	this.getQuarterMinorDateDisplayFormat = function(){ return vQuarterMinorDateDisplayFormat };
	this.getCaptionType = function(){ return vCaptionType };
    this.getMinGpLen = function(){ return vMinGpLen };
    this.getScrollTo = function(){ return vScrollTo };
    this.getDayColWidth = function(){ return vDayColWidth };
    this.getWeekColWidth = function(){ return vWeekColWidth };
    this.getMonthColWidth = function(){ return vMonthColWidth };
    this.getQuarterColWidth = function(){ return vQuarterColWidth };
    this.getRowHeight = function(){ return vRowHeight };

	this.CalcTaskXY = function()
	{
		var vList = this.getList();
		var vBarDiv;
		var vTaskDiv;
		var vParDiv;
		var vLeft, vTop, vHeight, vWidth;
		var vHeight = Math.floor((this.getRowHeight()/2));

		for(i = 0; i < vList.length; i++)
		{
			vID = vList[i].getID();
			vBarDiv = JSGantt.findObj("bardiv_"+vID);
			vTaskDiv = JSGantt.findObj("taskbar_"+vID);
			vParDiv  = JSGantt.findObj("childrow_"+vID);

			if(vBarDiv)
			{
				vList[i].setStartX( vBarDiv.offsetLeft+1 );
				vList[i].setStartY( vParDiv.offsetTop+vBarDiv.offsetTop+vHeight-1 );
				vList[i].setEndX( vBarDiv.offsetLeft + vBarDiv.offsetWidth+1 );
				vList[i].setEndY( vParDiv.offsetTop+vBarDiv.offsetTop+vHeight-1 );
			}
		}
	}

	this.AddTaskItem = function(value)
	{
		vTaskList.push(value);
		vProcessNeeded = true;
	}

	this.RemoveTaskItem = function(pID)
	{
		// simply mark the task for removal at this point - actually remove it next time we re-draw the chart
		for (var i = 0; i < vTaskList.length; i++)
		{
			if (vTaskList[i].getID() == pID) vTaskList[i].setToDelete(true);
			else if (vTaskList[i].getParent() == pID) this.RemoveTaskItem(vTaskList[i].getID());
		}
		vProcessNeeded = true;
	}

	this.getList   = function(){ return vTaskList };

	this.clearDependencies = function()
	{
		var parent = JSGantt.findObj('rightside');
		var depLine;
		var vMaxId = vDepId;
		for ( i=1; i<vMaxId; i++ )
		{
			depLine = JSGantt.findObj("line"+i);
			if (depLine){ parent.removeChild(depLine); }
		}
		vDepId = 1;
	}


	// sLine: Draw a straight line (colored one-pixel wide div), need to parameterize doc item
	this.sLine = function(x1,y1,x2,y2,pClass)
	{
		vLeft = Math.min(x1,x2);
		vTop  = Math.min(y1,y2);
		vWid  = Math.abs(x2-x1) + 1;
		vHgt  = Math.abs(y2-y1) + 1;

		vDoc = JSGantt.findObj('rightside');

		// retrieve div
		var oDiv = document.createElement('div');

		oDiv.id = "line"+vDepId++;
		oDiv.style.position = "absolute";
		oDiv.style.margin = "0px";
		oDiv.style.padding = "0px";
		oDiv.style.overflow = "hidden";
		oDiv.style.border = "0px";

		// set attributes
		oDiv.style.zIndex = 0;
		if (pClass)	oDiv.className=pClass;
		else oDiv.style.backgroundColor = '#000000';

		oDiv.style.left = vLeft + "px";
		oDiv.style.top = vTop + "px";
		oDiv.style.width = vWid + "px";
		oDiv.style.height = vHgt + "px";

		oDiv.style.visibility = "visible";

		vDoc.appendChild(oDiv);

	}


	// dLine: Draw a diaganol line (calc line x,y paisrs and draw multiple one-by-one sLines)
	this.dLine = function(x1,y1,x2,y2,pClass)
	{

		var dx = x2 - x1;
		var dy = y2 - y1;
		var x = x1;
		var y = y1;

		var n = Math.max(Math.abs(dx),Math.abs(dy));
		dx = dx / n;
		dy = dy / n;
		for ( i = 0; i <= n; i++ )
		{
			vx = Math.round(x);
			vy = Math.round(y);
			this.sLine(vx,vy,vx,vy,pClass);
			x += dx;
			y += dy;
		}

	}

	this.drawDependency =function(x1,y1,x2,y2,pType,pClass)
	{
		var vDir = 1;
		var vBend = false;
		var vShort = 4;
		var vRow = Math.floor(this.getRowHeight()/2);

		if( y2 < y1 ) vRow *= -1;

		switch( pType )
		{
			case 'SF':
				if(x1 - 10 > x2)
				{
					vShort *= -1;
				}
				else
				{
					vBend=true;
					vShort *= -1;
				}
				vDir = -1;
				break;
			case 'SS':
				if ( x1 < x2 ) vShort*=-1;
				else vShort = x2-x1-(2*vShort);
				break;
			case 'FF':
				if ( x1 <= x2 ) vShort =x2-x1+(2*vShort);
				vDir = -1;
				break;
			default:
				if(x1 + 10 >= x2) vBend=true;
				break;
		}

		if (vBend)
		{
			this.sLine(x1,y1,x1+vShort,y1,pClass);
			this.sLine(x1+vShort,y1,x1+vShort,y2-vRow,pClass);
			this.sLine(x1+vShort,y2-vRow,x2-(vShort*2),y2-vRow,pClass);
			this.sLine(x2-(vShort*2),y2-vRow,x2-(vShort*2),y2,pClass);
			this.sLine(x2-(vShort*2),y2,x2,y2,pClass);
		}
		else
		{
			this.sLine(x1,y1,x1+vShort,y1,pClass);
			this.sLine(x1+vShort,y1,x1+vShort,y2,pClass);
			this.sLine(x1+vShort,y2,x2,y2,pClass);
		}


		this.dLine(x2,y2,x2-(3*vDir),y2-(3*vDir),pClass);
		this.dLine(x2,y2,x2-(3*vDir),y2+(3*vDir),pClass);
		this.dLine(x2-(1*vDir),y2,x2-(3*vDir),y2-(2*vDir),pClass);
		this.dLine(x2-(1*vDir),y2,x2-(3*vDir),y2+(2*vDir),pClass);
	}

	this.DrawDependencies = function ()
	{
		if (this.getShowDeps()==1)
		{
			//First recalculate the x,y
			this.CalcTaskXY();

			this.clearDependencies();

			var vList = this.getList();
			for(var i = 0; i < vList.length; i++)
			{
				vDepend = vList[i].getDepend();
				vDependType = vList[i].getDepType();
				var n = vDepend.length;

				if(n>0 && vList[i].getVisible()==1)
				{
					for(var k=0;k<n;k++)
					{
						vTask = this.getArrayLocationByID(vDepend[k]);
						if (vTask)
						{
							if(vList[vTask].getVisible()==1)
							if(vDependType[k]=='SS')this.drawDependency(vList[vTask].getStartX()-1,vList[vTask].getStartY(),vList[i].getStartX()-1,vList[i].getStartY(),'SS','gDepSS');
							else if(vDependType[k]=='FF')this.drawDependency(vList[vTask].getEndX(),vList[vTask].getEndY(),vList[i].getEndX(),vList[i].getEndY(),'FF','gDepFF');
							else if(vDependType[k]=='SF')this.drawDependency(vList[vTask].getStartX()-1,vList[vTask].getStartY(),vList[i].getEndX(),vList[i].getEndY(),'SF','gDepSF');
							else if(vDependType[k]=='FS')this.drawDependency(vList[vTask].getEndX(),vList[vTask].getEndY(),vList[i].getStartX()-1,vList[i].getStartY(),'FS','gDepFS');
						}
					}
				}
			}
		}
		// draw the current date line
		if (vTodayPx >= 0) this.sLine(vTodayPx, 0, vTodayPx, JSGantt.findObj('chartTable').offsetHeight - 1, 'gCurDate');
	}


	this.getArrayLocationByID = function(pId)
	{

		var vList = this.getList();
		for(var i = 0; i < vList.length; i++)
		{
			if(vList[i].getID()==pId)
			return i;
		}
	}


	this.Draw = function()
	{
		var vMaxDate = new Date();
		var vMinDate = new Date();
		var vTmpDate = new Date();
		var vNxtDate = new Date();
		var vCurrDate = new Date();
		var vTaskLeftPx = 0;
		var vTaskRightPx = 0;
		var vTaskWidth = 1;
		var vNumCols = 0;
		var vID = 0;
		var vMainTable = "";
		var vLeftTable = "";
		var vRightTable = "";
		var vDateRowStr = "";
		var vFirstCellItemRowStr = "";
		var vItemRowStr = "";
		var vColWidth = 0;
		var vColUnit = 0;
		var vChild;
		var vGroup;
		var vTaskDiv;
		var vParDiv;

		if(vTaskList.length > 0)
		{
			// Process all tasks preset parent date and completion % if task list has altered
			if (vProcessNeeded)	JSGantt.processRows(vTaskList, 0, -1, 1, 1, this.getUseSort());
			vProcessNeeded=false;

			// get overall min/max dates plus padding
			vMinDate = JSGantt.getMinDate(vTaskList, vFormat);
			vMaxDate = JSGantt.getMaxDate(vTaskList, vFormat);

			// Calculate chart width variables.
			if(vFormat == 'day')
			{
				vColWidth = vDayColWidth;
			}
			else if(vFormat == 'week')
			{
				vColWidth = vWeekColWidth;
			}
			else if(vFormat == 'month')
			{
				vColWidth = vMonthColWidth;
			}
			else if(vFormat == 'quarter')
			{
				vColWidth = vQuarterColWidth;
			}

			// DRAW the Left-side of the chart (names, resources, comp%)
			vLeftHeader =
			'<div class="scroll3 column" id="leftsideh">' +
			'<table id=taskTableh cellSpacing=0 cellPadding=0 border=0><tbody>';
			vLeftHeader += '<tr><td class="gtasklist">&nbsp;</td><td class="gspanning gtaskname">' + this.drawSelector( "Top" ) + '</td>' ;
			if(vShowRes ==1) vLeftHeader += '  <td class="gspanning gresource">&nbsp;</td>' ;
			if(vShowDur ==1) vLeftHeader += '  <td class="gspanning gduration">&nbsp;</td>' ;
			if(vShowComp==1) vLeftHeader += '  <td class="gspanning gpccomplete">&nbsp;</td>' ;
			if(vShowStartDate==1) vLeftHeader += '  <td class="gspanning gstartdate">&nbsp;</td>' ;
			if(vShowEndDate==1) vLeftHeader += '  <td class="gspanning genddate">&nbsp;</td>' ;
			vLeftHeader += '</tr>';

			vLeftHeader +=
			'<tr>' +
			'  <td class="gtasklist">&nbsp;</td><td class="gtaskname">&nbsp;</td>' ;

			if(vShowRes ==1) vLeftHeader += '  <td class="gtaskheading gresource">Resource</td>' ;
			if(vShowDur ==1) vLeftHeader += '  <td class="gtaskheading gduration">Duration</td>' ;
			if(vShowComp==1) vLeftHeader += '  <td class="gtaskheading gpccomplete">% Comp.</td>' ;
			if(vShowStartDate==1) vLeftHeader += '  <td class="gtaskheading gstartdate">Start Date</td>' ;
			if(vShowEndDate==1) vLeftHeader += '  <td class="gtaskheading genddate">End Date</td>' ;

			vLeftHeader += '</tr></tbody></table></div><div id="footer2"></div>';
			vLeftTable += '<div class="scroll column" id="leftside">' +
			'<table id=taskTable cellSpacing=0 cellPadding=0 border=0><tbody>';

			for(i = 0; i < vTaskList.length; i++)
			{
				if( vTaskList[i].getGroup())
				{
					vBGColor = "ggroupitem";
					vRowType = "group";
				}
				else
				{
					vBGColor  = "glineitem";
					vRowType  = "row";
				}

				vID = vTaskList[i].getID();

				if(vTaskList[i].getVisible() == 0)
					vLeftTable += '<tr id=child_' + vID + ' class="gname ' + vBGColor + '" style="display:none">' ;
				else
					vLeftTable += '<tr id=child_' + vID + ' class="gname ' + vBGColor + '" >' ;

				vLeftTable +=
				'  <td class="gtasklist">&nbsp;</td>' +
				'  <td class="gtaskname">';

				for(j=1; j<vTaskList[i].getLevel(); j++)
				{
					vLeftTable += '&nbsp;&nbsp;&nbsp;&nbsp;';
				}

				if( vTaskList[i].getGroup())
				{
					vLeftTable += '<span id="group_' + vID + '" class="gfoldercollapse">'+(( vTaskList[i].getOpen() == 1)?'-':'+')+'</span>' ;
				}
				else
				{
					vLeftTable += '&nbsp;&nbsp;&nbsp;';
				}

				vLeftTable +=
				' ' + vTaskList[i].getName() + '</td>' ;

				if(vShowRes ==1) vLeftTable += '  <td class="gresource">' + vTaskList[i].getResource() + '</td>' ;
				if(vShowDur ==1) vLeftTable += '  <td class="gduration">' + vTaskList[i].getDuration(vFormat) + '</td>' ;
				if(vShowComp==1) vLeftTable += '  <td class="gpccomplete">' + vTaskList[i].getCompStr()  + '</td>' ;
				if(vShowStartDate==1) vLeftTable += '  <td class="gstartdate">' + JSGantt.formatDateStr( vTaskList[i].getStart(), vDateTaskTableDisplayFormat) + '</td>' ;
				if(vShowEndDate==1) vLeftTable += '  <td class="genddate">' + JSGantt.formatDateStr( vTaskList[i].getEnd(), vDateTaskTableDisplayFormat) + '</td>' ;

				vLeftTable += '</tr>';

			}

			// DRAW the date format selector at bottom left.
			vLeftTable += '</td></tr>';
			vLeftTable +=
			'<tr>' +
			'  <td class="gtasklist">&nbsp;</td><td class="gspanning gtaskname">' + this.drawSelector( "Bottom" ) + '</td>' ;
			if(vShowRes ==1) vLeftTable += '  <td class="gspanning gresource">&nbsp;</td>' ;
			if(vShowDur ==1) vLeftTable += '  <td class="gspanning gduration">&nbsp;</td>' ;
			if(vShowComp==1) vLeftTable += '  <td class="gspanning gpccomplete">&nbsp;</td>' ;
			if(vShowStartDate==1) vLeftTable += '  <td class="gspanning gstartdate">&nbsp;</td>' ;
			if(vShowEndDate==1) vLeftTable += '  <td class="gspanning genddate">&nbsp;</td>' ;
			vLeftTable += '</tr>';

			// close all tags and add some white space so the vertical scroll distance should always be greater
			// than for the right pane (keep to a minimum as it is seen in unconstrianed height designs)
			vLeftTable += '</tbody></table><br/><br/></div>';


			// Draw the Chart Rows
			vRightHeader =
			'<div class="scroll4 column" id="rightsideh">' +
			'<table id="chartTableh" cellSpacing=0 cellPadding=0 border=0>' +
			'<tbody><tr>';

			vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
			vTmpDate.setHours(0);
			vTmpDate.setMinutes(0);
			vTmpDate.setSeconds(0);
			vTmpDate.setMilliseconds(0);

			// Major Date Header
			while(vTmpDate.getTime() <= vMaxDate.getTime())
			{
				vHeaderCellClass = "gmajorheading";

				if(vFormat == 'day')
				{
					vNxtDate.setDate(vTmpDate.getDate() + 7);

					vRightHeader += '<td class="' + vHeaderCellClass + '" colspan=7><div style="width: ' + vColWidth*7 + 'px;">' + JSGantt.formatDateStr(vTmpDate,vDayMajorDateDisplayFormat) ;
					vTmpDate.setDate(vTmpDate.getDate() + 6);

					if ( vShowEndWeekDate == 1 ) vRightHeader += ' - ' +JSGantt.formatDateStr(vTmpDate, vDayMajorDateDisplayFormat);

					vRightHeader += '</div></td>';
					vTmpDate.setDate(vTmpDate.getDate() + 1);
				}
				else if(vFormat == 'week')
				{
					vRightHeader += '<td class="' + vHeaderCellClass + '" style="width: ' + vColWidth + 'px"><div style="width: ' + vColWidth + 'px;">'+ JSGantt.formatDateStr(vTmpDate,vWeekMajorDateDisplayFormat) + '</div></td>';
					vTmpDate.setDate(vTmpDate.getDate() + 7);
				}
				else if(vFormat == 'month')
				{
					var vColSpan = (12 - vTmpDate.getMonth());
					if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= (11 - vMaxDate.getMonth());
					vRightHeader += '<td class="' + vHeaderCellClass + '" colspan='+ vColSpan +'><div style="width: ' + vColWidth*vColSpan + 'px;">'+ JSGantt.formatDateStr(vTmpDate,vMonthMajorDateDisplayFormat) + '</div></td>';
					vTmpDate.setFullYear(vTmpDate.getFullYear()+1,0,1);
				}
				else if(vFormat == 'quarter')
				{
					var vColSpan = (4 - Math.floor(vTmpDate.getMonth()/3));
					if (vTmpDate.getFullYear() == vMaxDate.getFullYear()) vColSpan -= (3 - Math.floor(vMaxDate.getMonth()/3));

					vRightHeader += '<td class="' + vHeaderCellClass + '" colspan='+ vColSpan +'><div style="width: ' + vColWidth*vColSpan + 'px;">'+ JSGantt.formatDateStr(vTmpDate,vQuarterMajorDateDisplayFormat) + '</div></td>';
					vTmpDate.setFullYear(vTmpDate.getFullYear()+1,0,1);
				}
			}

			vRightHeader += '</tr><tr>';

			// Minor Date header and Cell Rows
			vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
			vNxtDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());
			vNumCols = 0;

			while(Date.parse(vTmpDate) <= Date.parse(vMaxDate))
			{
				if(vFormat == 'day' )
				{
					vHeaderCellClass  = "gminorheading";
					vCellClass = "gtaskcell";

					if(vTmpDate.getDay() % 6 == 0)
					{
						vHeaderCellClass  += "wkend";
						vCellClass += "wkend";
					}

					vNxtDate.setDate(vTmpDate.getDate() + 1);

					if(vTmpDate <= vMaxDate)
					{
						vDateRowStr += '<td class="'+ vHeaderCellClass +'"><div style="width: '+vColWidth+'px">' + JSGantt.formatDateStr(vTmpDate,vDayMinorDateDisplayFormat) + '</div></td>';

						if ( vFirstCellItemRowStr == "" )
						{
							vFirstCellItemRowStr = '<td class="'+ vCellClass +'"><div style="position:relative;">&nbsp;&nbsp;';
							vItemRowStr += '</div></td>';
							vNumCols = 1;
						}
						else
						{
							if(vUseSingleCell != 1) vItemRowStr += '<td class="'+ vCellClass +'">&nbsp;&nbsp;</td>';
							vNumCols++;
						}
					}

					vTmpDate.setDate(vTmpDate.getDate() + 1);

				}

				else if(vFormat == 'week')
				{

					vNxtDate.setDate(vNxtDate.getDate() + 7);

					vHeaderCellClass  = "gminorheading";
					vCellClass = "gtaskcell";

					if(vTmpDate <= vMaxDate)
					{
						vDateRowStr += '<td class="' + vHeaderCellClass + '"><div style="width: '+vColWidth+'px">' + JSGantt.formatDateStr(vTmpDate,vWeekMinorDateDisplayFormat) + '</div></td>';
						if ( vFirstCellItemRowStr == "" )
						{
							vFirstCellItemRowStr = '<td class="' + vCellClass + '"><div style="position:relative;">&nbsp;&nbsp;';
							vItemRowStr += '</div></td>';
							vNumCols = 1;
						}
						else
						{
							if(vUseSingleCell != 1) vItemRowStr += '<td class="' + vCellClass + '">&nbsp;&nbsp;</td>';
							vNumCols++;
						}
					}

					vTmpDate.setDate(vTmpDate.getDate() + 7);

				}

				else if(vFormat == 'month')
				{

					vNxtDate.setFullYear(vTmpDate.getFullYear(), vTmpDate.getMonth(), vMonthDaysArr[vTmpDate.getMonth()]);

					vHeaderCellClass  = "gminorheading";
					vCellClass = "gtaskcell";

					if(vTmpDate <= vMaxDate)
					{
						vDateRowStr += '<td class="' + vHeaderCellClass + '"><div style="width: '+vColWidth+'px">' + JSGantt.formatDateStr(vTmpDate,vMonthMinorDateDisplayFormat) + '</div></td>';
						if ( vFirstCellItemRowStr == "" )
						{
							vFirstCellItemRowStr = '<td class="' + vCellClass + '"><div style="position:relative;">&nbsp;&nbsp;';
							vItemRowStr += '</div></td>';
							vNumCols = 1;
						}
						else
						{
							if(vUseSingleCell != 1) vItemRowStr += '<td class="' + vCellClass + '">&nbsp;&nbsp;</td>';
							vNumCols++;
						}
					}

					vTmpDate.setDate(vTmpDate.getDate() + 1);

					while(vTmpDate.getDate() > 1)
					{
						vTmpDate.setDate(vTmpDate.getDate() + 1);
					}

				}

				else if(vFormat == 'quarter')
				{

					vNxtDate.setDate(vNxtDate.getDate() + 122);
					if( vTmpDate.getMonth()==0 || vTmpDate.getMonth()==1 || vTmpDate.getMonth()==2 )
						vNxtDate.setFullYear(vTmpDate.getFullYear(), 2, 31);
					else if( vTmpDate.getMonth()==3 || vTmpDate.getMonth()==4 || vTmpDate.getMonth()==5 )
						vNxtDate.setFullYear(vTmpDate.getFullYear(), 5, 30);
					else if( vTmpDate.getMonth()==6 || vTmpDate.getMonth()==7 || vTmpDate.getMonth()==8 )
						vNxtDate.setFullYear(vTmpDate.getFullYear(), 8, 30);
					else if( vTmpDate.getMonth()==9 || vTmpDate.getMonth()==10 || vTmpDate.getMonth()==11 )
						vNxtDate.setFullYear(vTmpDate.getFullYear(), 11, 31);

					vHeaderCellClass  = "gminorheading";
					vCellClass = "gtaskcell";

					if(vTmpDate <= vMaxDate)
					{
						vDateRowStr += '<td class="' + vHeaderCellClass + '"><div style="width: '+vColWidth+'px">' + JSGantt.formatDateStr(vTmpDate,vQuarterMinorDateDisplayFormat) + '</div></td>';

						if ( vFirstCellItemRowStr == "" )
						{
							vFirstCellItemRowStr = '<td class="' + vCellClass + '"><div style="position:relative;">&nbsp;&nbsp;';
							vItemRowStr += '</div></td>';
							vNumCols = 1;
						}
						else
						{
							if(vUseSingleCell != 1) vItemRowStr += '<td class="' + vCellClass + '">&nbsp;&nbsp;</td>';
							vNumCols++;
						}
					}

					vTmpDate.setDate(vTmpDate.getDate() + 81);

					while(vTmpDate.getDate() > 1)
					{
						vTmpDate.setDate(vTmpDate.getDate() + 1);
					}

				}
			}

			vTaskLeftPx = (vNumCols *(vColWidth + 1))+1;

			vRightHeader += vDateRowStr + '</tr></tbody></table><div class="rhscrpad" style="position: absolute; top: 0px; left:'+vTaskLeftPx+1+'px; height: 1px;"></div></div>';
			vRightTable =
			'<div class="scroll2 column" id="rightside">' +
			'<table id="chartTable" cellSpacing=0 cellPadding=0 border=0 style="width: '+vTaskLeftPx+'px">' +
			'<tbody>';
			// Draw each row

			for(i = 0; i < vTaskList.length; i++)
			{
				var curTaskStart = new Date(vTaskList[i].getStart().getTime());
				var curTaskEnd = vTaskList[i].getEnd();
				if ((curTaskEnd.getTime()-(curTaskEnd.getTimezoneOffset()*60000)) % (24 * 60 * 60 * 1000) == 0) curTaskEnd = new Date(curTaskEnd.getTime() + (24 * 60 * 60 * 1000)); // add 1 day here to simplify calculations below

				vTaskLeftPx = JSGantt.getOffset(vMinDate, curTaskStart, vColWidth, vFormat);
				vTaskRightPx = JSGantt.getOffset(curTaskStart, curTaskEnd, vColWidth, vFormat);

				vTmpDate.setFullYear(vMinDate.getFullYear(), vMinDate.getMonth(), vMinDate.getDate());

				vID = vTaskList[i].getID();

				if( vTaskList[i].getMile())
				{

					vRightTable += '<tr id=childrow_' + vID + ((vTaskList[i].getVisible() == 0)? ' style="display:none;"' : '') + ' class="gmileitem gmile'+vFormat+'">' + vFirstCellItemRowStr;
					vRightTable +=
					'<div id="bardiv_' + vID + '" class="gtaskbarcontainer" style="position:absolute; top:-2px; width:12px; left:' + (vTaskLeftPx - 6) + 'px;" >' +
					  '<div id="taskbar_' + vID + '" class="' + vTaskList[i].getClass() +'" style="width:12px;" >';

					if(vTaskList[i].getCompVal() < 100)
						vRightTable += '&loz;</div>' ;
					else
//						vRightTable += '&diams;</div>' ;
						vRightTable +='<div class="gmilediamond"><div class="gmdtop" ></div><div class="gmdbottom" ></div></div></div>' ;

					if( g.getCaptionType() )
					{
						vCaptionStr = '';
						switch( g.getCaptionType() )
						{
							case 'Caption':    vCaptionStr = vTaskList[i].getCaption();  break;
							case 'Resource':   vCaptionStr = vTaskList[i].getResource();  break;
							case 'Duration':   vCaptionStr = vTaskList[i].getDuration(vFormat);  break;
							case 'Complete':   vCaptionStr = vTaskList[i].getCompStr();  break;
						}
						vRightTable += '<div class="gmilecaption" style="position:absolute; width:120px; left:12px">' + vCaptionStr + '</div>';
					}
					// Add Task Info div for tooltip
					vRightTable += '<div style="display: none;" id="tttaskbar_' + vID + '"><div id="ttcomplete_' + vID + '">' + this.createTaskInfo(vTaskList[i]) + '</div></div>'
					vRightTable += '</div>';

					vRightTable += vItemRowStr + '</tr>';


				}
				else
				{

					vTaskWidth = vTaskRightPx - 1;

					// Draw Group Bar  which has outer div with inner group div and several small divs to left and right to create angled-end indicators
					if( vTaskList[i].getGroup())
					{
						vTaskWidth = (vTaskWidth > vMinGpLen && vTaskWidth < vMinGpLen*2)? vMinGpLen*2 : vTaskWidth; // Expand to show two end points
						vTaskWidth = (vTaskWidth < vMinGpLen)? vMinGpLen : vTaskWidth; // expand to show one end point
						vRightTable += '<tr id=childrow_' + vID + ((vTaskList[i].getVisible() == 0)? ' style="display:none;"' : '') + ' class="ggroupitem ggroup'+vFormat+'">'  + vFirstCellItemRowStr;
						vRightTable +=
						'<div id="bardiv_' + vID + '" class="gtaskbarcontainer" style="position:absolute; top:2px; left:' + vTaskLeftPx + 'px; width:' + vTaskWidth + 'px;">' +
						  '<div id="taskbar_' + vID + '" class="' + vTaskList[i].getClass() +'" style="width:' + vTaskWidth + 'px;">' +
						    '<div id="complete_' + vID + '" class="' + vTaskList[i].getClass() +'complete" style="width:' + vTaskList[i].getCompStr() + '; ">' +
						    '</div>' +
						  '</div>' +
						  '<div class="' + vTaskList[i].getClass() +'endpointleft" style="float:left;"></div>';
						if ( vTaskWidth >= vMinGpLen*2 ) vRightTable += '<div class="' + vTaskList[i].getClass() +'endpointright" style="float:right;"></div>';

						if( g.getCaptionType() )
						{
							vCaptionStr = '';
							switch( g.getCaptionType() )
							{
								case 'Caption':    vCaptionStr = vTaskList[i].getCaption();  break;
								case 'Resource':   vCaptionStr = vTaskList[i].getResource();  break;
								case 'Duration':   vCaptionStr = vTaskList[i].getDuration(vFormat);  break;
								case 'Complete':   vCaptionStr = vTaskList[i].getCompStr();  break;
							}
							vRightTable += '<div class="ggroupcaption" style="position:absolute; width:120px; right: -126px">' + vCaptionStr + '</div>';
						}
						// Add Task Info div for tooltip
						vRightTable += '<div style="display: none;" id="tttaskbar_' + vID + '"><div id="ttcomplete_' + vID + '">' + this.createTaskInfo(vTaskList[i]) + '</div></div>'
						vRightTable += '</div>' ;

						vRightTable += vItemRowStr + '</tr>';

					}
					else
					{

						vDivStr = '<tr id=childrow_' + vID + ((vTaskList[i].getVisible() == 0)? ' style=" display:none;"' : '') + ' class="glineitem gitem'+vFormat+'">'  + vFirstCellItemRowStr;
						vRightTable += vDivStr;

						vTaskWidth = (vTaskWidth <=0)? 1 : vTaskWidth;
						// Draw Task Bar  which has colored bar div, and opaque completion div
						vRightTable +=
						'<div id="bardiv_' + vID + '" class="gtaskbarcontainer" style="position:absolute; top:1px; left:' + vTaskLeftPx + 'px; width:' + vTaskWidth + 'px;">' +
						  '<div id=taskbar_' + vID + ' class="' + vTaskList[i].getClass() +'" style="width:' + vTaskWidth + 'px;">' +
						    '<div id="complete_' + vID + '" class="' + vTaskList[i].getClass() +'complete" style="width:' + vTaskList[i].getCompStr() + ';">' +
						    '</div>' +
						  '</div>';

						if( g.getCaptionType() )
						{
							vCaptionStr = '';
							switch( g.getCaptionType() )
							{
								case 'Caption':    vCaptionStr = vTaskList[i].getCaption();  break;
								case 'Resource':   vCaptionStr = vTaskList[i].getResource();  break;
								case 'Duration':   vCaptionStr = vTaskList[i].getDuration(vFormat);  break;
								case 'Complete':   vCaptionStr = vTaskList[i].getCompStr();  break;
							}
							vRightTable += '<div class="gcaption" style="position:absolute; width:120px; right: -126px">' + vCaptionStr + '</div>';
						}
						// Add Task Info div for tooltip
						vRightTable += '<div style="display: none;" id="tttaskbar_' + vID + '"><div id="ttcomplete_' + vID + '">' + this.createTaskInfo(vTaskList[i]) + '</div></div>'
						vRightTable += '</div>' ;

						vRightTable += vItemRowStr + '</tr>';

					}
				}
			}
			if(vUseSingleCell != 1) vRightTable += vDateRowStr+'</tbody></table></div>';
			else vRightTable += '</tbody></table></div>';
			vMainTable = '<div id="container">' + vRightHeader + vLeftHeader + vRightTable + vLeftTable + '<div id="footer"></div></div>';

/* Quick hack to show the generated HTML on older browsers - add a '/' to the begining of this line to activate
			var tmpGenSrcDiv = document.createElement('div');
			tmpGenSrcDiv.appendChild(document.createTextNode(vMainTable));
			vMainTable += '<textarea>'+tmpGenSrcDiv.innerHTML+'</textarea>';
//*/

			vDiv.innerHTML = vMainTable;

			// Now all the content exists, register listeners
			for(i = 0; i < vTaskList.length; i++)
			{
				vID = vTaskList[i].getID();
				vChild = JSGantt.findObj("child_"+vID);
				vTaskDiv = JSGantt.findObj("taskbar_"+vID);
				vParDiv  = JSGantt.findObj("childrow_"+vID);
				if(vTaskList[i].getGroup())vGroup  = JSGantt.findObj("group_"+vID);

				if(vTaskDiv) JSGantt.addTootltipListeners( this, vTaskDiv );
				if(vChild && vParDiv) JSGantt.addThisRowListeners( this, vChild, vParDiv );
				if(vTaskList[i].getGroup() && vGroup) JSGantt.addFolderListeners( this, vGroup, vID );
			}

			for ( var i = 0; i < vShowSelector.length; i++ )
			{
				for ( var j = 0; j < vFormatArr.length; j++ )
				{
					var vSelectorDisplayFormat = vFormatArr[j].toLowerCase();
					var vSelectorId = "format" + vFormatArr[j] + vShowSelector[i];
					JSGantt.addFormatListeners(this, vSelectorDisplayFormat, vSelectorId);
				}
			}

			JSGantt.addScrollListeners();

			// now check if we are actually scrolling the pane
			if ( vScrollTo != '' )
			{
				var vScrollDate = new Date(vMinDate.getTime());
				var vScrollPx = 0;

				if(vScrollTo.substr(0,2) == 'px')
				{
					vScrollPx = parseInt(vScrollTo.substr(2));
				}
				else
				{
					if ( vScrollTo == 'today' ) vScrollDate = new Date();
					else vScrollDate = JSGantt.parseDateStr(vScrollTo, this.getDateInputFormat());

					vScrollDate.setHours( 0,0,0,0 ); // zero any time present

					vScrollPx = JSGantt.getOffset(vMinDate, vScrollDate, vColWidth, vFormat)
				}
				JSGantt.findObj('rightside').scrollLeft = vScrollPx;
			}

			if (vMinDate.getTime() <= (new Date()).getTime() && vMaxDate.getTime() >= (new Date()).getTime() ) vTodayPx = JSGantt.getOffset(vMinDate, new Date(), vColWidth, vFormat);
			else vTodayPx = -1;
			this.DrawDependencies();
		}

	} //this.draw

	this.mouseOver = function( pObj1, pObj2 )
	{
		if ( this.getUseRowHlt())
		{
			pObj1.className += " gitemhighlight";
			pObj2.className += " gitemhighlight";
		}
	}

	this.mouseOut = function( pObj1, pObj2 )
	{
		if ( this.getUseRowHlt())
		{
			pObj1.className = pObj1.className.replace( /(?:^|\s)gitemhighlight(?!\S)/g , '' );
			pObj2.className = pObj2.className.replace( /(?:^|\s)gitemhighlight(?!\S)/g , '' );
		}
	}

	this.drawSelector = function( pPos )
	{
		var vOutput = "";
		var vDisplay=false;

		for ( var i = 0; i < vShowSelector.length && !vDisplay; i++ )
		{
			if ( vShowSelector[i] == pPos ) vDisplay=true;
		}

		if ( vDisplay )
		{
			vOutput += '<div class="gselector">Format:&nbsp;&nbsp;';

			if (vFormatArr.join().toLowerCase().indexOf("day")!=-1)
			{
				if (vFormat=='day') vOutput += '<span id="formatDay' + pPos + '" class="gformlabel gselected">Day&nbsp;</span> ';
				else                vOutput += '<span id="formatDay' + pPos + '" class="gformlabel">Day&nbsp;</span> ';
			}

			if (vFormatArr.join().toLowerCase().indexOf("week")!=-1)
			{
				if (vFormat=='week') vOutput += '<span id="formatWeek' + pPos + '" class="gformlabel gselected">Week</span> ';
				else                 vOutput += '<span id="formatWeek' + pPos + '" class="gformlabel">Week</span> ';
			}

			if (vFormatArr.join().toLowerCase().indexOf("month")!=-1)
			{
				if (vFormat=='month') vOutput += '<span id="formatMonth' + pPos + '" class="gformlabel gselected">Month</span> ';
				else                  vOutput += '<span id="formatMonth' + pPos + '" class="gformlabel">Month</span> ';
			}

			if (vFormatArr.join().toLowerCase().indexOf("quarter")!=-1)
			{
				if (vFormat=='quarter') vOutput += '<span id="formatQuarter' + pPos + '" class="gformlabel gselected">Quarter</span>&nbsp;';
				else                    vOutput += '<span id="formatQuarter' + pPos + '" class="gformlabel">Quarter</span> ';
			}

			vOutput += '';
		}
		else
		{
			vOutput += '<div class="gselector">&nbsp;</div>';
		}
		return vOutput;
	}

	this.createTaskInfo = function(pTask)
	{
		var vTaskInfoBox = '';
		vTaskInfoBox = '<div class="gTaskInfo"><span class="gTtTitle">' + pTask.getName() + '</span><br/><br/>' ;
		if(vShowTaskInfoStartDate==1) vTaskInfoBox += '<span class="gTaskLabel">Start Date: </span><span class="gTaskText">' + JSGantt.formatDateStr( pTask.getStart(), vDateTaskDisplayFormat) + '</span><br/>' ;
		if(vShowTaskInfoEndDate==1) vTaskInfoBox += '<span class="gTaskLabel">End Date: </span><span class="gTaskText">' + JSGantt.formatDateStr( pTask.getEnd(), vDateTaskDisplayFormat) + '</span><br/>' ;
		if(vShowTaskInfoDur ==1 && !pTask.getMile()) vTaskInfoBox += '<span class="gTaskLabel">Duration: </span><span class="gTaskText">' + pTask.getDuration(vFormat) + '</span><br/>' ;
		if(vShowTaskInfoComp==1) vTaskInfoBox += '<span class="gTaskLabel">Completion: </span><span class="gTaskText">' + pTask.getCompStr()  + '</span><br/>' ;
		if(vShowTaskInfoRes ==1) vTaskInfoBox += '<span class="gTaskLabel">Resource: </span><span class="gTaskText">' + pTask.getResource() + '</span><br/>' ;
		if(vShowTaskInfoLink ==1 && pTask.getLink() != '') vTaskInfoBox += '<br/><span class="gTaskLabel"><a class="gTaskText" href="' + pTask.getLink() + '">More Information</a></span><br />' ;
		if(vShowTaskInfoNotes ==1) vTaskInfoBox += '</br><span class="gTaskLabel">Notes: </span><span class="gTaskNotes">' + pTask.getNotes() + '</span>' ;
		vTaskInfoBox += '</br>';

		return vTaskInfoBox;
	}

} //GanttChart
JSGantt.updateFlyingObj = function (e, pGanttChartObj, pTimer) {
	var vCurTopBuf = 3;
	var vCurLeftBuf = 5;
	var vCurBotBuf = 3;
	var vCurRightBuf = 15;
	var vMouseX = (e)?e.clientX:window.event.clientX;
	var vMouseY = (e)?e.clientY:window.event.clientY;
	var vViewportX=document.documentElement.clientWidth||document.getElementsByTagName('body')[0].clientWidth;
	var vViewportY=document.documentElement.clientHeight||document.getElementsByTagName('body')[0].clientHeight;
	var vNewX = vMouseX;
	var vNewY = vMouseY;

	if (navigator.appName.toLowerCase () == "microsoft internet explorer") {
		// the clientX and clientY properties include
		// the left and top borders of the client area
		vMouseX -= document.documentElement.clientLeft;
		vMouseY -= document.documentElement.clientTop;

		var vZoomFactor = JSGantt.getZoomFactor ();
		if (vZoomFactor != 1) {  // IE 7 at non-default zoom level
			vMouseX = Math.round (vMouseX / vZoomFactor);
			vMouseY = Math.round (vMouseY / vZoomFactor);
		}
	}

	var vScrollPos = JSGantt.getScrollPositions();

	/* Code for positioned right of the mouse by default*/
	/*
	if ( vMouseX + vCurRightBuf + pGanttChartObj.vTool.offsetWidth > vViewportX )
	{
		if ( vMouseX - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth < 0) vNewX = vScrollPos.x ;
		else vNewX = vMouseX + vScrollPos.x - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth ;
	}
	else vNewX = vMouseX + vScrollPos.x + vCurRightBuf ;
	*/

	/* Code for positioned left of the mouse by default */
	if ( vMouseX - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth < 0)
	{
		if ( vMouseX + vCurRightBuf + pGanttChartObj.vTool.offsetWidth > vViewportX ) vNewX = vScrollPos.x ;
		else vNewX = vMouseX + vScrollPos.x + vCurRightBuf ;
	}
	else vNewX = vMouseX + vScrollPos.x - vCurLeftBuf - pGanttChartObj.vTool.offsetWidth ;

	/* Code for positioned below the mouse by default */
	if ( vMouseY + vCurBotBuf + pGanttChartObj.vTool.offsetHeight > vViewportY )
	{
		if (vMouseY - vCurTopBuf - pGanttChartObj.vTool.offsetHeight < 0) vNewY = vScrollPos.y ;
		else vNewY = vMouseY + vScrollPos.y - vCurTopBuf - pGanttChartObj.vTool.offsetHeight ;
	}
	else vNewY = vMouseY + vScrollPos.y + vCurBotBuf ;

	/* Code for positioned above the mouse by default */
	/*
	if ( vMouseY - vCurTopBuf - pGanttChartObj.vTool.offsetHeight < 0)
	{
		if ( vMouseY + vCurBotBuf + pGanttChartObj.vTool.offsetHeight > vViewportY ) vNewY = vScrollPos.y ;
		else vNewY = vMouseY + vScrollPos.y + vCurBotBuf ;
	}
	else vNewY = vMouseY + vScrollPos.y - vCurTopBuf - pGanttChartObj.vTool.offsetHeight ;
	*/

	if (pGanttChartObj.getUseMove())
	{
		clearInterval(pGanttChartObj.vTool.moveInterval);
		pGanttChartObj.vTool.moveInterval = setInterval(function(){JSGantt.moveToolTip(vNewX, vNewY, pGanttChartObj.vTool, pTimer)},pTimer);
	}
	else
	{
		pGanttChartObj.vTool.style.left = vNewX +'px';
		pGanttChartObj.vTool.style.top = vNewY +'px';
	}
}

JSGantt.showToolTip = function(pGanttChartObj, e, pContents, pWidth, pContType, pTimer){
	var vDivId = 'JSGanttToolTip';
	var vMaxW = 500;
	var vMaxAlpha = 100;

	if(pGanttChartObj.getUseToolTip())
	{
		if(pGanttChartObj.vTool == null){
			pGanttChartObj.vTool = document.createElement('div');
			pGanttChartObj.vTool.setAttribute('id',vDivId);
			pGanttChartObj.vTool.vToolCont = document.createElement('div');
			pGanttChartObj.vTool.vToolCont.setAttribute('id',vDivId + 'cont');
			pGanttChartObj.vTool.vToolCont.setAttribute('showing','');
			pGanttChartObj.vTool.appendChild(pGanttChartObj.vTool.vToolCont);
			document.body.appendChild(pGanttChartObj.vTool);
			pGanttChartObj.vTool.style.opacity = 0;
			pGanttChartObj.vTool.setAttribute('currentOpacity',0);
			pGanttChartObj.vTool.setAttribute('fadeIncrement',10);
			pGanttChartObj.vTool.setAttribute('moveSpeed',10);
			pGanttChartObj.vTool.style.filter = 'alpha(opacity=0)';
			pGanttChartObj.vTool.style.display = 'none'
			pGanttChartObj.vTool.style.left = Math.floor(((e)?e.clientX:window.event.clientX)/2)+'px';
			pGanttChartObj.vTool.style.top = Math.floor(((e)?e.clientY:window.event.clientY)/2)+'px';
			JSGantt.addListener( 'mouseover', function () { clearTimeout(pGanttChartObj.vTool.delayTimeout); }, pGanttChartObj.vTool );
			JSGantt.addListener( 'mouseout', function () { JSGantt.delayedHide(pGanttChartObj, pGanttChartObj.vTool, pTimer); }, pGanttChartObj.vTool );
		}
		clearTimeout(pGanttChartObj.vTool.delayTimeout);
		if(pGanttChartObj.vTool.vToolCont.getAttribute('showing') != pContents || pGanttChartObj.vTool.style.display != 'block')
		{
			if ( pGanttChartObj.vTool.vToolCont.getAttribute('showing') == pContents )
			{
				pGanttChartObj.vTool.foundContent=true;
			}
			else
			{
				pGanttChartObj.vTool.vToolCont.setAttribute('showing',pContents);

				if (pContType == 'id')
				{
					if (JSGantt.findObj(pContents))
					{
						pGanttChartObj.vTool.vToolCont.innerHTML = JSGantt.findObj(pContents).innerHTML;
						// as we are allowing arbitrary HTML we should remove any tag ids to prevent duplication
						JSGantt.stripIds(pGanttChartObj.vTool.vToolCont);
						pGanttChartObj.vTool.foundContent=true;
					}
					else
					{
						pGanttChartObj.vTool.foundContent=false;
					}
				}
				else
				{
					pGanttChartObj.vTool.vToolCont.innerHTML = pContents;
					pGanttChartObj.vTool.foundContent=true;
				}
			}

			if ( pGanttChartObj.vTool.foundContent )
			{
				pGanttChartObj.vTool.style.display = 'block';
				// Rather than follow the mouse just have it stay put
				JSGantt.updateFlyingObj(e, pGanttChartObj, pTimer);
				pGanttChartObj.vTool.style.width = pWidth ? pWidth + 'px' : 'auto';
				if(!pWidth && JSGantt.isIE()){
					pGanttChartObj.vTool.style.width = pGanttChartObj.vTool.offsetWidth;
				}
				if(pGanttChartObj.vTool.offsetWidth > vMaxW){pGanttChartObj.vTool.style.width = vMaxW + 'px'}
				h = parseInt(pGanttChartObj.vTool.offsetHeight);
				if (pGanttChartObj.getUseFade())
				{
					clearInterval(pGanttChartObj.vTool.fadeInterval);
					pGanttChartObj.vTool.fadeInterval = setInterval(function(){JSGantt.fadeToolTip(1, pGanttChartObj.vTool, vMaxAlpha)},pTimer);
				}
				else
				{
					pGanttChartObj.vTool.style.opacity = vMaxAlpha * .01;
					pGanttChartObj.vTool.style.filter = 'alpha(opacity=' + vMaxAlpha + ')';
				}
			}
		}
		else
		{
			// just make sure it's still visible
			if (pGanttChartObj.getUseFade())
			{
				clearInterval(pGanttChartObj.vTool.fadeInterval);
				pGanttChartObj.vTool.fadeInterval = setInterval(function(){JSGantt.fadeToolTip(1, pGanttChartObj.vTool, vMaxAlpha)},pTimer);
			}
			else
			{
				pGanttChartObj.vTool.style.opacity = vMaxAlpha * .01;
				pGanttChartObj.vTool.style.filter = 'alpha(opacity=' + vMaxAlpha + ')';
			}
		}
	}
}


JSGantt.stripIds = function(pNode){
	for(var i=0; i < pNode.childNodes.length; i++)
	{
		if ('removeAttribute' in pNode.childNodes[i]) pNode.childNodes[i].removeAttribute('id');
		if (pNode.childNodes[i].hasChildNodes()) JSGantt.stripIds(pNode.childNodes[i]);
	}
}

JSGantt.stripUnwanted = function(pNode){
	var vAllowedTags = new Array('#text','p','br','ul','ol','li','div','span','img');
	for(var i=0; i < pNode.childNodes.length; i++)
	{
		/* versions of IE < 9 don't support indexOf on arrays so add trailing comma to the joined array and lookup value to stop substring matches */
		if ((vAllowedTags.join().toLowerCase() + ',').indexOf(pNode.childNodes[i].nodeName.toLowerCase() + ',') ==-1 )
		{
			pNode.replaceChild(document.createTextNode(pNode.childNodes[i].outerHTML), pNode.childNodes[i]);
		}
		if (pNode.childNodes[i].hasChildNodes()) JSGantt.stripUnwanted(pNode.childNodes[i]);
	}
}

JSGantt.delayedHide = function(pGanttChartObj, pTool, pTimer){
	var vDelay = 1500;
	pTool.delayTimeout = setTimeout(function(){JSGantt.hideToolTip(pGanttChartObj, pTool, pTimer)}, vDelay)
}



JSGantt.hideToolTip = function(pGanttChartObj, pTool, pTimer){
	if (pGanttChartObj.getUseFade())
	{
		clearInterval(pTool.fadeInterval);
		pTool.fadeInterval = setInterval(function(){JSGantt.fadeToolTip(-1, pTool, 0)}, pTimer);
	}
	else pTool.style.display = 'none';
}


JSGantt.fadeToolTip = function(pDirection, pTool, pMaxAlpha){
	var vIncrement = parseInt(pTool.getAttribute('fadeIncrement'));
	var vAlpha = pTool.getAttribute('currentOpacity');
	var vCurAlpha = parseInt(vAlpha);
	if((vCurAlpha != pMaxAlpha && pDirection == 1) || (vCurAlpha != 0 && pDirection == -1)){
		var i = vIncrement;
		if(pMaxAlpha - vCurAlpha < vIncrement && pDirection == 1){
			i = pMaxAlpha - vCurAlpha;
		}else if(vAlpha < vIncrement && pDirection == -1){
			i = vCurAlpha;
		}
		vAlpha = vCurAlpha + (i * pDirection);
		pTool.style.opacity = vAlpha * .01;
		pTool.style.filter = 'alpha(opacity=' + vAlpha + ')';
		pTool.setAttribute('currentOpacity', vAlpha);
	}else{
		clearInterval(pTool.fadeInterval);
		if(pDirection == -1){pTool.style.display = 'none';}
	}
}


JSGantt.moveToolTip = function(pNewX, pNewY, pTool){
	var vSpeed = parseInt(pTool.getAttribute('moveSpeed'));
	vOldX = parseInt(pTool.style.left);
	vOldY = parseInt(pTool.style.top);

	if ( pTool.style.display != 'block' )
	{
		pTool.style.left = pNewX +'px';
		pTool.style.top = pNewY +'px';
		clearInterval(pTool.moveInterval);
	}
	else
	{
		if(pNewX != vOldX && pNewY != vOldY)
		{
			vOldX += Math.ceil((pNewX - vOldX)/vSpeed);
			vOldY += Math.ceil((pNewY - vOldY)/vSpeed);
			pTool.style.left = vOldX +'px';
			pTool.style.top = vOldY +'px';
		}
		else
		{
			clearInterval(pTool.moveInterval);
		}
	}
}


JSGantt.getZoomFactor = function() {
	var vFactor = 1;
	if (document.body.getBoundingClientRect)
	{
		// rect is only in physical pixel size in IE before version 8
		var vRect = document.body.getBoundingClientRect ();
		var vPhysicalW = vRect.right - vRect.left;
		var vLogicalW = document.body.offsetWidth;

		// the zoom level is always an integer percent value
		vFactor = Math.round ((vPhysicalW / vLogicalW) * 100) / 100;
	}
	return vFactor;
}

JSGantt.getScrollPositions = function() {
	if ('pageXOffset' in window)	// all browsers, except IE before version 9
	{
		var vScrollLeft =  window.pageXOffset;
		var vScrollTop = window.pageYOffset;
	}
	else	// Internet Explorer before version 9
	{
		var vZoomFactor = JSGantt.getZoomFactor ();
		var vScrollLeft = Math.round (document.documentElement.scrollLeft / vZoomFactor);
		var vScrollTop = Math.round (document.documentElement.scrollTop / vZoomFactor);
	}
	return {x : vScrollLeft, y : vScrollTop};
}


JSGantt.getOffset = function(pStartDate, pEndDate, pColWidth, pFormat)
{
	var vMonthDaysArr = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	var curTaskStart = new Date(pStartDate.getTime());
	var curTaskEnd =  new Date(pEndDate.getTime());
	var vTaskRightPx = 0;

	var vTaskRight = (curTaskEnd.getTime() - curTaskStart.getTime()) / (24 * 60 * 60 * 1000); // length of task in days
	if(pFormat == 'day')
	{
		vTaskRightPx = Math.ceil(vTaskRight * (pColWidth + 1));
	}
	else if(pFormat == 'week')
	{
		vTaskRightPx = Math.ceil((vTaskRight * (pColWidth + 1))/7);
	}
	else if(pFormat == 'month')
	{
		var vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
		var vPosTmpDate = new Date(curTaskEnd.getTime());
		vPosTmpDate.setDate(curTaskStart.getDate());
		var vDaysCrctn = (curTaskEnd.getTime()- vPosTmpDate.getTime())/ (24 * 60 * 60 * 1000);

		vTaskRightPx = Math.ceil((vMonthsDiff * (pColWidth + 1)) + (vDaysCrctn * (pColWidth/vMonthDaysArr[curTaskEnd.getMonth()])));
	}
	else if(pFormat == 'quarter')
	{
		var vMonthsDiff = (12 * (curTaskEnd.getFullYear() - curTaskStart.getFullYear())) + (curTaskEnd.getMonth() - curTaskStart.getMonth());
		var vPosTmpDate = new Date(curTaskEnd.getTime());
		vPosTmpDate.setDate(curTaskStart.getDate());
		var vDaysCrctn = (curTaskEnd.getTime()- vPosTmpDate.getTime())/ (24 * 60 * 60 * 1000);

		vTaskRightPx = Math.ceil((vMonthsDiff * ((pColWidth + 1)/3)) + (vDaysCrctn * (pColWidth/90)));
	}
	return vTaskRightPx;
}


// Recursively process task tree ... set min, max dates of parent tasks and identfy task level.
JSGantt.processRows = function(pList, pID, pRow, pLevel, pOpen, pUseSort)
{

	var vMinDate = new Date();
	var vMaxDate = new Date();
	var vMinSet  = 0;
	var vMaxSet  = 0;
	var vList    = pList;
	var vLevel   = pLevel;
	var i        = 0;
	var vNumKid  = 0;
	var vCompSum = 0;
	var vVisible = pOpen;

	for(i = 0; i < pList.length; i++)
	{
		if (pList[i].getToDelete())
		{
			pList.splice(i,1);
			i--;
		}
	}

	for(i = 0; i < pList.length; i++)
	{
		if(pList[i].getParent() == pID)
		{
			vVisible = pOpen;
			pList[i].setVisible(vVisible);
			if(vVisible==1 && pList[i].getOpen() == 0)
			vVisible = 0;

			pList[i].setLevel(vLevel);
			vNumKid++;

			if(pList[i].getGroup() == 1)
			{
				JSGantt.processRows(vList, pList[i].getID(), i, vLevel+1, vVisible, 0);
			}

			if( vMinSet==0 || pList[i].getStart() < vMinDate)
			{
				vMinDate = pList[i].getStart();
				vMinSet = 1;
			}

			if( vMaxSet==0 || pList[i].getEnd() > vMaxDate)
			{
				vMaxDate = pList[i].getEnd();
				vMaxSet = 1;
			}

			vCompSum += pList[i].getCompVal();
		}
	}

	if(pRow >= 0)
	{
		pList[pRow].setStart(vMinDate);
		pList[pRow].setEnd(vMaxDate);
		pList[pRow].setNumKid(vNumKid);
		pList[pRow].setCompVal(Math.ceil(vCompSum/vNumKid));
	}

	if (pID == 0 && pUseSort == 1)
	{
		JSGantt.sortTasks(pList, 0, 0);
		pList.sort(function(a,b){return a.getSortIdx()-b.getSortIdx();});
	}
}

JSGantt.sortTasks = function (pList, pID, pIdx)
{
	var sortIdx = pIdx;
	var sortArr = new Array();

	for(var i=0; i < pList.length; i++)
	{
		if(pList[i].getParent() == pID)sortArr.push(pList[i]);
	}

	if (sortArr.length > 0)
	{
		sortArr.sort(function(a,b){
									var i=a.getStart().getTime() - b.getStart().getTime();
									if (i==0) return a.getEnd().getTime() - b.getEnd().getTime();
									else return i;
									})
	}

	for (var j=0; j < sortArr.length; j++)
	{
		for(i = 0; i < pList.length; i++)
		{
			if(pList[i].getID() == sortArr[j].getID())
			{
				pList[i].setSortIdx(sortIdx++);
				sortIdx = JSGantt.sortTasks(pList, pList[i].getID(), sortIdx)
			}
		}
	}

	return sortIdx;
}

// Used to determine the minimum date of all tasks and set lower bound based on forma
JSGantt.getMinDate = function getMinDate(pList, pFormat)
{

	var vDate = new Date();

	vDate.setTime(Date.parse(pList[0].getStart()));

	// Parse all Task End dates to find min
	for(i = 0; i < pList.length; i++)
	{
		if(Date.parse(pList[i].getStart()) < Date.parse(vDate))
		vDate.setTime(Date.parse(pList[i].getStart()));
	}

	// Adjust min date to specific format boundaries (first of week or first of month)
	if (pFormat=='day')
	{
		vDate.setDate(vDate.getDate() - 1);
		while(vDate.getDay() % 7 != 1)
		{
			vDate.setDate(vDate.getDate() - 1);
		}
	}
	else if (pFormat=='week')
	{
		vDate.setDate(vDate.getDate() - 1);
		while(vDate.getDay() % 7 != 1)
		{
			vDate.setDate(vDate.getDate() - 1);
		}
	}
	else if (pFormat=='month')
	{
		while(vDate.getDate() > 1)
		{
			vDate.setDate(vDate.getDate() - 1);
		}
	}
	else if (pFormat=='quarter')
	{
		if( vDate.getMonth()==0 || vDate.getMonth()==1 || vDate.getMonth()==2 )
			vDate.setFullYear(vDate.getFullYear(), 0, 1);
		else if( vDate.getMonth()==3 || vDate.getMonth()==4 || vDate.getMonth()==5 )
			vDate.setFullYear(vDate.getFullYear(), 3, 1);
		else if( vDate.getMonth()==6 || vDate.getMonth()==7 || vDate.getMonth()==8 )
			vDate.setFullYear(vDate.getFullYear(), 6, 1);
		else if( vDate.getMonth()==9 || vDate.getMonth()==10 || vDate.getMonth()==11 )
			vDate.setFullYear(vDate.getFullYear(), 9, 1);
	}

	return(vDate);
}


// Used to determine the minimum date of all tasks and set lower bound based on format

JSGantt.getMaxDate = function (pList, pFormat)
{
	var vDate = new Date();

	vDate.setTime(Date.parse(pList[0].getEnd()));

	// Parse all Task End dates to find max
	for(i = 0; i < pList.length; i++)
	{
		if(Date.parse(pList[i].getEnd()) > Date.parse(vDate))
		{
			vDate.setTime(Date.parse(pList[i].getEnd()));
		}
	}

	// Adjust max date to specific format boundaries (end of week or end of month)
	if (pFormat=='day')
	{
		vDate.setDate(vDate.getDate() + 1);

		while(vDate.getDay() % 7 != 0)
		{
			vDate.setDate(vDate.getDate() + 1);
		}
	}
	else if (pFormat=='week')
	{
		//For weeks, what is the last logical boundary?
		vDate.setDate(vDate.getDate() + 1);

		while(vDate.getDay() % 7 != 0)
		{
			vDate.setDate(vDate.getDate() + 1);
		}
	}
	else if (pFormat=='month')
	{
		// Set to last day of current Month
		while(vDate.getDay() > 1)
		{
			vDate.setDate(vDate.getDate() + 1);
		}

		vDate.setDate(vDate.getDate() - 1);
	}
	else if (pFormat=='quarter')
	{
		// Set to last day of current Quarter
		if( vDate.getMonth()==0 || vDate.getMonth()==1 || vDate.getMonth()==2 )
			vDate.setFullYear(vDate.getFullYear(), 2, 31);
		else if( vDate.getMonth()==3 || vDate.getMonth()==4 || vDate.getMonth()==5 )
			vDate.setFullYear(vDate.getFullYear(), 5, 30);
		else if( vDate.getMonth()==6 || vDate.getMonth()==7 || vDate.getMonth()==8 )
			vDate.setFullYear(vDate.getFullYear(), 8, 30);
		else if( vDate.getMonth()==9 || vDate.getMonth()==10 || vDate.getMonth()==11 )
			vDate.setFullYear(vDate.getFullYear(), 11, 31);
	}

	return(vDate);
}



// This function finds the document id of the specified objec

JSGantt.findObj = function (theObj, theDoc)
{
	var p, i, foundObj;

	if(!theDoc) theDoc = document;

	if( (p = theObj.indexOf("?")) > 0 && parent.frames.length)
	{
		theDoc = parent.frames[theObj.substring(p+1)].document;
		theObj = theObj.substring(0,p);
	}

	if(!(foundObj = theDoc[theObj]) && theDoc.all) foundObj = theDoc.all[theObj];

	for (i=0; !foundObj && i < theDoc.forms.length; i++)
	{
		foundObj = theDoc.forms[i][theObj];
	}

	for(i=0; !foundObj && theDoc.layers && i < theDoc.layers.length; i++)
	{
		foundObj = JSGantt.findObj(theObj,theDoc.layers[i].document);
	}

	if(!foundObj && document.getElementById) foundObj = document.getElementById(theObj);

	return foundObj;
}

JSGantt.changeFormat = function(pFormat,ganttObj)
{
	if(ganttObj)
	{
		ganttObj.setFormat(pFormat);
	}
	else
	{
		alert('Chart undefined');
	}
}

// Function to open/close and hide/show children of specified task
JSGantt.folder= function (pID,ganttObj)
{
	var vList = ganttObj.getList();

	ganttObj.clearDependencies(); // clear these first so slow rendering doesn't look odd

	for(i = 0; i < vList.length; i++)
	{
		if(vList[i].getID() == pID)
		{
			if( vList[i].getOpen() == 1 )
			{
				vList[i].setOpen(0);
				JSGantt.hide(pID,ganttObj);

				if (JSGantt.isIE())
					JSGantt.findObj('group_'+pID).innerText = '+';
				else
					JSGantt.findObj('group_'+pID).textContent = '+';
			}
			else
			{
				vList[i].setOpen(1);

				JSGantt.show(pID, 1, ganttObj);

				if (JSGantt.isIE())
					JSGantt.findObj('group_'+pID).innerText = '-';
				else
					JSGantt.findObj('group_'+pID).textContent = '-';
			}
		}
	}
	ganttObj.DrawDependencies();
}

JSGantt.hide= function (pID,ganttObj)
{
	var vList = ganttObj.getList();
	var vID   = 0;

	for(var i = 0; i < vList.length; i++)
	{
		if(vList[i].getParent() == pID)
		{
			vID = vList[i].getID();
			// it's unlikely but if the task list has been updated since
			// the chart was drawn some of the rows may not exist
			if (JSGantt.findObj('child_' + vID)) JSGantt.findObj('child_' + vID).style.display = "none";
			if (JSGantt.findObj('childrow_' + vID)) JSGantt.findObj('childrow_' + vID).style.display = "none";
			vList[i].setVisible(0);
			if(vList[i].getGroup() == 1)
			JSGantt.hide(vID,ganttObj);
		}
	}
}

// Function to show children of specified task
JSGantt.show =  function (pID, pTop, ganttObj)
{
	var vList = ganttObj.getList();
	var vID   = 0;

	for(var i = 0; i < vList.length; i++)
	{
		if(vList[i].getParent() == pID)
		{
			vID = vList[i].getID();
			if(pTop == 1)
			{
				if (JSGantt.isIE())
				{ // IE;

					if( JSGantt.findObj('group_'+pID).innerText == '+')
					{
						// it's unlikely but if the task list has been updated since
						// the chart was drawn some of the rows may not exist
						if (JSGantt.findObj('child_' + vID)) JSGantt.findObj('child_'+vID).style.display = "";
						if (JSGantt.findObj('childrow_' + vID)) JSGantt.findObj('childrow_'+vID).style.display = "";
						vList[i].setVisible(1);
					}
				}
				else
				{

					if( JSGantt.findObj('group_'+pID).textContent == '+')
					{
						if (JSGantt.findObj('child_' + vID)) JSGantt.findObj('child_'+vID).style.display = "";
						if (JSGantt.findObj('childrow_' + vID)) JSGantt.findObj('childrow_'+vID).style.display = "";
						vList[i].setVisible(1);
					}
				}
			}
			else
			{

				if (JSGantt.isIE())
				{ // IE;
					if( JSGantt.findObj('group_'+pID).innerText == '-')
					{
						if (JSGantt.findObj('child_' + vID)) JSGantt.findObj('child_'+vID).style.display = "";
						if (JSGantt.findObj('childrow_' + vID)) JSGantt.findObj('childrow_'+vID).style.display = "";
						vList[i].setVisible(1);
					}
				}
				else
				{

					if( JSGantt.findObj('group_'+pID).textContent == '-')
					{
						if (JSGantt.findObj('child_' + vID)) JSGantt.findObj('child_'+vID).style.display = "";
						if (JSGantt.findObj('childrow_' + vID)) JSGantt.findObj('childrow_'+vID).style.display = "";
						vList[i].setVisible(1);
					}
				}
			}
			if(vList[i].getGroup() == 1)
			JSGantt.show(vID, 0,ganttObj);

		}
	}
}

// function to open window to display task link
JSGantt.taskLink = function(pRef,pWidth,pHeight)
{

	if(pWidth)  vWidth =pWidth;  else vWidth =400;
	if(pHeight) vHeight=pHeight; else vHeight=400;

	var OpenWindow=window.open(pRef, "newwin", "height="+vHeight+",width="+vWidth);
}

JSGantt.parseDateStr = function(pDateStr,pFormatStr)
{
	var vDate = null;
	var vDateParts = pDateStr.split(/[^0-9]/);
	while(vDateParts.length < 5)vDateParts.push(0);

	switch(pFormatStr)
	{
		case 'mm/dd/yyyy':
		vDate = new Date(vDateParts[2], vDateParts[0] - 1, vDateParts[1], vDateParts[3], vDateParts[4]);
		break;
		case 'dd/mm/yyyy':
		vDate = new Date(vDateParts[2], vDateParts[1] - 1, vDateParts[0], vDateParts[3], vDateParts[4]);
		break;
		case 'yyyy-mm-dd':
		vDate = new Date(vDateParts[0], vDateParts[1] - 1, vDateParts[2], vDateParts[3], vDateParts[4]);
		break;
	}

	return(vDate);
}

JSGantt.formatDateStr = function( pDate, pDateFormatArr )
{
	var vDateStr = '';

	vYear2Str = pDate.getFullYear().toString().substring(2,4);
	vMonthStr = (pDate.getMonth()+1) + '';
	vMonthArr = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
	vDayArr = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");

	for (var i=0; i < pDateFormatArr.length; i++ )
	{
		switch( pDateFormatArr[i] )
		{
			case 'dd':
				if (pDate.getDate() < 10) vDateStr += '0'; // now fall through
			case 'd':
				vDateStr += pDate.getDate();
				break;
			case 'day':
				vDateStr += vDayArr[pDate.getDay()].substr(0,3);
				break;
			case 'DAY':
				vDateStr += vDayArr[pDate.getDay()];
				break;
			case 'mm':
				if (vMonthStr < 10) vDateStr += '0'; // now fall through
			case 'm':
				vDateStr += vMonthStr;
				break;
			case 'mon':
				vDateStr += vMonthArr[pDate.getMonth()].substr(0,3);
				break;
			case 'month':
				vDateStr += vMonthArr[pDate.getMonth()];
				break;
			case 'yyyy':
				vDateStr += pDate.getFullYear();
				break;
			case 'yy':
				vDateStr += vYear2Str;
				break;
			case 'qq':
				vDateStr += 'Q'; // now fall through
			case 'q':
				vDateStr += Math.floor(pDate.getMonth()/3)+1;
				break;
			case 'ww':
				if (JSGantt.getIsoWeek(pDate) < 10) vDateStr += '0'; // now fall through
			case 'w':
				vDateStr += JSGantt.getIsoWeek(pDate);
				break;
			case 'week':
				vDateStr += JSGantt.getIsoWeek(pDate);
				var vYear = pDate.getFullYear();
				var vDayOfWeek = ( pDate.getDay() == 0 )? 7 : pDate.getDay();
				if ( vWeekNum >= 52 && vMonthStr == 1 ) vYear--;
				if ( vWeekNum == 1 && vMonthStr == 12 ) vYear++;
				if (vWeekNum < 10) vWeekNum = '0' + vWeekNum;

				vDateStr += vYear + '-W' + vWeekNum + '-' + vDayOfWeek;
				break;
			default:
				vDateStr += pDateFormatArr[i];
				break;
		}
	}
	return vDateStr;
}

JSGantt.parseDateFormatStr = function( pFormatStr )
{
	var vDateStr = '';
	var vComponantStr = '';
	var vCurrChar = '';
	var vSeparators = new RegExp("[\/\\ -.,'\"]");
	var vDateFormatArray = new Array();

	for (var i=0; i < pFormatStr.length; i++ )
	{
		vCurrChar = pFormatStr.charAt(i);
		if ( (vCurrChar.match(vSeparators) ) || (i + 1 == pFormatStr.length) ) // separator or end of string
		{
			if ( (i + 1 == pFormatStr.length) && ( !(vCurrChar.match(vSeparators) ) ) ) // at end of string add any non-separator chars to the current componan
			{
				vComponantStr += vCurrChar;
			}

			vDateFormatArray.push( vComponantStr );

			if ( vCurrChar.match(vSeparators) )
			{
				vDateFormatArray.push( vCurrChar );
			}

			vComponantStr = '';
		}
		else
		{
			vComponantStr += vCurrChar;
		}

	}
	return vDateFormatArray;
}

JSGantt.parseXML = function(pFile,pGanttVar)
{
	if (window.XMLHttpRequest) {
	   xhttp = new XMLHttpRequest();
	} else {    // IE 5/6
	   xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

//	xhttp.overrideMimeType('text/xml');

	xhttp.open("GET", pFile, false);
	xhttp.send(null);
	xmlDoc = xhttp.responseXML;

	JSGantt.AddXMLTask(pGanttVar);

	xmlDoc=null; // a little tidying
	Task = null;
}

JSGantt.AddXMLTask = function(pGanttVar)
{
	Task=xmlDoc.getElementsByTagName("task");

	var n = xmlDoc.documentElement.childNodes.length;	// the number of tasks. IE gets this right, but mozilla add extra ones (Whitespace)

	for(var i=0;i<n;i++)
	{
		// optional parameters may not have an entry (Whitespace from mozilla also returns an error )
		// Task ID must NOT be zero otherwise it will be skipped
		try { pID = Task[i].getElementsByTagName("pID")[0].childNodes[0].nodeValue;
		} catch (error)
		{pID =0;}
		pID *= 1;	// make sure that these are numbers rather than strings in order to make jsgantt.js behave as expected.

		if(pID!=0)
		{
			try { pName = Task[i].getElementsByTagName("pName")[0].childNodes[0].nodeValue;
			} catch (error)
			{pName ="No Task Name";}			// If there is no corresponding entry in the XML file the set a default.

			try { pClass = Task[i].getElementsByTagName("pClass")[0].childNodes[0].nodeValue;
			} catch (error)
			{pClass ="ggroupblack";}

			try { pParent = Task[i].getElementsByTagName("pParent")[0].childNodes[0].nodeValue;
			} catch (error)
			{pParent =0;}
			pParent *= 1;

			try { pStart = Task[i].getElementsByTagName("pStart")[0].childNodes[0].nodeValue;
			} catch (error)
			{pStart ="";}

			try { pEnd = Task[i].getElementsByTagName("pEnd")[0].childNodes[0].nodeValue;
			} catch (error)
			{ pEnd ="";}

			try { pLink = Task[i].getElementsByTagName("pLink")[0].childNodes[0].nodeValue;
			} catch (error)
			{ pLink ="";}

			try { pMile = Task[i].getElementsByTagName("pMile")[0].childNodes[0].nodeValue;
			} catch (error)
			{ pMile=0;}
			pMile *= 1;

			try { pRes = Task[i].getElementsByTagName("pRes")[0].childNodes[0].nodeValue;
			} catch (error)
			{ pRes ="";}

			try { pComp = Task[i].getElementsByTagName("pComp")[0].childNodes[0].nodeValue;
			} catch (error)
			{pComp =0;}
			pComp *= 1;

			try { pGroup = Task[i].getElementsByTagName("pGroup")[0].childNodes[0].nodeValue;
			} catch (error)
			{pGroup =0;}
			pGroup *= 1;

			try { pOpen = Task[i].getElementsByTagName("pOpen")[0].childNodes[0].nodeValue;
			} catch (error)
			{ pOpen =1;}
			pOpen *= 1;

			try { pDepend = Task[i].getElementsByTagName("pDepend")[0].childNodes[0].nodeValue;
			} catch (error)
			{ pDepend ='';}
			if (pDepend.length==0)
			{pDepend=''} // need this to draw the dependency lines

			try { pCaption = Task[i].getElementsByTagName("pCaption")[0].childNodes[0].nodeValue;
			} catch (error)
			{ pCaption ="";}

			try { pNotes = Task[i].getElementsByTagName("pNotes")[0].childNodes[0].nodeValue;
			} catch (error)
			{ pNotes ="";}


			// Finally add the task
			pGanttVar.AddTaskItem(new JSGantt.TaskItem(pID , pName, pStart, pEnd, pClass,  pLink, pMile, pRes,  pComp, pGroup, pParent, pOpen, pDepend, pCaption, pNotes));
		}
	}
}


JSGantt.benchMark = function(pItem)
{
	var vEndTime=new Date().getTime();
	alert(pItem + ': Elapsed time: '+((vEndTime-vBenchTime)/1000)+' seconds.');
	vBenchTime=new Date().getTime();
}

JSGantt.getIsoWeek = function(pDate){
    // We have to compare against the monday of the first week of the year containing 04 jan *not* 01/01
    // 60*60*24*1000 = 86400000
    var dayMiliseconds = 86400000;
    var keyDay = new Date(pDate.getFullYear(),0,4,0,0,0);
    var keyDayOfWeek = (keyDay.getDay()==0) ? 6 : keyDay.getDay() - 1; // define monday as 0
	var firstMondayYearTime = keyDay.getTime() - (keyDayOfWeek * dayMiliseconds);
	var thisDate = new Date(pDate.getFullYear(), pDate.getMonth(),pDate.getDate(),0,0,0); // This at 00:00:00
    var thisTime = thisDate.getTime();
	var daysFromFirstMonday = Math.round(((thisTime - firstMondayYearTime) / dayMiliseconds));
	var lastWeek=99;
	var thisWeek=99;

    var firstMondayYear = new Date(firstMondayYearTime);

    // We add 1 to "daysFromFirstMonday" because if "daysFromFirstMonday" is *7,
    // then 7/7 = 1, and as we are 7 days from first monday,
    // we should be in week number 2 instead of week number 1 (7/7=1)
	thisWeek = Math.ceil((daysFromFirstMonday+1)/7);

	if ( thisWeek <= 0 )
	{
		// Technically we are in the last week of last year, we need to see if this was week 52 or 53.
		// Recursively call this method with 31 dec from last year
		thisWeek = JSGantt.getIsoWeek(new Date(pDate.getFullYear()-1,11,31,0,0,0));
	}
	else if (thisWeek == 53)
	{
		// need to check if we should be in week 1 of the next year.  Years with 53 weeks can be defined
		// as those in which either 1 January or 31 December is a Thursday (the day of the week will be
		// the same for both dates except in a leap year)
		if ( (new Date(pDate.getFullYear(),0,1,0,0,0)).getDay() != 4 && (new Date(pDate.getFullYear(),11,31,0,0,0)).getDay() != 4 ) thisWeek = 1;
	}

    return thisWeek;
}

JSGantt.addListener = function ( eventName, handler, control )
{
	// Check if control is a string
	if (control === String(control)) control = JSGantt.findObj(control);

	if(control.addEventListener) //Standard W3C
	{
		return control.addEventListener(eventName, handler, false);
	}
	else if (control.attachEvent) //IExplore
	{
		return control.attachEvent("on"+eventName, handler);
	}
	else
	{
		return false;
	}
}

JSGantt.addTootltipListeners = function(pGanttChart, pObj)
{
	var vTimer = 20;
	JSGantt.addListener( 'mouseover', function (e) { JSGantt.showToolTip(pGanttChart, e, 'tt' + pObj.id, null, 'id', vTimer); }, pObj );
	JSGantt.addListener( 'mouseout', function (e) { JSGantt.delayedHide(pGanttChart, pGanttChart.vTool, vTimer); }, pObj );
}

JSGantt.addThisRowListeners = function(pGanttChart, pObj1, pObj2)
{
	JSGantt.addListener( 'mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj1 );
	JSGantt.addListener( 'mouseover', function () { pGanttChart.mouseOver(pObj1, pObj2); }, pObj2 );
	JSGantt.addListener( 'mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj1 );
	JSGantt.addListener( 'mouseout', function () { pGanttChart.mouseOut(pObj1, pObj2); }, pObj2 );
}

JSGantt.addFolderListeners = function(pGanttChart, pObj, pID)
{
	JSGantt.addListener( 'click', function () { JSGantt.folder(pID, pGanttChart); }, pObj );
}

JSGantt.addFormatListeners = function(pGanttChart, pFormat, pId)
{
	JSGantt.addListener( 'click', function () { JSGantt.changeFormat(pFormat, pGanttChart); }, JSGantt.findObj(pId) );
}

JSGantt.addScrollListeners = function()
{
	JSGantt.addListener( 'scroll', function () { JSGantt.findObj('rightside').scrollTop = JSGantt.findObj('leftside').scrollTop; }, JSGantt.findObj('leftside') );
	JSGantt.addListener( 'scroll', function () { JSGantt.findObj('leftside').scrollTop = JSGantt.findObj('rightside').scrollTop; }, JSGantt.findObj('rightside') );
	JSGantt.addListener( 'scroll', function () { JSGantt.findObj('rightsideh').scrollLeft = JSGantt.findObj('rightside').scrollLeft; }, JSGantt.findObj('rightside') );
	JSGantt.addListener( 'scroll', function () { JSGantt.findObj('rightside').scrollLeft = JSGantt.findObj('rightsideh').scrollLeft; }, JSGantt.findObj('rightsideh') );
	JSGantt.addListener( 'resize', function () { JSGantt.findObj('rightsideh').scrollLeft = JSGantt.findObj('rightside').scrollLeft; }, window );
	JSGantt.addListener( 'resize', function () { JSGantt.findObj('leftside').scrollTop = JSGantt.findObj('rightside').scrollTop; }, window );
}
