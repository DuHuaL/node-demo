//项目入口
var express = require('express');
//引入第三方包
const cookieSession = require('cookie-session');
//引入第三方包接受参数
const bodyParser = require('body-parser');
//引入外置路由
var router = require('./router');
//实例对象
var app = express();
//使用session
app.use(cookieSession({
  name: 'session',
  keys: ['key1','key2']
}));

//使用中间件body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
//配置静态文件
app.use('/imgs',express.static('imgs'));
app.use('/node_modules',express.static('node_modules'));
//使用模板引擎
app.engine('html',require('express-art-template'));

//做登录验证的统一验证（不管是什么请求都可以进行验证）
app.use(function(req,res,next){
  var sessionObj = req.session;
  var data1 = JSON.stringify(sessionObj);
   sessionObj = JSON.parse(data1);
   //如果没有session，判断是否是登录页面
  if(sessionObj.username) {
    //进入此判断，说明已登录
    //跳转到首页
    next();
  } else {
    //进入此判断，说明没有登录
    //判断是否是登录页面
    var url = req.url;
    if(url =='/login') {
      //如果是登录页面，继续执行
      next();
    } else {
      //如果不是登录页面
      //提示
      //跳转到登录页面
      res.send('<script>alert("请先登录");window.location="/login"</script>');
    }
  }
});

// 错误处理中间件
app.use(function(err,req,res,next){
  if(err) {
    console.log('出错了');
  } else {
    next();
  }
});
//使用路由
app.use(router);
app.listen(3000,function(){
  console.log('running');
});
