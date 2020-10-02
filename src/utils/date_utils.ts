
/**
 * DATES
 */
export const getMinDate = function (pList, pFormat, pMinDate) {
  let vDate = new Date();
  if (pList.length <= 0) return pMinDate || vDate;

  vDate.setTime((pMinDate && pMinDate.getTime()) || pList[0].getStart().getTime());

  // Parse all Task Start dates to find min
  for (let i = 0; i < pList.length; i++) {
    if (pList[i].getStart().getTime() < vDate.getTime()) vDate.setTime(pList[i].getStart().getTime());
    if (pList[i].getPlanStart() && pList[i].getPlanStart().getTime() < vDate.getTime()) vDate.setTime(pList[i].getPlanStart().getTime());
  }

  // Adjust min date to specific format boundaries (first of week or first of month)
  if (pFormat == 'day') {
    vDate.setDate(vDate.getDate() - 1);
    while (vDate.getDay() % 7 != 1) vDate.setDate(vDate.getDate() - 1);
  }
  else if (pFormat == 'week') {
    vDate.setDate(vDate.getDate() - 1);
    while (vDate.getDay() % 7 != 1) vDate.setDate(vDate.getDate() - 1);
  }
  else if (pFormat == 'month') {
    vDate.setDate(vDate.getDate() - 15);
    while (vDate.getDate() > 1) vDate.setDate(vDate.getDate() - 1);
  }
  else if (pFormat == 'quarter') {
    vDate.setDate(vDate.getDate() - 31);
    if (vDate.getMonth() == 0 || vDate.getMonth() == 1 || vDate.getMonth() == 2)
      vDate.setFullYear(vDate.getFullYear(), 0, 1);
    else if (vDate.getMonth() == 3 || vDate.getMonth() == 4 || vDate.getMonth() == 5)
      vDate.setFullYear(vDate.getFullYear(), 3, 1);
    else if (vDate.getMonth() == 6 || vDate.getMonth() == 7 || vDate.getMonth() == 8)
      vDate.setFullYear(vDate.getFullYear(), 6, 1);
    else if (vDate.getMonth() == 9 || vDate.getMonth() == 10 || vDate.getMonth() == 11)
      vDate.setFullYear(vDate.getFullYear(), 9, 1);
  }
  else if (pFormat == 'hour') {
    vDate.setHours(vDate.getHours() - 1);
    while (vDate.getHours() % 6 != 0) vDate.setHours(vDate.getHours() - 1);
  }

  if (pFormat == 'hour') vDate.setMinutes(0, 0);
  else vDate.setHours(0, 0, 0);
  return (vDate);
};

export const getMaxDate = function (pList, pFormat, pMaxDate) {
  let vDate = new Date();

  if (pList.length <= 0) return pMaxDate || vDate;

  vDate.setTime((pMaxDate && pMaxDate.getTime()) || pList[0].getEnd().getTime());

  // Parse all Task End dates to find max
  for (let i = 0; i < pList.length; i++) {
    if (pList[i].getEnd().getTime() > vDate.getTime()) vDate.setTime(pList[i].getEnd().getTime());
    if (pList[i].getPlanEnd() && pList[i].getPlanEnd().getTime() > vDate.getTime()) vDate.setTime(pList[i].getPlanEnd().getTime());
  }

  // Adjust max date to specific format boundaries (end of week or end of month)
  if (pFormat == 'day') {
    vDate.setDate(vDate.getDate() + 1);
    while (vDate.getDay() % 7 != 0) vDate.setDate(vDate.getDate() + 1);
  }
  else if (pFormat == 'week') {
    //For weeks, what is the last logical boundary?
    vDate.setDate(vDate.getDate() + 1);

    while (vDate.getDay() % 7 != 0) vDate.setDate(vDate.getDate() + 1);
  }
  else if (pFormat == 'month') {
    // Set to last day of current Month
    while (vDate.getDate() > 1) vDate.setDate(vDate.getDate() + 1);
    vDate.setDate(vDate.getDate() - 1);
  }
  else if (pFormat == 'quarter') {
    // Set to last day of current Quarter
    if (vDate.getMonth() == 0 || vDate.getMonth() == 1 || vDate.getMonth() == 2)
      vDate.setFullYear(vDate.getFullYear(), 2, 31);
    else if (vDate.getMonth() == 3 || vDate.getMonth() == 4 || vDate.getMonth() == 5)
      vDate.setFullYear(vDate.getFullYear(), 5, 30);
    else if (vDate.getMonth() == 6 || vDate.getMonth() == 7 || vDate.getMonth() == 8)
      vDate.setFullYear(vDate.getFullYear(), 8, 30);
    else if (vDate.getMonth() == 9 || vDate.getMonth() == 10 || vDate.getMonth() == 11)
      vDate.setFullYear(vDate.getFullYear(), 11, 31);
  }
  else if (pFormat == 'hour') {
    if (vDate.getHours() == 0) vDate.setDate(vDate.getDate() + 1);
    vDate.setHours(vDate.getHours() + 1);

    while (vDate.getHours() % 6 != 5) vDate.setHours(vDate.getHours() + 1);
  }
  return (vDate);
};

