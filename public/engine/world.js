
var Game;
(function() {

function World(id, provider) {
  self = this;

  this.id = id;
  this.provider = provider;
  provider.joinMap(id);

  this.layers = ko.observableArray();
  this.limits = ko.observable({
    x: 0, y: 0, w: 0, h: 0
  });

  provider.listLayers(id, function(layers) {
    console.log('Layers listed for', id, ':', layers);
    var res = [];
    layers.forEach(function(layer) {
      res.push(new Game.Layer(layer, self));
    });
    self.layers(res.sort(self.sortLayers));
  });
  provider.io.on('layerCreated', function(layer) {
    console.log(['layerCreated :', layer]);
    var res = self.layers();
    res.push(new Game.Layer(layer, self));
    self.layers(res.sort(self.sortLayers));
  });

  this.isUpdating = false;
  this.entities = [];
  this.deferedEntities = [];
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
  },
  sortLayers: function(a, b) {
    return a.z - b.z;
  },
  setLimit: function(x, y, w, h) {
    this.limits({x: x, y: y, w: w, h: h});
  }
};

Game.World = World;
})();
