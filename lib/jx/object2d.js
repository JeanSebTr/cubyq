goog.provide('jx.Object2D');



/**
 * @constructor
 */
jx.Object2D = function(params) {
  params = params || {};
  this.x = null || params.x;
  this.y = null || params.y;
  this.w = null || params.w;
  this.h = null || params.h;
  this.angle = null || params.angle;
  this.radius = null || params.w / 2;
};


/** */
jx.Object2D.prototype.render = function() { };


/** */
jx.Object2D.prototype.update = function() { };


jx.Object2D.prototype.renderCollision = function() {
  var c = Game.ctx;
  c.save();

  c.fillStyle = 'rgba(255, 0, 0, 0.8)';
  c.beginPath();
  c.arc(0, 0, this.radius, 0, 2 * Math.PI);
  c.closePath();
  c.fill();

  c.restore();
};


/**
 * Take a point and a radius, test a collision.
 * @param {number} x X position.
 * @param {number} y Y position.
 * @param {number} r Radius.
 * @return {boolean} True if collide, false otherwise.
 */
jx.Object2D.prototype.collide = function(x, y, r) {
  var posToCheckX = (this.x + 0) - x,
      posToCheckY = (this.y + 0) - y;
  return Math.sqrt(posToCheckX * posToCheckX + posToCheckY * posToCheckY) <
      this.radius + r;
};
