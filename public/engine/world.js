
var Game;
(function() {

function World(id, provider) {
  self = this;

  this.id = id;

  this.layers = ko.observableArray();
  this.limits = {};

  this.provider = provider;
  provider.listLayers(id, function(layers) {
    var res = [];
    layers.forEach(function(layer) {
      res.push(new Game.Layer(layer, self));
    });
    self.layers(res.sort(self.sortLayers));
  });
  provider.addWorld(this);
}
World.prototype = {
  addLayer: function(layer) {
    var layers = this.layers();
    layers.push(layer);
    this.layers(layers.sort(this.sortLayers));
  },
  updateMap: function(part) {
    var layers = this.layers();
    var layer = part.layer;
    for(var i=0; i<layers.length; i++) {
      if(layer == layers[i].id) {
        layers[i].addPart(part);
      }
    }
  },
  render: function(opts) {
    var ctx = opts.ctx;
    var x = opts.x || 0;
    var y = opts.y || 0;
    var w = opts.w || Game.tilesSize;
    var h = opts.h || Game.tilesSize;
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

Game.World = World;
})();
