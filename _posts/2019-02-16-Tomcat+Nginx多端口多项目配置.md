---
layout:     post
title:      Tomcat+Nginx多端口多项目配置
subtitle:   通过Ngnix代理下的Tomcat的多项目绑定多端口的配置，同时绑定域名
date:       2019-02-16
author:     Cofal
header-img: img/2019/02/16/title_bg.webp
music:      {type: "2", id: "490993786"}
catalog:    true
related:    true
tags:
    - Linux
    - Tomcat
    - Nginx
---
## 简介
&emsp;&emsp;对于同时配置`Nginx`和`Tomcat`的在线服务器，通常将静态文件交由Nginx处理（阿里基于Nginx倒腾出来一个`Tenginx`，据说集群性能好上很多，博主不懂……），动态文件的处理由`Tomcat+Apache`完成，网页的访问由Nginx服务器本地代理完成。通常由Nginx监听`port:80`，之后将动态页面的请求发往Tomcat监听的端口。因此多个项目的不同域名（也可以采用不同路径，下面配图解释）均设置`A值`记录为服务器ip即可。
![url-des]({{ site.baseurl }}/img/2019/02/16/url-des.webp)

## Nginx配置
在nginx.conf中：
```yml
    server{
        listen 80;
        server_name localhost;

        #charset koi8-r
        …………
    }
```
紧接着其后复制一个完整的`server{}`,修改为以下内容：
```yml
    upstream test1{
        #此处定义一个upstream名为tets1，自己随意
        server localhost:8081
        #将动态请求发送到port8081
    }
    server {
        listen       80;
        server_name  xxxxx.xxxx;
        #输入绑定的域名
        #charset koi8-r;
        #access_log  logs/host.access.log  main;
        location / {
            proxy_pass http://test1;
            #调用upstream,或者不使用upstream直接填写localhost:8081
            proxy_set_header Host $http_host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
        #error_page  404              /404.html;
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
```
&emsp;&emsp;大佬们写的[详细nginx.conf参数解读](https://blog.csdn.net/CVJASBPTR/article/details/82660908),我简单介绍几个我们用上的，upstream中的`server localhost:8081`随后将会由Nginx将请求发送到`localhost:8081`，请确保port8081由Tomcat监听（由`netstat -a|grep 8081`查看）。  
&emsp;&emsp;如果一个服务器上面部署多个项目可以建立多个server{}。上传完nginx.conf后使用`sysytemctl restart nginx`重启服务。
&emsp;&emsp;server{}是一个及其方便快捷的设置方式，可以将同一个端口监听的内容发送到不同端口……所以也可以自己发给自己监听哦！！

## Tomcat配置
&emsp;&emsp;配置完成后，迫不及待的使用浏览器访问xxxx.xxx然后：
![error]({{ site.baseurl }}/img/2019/02/16/error.webp)
&emsp;&emsp;仔细想了下，nginx将请求发送到**locahost:8081**但是Tomcat还没有开始监听port8081……于是接下来还需要配置tomcat。  
&emsp;&emsp;复制server.xml中的service节点(以下为无注释版,可直接复制修改)：
```xml
  <Service name="Catalina">
    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
    <Connector port="8009" protocol="AJP/1.3" redirectPort="8443" />
    <Engine name="Catalina" defaultHost="localhost">
      <Realm className="org.apache.catalina.realm.LockOutRealm">
        <Realm className="org.apache.catalina.realm.UserDatabaseRealm"
               resourceName="UserDatabase"/>
      </Realm>
      <Host name="localhost"  appBase="webapps"
            unpackWARs="true" autoDeploy="true">
	    <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
               prefix="localhost_access_log" suffix=".txt"
               pattern="%h %l %u %t &quot;%r&quot; %s %b" />
      </Host>
    </Engine>
  </Service>
```
&emsp;&emsp;粘贴在原本的service节点后，修改为：
```xml
  <Service name="Test1">
  <!--给service起个名字-->
    <Connector port="8081" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
    <!--修改port为Nginx中配置的port-->
    <Connector port="8009" protocol="AJP/1.3" redirectPort="8443" />
    <Engine name="Catalina" defaultHost="localhost">
      <Realm className="org.apache.catalina.realm.LockOutRealm">
        <Realm className="org.apache.catalina.realm.UserDatabaseRealm"
               resourceName="UserDatabase"/>
      </Realm>
      <Host name="localhost"  appBase="/xxxx"
            unpackWARs="true" autoDeploy="true">
      <!--修改appBase-->
            <Context path="" docBase="xxxxx" debug="0" reloadable="true"
                sessionCookiePath="xxxxxx" sessionCookieName="JSESSIONID" />
            <!--修改docBase即存放Java导出的.war文件的目录，可以使用绝对/相对目录。session自选-->
        <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
               prefix="localhost_access_log" suffix=".txt"
               pattern="%h %l %u %t &quot;%r&quot; %s %b" />
      </Host>
    </Engine>
  </Service>
```
&emsp;&emsp;这项配置中我一直不清楚appBase和docBase间的区别，知道看到了[大佬的解释](https://blog.csdn.net/chenzenan/article/details/64905412)，感谢大佬们在我们的前面开路！修改完参数后使用`systemctl restart tomcat`.