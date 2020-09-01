//项目入口
var express = require('express');
//引入第三方包
const cookieSession = require('cookie-session');
//引入外置路由
var router = require('./router');
var app = express();
//使用session
app.use(cookieSession({
  name: 'session',
  keys: ['key1','key2']
}));
//配置静态文件
app.use('/imgs',express.static('imgs'));
app.use('/node_modules',express.static('node_modules'));
//使用模板引擎
app.engine('html',require('express-art-template'));
//使用路由
app.use(router);
app.listen(3000,function(){
  console.log('running');
});
