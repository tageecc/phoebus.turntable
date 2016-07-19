var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    openid: String,
    nickname: String,
    headimgurl: String,
    sex: String,
    phone: Number,
    address: String,
    create_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', UserSchema);