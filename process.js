//处理具体的路由操作
//引入核心模块
var fs = require('fs');
var uurl = require('url');
var path = require('path');
//引入第三方模块
var formidable = require('formidable');
var connection = require('./database');
//登录
module.exports.getLogin = function(req,res) {
  //将登录页面返回
  res.render('login.html');
};
module.exports.postLogin = function(req,res) {
    //接受参数
    // console.log(req.body);
    // [Object: null prototype] { username: 'admin', pwd: '123456' }
    var paramsObj = req.body;
    var data1 = JSON.stringify(paramsObj);
    paramsObj = JSON.parse(data1);
    //验证登录
    //从服务器查询用户信息
    //sql语句
    var sql = 'select *from users';
    connection.query(sql,(err,result,fields) =>{
      if(err) throw err;
      //遍历每一个用户与用户输入的用户进行判断
      for (var i =0;i<result.length;i++) {
        if(result[i].username == paramsObj.username && result[i].pwd == paramsObj.pwd) {
          //验证成功
          //保存session
          req.session.username = paramsObj.username;
          //跳转到首页
          // res.redirect('/');
          res.send('<script>alert("登录成功");window.location="/"</script>');
          break;
        } else {
          //验证失败
          //提示，跳回登录页
          res.send('<script>alert("用户名或密码错误，请重新登录");window.location="/login"</script>')
        }
      }
    });
};
//当浏览器请求根目录时，将首页响应回去
module.exports.getIndex = function(req,res) {
    //去mysql中读取数据
    var sql = 'select *from heros';
    connection.query(sql,(err,result,fields) => {
      if(err) throw err;
      res.render('index.html',{
        heros: result
      });
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
  var paramsObj = req.body;
    //sql语句
    var sql = `insert into heros (name,gender,img) values ("${paramsObj.name}","${paramsObj.gender}","${paramsObj.img}")`;
    connection.query(sql,(err,result,fields) => {
      if(err) throw err;
      if(result.affectedRows != 0) {
        res.json({state: 1,msg: '新增成功'});
      } else {
        res.json({state: 0,msg: 0});
      }
    });
};
//获取修改页面
module.exports.getEdit = function(req,res) {
  var url = req.url;
  var id = uurl.parse(url, true).query.id;
  //sql语句
  //根据id获取要修改的数据
  var sql = `select * from heros where id =${id} `;
  connection.query(sql,(err,result,fields) => {
    if(err) throw err;
    res.render('edit.html', result[0]);
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
  //根据id删除对应的数据，生成sql语句
  var sql = `delete from heros where id = ${id}`;
  connection.query(sql,(err,result,fields) => {
    if(err) throw err;
    if(result.affectedRows != 0) {
      res.send('<script>alert("删除成功");window.location="/"</script>');
    } else {
      res.send('<script>alert("删除失败");window.location="/"</script>');
    }
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
    res.json({
      imgName: imgName,
      state: 1
    });
  });
};
//404
module.exports.get404 = function(req,res) {
  res.end('404');
};


