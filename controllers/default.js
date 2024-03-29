
var DefaultController = (function(){
    //contructor

    //private
    
    //public
    return {
        index: function(req, res){
            res.render('index');
        },

        release: function(req, res){
            res.render('release');
        },

        login: function(req, res){
            if(req.loggedIn){
                res.logout();
            }
            res.render('login');
        },

        logout: function(req, res){
            if(req.loggedIn){
                res.logout();
            }
            else {
                res.redirect('/');
            }
            
        },

        game: function(req, res){
            res.render('game');
        }
    };
})();

module.exports = DefaultController;
