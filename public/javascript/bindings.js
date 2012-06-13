
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
      var pos = params.coord();

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
        params.coord({
          x: start.x + (iX - e.pageX)/params.step,
          y: start.y + (iY - e.pageY)/params.step
        });
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
