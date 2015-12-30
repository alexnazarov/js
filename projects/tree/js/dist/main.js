"use strict";

var data = {
  "Рыбы": {
    "Форель": {},
    "Щука": {}
  },
  "Деревья": {
    "Хвойные": {
      "Лиственница": {},
      "Ель": {}
    },
    "Цветковые": {
      "Берёза": {},
      "Тополь": {}
    }
  }
};

// Based on creating nodes
var container = document.getElementById('container');
createTree(container, data);

function createTree(container, data) {
  if (!isEmpty(data)) {
    var ul = document.createElement('ul');

    container.appendChild(ul);
    generateNodes(ul, data);
  }
}

function generateNodes(ul, data) {
  for (var i in data) {
    var li = document.createElement('li'),
        text = document.createTextNode(i);

    li.appendChild(text);
    ul.appendChild(li);

    createTree(li, data[i]);
  }
}

// Utility function
function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
}