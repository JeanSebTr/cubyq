goog.provide('jx.Core');

goog.require('jx.Utils');
goog.require('goog.events');



/**
 * @constructor
 */
jx.Core = function() {
};


/**
 * @param {Object} canvasId The canvas id.
 */
jx.Core.prototype.init = function(canvasId) {
  this.isStarted_ = false;
  this.lastFrame_ = -1;
  this.managers_ = [];
  this.canvas = document.getElementById(canvasId);
  this.ctx = this.canvas.getContext('2d');
};


/** */
jx.Core.prototype.start = function() {
  var self = this;
  this.isStarted_ = true;
  this.lastFrame_ = Date.now();
  this.requestAnimFrame()(function() { self.cycle() });
};


/**
 * @param {number} deltaTime Delta time since the last frame.
 */
jx.Core.prototype.update = function(deltaTime) {
  for (var i = 0, length = this.managers_.length; i < length; i++) {
    this.managers_[i].update(deltaTime);
  }
};


/** */
jx.Core.prototype.render = function() {
  var ctx = this.ctx;
  ctx.save();
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  for (var i = 0, length = this.managers_.length; i < length; i++) {
    this.managers_[i].render();
  }

  ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  ctx.restore();
};


/** */
jx.Core.prototype.cycle = function() {
  var self = this;
  if (this.isStarted_) {
    var deltaTime = Date.now() - this.lastFrame_;
    this.update(deltaTime);
    this.render();
    this.lastFrame_ = Date.now();
    this.requestAnimFrame()(function() { self.cycle() });
  }
};


/**
 * @return {Function} RequestAnimationFrame.
 */
jx.Core.prototype.requestAnimFrame = function() {
  return window.requestAnimationFrame ||       // La forme standardisée
         window.webkitRequestAnimationFrame || // Pour Chrome et Safari
         window.mozRequestAnimationFrame ||    // Pour Firefox
         window.oRequestAnimationFrame ||      // Pour Opera
         window.msRequestAnimationFrame ||     // Pour Internet Explorer
         function(callback) {
           window.setTimeout(callback, 1000 / 60);
         };
};
