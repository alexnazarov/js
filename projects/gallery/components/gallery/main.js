"use strict";

let template = require('./template.html');
let Preview = require('./../preview/main');
let Thumbnails = require('./../thumbnails/main');

require('./main.css');

class Gallery {
  constructor(options) {
    this._el = options.element;

    this._el.innerHTML = template;

    this.preview = new Preview({
      element: this._el.querySelector('[data-component="preview"]'),
      images: options.images
    });

    this.thumbnails = new Thumbnails({
      element: this._el.querySelector('[data-component="thumbnails"]'),
      images: options.images
    });

    this.thumbnails._el.addEventListener('thumbnailClick', this.setActive.bind(this));

    if(options.preloadImages) {
      this.preview._preloadImages({
        path: 'largeUrl'
      });
    }

    // Set first image active by default
    this.setActive(1);
  }

  _getClass(obj) {
    return {}.toString.call(obj).slice(8, -1);
  }

  setActive(value) {
    if(this._getClass(value) === 'CustomEvent') {
      value = +value.detail.id;
    }

    this.preview._setActive(value);
    this.thumbnails._setActive(value);
  }
}

module.exports = Gallery;