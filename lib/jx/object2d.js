goog.provide('jx.Object2D');



/**
 * @constructor
 */
jx.Object2D = function() {
  var params = arguments[0] || {};
  this.x = null || params.x;
  this.y = null || params.y;
  this.w = null || params.w;
  this.h = null || params.h;
};


/** */
jx.Object2D.prototype.render = function() { };


/** */
jx.Object2D.prototype.update = function() { };
