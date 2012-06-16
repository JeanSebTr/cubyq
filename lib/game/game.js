goog.provide('GameEngine');

goog.require('game.Player');
goog.require('game.Rect');
goog.require('game.FxManager');
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
 */
GameEngine.prototype.init = function(canvasId) {
  GameEngine.superClass_.init.call(this, canvasId);
  var self = this;

  this.mouse = new goog.math.Coordinate(0, 0);
  this.DEBUG_COLLISION = false;

  this.initListeners();


  // Load some medias.
  var medias = { trans: '/images/trans.png',
                 mario: '/images/mario1.png',
                 character_01: '/images/character_01.png',
                 items: '/images/items.png',
                 ring_01: '/images/ring_01.png',
                 test: '/images/test.png'
               };
  var mediaManager = new jx.MediaManager();
  mediaManager.on('progress', function(progress) {
    console.log('PROGRESS: %s', progress * 100);
  });
  mediaManager.loadMedias(medias, function() {
    self.medias = mediaManager.medias;

    self.controler = new jx.Controler({type: 'keyboard'});
    self.fxManager = new game.FxManager();
    self.rectManager = new game.RectManager();
    self.bobetteManager = new game.BobetteManager();
    self.toiletPaperManager = new game.ToiletPaperManager();

    // Add some objects.
    for (var i = 0; i < 10; i++) {
      //self.rectManager.push(new game.Rect({ x: 0, y: 0, w: 10, h: 10 }));
      self.bobetteManager.push(new game.Bobette({ x: jx.Utils.rand(100, 500), y: jx.Utils.rand(100, 500), w: 16, h: 16 }));
    }

    self.player = new game.Player({x: 100, y: 100});
    console.log('ALL MEDIAS LOADED');
    self.start(); // Start the game loop.
  });
};


/**
 * @param {number} deltaTime Delta time since the last frame.
 */
GameEngine.prototype.update = function(deltaTime) {
  GameEngine.superClass_.update.call(this, deltaTime);

  this.controler.update(deltaTime);
  this.fxManager.update(deltaTime);
  this.rectManager.update(deltaTime);
  this.bobetteManager.update(deltaTime);
  this.toiletPaperManager.update(deltaTime);
  this.player.update(deltaTime);
  socket.emit('player-update', this.player.serialize());
};


/**
 *
 */
GameEngine.prototype.render = function() {
  GameEngine.superClass_.render.call(this);

  var ctx = this.ctx;
  ctx.save();
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


  this.controler.render();
  this.rectManager.render();
  this.fxManager.render();
  this.bobetteManager.render();
  this.toiletPaperManager.render();
  this.player.render();


  ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  ctx.restore();
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
  this.player.fire();
};


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.dblClick = function(evt) { };


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.keyDown = function(evt) {
  console.log('CRISS');
};


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
  socket.emit('disconnect');
};

goog.exportSymbol('GameEngine', GameEngine);
goog.exportProperty(GameEngine.prototype, 'init', GameEngine.prototype.init);
