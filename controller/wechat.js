var express = require('express');
var crypto = require('crypto');
var request = require('request');
var Model = require('../model/model');
var qs = require('querystring');
var router = express.Router();

var token = "phoebus4wechat";
var appid = 'wxf532bce31a7c7715';
var secret = '9ee6fc68d53c4d9e3ac8f2b58ed59b83';
var g_access_token = {
    str: getAccess_token(),
    time: new Date().getTime()
}
function validateAccess_token(req, res, next) {
    var _curentTime = new Date().getTime();
    if ((_curentTime - access_token.time) / 1000 > 7200) {
        access_token.str = getAccess_token();
    }
    next();
}

function getAccess_token() {
    var _url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' +
        appid +
        '&secret=' +
        secret;
    request(_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return JSON.parse(body).access_token;
        }
    })
}

router.get('/', function (req, res, next) {
    var signature = req.query.signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    /*  加密/校验流程如下： */
    //1. 将token、timestamp、nonce三个参数进行字典序排序
    var array = new Array(token, timestamp, nonce);
    array.sort();
    var str = array.toString().replace(/,/g, "");
    //2. 将三个参数字符串拼接成一个字符串进行sha1加密
    var sha1Code = crypto.createHash("sha1");
    var code = sha1Code.update(str, 'utf-8').digest("hex");
    //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (code === signature) {
        res.send(echostr)
    } else {
        res.send("error");
    }
});

router.get('/code', function (req, res, next) {
    var _url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
        appid +
        '&redirect_uri=' +
        encodeURIComponent('http://phoebus.diviniti.cn/wechat/token') +
        '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    res.redirect(_url);
});

router.get('/token', function (req, res, next) {
    var _url = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
    var params = {
        appid: appid,
        secret: secret,
        code: req.query.code,
        grant_type: 'authorization_code'
    };
    var options = {
        method: 'get',
        url: _url + qs.stringify(params)
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);

            //res.redirect('/user/' + result.openid + "?access_token=" + result.access_token);//获取用户信息
            Model.User.findOne({openid: result.openid}, function (err, user) {
                if (err) console.error(err);
                if (!user) {
                    User.create({
                        openid: result.openid,
                    }, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.render('index',{openid:result.openid});
                        }
                    })
                }
                else{
                    res.render('index',{openid:result.openid});
                }

            })
        }
    })
});

module.exports = router;
