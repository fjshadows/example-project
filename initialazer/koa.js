const _ = require('lodash');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const Jade = require('koa-jade');
const serve   = require('koa-static');
const session = require('koa-generic-session');

module.exports = function (app, config, passport) {
  app.keys = config.app.keys;
  app.use(serve('public'));
  app.use(convert(session()));
  app.use(bodyParser());

  app.use(passport.initialize());
  app.use(passport.session());

  const jade = new Jade(_.assign(config.jade, {
    viewPath: 'src/views/'
  }));
  jade.use(app);
};