module.exports = (ctx, next) => {
  ctx.isAuthenticated() ? next(): ctx.redirect('/');
};
