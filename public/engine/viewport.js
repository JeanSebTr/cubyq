
var Game;
(function() {

function Viewport(canvas) {
	if(window.G_vmlCanvasManager) {
		G_vmlCanvasManager.initElement(canvas);
	}
	this.ctx = canvas.getContext('2d');
	this.canvas = canvas;

	this.position = ko.observable({x: 0, y: 0});
	this.tilesSize = 50;
}

Viewport.prototype = {
	pxToCoord: function(x, y) {
		var pos = this.position();
		return {
			x: pos.x + x/this.tilesSize,
			y: pos.y + y/this.tilesSize
		};
	},
	coordToPx: function(x, y) {
		var pos = this.position();
		return {
			x: (x - pos.x)*this.tilesSize,
			y: (y - pos.y)*this.tilesSize
		};
	},
	track: function(entity) {
		this.trackEntity = entity;
	},
  contains: function(entity) {
    
  },
  draw: function() {
    
  }
};

Game.Viewport = Viewport;
})();
