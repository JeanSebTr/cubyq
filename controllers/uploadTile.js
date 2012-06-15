var fs = require('fs');
var path = require('path');

var mongoose = require('mongoose');
var Tileset = mongoose.model('TileSet');

function moveTileset(from, to) {
    fs.unlink(to, function(err) {
        fs.rename(from, to, function(err){
            if(err) {
                console.log('Error moving tileset :', err);
            }
        });
    });
}

module.exports = function(io) {
    return {
        upload: function(req, res) {
            var tileset;
            function saveTileset() {
                tileset.save(function(err) {
                    if(err) {
                        console.log('Error saving tileset');
                        res.send(500);
                    }
                    else {
                        res.send('');
                        moveTileset(req.files.tileset.path,
                            path.join(__dirname, '..', 'public', 'tilesets', tileset._id+'.png'));
                    }
                });
            }
            function updateTileset() {
                if(req.param('name') != tileset.name || !tileset.name) {
                    tileset.name = req.param('name') || tileset.name || 'Untitled';
                }
                console.log('File', req.files.tileset);
                if(req.files && req.files.tileset && req.files.tileset.path && req.files.tileset.size) {
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
        },
        download: function(req, res) {
            var id = req.param('id');
            Tileset.findById(id, function(err, tileset) {
                if(!err && tileset) {
                    res.header('Content-Length', tileset.file.length);
                    res.contentType('png');
                    res.end(tileset.file);
                    fs.writeFile(path.join(__dirname, '..', 'public', 'tilesets', tileset._id.toString()+'.png'),
                        tileset.file, function(err) {
                            if(err) {
                                console.log('Error saving tileset :', err);
                            }
                        });
                }
                else {
                    console.log('Tileset not found :', id);
                    res.send(404);
                }
            });
        }
    }
};
