/* jshint node: true */

var marcarCompletados = function(todos) {
  if (!Array.isArray(todos)) {
    return null;
  }
  var save = [];
  for (var i = 0; i < todos.length; i++)
  {
    if(todos[i].done === false){
      save.push(todos[i]);
    }
  }
  return save;
  
};

exports.marcarCompletados = marcarCompletados;

var buscarTarea = function(todos, todo, key) {  
  var found = -1;
  key = key || 'text';
  for (var i = 0; i < todos.length; i++) {
      if (todos[i][key] == todo[key]) {
        todos[i] = todo;
        found = i;
      }
  }
  if (!found) {
      todos.push(todo);
  }
  return found;
};

exports.buscarTarea = buscarTarea;

var readAsyncFromDb = function (collection) {
  return function(callback) {
    collection.find({}).toArray(function(err, docs) {
      if (err) {
        console.error(err);
        return callback(err);
      }
      callback(null, docs);
    });
  };
};

exports.readAsyncFromDb = readAsyncFromDb;

var insertAsyncToDb = function (collection, todo) {
  return function(callback) {
    collection.insert(todo, function(err, result) {
      if (err) {
        console.error(err);
        return callback(err);
      }
      //console.log(result.ops.length);
      callback(err, result);
    });
  };
};

exports.insertAsyncToDb = insertAsyncToDb;