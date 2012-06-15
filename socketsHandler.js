 
module.exports = function(io){
    var errorCallback = function(err){
        console.log(err);
    };

    var connectionCallback = function(socket){
        console.log('connection');

        //only one room for now
        var room = 'game:1';
        socket.set('room', room, function(){
            console.log('room saved :: '  + room);
        });
        socket.join(room); 
        
        socket.emit('console', {message: 'you are in room ' + room});

        var playerInfo = {
            id: 123456,
            message: 'this is hardcoded'
        };

        socket.broadcast.emit('player-connected', playerInfo);

        socket.on('message', function(data){
            socket.broadcast.emit('message', data);
            socket.emit('message', data);
        });

        socket.on('error', errorCallback);
    };

    io.sockets.on('connection', connectionCallback);
};
