require('dotenv').load();

const ENV = process.env;

const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const express = require('express');

const sequelize = new Sequelize('postgres://' + ENV.DB_USER + '@' + ENV.DB_HOST + '/' + ENV.DB_DATABASE);
const app = express();

const _ = require('lodash');


/*  Config  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

app.use(bodyParser.urlencoded({ extended: true }));


/*  Models  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const Todo = sequelize.define('todo', {
  name: Sequelize.STRING
});

const TodoItem = sequelize.define('todo_item', {
  body: Sequelize.STRING,
  complete: Sequelize.BOOLEAN
});

Todo.hasMany(TodoItem, { as: 'Items' });
TodoItem.belongsTo(Todo);

sequelize.sync();


/*  Routes  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function cruddy_create(uri, model, token) {
  app.post(uri, (req, res) => {
    model.create(req.body[token]).then(data => res.send(data)).catch(e => res.send(e));
  });
}

function cruddy_update(uri, model, token) {
  app.put(uri, (req, res) => {
    model.findOne({ id: req.params.id }).then(instance => {
      instance.update(req.body[token]).then(data => res.send(data));
    });
  });
}

/* ToDo */
// List all
app.get('/api/todos', (req, res) => {
  Todo.findAll().then(todos => res.send(todos));
});
// List one
app.get('/api/todos/:id', (req, res) => {
  Todo.findOne({ id: req.params.id  }).then(todo => res.send(todo));
});
cruddy_create('/api/todos', Todo, 'todo');
cruddy_update('/api/todos/:id', Todo, 'todo');

// Create
app.post('/api/todos', (req, res) => {
  Todo.create(req.body.todo).then(todo => res.send(todo));
});

// Update
app.put('/api/todos/:id', (req, res) => {
  Todo.findOne({ id: req.params.id }).then(todo => {
    todo.update(req.body.todo).then(todo => res.send(todo));
  });
});

app.post('/api/todo/items', (req, res) => {
  TodoItem.create(req.body.item).then(item => send(item));
});

app.listen(3000);
