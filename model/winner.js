var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
var WinnerSchema = new mongoose.Schema({
    name:String,
    address:Srting,
    level:Number,
    prize_name:String,
    token:String,
    create_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Winner', WinnerSchema);