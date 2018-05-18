function forEachTab(callback) {
  chrome.tabs.query({
    url: ["http://*/*", "https://*/*",],
  }, (tabs) => {
    for (tab of tabs) {
      callback(tab);
    }
  });
}

function pause() {
  forEachTab((tab) => {
    // Can't inject script here due to corp policy, so just discard.
    if (tab.url.indexOf(".google.") != -1) {
      if (!tab.discarded)
        chrome.tabs.discard(tab.id);
      return;
    }

    chrome.tabs.executeScript(tab.id, {
      code: 'document.documentElement.style.opacity=0.1',
    });
  });
}

function unpause() {
  forEachTab((tab) => {
    // Can't inject script here due to corp policy, so just discard.
    if (tab.url.indexOf(".google.") != -1) {
      if (!tab.discarded)
        chrome.tabs.reload(tab.id);
      return;
    }

    chrome.tabs.executeScript(tab.id, {
      code: 'document.documentElement.style.opacity=1',
    });
  });
}