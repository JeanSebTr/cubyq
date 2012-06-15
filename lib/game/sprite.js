goog.provide('game.Sprite');

goog.require('jx.Object2D');



/**
 * @param {Array.<Object>} imgs Array of images.
 * @constructor
 * @extends {jx.Object2D}
 */
game.Sprite = function(params) {
  jx.Object2D.call(this);
  params = params || {};
  this.img = params.img;
  this.width = params.width;
  this.height = params.height;
  this.states = {};
  this.frame = null;
  this.ptr = 0;
  this.firstFrame = new Date();
  this.lastFrame = new Date();
  this.state = null;
  this.opacity = 1;
  this.scale = 1;
  this.angle = 0;

  this.animates = [];
  this.animPtr = 0;
  this.loopAnim = false;
};
goog.inherits(game.Sprite, jx.Object2D);


/**
 * @param {Object} params Parameters.
 * @return {game.Sprite} The sprite instance.
 */
game.Sprite.prototype.setState = function(params) {
  params = params || {};
  var label = params.label || '',
      frames = params.frames || [],
      callback = params.callback || null,
      loop = params.loop == undefined ? true : params.loop,
      fps = params.fps || 100;
  this.x = params.x || 0;
  this.y = params.y || 0;
  this.layers = params.layers;
  this.scale = params.scale == undefined ? 1 : params.scale;
  this.angle = params.angle == undefined ? 0 : params.angle;
  this.opacity = params.opacity == undefined ? 1 : params.opacity;
  this.delay = params.delay || 0;

  this.states[label] = { frames: frames, fps: fps, loop: loop,
      callback: callback };
  if (!this.state) {
    this.changeState(label);
  }
  return this;
};


/** @param {number} dt Delta time since the last frame. */
game.Sprite.prototype.update = function(dt) {
  if (new Date().getTime() - this.firstFrame.getTime() >= this.delay) {
    if (new Date().getTime() - this.lastFrame.getTime() >= this.frame.fps) {
      if (++this.ptr >= this.frame.frames.length && this.frame.loop) {
        this.ptr = 0;
      }
      this.lastFrame = new Date();
    }
    if (this.ptr >= this.frame.frames.length &&
        !this.frame.loop && this.frame.callback) {
      this.frame.callback.call(this);
    }



    if (this.animates.length && !this.startTime) {
      this.loadAnim(0);
    }
    if (this.anim) {
      this.interpolate();
    }
  }
};


/** */
game.Sprite.prototype.render = function() {
  if (new Date().getTime() - this.firstFrame.getTime() >= this.delay) {
    var c = Game.ctx;
    c.save();
    c.globalAlpha = this.opacity;
    c.translate(this.x, this.y);
    c.rotate(this.angle);
    c.scale(this.scale, this.scale);
    var x = this.frame.frames[this.ptr] * this.width;
    if (this.img.width == 500) {
      //console.log('CALISS', this.opacity, x, this.frame.frames, this.ptr, this.animates.length);
    }
    for (var i = 0; i < this.layers.length; i++) {
      c.drawImage(this.img, x, i * this.height, this.width, this.height,
                  -this.width / 2, -this.height / 2, this.width, this.height);
    }

    c.restore();
  }
};


/**
 * @param {string} label The state name.
 * @param {number=} opt_startAt The frame id to start at.
 * @return {game.Sprite} The sprite instance.
 */
game.Sprite.prototype.changeState = function(label, opt_startAt) {
  this.state = label;
  this.frame = this.states[label];
  this.ptr = opt_startAt == undefined ? 0 : opt_startAt;
  return this;
};


/**
 * @param {Object} params The animation parameters.
 * @return {game.Sprite} The sprite instance.
 */
game.Sprite.prototype.animate = function(params) {
  this.animates.push(params);
  this.animPtr = 0;
  return this;
};


/**
 * @param {number} idx Load the animation at the specified index.
 */
