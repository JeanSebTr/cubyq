
var Game;
(function() {

function Viewport(canvas) {
	var self = this;
	this.tilesSize = Game.tilesSize;
	this.viewRatio = 2.1;

	// main canvas
	if(window.G_vmlCanvasManager) {
		G_vmlCanvasManager.initElement(canvas);
	}
	this.ctx = canvas.getContext('2d');
	this.canvas = canvas;

	this.world = ko.observable(null);

	this.size = ko.observable({w: 150, h: 150}).extend({ throttle: 100 });
	this.position = {
		x: ko.observable(0),
		y: ko.observable(0)
	};

	// need freaking fast access to those values
	this.comPos = ko.computed(function() { return {x: self.position.x(), y: self.position.y()}; });
	this.comPos.subscribe(function(val){self.pos = val; });
	this.pos = this.comPos();
}

Viewport.prototype = {
	pxToCoord: function(x, y, floor) {
		console.log(['Convert',x,':',y,' relative',this.pos.x, ':', this.pos.y, this.tilesSize]);
		var _x = this.pos.x*1 + (x/this.tilesSize);
		var _y = this.pos.y*1 + (y/this.tilesSize);
		console.log(['Converted', (x/this.tilesSize), _x, _y]);
		return {
			x: floor?Math.floor(_x):_x,
			y: floor?Math.floor(_y):_y
		};
	},
	coordToPx: function(x, y) {
		return {
			x: (x - this.pos.x)*this.tilesSize,
			y: (y - this.pos.y)*this.tilesSize
		};
	},
	setWorld: function(world) {
		this.world(world);
	},
	contains: function(entity) {

	},
	drawWorld: function() {
		var world = this.world();
		if(world) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			var size = this.size();
			world.render({
				ctx: this.ctx,
				x: this.pos.x*this.tilesSize,
				y: this.pos.y*this.tilesSize,
				w: size.w,
				h: size.h
			});
		}
	}
};

Game.Viewport = Viewport;
})();
