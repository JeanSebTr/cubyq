goog.provide('jx.Controler');

goog.require('Gamepads');
goog.require('goog.events');



/**
 * @param {Object} params Default parameters.
 * @constructor
 */
jx.Controler = function(params) {
  params = params || {};

  this.UP = 0;
  this.DOWN = 0;
  this.LEFT = 0;
  this.RIGHT = 0;
  this.A = 0;
  this.B = 0;
  this.X = 0;
  this.Y = 0;

  this.type = params.type || 'keyboard';

  if (this.type == 'keyboard') {
    // KeyDown
    goog.events.listen(document, goog.events.EventType.KEYDOWN,
                       this.keyDown.bind(this));
    // KeyUp
    goog.events.listen(document, goog.events.EventType.KEYUP,
                       this.keyUp.bind(this));
  }

  this.keyboardHash = {
    'DOWN': 83, // S
    'UP': 87, // W
    'LEFT': 65, // A
    'RIGHT': 68, // D
    'A': 32, // space
    'B': 80, // P
    'X': 76, // L
    'Y': 79  // O
  };


  this.gamepad = Gamepads.get(0);
  this.gamepadHash = {
    LEFT: 'AXE_0',
    RIGHT: 'AXE_0',
    DOWN: 'AXE_1',
    UP: 'AXE_1',
    A: 'BUTTON_1',
    B: 'BUTTON_2',
    X: 'BUTTON_3',
    Y: 'BUTTON_4'
  };

  this.changeType(this.type);
};


/**
 * @param {number} deltaTime Delta time since the last frame.
 */
jx.Controler.prototype.update = function(deltaTime) {
  if (this.type == 'keyboard') {
  } else if (this.type == 'gamepad') {
    Gamepads.update();
    var hash = this.gamepadHash;
    this.DOWN = this.gamepad[hash.DOWN] > 0 ?
        Math.abs(this.gamepad[hash.DOWN]) : 0;
    console.log(this.gamepad, this.DOWN);
    this.UP = this.gamepad[hash.UP] < 0 ?
        Math.abs(this.gamepad[hash.UP]) : 0;
    this.LEFT = this.gamepad[hash.LEFT] < 0 ?
        Math.abs(this.gamepad[hash.LEFT]) : 0;
    this.RIGHT = this.gamepad[hash.RIGHT] > 0 ?
        Math.abs(this.gamepad[hash.RIGHT]) : 0;
    this.A = this.gamepad[hash.A];
    this.B = this.gamepad[hash.B];
    this.X = this.gamepad[hash.X];
    this.Y = this.gamepad[hash.Y];
  }
};


/**
 *
 */
jx.Controler.prototype.render = function() {
};


/**
 * @param {string} type Type.
 */
jx.Controler.prototype.changeType = function(type) {
};


/**
 * @param {Object} evt Event.
 */
jx.Controler.prototype.keyDown = function(evt) {
  if (this.type == 'keyboard') {
    switch (evt.keyCode) {
      case this.keyboardHash['DOWN']: this.DOWN = 1; break;
      case this.keyboardHash['UP']: this.UP = 1; break;
      case this.keyboardHash['LEFT']: this.LEFT = 1; break;
      case this.keyboardHash['RIGHT']: this.RIGHT = 1; break;
      case this.keyboardHash['A']: this.A = 1; break;
      case this.keyboardHash['B']: this.B = 1; break;
      case this.keyboardHash['X']: this.X = 1; break;
      case this.keyboardHash['Y']: this.Y = 1; break;
    }
  }
};


/**
 * @param {Object} evt Event.
 */
jx.Controler.prototype.keyUp = function(evt) {
  if (this.type == 'keyboard') {
    switch (evt.keyCode) {
      case this.keyboardHash['DOWN']: this.DOWN = 0; break;
      case this.keyboardHash['UP']: this.UP = 0; break;
      case this.keyboardHash['LEFT']: this.LEFT = 0; break;
      case this.keyboardHash['RIGHT']: this.RIGHT = 0; break;
      case this.keyboardHash['A']: this.A = 0; break;
      case this.keyboardHash['B']: this.B = 0; break;
      case this.keyboardHash['X']: this.X = 0; break;
      case this.keyboardHash['Y']: this.Y = 0; break;
    }
  }
};
