# fredcof.github.io
## 演示
![re_view](https://github.com/FredCof/fredcof.github.io/blob/master/img/About/re_view.webp)
## 文件结构图
```html
├── _includes                   <!--页面包含文件-->
│   ├── footer.html             <!--页眉-->
│   ├── head.html               <!--页脚-->
│   └── nav.html                <!--侧边-->
├── _layouts                    <!--布局文件-->
│   ├── default.html            <!--默认主题-->
│   ├── keynote.html
│   ├── page.html               <!--index页面布局-->
│   └── post.html               <!--post页面布局-->
├── _posts                      <!--个人的post 格式：xxxx-xx-xx-post_name -->
│   └── ...
├── css                         <!--css文件-->
│   ├── bootstrap.css           <!--bootsrtap-->
│   ├── bootstrap.min.css
│   ├── cofal-blog.css          <!--cofal-->
│   ├── hux-blog.css            <!--hux-->
│   ├── hux-blog.min.css
│   └── syntax.css
├── fonts                       <!--字体-->
│   └── ...
├── img                         <!--图集-->
│   ├── 404 
│   ├── About
│   ├── friend_link             <!--友链图标-->
│   └── /..
├── js                          <!--js文件-->
│   ├── animatescroll.min.js
│   ├── bootstrap.js
│   ├── bootstrap.min.js
│   ├── hux-blog.js
│   ├── hux-blog.min.js
│   ├── jqurey.js
│   ├── jqurey.nav.js
│   ├── jqurey.min.js
│   ├── jqurey.tagcloud.js
│   ├── mad5.min.js
│   └── /..
├── less                        <!--动态页面-->
│   ├── hux-blog.less
│   ├── mixins.less
│   ├── side-catalog.less
│   ├── sidebar.less
│   └── variables.less
├── misic                       <!--背景音乐文件-->
│   └── /..
├── pwa                         <!--版本json-->
│   └── manifest.json
├── related                     <!--链接相关资源-->
│   └── /..
├── _config.yml                 <!--Jekyll配置文件-->
├── .gitignore                  <!--git忽视文件-->
├── .travis.yml
├── 404.html                    <!--404HTTP-->
├── about.html                  <!--about-->
├── CNAME                       <!--CNAME-->
├── codecov.yml
├── feed.xml
├── Gruntfile.js
├── index.html                  <!--初始页面-->
├── LICENSE                     <!--共享LICENSE-->
├── offline.html
├── package.json
├── README.md
├── sw.js
└── tags.html                   <!--tags-->
```
博客md示例：
```markdown
---
layout:     布局方式
title:      标题
subtitle:   副标题
date:       xxxx-xx-xx
update:     xxxx-xx-xx
updesc:     更新介绍
upurl:      \#更新链接
author:     作者
header-img: 背景图片
music:      {type: "x", id: "xxxxxxxxx"}
catalog:    true
related:    true
tags:
    - TAG1
    - TAG2
    - TAG1
---
支持Markdown的中文部分！
`code代码块`
```
post头变量解释：
> layout:布局方式，使用_layout中的default,keynote,page,post改变布局，替换代码{{ context }}  
> header-img:标题背景图片,使用网站相对链接(图片存在img下)即使用：{{ site.baseurl }}/img/...,也可以使用图床的绝对链接  
> music支持网易云的外链播放器,对应填写网易云外链的type和id值  
> catalog和related分别对应开启侧边栏的目录和相关
> post页面定义变量需要满足YAML标准格式

其余Markdown教程参考[链接](https://sspai.com/post/45816)</br>
其余开发教程参考[官方网站](http://jekyllcn.com/)

## 本主题开发教程
#### 网站配置
配置文件主要更改_config.yml:
```yml
# Site settings
title: title for your blog site       # 网站标题,支持<font color="">的设置
SEOTitle: title for SEO               # 搜索引擎标题
header-img: img/post-bg-desk.webp     # index.html的抬头背景
email: cofalconer@gmail.com
description: "motto or description"
keyword: "keyword1, keyword2, keyword3"
url: "http[s]://xxxx.xxx"             # 绝对URL
baseurl: ""                           # for example, '/blog' if your blog hosted on 'host/blog'
github_repo: "https://github.com/xx/" # you code repository

# Sidebar settings
sidebar: true                         # whether or not using Sidebar.
sidebar-about-description: ""         # 侧边栏的自我介绍或者座右铭
sidebar-avatar: /img/...              # use absolute URL, seeing it's used in both `/` and `/about/`
```
修改以上信息就可以看到自己网页的大体预览啦.修改URL需要在代码库设置中将**CNAME**设置为URL值,并且请确保自己拥有填写的URL的解析能力,将URL在DNS提供商那修改为CNAME到	
**xxxxxxx.github.io**(和下文填写的repo值相同,数据库地址,需要现在设置中需改数据库名为**Github用户名.github.io**)
```yml
# SNS settings
RSS: false
github_username:    FredCof
facebook_username:  smith.fred.16503323
weibo_username:     6278667439
bilibili_username:  44685985
```
社交信息修改,目前支持:简书、Bilibili、Twitter、Facebook、知乎、微博、Github、Linkedin  
开发社交信息在footer.html中,示例代码:
```html
{% if site.bilibili_username %}
    <li>
        <a target="_blank" href="http://space.bilibili.com/{{ site.bilibili_username }}?">
            <span class="fa-stack fa-lg">
                <i class="fa fa-circle fa-stack-2x"></i>
                <i class="fa  fa-stack-1x fa-inverse">B</i>
            </span>
        </a>
    </li>
{% endif %}
```
```yml
paginate: 6
```
修改index每一页的posts数量
```yml
# Gitalk
gitalk:
  enable: true                                              #是否开启Gitalk评论
  clientID: xxxxxxxxxxxxxxxxxxxx                            #生成的clientID
  clientSecret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    #生成的clientSecret
  repo: xxxxxxx.github.io                                   #仓库名称
  owner: xxxxxxx                                            #github用户名
  admin: xxxxxxx                                            #github用户名
  distractionFreeMode: true                                 #是否启用类似FB的阴影遮罩
```
评论系统的使用,**请务必fork之后修改以下信息！！**去gitalk注册一个账号，将以上信息对应填写
```yml
# Google Analytics
ga_track_id: 'XX-xxxxxxxxxx-x'      # Format: UA-xxxxxx-xx
ga_domain: xxxxxxx.xxx              # 默认的是 auto, 这里我是自定义了的域名，你如果没有自己的域名，需要改成auto
```
此处使用的是Google的网站统计，对于未翻墙的浏览人员无法统计(万恶GFW！！祝病魔早日战胜方校长！！这种叫做为虎作伥，好好的学术网站都进不去……)。可以使用付费且不好用的百度数据统计
```yml
friends: [
    {
        title: "Pixiv",
        icon: "/img/friend_link/pixiv.png",
        href: "https://www.pixiv.net"
    },{
        title: "Google",
        icon: "/img/friend_link/google.png",
        href: "http://google.com/"
    }
]
```
编辑界面友链，在_layout下编辑样式，此处的设置默认样式为：
```html
<!-- Friends Blog -->
{% if site.friends %}
    <hr>
    <h5>FRIENDS</h5>
    <ul class="list-inline">
        {% for friend in site.friends %}
            <li><a href="{{ friend.href }}">
                {% if friend.icon %}
                    <img src="{{ friend.icon }}" />
                {% else %}
                    {{ friend.title }}
                {% endif %}
            </a></li>
        {% endfor %}
    </ul>
{% endif %}
```
```yml
# Reward QRcode
QRcodes: [
    ["微信","img/About/wechat.png"],
    ["支付宝","img/About/ali.png"]
]
```
新增QRcode赞赏功能，此处放上自己的赞赏的QRcode图片和图片描述，即可完成。如果放置大于两个的QRcode请前往./css/cofal-blog.css修改第155行`margin: 2px 140px;`的第二个数字（减小试试！）。
#### 布局开发
#### 侧边栏开发
#### 标签开发
#### 主页开发