
var ko;

// update an object width and height properties
ko.bindingHandlers.resize = {
  init: function(element, valueAccessor) {
    var el = $(element);
    $(window).resize(function() {
      var value = valueAccessor()
        , object;
      if(ko.isObservable(value)) {
        object = value();
      }
      else {
        object = value;
      }
      object[(typeof object.width == 'undefined')?'w':'width'] = el.width();
      object[(typeof object.height == 'undefined')?'h':'height'] = el.height();
      if(ko.isObservable(value)) {
        value(object);
      }
    });
    var value = valueAccessor()
      , object;
    if(ko.isObservable(value)) {
      object = value();
    }
    else {
      object = value;
    }
    object[(typeof object.width == 'undefined')?'w':'width'] = el.width();
    object[(typeof object.height == 'undefined')?'h':'height'] = el.height();
    if(ko.isObservable(value)) {
      value(object);
    }
  }
};

ko.bindingHandlers.move = {
  init: function(element, valueAccessor) {
    var params = valueAccessor()
      , el = $(element)
      , moving = false
      , start = null
      , iX = 0
      , iY = 0;
    
    el.mousedown(function(e) {
      var pos = {
        x: params.coord.x()*1 || 0,
        y: params.coord.y()*1 || 0
      };

      if(params.active() && !moving) {
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
        params.coord.x(start.x + (iX - e.pageX)/params.step);
        params.coord.y(start.y + (iY - e.pageY)/params.step);
      }
    });
  }
};

ko.bindingHandlers.select = {
  init: function(element, valueAccessor) {
    var params = valueAccessor()
      , el = $(element)
      , selecting = false
      , start, end;
    function save() {
      var res = {
          x1: Math.round(start.x),
          y1: Math.round(start.y),
          x2: Math.round(end.x),
          y2: Math.round(end.y)
        };
      if(res.x1 > res.x2) {
        var x = res.x1;
        res.x1 = res.x2;
        res.x2 = x;
      }
      if(res.y1 > res.y2) {
        var y = res.y1;
        res.y1 = res.y2;
        res.y2 = y;
      }
      if(res.x1 == res.x2 || res.y1 == res.y2) {
        params.rect(false);
      }
      else {
        params.rect(res);
      }
    }
    
    el.mousedown(function(e) {
      if(params.active() && !selecting) {
        start = params.convert(e.offsetX, e.offsetY);
        end = params.convert(e.offsetX, e.offsetY);
        selecting = true;
      }
    });
    el.mouseup(function(e) {
      if(params.active() && selecting) {
        selecting = false;
        save();
      }
    });
    el.mousemove(function(e) {
      if(selecting) {
        end = params.convert(e.offsetX, e.offsetY);
        save();
      }
    });
  }
};

ko.bindingHandlers.draw = {
  init: function(element, valueAccessor) {
    var params = valueAccessor()
      , el = $(element)
      , drawing = false
      , last;
    function save() {
      var res = {
          x1: Math.round(start.x),
          y1: Math.round(start.y),
          x2: Math.round(end.x),
          y2: Math.round(end.y)
        };
      if(res.x1 > res.x2) {
        var x = res.x1;
        res.x1 = res.x2;
        res.x2 = x;
      }
      if(res.y1 > res.y2) {
        var y = res.y1;
        res.y1 = res.y2;
        res.y2 = y;
      }
      if(res.x1 == res.x2 || res.y1 == res.y2) {
        params.rect(false);
      }
      else {
        params.rect(res);
      }
    }
    
    el.mousedown(function(e) {
      if(params.active() && !drawing) {
        last = params.convert(e.offsetX, e.offsetY, true);
        params.method(last.x, last.y);
        drawing = true;
      }
    });
    el.mouseup(function(e) {
      if(params.active() && drawing) {
        drawing = false;
      }
    });
    el.mousemove(function(e) {
      if(drawing) {
        var current = params.convert(e.offsetX, e.offsetY, true);
        if(current.x != last.x || current.y != last.y) {
          params.method(current.x, current.y);
          last = current
        }
      }
    });
  }
};

ko.bindingHandlers.tileset = {
  init: function(element, valueAccessor) {
    var editor = valueAccessor();
    editor.setTileZone(element);
  }
};
