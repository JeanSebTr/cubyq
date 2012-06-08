var FPS = function(start) {
  this.cur = Math.floor(start/1000);
  this.last = [];
  this.cpt = 0;
};
FPS.prototype = {
  increment: function(now) {
    if(!now) now = Date.now();
    var n = Math.floor(now/1000);
    if(n > this.cur) {
      this.last.push(this.cpt);
      this.cpt = 0;
      this.last = this.last.slice(-2);
      this.cur = n;
    }
    this.cpt++;
  },
  calc: function() {
    var n = 0, i=this.last.length, j=i+1;
    while(--i>=0) { n+=this.last[i]; }
    return Math.round((n + this.cpt)/j);
  }
};

ko.bindingHandlers.move = {
  init: function(element, valueAccessor) {
    var el = $(element)
      , moving = false
      , start = null
      , iX = 0
      , iY = 0;
    
    el.mousedown(function(e) {
      var pos = valueAccessor()();
      if(pos.m && !moving) {
        start = pos;
        iX = e.pageX;
        iY = e.pageY;
        moving = true;
      }
    });
    el.mouseup(function(e) {
      moving = false;
    });
    el.mousemove(function(e) {
      if(moving) {
        var pos = {m: start.m};
        pos.x = start.x + (iX - e.pageX)/50;
        pos.y = start.y + (iY - e.pageY)/50;
        valueAccessor()(pos);
      }
    });
  },
  update: function(element, valueAccessor) {
    
  }
};

