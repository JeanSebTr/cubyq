
var mongoose = require('mongoose');

var db = mongoose.connection;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TileSchema = new Schema({
    name: String,
    properties: [{name: String, value: String}],
    tileset: ObjectId,
    pos: {x: Number, y: Number}
});

var TileModel = mongoose.model('Tile', TileSchema);
module.exports = TileModel;
