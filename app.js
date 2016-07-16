var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);//把会话信息存储在数据库
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/phoebus_turntable');//连接mongodb数据库

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.engine('.html', require('ejs-mate'));
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//提供会话支持，设置 store 参数为 MongoStore 实例，把会话信息存储到数据库中
// app.use(session({
//     secret: 'phoebus@turntable',
//     store: new MongoStore({
//         url: 'mongodb://localhost/phoebus_turntable',
//         collection: 'sessions',
//         cookie: { maxAge: 1000*60*60*3}
//     }),
//     resave: false,
//     saveUninitialized: true
// }));

app.use('/',  require('./controller/index'));
app.use('/wechat',  require('./controller/wechat'));
app.use('/login',  require('./controller/login'));
app.use('/test',  require('./controller/test'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
