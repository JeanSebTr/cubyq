var Game, ko;

function Editor(io, viewport, panel, canvas) {
  var self = this;
  this.io = io;

  // an observable linking window and canvas size
  this.size = ko.observable({w: 150, h: 150}).extend({ throttle: 100 });

  //
  this.viewport = viewport;
  this.mapList = ko.observableArray();
  this.currentMap = ko.observable(null);
  this.io.emit('listMaps', function(maps) {
    maps.forEach(function(map) {
      map.name = ko.observable(map.name || 'Untitled');
      map.name.subscribe(self.renameMap.bind(self, map));
    });
    self.mapList(maps);
  });

  // toolbar
  var maintool = ko.observable("move");
  this.toolbar = {
    maintool: maintool,
    move: ko.computed(function(){ return (maintool() == 'move') }),
    select: ko.computed(function(){ return (maintool() == 'select') })
  };

  // overlay
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.viewport.position.subscribe(this.drawOverlay.bind(this));
  this.size.subscribe(function() {
    setTimeout(self.drawOverlay.bind(self), 10);
  });
  this.selection = ko.observable(false);
  this.selection.subscribe(this.drawOverlay.bind(this));
}
Editor.prototype = {
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
  drawOverlay: function() {

    var pos = this.viewport.position()
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
    ctx.strokeStyle = '#FF0000';
    ctx.beginPath();
    
    // vertical bar
    var dx = pos.x%1*-1
      , x = Math.round(dx*tileSize);
    while(x<canvas.width) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 20);
      x+=tileSize;
    }
    
    // horizontal bar
    var dy = pos.y%1*-1
      , y = Math.round(dy*tileSize);
    while(y<canvas.height) {
      ctx.moveTo(0, y);
      ctx.lineTo(20, y);
      y+=tileSize;
    }
    
    // draw
    ctx.stroke();
    ctx.restore();
  }
};

Game.addState('Editor', {
  resources: [
    
  ],
  init: function(callback) {
    var self = this;
    this.netEntity = new Game.Network(io.connect('/entities'));

    this.viewport = new Game.Viewport(document.getElementById('editor'));

    var panel = $('#panel')
      , _io = io.connect('/editor');
    _io.on('connect', function() {
      self.editor = new Editor(_io, self.viewport, panel, document.getElementById('overlay'));
      
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
    //this.viewport.draw();
  },
  destroy: function() {
    
  }
});
