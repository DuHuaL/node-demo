//判断路由 express中的路由支持链式编程
var express = require('express');
//创建路由对象
var router = express.Router();
//引入自定义模块
var process = require('./process');
//注册路由
router
  .get('/login',process.getLogin)
  .post('/login',process.postLogin)
  .get('/',function(req,res){
    process.getIndex(req,res);
  })
  .get('/add',function(req,res){
    process.getAdd(req,res);
  })
  .post('/add',function(req,res){
    process.postAdd(req,res);
  })
  .get('/edit',function(req,res){
    process.getEdit(req,res);
  })
  .post('/edit',function(req,res){
    process.postEdit(req,res);
  })
  .get('/del',function(req,res){
    process.del(req,res);
  })
  .post('/upload',process.upload);


//暴露路由
module.exports = router;