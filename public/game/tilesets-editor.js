

function TilesetsEditor(io) {
	var self = this;
	this.io = io;

	this.current = ko.observable(null);
	this.show = ko.observable(false);

	this.list = ko.observableArray();
	io.emit('listTilesets', function() {
		
	});

}
