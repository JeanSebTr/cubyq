
var Game;
(function() {

function Viewport(canvas) {
	if(window.G_vmlCanvasManager) {
		G_vmlCanvasManager.initElement(canvas);
	}
	this.ctx = canvas.getContext('2d');
	this.canvas = canvas;

	this.position = ko.observable({x: 0, y: 0});
}

Viewport.prototype = {
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
