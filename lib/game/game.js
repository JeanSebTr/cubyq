goog.provide('GameEngine');

goog.require('game.MessageManager');
goog.require('game.PlayerRemote');
goog.require('game.Player');
goog.require('game.Rect');
goog.require('game.FxManager');
goog.require('game.PlayerManager');
goog.require('game.RectManager');
goog.require('game.Bobette');
goog.require('game.BobetteManager');
goog.require('game.ToiletPaperManager');
goog.require('game.Sprite');
goog.require('jx.Controler');
goog.require('jx.Core');
goog.require('jx.MediaManager');
goog.require('goog.events');
goog.require('goog.events.MouseWheelHandler');
goog.require('goog.math.Coordinate');

/**
 * @constructor
 * @extends {jx.Core}
 */
GameEngine = function() {
  jx.Core.call(this);
};
goog.inherits(GameEngine, jx.Core);


/**
 * @param {string} canvasId Canvas Id.
 * @callback {Function} callback Callback.
 */
GameEngine.prototype.init = function(canvasId, callback) {
  GameEngine.superClass_.init.call(this, canvasId);
  var self = this;

  this.States = {
    loading: -1, //waiting for the dom and the resources to be loaded
    game: 0,
    gameover: 1,
    initGame: 2,
    win: 3
  };
  this.isNewState = false;
  this.changeState(this.States.loading);
  this.gameoverCounter = 0;

  this.mouse = new goog.math.Coordinate(0, 0);
  this.DEBUG_COLLISION = false;
  this.globalScale = 1;

  this.networkDelay = 100;
  this.networkCounter = 0;

  this.initListeners();


  // Load some medias.
  var medias = { trans: '/images/trans.png',
                 mario: '/images/mario1.png',
                 character_01: '/images/character_01.png',
                 items: '/images/items.png',
                 ring_01: '/images/ring_01.png',
                 test: '/images/test.png',
                 textes: '/images/texte.png'
               };
  var mediaManager = new jx.MediaManager();
  mediaManager.on('progress', function(progress) {
    //console.log('PROGRESS: %s', progress * 100);
  });
  mediaManager.loadMedias(medias, function() {
    self.medias = mediaManager.medias;

    self.controler = new jx.Controler({type: 'keyboard'});
    self.fxManager = new game.FxManager();
    self.rectManager = new game.RectManager();
    self.bobetteManager = new game.BobetteManager();
    self.toiletPaperManager = new game.ToiletPaperManager();
    self.playerManager = new game.PlayerManager();
    self.messageManager = new game.MessageManager();

    // Add some objects.
    for (var i = 0; i < 10; i++) {
      //self.rectManager.push(new game.Rect({ x: 0, y: 0, w: 10, h: 10 }));
      //self.bobetteManager.push(new game.Bobette({ x: jx.Utils.rand(100, 500), y: jx.Utils.rand(100, 500), w: 16, h: 16 }));
    }

    //console.log('ALL MEDIAS LOADED');
    self.start(); // Start the game loop.

    if (callback) {
      callback();
    }
  });
};


GameEngine.prototype.reset =  function() {
  this.fxManager.reset();
  this.rectManager.reset();
  this.bobetteManager.reset();
  this.toiletPaperManager.reset();
  this.playerManager.reset();
  this.messageManager.reset();
};


/**
 * @param {number} deltaTime Delta time since the last frame.
 */
GameEngine.prototype.update = function(deltaTime) {
  GameEngine.superClass_.update.call(this, deltaTime);
  switch(this.state){
    case this.States.game:
      this.updateGame(deltaTime);
      break;
    case this.States.gameover:
      this.updateGameover(deltaTime);
      break;
    case this.States.initGame:
      this.updateInitgame(deltaTime);
      break;
    case this.States.win:
      this.updateWin(deltaTime);
      break;
  }
};

GameEngine.prototype.updateBase = function(deltaTime){
  this.controler.update(deltaTime);
  this.fxManager.update(deltaTime);
  this.rectManager.update(deltaTime);
  this.bobetteManager.update(deltaTime);
  this.toiletPaperManager.update(deltaTime);
  this.playerManager.update(deltaTime);
  this.messageManager.update(deltaTime);
};

