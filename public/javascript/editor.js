var Game;

function Editor(canvas, panel, w, h) {
    // dom
    this._fps = panel.find('.fps');
    
    // map
    this.mapPos = ko.observable({x: 0.0, y: 0.0, m: true});
    this.tileSize = 50;
    
    // canvas
    this.canvas = canvas;
    canvas.width = w - 250;
    canvas.height = h;
    this.ctx = canvas.getContext('2d');
    this.loop = this.loop.bind(this);
    this.fps = new FPS(Date.now());
    window.requestAnimationFrame(this.loop);
}
Editor.prototype = {
  resize: function(w, h) {
    this.canvas.width = w - 250;
    this.canvas.height = h;
  },
  loop: function(now) {
    if(!now) now = Date.now();
    window.requestAnimationFrame(this.loop);
    
    // draw
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMetrics();
    
    // stats
    this.fps.increment(now);
    this._fps.text(this.fps.calc());
  },
  drawMetrics: function() {
    var ctx = this.ctx
      , pos = this.mapPos();
    ctx.save();
    
    // prepare style
    ctx.lineWidth = 1;
    ctx.lineCap = 1;
    ctx.strokeStyle = '#FF0000';
    ctx.beginPath();
    
    // vertical bar
    var dx = pos.x%1*-1
      , x = Math.round(dx*this.tileSize);
    while(x<this.canvas.width) {
      ctx.moveTo(x, 15);
      ctx.lineTo(x, 40);
      ctx.moveTo(x, this.canvas.height - 40);
      ctx.lineTo(x, this.canvas.height - 15);
      x+=this.tileSize;
    }
    
    // horizontal bar
    var dy = pos.y%1*-1
      , y = Math.round(dy*this.tileSize);
    while(y<this.canvas.height) {
      ctx.moveTo(15, y);
      ctx.lineTo(40, y);
      ctx.moveTo(this.canvas.width - 40, y);
      ctx.lineTo(this.canvas.width - 15, y);
      y+=this.tileSize;
    }
    
    // draw
    ctx.stroke();
    ctx.restore();
  }
};

Game.addState('Editor', {
  init: function() {
  },
  update: function(now) {
    
  },
  destroy: function() {
  }
});
