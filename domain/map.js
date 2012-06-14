

module.exports = function(mongoose, domain) {
	if(!mongoose) {
		return;
	}
  console.log('Load Map\'s models.');

	var Schema = mongoose.Schema
  	, ObjectId = Schema.ObjectId;

  var Map = new Schema({
  	name: String
  });
  domain.Map = mongoose.model('Map', Map);

  var MapLayer = new Schema({
    map: {type: ObjectId, index: true},
    name: String,
    order: {type: Number, default: 0},
    properties: [{name: String, value: String}]
  });
  domain.MapLayer = mongoose.model('MapLayer', MapLayer);

  var MapPart = new Schema({
  	layer: ObjectId,
  	pos: {x: Number, y: Number},
  	tiles: [ObjectId]
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
  	file: Buffer,
  	tiles: [ObjectId]
  });
  domain.TileSet = mongoose.model('TileSet', TileSet);
};
