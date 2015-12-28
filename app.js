require('dotenv').load();

const ENV = process.env;

const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const express = require('express');

const sequelize = new Sequelize('postgres://' + ENV.DB_USER + '@' + ENV.DB_HOST + '/' + ENV.DB_DATABASE);
const app = express();


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

// sequelize.sync();
sequelize.sync();


/*  Routes  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function cruddy_get(uri, model) {
  app.get(uri, (req, res) => {
    model.findById(req.params.id).then(data => res.send(data)).catch(e => res.send(e));
  });
}

function cruddy_create(uri, model, token) {
  app.post(uri, (req, res) => {
    model.create(req.body[token]).then(data => res.send(data)).catch(e => res.send(e));
  });
}

function cruddy_update(uri, model, token) {
  app.put(uri, (req, res) => {
    model.findById(req.params.id).then(instance => {
      (instance !== null)
        ? instance.update(req.body[token]).then(data => res.send(data)).catch(e => res.send(e))
        : res.send({});
    });
  });
}

function cruddy_get_all(uri, model) {
  app.get(uri, (req, res) => {
    model.findAll().then(data => res.send(data)).catch(e => res.send(e));
  });
}

/* ToDo */
cruddy_get_all('/api/todos', Todo);
cruddy_get('/api/todos/:id', Todo);
cruddy_create('/api/todos', Todo, 'todo');
cruddy_update('/api/todos/:id', Todo, 'todo');

/* Items */
cruddy_get_all('/api/todos/:todo_id/items', TodoItem);
cruddy_get('/api/todos/:todo_id/items/:id', TodoItem);
cruddy_create('/api/todos/:todo_id/items/', TodoItem, 'todo_item');
cruddy_update('/api/todos/:todo_id/items/:id', TodoItem, 'todo_item');

app.listen(3000);
