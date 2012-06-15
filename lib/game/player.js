goog.provide('game.Player');

goog.require('game.Sprite');
goog.require('jx.Object2D');



/**
 * @constructor
 * @extends {jx.Object2D}
 */
game.Player = function(params) {
  jx.Object2D.call(this, params);
  this.angle = 0;
  this.velocity = 200;
  this.img = new game.Sprite({img: Game.medias.mario, width: 16, height: 20})
      .setState({label: 'normal', loop: true, frames: [0, 3], fps: 200});
};
goog.inherits(game.Player, jx.Object2D);


/**
 *
 */
game.Player.prototype.update = function(deltaTime) {
  if (Game.controler.UP) {
    this.y -= Game.controler.UP * this.velocity * deltaTime / 1000;
  }
  if (Game.controler.DOWN) {
    this.y += Game.controler.DOWN * this.velocity * deltaTime / 1000;
  }
  if (Game.controler.LEFT) {
    this.x -= Game.controler.LEFT * this.velocity * deltaTime / 1000;
  }
  if (Game.controler.RIGHT) {
    this.x += Game.controler.RIGHT * this.velocity * deltaTime / 1000;
  }
  this.angle = Math.atan2(Game.mouse.y - this.y, Game.mouse.x - this.x) - Math.PI/2;
  this.img.update(deltaTime);

  this.checkCollision();
};


/**
 *
 */
game.Player.prototype.render = function() {
  var c = Game.ctx;
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);
  this.img.render();

  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(0, 20);
  c.stroke();

  c.restore();
};


game.Player.prototype.checkCollision = function() {
  //Game.bobetteManager.verifyCollision(this.x, this.y, this.r);
};


game.Player.prototype.fire = function() {
  Game.toiletPaperManager.spawn({x: this.x, y: this.y, angle: this.angle + Math.PI/2});
};
