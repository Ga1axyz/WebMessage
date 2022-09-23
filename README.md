# WebMessage
# 介绍
本项目为 **基于 Node.js 的在线聊天室**，实现较易，适合初学者练手

此项目是基于 [https://gitee.com/hebugui/web_qqchating](https://gitee.com/hebugui/web_qqchating) 优化完善的开源项目，增添了新的业务功能，优化了代码逻辑与页面样式。
# 采用技术
**HTML + CSS + JS + Node.js + Mysql + JQuery**

* Node.js 库包括 `express / http / socket.io / mysql / path / china-time`
* JQuery 库包括 `jquery-emoji / jquery-mCustomScrollbar`

# 项目结构
![项目结构.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/Code_09-47-39.png)

由上至下，各文件分别为

`database` 中 `config.js` 为数据库配置文件，`dbprocess.js` 封装了对数据库的操作（增删改查）；

`node_modules` 为 Node.js 库包；

`public` 文件夹包含前端静态文件，`homePage.css` 负责登录注册界面，`style.css` 负责聊天界面，`main.js` 负责业务逻辑核心功能的实现（用户登录、注册、显示聊天消息、发送表情及图片），`index.html` 负责前端呈现；

`lib` 文件夹包含了使用到的 jQuery 库包；

`app.js` 为项目入口及 **程序启动文件**，负责与数据库的交互；

# 数据库
数据库包含两张表，`message`（聊天记录表）、`userInformation`（用户表，注意 `I` 在这里是大写），字段设置分别如下：

![message表.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/navicat_09-44-18.png)

![userInformation表.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/navicat_09-44-52.png)

# 使用
## 本地测试：

* **方法1：** 在命令行窗口 cd 进入项目根目录，输入 `node app.js` 后回车执行 app.js 文件

* **方法2：** 在项目根目录下 ` Git Bash Here` ，输入 `node app.js` 后回车执行

* 然后浏览器访问 `http://localhost:3000` 即可

![启动项目.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/chrome_09-47-10.png)

## 在线部署：

1. 需要修改 `main.js` 文件中 `var socket = io('http://localhost:3000');` 语句，将 URL 更改为自己服务器的相应 IP + 端口；

1. 需要修改 `config.js` 文件中数据库的相关信息（database / user / password）；

1. 如有必要（例如源码不包含 `node_modules` 文件夹、`public/lib` 文件夹），需要在项目根目录下重新安装相应的 Node.js 库包、在 public/lib 目录下导入 jQuery 库包；

# DEMO 展示

## 登录 & 注册

![登录页面.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/chrome_09-55-01.png)

![登录成功.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/chrome_09-59-13.png)

![注册页面.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/chrome_09-56-51.png)

![注册成功.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/chrome_09-58-21.png)

## 群聊

![群聊1.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/chrome_10-01-11.png.png)

![群聊2.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/chrome_10-01-24.png.png)

![群聊说明.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/chrome_10-05-13.png.png)

## 私聊

![私聊1.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/chrome_10-08-49.png)

![私聊2.png](https://github.com/Ga1axyz/WebMessage/blob/main/%E9%A1%B9%E7%9B%AE%E5%B1%95%E7%A4%BA%E5%9B%BE%E7%89%87/chrome_10-09-53.png)

# 优化与改进
## 待实现

* [ ] 修改密码功能

* [ ] 用左侧用户栏提示相应未读消息取代目前使用公共聊天窗口提示的方案

* [ ] 上传与下载文档功能

## 待改进

* [ ] 用户数据加密传输与存储

* [ ] 防止 SQL 注入

* [ ] 聊天窗口 CSS 样式继续优化

* [ ] 修改默认加载历史记录的条数，避免每次都加载以往所有的消息记录

## 待修复

* [ ] 用户上传图片大小受限，上传较大的图片会导致用户被踢下线的恶性 Bug
