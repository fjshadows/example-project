const mongoose = require('mongoose');
const _File = mongoose.model('File');

const _mapFileList = file => {
  if (file && file.attachment) {
    return {
      id: file.attachment.name,
      name: file.name
    };
  }
}

exports.getPrivateFiles = ctx => new Promise((resolve, reject) => {
  try {
    let result = {
      fileList: []
    };
    return _File.find({}, function(err, data) {
      if (data) result.fileList = data.map(_mapFileList);
      resolve(result);
    });
  } catch (err) {
    return reject(result);
  }
});

exports.getPublicFiles = ctx => new Promise((resolve, reject) => {
  try {
    let result = {
      fileList: []
    };
    return _File.find({isPublic: true}, function(err, data) {
      if (data) result.fileList = data.map(_mapFileList);
      resolve(result);
    });
  } catch (err) {
    return reject(result);
  }
});

exports.loadFile = data => new Promise((resolve, reject) => {
  const file = new _File();
  file.name = data.name;
  file.isPublic = data.isPublic;
  file.attach('attachment', {path: data.path} , function(err) {
    file.save(function(err) {
      if(err) reject(err);
      resolve(null);
    });
  })
});