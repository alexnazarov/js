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

    if(!thumbnail) {
      return;
    }

    var thumbnailClickEvent = new CustomEvent('thumbnailClick', {
      detail: {
        id: thumbnail.dataset.id
      }
    });

    this._el.dispatchEvent(thumbnailClickEvent);
  }

  _setActive(id) {
    var thumbnailsEls   = this._el.querySelectorAll('.thumbnail'),
        activeThumbnail = this._el.querySelector('[data-id="' + id + '"]');

    for(let i = 0; i < thumbnailsEls.length; i++) {
      thumbnailsEls[i].classList.remove('active');
    }

    activeThumbnail.classList.add('active');
  }
}

module.exports = Thumbnails;