var mongoose = require('mongoose');

var WinnerSchema = new mongoose.Schema({
    openid: String,
    prize: {type: ObjectId, ref: 'Prize'},//奖品
    create_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Winner', WinnerSchema);