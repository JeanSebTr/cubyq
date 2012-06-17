
var JSGame;
(function() {

function World(id, provider, ready) {
  self = this;

  if(ready) {
    this.ready = ready;
  }

  this.id = id;

  this.layers = ko.observableArray();
  this.limits = {};

  this.provider = provider;
  provider.listLayers(id, function(layers) {
    layers.forEach(function(layer) {
      self.addLayer(new JSGame.Layer(layer, self));
    });
  });
  provider.addWorld(this);
}
World.prototype = {
  addLayer: function(layer) {
    var layers = this.layers();
    layers.push(layer);
    this.provider.getLayer(layer.id);
    this.layers(layers.sort(this.sortLayers));
  },
  updateLayer: function(layer) {
    var layers = this.layers();
    for(var i=0; i<layers.length; i++) {
      if(layers[i].id == layer._id) {
        layers[i].update(layer);
      }
    }
    this.layers(layers.sort(self.sortLayers));
  },
  updateTile: function(tile) {
    var layers = this.layers();
    var layer = tile.layer;
    for(var i=0; i<layers.length; i++) {
      if(layer == layers[i].id) {
        layers[i].updateTile(tile);
      }
    }
  },
  updateMap: function(data) {
    var ready = true;
    var layers = this.layers();
    var layer = data.layer;
    for(var i=0; i<layers.length; i++) {
      if(layer == layers[i].id) {
        layers[i].loaded = true;
        layers[i].addTiles(data.tiles);
      }
      if(!layers[i].loaded) {
        ready = false;
      }
    }
    if(ready && this.ready) {
      this.ready();
      this.ready = null;
    }
  },
  render: function(opts) {
    var ctx = opts.ctx;
    var x = opts.x || 0;
    var y = opts.y || 0;
    var w = opts.w || JSGame.tilesSize;
    var h = opts.h || JSGame.tilesSize;
    var from = opts.from || 0;
    var to = opts.to || 10000;
    var layers = this.layers();
    for(var i=0; i<layers.length && layers[i].z<to; i++) {
      if(layers[i].z >= from) {
        layers[i].render(ctx, x, y, w, h);
      }
    }
  },
  sortLayers: function(a, b) {
    return a.z - b.z;
  },
  setLimit: function(x, y, w, h) {
    this.limits = {x: x, y: y, w: w, h: h};
    var layers = this.layers();
    for(var i=0; i<layers.length; i++) {
      layers[i].setLimit(this.limits);
    }
  }
};

JSGame.World = World;
})();
