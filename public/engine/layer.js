
var Game;
(function() {

function Layer(layer, map) {
	this.id = layer._id;
	this.z = layer.order;
	this.map = map;
	this.name = ko.observable(layer.name);
	this.canvas = document.createElement('canvas');
    this.canvas.width = 10*Game.tilesSize;
    this.canvas.height = 10*Game.tilesSize;
    this.ctx = this.canvas.getContext('2d');

    $('#tilesets').append(this.canvas);

    this.x = 0;
    this.y = 0;

    this.tiles = {};
}

Layer.prototype = {
    addPart: function(part) {
        var tiles = part.tiles;
        var pX = part.pos.x;
        var pY = part.pos.y;
        for(var i=0; i<tiles.length; i++) {
            if(tiles[i]) {
                var x = i%10;
                var y = ((i-x)/10)+pY;
                x+=pX;
                this.tiles[x+':'+y] = tiles[i];
                this.preDraw(x, y, tiles[i]);
            }
        }
    },
    render: function(ctx, x, y, w, h) {
        var _x = x - this.x*Game.tilesSize;
        var sx, dx, dw;
        if(_x<0) {
            sx = 0;
            dx = x-_x;
        }
        else {
            sx = _x;
            dx = 0;
        }
        var _y = y - this.y*Game.tilesSize;
        if(_y<0) {
            sy = 0;
            dy = y-_y;
        }
        else {
            sy = _y;
            dy = 0;
        }

        var dw = (this.canvas.width<w)?this.canvas.width:w;
        if(dw+sx>this.canvas.width) {
            dw-=sx;
        }
        var dh = (this.canvas.height<h)?this.canvas.height:h;
        if(dh+sy>this.canvas.height) {
            dh-=sy;
        }

        //console.log(['to render', _x, _y, x, y, w, h]);
        //console.log(['render', sx, sy, dw, dh, dx, dy, dw, dh]);
        ctx.drawImage(this.canvas, sx, sy, dw, dh, dx, dy, dw, dh);
    },
    preDraw: function(x, y, tile) {
        /*if(x < this.x) {
            var dx = this.x - x;
            var data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.x = x;
            this.canvas.width = this.canvas.width + dx;
            this.ctx.putImageData(data, dx*Game.tilesSize, 0);
        }*/
        if(x > this.x + (this.canvas.width/Game.tilesSize)-1) {
            console.log(['Size up X', this.x, x]);
            var data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.width = (x - this.x + 1)*Game.tilesSize;
            this.ctx.putImageData(data, 0, 0);
        }
        /*if(y < this.y) {
            var dy = this.y - x;
            var data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.y = y;
            this.canvas.height = this.canvas.height + dy;
            this.ctx.putImageData(data, 0, dy*Game.tilesSize);
        }*/
        if(y > this.y + (this.canvas.height/Game.tilesSize)-1) {
            console.log(['Size up Y', this.y, y]);
            var data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.canvas.height = (y - this.y + 1)*Game.tilesSize;
            this.ctx.putImageData(data, 0, 0);
        }
        var self = this;
        Game.Tilesets.get(tile.tileset, function(img) {
            self.ctx.clearRect(x*Game.tilesSize, y*Game.tilesSize, Game.tilesSize, Game.tilesSize);
            self.ctx.drawImage(img, tile.x*Game.tilesSize, tile.y*Game.tilesSize, Game.tilesSize, Game.tilesSize,
                x*Game.tilesSize, y*Game.tilesSize, Game.tilesSize, Game.tilesSize);
        });
    }
};

Game.Layer = Layer;
})();
