/* jshint node: true, -W119,-W104, -W124 */

var koa = require('koa');
var route = require('koa-route');
var serve = require('koa-static');
var logger = require('koa-logger');
var koa = require('koa.io');
var bodyParser = require('koa-bodyparser');
var MongoClient = require('mongodb').MongoClient;

process.env.NODE_ENV = process.env.NODE_ENV || "development";

var MONGOURL;

if (process.env.NODE_ENV == "production") {
  MONGOURL = 'mongodb://localhost:27017/todos';
} else if (process.env.NODE_ENV == "test") {
  MONGOURL = 'mongodb://localhost:27017/todos_test';
} else {
  MONGOURL = 'mongodb://localhost:27017/todos-dev';
}



var app = koa();

//Partes del Middleware
app.use(logger());
app.use(bodyParser());


// Ficheros servidos: ahora se puede acceder 
// a todos los archivos dentro de estas
app.use(serve('public'));
app.use(serve('bower_components'));

MongoClient.connect(MONGOURL, function(err, db) {
  if (err) {
    throw "Error";
  }
  console.log("Connected correctly to server");
  exports.db = db; // Exportamos para poder hacer uso de ella
  
  // RUTAS
  var api = require('./routes/api/todos');

  /* API */
  app.use(route.get('/api/todos', api.listar)); 
  /*Abandonadas
  app.use(route.post('/api/todos', api.newTodo));
  app.use(route.put('/api/todos/:text', api.marcar));
  app.use(route.delete('/api/todos', api.borrar));
  */
  app.listen(3000);


  app.io.use(function* userConnect(next) {
    // on connect
    console.log('somebody connected');
    console.log(this.headers);
    yield* next;
    // on disconnect
  });



  app.io.route('marcar tarea', function* (next, todo) {
    var t = yield api.marcarTareaDB(todo);
    //console.log(todo);
    if (t) {
      this.broadcast.emit('tarea marcada', {"tarea": todo}, this.username);
      this.emit('emit_tarea marcada', {"tarea": t});
    } else {
      this.emit('tarea no marcada', {"tarea": t});
    }
  });

  app.io.route('client_emit_anyadir tarea', function* (next, todo, user) {
    var t = yield api.añadirTarea(todo);
    if (t) {
      //console.log(user); llega
      this.broadcast.emit('server_bc_tarea anyadida', todo, user);
      this.emit('server_emit_tarea anyadida', todo);
    }

  });

  app.io.route('client_emit_borrar tarea', function* (next) {
      console.log("paso1");
    var t = yield api.borrarTareasDB();
    if (t) {
      //console.log("paso2");entra
      this.broadcast.emit('server_bc_tarea borrada');
      this.emit('server_emit_tarea borrada');
    }

  });



  app.io.route('client_emit_añadir usuario', function* (next, username) {
    // we store the username in the socket session for this client
    this.username = username;
    console.log("nuevo usuario", this.username);
  });






});











/*
// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

// middleware for connect and disconnect
app.io.use(function* userLeft(next) {
  // on connect
  console.log('somebody connected');
  console.log(this.headers)
  yield* next;
  // on disconnect
  if (this.addedUser) {
    delete usernames[this.username];
    --numUsers;

    // echo globally that this client has left
    this.broadcast.emit('user left', {
      username: this.username,
      numUsers: numUsers
    });
  }
});



app.io.route('add user', function* (next, username) {
  // we store the username in the socket session for this client
  this.username = username;
  // add the client's username to the global list
  usernames[username] = username;
  ++numUsers;
  this.addedUser = true;
  this.emit('login', {
    numUsers: numUsers
  });

  // echo globally (all clients) that a person has connected
  this.broadcast.emit('user joined', {
    username: this.username,
    numUsers: numUsers
  });
});

// when the client emits 'new message', this listens and executes
app.io.route('new message', function* (next, message) {
  // we tell the client to execute 'new message'
  this.broadcast.emit('new message', {
    username: this.username,
    message: message
  });
});

// when the client emits 'typing', we broadcast it to others
app.io.route('typing', function* () {
  console.log('%s is typing', this.username);
  this.broadcast.emit('typing', {
    username: this.username
  });
});

// when the client emits 'stop typing', we broadcast it to others
app.io.route('stop typing', function* () {
  console.log('%s is stop typing', this.username);
  this.broadcast.emit('stop typing', {
    username: this.username
  });
});
*/