"use strict";

class Football {
  constructor(options) {
    this.field = options.field;
    this.ball = options.ball;
  }

  init() {
    // Width and height of ball
    var ballSize = {
      width: this.ball.clientWidth,
      height: this.ball.clientHeight
    }

    // Border sizes of field
    var fieldBorder = {
      left: this.field.clientLeft,
      top: this.field.clientTop,
      right: parseInt(getComputedStyle(this.field).borderRightWidth, 10),
      bottom: parseInt(getComputedStyle(this.field).borderBottomWidth, 10)
    }

    this.field.addEventListener('click', function(e) {
      var fieldRect = this.field.getBoundingClientRect();

      // Positions of field
      var fieldRectCoords = {
        left: fieldRect.left,
        right: fieldRect.right,
        top: fieldRect.top,
        bottom: fieldRect.bottom
      }

      // Width and height of field without border size
      var fieldInsideSize = {
        width: fieldRectCoords.right - fieldRectCoords.left - fieldBorder.left - fieldBorder.right,
        height: fieldRectCoords.bottom - fieldRectCoords.top - fieldBorder.top - fieldBorder.bottom
      }

      // Current coords of click
      var clickCoords = {
        x: e.clientX - fieldRectCoords.left - fieldBorder.left,
        y: e.clientY - fieldRectCoords.top - fieldBorder.top
      }

      // Default value of ball coords
      var ballCoords = {
        left: 0,
        top: 0
      }

      if(clickCoords.x > fieldInsideSize.width - ballSize.width / 2) { // Left position of ball when the ball is too right
        ballCoords.left = fieldInsideSize.width - ballSize.width;
      } else if(clickCoords.x > ballSize.width / 2) { // Left position of ball in normal situation (inside field)
        ballCoords.left = clickCoords.x - ballSize.width / 2;
      }

      if(clickCoords.y > fieldInsideSize.height - ballSize.height / 2) { // Top position of ball when the ball is too bottom
        ballCoords.top = fieldInsideSize.height - ballSize.height;
      } else if(clickCoords.y > ballSize.height / 2) { // Top position of ball in normal situation (inside field)
        ballCoords.top = clickCoords.y - ballSize.height / 2;
      }

      this.ball.style.left = ballCoords.left + 'px';
      this.ball.style.top = ballCoords.top + 'px';
    }.bind(this))
  }
}

var football = new Football({
  field: document.querySelector('#field'),
  ball: document.querySelector('#ball')
});

football.init();