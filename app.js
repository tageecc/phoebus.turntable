var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);//把会话信息存储在数据库
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dburl = require('./config/dburl');
var cronJob = require("cron").CronJob;

mongoose.connect(dburl.dbUrl);//连接mongodb数据库

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.engine('.html', require('ejs-mate'));
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//提供会话支持，设置 store 参数为 MongoStore 实例，把会话信息存储到数据库中
app.use(session({
    secret: dburl.cookieSecret,
    store: new MongoStore({
        url: dburl.dbUrl,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));


//定时更新数据库
//在每天的6:00执行
new cronJob('* 0 6 * * *', function () {
    console.log('==============时间：'+new Date().getHours()+'更新数据库... ==============')
    (require('./util/update'))();
    console.log('============== 更新数据库完成！ ==============')
}, null, true, 'Asia/Shanghai');

app.use('/admin', require('./controller/admin'));
app.use('/wechat', require('./controller/wechat'));
app.use('/user', require('./controller/user'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
