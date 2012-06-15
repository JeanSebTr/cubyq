
var DefaultController = (function(){
    //contructor

    //private
    
    //public
    return {
        index: function(req, res){
            res.render('index');
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
            res.redirect('/');
        }
    };
})();

module.exports = DefaultController;
