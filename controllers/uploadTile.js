var mongoose = require('mongoose');
var Tileset = mongoose.model('TileSet');

module.exports = function(io) {
    return function(req, res) {
        var tileset;
        if(!req.param('tileset')) {
            tileset = new Tileset();
        }
        console.log('Upload !', req, res);
        res.send('');
    };
};