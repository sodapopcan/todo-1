require('dotenv').load();

var ENV = process.env;

var pg = require('pg');
var dburi = 'postgres://' + ENV.DB_USER + '@' + ENV.DB_HOST + '/' + ENV.DB_DATABASE;

pg.connect(dburi, function(err, client, done) {
  if (err) return console.error('database error', err);

  client.query("INSERT INTO todos (name) VALUES('Andrew')", function(err, result) {
    done();

    if (err) return console.error("Couldn't insert", err);

    console.log(result);
  });
});
