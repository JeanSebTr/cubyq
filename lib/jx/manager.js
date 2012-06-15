goog.provide('jx.Manager');



/** * @constructor */
jx.Manager = function() {
  this.objs = [];
};


/**
 * @param {number} deltaTime Delta time since the last frame.
 */
jx.Manager.prototype.update = function(deltaTime) {
  for (var i = this.objs.length - 1; i >= 0; i--) {
    var obj = this.objs[i];
    obj.update(deltaTime);
  }
};


/** */
jx.Manager.prototype.render = function() {
  for (var i = this.objs.length - 1; i >= 0; i--) {
    var obj = this.objs[i];
    obj.render();
  }
};


/**
 * @param {Object} obj The object to add.
 */
jx.Manager.prototype.push = function(obj) {
  this.objs.push(obj);
};


/**
 * @param {number} x Position in x.
 * @param {number} y Position in y.
 * @param {number} r Radius.
 * @param {number} damage Damage to apply to the object.
 * @return {boolean} True if there is a collision.
 */
jx.Manager.prototype.verifyCollision = function(x, y, r, damage) {
  for (var i = 0; i < this.objs.length; i++) {
    var obj = this.objs[i];
    if (obj.collide(x, y, r)) {
      //this.updateHealth(obj, damage);
      return true;
    }
  }
  return false;
};