export const coerceDate = function (date) {
  if (date instanceof Date) {
    return date;
  } else {
    const temp = new Date(date);
    if (temp instanceof Date && !isNaN(temp.valueOf())) {
      return temp;
    }
  }
}

export const parseDateStr = function (pDateStr, pFormatStr) {
  let vDate = new Date();
  let vDateParts = pDateStr.split(/[^0-9]/);
  if (pDateStr.length >= 10 && vDateParts.length >= 3) {
    while (vDateParts.length < 5) vDateParts.push(0);

    switch (pFormatStr) {
      case 'mm/dd/yyyy':
        vDate = new Date(vDateParts[2], vDateParts[0] - 1, vDateParts[1], vDateParts[3], vDateParts[4]);
        break;
      case 'dd/mm/yyyy':
        vDate = new Date(vDateParts[2], vDateParts[1] - 1, vDateParts[0], vDateParts[3], vDateParts[4]);
        break;
      case 'yyyy-mm-dd':
        vDate = new Date(vDateParts[0], vDateParts[1] - 1, vDateParts[2], vDateParts[3], vDateParts[4]);
        break;
      case 'yyyy-mm-dd HH:MI:SS':
        vDate = new Date(vDateParts[0], vDateParts[1] - 1, vDateParts[2], vDateParts[3], vDateParts[4], vDateParts[5]);
        break;
    }
  }
  return (vDate);
};

export const formatDateStr = function (pDate, pDateFormatArr, pL) {
  // Fix on issue #303 - getXMLTask is passing null as pDates
  if (!pDate) {
    return;
  }
  let vDateStr = '';

  let vYear2Str = pDate.getFullYear().toString().substring(2, 4);
  let vMonthStr = (pDate.getMonth() + 1) + '';
  let vMonthArr = new Array(pL['january'], pL['february'], pL['march'], pL['april'], pL['maylong'], pL['june'], pL['july'], pL['august'], pL['september'], pL['october'], pL['november'], pL['december']);
  let vDayArr = new Array(pL['sunday'], pL['monday'], pL['tuesday'], pL['wednesday'], pL['thursday'], pL['friday'], pL['saturday']);
  let vMthArr = new Array(pL['jan'], pL['feb'], pL['mar'], pL['apr'], pL['may'], pL['jun'], pL['jul'], pL['aug'], pL['sep'], pL['oct'], pL['nov'], pL['dec']);
  let vDyArr = new Array(pL['sun'], pL['mon'], pL['tue'], pL['wed'], pL['thu'], pL['fri'], pL['sat']);

  for (let i = 0; i < pDateFormatArr.length; i++) {
    switch (pDateFormatArr[i]) {
      case 'dd':
        if (pDate.getDate() < 10) vDateStr += '0'; // now fall through
      case 'd':
        vDateStr += pDate.getDate();
        break;
      case 'day':
        vDateStr += vDyArr[pDate.getDay()];
        break;
      case 'DAY':
        vDateStr += vDayArr[pDate.getDay()];
        break;
      case 'mm':
        if (parseInt(vMonthStr, 10) < 10) vDateStr += '0'; // now fall through
      case 'm':
        vDateStr += vMonthStr;
        break;
      case 'mon':
        vDateStr += vMthArr[pDate.getMonth()];
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
        vDateStr += pL['qtr']; // now fall through
      case 'q':
        vDateStr += Math.floor(pDate.getMonth() / 3) + 1;
        break;
      case 'hh':
        if ((((pDate.getHours() % 12) == 0) ? 12 : pDate.getHours() % 12) < 10) vDateStr += '0'; // now fall through
      case 'h':
        vDateStr += ((pDate.getHours() % 12) == 0) ? 12 : pDate.getHours() % 12;
        break;
      case 'HH':
        if ((pDate.getHours()) < 10) vDateStr += '0'; // now fall through
      case 'H':
        vDateStr += (pDate.getHours());
        break;
      case 'MI':
        if (pDate.getMinutes() < 10) vDateStr += '0'; // now fall through
      case 'mi':
        vDateStr += pDate.getMinutes();
        break;
      case 'SS':
        if (pDate.getSeconds() < 10)
          vDateStr += '0'; // now fall through
      case 'ss':
        vDateStr += pDate.getSeconds();
        break;
      case 'pm':
        vDateStr += ((pDate.getHours()) < 12) ? 'am' : 'pm';
        break;
      case 'PM':
        vDateStr += ((pDate.getHours()) < 12) ? 'AM' : 'PM';
        break;
      case 'ww':
        if (getIsoWeek(pDate) < 10) vDateStr += '0'; // now fall through
      case 'w':
        vDateStr += getIsoWeek(pDate);
        break;
      case 'week':
        let vWeekNum = getIsoWeek(pDate);
        let vYear = pDate.getFullYear();
        let vDayOfWeek = (pDate.getDay() == 0) ? 7 : pDate.getDay();
        if (vWeekNum >= 52 && parseInt(vMonthStr, 10) === 1) vYear--;
        if (vWeekNum == 1 && parseInt(vMonthStr, 10) === 12) vYear++;
        if (vWeekNum < 10) vWeekNum = parseInt('0' + vWeekNum, 10);

        vDateStr += vYear + '-W' + vWeekNum + '-' + vDayOfWeek;
        break;
      default:
        if (pL[pDateFormatArr[i].toLowerCase()]) vDateStr += pL[pDateFormatArr[i].toLowerCase()];
        else vDateStr += pDateFormatArr[i];
        break;
    }
  }
  return vDateStr;
};

