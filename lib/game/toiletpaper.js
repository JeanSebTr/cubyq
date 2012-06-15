goog.provide('game.ToiletPaper');

goog.require('jx.Object2D');



/**
 * @constructor
 */
game.ToiletPaper = function(params) {
  jx.Object2D.call(this, params);
  this.velocity = 300;
  this.w = 10;
  this.h = 10;
};
goog.inherits(game.ToiletPaper, jx.Object2D);


game.ToiletPaper.prototype.update = function(deltaTime) {
  this.x += Math.cos(this.angle) * this.velocity * deltaTime / 1000;
  this.y += Math.sin(this.angle) * this.velocity * deltaTime / 1000;
};


game.ToiletPaper.prototype.render = function() {
  var c = Game.ctx;
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);

  c.fillStyle = 'red';
  c.fillRect(0, 0, this.w, this.h);

  c.restore();
};
