goog.provide('game.Wave');

goog.require('jx.Object2D');



/**
 * @constructor
 */
game.Wave = function(params) {
  params = params || {};
  jx.Object2D.call(this, params);
  this.counter = 0;
  this.duration = 3000;
  this.callback = params.callback || null;

  this.radius = 0;
  this.radiusS = 0;
  this.radiusE = 70;

  this.thickness = 10;
  this.thicknessS = 10;
  this.thicknessE = 10;

  this.opacity = 0.3;
  this.opacityS = 0.3;
  this.opacityE = 0;

  this.startTime = Date.now();
};
goog.inherits(game.Wave, jx.Object2D);


game.Wave.prototype.render = function() {
  var c = Game.ctx;
  c.save();
  c.translate(this.x, this.y);

  c.lineWidth = this.thickness;
  c.fillStyle = 'rgb(255, 0, 0)';
  c.globalAlpha = this.opacity;
  c.beginPath();
  c.arc(0, 0, this.radius + this.thickness, 0, 2 * Math.PI);
  c.arc(0, 0, this.radius, 2 * Math.PI, 0, true);
  c.closePath();
  c.fill();

  c.restore();
};


game.Wave.prototype.update = function(deltaTime) {
   var effect = this.formulas()['>']( (Date.now() - this.startTime) / this.duration )
   if (Date.now() - this.startTime < this.duration) {
      this.opacity = ((this.opacityE - this.opacityS) / this.duration) * (effect * this.duration) + this.opacityS;
      this.radius = ((this.radiusE - this.radiusS) / this.duration) * (effect * this.duration) + this.radiusS;
      this.thickness = ((this.thicknessE - this.thicknessS) / this.duration) * (effect * this.duration) + this.thicknessS;
   } else {
      this.opacity = this.opacityE;
      this.radius = this.radiusE;
      this.thickness = this.thicknessE;
      if (this.callback) {
         this.callback();
      }
   }
  this.counter += deltaTime;
};


game.Wave.prototype.formulas = function() {
  return {
    'linear': function(n) { return n; },
    '<': function(n) { return Math.pow(n, 3); },
    '>': function(n) { return Math.pow(n - 1, 3) + 1; },
    '<>': function(n) {
       n = n * 2;
       if (n < 1) {
          return Math.pow(n, 3) / 2;
       }
       n -= 2;
       return (Math.pow(n, 3) + 2) / 2;
    },
    backIn: function (n) {
       var s = 1.70158;
       return n * n * ((s + 1) * n - s);
    },
    backOut: function (n) {
       n = n - 1;
       var s = 1.70158;
       return n * n * ((s + 1) * n + s) + 1;
    },
    elastic: function (n) {
       if (n == 0 || n == 1) {
          return n;
       }
       var p = .3,
           s = p / 4;
       return Math.pow(2, -10 * n) * Math.sin((n - s) * (2 * Math.PI) / p) + 1;
    },
    bounce: function (n) {
       var s = 7.5625,
          p = 2.75,
          l;
       if (n < (1 / p)) {
          l = s * n * n;
       } else {
          if (n < (2 / p)) {
             n -= (1.5 / p);
             l = s * n * n + .75;
          } else {
             if (n < (2.5 / p)) {
                n -= (2.25 / p);
                l = s * n * n + .9375;
             } else {
                n -= (2.625 / p);
                l = s * n * n + .984375;
             }
          }
       }
       return l;
    }
  }
};
