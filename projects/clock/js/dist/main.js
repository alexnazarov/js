"use strict";

createClock(document.getElementById('clock'));

function createClock(el) {
  var hour = document.createElement('span');
  hour.className = 'hour';

  var min = document.createElement('span');
  min.className = 'min';

  var sec = document.createElement('span');
  sec.className = 'sec';

  el.appendChild(hour);
  el.appendChild(document.createTextNode(':'));
  el.appendChild(min);
  el.appendChild(document.createTextNode(':'));
  el.appendChild(sec);

  function update() {
    var now = new Date();

    hour.innerHTML = now.getHours();
    min.innerHTML = now.getMinutes();
    sec.innerHTML = now.getSeconds();
  }

  update();
  setInterval(function () {
    update();
  }, 1000);
}