export const parseDateFormatStr = function (pFormatStr) {
  let vComponantStr = '';
  let vCurrChar = '';
  let vSeparators = new RegExp('[\/\\ -.,\'":]');
  let vDateFormatArray = new Array();

  for (let i = 0; i < pFormatStr.length; i++) {
    vCurrChar = pFormatStr.charAt(i);
    if ((vCurrChar.match(vSeparators)) || (i + 1 == pFormatStr.length)) // separator or end of string
    {
      if ((i + 1 == pFormatStr.length) && (!(vCurrChar.match(vSeparators)))) // at end of string add any non-separator chars to the current component
      {
        vComponantStr += vCurrChar;
      }
      vDateFormatArray.push(vComponantStr);
      if (vCurrChar.match(vSeparators)) vDateFormatArray.push(vCurrChar);
      vComponantStr = '';
    }
    else {
      vComponantStr += vCurrChar;
    }

  }
  return vDateFormatArray;
};

/**
 * We have to compare against the monday of the first week of the year containing 04 jan *not* 01/01
 * 60*60*24*1000=86400000
 * @param pDate 
 */
export const getIsoWeek = function (pDate) {
  let dayMiliseconds = 86400000;
  let keyDay = new Date(pDate.getFullYear(), 0, 4, 0, 0, 0);
  let keyDayOfWeek = (keyDay.getDay() == 0) ? 6 : keyDay.getDay() - 1; // define monday as 0
  let firstMondayYearTime = keyDay.getTime() - (keyDayOfWeek * dayMiliseconds);
  let thisDate = new Date(pDate.getFullYear(), pDate.getMonth(), pDate.getDate(), 0, 0, 0); // This at 00:00:00
  let thisTime = thisDate.getTime();
  let daysFromFirstMonday = Math.round(((thisTime - firstMondayYearTime) / dayMiliseconds));
  let lastWeek = 99;
  let thisWeek = 99;

  let firstMondayYear = new Date(firstMondayYearTime);

  thisWeek = Math.ceil((daysFromFirstMonday + 1) / 7);

  if (thisWeek <= 0) thisWeek = getIsoWeek(new Date(pDate.getFullYear() - 1, 11, 31, 0, 0, 0));
  else if (thisWeek == 53 && (new Date(pDate.getFullYear(), 0, 1, 0, 0, 0)).getDay() != 4 && (new Date(pDate.getFullYear(), 11, 31, 0, 0, 0)).getDay() != 4) thisWeek = 1;
  return thisWeek;
};
