
module.exports = function(io){
    var errorCallback = function(err){
        console.log(err);
    };

    var connectionCallback = function(socket){
        socket.on('message', function(data){
            socket.broadcast.emit('message', data);
            socket.emit('message', data);
        });

        socket.on('error', errorCallback);
    }

    io.sockets.on('connection', connectionCallback);
};
