
var Game;

(function() {

function Network(io) {
	this.io = io;
}

Network.prototype = {
	listLayers: function(id, cb) {
		this.io.emit('listLayers', id, function(layers) {
			cb(layers);
		});
	},
	joinMap: function(id) {
		this.io.emit('joinMap', id);
	}
};


Game.Network = Network;
})();
