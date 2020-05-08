---
layout:     post
title:      Wordpress下博客搭建
subtitle:   简单的搭建教程已经在搭建过程中遇到的问题的解救过程。
date:       2019-02-17
author:     Cofal
header-img: img/2019/02/16/title_bg.webp
music:      {type: "2", id: "490993786"}
catalog:    true
related:    true
tags:
    - Linux
    - Wordpress
    - Nginx
---
## 搭建
&emsp;&emsp;安装Nginx不介绍，搜索引擎上比比皆是。同时需要安装PHP环境、MySQL数据库。安装Wordpress教程是主要讲的部分！
## Wordpress
&emsp;&emsp;修改Nginx配置，使其直接访问WordPress：
```yml
    #update 2019-2-16
    server {
        #侦听80端口
        listen    80;
        #定义使用 xxxx.xx访问
        server_name  xxxx.xx;
        #定义服务器的默认网站根目录位置
        root html;
        #默认请求
        location / {
            #定义首页索引文件的名称
            index index.php index.html index.htm;   
        }
        # 定义错误提示页面
        error_page   500 502 503 504 /50x.html;
        location = /50x.html {
        }
        #静态文件，nginx自己处理
        location ~ ^/(images|javascript|js|css|flash|media|static)/ {   
            #过期30天，静态文件不怎么更新，过期可以设大一点，
            #如果频繁更新，则可以设置得小一点。
            expires 30d;
        }
        #PHP 脚本请求全部转发到 FastCGI处理. 使用FastCGI默认配置.
        location ~ .php$ {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
            include fastcgi_params;
        }
        #禁止访问 .htxxx 文件
            location ~ /.ht {
            deny all;
        }
    }
    #update 2019-2-16
```
&emsp;&emsp;这个的配置后使用`systemctl restart nginx`刷新nginx配置，随后可能会导致原来配置的本地代理失效，使得本应该交由Tomcat处理的界面也由php处理，同时刷新`systemctl restart tomcat`即可。  
&emsp;&emsp;开始正式的安装之前，需要准备一个MySQL账号和一个用于Wordpress的数据库，确保服务器上正确安装MySQl后。
```bash
$ mysql -u root -p
```
&emsp;&emsp;输入MySQL的密码后，进入MySQL的管理下，为Wordpress创建账号和数据库
```bsh
CREATE DATABASE wordpress;
CREATE USER wordpress@localhost;
SET PASSWORD FOR wordpress@localhost=PASSWORD("your password");
GRANT ALL PRIVILEGES ON wordpress.* TO wordpress@localhost IDENTIFIED BY 'your password';
FLUSH PRIVILEGES;
QUIT;
```
> 依次对应：创建数据库、创建用户、设置密码、赋予权限、刷新设置、退出  

&emsp;&emsp;上传官网下载的Wordpress安装包，解压到指定位置Nginx的根目录`./html/`下，不需要Wordpress文件夹。  
&emsp;&emsp;进入Wordpress解压后的文件夹下，`mv /wp-config-sample.php /wp-config.php`  
&emsp;&emsp;修改部分内容：
```php
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'wordpress');

/** MySQL database password */
define('DB_PASSWORD', 'your password');

/** MySQL hostname with port id*/
define('DB_HOST', "localhost:xx");

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/*
{@link https://api.wordpress.org/secret-key/1.1/salt/ }
 */
define('AUTH_KEY',         'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
define('SECURE_AUTH_KEY',  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
define('LOGGED_IN_KEY',    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
define('NONCE_KEY',        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
define('AUTH_SALT',        'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
define('SECURE_AUTH_SALT', 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
define('LOGGED_IN_SALT',   'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
define('NONCE_SALT',       'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
/**#@-*/
# define('WP_ALLOW_REPAIR', true);
```
&emsp;&emsp;按照上面的格式替换`wp-config.php`中相应的内容。记得请务必加上最后一行的注释，随后使用的过程中出现小问题可以直接去掉注释进行调试。Authentication Unique Keys点击链接即可。
&emsp;&emsp;修改`wp-includes/http.php`文件中的两句话：
```php
$same_host = strtolower( $parsed_home['host'] ) === strtolower( $parsed_url['host'] );
```
替换为：
```php
if ( isset( $parsed_home['host'] ) ) {
     $same_host = ( 
        strtolower( $parsed_home['host'] ) === strtolower( $parsed_url['host'] ) 
        || 'localhost' === strtolower( $parsed_url['host'] ) 
    );
}else { $same_host = false; };
```
```php
if ( 127 === $parts[0] || 10 === $parts[0] || 0 === $parts[0]
```
替换为：
```php
if ( 127 === $parts[0] || 10 === $parts[0] || 0 === $parts[0] || 0 === $parts[0]
```
&emsp;&emsp;随后既可通过Nginx中配置的ip或者域名访问，直接访问`http://xxxx.xxx/wp-admin/install.php`即可开始安装。

## 问题
#### 开始MySQL连接不上
&emsp;&emsp;修改`/wp-config.php`中的配置，检查数据库名、用户名、密码是否正确，还有可能是localhost无法解释，直接修改为`127.0.0.1：port id`即可（一般MySQL的默认port为3306）。刷新页面继续安装。
#### 无法上传文件
&emsp;&emsp;显示没有权限写上级目录，默认的目录为`wp-content/uploads`,需要修改其权限，
```bash
chown -R www /wordpress
chmod 755 /wp-content/uploads
```
#### 运行中显示数据库连接不上
&emsp;&emsp;首先想到的就是服务器的MySQL罢工了！！  
&emsp;&emsp;在服务器上尝试`mysql -u root -p`登录MySQL，成功则重启下MySQL服务即可。失败并且显示`Error 2002`,使用以下命令：
```bash
ps -ef | grep mysqld
```
&emsp;&emsp;运行结果后，如果MySQL在服务中就重启，否则开启服务。开启服务会报错！
![error]({{ site.baseurl }}/img/2019/02/17/error_service.webp)
&emsp;&emsp;倒腾好久没有发现问题在哪，这次的故事教会我要好好的看日志！！
![log]({{ site.baseurl }}/img/2019/02/17/log.webp)
&emsp;&emsp;日志中`2019-02-17T06:03:06.141293Z 0 [ERROR] InnoDB: mmap(137428992 bytes) failed; errno 12`已经表明错误在这……结合上下日志……大概是缓冲的空间不够，于是建立一片缓冲空间给MySQL即可。命令前后可以使用`free`查看空间变化。
```bash
sudo dd if=/dev/zero of=/swapfile bs=1M count=256
sudo mkswap /swapfile
sudo swapon /swapfile
```
&emsp;&emsp;再次重启服务即可！  
```bsah
swapoff /swapfile
rm /swapfile
```
&emsp;&emsp;也可以通过以上命令取消原先的交换内存设置。
&emsp;&emsp;结果展示：[Cofalのブログ](http://cofal.top)!!
