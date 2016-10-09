var mongoose = require('mongoose');

exports.getPrivateFiles = ctx => new Promise((resolve, reject) => {
  try {
    return resolve({
      fileList: [{
        id: '8b3626027b5947436829a1d7da4f7cc2',
        name: 'private map'
      }, {
        id: '987582721633d8060f7ed64da0d8d7fb',
        name: 'private document'
      }]
    });
  } catch (err) {
    return reject({});
  }
});

exports.getPublicFiles = ctx => new Promise((resolve, reject) => {
  try {
    return resolve({
      fileList: [{
        id: '8b3626027b5947436829a1d7da4f7cc2',
        name: 'public map'
      }, {
        id: '987582721633d8060f7ed64da0d8d7fb',
        name: 'public document'
      }]
    });
  } catch (err) {
    return reject({});
  }
});

exports.loadFile = data => new Promise((resolve, reject) => {
  const File = mongoose.model('File');
  const file = new File();
  file.name = data.name;
  file.isPublic = data.isPublic;
  file.attach('attachment', {path: data.path} , function(err) {
    file.save(function(err) {
      if(err) reject(err);
      resolve(null);
    });
  })
});