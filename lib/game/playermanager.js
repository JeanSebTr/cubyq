goog.provide('game.PlayerManager');

goog.require('jx.Manager');



/**
 * @constructor
 */
game.PlayerManager = function() {
  jx.Manager.call(this);
};
goog.inherits(game.PlayerManager, jx.Manager);


game.playerManager.prototype.spawn = function(data) {
  this.push(new game.Player({x: data.x, y: data.y}));
};
