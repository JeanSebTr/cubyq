goog.provide('game.Message');

goog.require('jx.Object2D');



/**
 * @constructor
 */
game.Message = function(params) {
  jx.Object2D.call(this, params);
  this.duration = 3000;
  this.timer = 0;
  this.img = Game.medias.textes;
  this.x = 0;
  this.y = 0;
  this.w = 480;
  this.h = 640;
  this.minHeight = 40;
  switch (params.id) {
    case 0:
      this.y = 0 * this.minHeight;
      this.h = this.minHeight;
      break;
    case 1:
      this.y = 1 * this.minHeight;
      this.h = this.minHeight;
      break;
    case 2:
      this.y = 2 * this.minHeight;
      this.h = this.minHeight;
      break;
    case 3:
      this.y = 3 * this.minHeight;
      this.h = this.minHeight;
      break;
    case 4:
      this.y = 4 * this.minHeight;
      this.h = 2 * this.minHeight;
      break;
    case 5:
      this.y = 6 * this.minHeight;
      this.h = this.minHeight;
      break;
    case 6:
      this.y = 7 * this.minHeight;
      this.h = this.minHeight;
      break;
    case 7:
      this.y = 8 * this.minHeight;
      this.h = this.minHeight;
      break;
    case 8:
      this.y = 9 * this.minHeight;
      this.h = this.minHeight;
      break;
    case 9:
      this.y = 10 * this.minHeight;
      this.h = this.minHeight;
      break;
  }
};
goog.inherits(game.Message, jx.Object2D);


game.Message.prototype.update = function(deltaTime) {
  if (this.timer >= this.duration) {
    Game.messageManager.remove(this);
  }
  this.timer += deltaTime;
};


game.Message.prototype.render = function() {
  var c = Game.ctx;
  c.save();
  c.translate(Game.canvas.width - this.w, 0);
  console.log(this.img, this.x, this.y, this.w, this.h);
  c.drawImage(this.img, this.x, this.y, this.w, this.h,
      0, 0, this.w, this.h);
  c.restore();
};
