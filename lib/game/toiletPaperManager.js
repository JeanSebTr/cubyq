goog.provide('game.ToiletPaperManager');

goog.require('game.ToiletPaper');
goog.require('jx.Manager');



/**
 * @constructor
 */
game.ToiletPaperManager = function() {
  jx.Manager.call(this);
};
goog.inherits(game.ToiletPaperManager, jx.Manager);


game.ToiletPaperManager.prototype.spawn = function(params) {
  this.push(new game.ToiletPaper(params));
};


game.ToiletPaperManager.prototype.update = function(deltaTime) {
  game.ToiletPaperManager.superClass_.update.call(this, deltaTime);
  for (var i = 0; i < this.objs.length; i++) {
    var toiletPaper = this.objs[i];
    if (Game.isOutside(toiletPaper.x, toiletPaper.y, toiletPaper.w, toiletPaper.h)) {
      this.objs.splice(i, 1);
      --i;
    }
  }
};
