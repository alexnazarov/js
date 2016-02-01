"use strict";

let template = require('./template.html');

require('./main.css');

class Thumbnails {
  constructor(options) {
    this._el = options.element;
    this._images = options.images;

    this._template = template;
    this._compiledTemplate = _.template(this._template);

    this._el.innerHTML = this._compiledTemplate({
      images: this._images
    });

    this._el.addEventListener('click', this._onThumbnailsClick.bind(this));
  }

  _onThumbnailsClick(e) {
    e.preventDefault();

    var thumbnail = e.target.closest('.thumbnail');

    if (!thumbnail) {
      return;
    }

    var thumbnailClickEvent = new CustomEvent('thumbnailClick', {
      detail: {
        id: thumbnail.dataset.id
      }
    });

    this._el.dispatchEvent(thumbnailClickEvent);
  }
}

module.exports = Thumbnails;