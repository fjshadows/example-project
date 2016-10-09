'use strict';
var Koa = require('koa');
var config = require('config');
var mongoose = require('mongoose');
var passport = require('koa-passport');

mongoose.connect(config.mongo.url);
mongoose.connection.on('error', function (err) {
  console.log(err);
});
require('./src/models/user');

var app = module.exports = new Koa();

require('./initialazer/passport')(passport, config);

require('./initialazer/koa')(app, config, passport);

require('./initialazer/routes')(app, passport);

console.log('Server started, listening on port: ' + config.app.port);
app.listen(config.app.port);
