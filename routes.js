
var DefaultController = require("./controllers/default.js");
var ScoresController = require("./controllers/scores.js");

module.exports = function(app){
    //Game
    app.get('/', DefaultController.index);

    //API
    app.get('/api/scores', ScoresController.index);
    app.post('/api/scores', ScoresController.add);  

    app.get('/editor', function(req, res) {
        res.render('editor', {title: 'Live map editor', layout: false});
    });  
};
