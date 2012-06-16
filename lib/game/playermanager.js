goog.provide('game.PlayerManager');

goog.require('jx.Manager');



/**
 * @constructor
 */
game.PlayerManager = function() {
  jx.Manager.call(this);
};
goog.inherits(game.PlayerManager, jx.Manager);


game.PlayerManager.prototype.spawn = function(data) {
  console.log(data);
  this.push(new game.PlayerRemote({x: data.x, y: data.y}));
};


game.PlayerManager.prototype.updatePlayer = function(playerId) {
};
