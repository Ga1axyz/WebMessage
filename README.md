# WebMessage
# 介绍
本项目为 **基于 Node.js 的在线聊天室**，实现较易，适合初学者练手

此项目是基于 [https://gitee.com/hebugui/web_qqchating](https://gitee.com/hebugui/web_qqchating) 优化完善的开源项目
# 采用技术
**HTML + CSS + JS + Node.js + Mysql + JQuery**

* Node.js 库包括 `express / http / socket.io / mysql / path / china-time`
* JQuery 库包括 `jquery-emoji / jquery-mCustomScrollbar`

# 项目结构
[![QQ20210521183539.png](https://img.maocdn.cn/img/2021/05/21/QQ20210521183539.png)](https://img.wang/image/qqjie-tu-20210521183539.bgd3d)

由上至下，各文件分别为

`database` 中 `config.js` 为数据库配置文件，`dbprocess.js` 封装了对数据库的操作（增删改查）；

`node_modules` 为 Node.js 库包；

`public` 文件夹包含前端静态文件，`homePage.css` 负责登录注册界面，`style.css` 负责聊天界面，`main.js` 负责业务逻辑核心功能的实现（用户登录、注册、显示聊天消息、发送表情及图片），`index.html` 负责前端呈现；

`lib` 文件夹包含了使用到的 jQuery 库包；

`app.js` 为项目入口及 **程序启动文件**，负责与数据库的交互；

# 数据库
数据库包含两张表，`message`（聊天记录表）、`userInformation`（用户表），字段设置分别如下：

[![QQ20210521191356.png](https://img.maocdn.cn/img/2021/05/21/QQ20210521191356.png)](https://img.wang/image/qqjie-tu-20210521191356.bgy7o)
[![QQ20210521191420.png](https://img.maocdn.cn/img/2021/05/21/QQ20210521191420.png)](https://img.wang/image/qqjie-tu-20210521191420.bgRVr)

# Demo 展示
[![QQ20210521185300.png](https://img.maocdn.cn/img/2021/05/21/QQ20210521185300.png)](https://img.wang/image/qqjie-tu-20210521185300.bgmki)
[![QQ20210521185405.png](https://img.maocdn.cn/img/2021/05/21/QQ20210521185405.png)](https://img.wang/image/qqjie-tu-20210521185405.bgjXY)
[![QQ20210523191533.png](https://img.maocdn.cn/img/2021/05/23/QQ20210523191533.png)](https://img.wang/image/qqjie-tu-20210523191533.bVdTD)

# 使用
## 项目启动：

* **方法1：** 在命令行窗口 cd 进入项目根目录，输入 `node app.js` 后回车执行 app.js 文件

* **方法2：** 在项目根目录下 ` Git Bash Here` ，输入 `node app.js` 后回车执行

## 在线部署：

1. 需要修改 `main.js` 文件中 `var socket = io('http://localhost:3000');` 语句，将 URL 更改为自己服务器的相应 IP + 端口；

1. 需要修改 `config.js` 文件中数据库的相关信息（database / user / password）；

1. 如有必要（例如源码不包含 `node_modules` 文件夹、`public/lib` 文件夹），需要在项目根目录下重新安装相应的 Node.js 库包、在 public/lib 目录下导入 jQuery 库包；

# 优化与改进
## 待实现

* [ ] 私聊功能

* [ ] 修改密码功能

## 待改进

* [ ] 用户密码加密传输与存储

* [ ] 防止 SQL 注入

* [ ] 聊天窗口 CSS 样式继续优化

* [ ] 修改默认加载历史记录的条数，避免每次都加载以往所有的消息记录

## 待修复

* [ ] 用户上传图片大小受限，上传较大的图片会导致用户被踢下线的恶性 Bug