GameEngine.prototype.updateGame = function(deltaTime){
  if(this.isNewState){
    this.isNewState = false; 
  }

  this.updateBase(deltaTime);
  if (this.player) {
    this.player.update(deltaTime);

    // Serialize each 100ms...
    if (this.networkCounter >= this.networkDelay) {
      this.networkCounter -= this.networkDelay;
      socket.emit('player-update', this.player.serialize());
    }
    this.networkCounter += deltaTime;
  }
};

GameEngine.prototype.updateGameover = function(deltaTime){
  if(this.isNewState){
    this.isNewState = false;
    socket.emit('player-gameover', this.player.serialize());
    this.reset();
    Game.messageManager.spawn(Game.messageManager.Phrases.CEST_TROP, true);
  }
  this.gameoverCounter += deltaTime;
  this.updateBase(deltaTime);

  if(this.gameoverCounter >= 3 * 1000){
    this.changeState(this.States.initGame);
  }
};

GameEngine.prototype.updateWin = function(deltaTime){
  if(this.isNewState){
    this.isNewState = false; 
    socket.emit('player-gameover', this.player.serialize());
    this.reset();
    Game.messageManager.spawn(Game.messageManager.Phrases.ENFIN_RECUPEREE, true);
  }
  this.gameoverCounter += deltaTime;
  this.updateBase(deltaTime);

  if(this.gameoverCounter >= 3 * 1000){
    this.changeState(this.States.initGame);
  }
};

GameEngine.prototype.updateInitgame = function(deltaTime){
  if(this.isNewState){
    this.isNewState = false;
    if(socket){
      socket.emit('player-init', userData);
    }
    else{
      socket = io.connect('/');
      socket.once('connect', function (data) {
          socket.emit('player-init', userData); 
      });
      socket.on('player-update', function(data){
            Game.playerManager.updatePlayer(data);
        });

        socket.on('player-gameover', function(data){
            console.log('player-gameover :: ', data.id);
            for(var i=0; i< Game.playerManager.objs.length; i++){
                if(Game.playerManager.objs[i].id == data.id){
                    Game.playerManager.objs.splice(i,1);
                    for(var j=0;j<Game.bobetteManager.objs.length;j++){
                      if(Game.bobetteManager.objs[j].ownerId == data.id){
                        Game.bobetteManager.objs.splice(j,1);
                        break;
                      }
                    }
                    break;
                }
            }
        });
    }

    socket.once('player-init', function(data){
        var x = data.x / Game.globalScale;
        var y = data.y /Game.globalScale; 
        Game.player = new game.Player({x: x, y: y});
        Game.bobetteManager.spawn({ownerId: data.id, x: data.slips.x, y: data.slips.y})
        // TODO: REMOVE THIS
        //Game.playerManager.spawn({x: 100, y: 100, id: 'CALISS', fbName: 'DUMMY'});
        //Game.bobetteManager.spawn({ownerId: 'CALISS', x: 100, y: 160})
    });

    socket.once('game-init', function(data){
        Game.player.id = userData.id;
        socket.on('player-connected', function(d){
            Game.playerManager.spawn(d);
            Game.bobetteManager.spawn({ownerId: d.id, x: d.slips.x, y: d.slips.y})
        });

        for(var i =0; i< data.length; i++){
           Game.playerManager.spawn(data[i]); 
        }
        Game.player.resetValues({});
        if(Game.map) {
          Game.changeState(Game.States.game);
        }
        else {
          var net = new JSGame.Network(socket);
          Game.map = new JSGame.World('4fdcb3c944beb60100000004', net, function() {
            Game.changeState(Game.States.game);
          });
        }
    });

  }
};

/**
 *
 */
GameEngine.prototype.render = function() {
  GameEngine.superClass_.render.call(this);

  switch(this.state){
   case this.States.game:
      this.renderGame();
      break;
    case this.States.gameover:
      this.renderGameover();
      break;
    case this.States.initGame:
      this.renderInitGame();
      break;
    case this.States.win:
      this.renderGameover(); //oui oui game over... c'Est le meme code!
  }
};

