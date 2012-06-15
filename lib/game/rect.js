goog.provide('game.Rect');

goog.require('goog.math.Vec2');
goog.require('jx.Object2D');



/**
 * @param {Object} params Default parameters.
 * @constructor
 */
game.Rect = function(params) {
  jx.Object2D.call(this, params);
  this.velocity = new goog.math.Vec2(jx.Utils.rand(100, 400),
                                     jx.Utils.rand(100, 400));
};
goog.inherits(game.Rect, jx.Object2D);


/**
 * @param {number} dt Delta time since the last frame.
 */
game.Rect.prototype.update = function(dt) {
  this.x += dt / 1000 * this.velocity.x;
  this.y += dt / 1000 * this.velocity.y;
  if (this.x < 0) {
    this.velocity.x = -this.velocity.x;
    this.x = 0;
  }
  if (this.x > Game.canvas.width) {
    this.velocity.x = -this.velocity.x;
    this.x = Game.canvas.width;
  }
  if (this.y > Game.canvas.height) {
    this.velocity.y = -this.velocity.y;
    this.y = Game.canvas.height;
  }
  if (this.y < 0) {
    this.velocity.y = -this.velocity.y;
    this.y = 0;
  }
};


/**
 *
 */
game.Rect.prototype.render = function() {
  var c = Game.ctx;
  c.save();
  c.translate(this.x, this.y);
  c.fillRect(0, 0, this.w, this.h);
  c.restore();
};
