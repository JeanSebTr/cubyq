
var mongoose = require('mongoose');

var db = mongoose.connection;
var Schema = mongoose.Schema;

var MapSchema = new Schema({
    name: String
});

var MapModel = mongoose.model('Map', MapSchema);
module.exports = MapModel;
