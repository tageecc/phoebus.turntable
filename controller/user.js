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
                            console.log('index', openid)
                            res.render('index', {openid: result.openid});
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
    User.update({openid: req.params.openid}, _data, function (err, user) {
        if (err) console.error(err);
        else {
            res.end(JSON.stringify({code: 1, msg: '成功!'}));
        }
    })
});

router.get('/:openid/lottery', function (req, res, next) {
    var _openid = req.params.openid
    User.findOne({openid: _openid}, function (err, user) {
        if (err) {
            console.error(err);
            return;
        }
        if (!user) {
            res.end(JSON.stringify({code: -53, msg: '用户不存在'}));
            return;
        }
        if (user.lottery_number < 1) {
            res.end(JSON.stringify({code: -3, msg: '无剩余抽奖次数，请明日再来！'}));
            return;
        }
        if (user.winning_times > 0) {
            res.end(JSON.stringify({code: -1, msg: '很遗憾未中奖！2'}));
            return;
        }
        Prize.find({}, function (err, prizes) {
            console.log(prizes)
            if (err) {
                console.error(err);
                return;
            }
            if (!prizes || prizes.length < 1) {
                res.end({code: -1, msg: '很遗憾未中奖！3'});
                return;
            }
            var isWinner = false;
            for (var i in prizes) {
                var v = prizes[i];
                if (!isWinner && v.num > 0 && Math.floor(Math.random() * 1000) < v.probability) {
                    var _token = util.randomString(10);
                    res.end(JSON.stringify({
                        code: 1,
                        msg: '恭喜你，获得' + v.level + '等奖',
                        data: {prize: v.level, prizeName: v.name, token: _token}
                    }));
                    console.log('中奖了：' + v.level);
                    isWinner = true;
                    Winner.create({user: user, prize: v, token: _token}, function (err) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    })
                    User.update({openid: _openid}, {
                        '$inc': {
                            'lottery_number': -1,
                            'winning_times': 1
                        }
                    }, function (err, user) {
                        if (err) {
                            console.log(err)
                            return;
                        }
                    })
                    Prize.update({level: v.level}, {
                        '$inc': {
                            'num': -1
                        }
                    }, function (err, user) {
                        if (err) {
                            console.log(err)
                            return;
                        }
                    })
                }
            }
            if (!isWinner) {
                res.end(JSON.stringify({code: -1, msg: "很遗憾未中奖！"}));
            }

        })
    })
});


module.exports = router;