game.Sprite.prototype.loadAnim = function(idx) {
  var params = this.animates[idx];
  this.startTime = new Date();
  this.anim = {};
  for (var key in params) {
    if (key == 'duration') {
      this.duration = params[key];
      continue;
    }
    this.anim[key] = this[key] || params[key];
    this.anim['new_' + key] = params[key];
    this.anim['old_' + key] = this[key] || 0;

  }
};


/**
 * @param {boolean} param Define if the sprite should loop or not.
 * @return {game.Sprite} The sprite instance.
 */
game.Sprite.prototype.loop = function(param) {
  var tmp = param == undefined ? true : false;
  this.loopAnim = tmp;
  return this;
};


/** */
game.Sprite.prototype.interpolate = function() {
  var delta = new Date().getTime() - this.startTime;
  if (delta < this.duration) {
    // If actions...
    if (this.anim.actions && this.anim.actions.length > 0) {
      if (delta / this.duration * 100 >= this.anim.actions[0].time) {
        var tmp = this.anim.actions[0];
        for (var key in tmp) {
          if (key == 'time') { continue; }
          //this.anim[key] = this[key] || tmp[key];
          var start = new Date();
          this.anim[key + '_startTime'] = start;
          this.anim['new_' + key] = tmp[key];
          this.anim['old_' + key] = this[key] || 0;
          this.anim[key + '_duration'] = (this.startTime.getTime() +
              this.duration) - start.getTime();
        }
        this.anim.actions.splice(0, 1);
      }
    }

    var fn = this.anim.fn || 'linear';
    for (var key in this.anim) {
      if (key.substr(0, 4) != 'new_' && key.substr(0, 4) != 'old_') {
        var st = this.startTime;
        var duration = this.duration;
        // If this specific property has a startTime associated, use this
        // one.
        if (this.anim[key + '_startTime']) {
          st = this.anim[key + '_startTime'];
        }
        if (this.anim[key + '_duration']) {
          duration = this.anim[key + '_duration'];
        }
        var effect = this.formulas()[fn]((new Date().getTime() - st) /
                         duration);
        this[key] = ((this.anim['new_' + key] - this.anim['old_' + key]) /
                        duration) * (effect * duration) +
                        this.anim['old_' + key];
      }
    }
  } else {
    for (var key in this.anim) {
      if (key.substr(0, 4) != 'new_' && key.substr(0, 4) != 'old_') {
        this[key] = this.anim['new_' + key];
      }
    }
    if (this.callback) { this.callback.call(this); }
    if (this.animPtr < this.animates.length) {
      ++this.animPtr;
    } else if (this.loopAnim) {
      this.animPtr = 0;
    }
    this.loadAnim(this.animPtr);
  }
};


/**
 * @return {Object} Caintaining some usefull formulas.
 */
game.Sprite.prototype.formulas = function() {
  return {
    'linear': function(n) { return n; },
    '<': function(n) { return Math.pow(n, 3); },
    '>': function(n) { return Math.pow(n - 1, 3) + 1; },
    '<>': function(n) {
      n = n * 2;
      if (n < 1) {
        return Math.pow(n, 3) / 2;
      }
      n -= 2;
      return (Math.pow(n, 3) + 2) / 2;
    },
    backIn: function(n) {
      var s = 1.70158;
      return n * n * ((s + 1) * n - s);
    },
    backOut: function(n) {
      n = n - 1;
      var s = 1.70158;
      return n * n * ((s + 1) * n + s) + 1;
    },
    elastic: function(n) {
      if (n == 0 || n == 1) {
        return n;
      }
      var p = .3,
          s = p / 4;
      return Math.pow(2, -10 * n) * Math.sin((n - s) *
          (2 * Math.PI) / p) + 1;
    },
    bounce: function(n) {
      var s = 7.5625,
          p = 2.75,
          l;
      if (n < (1 / p)) {
        l = s * n * n;
      } else {
        if (n < (2 / p)) {
          n -= (1.5 / p);
          l = s * n * n + .75;
        } else {
          if (n < (2.5 / p)) {
            n -= (2.25 / p);
            l = s * n * n + .9375;
          } else {
            n -= (2.625 / p);
            l = s * n * n + .984375;
          }
        }
      }
      return l;
    }
  };
};
