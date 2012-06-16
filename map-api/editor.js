
var mongoose = require('mongoose');
var Map = mongoose.model('Map');
var MapLayer = mongoose.model('MapLayer');
var Tileset = mongoose.model('TileSet');
var MapPart = mongoose.model('MapPart');

module.exports = function(io) {

	function saveTiles(part, map) {
		part.save(function(err) {
			if(err) {
				console.log("Can't save map part :", err);
			}
			else {
				io.sockets.in('map:'+map).emit('updateMap', {
					map: map,
					part: part.toObject()
				});
			}
		});
	}

	function drawTile(draw, layer) {
		var x = Math.floor(draw.x/10)*10;
		var y = Math.floor(draw.y/10)*10;

		MapPart.findOne({
			layer: layer._id,
			'pos.x': x,
			'pos.y': y
		}, function(err, part) {
			if(err) {
				console.log("Can't load map part", err);
				return;
			}
			else if(!part) {
				part = new MapPart();
				part.layer = layer._id;
				part.pos = {
					x: x,
					y: y
				};
				part.tiles = new Array(100); // 10x10 tiles / part
			}
			var i = ((draw.y-y)%10)*10+((draw.x-x)%10);
			var tile = draw.tile;
			part.tiles[i] = {
				tileset: tile.id,
				x: tile.x,
				y: tile.y
			};
			part.markModified('tiles');
			saveTiles(part, layer.map);
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
		drawTile: function(tile) {
			MapLayer.findById(tile.layer, function(err, layer) {
				if(err || !layer || !tile.tile) {
					console.log("Can't find layer", tile.layer, err);
				}
				else {
					Tileset.findById(tile.tile.id, function(err, tileset) {
						if(err || !tileset) {
							console.log("Can't find tileset", tile.tile.id, err);
						}
						else {
							drawTile(tile, layer);
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
