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
  this.push(new game.PlayerRemote({id: data.id, x: data.x, y: data.y}));
};


game.PlayerManager.prototype.updatePlayer = function(data) {
  console.log(data);
  var id = data.id;
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
