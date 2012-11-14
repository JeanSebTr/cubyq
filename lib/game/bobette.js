goog.provide('game.Bobette');

goog.require('jx.Object2D');
goog.require('game.Wave');
goog.require('goog.math.Coordinate');
goog.require('goog.math.Line');
goog.require('goog.math.Vec2');



/**
 * @constructor
 */
game.Bobette = function(params) {
  jx.Object2D.call(this, params);
  this.ownerId = params.ownerId;
  this.img = Game.medias.items;

  this.ringDelay = 1000;
  this.ringCounter = 0;
  this.fxs = [];
};
goog.inherits(game.Bobette, jx.Object2D);


/**
 *
 */
game.Bobette.prototype.update = function(deltaTime) {
  var self = this;


  if (this.ownerId == Game.player.id) {
    // If visible in the canvas
    if (this.x >= Game.player.x - Game.canvas.width/2 &&
        this.x <= Game.player.x + Game.canvas.width/2 &&
        this.y >= Game.player.y - Game.canvas.height/2 &&
        this.y <= Game.player.y + Game.canvas.height/2)
    {
      // Spawn red rings
      if (this.ringCounter >= this.ringDelay) {
        this.ringCounter -= this.ringDelay;
        var circle = new game.Wave({callback: function() { self.removeFx(this); }});
        this.fxs.push(circle);
      }
      this.ringCounter += deltaTime;
    }
    // If not visible in the canvas
    else {
      if (this.x > Game.player.x) {
        // Spawn red rings
        if (this.ringCounter >= this.ringDelay) {
          this.ringCounter -= this.ringDelay;
          console.log(this.x, Game.player.x, this.ringCounter, this.ringDelay);
          var circle = new game.Wave({x: Game.player.x + Game.canvas.width/3,
                                      y: Game.player.y - Game.canvas.height/2,
                                      callback: function() { self.removeFx(this); }});
          this.fxs.push(circle);
        }
        this.ringCounter += deltaTime;
      }
    }
  }

  // Update red rings
  for (var i = 0; i < this.fxs.length; i++) {
    this.fxs[i].update(deltaTime);
  }
};


game.Bobette.prototype.removeFx = function(obj) {
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
game.Bobette.prototype.render = function() {
  var c = Game.ctx;
  c.save();
  c.translate(this.x, this.y);
  c.rotate(this.angle);

  // Render red rings
  for (var i = 0; i < this.fxs.length; i++) {
    this.fxs[i].render();
  }

  c.drawImage(this.img, 0, 0, this.w, this.h,
              -this.w / 2, -this.h / 2, this.w, this.h);

  if (Game.DEBUG_COLLISION) {
    this.renderCollision();
  }

  c.restore();
};
