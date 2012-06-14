
var mongoose = require('mongoose');

var db = mongoose.connection;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MapLayerSchema = new Schema({
    map: {type: ObjectId, index: true},
    name: String,
    order: {type: Number, default: 0},
    properties: [{name: String, value: String}]
});

var MapLayerModel = mongoose.model('MapLayer', MapLayerSchema);
module.exports = MapLayerModel;
