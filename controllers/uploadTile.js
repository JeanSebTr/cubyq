var fs = require('fs');

var mongoose = require('mongoose');
var Tileset = mongoose.model('TileSet');

module.exports = function(io) {
    return function(req, res) {
        var tileset;
        function saveTileset() {
            tileset.save(function(err) {
                if(err) {
                    console.log('Error saving tileset');
                    res.send(500);
                }
                else {
                    res.send('');
                }
            });
        }
        function updateTileset() {
            if(req.param('name') != tileset.name || !tileset.name) {
                tileset.name = req.param('name') || 'Untitled';
            }
            if(req.files && req.files.tileset && req.files.tileset.path) {
                fs.readFile(req.files.tileset.path, function(err, data) {
                    if(err) {
                        console.log("Can't read uploaded tile :", err);
                        res.send(500);
                    }
                    else {
                        tileset.file = data;
                        saveTileset();
                    }
                });
            }
            else {
                saveTileset();
            }
        }
        if(!req.param('tileset')) {
            tileset = new Tileset();
            updateTileset();
        }
        else {
            Tileset.findById(req.param('tileset'), function(err, doc) {
                if(err || !doc) {
                    res.send(404);
                }
                else {
                    tileset = doc;
                    updateTileset();
                }
            });
        }
    };
};
