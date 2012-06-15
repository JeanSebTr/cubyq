

function TilesetsEditor(io) {
	var self = this;
	this.io = io;

	this.current = ko.observable(null);
	this.show = ko.observable(false);

	this.list = ko.observableArray();
	io.emit('listTilesets', function(tilesets) {
		var list = [];
        tilesets.forEach(function(tileset) {list.push});
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
            console.log(arguments);
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
    }
};
