var timer;
function save(key) {
  if (timer)
    clearTimeout(timer);

  timer = setTimeout(function() {
    timer = null;

    var value = document.getElementById(key).value;

    var date = new Date();
    date.setHours(...value.split(':'));

    chrome.alarms.clear(key);
    chrome.alarms.create(key, {
      when: date.getTime(),
      periodInMinutes: 24 * 60, // 24 hours
    });

    var data = {};
    data[key] = value;
    chrome.storage.sync.set(data, function() {});
  }, 100);
};

function appendTimeInput(key, data) {
  var input = document.createElement('input');
  input.type = 'time';
  input.id = key;
  input.value = data[key];
  input.onkeydown = function() {
    save(key);
  };
  document.body.append(input);
}

function appendButton(container, value, onClick) {
  var button = document.createElement('input');
  button.type = "button";
  button.value = value;
  button.addEventListener('click', onClick);
  container.append(button);
}

chrome.storage.sync.get({
  start: null,
  end: null,
}, function(items) {
  var toolbar = document.getElementById('toolbar');
  appendButton(toolbar, "Pause", pause);
  appendButton(toolbar, "Unpause",unpause);

  document.body.append("Pause time: ");
  appendTimeInput('pause', items);

  document.body.append(document.createElement('br'));

  document.body.append("Unpause time: ");
  appendTimeInput('unpause', items);
});
