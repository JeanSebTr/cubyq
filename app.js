/**
 * Module dependencies.
 */
var path = require('path');
var fs = require('fs');
var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);
var mongoose = require('mongoose');

var db = mongoose.connect(process.env.MONGOLAB_URI);

// load models
var models = fs.readdirSync(path.join(__dirname, 'models'));
models.forEach(function(file) {
    require(path.join(__dirname, 'models', file));
});

require('./configurations.js')(app, express, io);

// APIs on socket.io
require('./map-api/base.js')(io);
require('./map-api/game.js')(io);
require('./map-api/editor.js')(io);

require('./routes.js')(app, io);
require('./socketsHandler.js')(io);

// GO !
app.listen(process.env.PORT || 3000, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
