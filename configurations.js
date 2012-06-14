
redis = require('socket.io/node_modules/redis');

var redisToGoUrl   = require("url").parse(process.env.REDISTOGO_URL);

var pub = redis.createClient(redisToGoUrl.port, redisToGoUrl.hostname);
var sub = redis.createClient(redisToGoUrl.port, redisToGoUrl.hostname);
var store = redis.createClient(redisToGoUrl.port, redisToGoUrl.hostname);

var emptyErrorCallback = function(err){ console.log(err); };

pub.on("error", emptyErrorCallback);
sub.on("error", emptyErrorCallback);
store.on("error", emptyErrorCallback);

if(redisToGoUrl.auth){
    pub.auth(redisToGoUrl.auth.split(":")[1], function() {
        console.log('Redis pub connected.');
    });
    sub.auth(redisToGoUrl.auth.split(":")[1], function() {
        console.log('Redis sub connected.');
    });
    store.auth(redisToGoUrl.auth.split(":")[1], function() {
        console.log('Redis store connected.');
    });   
}

var RedisStore = require('socket.io/lib/stores/redis');
var mongooseAuth = require('mongoose-auth');

module.exports = function(app, express, io){    
    app.configure(function(){
        app.set('views', __dirname + '/views');
        app.set('view engine', 'ejs');
        app.set('view options', { layout: false });
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.cookieParser());
        app.use(express.session({ secret: process.env.APP_SECRET }));
        app.use(require('stylus').middleware({ src: __dirname + '/public' }));
        app.use(express.static(__dirname + '/public'));

        io.enable('browser client minification');
        io.enable('browser client etag');
        io.enable('browser client gzip');
        io.set("transports", ["xhr-polling"]); 
        io.set("polling duration", 10);
        io.set('store', new RedisStore({redisPub:pub, redisSub:sub, redisClient:store}));
        io.set('log level', 2);

        app.use(mongooseAuth.middleware());
    });

    app.configure('development', function(){
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    });

    app.configure('production', function(){
        app.use(express.errorHandler()); 
        io.set('log level', 1);
    });

    mongooseAuth.helpExpress(app);
};
