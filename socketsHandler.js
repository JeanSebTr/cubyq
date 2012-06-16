
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
        socket.on('player-init', onPlayerInit.bind(socket));
        socket.on('player-update', onPlayerUpdate.bind(socket));

        //only one room for now
        joinRoom(socket, 'game:1');
    };

    var onDisconnect = function(){
        console.log('onDisconnect');
        broadcastPlayerDisconnected(this);
        this.get('user', function(err, data){
            if(err){
                console.log('ERROR : onDisconnect:: ', err);
                return;
            }
            data = JSON.parse(data);
            if(data && data.id){
                removePlayerFromRedisStore(data.id);    
            }
        });
    };

    var onPlayerInit = function(data){
        initializePlayerInRedisStore(data.id);
        attachPlayerInfosToSocket(this, data);
        broadcastPlayerConnected(this);
        emitGameInit(this);
    };

    var onPlayerUpdate = function(data){
        data = JSON.parse(data);
        this.broadcast.volatile.emit('player-update', data);
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
            data = JSON.parse(data);
            data.x = 100;
            data.y = 100;
            socket.broadcast.emit('player-connected', data);   
        });
    };

    var broadcastPlayerDisconnected = function(socket){
        socket.get('user', function(err, data){
            if(err){
                console.log(err);
                return;
            }
            data = JSON.parse(data);
            socket.broadcast.emit('player-disconnected', data);   
        });    
    };

    var attachPlayerInfosToSocket = function(socket, data){
        var user = {
            id: data.id,
            fbId: data.fbId,
            fbName: data.fbName  
        };
        socket.set('user', JSON.stringify(user), redisErrorCallback);
    };

    var initializePlayerInRedisStore = function(id){
        var hash = 'user:' + id;
        var params = [
            hash, 'id', id, 'x' , 10, 'y', 10, 'vel', 0, 'points', 0, 'radius', 25, 'state', 0
        ];
        redisStore.hmset(params, redis.print);
        //setExpire(id);
    };

    var setExpire = function(id){
        redisStore.expire(id, 5 * 60, redis.print);
    }

    var removePlayerFromRedisStore = function(id){
        redisStore.del(id, redis.print); 
    };

    var emitGameInit = function(socket){
        socket.get('user', function(err, user){
            if(err){
                console.log(err);
                return;
            } 
            user = JSON.parse(user);
            var pattern = 'user:*';
            redisStore.keys(pattern, function(err, replies){
                if(err){
                    console.log(err);
                    return err;
                }
                console.log(replies);
                var users = [];
                for(var i = 0; i<replies.length;i++){
                    redisStore.hgetall(replies[i], function(err, replie){
                        if(err){
                            console.log(err);
                            return;
                        }
                        console.log('replie :: ', replie);
                        console.log('user :: ', user);

                        if(replie.id != user.id){
                            users.push(replie);   
                        }
                        if(users.length == replies.length - 1){
                            console.log(users);
                            socket.emit('game-init', users);
                        }
                   }); 
                }
            });
        });        
    };

    var redisErrorCallback = function(err){
        if(err){
            console.log('ERROR:Redis ::', err);
        }
    }

    io.sockets.on('connection', onConnection);
};
