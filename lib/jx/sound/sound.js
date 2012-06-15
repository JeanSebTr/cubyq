goog.provide('Sound');



/**
 * @constructor
 * @param {string} name Path of the sound.
 * @param {number} nb Quantity that the sound has to be loaded.
 */
var Sound = function(name, nb) {
  this.name = name;
  this.instanceArray = [];
  this.nbInstances = nb;
  this.lastInstancePlayed = null;
  this.instanceIndex = 0;
  for (var i = 0; i < this.nbInstances; i++) {
    var audio = new window['Audio']();
    var canPlayMP3 = (typeof audio.canPlayType === 'function' &&
                    audio.canPlayType('audio/mpeg') !== '');
    if (canPlayMP3) {
      audio.src = name;
    } else {
      audio.src = name + 'Ogg';
    }
    audio.load();
    this.instanceArray[i] = audio;
  }
};


/**
 * @param {Object} params Parameters.
 * @return {Object} Sound that is played.
 */
Sound.prototype.play = function(params) {
  if (Game.isMuted) { return null; }
  params = params || {};
  var loop = params.loop || false;
  var tmp = this.instanceArray[this.instanceIndex];
  tmp.loop = loop;
  tmp.play();
  this.instanceIndex++;
  if (this.instanceIndex >= this.nbInstances) {
    this.instanceIndex = 0;
  }
  return tmp;
};


/** */
Sound.prototype.unload = function() {
  for (var i = 0; i < this.nbInstances; i++) {
    this.instanceArray[i].pause();
  }
};
