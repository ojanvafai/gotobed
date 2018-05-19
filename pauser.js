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

function pause(tab) {
  if (corpPolicyDisallowsScripting(tab.url)) {
    if (!tab.discarded)
      chrome.tabs.discard(tab.id);
    return;
  }

  chrome.tabs.executeScript(tab.id, {
    code: 'document.documentElement.style.opacity=0.1',
  });
}

function unpause(tab) {
  if (corpPolicyDisallowsScripting(tab.url)) {
    if (tab.discarded)
      chrome.tabs.reload(tab.id);
    return;
  }

  chrome.tabs.executeScript(tab.id, {
    code: 'document.documentElement.style.opacity=1',
  });
}

function pauseAll() {
  forEachTab(pause);
}

function unpauseAll() {
  forEachTab(unpause);
}

function shouldBePaused(currentTime, pauseTime, unpauseTime) {
  if (pauseTime < unpauseTime) {
    return currentTime >= pauseTime && currentTime <= unpauseTime;
  } else {
    return currentTime >= pauseTime || currentTime <= unpauseTime;
  }
}
