
var JSGame;
(function() {

function Layer(layer, map) {
	this.id = layer._id;
	this.z = layer.order;
	this.map = map;
	this.name = ko.observable(layer.name);
	this.canvas = document.createElement('canvas');
    this.canvas.width = 10*JSGame.tilesSize;
    this.canvas.height = 10*JSGame.tilesSize;
    this.ctx = this.canvas.getContext('2d');

    $('#tilesets').append(this.canvas);

    this.x = 0;
    this.y = 0;

    this.tiles = {};
}

Layer.prototype = {
    addTiles: function(tiles) {
        for(var i=0; i<tiles.length; i++) {
            if(tiles[i]) {
                var tile = tiles[i];
                var x = tile.pos.x;
                var y = tile.pos.y;
                this.preDraw(x, y,
                    this.tiles[x+':'+y] = {
                        x: tile.tilepos.x,
                        y: tile.tilepos.y,
                        tileset: tile.tileset
                    });
            }
        }
    },
    updateTile: function(tile) {
        var x = tile.x, y = tile.y;
        if(!tile.tile && this.tiles[x+':'+y]) {
            delete this.tiles[x+':'+y];
        }
        this.preDraw(x, y, tile.tile);
    },
    update: function(layer) {
        this.z = layer.order;
        this.name(layer.name);
    },
    render: function(ctx, x, y, w, h) {
        var _x = x - this.x*JSGame.tilesSize;
        var sx, dx, dw;
        if(_x<0) {
            sx = 0;
            dx = -_x;
        }
        else {
            sx = _x;
            dx = 0;
        }
        var _y = y - this.y*JSGame.tilesSize;
        if(_y<0) {
            sy = 0;
            dy = -_y;
        }
        else {
            sy = _y;
            dy = 0;
        }

        var dw = (this.canvas.width<w)?this.canvas.width:w;
        if(dw+sx>this.canvas.width) {
            dw-= dw+sx-this.canvas.width;
        }
        var dh = (this.canvas.height<h)?this.canvas.height:h;
        if(dh+sy>this.canvas.height) {
            dh-= dh+sy-this.canvas.height;
        }
        //console.log([_x, _y]);

        //console.log(['to render', _x, _y, x, y, w, h]);
        //console.log(['render', sx, sy, dw, dh, dx, dy, dw, dh]);
        ctx.drawImage(this.canvas, sx, sy, dw, dh, dx, dy, dw, dh);
    },
    preDraw: function(x, y, tile) {
        if(x < this.x) {
            var dx = this.x - x;
            var data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.x = x;
            this.canvas.width = this.canvas.width + dx*JSGame.tilesSize;
            this.ctx.putImageData(data, dx*JSGame.tilesSize, 0);
        }
        if(x > this.x + (this.canvas.width/JSGame.tilesSize)-1) {
            var data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.width = (x - this.x + 1)*JSGame.tilesSize;
            this.ctx.putImageData(data, 0, 0);
        }
        if(y < this.y) {
            var dy = this.y - x;
            var data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.y = y;
            this.canvas.height = this.canvas.height + dy*JSGame.tilesSize;
            this.ctx.putImageData(data, 0, dy*JSGame.tilesSize);
        }
        if(y > this.y + (this.canvas.height/JSGame.tilesSize)-1) {
            var data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.height = (y - this.y + 1)*JSGame.tilesSize;
            this.ctx.putImageData(data, 0, 0);
        }
        var self = this;
        self.ctx.clearRect(
            this.x*JSGame.tilesSize+x*JSGame.tilesSize,
            this.y*JSGame.tilesSize+y*JSGame.tilesSize,
            JSGame.tilesSize, JSGame.tilesSize);
        if(tile) {
            JSGame.Tilesets.get(tile.tileset || tile.id, function(img) {
                self.ctx.drawImage(img,
                    tile.x*JSGame.tilesSize, tile.y*JSGame.tilesSize,
                    JSGame.tilesSize, JSGame.tilesSize,
                    x*JSGame.tilesSize-self.x*JSGame.tilesSize,
                    y*JSGame.tilesSize-self.y*JSGame.tilesSize,
                    JSGame.tilesSize, JSGame.tilesSize);
            });
        }
    }
};

JSGame.Layer = Layer;
})();
