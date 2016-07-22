var express = require('express');
var Admin = require('../model/admin');
var Prize = require('../model/prize');
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
    Admin.findOne({name: _username, passwd: _password}, function (err, admin) {
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
    Winner.find({}, function (err, winners) {
        if (err) {
            console.log(err);
            return;
        }
        if (winners && winners.length > 0) {
            res.end(JSON.parse(winners));
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
    Prize.create(_data, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        res.end('info', {msg: '添加成功！'});
    })
});

module.exports = router;