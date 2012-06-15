goog.provide('game.FxManager');

goog.require('jx.Manager');



/**
 * @constructor
 */
game.FxManager = function() {
  jx.Manager.call(this);
};
goog.inherits(game.FxManager, jx.Manager);


game.FxManager.prototype.spawnRing = function(params) {
  params = params || {};
  var self = this;
  var circle = new game.Sprite({img: Game.medias.ring_01, width: 500, height: 500})
      .setState({label: 'normal', frames: [0], opacity: 1, scale: 0, loop: true, layers: [0], x: params.x, y: params.y, delay: params.delay})
      .animate({opacity: 1, scale: 1, duration: 1200, fn: 'linear', callback: function() { self.remove(this); }});
  this.push(circle);
};
