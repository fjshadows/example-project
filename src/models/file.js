var config = require('config');

var mongoose = require('mongoose');
const crate = require('mongoose-crate')
const LocalFS = require('mongoose-crate-localfs')

var path = require('path');

var Schema = mongoose.Schema;

var FileSchema = new mongoose.Schema({
  isPublic: String,
  name: String
});

FileSchema.plugin(crate, {
  storage: new LocalFS({
    directory: config.tmpDir
  }),
  fields: {
    attachment: {}
  }
});

mongoose.model('File', FileSchema);