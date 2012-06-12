var Game;
(function() {

function Entity(init) {
  this.x = init.x || 0;
  this.y = init.y || 0;
}
Entity.prototype = {
  type: 0, // bitmask
  collideWidth: 0, // bitmask of Entity.types
  update: function(dt) {},
  collide: function(entity) {}
};

Game.Entity = Entity;

})();
