var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    openid: String,
    nickname: String,
    username: String,
    headimgurl: String,
    sex: String,
    phone: Number,
    address: String,
    lottery_number: {
        type: Number,
        default: 2
    },//剩余抽奖次数
    winning_times: {
        type: Number,
        default: 0
    },//中奖次数
    create_at: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', UserSchema);