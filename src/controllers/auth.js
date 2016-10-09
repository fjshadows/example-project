exports.createUser = ctx => new Promise((resolve, reject) => {
  var User = require('mongoose').model('User');
  try {
    const reqBody = (ctx && ctx.request && ctx.request.body) ? ctx.request.body: {};
    var user = new User({ username: reqBody.username, password: reqBody.password });
    user.save(function(err) {
      ctx.redirect('/');
      resolve();
    });
  } catch (err) {
    reject(err);
    ctx.redirect('/login');
  }
});