/*
 * @Descripttion: 项目入口及程序启动文件，后序可补充实现信息的加密传输以提高安全性
 * @version: 1.0
 * @Author: Ga1axy_z
 * @Date: 2021-05-20 08:11:31
 * @LastEditors: Ga1axy_z
 * @LastEditTime: 2021-06-17 09:31:06
 */
const app = require('express')();   // 导入 Express 模块，并创建一个 Express 应用

// 服务端开启连接
const server = require('http').Server(app); // 这句话的作用可参考 https://cnodejs.org/topic/5396cd60c3ee0b5820f00e2a
const io = require('socket.io')(server);

const path = require('path');   // path 模块提供了一些用于处理文件路径的小工具
const chinaTime = require('china-time');
const db = require('./database/dbprocess.js');

// 记录所有在线的用户，及当前的消息数
const users = [];
var id_now = 1;

// 在 3000 端口上启动服务器
server.listen(3000, () => {
    console.log('服务器启动成功');
})

// 在 Express 中提供静态文件可参考 https://expressjs.com/zh-cn/starter/static-files.html
app.use(require('express').static(path.join(__dirname, 'public')));

// 路由定义，app.get() 方法指定了一个回调函数，该函数在每监听到一个关于站点根目录路径（'/'）的 HTTP GET 请求时调用
app.get('/', (req, res) => {
    res.redirect('/index.html')
})

// SQL COUNT(*) 函数返回表中的记录数
db.selectAll('select count(*) as sum from message', (e, r) => {
    // id 按照消息发送的先后顺序递增
    console.log('数据库共有' + r[0].sum + '条历史消息记录');
    id_now = r[0].sum + 1;
})

// 实现进入聊天室后加载历史消息，公共聊天室，加载公共聊天记录
function initMessage(socket, field) {
    db.selectAll('select * from message where receive="'+ field +'" order by id asc', (e, res) => {
        for (var i = 0; i < res.length; i++) {
            if(res[i].type === 'image') {
                socket.emit('receiveImage', res[i]);
                console.log('历史消息：');
                console.log(res[i]);
            }else{
                socket.emit('receiveMessage', res[i]);
                console.log('历史消息：');
                console.log(res[i]);
            }
        }
    })
}
// 加载私聊记录
function initPrivateMessage(socket, receive_user, send_user) {
    var sql = 'select * from message where (receive="'+ receive_user +'"' + ' and send="' + send_user + '") or (send="'+ receive_user +'"' + ' and receive="' + send_user + '") order by id asc';
    db.selectAll(sql, (e, res) => {
        for (var i = 0; i < res.length; i++) {
            if(res[i].type === 'image') {
                socket.emit('receiveImage', res[i]);
                console.log('历史消息：');
                console.log(res[i]);
            }else{
                socket.emit('receiveMessage', res[i]);
                console.log('历史消息：');
                console.log(res[i]);
            }
        }
    })
}

// ****************** 业务逻辑实现 ******************

// 监听客户端连接，连接成功后，回调函数会传递本次连接的socket
// 当前端执行 socket = io.connect('ws://'+host); 的时候，此处的 io 会监听到 connection 事件
io.on('connection', function (socket) {
    socket.on('checkoutLogin', data => {
        let msg = '', resultData = '';
        db.selectAll("select * from usersInformation where username ='" + data.username + "' ", (e, r) => {
            let judge = r.length;
            if (judge == 0) {
                msg = "用户名不存在";
            } else if (data.password != r[0].password) {
                msg = "用户密码错误";
            } else {
                resultData = r[0];
                msg = "用户密码正确";
            }
            socket.emit('checkoutAnswer', {
                msg: msg,
                avatar: resultData.avatar
            })
            console.log(msg, resultData);
        })

    })
    socket.on('login', data => {
        // 如果在 data 在 users[] 中存在，说明该用户登陆过了，不允许登录
        let user = users.find(item => item.username === data.username);
        if (user) {
            socket.emit('loginError', {
                msg: '登陆失败'
            })
        } else {
            socket.username = data.username;
            socket.avatar = data.avatar;
            users.push(data);
            socket.emit('loginSuccess', data);
            
            // socket.emit 给当前用户发消息 io.emit 给所有用户发消息
            io.emit('addUser', data);
            io.emit('userList', users);

            // 辅助实现私聊功能
            socket.join(data.username);

            initMessage(socket, "all");
        }
    })
    socket.on('registerUser', data => {
        // 插入新用户之前先查询一遍数据库，确保用户名未被注册
        db.selectAll("select * from usersInformation where username = '" + data.username + "' ", (e, r) => {
            let judge = r.length;
            if (judge == 1) {
                console.log("账号已经被注册");
                socket.emit('registerError');
            } else {
                let saveData = data;
                db.insertData('usersInformation', saveData, (e, r) => {
                    console.log('用户注册成功');
                    socket.emit('registerSuccess');
                })
            }
        })
    })
    // 监听当前用户断开连接，当前端页面关闭，或者失去连接时，后端会接收到 disconnect 事件
    socket.on('disconnect', () => {
        if(socket.username === 'undefined') return;
        // 把当前用户从 user[] 中删除
        let idx = users.findIndex(item => item.username === socket.username);
        users.splice(idx, 1);

        io.emit('deleteUser', {
            username: socket.username,
            avatar: socket.avatar
        });
        io.emit('userList', users);
    })
    // 监听发送文本聊天消息
    socket.on('sendMessage', data => {
        var time = chinaTime('YY/MM/DD HH:mm');
        let saveData = {
            id: id_now,
            username: data.username,
            content: data.content,
            time: time,
            avatar:data.avatar,
            type: data.type,
            receive: data.receive,
            send: data.send
        }
        db.insertData('message', saveData, (e, r) => {
            console.log('消息存入成功');
            id_now++;
        })
        console.log('文本消息');
        console.log(saveData);
        if (data.receive == "all") {
            io.emit('receiveMessage', saveData);
        } else {
            if (data.receive == data.send) {
                socket.emit('receiveMessage', saveData);
            } else {
                socket.emit('receiveMessage', saveData);
                io.in(data.receive).emit('receiveMessage', saveData);
            }
        }
    })
    // 监听发送图片聊天消息
    socket.on('sendImage', data => {
        var time = chinaTime('YY/MM/DD HH:mm');
        let saveData = {
            id: id_now,
            username: data.username,
            content: data.img,
            time: time,
            avatar:data.avatar,
            type: data.type,
            receive: data.receive,
            send: data.send
        }
        db.insertData('message', saveData, (e, r) => {
            console.log('消息存入成功');
            id_now++;
        })
        console.log('图片消息');
        console.log(saveData);

        if (data.receive == "all") {
            io.emit('receiveImage', saveData);
        } else {
            if (data.receive == data.send) {
                socket.emit('receiveImage', saveData);
            } else {
                socket.emit('receiveImage', saveData);
                io.in(data.receive).emit('receiveImage', saveData);
            }
        }
    })
    // 以下为私聊功能
    socket.on('privateChat', data => {
        initPrivateMessage(socket, data.receive_user, data.send_user);
    })
    // 返回公共聊天
    socket.on('publicChat', () => {
        initMessage(socket, "all");
    })
})