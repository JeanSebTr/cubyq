
var mongoose = require('mongoose');
var Map = mongoose.model('Map');
var MapLayer = mongoose.model('MapLayer');

module.exports = function(io) {

	var ioMethods = {
		// map methods
		createMap: function() {
			if(!arguments.length) return;
			var cb = Array.prototype.slice.call(arguments, -1)[0];
			if(typeof cb != 'function') return;

			var socket = this
				, map = new Map();
			map.name = 'Untitled';
			map.save(function(err) {
				var m = map.toObject();
				socket.broadcast.emit('mapCreated', m);
				cb(m);
			});
		},
		renameMap: function(data) {
			Map.update({_id: data._id}, {name: data.name},
				function(err, nb) {
					if(err || !nb) {
						console.log('Map not renamed :', arguments);
					}
				});
		},
		listMaps: function() {
			if(!arguments.length) return;
			var cb = Array.prototype.slice.call(arguments, -1)[0];
			if(typeof cb != 'function') return;
			var res = [];
			Map.find({}, function(err, maps) {
				if(err) {
					console.log('Error finding maps :', err);
					cb(res);
				}
				else {
					maps.forEach(function(map) { this.push(map.toObject()); }, res);
					cb(res);
				}
			});
		},
		// layer methods
		createLayer: function(mapId) {
			console.log('Create layer for map ', mapId);
			var layer = new MapLayer();
			layer.map = mapId;
			layer.name = 'Untitled';
			layer.save(function(err) {
				io.sockets.in(mapId).emit('layerCreated', layer);
			});
		},
		renameLayer: function(data) {
			MapLayer.update({_id: data._id}, {name: data.name},
				function(err, nb) {
					if(err || !nb) {
						console.log('Layer not renamed :', arguments);
					}
				});
		},
		listTilesets: function() {
			
		}
	};

	io.on('connection', function(socket) {
		// proxy to authenticate user
		function auth(method) {
			var socket = this// socket
				, args = Array.prototype.slice.call(arguments, 1);

			//TODO: authentification

			// call method
			ioMethods[method].apply(socket, args);
		}
		for(var method in ioMethods) {
			socket.on(method, auth.bind(socket, method));
		}
	});
};
