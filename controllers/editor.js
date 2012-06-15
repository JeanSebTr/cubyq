
var EditorController = (function(){
    //contructor

    //private
    
    //public
    return {
        index: function(req, res){
            res.render('editor', {title: 'Live map editor'});
        }
    };
})();

module.exports = EditorController;
