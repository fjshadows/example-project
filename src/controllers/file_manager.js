var config = require('config');

var Connector = require('./connector_pg');
var connector = new Connector(config.pg);

exports.getPrivateFiles = ctx => new Promise((resolve, reject) => {
  return connector.findPrivateFiles().then(resolve).catch(reject);
});

exports.getPublicFiles = ctx => new Promise((resolve, reject) => {
  return connector.findPublicFiles({isPublic: true}).then(resolve).catch(reject);
});

exports.loadFile = data => new Promise((resolve, reject) => {
  return connector.loadFile(data).then(resolve).catch(reject);
});