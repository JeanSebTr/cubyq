

function TilesetsEditor(io, size) {
	var self = this;
	this.io = io;
    this.size = size;

    self.tilesetImg = new Image();
    self.tilesetImg.onload = function() {
        self.canvas.width = self.tilesetImg.width;
        self.canvas.height = self.tilesetImg.height;
        self.draw();
    };
	this.current = ko.observable(null);
    this.current.subscribe(function(val) {
        if(val){
            self.tilesetImg.src = '/tilesets/'+val.id+'.png';
        }
        else {
            self.canvas = null;
        }
    });
	this.show = ko.observable(false);
    this.x = ko.observable(0);
    this.y = ko.observable(0);

	this.list = ko.observableArray();
	io.emit('listTilesets', function(tilesets) {
		var list = [];
        tilesets.forEach(function(tileset) {list.push(tileset);});
        self.list(list);
	});

}

TilesetsEditor.prototype = {
    uploadTile: function(form) {
        var data = new FormData(form);
        console.log(data);
        $.ajax({
        url: '/uploadTile',  //server script to process data
        type: 'POST',
        //Ajax events
        success: function() {
            form.reset();
        },
        error: function() {
            console.log(arguments);
        },
        // Form data
        data: data,
        //Options to tell JQuery not to process data or worry about content-type
        cache: false,
        contentType: false,
        processData: false
    });
    },
    setTileZone: function(element) {
        var el = $(element);
        this.canvas = el.find('canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.x(0);
        this.y(0);
    },
    draw: function() {
        var x = this.x(), y = this.y();
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.tilesetImg, 0, 0);
        this.ctx.beginPath();
        this.ctx.moveTo(x*this.size, y*this.size);
        this.ctx.lineTo(x*this.size, y*this.size+this.size);
        this.ctx.lineTo(x*this.size+this.size, y*this.size+this.size);
        this.ctx.lineTo(x*this.size+this.size, y*this.size);
        this.ctx.closePath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#0000FF';
        this.ctx.stroke();
        this.ctx.restore();
    },
    select: function(canvas, event) {
        this.x(Math.floor(event.offsetX/this.size));
        this.y(Math.floor(event.offsetY/this.size));
        this.draw();
    },
    getTile: function() {
        var tileset = this.current();
        if(!tileset) return;
        return {
            id: tileset.id,
            x: this.x(),
            y: this.y()
        };
    }
};
