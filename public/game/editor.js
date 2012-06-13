var Game, ko;

function Editor(viewport, panel, canvas) {
  var self = this;

  // an observable linking window and canvas size
  this.size = ko.observable({w: 150, h: 150});

  //
  this.viewport = viewport;

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
  drawOverlay: function() {

    var pos = this.viewport.position()
      , select = this.selection()
      , ctx = this.ctx
      , canvas = this.canvas
      , tileSize = 50;

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
      ctx.moveTo(x, 15);
      ctx.lineTo(x, 40);
      ctx.moveTo(x, canvas.height - 40);
      ctx.lineTo(x, canvas.height - 15);
      x+=tileSize;
    }
    
    // horizontal bar
    var dy = pos.y%1*-1
      , y = Math.round(dy*tileSize);
    while(y<canvas.height) {
      ctx.moveTo(15, y);
      ctx.lineTo(40, y);
      ctx.moveTo(canvas.width - 40, y);
      ctx.lineTo(canvas.width - 15, y);
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
    this.netEntity = new Game.Network(io.connect('/entities'));
    this.netEditor = new Game.Network(io.connect('/editor'));

    this.viewport = new Game.Viewport(document.getElementById('editor'));

    var panel = $('#panel');
    this.editor = new Editor(this.viewport, panel, document.getElementById('overlay'));
    
    this._fps = panel.find('.fps');
    this.frames = [];
    this.last_fps = Math.round(Date.now()/500);

    ko.applyBindings(this.editor);

    callback();
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
    this.viewport.draw();
  },
  destroy: function() {
    
  }
});
