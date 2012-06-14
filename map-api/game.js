
var mongoose = require('mongoose');
var MapLayer = mongoose.model('MapLayer');

module.exports = function(io, domain) {

	var ioMethods = {
		listLayers: function(mapId, cb) {
			console.log('listLayers', mapId);
			MapLayer.find({map: mapId}, function(err, layers) {
				if(err) {
					console.log('Can\' get layers for map ', mapId, err);
					cb([]);
				}
				else {
					var res = [];
					layers.forEach(function(layer) { this.push(layer.toObject()); }, res);
					cb(res);
				}
			});
		},
		joinMap: function(mapId) {
			console.log('Try to join map :', mapId);
			this.join(mapId);
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
