
var Game;
(function() {

function World() {
  this.isUpdating = false;
  this.entities = [];
  this.deferedEntities = []; // 
}
World.prototype = {
  addEntity: function(entity) {
    if(this.isUpdating) {
      this.deferedEntities.push(entity);
    }
    else {
      this.entities.push(entity);
    }
  },
  update: function(dt) {
    this.isUpdating = true;
    var i = this.entities.length, j, entity1;
    var firstPass = true; // ensure every entity is updated once before checking collisions
    while(--i>=0) {
      entity1 = this.entities[i];
      if(firstPass) entity1.update(dt);
      j = i;
      while(--j>=0) {
        if(firstPass) this.entities[j].update(dt);
        entity1.collide(this.entities[j]);
      }
      // all entities updated, now just check collisions
      firstPass = false;
      
      if(this.map && entity1.properties & Game.COLLIDE_WITH_MAP) {
        
      }
    }
  }
};

Game.World = World;
})();
