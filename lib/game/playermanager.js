goog.provide('game.PlayerManager');

goog.require('jx.Manager');



/**
 * @constructor
 */
game.PlayerManager = function() {
  jx.Manager.call(this);
};
goog.inherits(game.PlayerManager, jx.Manager);


/**
 * @param {number} deltaTime Delta time since the last frame.
 */
game.PlayerManager.prototype.update = function(deltaTime) {
  for (var i = this.objs.length - 1; i >= 0; i--) {
    var obj = this.objs[i];
    obj.update(deltaTime);
  }
};


/** */
game.PlayerManager.prototype.render = function() {
  for (var i = this.objs.length - 1; i >= 0; i--) {
    var obj = this.objs[i];
    if (Game.player.isInFOV(obj.x, obj.y)) {
      obj.render();
    }
  }
};


/** */
game.PlayerManager.prototype.spawn = function(data) {
  this.push(new game.PlayerRemote(data));
};


game.PlayerManager.prototype.playerExists = function(playerId) {
  for (var i = 0; i < this.objs.length; i++) {
    if (this.objs[i].id == playerId) {
      return true;
    }
  }
  return false;
};



/** */
game.PlayerManager.prototype.updatePlayer = function(data) {
  var id = data.id;
  var j = 1;
  //console.log(data.id);
  for (var i = 0; i < this.objs.length; i++) {
    if (this.objs[i].id == id) {
      var player = this.objs[i];
      //player.positionBuffer.push(data);
      //return true;
      player.x = data.x;
      player.y = data.y;
      player.angle = data.angle;
      player.state = data.state;
      player.isNaked = data.isNaked;
      player.points = data.points;
      player.DOWN = data.DOWN;
      player.UP = data.UP;
      player.RIGHT = data.RIGHT;
      player.LEFT = data.LEFT;
      player.shamePoints = data.shamePoints;
      player.disgustPoints = data.disgustPoints;
      player.slipsId = data.slipsId;
      break;
    }
  }
};
