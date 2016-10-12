// var pgp = require('pg-promise')();
var pg = require('pg');

/**
 * Constructor for the main PgExampleConnector
 *
 * @param {Object} config
 * @return {Promise} PgExampleConnector
 */
const PgExampleConnector = function(config) {
  var result = {
    fileList: []
  };
  var pool = new pg.Pool(config);

  /**
   * Method for mapping files
   *
   * @param {Object} data
   * @return {Promise} result
   */
  var _mapFile = function(file) {
    if (file) {
      return {
        id: file.generated_name,
        name: file.name
      };
    }
  }

  /**
   * Method for getting private files
   *
   * @return {Promise} result
   */
  this.findPrivateFiles = function() {
    return new Promise((resolve, reject) => {
      pool.connect(function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        client.query('SELECT name, generated_name FROM files', 
          function(err, data) {
            done();
            if(err) {
              return console.error('error running query', err);
            }
            if (data && data.rows) {
              result.fileList = data.rows.map(_mapFile); 
            }
            resolve(result);
          }
        );
      });
    });
  };

  /**
   * Method for getting public files
   *
   * @param {Object} data
   * @return {Promise} result
   */
  this.findPublicFiles = function(data) {
    const isPublic = data.isPublic;
    return new Promise((resolve, reject) => {
      pool.connect(function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        client.query(`
          SELECT name, generated_name
          FROM files
          WHERE is_public = ${isPublic}`, 
          function(err, data) {
            done();
            if(err) {
              return console.error('error running query', err);
            }
            if (data && data.rows) {
              result.fileList = data.rows.map(_mapFile); 
            }
            resolve(result);
          }
        );
      });
    });
  };

  /**
   * Method for saving file data
   *
   * @param {Object} data
   * @return {Promise} undefind
   */
  this.loadFile = function(data) {
    var {
      name,
      path,
      filename,
      isPublic
    } = data;
    return new Promise((resolve, reject) => {
      pool
        .query(`
          INSERT INTO files (name, path, generated_name, is_public)
          VALUES ($1, $2, $3, $4)`,
          [
            name,
            path,
            filename,
            isPublic
          ]
        )
        .then(function (data) {
          resolve(null);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  };
}

module.exports = PgExampleConnector;