var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminSchema = new mongoose.Schema({
    name: String,
    passwd: String
})
var Admin = mongoose.model('Admin', AdminSchema);

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
var User = mongoose.model('User', UserSchema);

var PrizeSchema = new mongoose.Schema({
    name: String,
    level: Number,
    probability: Number,//概率分子，分母1000
    num: Number
})
var Prize = mongoose.model('Prize', PrizeSchema);

var WinnerSchema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    prize: {type: Schema.Types.ObjectId, ref: 'Prize'},//奖品
    token: String,
    create_at: {
        type: Date,
        default: Date.now()
    }
})
var Winner = mongoose.model('Winner', WinnerSchema);

exports.Admin=Admin;
exports.User=User;
exports.Prize=Prize;
exports.Winner=Winner;