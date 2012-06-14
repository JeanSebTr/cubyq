

module.exports = function(io) {
    var ioMethods = {
        timeChallenge: function(time, cb){
            cb(Date.now());
        }
    };
    io.on('connection', function(socket) {
        for(var method in ioMethods) {
            socket.on(method, ioMethods[method].bind(socket));
        }
    });
};
