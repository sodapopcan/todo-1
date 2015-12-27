require('dotenv').load();

var ENV = process.env;

var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var express = require('express');

var sequelize = new Sequelize('postgres://' + ENV.DB_USER + '@' + ENV.DB_HOST + '/' + ENV.DB_DATABASE);
var app = express();

var _ = require('lodash');


/*  Config  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

app.use(bodyParser.urlencoded({ extended: true }));


/*  Models  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var Todo = sequelize.define('todo', {
  name: Sequelize.STRING
});

var TodoList = sequelize.define('todo_list', {
  name: Sequelize.STRING,
  complete: Sequelize.BOOLEAN
});

sequelize.sync();


/*  Routes  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

app.get('/api/todos', function(req, res) {
  Todo.findAll().then(function(todos) {
    res.send(todos);
  });
});

app.get('/api/todos/:id', function(req, res) {
  Todo.findOne({ id: req.params.id  }).then(function(todo) {
    res.send(todo);
  });
});

app.post('/api/todos', function(req, res) {
  Todo.create(req.body.todo).then(function(todo) {
    res.send(todo);
  });
});

app.listen(3000);
