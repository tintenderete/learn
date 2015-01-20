(function () {
  'use strict';
  
  /*jslint browser: true*/
  /*global angular, console, err, io*/
  angular.module('todoApp', ['toastr', 'app.directives', 'ApiService'])
    .controller('TodoController', ['$scope','toastr', 'Todos', function ($scope,  toastr, Todos) {
      
      ////REGISTRO
      ///// MODO CLIENTE
      $scope.addUser = function(){
        $scope.myUserName = $scope.userName;
        $scope.userName="";
      };
      ///MODO SERVIDOR
      $scope.addUserServidor = function(){
        $scope.myUserName = $scope.userNameServidor;
        var thisUser = $scope.myUserName ;
        socket.emit('client_emit_añadir usuario', thisUser);
        console.log(thisUser);
        $scope.userNameServidor="";
       
      };
      $scope.$watch('myUserName', function(newVal, oldVal) {
        if (!newVal) {
          return;
        }
        Todos.dameTareas().then(
          function( todos ) {
            $scope.todos = todos;
          }
        );
      });
      
      ////FIN REGISTRO
      var socket = io();
      //Broadcast
      socket.on('tarea marcada', function (data, user) {
        if (!$scope.myUserName) {
          return;
        }
        if (user) {
          var actUser = user;
        } else {
          var actUser = "Anonimo";
        }
        angular.forEach($scope.todos, function(val) {
          if (val.text == data.tarea) {
            val.done = !val.done;
            toastr.success('Marco una tarea',actUser + ': ');
          }
        });
      });
      
      socket.on('tarea no marcada', function (data) {
        if (!$scope.myUserName) {
          return;
        }
        angular.forEach($scope.todos, function(val) {
          if (val.text == data.tarea) {
            val.done = !val.done;
            toastr.error('La tarea no ha sido marcada', 'Lo sentimos');
          }
        });
      });
      socket.on('emit_tarea marcada', function (data) {
        if (!$scope.myUserName) {
          return;
        }
        toastr.success('Tarea marcada', 'exito!');
      });
      
      socket.on('server_bc_tarea anyadida', function (data, user) {
        if (!$scope.myUserName) {
          return;
        }
        if (user) {
          var actUser = user;
        } else {
          var actUser = "Anonimo";
        }
        $scope.todos.push(data);
        toastr.success('Añadio una tarea', actUser + ': ' );
      });
      
      socket.on('server_emit_tarea anyadida', function (data) {
        if (!$scope.myUserName) {
          return;
        }
        $scope.todos.push(data);
        $scope.todoText = "";
        toastr.success('Tarea añadida', 'exito!');
      });
      //
      socket.on('server_bc_tarea borrada', function () {
        if (!$scope.myUserName) {
          return;
        }
        $scope.todos = []; 
        Todos.dameTareas().then(
          function( todos ) {
            $scope.todos = todos;
          }
        );
         toastr.success('Tarea borrada', 'atencion!');
      });
      
      socket.on('server_emit_tarea borrada', function () {
        if (!$scope.myUserName) {
          return;
        }
        toastr.success('Tarea borrada', 'exito!');
      });
      ///
      
      
      $scope.todos = []; 

      

      $scope.addTodo = function () {
        var todo = {text: $scope.todoText, done: false};
        var user = $scope.myUserName;
        socket.emit('client_emit_anyadir tarea', todo, user);
        //console.log(user); llega
       
      };

      $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.todos, function (todo) {
          count += todo.done ? 0 : 1;
        });
        return count;
      };

      $scope.archive = function () {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function (todo) {
          if (!todo.done) {
            $scope.todos.push(todo);
          }
        });
        socket.emit('client_emit_borrar tarea');
        /*
        Todos.borrarTareas().then(undefined,
          function(err) {
            toastr.error('delete fallida', 'Error');
          }
        );
        */
      };

      $scope.toggle = function (todo) {
        socket.emit('marcar tarea', {text: todo.text, done: !todo.done});
        
        
      };

    }]);
  
})();