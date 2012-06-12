
var ko;

// update an object width and height properties
ko.bindingHandlers.resize = {
  init: function(element, valueAccessor) {
    var el = $(element);
    console.log('INIT resize :', element);
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

ko.bindingHandlers.followSize = {
  init: function(element, valueAccessor) {},
  update: function(element, valueAccessor) {
    var value = valueAccessor()
      , object;
    if(ko.isObservable(value)) {
      object = value();
    }
    else {
      object = value;
    }
    element.width = object.w || object.width || 0;
    element.height = object.h || object.height || 0;
  }
};