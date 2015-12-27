require('dotenv').load();

var ENV = process.env;

var pg = require('pg');
var _ = require('lodash');

var dburi = 'postgres://' + ENV.DB_USER + '@' + ENV.DB_HOST + '/' + ENV.DB_DATABASE;

pg.connect(dburi, function(err, client, done) {
  if (err) return console.error('database error', err);

  client.query("SELECT * FROM todos", function(err, result) {
    done();

    _.map(result.rows, function(todo) {
      console.log(todo.id, todo.name);
    });
  });
});
