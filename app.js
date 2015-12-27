require('dotenv').load();

var ENV = process.env;

var pgp = require('pg-promise')(/* options */);
var express = require('express');

var db = pgp('postgres://' + ENV.DB_USER + '@' + ENV.DB_HOST + '/' + ENV.DB_DATABASE);
var app = express();

var _ = require('lodash');

function apiCall(res, sql, params) {
  db.query(sql, params)
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      res.send("There was an error: " + err);
    });
}

app.get('/api/todos', function(req, res) {
  apiCall(res, "SELECT * FROM todos");
});

app.get('/api/todos/:id', function(req, res) {
  apiCall(res, "SELECT * FROM todos WHERE id = $1", [req.params.id]);
});

app.listen(3000);
