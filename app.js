require('dotenv').load();

var ENV = process.env;

var pgp = require('pg-promise')(/* options */);
var _ = require('lodash');
var express = require('express');

var db = pgp('postgres://' + ENV.DB_USER + '@' + ENV.DB_HOST + '/' + ENV.DB_DATABASE);
var app = express();

app.get('/api/todos', function(req, res) {
  db.query("SELECT * FROM todos")
    .then(function(data) {
      res.send(data);
    })
    .catch(function(err) {
      res.send("There was an error: " + err);
    });
});

app.listen(3000);
