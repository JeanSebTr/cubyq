goog.provide('jx.EventEmitter');



/**
 * @constructor
 */
jx.EventEmitter = function() {
  this.signals = {};
};


/**
 * @param {string} signal Signal to listen.
 * @param {Function} callback Callback.
 * @return {Object} Return itself.
 */
jx.EventEmitter.prototype.on = function(signal, callback) {
  if (!this.signals[signal]) { this.signals[signal] = []; }
  this.signals[signal].push(callback);
  return this;
};


/**
 * @param {string} signal Signal to emit.
 * @param {Object=} opt_data Data.
 * @return {Object} Return itself.
 */
jx.EventEmitter.prototype.emit = function(signal, opt_data) {
  var callbacks = this.signals[signal];
  if (callbacks) {
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i].call(this, opt_data);
    }
  }
  return this;
};
