goog.provide('jx.Object2D');



/**
 * @constructor
 */
jx.Object2D = function(params) {
  params = params || {};
  this.x = null || params.x;
  this.y = null || params.y;
  this.w = null || params.w;
  this.h = null || params.h;
  this.angle = null || params.angle;
};


/** */
jx.Object2D.prototype.render = function() { };


/** */
jx.Object2D.prototype.update = function() { };
