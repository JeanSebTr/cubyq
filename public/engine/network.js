
var Game;

(function() {

function Network(io) {
	
    this.worlds = [];

    this.io = io;
    this.timeDiff = 0;
    io.on('layerCreated', this.addLayer.bind(this));
    io.on('updateMap', this.updateMap.bind(this));
    setInterval(this.syncTime.bind(this), 5000);
}

Network.prototype = {
	listLayers: function(id, cb) {
		this.io.emit('listLayers', id, function(layers) {
			cb(layers);
		});
	},
    addWorld: function(world) {
        this.io.emit('joinMap', world.id);
        this.worlds.push(world);
    },
    addLayer: function(layer) {
        var i, l = this.worlds.length;
        for(i=0;i<l && this.worlds[i].id != layer.map; i++);
        if(i<l) {
            this.worlds[i].addLayer(layer);
        }
    },
    updateMap: function(data) {
        var i;
        var map = data.map;
        var part = data.part;
        for(i=0; i<this.worlds.length && map != this.worlds[i].id; i++);
        if(i<this.worlds.length) {
            this.worlds[i].updateMap(part);
        }
    },
    syncTime: function() {
        var self = this;
        var start = Date.now();
        this.io.emit('timeChallenge', start, function(time) {
            self.timeDiff = start - time;
        });
    }
};


Game.Network = Network;
})();
