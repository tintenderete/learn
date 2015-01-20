(function () {
  'use strict';
  
  /*jslint browser: true*/
  /*global angular, console, err*/
  
  angular.module('ApiService', [])
  
    .factory("Todos", ['$http', '$q', function ($http, $q) {
      var URL = "http://localhost:3000/api/todos",
        miFact;

      miFact = {
        anyadeTarea: function (todo) {
          var request = $http.post(URL, todo),
            handleError = function (error) {
              console.log("ERROR", error);
              return ($q.reject("Error"));
            },
            handleSuccess = function (respuesta) {
              console.log("MUY BIEN", respuesta.status);
              if (respuesta.status === 201) {
                return todo;
              } else {
                return;
              }
            };

          return (request.then(handleSuccess, handleError));

        },
        dameTareas: function () {
          var request = $http.get(URL),
            handleSuccess = function (respuesta) {
              console.log("res:", respuesta);
              return respuesta.data;
            },
            handleError = function (error) {
              console.log("ERROR", error);
              return ($q.reject("Error"));
            };

          return (request.then(handleSuccess, handleError));
        },

        borrarTareas: function () {
          var request = $http.delete(URL),
            handleSuccess = function (respuesta) {
              console.log("res", respuesta.status);
              return;
            },
            handleError = function (error) {
              console.log("Delete fallida");
              return ($q.reject("Error"));
            };

          return (request.then(handleSuccess, handleError));
        },
        
        marcarTareas: function (todo) {
          var request = $http.put(URL + "/" + todo.text, todo),
            handleSuccess = function (respuesta) {
              console.log("MUY BIEN", respuesta.status);
              return;
            },
            handleError = function (error) {
              console.log("Escritura fallida");
              return ($q.reject("Error"));
            };
          
          return (request.then(handleSuccess, handleError));
        }
      };
      return miFact;
    }]);

})();