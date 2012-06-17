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
  this.w = 48;
  this.h = 48;
  this.id = params.id;
  this.velocityMax = 100;
  this.radius = 25 / 2;
  this.rotationVelocity = 1;
  this.img = new game.Sprite({img: Game.medias.character_01, width: 48, height: 48})
      .setState({label: 'stand', loop: true, frames: [0], layers: [0, 1, 2, 3] })
      .setState({label: 'walk', loop: true, frames: [0, 1, 2, 3], layers: [0, 1, 2, 3], fps: 200})
      .setState({label: 'attack', loop: false, frames: [0, 1, 2, 3], layers: [0, 1, 4, 3], fps: 200, callback: function() { console.log('FIN'); self.img.changeState('stand'); }});
  this.States = {STAND: 0, WALK: 1, ATTACK: 2};
  this.fov = 3 * Math.PI / 5;
  this.deep = 300;
  this.minAngle = (Math.PI - this.fov) / 2;
  this.maxAngle = (this.fov + Math.PI) / 2;
  this.lossCoefficientPoint = 15;
  this.lastAValue = Game.controler.A;
  this.pointsLimit = 2000;

  this.resetValues(params);
};
goog.inherits(game.Player, jx.Object2D);

game.Player.prototype.resetValues = function(params){
  this.isNaked = params.isNaked == undefined ? true : params.isNaked;
  this.angle = 0;
  this.state = this.States.STAND;
  this.points = 0;
  this.shamePoints = 0;
  this.disgustPoints = 0;
  this.slipsId = null;
};


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
  tmp.timestamp = Date.now();
  tmp.shamePoints = this.shamePoints;
  tmp.disgustPoints = this.disgustPoints;
  tmp.slipsId = this.slipsId;
  tmp.isGameover = Game.state == Game.States.gameover;
  tmp.name = userData.fbName;
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


  // Update player
  this.img.update(deltaTime);


  // Do we see any other player
  this.updateVision(deltaTime);

  if(this.shamePoints >= this.pointsLimit || this.disgustPoints >= this.pointsLimit){
    console.log('GAMEOVER');
    socket.emit('player-gameover', this.serialize());
    Game.changeState(Game.States.gameover);
  }

  // Collisions with slips
  this.checkCollision();
  this.lastAValue = Game.controler.A;
};


/**
 *
 */
game.Player.prototype.updateVision = function(deltaTime) {
  for (var i = 0; i < Game.playerManager.objs.length; i++) {
    var player = Game.playerManager.objs[i];

    if (this.isInFOV(player.x, player.y)) {
      //les deux on se voitn
      if(player.isInFOV(this.x, this.y)){

        // Je suis nue
        if(this.isNaked){
          this.shamePoints += 20 * this.lossCoefficientPoint * deltaTime / 1000;
          Game.messageManager.spawn(Game.messageManager.Phrases.HO_NON_ON_MA_VUE);
        }

        // Je porte les boxer du dude
        if(this.slipsId && this.slipsId == player.id){
          //TODO: faire ca pas progressif
          this.shamePoints += 200 * this.lossCoefficientPoint * deltaTime / 1000; 
          Game.messageManager.spawn(Game.messageManager.Phrases.EUH_CEST_GENANT);
        }

        // Le dude a mes boxer
        if(player.slipsId && player.slipsId == this.id){
          //TODO: faire ca pas progressif
          this.disgustPoints += 50 * this.lossCoefficientPoint * deltaTime / 1000; 
          this.shamePoints -= 20 * this.lossCoefficientPoint * deltaTime / 1000;  
          Game.messageManager.spawn(Game.messageManager.Phrases.DUDE_CEST_MES_BOBETTES);
        }

        // Je suis habille, il est nue
        if (!this.isNaked && player.isNaked) {
          Game.messageManager.spawn(Game.messageManager.Phrases.IL_DEVRAIT_PORTER);
        }
      }

      //Il ne nous voit pas
      else{
        if(this.isNaked){
          this.shamePoints += 5 * this.lossCoefficientPoint * deltaTime / 1000;
          Game.messageManager.spawn(Game.messageManager.Phrases.IL_DEVRAIT_PORTER);
        }

        // Lui habille, moi naked
        if (!player.isNaked && this.isnaked) {
          //this.shamePoints += 5 * this.lossCoefficientPoint * deltaTime / 1000;
          Game.messageManager.spawn(Game.messageManager.Phrases.OUF_ON_MA_PAS_VU);
        }

        // Le dude a mes boxer
        if(player.slipsId && player.slipsId == this.id){
          //TODO: faire ca pas progressif
          this.disgustPoints += 20 * this.lossCoefficientPoint * deltaTime / 1000; 
          this.shamePoints -= 20 * this.lossCoefficientPoint * deltaTime / 1000;  
          Game.messageManager.spawn(Game.messageManager.Phrases.DUDE_CEST_MES_BOBETTES);
        }
      }

      //ceux qui sont pareils dans les 2 cas
      if(!this.isNaked && !player.isNaked){
        //ouf!!
        Game.messageManager.spawn(Game.messageManager.Phrases.UN_NORMAL);
      }
      if(player.isNaked){
        this.disgustPoints += 10 * this.lossCoefficientPoint * deltaTime / 1000;
        Game.messageManager.spawn(Game.messageManager.Phrases.IL_DEVRAIT_PORTER);
      }
    }
  }
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

  // Field of view
  c.save();
  var grd = c.createRadialGradient(0, 0, 10, 0, 0, this.deep);
  grd.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  grd.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
  grd.addColorStop(1, 'rgba(255, 255, 255, 0)');
  c.fillStyle = grd;
  c.beginPath();
  c.moveTo(0, 0);
  c.arc(0, 0, this.deep, this.minAngle, this.maxAngle);
  c.closePath();
  c.fill();
  c.restore();

  // Render player
  this.img.render();


  // Render gauge
  c.save();
  c.rotate(-(this.angle - Math.PI / 2));
  c.translate(0, this.h / 2 - 5);
  c.globalAlpha = 0.7;
  c.fillStyle = 'black';
  c.fillRect(-this.w / 2, 0, this.w, 6);
  c.fillStyle = 'red';
  var max = Math.max(this.shamePoints, this.disgustPoints);
  var gaugeWidth = max / this.pointsLimit * (this.w - 1);

  c.fillRect(-this.w / 2 + 0.5, 0.5, gaugeWidth, 5);
  c.restore();


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
    if (Game.controler.A &&
        !this.slipsId &&
        bobette.collide(this.x, this.y, this.radius))
    {
      Game.bobetteManager.objs.splice(i, 1);
      --i;
      this.points++;
      this.slipsId = bobette.ownerId;
    } else if (this.slipsId &&
               !bobette.collide(this.x, this.y, this.radius) &&
               Game.controler.A &&
               this.lastAValue == 0)
    {
      Game.bobetteManager.spawn({
          ownerId: this.slipsId,
          x: Math.cos(this.angle) * 50 + this.x,
          y: Math.sin(this.angle) * 50 + this.y
      });
      this.slipsId = null;
    }
  }
};


/**
 *
 */
game.Player.prototype.isInFOV = function(x, y) {
  var c = Game.ctx;
  var res = false;
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle - Math.PI / 2);
  c.beginPath();
  c.moveTo(0, 0);
  c.arc(0, 0, this.deep, this.minAngle, this.maxAngle);
  c.closePath();

  var xx = Game.globalScale * x;
  var yy = Game.globalScale * y;
  if (c.isPointInPath(xx, yy)) {
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
