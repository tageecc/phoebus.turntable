var mongoose = require('mongoose');

var PrizeSchema = new mongoose.Schema({
    name: String,
    level: Number,
    probability: Number,//概率分子，分母1000
    num: Number
})

module.exports = mongoose.model('Prize', PrizeSchema);