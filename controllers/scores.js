
var ScoresController = (function(){
    //contructor

    //private

    //public
    return {
        index: function(req, res){
            var limit = req.query['limit'] || 10;
            var page = req.query['page'] || 1;
            var from = (page - 1) * limit;
            var to = page * limit - 1;
            var total = 0;

            //TODO using mongodb
            res.json({});
        },

        add: function(req, res){
            var score = req.body['score'] || 0;
            var name = req.body['name'] || "";
            
            //TODO using mongodb
            res.json({}); 
        }
    };
})();

module.exports = ScoresController;
