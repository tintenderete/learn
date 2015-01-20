/* jshint node: true, -W119,-W104, -W124 */

var db = require('../../index').db; //Recivimos desde el export en index.js donde esta el servidor
var fs = require('fs');
var todoUtils = require('../../tools/todos-utils');
var COLLECTION = db.collection('todos');// Selecionamso la base de datos con la que vamso a trabajar, collection es una coleccion de metodos

var URL = process.cwd() + '/public/data/todos.json';
/*
var readAsync = function () {
  return function(callback) {
    fs.readFile(URL, function(err, todos) {
      if (err) {
        console.error(err);
        return callback(err);
      }
      callback(null, JSON.parse(todos.toString()));
    });
  };
};
*/

/*
var writeAsync = function (todos) {
  return function(callback) {
    fs.writeFile(URL, JSON.stringify(todos), function(err) {
      if (err) {
          console.error(err);
          return callback(err);
      }
      callback();
    });
  };
};
*/

var newTodo = function *() {
  var todo = this.request.body;
  if (!todo || !todo.text) {
    this.status = 404;
    return;
  }
  
  var todos = yield readAsync();
  var idx = todoUtils.buscarTarea(todos, todo);
  yield writeAsync(todos);
  this.status = idx > -1 ? 200 : 201;
};

exports.newTodo = newTodo;

var marcar = function *(text) {
  var todo = this.request.body;
  if (!todo || !todo.text || !text) {
    this.status = 404;
    return;
  }
  var todos = yield todoUtils.readAsyncFromDb(COLLECTION);
  var idx = todoUtils.buscarTarea(todos, todo);
  if (idx > -1) {
    todos[idx].done = !todos[idx].done;
    yield writeAsync(todos);  
  }
  this.status = 200;
};


exports.marcar = marcar;



var borrar = function *() {
  var todos = yield todoUtils.readAsyncFromDb(COLLECTION);
  var save = todoUtils.marcarCompletados(todos);
  yield writeAsync(save);
  this.status = 200;
};

exports.borrar = borrar;
/* Anotaciones:
    sin next y next() el server no se cae. 
*/
var listar = function *() {
  var data = yield todoUtils.readAsyncFromDb(COLLECTION);
  this.body = data;
  if(this.body){// Modificaion par ahacerlo testeable
    return true;
  }
};

exports.listar = listar;

var marcarTarea = function *(text) {
  if (!text) {
    return null;
  }
  var todos = yield todoUtils.readAsyncFromDb(COLLECTION);
   
  var found = false;
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].text == text) {
      todos[i].done = !todos[i].done;
      found = true;
    }
  }
  if (!found) {
      return true;
  }
  yield writeAsync(todos);
  
  return true;
};


exports.marcarTarea = marcarTarea;


var añadirTarea = function *(todo) {
  if (!todo) {
    return null;
  }
  var todos = yield todoUtils.readAsyncFromDb(COLLECTION);
  var found = false;
  for (var i = 0; i < todos.length; i++) {
    if (todos[i].text == todo.text) {
      found = todos[i];
    }
  }
  if (!found) {
    yield todoUtils.insertAsyncToDb(COLLECTION, todo);
  } else {
    // TODO: Actualizar tarea
  }
  return true;
};

exports.añadirTarea = añadirTarea;

var borrarTarea = function *() {
  var todos = yield todoUtils.readAsyncFromDb(COLLECTION);
  var save = [];
  for (var i = 0; i < todos.length; i++)
  {
    if(!todos[i].done){
      save.push(todos[i]);
    }
  }
  yield writeAsync(save);
  return true;
};

exports.borrarTarea = borrarTarea;


var updateAsyncDb = function (todo) {
  return function(callback) {
    COLLECTION.update(
      { text : todo.text },
      { $set: { done : !todo.done } }, 
      function(err, result) {
        if (err) {
          console.error(err);
          return callback(err);
        }
        todo.done = !todo.done;
        callback();
      }
    );
  };
};

var marcarTareaDB = function *(todo) {
  yield updateAsyncDb(todo);
  return todo;
};

exports.marcarTareaDB = marcarTareaDB;


var removeTodoDB = function () {
  return function(callback) {
    COLLECTION.remove(
      { done : true }, 
      function(err, result) {
        if (err) {
          console.error(err);
          return callback(err);
        }
      callback();
      }
    );
  };
};

var borrarTareasDB = function *() {
  yield removeTodoDB();
  return true;
};

exports.borrarTareasDB = borrarTareasDB;


