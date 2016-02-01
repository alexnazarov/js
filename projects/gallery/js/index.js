"use strict";

let Gallery = require('./../components/gallery/main');
let images = require('./../data/images.json');

let gallery = new Gallery({
  element: document.querySelector('#gallery'),
  images: images,
  preloadImages: true
});

gallery.setActive(4);