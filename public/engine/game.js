
(function() {

// state machine
var states = {}
  , stateCtx = null
  , currentState = null;

// game loop
var frameReq = null;

var need = [];

var Game = {
  init: function(resources, progress, end) {
    var deps = need.concat(resources);
    Game.Load(deps, progress, end);
  },
  addState: function(name, definition) {
    states[name] = definition;
  },
  changeState: function(name) {
    if(!states[name]) {
      throw new Error('No state named "'+name+'"');
    }
    
    // cancel game loop
    if(frameReq) {
      window.cancelAnimationFrame(frameReq);
      frameReq = null;
    }
    if(currentState && currentState.destroy) {
      currentState.destroy.call(stateCtx, this.initState.bind(this, name));
      currentState = null;
    }
    else {
      this.initState(name);
    }
  },
  initState: function(name) {
    if(!states[name]) {
      throw new Error('No state named "'+name+'"');
    }
    
    stateCtx = {};
    currentState = states[name];
    var request = null;
    if(currentState.update) {
      request = function() {
        
      }
    }
    Game.Load(currentState.resources || [], null, function() {
      
    });
  },
  need: function(resource) {
    need.push(resource);
  }
};

// bitmask
Game.COLLIDE_WITH_MAP = 0x01;
Game.COLLIDE_WITH     = 0x02;
Game.ENTITY_REMOVED   = 0x04;
Game.ENTITY_DRAWABLE  = 0x08;

window.Game = Game;
})();
