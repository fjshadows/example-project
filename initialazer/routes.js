const router = require('koa-router')();
const config = require('config');
const multer = require('koa-multer');

const authController = require('../src/controllers/auth');
const fileManager = require('../src/controllers/file_manager');

const upload = multer({dest: 'public/uploads'})

module.exports = function (app, passport) {
  router.get('/private', ctx => new Promise((resolve, reject) => {
    if (ctx.isAuthenticated()) {
      fileManager.getPrivateFiles().then(data => {
        ctx.render('private', data)
        resolve();
      });
    } else {
      ctx.redirect('/');
      resolve();
    }
  }));

  router.get('/', ctx => new Promise((resolve, reject) => {
    fileManager.getPublicFiles().then(data => {
      ctx.render('public', data);
      resolve();
    });
  }));

  router.get('/login', ctx => {
    ctx.render('parts/login');
  });
  router.post('/login',
    passport.authenticate('local', {
      successRedirect: '/private',
      failureRedirect: '/'
    })
  );
  router.get('/logout', ctx => {
    ctx.logout();
    ctx.redirect('/');
  });

  router.get('/register', ctx => {
    ctx.render('parts/register');
  });
  router.post('/register', authController.createUser);

  router.post('/upload', upload.single('file'), ctx => new Promise((resolve, reject) => {
    const fileData = ctx.req.file || {};
    const isPublic = (ctx.req.body && ctx.req.body.isPublic) ? true: false;
    fileManager.loadFile({
      isPublic: isPublic,
      name: fileData.originalname,
      filename: fileData.filename,
      path: fileData.path
    }).then(err => {
      if (err) reject(err);
      resolve();
      ctx.redirect('/private');
      }
    )
  }));

  router.post('/register', authController.createUser);

  router.get('*', ctx => {
    ctx.body = '404: Page Not Found';
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
};