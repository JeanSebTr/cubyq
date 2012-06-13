
module.exports = function(io, domain) {
	var nsp = io.of('/editor');

	var ioMethods = {
		createMap: function() {
			if(!arguments.length) return;
			var cb = Array.prototype.slice.call(arguments, -1)[0];
			if(typeof cb != 'function') return;
			var map = new domain.Map();
			map.name = 'Untitled';
			map.save(function(err) {
				cb(map.toObject());
			});
		},
		renameMap: function(data) {
			console.log('renameMap :', arguments);
			if(!data) return;
			domain.Map.update({_id: data._id}, {name: data.name},
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
			domain.Map.find({}, function(err, maps) {
				if(err) {
					console.log('Error finding maps :', err);
					cb(res);
				}
				else {
					maps.forEach(function(map) { this.push(map.toObject()); }, res);
					cb(res);
				}
			});
		}
	};
	nsp.on('connection', function(socket) {
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
