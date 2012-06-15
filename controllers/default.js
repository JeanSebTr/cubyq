
var DefaultController = (function(){
    //contructor

    //private
    
    //public
    return {
        index: function(req, res){
            if(req.loggedIn){
                res.redirect('/game');
            }
            else{
                res.render('index');
            }
        },

        login: function(req, res){
            if(req.loggedIn){
                res.logout();
            }
            else{
                res.redirect('/auth/facebook');
            }
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
