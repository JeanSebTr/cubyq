
var Game;

(function() {

function Network(io) {
	this.io = io;
	this.world = null;
}

Network.prototype = {
	setWorld: function(world) {
		this.world = 0;
	}
};


Game.Network = Network;
})();
