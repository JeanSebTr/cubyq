
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
  }
};
