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

  render(id) {
    let largeImageUrl;

    for(let key in this._images) {
      if(this._images[key].id === id) {
        largeImageUrl = this._images[key].largeUrl;

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