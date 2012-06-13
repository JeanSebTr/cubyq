

module.exports = function(mongoose, domain) {
	if(!mongoose) {
		return;
	}

	var Schema = mongoose.Schema
  	, ObjectId = Schema.ObjectId;

  var Map = new Schema({
  	name: String
  });
  domain.Map = mongoose.model('Map', Map);

  var MapPart = new Schema({
  	map: ObjectId,
  	layer: Number,
  	pos: {x: Number, y: Number},
  	tiles: []
  });
  MapPart.index({pos: "2d"}, {min: -10000, max: 10000 });
  domain.MapPart = mongoose.model('MapPart', MapPart);

  var Tile = new Schema({
  	name: String,
  	properties: [{name: String, value: String}],
  	tileset: ObjectId,
  	pos: {x: Number, y: Number}
  });
  domain.Tile = mongoose.model('Tile', Tile);

  var TileSet = new Schema({
  	name: String,
  	witdh: Number,
  	height: Number,
  	file: String,
  	tiles: [ObjectId]
  });
  domain.TileSet = mongoose.model('TileSet', TileSet);
};
