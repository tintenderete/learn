(function () {
  'use strict';
  
  /*jslint browser: true*/
  /*global angular, console, err*/
  
  angular.module('app.directives', [])
  
    .directive("julianIcon", function () {
      return {
        restrict: 'AEC',
        scope: {
          texto1: '=texto'
        },
        link: function(scope, element, attrs) {
          element.html("hola");
        }
      };
    })
    .directive('myCustomer', function() {
      return {
        template: 'Name: {{customer.name}} Address: {{customer.address}}'
      };
    })
  .directive('myCurrentTime', ['$interval', 'dateFilter', function($interval, dateFilter) {

  function link(scope, element, attrs) {
    var format,
        timeoutId;

    function updateTime() {
      element.text(dateFilter(new Date(), format));
    }

    scope.$watch(attrs.myCurrentTime, function(value) {
      format = value;
      console.log(value);
      updateTime();
    });

    element.on('$destroy', function() {
      $interval.cancel(timeoutId);
    });

    // start the UI update process; save the timeoutId for canceling
    timeoutId = $interval(function() {
      updateTime(); // update DOM
    }, 1000);
  }

  return {
    link: link
  };
}])
  .directive('myDraggable', ['$document', function($document) {
  return function(scope, element, attr) {
    var startX = 0, startY = 0, x = 0, y = 0;

    element.css({
     position: 'relative',
     border: '1px solid red',
     backgroundColor: 'lightgrey',
     cursor: 'pointer'
    });

    element.on('mousedown', function(event) {
      // Prevent default dragging of selected content
      event.preventDefault();
      startX = event.pageX - x;
      startY = event.pageY - y;
      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    function mousemove(event) {
      y = event.pageY - startY;
      x = event.pageX - startX;
      element.css({
        top: y + 'px',
        left:  x + 'px'
      });
    }

    function mouseup() {
      $document.off('mousemove', mousemove);
      $document.off('mouseup', mouseup);
    }
  };
}]);
                       
})();