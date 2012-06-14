
var Game;
(function() {

function Layer(layer, map) {
	this.id = layer._id;
	this.z = layer.order;
	this.map = map;
	this.name = ko.observable(layer.name);
	this.canvas = document.createElement('canvas');
}

Game.Layer = Layer;
})();
