goog.provide('jx.Utils');


/** */
jx.Utils = {};


/**
 * @param {number} min Minimum value (included).
 * @param {number} max Maximum value (included).
 * @return {number} A random number.
 */
jx.Utils.rand = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


/**
 * @param {number} min Minimum value (included).
 * @param {number} max Maximum value (included).
 * @return {number} A random floating number.
 */
jx.Utils.randf = function(min, max) {
  return Math.random() * (max - min + 1) + min;
};
