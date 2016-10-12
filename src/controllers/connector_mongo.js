var mongoose = require('mongoose');

/**
 * Constructor for the main MongoExampleConnector
 *
 * @param {Object} config
 * @return {Promise} MongoExampleConnector
 */
const MongoExampleConnector = function(config) {
  var result = {
    fileList: []
  };
  var File = mongoose.model('File');

  /**
   * Method for mapping files
   *
   * @param {Object} data
   * @return {Promise} result
   */
  var _mapFile = function(file) {
    if (file && file.attachment) {
      return {
        id: file.attachment.name,
        name: file.name
      };
    }
  }

  /**
   * Method for return private files
   *
   * @return {Promise} result
   */
  this.findPrivateFiles = function() {
    return File.find({}).then(function (data) {
      if (data) result.fileList = data.map(_mapFile);
      return result
    });
  };

  /**
   * Method for return public files
   *
   * @param {Object} data
   * @return {Promise} result
   */
  this.findPublicFiles = function(data) {
    const isPublic = data.isPublic;
    return File.find({isPublic: isPublic}).then(function (data) {
      if (data) result.fileList = data.map(_mapFile);
      return result
    });
  };

  /**
   * Method for saving file data
   *
   * @param {Object} data
   * @return {Promise} result
   */
  this.loadFile = function(data) {
    const file = new File();
    file.name = data.name;
    file.isPublic = data.isPublic;
    return new Promise((resolve, reject) => {
      file.attach('attachment', {path: data.path} , function(err) {
        file.save(function(err) {
          if(err) reject(err);
          resolve(null);
        });
      })
    });
  };
};

module.exports = MongoExampleConnector;