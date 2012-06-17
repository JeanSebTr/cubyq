var Game, ko;

function Editor(io, viewport, panel, canvas) {
  var self = this;
  this.io = io;

  this.tilesets = new TilesetsEditor(io, viewport.tilesSize);

  // map and viewport
  this.viewport = viewport;
  this.mapList = ko.observableArray();
  this.currentMap = ko.observable(null);
  this.currentLayer = ko.observable(null);
  var renaming;
  this.currentLayer.subscribe(function(layer) {
    if(renaming) {
      renaming.dispose();
      renaming = null;
    }
    if(!layer) return;
    renaming = layer.name.subscribe(self.renameLayer.bind(self, layer.id));
  });
  this.io.emit('listMaps', function(maps) {
    maps.forEach(function(map) {
      map.name = ko.observable(map.name || 'Untitled');
      map.name.subscribe(self.renameMap.bind(self, map));
    });
    self.mapList(maps);
  });
  this.io.on('mapCreated', function(map) {
      map.name = ko.observable(map.name || 'Untitled');
      map.name.subscribe(self.renameMap.bind(self, map));
      self.mapList.push(map);
  });
  this.currentMap.subscribe(function(map) {
    if(!map) {
      self.viewport.setWorld(null);
    }
    else {
      var world = new JSGame.World(map._id, self.gameNet);
      self.viewport.setWorld(world);
    }
  });

  // toolbar
  var maintool = ko.observable("move");
  this.toolbar = {
    maintool: maintool,
    move: ko.computed(function(){ return (maintool() == 'move') }),
    select: ko.computed(function(){ return (maintool() == 'select') }),
    draw: ko.computed(function(){ return (maintool() == 'draw') }),
    erase: ko.computed(function(){ return (maintool() == 'erase') })
  };
  this.toolbar.editTile = ko.computed(function(){ return self.toolbar.erase() || self.toolbar.draw(); });

  // overlay
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.viewport.position.x.subscribe(this.drawOverlay.bind(this));
  this.viewport.position.y.subscribe(this.drawOverlay.bind(this));
  this.viewport.size.subscribe(function() {
    setTimeout(self.drawOverlay.bind(self), 10);
  });
  this.selection = ko.observable(false);
  this.selection.subscribe(this.drawOverlay.bind(this));
}
Editor.prototype = {
  // map
  createMap: function() {
    var self = this;
    this.io.emit('createMap', function(map) {
      map.name = ko.observable(map.name || 'Untitled');
      map.name.subscribe(self.renameMap.bind(self, map));
      self.mapList.push(map);
      self.currentMap(map);
    });
  },
  renameMap: function(map, name) {
    this.io.emit('renameMap', {_id: map._id, name: name});
  },
  // layers
  createLayer: function() {
    var map = this.currentMap();
    this.io.emit('createLayer', map._id);
  },
  renameLayer: function(id, name) {
    this.io.emit('renameLayer', {_id: id, name: name});
  },
  upLayer: function() {
    var layer = this.currentLayer();
    if(!layer) return;
    this.io.emit('updateLayer', {
      id: layer.id,
      order: layer.z+1
    });
  },
  downLayer: function() {
    var layer = this.currentLayer();
    if(!layer) return;
    this.io.emit('updateLayer', {
      id: layer.id,
      order: Math.max(0, layer.z-1)
    });
  },
  drawOverlay: function() {

    var pos = this.viewport.comPos()
      , select = this.selection()
      , ctx = this.ctx
      , canvas = this.canvas
      , tileSize = this.viewport.tilesSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.lineWidth = 2;

    // selection zone
    if(select) {
      var start = this.viewport.coordToPx(select.x1, select.y1)
        , end = this.viewport.coordToPx(select.x2, select.y2);
      ctx.strokeStyle = '#0000FF';
      ctx.fillStyle = 'rgba(0, 0, 255, 0.4)';
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(start.x, end.y);
      ctx.lineTo(end.x, end.y);
      ctx.lineTo(end.x, start.y);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
    
    // prepare style
    ctx.strokeStyle = 'rgba(0,0,0, 0.25)';
    ctx.beginPath();
    
    // vertical bar
    var dx = pos.x%1*-1
      , x = Math.round(dx*tileSize);
    while(x<canvas.width) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      x+=tileSize;
    }
    
    // horizontal bar
    var dy = pos.y%1*-1
      , y = Math.round(dy*tileSize);
    while(y<canvas.height) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      y+=tileSize;
    }
    
    // draw
    ctx.stroke();
    ctx.restore();
  },
  drawTile: function(x, y) {
    var tile = this.tilesets.getTile();
    var map = this.currentMap();
    if(!tile || !map) return;

    var layer = this.currentLayer();
    if(!layer) return;

    this.io.emit(this.toolbar.erase()?'eraseTile':'drawTile', {
      tile: this.toolbar.erase()?null:tile,
      x: x,
      y: y,
      layer: layer.id
    });
  },
  setGameNetwork: function(net) {
    this.gameNet = net;
  }
};

JSGame.addState('Editor', {
  resources: [
    
  ],
  init: function(callback) {
    var self = this
      , _io = io.connect();
    var net = new JSGame.Network(_io);

    this.viewport = new JSGame.Viewport(document.getElementById('editor'));

    var panel = $('#panel');
    _io.on('connect', function() {
      self.editor = new Editor(_io, self.viewport, panel, document.getElementById('overlay'));
      self.editor.setGameNetwork(net);
      self._fps = panel.find('.fps');
      self.frames = [];
      self.last_fps = Math.round(Date.now()/500);

      ko.applyBindings(self.editor);

      callback();
    });
  },
  update: function(dt, now) {
    this.frames.push(dt);
    var frame = Math.round(now/500);
    if(frame > this.last_fps) {
      var n=0, fs=this.frames, l=fs.length;
      for(var i=0;i<l; n+=fs[i], i++);
      this.frames = [];
      this._fps.text(Math.round(100000*l/n)/100);
      this.last_fps = frame;
    }
    this.viewport.drawWorld();
  },
  destroy: function() {
    
  }
});
