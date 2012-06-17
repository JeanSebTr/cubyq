goog.provide('game.Message');

goog.require('jx.Object2D');



/**
 * @constructor
 */
game.Message = function(params) {
  jx.Object2D.call(this, params);
};
goog.inherits(game.Message, jx.Object2D);


game.Message.prototype.update = function(deltaTime) {
};


game.Message.prototype.render = function() {
  var c = Game.ctx;
  c.save();
  c.translate(this.x, this.y);
  c.fillStyle = 'white';
  c.fillRect(0, 0, 100, 100);
  c.restore();
};
