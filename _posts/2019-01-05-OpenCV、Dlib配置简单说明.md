---
layout:     post
title:      OpenCV的配置
subtitle:   在python，c++以及anaconda的环境下安装配置OpenCV以及Dlib
date:       2019-01-05
updesc:     更新在VS2017下配置OpenCV4.0.0,加入方便快捷的OpenCV项目配置.
upurl:      \#4-把新的库文件配置到到项目中
update:     2019-01-26
author:     Cofal
header-img: img/post-bg-universe.webp
catalog:    true
related:    true
tags:
    - OpenCV
    - Dlib
    - 图像处理
    - Python
    - C++
---

# OpenCV配置
&emsp;OpenCV是被广泛应用与图像处理方面的跨平台计算机视觉库，可以在Linux、windows、Android等平台上运行。同时还有Dlib库，两者都有提供多种语言接口。本文涉及大家在OpenCV以及Dlib安装配置方面遇到的小问题，写的很杂。  
&emsp;全文涉及的所有安装路径及文件路径请尽量避免中文路径！！

******

## 方法一
> 此方法适用于C++

*必备文件：*
- &emsp;OpenCV下载：[官方下载链接](https://opencv.org/releases.html)
- &emsp;CMake下载：[官方下载链接](https://cmake.org/download/)（建议下载适应自己电脑的最高版本的zip）
- &emsp;Visual Studio：[官方下载链接](https://visualstudio.microsoft.com/zh-hans/downloads/)（选择最新版本即可）

*额外文件：*
- &emsp;OpenCV-contrib下载：[GitHub项目主页](https://github.com/opencv/opencv_contrib)

******
### 1. 安装配置Visual Studio

建议安装在`D盘`，平时使用需要下载的文件较大。

&emsp;如果没有其他编程需求，勾选Windows中的“`.NET桌面开发`”和“`使用C++的桌面开发`”以及最下面其他工具集中的“`Visual Studio扩展开发`”。之后如果有其他的安装需求再使用`Visual Studio Installer`更改。
![Visual Studio Installer 1]({{ site.baseurl }}/img/2019/01/05/1.png)
![Visual Studio Installer 2]({{ site.baseurl }}/img/2019/01/05/2.png)

### 2. 下载OpenCV

软件的安装就是解压文件的过程，依然建议选择`D盘`
![OpenCV 1]({{ site.baseurl }}/img/2019/01/05/3.webp)
![OpenCV 2]({{ site.baseurl }}/img/2019/01/05/4.webp)

******
### 3. 编译OpenCV

#### 1) 使用CMake生成OpenCV.sln
>摘自[只需一步cnblogs](https://www.cnblogs.com/jliangqiu2016/p/5597501.html)

##### 1>.打开CMake\bin\目录下的cmake-gui.exe工具

&emsp;软件位置：  
![CMake 1]({{ site.baseurl }}/img/2019/01/05/5.png)  
&emsp;打开界面：  
![CMake 2]({{ site.baseurl }}/img/2019/01/05/6.png)  
&emsp;配置源文件为OpenCV的解压目录下的/sources/,自己新建一个空白文件夹，位置自选，将编译结果输出到这个文件夹。  
&emsp;开始编译generate，配置选择和版本对应的设置（VS2017就是 Visual Studio 15 2017）,单选框选择：use default native compilers。  
&emsp;finish开始！  
  
  
  
##### 2>.第二次编译（如果需要编译opencv-contrib经过这步）

&emsp;在第一次编译结束后，将`opencv-contrib下的modles目录`加到配置表中“`OPENCV_EXTRA_MODULES_PATH`”。(_注意直接从windows文件管理中复制得到的目录为`'\\'`,但是在配置表中需要为`'/'`!!!_)  
![CMake 2]({{ site.baseurl }}/img/2019/01/05/7.webp)  
&emsp;点击generate开始第二次编译  
![CMake 3]({{ site.baseurl }}/img/2019/01/05/8.webp)
  
  
  
##### 3>.Visual Studio编译生成Debug库和Release库

&emsp;在CMake的输出目录下找到OpenCV.sln双击打开（默认Visual Studio打开）。  
![Visual Studio 1]({{ site.baseurl }}/img/2019/01/05/9.png)  
&emsp;编译生成Debug库（不明白的可以去查一下Release库和Debug库之间的库别，在这不细说）。  
&emsp;在解决方案中选中工程，右键选择重新生成解决方案（如果没有报错就说明成功，报错右键工程选择清楚解决方案，再次重新生成解决方案即可）。  
  
  
  

******
### 4. 把新的库文件配置到到项目中

`如果嫌弃麻烦可以去搜一下如何把项目的配置文件给其他项目使用，在此不细说！`

![Visual Studio 2]({{ site.baseurl }}/img/2019/01/05/10.png)  
1. > 环境配置  
在系统环境->Path中添加：`*(替换自己OpenCV所在位置)\opencv\build\x64\vc15\bin`；  
将`\opencv\build\x64\vc15\bin\opencv_ffmpeg400_64.dll`复制一份到`C:\Windows\System32\`；  
将`\opencv\build\x64\vc15\bin\opencv_world400.dll`以及`\opencv\build\x64\vc15\bin\opencv_world400d.dll`复制一份到`C:\Windows\SysWOW64\`；  

2. > VC++目录-->包含目录，添加：  
`*(替换自己OpenCV所在位置)\opencv\build\include` ；  
`*(替换自己OpenCV所在位置)\opencv\build\include\opencv`；//部分版本可能没有该文件  
`*(替换自己OpenCV所在位置)\opencv\build\include\opencv2`;  

3. > VC++目录-->库目录，添加：  
`*(替换自己OpenCV所在位置)\opencv\build\x64\vc15\lib`  

4. > 链接器-->输入-->附加依赖项，添加：   
(下面添加的release的版本，注意添加的库与编译选项要一致，注意Release比Debug的文件名少`d`)  
opencv_world400.lib
opencv_world400d.lib
`400`为对应的版本号，添加两句可能导致在Debug过程中读取不到图像，可以在代码开头添加`#pragma comment(lib,"opencv_world400d.lib")`使Denug过程中使用*d.lib。
![Other]({{ site.baseurl }}/img/2019/01/05/Other.webp)
&emsp;&emsp;注意上图中的：视图->其他窗口->属性窗口
![Shuxing]({{ site.baseurl }}/img/2019/01/05/shuxing.webp)
<p color="#FF0000">&emsp;&emsp;直接点击<strong>"Microsoft.Cpp.x64.user"</strong>就可以条状当前状态下的项目属性，进行修改。</p>
******

              

******

## 方法二
> 此方法适用于python
> 安装之前先通过CMD pip安装相关的依赖库（`numpy`）
*必备文件：*
- &emsp;Boost下载：[官方下载链接](https://www.boost.org/)
- &emsp;Visual Studio：[官方下载链接](https://visualstudio.microsoft.com/zh-hans/downloads/)（选择最新版本即可）
- &emsp;Dlib下载：[官方下载链接](http://dlib.net/)

******
### 1. 安装配置Visual Studio
基本同上！在单个组件里面选择所有和CMake相关的选项。

### 2. Dlib和Boost下载解压

### 3. 安装Boost
`本过程中任何地方报错和CMake有关，则下载CMake（msi版）`  
![VS CMD]({{ site.baseurl }}/img/2019/01/05/11.webp)  
以如下方法进入Boost解压的目录，运行bootstrap.bat  
![VS CMD]({{ site.baseurl }}/img/2019/01/05/12.png)  
等待……等待……  
再输入：`b2 install`  
等待……等待……  
再输入：`b2 -a --with-python address-model=64 toolset=msvc runtime-link=static`  
(此处64为CMake的位数，VS里为64，单独安装请以安装的版本更改)  
再输入：`set BOOST_ROOT=C:\local\boost_1_63_0`  
再输入：`set BOOST_LIBRARYDIR=C:\local\boost_1_63_0\stage\lib`  
(更改此处的文件目录为自己解压的位置)

### 3. 安装Dlib
直接使用系统的命令行，进入解压后的目录,  
输入：`python setup.py install`

### 4. 安装OpenCV
直接使用系统的命令行  
输入：`pip install opencv_python`

### 5. 安装OpenCV-contrib(按照需求安装)
直接使用系统的命令行  
输入：`pip install opencv-contrib-python`

******

              

******

## 方法三
>此方法适用于python

*必备文件：*
- &emsp;OpenCV\*.whl下载（网上版本好多，需要选择适合自己python的！）
- &emsp;dlib\*.whl下载
> 此方法可能会导致部分函数不能使用，前面的方法使用不成功才选择这个方法！！

### 1. 安装whl
CMD中加入whl文件所在目录，通过`pip opencv-*.whl`安装(文件名请替换成自己下载的文件名)。

******

              

******

## 方法四
>此方法适用于python

*必备文件：*
- &emsp;OpenCV\*Anaconda下载:[官方下载](https://www.anaconda.com/download/)
> 身为一个常年翻墙在外的人，我觉得这个网速还是相当快的，但是大家可能下载比较慢，可以去[清华大学镜像](https://mirror.tuna.tsinghua.edu.cn/help/anaconda/)

自己在网上查找使用办法，这里附加一个PyCharm的使用教程：[修炼之路csdn](https://blog.csdn.net/sinat_29957455/article/details/75268702)
如果想要使用原先从Python下载的IDLE，似乎也是没有问题的，不过就是需要去修改注册表的值，在此不细说（下载了Anaconda后直接通过pip安装的第三方库都会被下载到Anaconda的文件夹下，也可以通过注册表更改……有点麻烦）。

> 错误说明
可能读取文件会报内存错误，此时需要在连接器->输入->附加依赖项,按照当前环境选择opencv_world430d.lib和opencv_world430.lib. 前者位debug环境中配置，后者为release环境配置。