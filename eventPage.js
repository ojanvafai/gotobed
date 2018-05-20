function padTime(number) {
  if (number < 10)
    return "0" + number;
  return number;
}

function getCurrentTime() {
  var now = new Date();
  return now.getHours() + ":" + padTime(now.getMinutes());
}

function updatePauseState() {
  chrome.storage.sync.get({
    pause: null,
    unpause: null,
  }, function(items) {
    if (shouldBePaused(getCurrentTime(), items.pause, items.unpause))
      pauseAll();
    else
      unpauseAll();
  });
}

chrome.alarms.onAlarm.addListener(updatePauseState);
chrome.windows.onFocusChanged.addListener(updatePauseState);
