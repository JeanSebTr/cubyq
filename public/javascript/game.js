
(function() {

// state machine
var states = {}
  , currentState = null;

// game loop
var frameReq = null;

var Game = {
  init: function(resources, progress, end) {
    
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
      
    }
  },
  need: function(resource) {
    // TODO : add to resources load queue
  }
};

window.Game = Game;
})();
