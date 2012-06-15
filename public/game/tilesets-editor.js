

function TilesetsEditor(io) {
	var self = this;
	this.io = io;

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
        //console.log(el.find('canvas'));
        this.canvas = el.find('canvas')[0];
        this.ctx = this.canvas.getContext('2d');
    }
};
