var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
var WinnerSchema = new mongoose.Schema({
    user: {type:ObjectId,ref:'User'},
    prize: {type: ObjectId, ref: 'Prize'},//奖品
    token:String,
    create_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Winner', WinnerSchema);