
var Game;
(function() {

function Viewport(canvas) {
	var self = this;

	// main canvas
	if(window.G_vmlCanvasManager) {
		G_vmlCanvasManager.initElement(canvas);
	}
	this.ctx = canvas.getContext('2d');
	this.canvas = canvas;
	this.tilesSize = 32;

	this.mapObj = ko.observable(null);

	this.position = ko.observable({x: 0, y: 0});
	this.position.subscribe(function(val) {
		self.pos = val; // need freaking fast access to this value
	});
	this.pos = this.position();
}

Viewport.prototype = {
	pxToCoord: function(x, y) {
		return {
			x: this.pos.x + x/this.tilesSize,
			y: this.pos.y + y/this.tilesSize
		};
	},
	coordToPx: function(x, y) {
		return {
			x: (x - this.pos.x)*this.tilesSize,
			y: (y - this.pos.y)*this.tilesSize
		};
	},
	track: function(entity) {
		this.trackEntity = entity;
	},
	update: function() {

		// entity tracking
		if(true) {

		}
	},
  contains: function(entity) {
    
  },
  drawWorld: function() {
    
  },
  drawEntity: function(entity) {

  }
};

Game.Viewport = Viewport;
})();
