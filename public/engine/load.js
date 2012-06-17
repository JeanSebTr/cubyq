var JSGame;

(function() {

var cache = {};
var loadZone;

JSGame.Load = function(data, progress, end) {
  /*for(var i=0; i<data.length; i++) {
    var res = data[i];
    if(!cache[res.file]) {
      var tag, attr = {};
      if(res.type == 'script') {
        tag = 'script';
        attr.src = res.file;
        attr.type = 'text/javascript';
      }
      if(tag) {
        var el = document.createElement(tag);
        for(var a in attr) {
          el[a] = attr[a];
        }
        loadZone.appendChild(el);
      }
    }
  }*/
  end();
};

loadZone = document.createElement('div');
loadZone.style.display = 'none';
$(function() {
  document.body.appendChild(loadZone);
});

})();
