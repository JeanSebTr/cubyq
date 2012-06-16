goog.provide('game.BobetteManager');

goog.require('jx.Manager');



/**
 * @constructor
 */
game.BobetteManager = function() {
  jx.Manager.call(this);
};
goog.inherits(game.BobetteManager, jx.Manager);


game.BobetteManager.prototype.spawn = function(params) {
  params = params || {};
  this.push(new game.Bobette(params));
};
