goog.provide('game.Bobette');

goog.require('jx.Object2D');



/**
 * @constructor
 */
game.Bobette = function(params) {
  jx.Object2D.call(this, params);
  this.ownerId = params.ownerId;
  this.img = Game.medias.items;
};
goog.inherits(game.Bobette, jx.Object2D);


/**
 *
 */
game.Bobette.prototype.update = function(deltaTime) {
};


/**
 *
 */
game.Bobette.prototype.render = function() {
  var c = Game.ctx;
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);

  c.drawImage(this.img, 0, 0, this.w, this.h,
              -this.w / 2, -this.h / 2, this.w, this.h);

  if (Game.DEBUG_COLLISION) {
    this.renderCollision();
  }

  c.restore();
};
