
var mongoose = require('mongoose');

var db = mongoose.connection;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TileSchema = new Schema({
    layer: {type:ObjectId, index: true},
    pos: {
        x: {type: Number, default: 0},
        y: {type: Number, default: 0}
    },
    tileset: ObjectId,
    tilepos: {x: Number, y: Number}
});
TileSchema.index({pos: "2d"}, {min: -100000, max: 100000 });
TileSchema.index({layer: 1, pos: 1}, {unique: true});

var TileModel = mongoose.model('Tile', TileSchema);
module.exports = TileModel;
