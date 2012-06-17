goog.provide('game.MessageManager');

goog.require('jx.Manager');
goog.require('game.Message');



/**
 * @constructor
 */
game.MessageManager = function() {
  jx.Manager.call(this);
  this.lyrics = Game.medias.textes;
  this.Phrases = {
    OU_SONT_MES_BOBETTES: 0,
    EUH_CEST_GENANT: 1,
    FAUT_JLES_TROUVES: 2,
    HO_NON_ON_MA_VUE: 3,
    IL_DEVRAIT_PORTER: 4,
    DUDE_CEST_MES_BOBETTES: 5,
    ENFIN_RECUPEREE: 6,
    UN_NORMAL: 7,
    CEST_TROP: 8,
    ON_VA_REESSAYER: 9,
    OUF_ON_MA_PAS_VU: 10
  };
};
goog.inherits(game.MessageManager, jx.Manager);


game.MessageManager.prototype.spawn = function(id, force) {
  if(force){
    this.objs = [];
  }
  if (this.objs.length < 1) {
    this.objs.push(new game.Message({id: id, force: force}));
  }
};
