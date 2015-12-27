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

sequelize.sync();


/*  Routes  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

app.get('/api/todos', (req, res) => {
  Todo.findAll().then(todos => res.send(todos));
});

app.get('/api/todos/:id', (req, res) => {
  Todo.findOne({ id: req.params.id  }).then(todo => res.send(todo));
});

app.post('/api/todos', (req, res) => {
  Todo.create(req.body.todo).then(todo => res.send(todo));
});

app.listen(3000);
