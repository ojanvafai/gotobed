chrome.alarms.onAlarm.addListener((alarm) => {
  var name = alarm.name;
  if (name == 'pause')
    pauseAll();
  else if (name == 'unpause')
    unpauseAll();
  else
    throw "Alarm fired with invalid name: " + name;
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  chrome.storage.sync.get({
    pause: null,
    unpause: null,
  }, function(items) {
    var now = new Date();
    var current = now.getHours() + ":" + now.getMinutes();
    var callback = shouldBePaused(current, items.pause, items.unpause) ?
      pause : unpause;
    forEachTab(callback, {
      windowId: windowId,
    });
  });
});
