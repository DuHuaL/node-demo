//处理具体的路由操作
//引入核心模块
var fs = require('fs');
var uurl = require('url');
var path = require('path');
//引入第三方模块
var formidable = require('formidable');
var template = require('art-template');
//当浏览器请求根目录时，将首页响应回去
module.exports.getIndex = function(req,res) {
  fs.readFile('./data.json',function(err,hero){
    if(err) throw err;
    hero = JSON.parse(hero.toString());
    res.render('index.html',hero);
  });
};
//当浏览器请求新增页面时，调用此方法
module.exports.getAdd = function(req,res) {
  res.render('add.html');
};
//提交新增数据
module.exports.postAdd = function(req,res) {
  //满足预览功能大代码
  //接受参数
  var str = '';
  req.on('data',function(chunck){
    str += chunck;
  });
  req.on('end',function(){
    var paramsObj = uurl.parse('?'+str,true).query;
    var data1 = JSON.stringify(paramsObj);
    paramsObj = JSON.parse(data1);
    //将新增的数据写入到data.json中
    fs.readFile('./data.json',function(err,hero){
      if(err) throw err;
      hero = JSON.parse(hero.toString());
      var id = hero.heros[hero.heros.length - 1].id + 1;
      paramsObj.id = id;
      hero.heros.push(paramsObj);
      //重新写入
      fs.writeFile('./data.json',JSON.stringify(hero,null, ' '),function(err1){
        if(err1) throw err1;
        var returnObj = {
          state: 1,
          msg: '新增成功'
        };
        res.end(JSON.stringify(returnObj));
      });
    });
  });
};
//获取修改页面
module.exports.getEdit = function(req,res) {
  var url = req.url;
  var id = uurl.parse(url, true).query.id;
  fs.readFile('./data.json', function (err1, hero) {
    if (err1) throw err1;
    var hero = JSON.parse(hero.toString());
    //根据id找对应的数据
    var obj;
    for (var i = 0; i < hero.heros.length; i++) {
      if (hero.heros[i].id == id) {
        obj = hero.heros[i];
        break;
      }
    }
    res.render('edit.html',obj);
  });
};
//提交修改数据
module.exports.postEdit = function(req,res) {
  //将数据接受并且将新的数据替换掉data.json中原来的数据
  var str = '';
  req.on('data', function (chunck) {
    str += chunck;
  });
  req.on('end', function () {
    str = decodeURI(str);
    var query = uurl.parse('?' + str, true).query;
    var data1 = JSON.stringify(query);
    var obj = JSON.parse(data1);
    //将新的数据替换掉老的数据
    // 得到data.json中所有的数据
    fs.readFile('./data.json', function (err, hero) {
      if (err) throw err;
      hero = JSON.parse(hero.toString());
      //根据修改对象的id,找到对应数据
      for (var i = 0; i < hero.heros.length; i++) {
        if (obj.id == hero.heros[i].id) {
          //将新的值进行替换
          hero.heros[i].name = obj.name;
          hero.heros[i].gender = obj.gender;
          break;
        }
      }
      //将新的数据hero写入到data.json中
      fs.writeFile('./data.json', JSON.stringify(hero, null, ' '), function (err1) {
        if (err1) throw err1;
        res.setHeader('content-type', 'text/html;charset=utf-8');
        res.end('<script>alert("修改成功");window.location="/"</script>');
      });
    });
  });
};
//删除数据
module.exports.del = function(req,res) {
  var url = req.url;
  //接受id
  var id = uurl.parse(url, true).query.id;
  //读取data.json文件，获取多有数据
  fs.readFile('./data.json', function (err, hero) {
    if (err) throw err;
    hero = JSON.parse(hero.toString());
    //遍历
    for (var i = 0; i < hero.heros.length; i++) {
      if (hero.heros[i].id == id) {
        hero.heros.splice(i, 1);
        break;
      }
    }
    //删除后，重新写入数据
    fs.writeFile('./data.json', JSON.stringify(hero, null, ' '), function (err1) {
      if (err1) throw err1;
      res.setHeader('content-type', 'text/html;charset=utf-8');
      res.end('<script>alert("删除成功");window.location="/"</script>');
    });
  });
};
//处理静态文件
module.exports.static = function(req,res) {
  var url = req.url;
  fs.readFile('.' + url, function (err, data) {
    if (err) throw err;
    res.end(data);
  });
};
//处理图片预览
module.exports.upload = function(req, res) {
  //使用formidable接受
  const form = formidable({ multiples: true });
  //修改图片的上传路径
  form.uploadDir = './imgs';
  //保留图片的后缀
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    //先得到图片的名
    var imgName = path.parse(files.img.path).base;
    //将图片生成的名称返回到浏览器
    var obj = {
      imgName: imgName,
      state: 1
    };
    res.end(JSON.stringify(obj));
  });
};
//404
module.exports.get404 = function(req,res) {
  res.end('404');
};


