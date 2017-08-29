// 加载依赖库
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

//JS方法补充
var supplement = require('./utils/supplement')

// 加载路由控制
var demo = require('./routes/demo');
var users = require('./routes/users');
var login = require('./routes/login');

// 创建项目实例
var app = express();

// 定义EJS模板引擎和模板文件位置
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
//将ejs文件改为html
app.set('view engine', 'html');
//app.set('view engine', 'ejs');

// 定义icon图标
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// 定义日志和输出级别
app.use(logger('dev'));
// 定义数据解析器
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 定义cookie解析器
app.use(cookieParser());
// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 匹配路径和路由
app.use('/',login);
app.use('/users', users);
app.use('/demo', demo);

// 404错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 开发环境，500错误处理和错误堆栈跟踪
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