GameEngine.prototype.renderGame = function(){
  var c = this.ctx;
  c.save();
  c.clearRect(0, 0, this.canvas.width, this.canvas.height);

  c.save();
  c.scale(this.globalScale, this.globalScale);


  var mapX = 0, mapY = 0;
      if(this.player) {
        mapX = (this.player.x - this.canvas.width / 2);
        mapY = (this.player.y - this.canvas.height / 2);
      }

      if(this.map) {
        this.map.render({
          ctx: c,
          x: mapX,
          y: mapY,
          w: this.canvas.width,
          h: this.canvas.height,
          to: 5
        });
      }

  this.controler.render();
  this.rectManager.render();
  this.fxManager.render();
  c.save();
  c.translate(-this.player.x + this.canvas.width / 2, -this.player.y + this.canvas.height / 2);
  this.bobetteManager.render();
  this.toiletPaperManager.render();
  this.playerManager.render();
  if (this.player) { this.player.render(); }
  c.restore();

  if(this.map) {
        this.map.render({
          ctx: c,
          x: mapX,
          y: mapY,
          w: this.canvas.width,
          h: this.canvas.height,
          from: 5
        });
      }

  this.messageManager.render();
  c.restore();

  c.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  c.restore();
};



GameEngine.prototype.renderGameover = function(){
  var c = this.ctx;
  c.save();
  c.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // TODO: debug only...
  c.fillStyle = 'gray';
  c.fillRect(0, 0, this.canvas.width, this.canvas.height);

  c.save();
  c.scale(this.globalScale, this.globalScale);

  this.controler.render();
  this.rectManager.render();
  this.fxManager.render();
  this.bobetteManager.render();
  this.toiletPaperManager.render();
  this.playerManager.render();

  c.restore();
  c.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  c.restore();

  this.ctx.save();
  this.ctx.fillStyle = 'rgba(0,0,0, 0.6)';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.restore();

  this.messageManager.render();
};

GameEngine.prototype.renderInitGame = function(){
  this.ctx.save();
  this.ctx.fillStyle = 'rgba(0,0,0, 0.6)';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.restore();
};

GameEngine.prototype.changeState = function(newState){
  this.state = newState;
  this.isNewState = true;
  console.log('changeState :: ', newState);
  if(this.state == this.States.gameover || this.state == this.States.win){
    this.gameoverCounter = 0;
  }
};


GameEngine.prototype.isOutside = function(x, y, w, h) {
  var mult = 10;
  return x > this.canvas.width + mult * w ||
         x < -mult * w ||
         y > this.canvas.height + mult * h ||
         y < -mult * h;
};


GameEngine.prototype.initListeners = function() {
  var self = this;
  // Bind listeners
  // MouseMove
  goog.events.listen(this.canvas, goog.events.EventType.MOUSEMOVE,
                     function(evt) { self.mouseMove(evt); });
  // MouseDown
  goog.events.listen(this.canvas, goog.events.EventType.MOUSEDOWN,
                     this.mouseDown);

  // MouseUp
  goog.events.listen(this.canvas, goog.events.EventType.MOUSEUP,
                     this.mouseUp);

  // MouseWheel
  var mouseWheelHandler = new goog.events.MouseWheelHandler(this.canvas);
  goog.events.listen(mouseWheelHandler,
                     goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
                     this.mouseWheel);

  // Click
  goog.events.listen(this.canvas, goog.events.EventType.CLICK,
                     function(evt) { self.click(evt); });

  // dblClick
  goog.events.listen(this.canvas, goog.events.EventType.DBLCLICK,
                     this.dblClick);

  // keyDown
  //goog.events.listen(document, goog.events.EventType.KEYDOWN,
  //                   this.keyDown);

  // keyUp
  //goog.events.listen(document, goog.events.EventType.KEYUP,
  //                   this.keyUp);

  // Resize
  goog.events.listen(window, goog.events.EventType.RESIZE,
                     this.resize);

  // Unload
  goog.events.listen(window, goog.events.EventType.UNLOAD,
                     this.unload);

};


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.mouseMove = function(evt) {
  this.mouse.x = evt.offsetX;
  this.mouse.y = evt.offsetY;
};


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.mouseDown = function(evt) { };


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.mouseUp = function(evt) { };


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.mouseWheel = function(evt) { };


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.click = function(evt) {
  //this.player.fire();
};


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.dblClick = function(evt) { };


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.keyDown = function(evt) { };


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.keyUp = function(evt) { };


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.resize = function(evt) { };


/**
 * Trigerred on window unload.
 * Perfect for the sound unload.
 * @param {Object} evt Event.
 */
GameEngine.prototype.unload = function(evt) {
  //TODO send player id
  socket.emit('player-gameover', '{}');
  socket.emit('disconnect');
};

goog.exportSymbol('GameEngine', GameEngine);
goog.exportProperty(GameEngine.prototype, 'init', GameEngine.prototype.init);
