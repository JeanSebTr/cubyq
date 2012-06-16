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
  this.push(new game.PlayerRemote({id: data.id, x: data.x, y: data.y}));
};


/** */
game.PlayerManager.prototype.updatePlayer = function(data) {
  var id = data.id;
  var j = 1;
  for (var i = 0; i < this.objs.length; i++) {
    if (this.objs[i].id == id) {
      var player = this.objs[i];
      player.x = data.x;
      player.y = data.y;
      player.angle = data.angle;
      player.state = data.state;
      player.points = data.points;
      break;
    }
  }
};
