
var mongoose = require('mongoose');

var db = mongoose.connection;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TileSetSchema = new Schema({
    name: String,
    witdh: Number,
    height: Number,
    file: Buffer,
    tiles: [ObjectId]
});

var TileSetModel = mongoose.model('TileSet', TileSetSchema);
module.exports = TileSetModel;
