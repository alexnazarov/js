"use strict";

var menu = document.querySelector('.menu'),
    toggle = menu.querySelector('.toggle');

toggle.addEventListener('click', function() {
  menu.classList.toggle('open');
})