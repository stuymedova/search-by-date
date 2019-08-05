//reference to a popup:
// #1 - "date range" & "one day"
// #2 - "from (date)"
// #3 - "up to (date)"

//for reverse engineering follow numbers in the square brackets

// [2]
function updateQuery(defaultUrl) {

  // [5]
  //RegEx(date:... & query)
  var RegEx1 = /date%3A(\d{1,2})%2F(\d{1,2})%2F(\d{4})-(\d{1,2})%2F(\d{1,2})%2F(\d{4})/;
  var RegEx2 = /date%3A(\d{1,2})%2F(\d{1,2})%2F(\d{4})/;
  var RegEx3 = /date%3A-(\d{1,2})%2F(\d{1,2})%2F(\d{4})/;
  var RegExQ = /(q=[^&]*)/;

  // [4]
  //checking for the "date:..."
  var test1 = RegEx1.test(defaultUrl);
  var test2 = RegEx2.test(defaultUrl);
  var test3 = RegEx3.test(defaultUrl);


  // [6.1]
  //excluding "date:" from the query & extracting the date(numbers) - #1
  if(test1) {
    var query = defaultUrl.match(RegExQ)[0];
    var query1 = query.replace(RegEx1, "");

    var nums = defaultUrl.match(RegEx1);
    var mm1 = nums[1];
    var dd1 = nums[2];
    var yyyy1 = nums[3];
    var mm2 = nums[4];
    var dd2 = nums[5];
    var yyyy2 = nums[6];
  }

  // [6.2]
  //excluding "date:" from the query & extracting the date(numbers) - #2
  if(test2) {
    var query = defaultUrl.match(RegExQ)[0];
    var query2 = query.replace(RegEx2, "");

    var nums = defaultUrl.match(RegEx2);
    var mm = nums[1];
    var dd = nums[2];
    var yyyy = nums[3];
  }

  // [6.3]
  //excluding "date:" from the query & extracting the date(numbers) - #3
  if(test3) {
    var query = defaultUrl.match(RegExQ)[0];
    var query3 = query.replace(RegEx3, "");
    
    var nums = defaultUrl.match(RegEx3);
    var mm = nums[1];
    var dd = nums[2];
    var yyyy = nums[3];
  }


  // [3]
  if(test1) {
    return "https://www.google.com/search?"
        + query1 + "&tbs=cdr%3A1%2Ccd_min%3A" + mm1 + "%2F" + dd1 + "%2F" + yyyy1
        + "%2Ccd_max%3A" + mm2 + "%2F" + dd2 + "%2F" + yyyy2
  } else if(test2) {
    return "https://www.google.com/search?"
        + query2 + "&tbs=cdr%3A1%2Ccd_min%3A" + mm + "%2F" + dd + "%2F" + yyyy
  } else if(test3) {
    return "https://www.google.com/search?"
        + query3 + "&tbs=cdr%3A1%2Ccd_max%3A" + mm + "%2F" + dd + "%2F" + yyyy
  }
  return defaultUrl;
}


// [1]
chrome.webRequest.onBeforeRequest.addListener(
  //callback
  function(details) {
    return {
      redirectUrl: updateQuery(details.url)
    };
  },
  //filter
  {
    urls: [
      "*://*.google.com/search?*"
    ]
  },
  //extraInfoSpec
  ["blocking"]
);