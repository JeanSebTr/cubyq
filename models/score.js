
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ScoreSchema = new Schema({
    value: Number
});

var ScoreModel = mongoose.model('Score', ScoreSchema);
module.exports = ScoreModel;
