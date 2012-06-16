goog.provide('game.Player');

goog.require('game.Sprite');
goog.require('jx.Object2D');
goog.require('game.Wave');


/**
 * @constructor
 * @extends {jx.Object2D}
 */
game.Player = function(params) {
  var self = this;
  jx.Object2D.call(this, params);
  this.id = params.id;
  this.isNaked = true;
  this.angle = 0;
  this.velocityMax = 100;
  this.rotationVelocity = 0.5;
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
goog.inherits(game.Player, jx.Object2D);


/**
 *
 */
game.Player.prototype.serialize= function() {
  var tmp = {};
  tmp.id = this.id;
  tmp.isNaked = this.isNaked;
  tmp.x = this.x;
  tmp.y = this.y;
  tmp.velocityMax = this.velocityMax;
  tmp.velocity = this.velocity;
  tmp.angle = this.angle;
  tmp.state = this.img.state;
  tmp.nbBobettes = this.nbBobettes;
  tmp.points = this.points;
  tmp.health = this.health;
  tmp.DOWN = Game.controler.DOWN;
  tmp.UP = Game.controler.UP;
  tmp.LEFT = Game.controler.LEFT;
  tmp.RIGHT = Game.controler.RIGHT;
  return JSON.stringify(tmp);
};



/**
 *
 */
game.Player.prototype.update = function(deltaTime) {
  var self = this;

  if (Game.controler.UP) {
    this.x += Math.cos(this.angle) * Game.controler.UP * this.velocityMax * deltaTime / 1000;
    this.y += Math.sin(this.angle) * Game.controler.UP * this.velocityMax * deltaTime / 1000;
  }
  if (Game.controler.DOWN) {
    this.x -= Math.cos(this.angle) * Game.controler.DOWN * this.velocityMax * deltaTime / 1000;
    this.y -= Math.sin(this.angle) * Game.controler.DOWN * this.velocityMax * deltaTime / 1000;
  }
  if (Game.controler.LEFT) {
    this.angle -= Math.PI * Game.controler.LEFT * this.rotationVelocity * deltaTime / 1000;
  }
  if (Game.controler.RIGHT) {
    this.angle += Math.PI * Game.controler.RIGHT * this.rotationVelocity * deltaTime / 1000;
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


  // Spawn red rings
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


/**
 *
 */
game.Player.prototype.removeFx = function(obj) {
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
game.Player.prototype.render = function() {
  var c = Game.ctx;
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle - Math.PI / 2);

  // Render red rings
  for (var i = 0; i < this.fxs.length; i++) {
    this.fxs[i].render();
  }

  // Field of view
  c.save();
  var fov = 3 * Math.PI / 5;
  var deep = 300;
  var minAngle = (Math.PI - fov) / 2;
  var maxAngle = (fov + Math.PI) / 2;
  var grd = c.createRadialGradient(0, 0, 10, 0, 0, deep);
  //grd.addColorStop(0, 'rgba(0, 0, 1, 0.2)');
  //grd.addColorStop(0.7, 'rgba(0, 0, 1, 0.1)');
  //grd.addColorStop(1, 'rgba(0, 0, 1, 0)');
  grd.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  grd.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
  grd.addColorStop(1, 'rgba(255, 255, 255, 0)');
  c.fillStyle = grd;
  c.beginPath();
  c.moveTo(0, 0);
  c.arc(0, 0, deep, minAngle, maxAngle);
  c.closePath();
  c.fill();
  c.restore();

  // Render player
  this.img.render();

  if (Game.DEBUG_COLLISION) {
    this.renderCollision();
  }

  c.restore();
};


/**
 *
 */
game.Player.prototype.checkCollision = function() {
  for (var i = 0; i < Game.bobetteManager.objs.length; i++) {
    var bobette = Game.bobetteManager.objs[i];
    if (bobette.collide(this.x, this.y, this.radius)) {
      Game.bobetteManager.objs.splice(i, 1);
      this.points++;
      --i;
    }
  }
};


/**
 *
 */
game.Player.prototype.isInFOV = function(x, y) {
  var fov = 3 * Math.PI / 5;
  var deep = 300;
  var minAngle = (Math.PI - fov) / 2;
  var maxAngle = (fov + Math.PI) / 2;
  var c = Game.ctx;
  var res = false;
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle - Math.PI / 2);
  c.beginPath();
  c.moveTo(0, 0);
  c.arc(0, 0, deep, minAngle, maxAngle);
  c.closePath();

  x = Game.globalScale * x;
  y = Game.globalScale * y;
  if (c.isPointInPath(x, y)) {
    res = true;
  }
  c.restore();
  return res;
};


/**
 *
 */
game.Player.prototype.fire = function() {
  this.img.changeState('attack');
  //Game.toiletPaperManager.spawn({x: this.x, y: this.y, angle: this.angle + Math.PI/2});
};
