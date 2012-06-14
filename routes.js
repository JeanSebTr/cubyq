
var DefaultController = require("./controllers/default.js");
var ScoresController = require("./controllers/scores.js");
var EditorController = require("./controllers/editor.js");

var Secure = function(req, res, next){
    if(req.loggedIn){
        next();
    }
    else{
        res.redirect('/');
    }
}

module.exports = function(app){
    //Game
    app.get('/', DefaultController.index);
    app.get('/login', DefaultController.login);
    app.get('/logout', DefaultController.logout);
    app.get('/game', DefaultController.game);

    //API
    app.get('/api/scores', ScoresController.index);
    app.post('/api/scores', ScoresController.add);  

    app.get('/editor', EditorController.index);  
};
