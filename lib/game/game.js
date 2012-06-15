goog.provide('GameEngine');

goog.require('game.Rect');
goog.require('game.RectManager');
goog.require('game.Sprite');
goog.require('jx.Controler');
goog.require('jx.Core');
goog.require('jx.MediaManager');
goog.require('goog.events');
goog.require('goog.events.MouseWheelHandler');



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


  // Bind listeners
  // MouseMove
  goog.events.listen(this.canvas, goog.events.EventType.MOUSEMOVE,
                     this.mouseMove);
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
                     this.click);

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


  this.controler = new jx.Controler({type: 'keyboard'});
  this.rectManager = new game.RectManager();

  // Add some objects.
  for (var i = 0; i < 10; i++) {
    this.rectManager.push(new game.Rect({ x: 0, y: 0, w: 10, h: 10 }));
  }


  // Load some medias.
  var medias = {'trans': '/images/trans.png',
                'mario': '/images/mario1.png'};
  var mediaManager = new jx.MediaManager();
  mediaManager.on('progress', function(progress) {
    console.log('PROGRESS: %s', progress * 100);
  });
  mediaManager.loadMedias(medias, function() {
    self.medias = mediaManager.medias;
    self.mario = new game.Sprite({img: Game.medias.mario, width: 16, height: 20})
        .setState({label: 'normal', loop: true, frames: [0, 3], fps: 200, x: 100, y: 100});
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
  this.rectManager.update(deltaTime);
  this.mario.update(deltaTime);
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
  this.mario.render();


  ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  ctx.restore();
};


/**
 * @param {Object} evt Event.
 */
GameEngine.prototype.mouseMove = function(evt) { };


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
GameEngine.prototype.click = function(evt) { };


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
GameEngine.prototype.unload = function(evt) { };

goog.exportSymbol('GameEngine', GameEngine);
goog.exportProperty(GameEngine.prototype, 'init', GameEngine.prototype.init);
