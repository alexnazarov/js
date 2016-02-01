"use strict";

let template = require('./template.html');

require('./main.css');

class View {
  constructor(options) {
    this._el = options.element;
    this._images = options.images;

    this._template = template;
    this._compiledTemplate = _.template(this._template);
  }

  _preloadImages(obj) {
    for(let key in this._images) {
      var img = document.createElement('img');
      img.src = this._images[key][obj.path];
    }
  }

  _setActive(id) {
    let largeImageUrl;

    for(let i = 0; i < this._images.length; i++) {
      if(this._images[i].id === id) {
        largeImageUrl = this._images[i].largeUrl;

        break;
      }
    }

    if(largeImageUrl) {
      this._el.innerHTML = this._compiledTemplate({
        largeUrl: largeImageUrl
      });
    }
  }
}

module.exports = View;