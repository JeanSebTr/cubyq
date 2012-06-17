
var mongoose = require('mongoose');
var Map = mongoose.model('Map');
var MapLayer = mongoose.model('MapLayer');
var Tileset = mongoose.model('TileSet');
var MapPart = mongoose.model('MapPart');
var Tile = mongoose.model('Tile');

module.exports = function(io) {

	function updatedFromLayer(layer, tile) {
		MapLayer.findById(layer, function(err, doc) {
			if(err) {
				console.log('Error getting layer', err);
			}
			else if(doc) {
				tile.map = doc.map;
				io.sockets.in('map:'+doc.map).emit('updateTile', tile);
			}
		});
	}

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
			var layer = new MapLayer();
			layer.map = mapId;
			layer.name = 'Untitled';
			layer.save(function(err) {
				io.sockets.in('map:'+mapId).emit('layerCreated', layer);
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
		updateLayer: function(data) {
			MapLayer.findById(data.id, function(err, layer) {
				if(err || !layer) {
					console.log("Can't find layer", data.id);
				}
				else if(layer.order != data.order) {
					layer.order = data.order;
					layer.save(function(err) {
						if(err) {
							console.log('Error saving layer ', layer._id, err);
						}
						else {
							io.sockets.in('map:'+layer.map.toString())
								.emit('updateLayer', layer.toObject());
						}
					});
				}
			});
		},
		listTilesets: function(cb) {
			Tileset.find({}, ['name', 'width', 'tiles'], function(err, tilesets) {
				var res = [];
				if(err || !tilesets) {
					return cb(res);
				}
				tilesets.forEach(function(tileset) {
					this.push({
						id: tileset._id.toString(),
						name: tileset.name,
						width: tileset.width,
						tiles: tileset.tiles
					});
				}, res);
				cb(res);
			});
		},
		eraseTile: function(tile) {
			Tile.findOne({
				layer: tile.layer,
				'pos.x': Math.floor(tile.x),
				'pos.y': Math.floor(tile.y)
			}, function(err, doc) {
				if(err) {
					console.log('Error getting tile', err);
				}
				else if(doc) {
					doc.remove(function(err) {
						if(err) {
							console.log('Error erasing tile', err);
						}
						else {
							updatedFromLayer(tile.layer, tile);
						}
					});
				}
				else {
					// no tile here notify deletion
					updatedFromLayer(tile.layer, tile);
				}
			});
		},
		drawTile: function(tile) {
			Tile.findOne({
				layer: tile.layer,
				'pos.x': Math.floor(tile.x),
				'pos.y': Math.floor(tile.y)
			}, function(err, doc) {
				if(err) {
					console.log('Error getting tile', err);
				}
				else if(doc) {
					doc.tileset = tile.tile.tileset || tile.tile.id;
					doc.tilepos.x = tile.tile.x;
					doc.tilepos.y = tile.tile.y;
					doc.save(function(err){
						if(err) {
							console.log('Error creating tile :', err);
						}
						else {
							updatedFromLayer(tile.layer, tile);
						}
					});
				}
				else {
					doc = new Tile();
					doc.layer = tile.layer;
					doc.pos.x = Math.floor(tile.x);
					doc.pos.y = Math.floor(tile.y);
					doc.tileset = tile.tile.tileset || tile.tile.id;
					doc.tilepos.x = tile.tile.x;
					doc.tilepos.y = tile.tile.y;
					doc.save(function(err) {
						if(err) {
							console.log('Error creating tile :', err);
						}
						else {
							updatedFromLayer(tile.layer, tile);
						}
					});
				}
			});
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
