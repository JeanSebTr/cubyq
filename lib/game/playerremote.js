goog.provide('game.PlayerRemote');

goog.require('game.Sprite');
goog.require('jx.Object2D');
goog.require('game.Wave');



/**
 * @constructor
 * @extends {jx.Object2D}
 */
game.PlayerRemote = function(params) {
  var self = this;
  jx.Object2D.call(this, params);
  this.id = params.id;
  this.angle = 0;
  this.velocity = 100;
  this.radius = 25 / 2;
  this.img = new game.Sprite({img: Game.medias.character_01, width: 48, height: 48})
      .setState({label: 'stand', loop: true, frames: [0], layers: [0, 1, 2, 3] })
      .setState({label: 'walk', loop: true, frames: [0, 1, 2, 3], layers: [0, 1, 2, 3], fps: 200})
      .setState({label: 'attack', loop: false, frames: [0, 1, 2, 3], layers: [0, 1, 4, 3], fps: 200, callback: function() { console.log('FIN'); self.img.changeState('stand'); }});

  this.States = {STAND: 0, WALK: 1, ATTACK: 2};
  this.state = this.States.STAND;
  this.points = 0;

  this.ringDelay = 1000;
  this.ringCounter = 0;
  this.fxs = [];
};
goog.inherits(game.PlayerRemote, jx.Object2D);


/**
 *
 */
game.PlayerRemote.prototype.update = function(deltaTime) {
  var self = this;
  //console.log(this.DOWN);

  if (this.UP) {
    this.x += Math.cos(this.angle) * this.UP * this.velocityMax * deltaTime / 1000;
    this.y += Math.sin(this.angle) * this.UP * this.velocityMax * deltaTime / 1000;
  }
  if (this.DOWN) {
    this.x -= Math.cos(this.angle) * this.DOWN * this.velocityMax * deltaTime / 1000;
    this.y -= Math.sin(this.angle) * this.DOWN * this.velocityMax * deltaTime / 1000;
  }
  if (this.LEFT) {
    this.angle -= Math.PI * this.LEFT * this.rotationVelocity * deltaTime / 1000;
  }
  if (this.RIGHT) {
    this.angle += Math.PI * this.RIGHT * this.rotationVelocity * deltaTime / 1000;
  }

  if ((Game.controler.UP ||
      Game.controler.DOWN ||
      Game.controler.LEFT ||
      Game.controler.RIGHT) && this.img.state == 'stand')
  {
    this.img.changeState('walk');
  } else if (!Game.controler.UP &&
      !Game.controler.DOWN &&
      !Game.controler.LEFT &&
      !Game.controler.RIGHT && this.img.state == 'walk')
  {
    this.img.changeState('stand');
  }


  //
  if (this.ringCounter >= this.ringDelay) {
    this.ringCounter -= this.ringDelay;
    if (this.points > 0 && this.points <= 3) {
      var circle = new game.Wave({callback: function() { self.removeFx(this); }});
      this.fxs.push(circle);
    }
  }
  this.ringCounter += deltaTime;


  for (var i = 0; i < this.fxs.length; i++) {
    this.fxs[i].update(deltaTime);
  }


  //this.angle = Math.atan2(Game.mouse.y - this.y, Game.mouse.x - this.x);
  this.img.update(deltaTime);

  this.checkCollision();
};


game.PlayerRemote.prototype.removeFx = function(obj) {
  for (var i = 0; i < this.fxs.length; i++) {
    if (this.fxs[i] == obj) {
      this.fxs.splice(i, 1);
      break;
    }
  }
};


/**
 *
 */
game.PlayerRemote.prototype.render = function() {
  var c = Game.ctx;
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle - Math.PI / 2);


  for (var i = 0; i < this.fxs.length; i++) {
    this.fxs[i].render();
  }

  this.img.render();

  if (Game.DEBUG_COLLISION) {
    this.renderCollision();
  }

  c.restore();
};


game.PlayerRemote.prototype.checkCollision = function() {
  for (var i = 0; i < Game.bobetteManager.objs.length; i++) {
    var bobette = Game.bobetteManager.objs[i];
    if (bobette.collide(this.x, this.y, this.radius)) {
      Game.bobetteManager.objs.splice(i, 1);
      this.points++;
      --i;
    }
  }
};


game.PlayerRemote.prototype.fire = function() {
  this.img.changeState('attack');
  //Game.toiletPaperManager.spawn({x: this.x, y: this.y, angle: this.angle + Math.PI/2});
};
