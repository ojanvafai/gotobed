function updatePauseState(windowId) {
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
}

chrome.alarms.onAlarm.addListener((alarm) => {
  updatePauseState(null);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  updatePauseState(windowId);
});
