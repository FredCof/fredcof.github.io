---
layout:     post
title:      python2升级python3(Linux)
subtitle:   介绍在Command Line的情况下从python2升级python3，本文不使用网上常见的更改软连接的方法。
date:       2019-02-10
author:     Cofal
header-img: img/2019/02/10/title_bg.webp
music:      {type: "0",id: "914874955"}
catalog:    true
related:    true
tags:
    - Python
    - Linux
---

# 升级准备
## Step One
#### 删除python及其关联
**这个还是不要执行了……会被烦死……最后修复yum的时候**  
强制删除python：`rpm -qa|grep python|xargs rpm -ev --allmatches --nodeps`  
删除其余相关文件：`whereis python|xargs rm -frv`
> 本文来自博主使用CentOS的总结……可能不适用于其它的Linux系统！

#### 下载必要的包
下载python3的文件包：`wget http://www.python.org/ftp/python/3.7.1/Python-3.7.1.tgz`  
预备libffi包：`wget ftp://sourceware.org/pub/libffi/libffi-3.2.1.tar.gz`

#### 解压编译安装
解压：`tar -zxvf Python-3.7.1.tar`  
（预先使用命令`mkdir /usr/local/python3`建立安装的位置）  
编译：
- `cd Python-3.7.1`
- `./configure --prefix=/usr/local/python3`
- > 此处可能会报错：**failed to build moudel:_ctypes**  
> 解决方法：  
> &emsp;&emsp;1.`tar -zxvf libffi-3.2.1.tar.gz`  
> &emsp;&emsp;2.`cd libffi-3.2.1`  
> &emsp;&emsp;3.`./configure`  
> &emsp;&emsp;4.`make && make install`  
> &emsp;&emsp;5.重新编译
- `make && make install`

**此时已经完成大半啦！！**

## Step Two
此时在命令行输入python或者python3都只会提示错误的……所以还没有完成
#### 建立软连接
> `ln -s /usr/local/python3/bin/python3.7 /usr/bin/python3`

## 完成
此时就完成了全部的工作啦！  
输入python3就可以看到：
![python_successful]({{ site.baseurl }}/img/2019/02/10/01.webp)
其实这个时候你的CentOS基本上已经废了，OK，接下来请看这个[博文](https://blog.csdn.net/qq_36653942/article/details/80712088)拯救一下就可以啦！在此之前需要执行一下`ln -s /usr/local/python3/bin/python3.7 /usr/bin/python3`，只会使用python3调用python3.7，python调用2.7……好像饶了远路。

## 加入Apache Tomcat配置
更改tomcat-users.xml为：[文件下载]({{ site.baseurl }}/related/tomcat/tomcat-users.xml)