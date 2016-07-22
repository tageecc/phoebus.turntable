var mongoose = require('mongoose');

var AdminSchema = new mongoose.Schema({
    name: String,
    passwd: String
})

module.exports = mongoose.model('Admin', AdminSchema);