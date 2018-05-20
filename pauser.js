function forEachTab(callback, opt_extraQueryInfo) {
  var queryInfo = opt_extraQueryInfo || {};
  queryInfo.url = ["http://*/*", "https://*/*"];
  chrome.tabs.query(queryInfo, (tabs) => {
    for (tab of tabs) {
      callback(tab);
    }
  });
}

function corpPolicyDisallowsScripting(url) {
  var disallowed = [".google.", ".asana."];
  for (var item of disallowed) {
    if (url.indexOf(item) != -1)
      return true;
  }
  return false;
}

function setTabPaused(tab, shouldPause) {
  if (corpPolicyDisallowsScripting(tab.url)) {
    if (shouldPause && !tab.discarded)
      chrome.tabs.discard(tab.id);
    else if (!shouldPause && tab.discarded)
      chrome.tabs.reload(tab.id);
    return;
  }

  var opacity = shouldPause ? "0.1" : "1";
  chrome.tabs.executeScript(tab.id, {
    code: `document.documentElement.style.opacity=${opacity}`,
  });
}

var pauseStateKey = "pauseState";

function pauseStateInfo(state) {
  var data = {};
  data[pauseStateKey] = state;
  return data;
}

function setPauseState(state) {
  chrome.storage.sync.set(pauseStateInfo(state), () => {});
}

function setAllPaused(shouldPause) {
  chrome.storage.sync.get(pauseStateInfo(null), (items) => {
    if (!(shouldPause ^ items[pauseStateKey]))
      return;
    forEachTab((tab) => {
      setTabPaused(tab, shouldPause);
    });
    setPauseState(shouldPause);
  });
}

function pauseAll() {
  setAllPaused(true);
}

function unpauseAll() {
  setAllPaused(false);
}

function converTimeToNumber(time) {
  return parseInt(time.replace(':', ''), 10);
}

function shouldBePaused(currentTime, pauseTime, unpauseTime) {
  var current = converTimeToNumber(currentTime);
  var pause = converTimeToNumber(pauseTime);
  var unpause = converTimeToNumber(unpauseTime);

  if (pause < unpause) {
    return current >= pause && current <= unpause;
  } else {
    return current >= pause || current <= unpause;
  }
}
