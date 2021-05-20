/*
 * @Descripttion: 封装数据库操作，未来逐步完善防止 SQL 注入的功能
 * @version: 1.0
 * @Author: Ga1axy_z
 * @Date: 2021-05-14 09:48:21
 * @LastEditors: Ga1axy_z
 * @LastEditTime: 2021-05-20 09:20:55
 */
const con = require('./config.js');
const connection = con();

// 查询所有数据
let selectAll = (sql,callback) => {
    connection.query(sql,(err,result) => {  // 使用query()方法执行SQL语句
        if(err){
            console.log('错误信息-',err.sqlMessage);
            let errNews = err.sqlMessage;
            callback(errNews,'');
            return;
        }
        console.log(sql);
        var string = JSON.stringify(result);  // JSON.stringify()方法用于将 JavaScript 值（通常为对象或数组）转换为 JSON 字符串。
        var data = JSON.parse(string);  // JSON.parse() 方法用于将一个 JSON 字符串转换为对象。
        callback('',data);
    })
}

// 插入一条数据
let insertData = (table,datas,callback) => {
    var fields = '';
    var values = '';
    for(var k in datas){
        fields += k + ',';
        values += "'" + datas[k] + "',";
    }
    fields = fields.slice(0,-1);    // 切掉字符串最后多余的逗号
    values = values.slice(0,-1);
    var sql = "INSERT INTO " + table + '(' + fields + ') VALUES(' + values + ')';
    console.log(sql);
    connection.query(sql,callback);
}

// 更新一条数据  未来可增加修改密码的功能，当前未实现
let updateData = (table,sets,where,callback) => {
    var isets = '';
    var iwhere = '';
    for(var i in sets){
        isets += i + "='" + sets[i] + "',";
    }
    isets = isets.slice(0,-1);
    for(var t in where){
        iwhere += t + "=" + where[t];
    }
    // UPDATE user SET Password='321' WHERE UserId=12
    // update table set username='admin2',age='55' where id="5";
    var sql = "UPDATE " + table + ' SET ' + isets + ' WHERE ' + iwhere;
    console.log(sql);
    connection.query(sql,callback);
}

// 删除一条数据
let deleteData = (table,where,callback) => {
    var iwhere = '';
    for(var j in where){
        // 需要多个筛选条件可使用 iwhere += j + "='" + where[j] + "' AND "; 然后使用 slice() 对最后的字符串进行处理
        iwhere += j + "=" + where[j];
    }
    var sql = "DELETE FROM " + table + ' WHERE ' + iwhere;
    console.log(sql);
    connection.query(sql,callback);
}

exports.selectAll = selectAll;
exports.insertData = insertData;
exports.deleteData = deleteData;
exports.updateData = updateData;