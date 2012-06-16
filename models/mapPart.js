
var mongoose = require('mongoose');

var db = mongoose.connection;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MapPartSchema = new Schema({
    layer: {type:ObjectId, index: true},
    pos: {x: Number, y: Number},
    tiles: [Schema.Types.Mixed]
});
MapPartSchema.index({pos: "2d"}, {min: -10000, max: 10000 });

var MapPartModel = mongoose.model('MapPart', MapPartSchema);
module.exports = MapPartModel;
