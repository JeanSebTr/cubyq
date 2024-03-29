
var redis = require('socket.io/node_modules/redis');
var redisToGoUrl   = require("url").parse(process.env.REDISTOGO_URL);
var redisStore = redis.createClient(redisToGoUrl.port, redisToGoUrl.hostname);

if(redisToGoUrl.auth){
    redisStore.auth(redisToGoUrl.auth.split(":")[1], function() {
        console.log('Redis store connected.');
    });   
}
 
module.exports = function(io){
    //pour debug avec le meme id
    //var ids = {};

    //Events
    var onError = function(err){
        console.log(err);
    };

    var onConnection = function(socket){
        socket.on('error', onError.bind(socket));
        socket.on('disconnect', onDisconnect.bind(socket));
        socket.on('player-init', onPlayerInit.bind(socket));
        socket.on('player-update', onPlayerUpdate.bind(socket));
        socket.on('player-gameover', onPlayerGameover.bind(socket));

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
                console.log('debug');
                //if(ids[data.id]) ids[data.id] = false;
                //console.log(ids);
                removePlayerFromRedisStore(data.id);    
            }
        });
    };

    var onPlayerInit = function(data){
        var slips = generateSlips();
        var socket = this;
        initializePlayerInRedisStore(data, slips, function(){
            data.slips = slips;
            attachPlayerInfosToSocket(socket, data, function(){
                broadcastPlayerConnected(socket);
                emitGameInit(socket); 
            });
        });
    };

    var onPlayerUpdate = function(data){
        data = JSON.parse(data);
        this.broadcast.volatile.emit('player-update', data);
    };

    var onPlayerGameover = function(data){
        data = JSON.parse(data);
        this.broadcast.volatile.emit('player-gameover', data);
        removePlayerFromRedisStore(data.id);
    }

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

            var randX = Math.random();
            var randY = Math.random();

            var xMin = 30;
            var xMax = 770;
            var yMin = 30;
            var yMax = 570;

            data.x = randX * xMax + xMin;
            data.y = randY * yMax + yMin;
            console.log(data);
            socket.emit('player-init', data);
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
            socket.broadcast.emit('player-gameover', data);   
        });    
    };

    var attachPlayerInfosToSocket = function(socket, data, callback){
        var user = {
            id: data.id,
            fbId: data.fbId,
            fbName: data.fbName,
            fbFirstName: data.fbFirstName,
            slips: data.slips
        };
        socket.set('user', JSON.stringify(user), callback);
    };

    var initializePlayerInRedisStore = function(data, slips, callback){
        var hash = 'user:' + data.id;
        var params = [
            hash,
            'id', data.id,
            'x' , 10, 
            'y', 10,
            'vel', 0,
            'points', 0,
            'radius', 25,
            'state', 0,
            'slips', slips,
            'fbName', data.fbName
        ];
        redisStore.hmset(params, function(){
            callback()
        });
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
                var users = [];
                var multi = redisStore.multi();
                
                for(var i = 0; i<replies.length;i++){ 
                    multi.hgetall(replies[i]);
                }
                multi.exec(function(err, r){
                    for(var i = 0; i < r.length;i++){   
                        if(r[i].id != user.id){
                            users.push(r[i]);
                        }
                    }
                    socket.emit('game-init', users);
                });
            });
        });        
    };

    var generateSlips = function(){
        var xMin = 30;
        var xMax = 770;
        var yMin = 30;
        var yMax = 570;  

        var randX = Math.random();
        var randY = Math.random();

        return {
            x: xMin + xMax * randX,
            y: yMin + yMax * randY
        };
    };

    var redisErrorCallback = function(err){
        if(err){
            console.log('ERROR:Redis ::', err);
        }
    }

    io.sockets.on('connection', onConnection);
};
