/*
 * @Descripttion: 配置数据库
 * @version: 1.0
 * @Author: Ga1axy_z
 * @Date: 2021-05-13 23:04:27
 * @LastEditors: Ga1axy_z
 * @LastEditTime: 2021-06-11 19:08:04
 */
const mysql = require('mysql');

const connectDB = () => {
    var connection = mysql.createConnection({   //使用createConnection(option)方法创建一个连接对象
        host:'localhost',
        user:'root',
        password:'123456',
        port:'3306',
        database:'webmessage'
    });
    return connection;
}

module.exports = connectDB;