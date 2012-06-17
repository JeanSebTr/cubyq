
var JSGame;
(function () {

var _tilesets = {};

var Tilesets = {
    get: function(id, cb) {
        if(_tilesets[id] && _tilesets[id].loaded) {
            return cb(_tilesets[id].img);
        }
        var tileset;
        if(!_tilesets[id]) {
            tileset = {
                img: new Image(),
                loaded: false,
                callbacks: [cb]
            };
            tileset.img.onload = function() {
                console.log(['Loaded tileset :', id]);
                tileset.loaded = true;
                for(var i=0; i<tileset.callbacks.length; i++) {
                    tileset.callbacks[i](tileset.img);
                }
            };
            tileset.img.onerror = function(err) {
                console.log(['Error loading tileset :', err]);
            };
            _tilesets[id] = tileset;
            tileset.img.src = '/tilesets/'+id+'.png';
        }
        else {
            tileset = _tilesets[id];
            tileset.callbacks.push(cb);
        }
    }
};

JSGame.Tilesets = Tilesets;
})();

