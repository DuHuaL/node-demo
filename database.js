//引入
const mysql = require('mysql');
//链接
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'rongyao'
});
connection.connect();

//暴露接口
module.exports = connection;