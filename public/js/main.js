/*
 * @Descripttion: WebMessage 核心功能的实现（用户登录、注册、显示聊天消息、发送表情及图片）
 * @version: 1.0
 * @Author: Ga1axy_z
 * @Date: 2021-05-19 21:30:46
 * @LastEditors: Ga1axy_z
 * @LastEditTime: 2021-05-20 19:49:27
 */
var socket = io('http://localhost:3000');

var username, password, sex, avatar;


// ****************** 已发现但暂时未修复的 BUG ******************
// 5.20
// 当用户传入一张过大的图片，会导致图片发送失败，且用户会被踢下线，同时会带来一些诡异的连锁反应。。。





// ****************** 登录功能 ******************

// 点击登录按钮
$('#loginBtn').on('click', () => {
    username = $("#username").val().trim();  // jQuery val()方法返回或设置被选元素的 value 属性
    password = $('#password').val().trim();
    if (!username || !password) {
        alert('用户名或密码为空，\n请正确填写！');
        return;
    }
    console.log(username, password);

    // 将用户名和密码提交给服务器，校验用户身份
    // 服务器端和客户端之间可以使用 socket 端口对象的 emit() 方法，互相发送事件 socket.emit(event,data,[callback])
    socket.emit('checkoutLogin', {
        username: username,
        password: password
    })
})
// 监听用户身份校验结果
// 一方使用 emit() 发送事件后，另一方可以使用 on() 或者 once() 方法，对该事件进行监听 socket.on(event,function(data,fn){})
socket.on('checkoutAnswer', data => {
    console.log(data.msg);
    if (data.msg === '用户名不存在') {
        alert('未查找到此用户！\n请检查你输入的用户名是否正确！');
    } else if (data.msg === '用户密码错误') {
        alert('密码错误！\n请重新输入！');
    } else if (data.msg === '用户密码正确') {
        // 跳转到聊天室
        $('.login_box').fadeOut();  // 隐藏登录窗口 淡出效果
        $('.container').fadeIn();   // 显示聊天窗口 淡入效果
        
        // 告诉 socket io 服务，用户登录成功
        // 这里参数中的头像信息通过查询数据库获取，在 app.js 中实现 
        socket.emit('login', {
            username: username,
            avatar: data.avatar
        })
    }
})
// 监听登陆成功的请求
socket.on('loginSuccess', data => {
    $('.login_box').fadeOut();   // 隐藏登录窗口 淡出效果
    $('.container').fadeIn();    // 显示聊天窗口 淡入效果
    // 设置个人信息，用于在聊天窗口中标识当前用户身份
    $('.avatar_url').attr('src', data.avatar);   // jQuery attr()方法设置或返回被选元素的属性和值
    $('.user-list .username').text(data.username);   // jQuery text()方法设置或返回被选元素的文本内容
    username = data.username;
    avatar = data.avatar;
})
// 监听登录失败的请求
socket.on('loginError', data => {
    alert('登陆失败！请不要重复登录！');
})

// ****************** 显示与发送聊天消息 & 更新在线用户信息 & 提示用户的加入与离开 ******************

