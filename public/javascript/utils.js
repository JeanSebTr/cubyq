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
