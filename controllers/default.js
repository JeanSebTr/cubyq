
var DefaultController = (function(){
    //contructor

    //private
    
    //public
    return {
        index: function(req, res){
            res.render('index');
        }
    };
})();

module.exports = DefaultController;
