var express = require('express');
var request = require('request');
var qs = require('querystring');
var User = require('../model/user');
var router = express.Router();

var token = "phoebus4wechat";

router.get('/', function (req, res, next) {

});
router.get('/user/:openid', function (req, res, next) {
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
                            res.redirect('/index.html');
                        }
                    })
                }

            })
        }
    })
});
module.exports = router;
