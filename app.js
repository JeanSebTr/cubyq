/**
 * Module dependencies.
 */
var path = require('path')
  , fs = require('fs');
var express = require('express');

var app = module.exports = express.createServer();

/*
 * Configuration
 */
 
// Redis
var redisStore, redisPub, redisSub;
if(process.env.REDISTOGO_URL) {
  var rInfo = /(\w+):(\w+)@([\w.]+):(\d+)/.exec(process.env.REDISTOGO_URL);
  var redisLib = require('socket.io/node_modules/redis');
  redisStore = redisLib.createClient(rInfo[4], rInfo[3], {detect_buffers: true});
  redisStore.auth(rInfo[2], function() {
    console.log('Connected to REDIS[store] server on', rInfo[3]+':'+rInfo[4]);
  });
  redisPub = redisLib.createClient(rInfo[4], rInfo[3], {detect_buffers: true});
  redisPub.auth(rInfo[2], function() {
    console.log('Connected to REDIS[pub] server on', rInfo[3]+':'+rInfo[4]);
  });
  redisSub = redisLib.createClient(rInfo[4], rInfo[3], {detect_buffers: true});
  redisSub.auth(rInfo[2], function() {
    console.log('Connected to REDIS[sub] server on', rInfo[3]+':'+rInfo[4]);
  });
}

// MONGOLAB_URI
if(process.env.MONGOLAB_URI) {
  var mongoose = app.mongoose = require('mongoose');
  mongoose.connect(process.env.MONGOLAB_URI);
  mongoose.connection.on('open', function() {
    console.log('Connected to mongodb.');
  });
}

// load domain objects
app.domain = {};
var models = fs.readdirSync(path.join(__dirname, 'domain'));
models.forEach(function(file) {
  var model = require(path.join(__dirname, 'domain', file));
  model(app.mongoose, app.domain);
});

// socket.io
app.io = require('socket.io').listen(app);
app.io.configure(function(){
  var io = app.io;
  io.enable('browser client minification');
  io.enable('browser client etag');
  io.enable('browser client gzip');
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10);
  io.set('log level', 1);
  if(process.env.REDISTOGO_URL) {
    var RedisStore = require('socket.io/lib/stores/redis');
    io.set('store', new RedisStore({redisPub:redisPub, redisSub:redisSub, redisClient:redisStore}));
  }
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.cookieParser());
  if(redisStore) {
    var RedisStore = require('connect-redis')(express);
    app.use(express.session({
        secret: process.env.SESSION_SECRET || 'your secret here',
        store: new RedisStore({client: redisStore})
      }));
  }
  else {
    app.use(express.session({ secret: process.env.SESSION_SECRET || 'your secret here' }));
  }
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res) {
  res.render('game', {title: 'Our super game', layout: false});
});
app.get('/editor', function(req, res) {
  res.render('editor', {title: 'Live map editor', layout: false});
});


// APIs on socket.io
require('./map-api/editor.js')(app.io, app.domain);

// GO !
app.listen(process.env.PORT || 3000, function() {
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

