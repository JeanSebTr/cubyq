
var redis = require('socket.io/node_modules/redis');
var redisToGoUrl   = require("url").parse(process.env.REDISTOGO_URL);
var redisStore = redis.createClient(redisToGoUrl.port, redisToGoUrl.hostname);

if(redisToGoUrl.auth){
    redisStore.auth(redisToGoUrl.auth.split(":")[1], function() {
        console.log('Redis store connected.');
    });   
}

 
module.exports = function(io){
    //Events
    var onError = function(err){
        console.log(err);
    };

    var onConnection = function(socket){
        console.log('onConnection');
        socket.on('error', onError.bind(socket));
        socket.on('disconnect', onDisconnect.bind(socket));
        socket.on('message', onMessage.bind(socket));
        socket.on('console', onConsole.bind(socket));
        socket.on('player-init', onPlayerInit.bind(socket));

        //only one room for now
        joinRoom(socket, 'game:1');
    };

    var onDisconnect = function(){
        console.log('onDisconnect');
        broadcastPlayerDisconnected(this);
        this.get('user', function(err, data){
            removePlayerFromRedisStore(data.id); 
        });
    };

    var onMessage = function(data){
        console.log('onMessage');
        console.log(data);
        this.broadcast.emit('message', data);
        this.emit('message', data);
    };


    var onConsole = function(data){
        console.log('onConsole');
        this.log(data); 
    };

    var onPlayerInit = function(data){
        console.log('onPlayerInit');
        console.log(data);
        initializePlayerInRedisStore(data.id);
        attachPlayerInfosToSocket(this, data);
        broadcastPlayerConnected(this);
        emitGameInit(this);
    };

    //functions
    var joinRoom = function(socket, roomName){
        var room = 'game:1';
        socket.set('room', roomName, redisErrorCallback);
        socket.join(roomName);
    };

    var broadcastPlayerConnected = function(socket){
        socket.get('user', function(err, data){
            if(err){
                console.log(err);
                return;
            }
            socket.broadcast.emit('player-connected', data);   
        });
    };

    var broadcastPlayerDisconnected = function(socket){
        socket.get('user', function(err, data){
            if(err){
                console.log(err);
                return;
            }
            socket.broadcast.emit('player-disconnected', data);   
        });    
    };

    var attachPlayerInfosToSocket = function(socket, data){
        var user = {
            id: data.id,
            fbId: data.fbId,
            fbName: data.fbName  
        };
        socket.set('user', user, redisErrorCallback);
    };

    var initializePlayerInRedisStore = function(id){
        var params = [
            id,
            'x' , 10,
            'y', 10,
            'vel', 0,
            'points', 0,
            'radius', 25,
            'state', 0
        ];
        redisStore.hmset(params, redis.print);
        setExpire(id);
    };

    var setExpire = function(id){
        redisStore.expire(id, 5 * 60, redis.print);
    }

    var removePlayerFromRedisStore = function(id){
        redisStore.del(id, redis.print); 
    };

    var emitGameInit = function(socket){
        socket.emit('game-init', {message: 'el data du jeux!'});
    };

    var redisErrorCallback = function(err){
        if(err){
            console.log('ERROR:Redis');
            console.log(err);   
        }
    }

    io.sockets.on('connection', onConnection);
};
