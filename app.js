const express = require('express');
const app = express();
const Sequelize = require('sequelize');

const config = require('./config')[process.env.NODE_ENV || 'development'];
const db = config.db;
var routers = require('./routers');
var middleware = require('./util').middleware;
app.use('/', routers);
app.use(middleware.error);

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  dialect: db.dialect,
  operatorsAliases: false
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    app.listen(3000, () => console.log('App listening on port 3000!'));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
