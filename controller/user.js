var express = require('express');
var request = require('request');
var qs = require('querystring');
var User = require('../model/user');
var Prize = require('../model/prize');
var Winner = require('../model/winner');
var util = require('../util/common');
var router = express.Router();

var token = "phoebus4wechat";

router.get('/', function (req, res, next) {
});
router.get('/:openid', function (req, res, next) {
    var _url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' +
        req.query.access_token +
        '&openid=' +
        req.params.openid +
        '&lang=zh_CN';
    request(_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            User.findOne({openid: result.openid}, function (err, user) {
                if (err) console.error(err);
                if (!user) {
                    User.create({
                        openid: result.openid,
                        nickname: result.nickname,
                        headimgurl: result.headimgurl,
                        sex: result.sex
                    }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log('index',openid)
                            res.render('index',{openid:result.openid});
                        }
                    })
                }

            })
        }
    })
});

router.post('/:openid', function (req, res, next) {
    var _data = {
        username: req.body.uname,
        sex: req.body.ugender,
        phone: req.body.ucell,
        address: req.body.uaddr
    }
    console.log(_data)
    User.update({openid: req.params.openid}, _data, function (err, user) {
        if (err) console.error(err);
        else {
            res.end({code: 1, msg: '成功!'});
        }
    })
});

router.get('/:openid/lottery', function (req, res, next) {
    var _openid = req.params.openid
    console.log(_openid);
    User.findOne({openid: _openid}, function (err, user) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(user)
        if(!user){
            res.end({code: -53, msg: '用户不存在'});
            return;
        }
        if (user.lottery_number < 1) {
            res.end({code: -3, msg: '无剩余抽奖次数，请明日再来！'});
            return;
        }
        if (user.winning_times > 0) {
            res.end({code: -1, msg: '很遗憾未中奖！'});
            return;
        }
        Prize.find({}, function (err, prizes) {
            if (err) {
                console.error(err);
                return;
            }
            prizes.forEach(function (v, i) {
                if (v.num > 0) {
                    if (Math.floor(Math.random() * 1000) < v.probability) {
                        var _token = util.randomString(10);
                        Winner.create({
                            openid: _openid,
                            prize: v
                        }, function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            else {
                                res.end({
                                    code: 1,
                                    msg: '恭喜你，获得' + v.level + '等奖',
                                    data: {prizeName: v.name, token: _token}
                                });
                                return;
                            }
                        })
                    }else{
                        res.end({code: -1, msg: '很遗憾未中奖！'});
                        return;
                    }
                }
            })
        })
    })
});


module.exports = router;
