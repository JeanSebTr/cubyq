
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

	this.world = ko.observable(null);

	this.size = ko.observable({w: 150, h: 150}).extend({ throttle: 100 });
	this.position = {
		x: ko.observable(0),
		y: ko.observable(0)
	};
	// need freaking fast access to those values
	this.comPos = ko.computed(function() { return {x: self.position.x(), y: self.position.y()}; });
	this.comPos.subscribe(function(val){self.pos = val;});
	this.pos = this.comPos();
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
	pause: function(pause) {
		// this. // TODO ?
	},
	setWorld: function(world) {
		this.loading = true;
		this.world(world);
	},
	track: function(entity) {
		this.trackEntity = entity;
	},
	update: function() {
		// TODO : track entity
	},
  contains: function(entity) {
    
  },
  drawWorld: function() {
    
  }
};

Game.Viewport = Viewport;
})();
