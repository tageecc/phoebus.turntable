var express = require('express');
var Model = require('../model/model');
var json2csv = require('json2csv');
var router = express.Router();

function adminRequired(req, res, next) {
    var admin = req.session.admin;
    console.log("admin:" + admin);
    if (!admin) {
        return res.redirect('/login.html')
    }
    next()
};

router.post('/login', function (req, res, next) {
    var _username = req.body.username;
    var _password = req.body.password;
    console.log(_username, _password)
    Model.Admin.findOne({name: _username, passwd: _password}, function (err, admin) {
        console.log(arguments)
        if (err) {
            console.error(err);
            return;
        }
        if (admin) {
            req.session.admin = admin;
            console.log("req.session.admin:" + req.session.admin)
            res.redirect('/admin.html');
        } else {
            req.session.admin = null;
            res.render('error', {msg: '用户名或密码错误！'});
        }
    })
});


router.get('/winner-list', adminRequired, function (req, res, next) {
    Model.Winner.find()
        .populate('user prize')
        .exec(function (err, winners) {
            if (err) {
                console.log(err);
                return;
            }
            if (winners && winners.length > 0) {

                res.end(JSON.stringify(winners));
            } else {
                res.end();
            }
        })
});

router.get('/winner-file', adminRequired, function (req, res, next) {
    Model.Winner.find()
        .populate('user prize')
        .exec(function (err, winners) {
            if (err) {
                console.log(err);
                return;
            }
            if (winners && winners.length > 0) {

                var fields = ['token', '姓名', '性别', '电话', '地址', '奖品名称', '奖品等级'];
                var data = [];
                winners.map(function (v, i) {
                    data.push({
                        token: v.token,
                        '姓名': v.user.username,
                        '性别': v.user.sex,
                        '电话': v.user.phone,
                        '地址': v.user.address,
                        '奖品名称': v.prize.name,
                        '奖品等级': v.prize.level
                    })
                })
                var csv = json2csv({data: data, fields: fields});
                // 设置 header 使浏览器下载文件
                res.setHeader('Content-Description', 'File Transfer');
                res.setHeader('Content-Type', 'application/csv; charset=utf-8');
                res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
                res.setHeader('Expires', '0');
                res.setHeader('Cache-Control', 'must-revalidate');

                // 为了让 Windows 能识别 utf-8，加上了 dom
                res.send('\uFEFF' + csv);
            }
            res.end();
        })
});

router.get('/prize-list', adminRequired, function (req, res, next) {
    Model.Prize.find({}, function (err, prizes) {
        if (err) {
            console.log(err);
            return;
        }
        if (prizes && prizes.length > 0) {
            res.end(JSON.stringify(prizes));
        } else {
            res.end();
        }
    })
});

router.post('/set-prize', adminRequired, function (req, res, next) {
    var _data = {
        name: req.body.name,
        level: req.body.level,
        probability: req.body.probability,
        num: req.body.num
    }
    Model.Prize.create(_data, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        res.render('info', {msg: '添加成功！'});
    })
});

module.exports = router;