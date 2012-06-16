
var mongoose = require('mongoose');
var MapPart = mongoose.model('MapPart');
var MapLayer = mongoose.model('MapLayer');

module.exports = function(io) {

	var ioMethods = {
		listLayers: function(mapId, cb) {
			console.log('listLayers', mapId);
			MapLayer.find({map: mapId}, function(err, layers) {
				if(err) {
					console.log("Can't get layers for map ", mapId, err);
					cb([]);
				}
				else {
					var res = [];
					layers.forEach(function(layer) { this.push(layer.toObject()); }, res);
					cb(res);
				}
			});
		},
		getLayer: function(layerId) {
			var socket = this;
			MapLayer.findById(layerId || '', function(err, layer) {
				if(err || !layer) {
					console.log("Can't find layer", layerId, err);
				}
				else {
					MapPart.find({layer: layer._id}, function(err, parts) {
						if(err) {
							console.log();
						}
						else {
							var res = [];
							parts.forEach(function(part) {this.push(part.toObject());}, res);
							console.log('emit parts', res.length);
							socket.emit('updateMap', {
								map: layer.map,
								parts: res
							});
						}
					});
				}
			});
		},
		joinMap: function(mapId) {
			console.log('Try to join map :', mapId);
			this.join('map:'+mapId);
		}
	};
	io.on('connection', function(socket) {
		// proxy to authenticate user
		function auth(method) {
			var socket = this// socket
				, args = Array.prototype.slice.call(arguments, 1);

			// do authentification

			// call method
			ioMethods[method].apply(socket, args);
		}
		for(var method in ioMethods) {
			socket.on(method, auth.bind(socket, method));
		}
	});
};