// 监听用户加入聊天室的动作
socket.on('addUser', data => {
    // 在聊天消息区域添加一条系统消息
    $('.box-bd').append(`
        <div class="system">
            <p class="message_system">
                <span class="content">"${data.username}"加入了群聊</span>
            </p>
        </div>
    `);
    scrollIntoView();   // 当前元素（最近一条消息）底部滚动到可视区，该函数在后文定义
})
// 监听用户离开聊天室的动作
socket.on('deleteUser', data => {
    $('.box-bd').append(`
        <div class="system">
            <p class="message_system">
                <span class="content">"${data.username}"离开了群聊</span>
            </p>
        </div>
    `);
    scrollIntoView();
})
// 监听在线用户数量及用户列表信息
socket.on('userList', data => {
    console.log(data);
    // 更新列表前先将其清空
    $('.user-list ul').html('');
    data.forEach(item => {
        $('.user-list ul').append(`
            <li class="user">
                <div class="avatar"><img src="${item.avatar}" alt="" /></div>
                <div class="name">${item.username}</div>
            </li> 
        `)
    });
    // 更新在线用户数量
    $('#userCount').text(data.length);
})
// 点击聊天消息发送按钮，未来可实现与优化敏感词过滤功能
$('#btn-send').on('click', () => {
    // 获取聊天内容
    var content = $('#content').html();
    // 清空聊天内容
    $('#content').html('');
    if (!content)
        return alert('发送内容不能为空！');
    if (content.indexOf("进平") >= 0)   // indexOf()方法对大小写敏感，如果要检索的字符串值没有出现，则该方法返回 -1
        return alert('别闹！再斟酌斟酌用词！');
    let message = {
        content: content,
        username: username,
        avatar: avatar,
        type: 'html'
    }
    // 将相关信息发送给服务器
    socket.emit('sendMessage', message);
    console.log(message);
})
// 实时更新文本类型的聊天记录
socket.on('receiveMessage', data => {
    if (data.username === username) {
        // 当前用户发送的消息
        $('.box-bd').append(`
            <div class="message-box">
                <div class="my message">
                    <img class="avatar" src="${avatar}" alt="" />
                    <div class="content">
                        <div style="margin-bottom: 3px;margin-right: 3px;font-size: 12px;color: #4f4f4f;">${data.time}</div>
                        <div class="bubble">
                            <div class="bubble_cont">${data.content}</div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    } else {
        // 其它用户发送的消息
        $('.box-bd').append(`
            <div class="message-box">
                <div class="other message">
                    <img class="avatar" src="${data.avatar}" alt="" />
                    <div class="content">
                        <div class="nickname">${data.username} <span>${data.time}</span></div>
                        <div class="bubble">
                            <div class="bubble_cont">${data.content}</div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }
    scrollIntoView();
})
// 将 .box-bd 最后一个子元素即（聊天区域内最新的一条消息）的底部滚动到可视区
function scrollIntoView() {
    $('.box-bd').children(':last').get(0).scrollIntoView(false);
}
// 实现发送图片的功能
$('#file').on('change', function () {
    var file = this.files[0];
    // 使用 FileReader 对象将图片文件发送到服务器
    var fr = new FileReader();  // FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件
    fr.readAsDataURL(file);
    fr.onload = () => {
        socket.emit('sendImage', {
            username: username,
            avatar: avatar,
            img: fr.result,
            type: 'image'
        })
    }
})
// 实时更新图片类型的聊天记录
socket.on('receiveImage', data => {
    if (data.username === username) {
        // 当前用户发送的消息
        $('.box-bd').append(`
            <div class="message-box">
                <div class="my message">
                    <img class="avatar" src="${data.avatar}" alt="" />
                    <div class="content">
                        <div style="margin-bottom: 3px;margin-right: 3px;font-size: 12px;color: #4f4f4f;">${data.time}</div>
                        <div class="bubble">
                            <div class="bubble_cont">
                                <img src="${data.content}"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    } else {
        // 其它用户发送的消息
        $('.box-bd').append(`
            <div class="message-box">
                <div class="other message">
                    <img class="avatar" src="${data.avatar}" alt="" />
                    <div class="content">
                        <div class="nickname">${data.username} <span>${data.time}</span></div>
                        <div class="bubble">
                            <div class="bubble_cont">
                                <img src="${data.content}"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }
    // 等待图片加载完成
    $('.box-bd img :last').on('load', () => {
        scrollIntoView();
    })
})
// 借助 jquery-emoji 库，实现表情功能
$('.face').on('click', () => {
    $('#content').emoji({
        button: '.face',
        showTab: true,
        animation: 'slide',
        position: 'topRight',
        icons: [{
            name: "贴吧表情",
            path: "lib/jquery-emoji/img/tieba/",
            maxNum: 50,
            file: ".jpg",
            placeholder: ":{alias}:",
            alias: {
                1: "hehe",
                2: "haha",
                3: "tushe",
                4: "a",
                5: "ku",
                6: "lu",
                7: "kaixin",
                8: "han",
                9: "lei",
                10: "heixian",
                11: "bishi",
                12: "bugaoxing",
                13: "zhenbang",
                14: "qian",
                15: "yiwen",
                16: "yinxian",
                17: "tu",
                18: "yi",
                19: "weiqu",
                20: "huaxin",
                21: "hu",
                22: "xiaonian",
                23: "neng",
                24: "taikaixin",
                25: "huaji",
                26: "mianqiang",
                27: "kuanghan",
                28: "guai",
                29: "shuijiao",
                30: "jinku",
                31: "shengqi",
                32: "jinya",
                33: "pen",
                34: "aixin",
                35: "xinsui",
                36: "meigui",
                37: "liwu",
                38: "caihong",
                39: "xxyl",
                40: "taiyang",
                41: "qianbi",
                42: "dnegpao",
                43: "chabei",
                44: "dangao",
                45: "yinyue",
                46: "haha2",
                47: "shenli",
                48: "damuzhi",
                49: "ruo",
                50: "OK"
            },
            title: {
                1: "呵呵",
                2: "哈哈",
                3: "吐舌",
                4: "啊",
                5: "酷",
                6: "怒",
                7: "开心",
                8: "汗",
                9: "泪",
                10: "黑线",
                11: "鄙视",
                12: "不高兴",
                13: "真棒",
                14: "钱",
                15: "疑问",
                16: "阴脸",
                17: "吐",
                18: "咦",
                19: "委屈",
                20: "花心",
                21: "呼~",
                22: "笑脸",
                23: "冷",
                24: "太开心",
                25: "滑稽",
                26: "勉强",
                27: "狂汗",
                28: "乖",
                29: "睡觉",
                30: "惊哭",
                31: "生气",
                32: "惊讶",
                33: "喷",
                34: "爱心",
                35: "心碎",
                36: "玫瑰",
                37: "礼物",
                38: "彩虹",
                39: "星星月亮",
                40: "太阳",
                41: "钱币",
                42: "灯泡",
                43: "茶杯",
                44: "蛋糕",
                45: "音乐",
                46: "haha",
                47: "胜利",
                48: "大拇指",
                49: "弱",
                50: "OK"
            }
        }, {
        name: "QQ表情",
        path: "lib/jquery-emoji/img/qq/",
        maxNum: 91,
        excludeNums: [41, 45, 54],
        file: ".gif",
        placeholder: "#qq_{alias}#"
        }, {
        name: "emoji表情",
        path: "lib/jquery-emoji/img/emoji/",
        maxNum: 84,
        file: ".png",
        placeholder: "#emoji_{alias}#"
        }]
    })
})

// ****************** 注册功能 ******************

// 选择用户头像，通过修改样式来标记当前选择的头像
$('#register_avatar li').on('click', function () {
    $(this)
        .addClass('now')
        .siblings()
        .removeClass('now')
})
// 跳转到注册页面
$('#registerBtn').on('click', () => {
    $('.login_box').fadeOut();   // 隐藏登陆窗口 淡出效果
    $('.register_box').fadeIn(); // 显示注册窗口 淡入效果
})
// 返回登录页面
$('#returnBtn').on('click', () => {
    $('.register_box').fadeOut();   // 隐藏注册窗口 淡出效果
    $('.login_box').fadeIn();       // 显示登录窗口 淡入效果
})
// 点击注册按钮
$('#register').on('click', () => {
    username = $('#register_username').val().trim();
    password = $('#register_password').val().trim();
    sex = $('#sex input[name=sex]:checked').val();
    avatar = $('#register_avatar li.now img').attr('src');
    console.log(username, password, sex, avatar);
    if (!username || !password || !sex || !avatar) {
        alert('请将信息填写完整后再提交！');
        return;
    }
    // 将用户信息提交给服务器
    socket.emit('registerUser', {
        username: username,
        password: password,
        sex: sex,
        avatar: avatar
    })
})
// 监听注册成功的请求
socket.on('registerSuccess', function () {
    alert('注册成功！\n点击登录按钮即可进入聊天室')
    // 在注册页面登录
    $('#register_login').on('click', () => {
        socket.emit('login', {
            username: username,
            avatar: avatar
        })
    })
})
// 监听注册失败的请求
socket.on('registerError', function () {
    alert('此用户名已被注册！\n请更换你的昵称！');
})