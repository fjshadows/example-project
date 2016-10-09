var router = require('koa-router')();

var authController = require('../src/controllers/auth');

module.exports = function (app, passport) {
  router.get('/', ctx => {
    if (ctx.isAuthenticated()) {
      ctx.render('private')
    } else {
      ctx.redirect('/login');
    }
  });
  router.get('/login', ctx => {
    ctx.render('parts/login');
  });
  router.post('/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
  );
  router.get('/logout', ctx => {
    ctx.logout();
    ctx.redirect('login');
  });
  router.get('/register', ctx => {
    ctx.render('parts/register');
  });
  router.post('/register', authController.createUser);
  router.get('*', ctx => {
    ctx.render('404', { title: 'Page Not Found'});
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
};