//处理具体的路由操作
//引入核心模块
var fs = require('fs');
var uurl = require('url');
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
  //---------------formidable---------接受数据----------------------------------//
    //创建一个formidable对象
    const form = formidable({ multiples: true });
    //调用parse()方法
    //    req:请求报文
    //      回调函数：
    //              err: 错误提示
    //              fields: 字段 (浏览器提交过来的字段){name: '李白',gender: '男'}
    //              files: 文件（图片）
    //修改formidable中保存图片的路径
    form.uploadDir = './imgs';
    //加上保存图片的后缀名
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      //将数据保存到data.json中
      //得到img属性
      var img = '\\' + files.img.path;
      fields.img = img;
      //得到id
      fs.readFile('./data.json', function (err, hero) {
        if (err) throw err;
        hero = JSON.parse(hero.toString());
        var id = hero.heros[hero.heros.length - 1].id + 1;
        fields.id = id;
        //将新的对象添加到heros中
        hero.heros.push(fields);
        //将新的数据写入data.json中
        fs.writeFile('./data.json', JSON.stringify(hero, null, ' '), function (err1) {
          if (err1) throw err1;
          res.setHeader('content-type', 'text/html;charset=utf-8');
          res.end('<script>alert("新增成功");window.location="/"</script>');
        });
      });
    });
};
//获取修改页面
module.exports.getEdit = function(req,res) {
  var url = req.url;
  fs.readFile('./views/edit.html', function (err, data) {
    if (err) throw err;
    //将数据填充到页面上
    //先获取要修改英雄id
    var id = uurl.parse(url, true).query.id;
    //根据id得到对应的数据
    //先将data.json中所有的数据读取
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
      //将模板与数据结合
      var str = template.compile(data.toString())(obj);
      res.end(str);
    });
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
//404
module.exports.get404 = function(req,res) {
  res.end('404');
};

