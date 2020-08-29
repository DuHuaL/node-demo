//项目入口
var express = require('express');
//引入外置路由
var router = require('./router');
var app = express();
//使用模板引擎
app.engine('html',require('express-art-template'));
//使用路由
app.use(router);
app.listen(3000,function(){
  console.log('running');
});
