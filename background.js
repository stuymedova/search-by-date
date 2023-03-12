// | Search by Date                                 |
// | ------------- | ------------------------------ |
// | date range    | date:mm/dd/yyyy-mm/dd/yyyy     |
// | one day       | date:mm/dd/yyyy                |
// | from (date)   | date:mm/dd/yyyy-               |
// | up to (date)  | date:-mm/dd/yyyy               |

chrome.webRequest.onBeforeRequest.addListener(
  // callback
  (details) => { return { redirectUrl: getRedirectUrl(details.url) }},
  // filter
  { urls: ['*://*.google.com/search?*'] },
  // extraInfoSpec
  ['blocking']
);

function getRedirectUrl(givenUrl) {
  const dateRangeRegEx = /date%3A(\d{1,2})%2F(\d{1,2})%2F(\d{4})-(\d{1,2})%2F(\d{1,2})%2F(\d{4})/;
  const oneDayRegEx = /date%3A(\d{1,2})%2F(\d{1,2})%2F(\d{4})/;
  const fromDateRegEx = /date%3A(\d{1,2})%2F(\d{1,2})%2F(\d{4})-/;
  const upToDateRegEx = /date%3A-(\d{1,2})%2F(\d{1,2})%2F(\d{4})/;

  const isDateRange = dateRangeRegEx.test(givenUrl);
  const isOneDay = oneDayRegEx.test(givenUrl);
  const isFromDate = fromDateRegEx.test(givenUrl);
  const isUpToDate = upToDateRegEx.test(givenUrl);
  
  // Date range
  if (isDateRange) {
    const newUrl = new URL(givenUrl.replace(dateRangeRegEx, ''));
    const [_, fromMonth, fromDay, fromYear, upToMonth, upToDay, upToYear] = givenUrl.match(dateRangeRegEx);
    
    newUrl.searchParams.set(
      'tbs', 
      `cdr:1,cd_min:${fromMonth}/${fromDay}/${fromYear},cd_max:${upToMonth}/${upToDay}/${upToYear}`
    );

    return newUrl.toString();
  }
  
  // From date
  if (isFromDate) {
    const newUrl = new URL(givenUrl.replace(fromDateRegEx, ''));
    const [_, fromMonth, fromDay, fromYear] = givenUrl.match(fromDateRegEx);

    newUrl.searchParams.set(
      'tbs', 
      `cdr:1,cd_min:${fromMonth}/${fromDay}/${fromYear}`
    );

    return newUrl.toString();
  }
  
  // Up to date
  if (isUpToDate) {
    const newUrl = new URL(givenUrl.replace(upToDateRegEx, ''));
    const [_, upToMonth, upToDay, upToYear] = givenUrl.match(upToDateRegEx);
    
    newUrl.searchParams.set(
      'tbs', 
      `cdr:1,cd_max:${upToMonth}/${upToDay}/${upToYear}`
    );

    return newUrl.toString();
  }
  
  // One day
  if (isOneDay) {
    const newUrl = new URL(givenUrl.replace(oneDayRegEx, ''));
    const [_, month, day, year] = givenUrl.match(oneDayRegEx);
    
    newUrl.searchParams.set(
      'tbs', 
      `cdr:1,cd_min:${month}/${day}/${year},cd_max:${month}/${day}/${year}`
    );

    return newUrl.toString();
  }

  return givenUrl;
}
