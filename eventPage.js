chrome.alarms.onAlarm.addListener((alarm) => {
  var name = alarm.name;
  if (name == 'pause')
    pause();
  else if (name == 'unpause')
    unpause();
  else
    throw "Alarm fired with invalid name: " + name;
});
