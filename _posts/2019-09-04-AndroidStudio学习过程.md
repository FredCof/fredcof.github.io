---
layout:     post
title:      AndroidStudio学习过程
subtitle:   介绍博主根据Android Developer Training学习Android开发的过程以及遇到的问题
date:       2019-09-04
author:     Cofal
header-img: img/2019/09/23/title-bg.webp
music:      {type: "0", id: "804408604"}
catalog:    true
related:    true
tags:
    - Java
    - Android
    - xml
---
# Android Studio完全卸载
&emsp;&emsp;首先需要卸载安装程序，直接在快捷方式上右键卸载就可以，***记得卸载界面勾选删除用户配置哦***！！  

&emsp;&emsp;之后删除以下文档：
> C:\User\Your_Name\AppData\Local\android<br/>
> C:\User\Your_Name\.android<br/>
> C:\User\Your_Name\.AndroidStudio*<br/>
> C:\User\Your_Name\.gradle<br/>

# Android的下载安装
&emsp;&emsp;上一条就是为了大家配置不方便，直接卸载重装！  
&emsp;&emsp;此处去[Android官网](https://developer.android.com/studio/)下载安装包, 但是由于GFW的原因，官方网站需要翻墙才能访问，此处放我的下载地址，[点击下载](http://cofal.work/%E8%BD%AF%E4%BB%B6%E4%B8%8B%E8%BD%BD/android-studio-ide-191.5791312-windows.exe)。然后一路安装（***记得更改安装位置，不建议安装到C盘，之后的部分设置也是为了将一些特别大的文件转到D盘***）  
&emsp;&emsp;之后是第一次打开Android Studio的配置，一般都是因为Android Studio连不上官方提供的资源，也就是一些文件啥的下载不下来，所以会弹出proxy的的提示，此处如果电脑上的VPN是全局代理的，只需要勾选第二个，`Auto-detect proxy settngs`并且勾选`Automatic proxy configuration `，之后测试`https://dl.google.com`(相关文件的下载地址，只要这个地址可以Ping到就不用设置Proxy)，如果测试连接成功就点击确认继续。  
&emsp;&emsp;之后像 *将虚拟设备安装到非系统盘* 里面的配置环境变量一样，配置好`ANDROID_SDK_HOME`。


# AMD Rezon系列CPU开启虚拟化
&emsp;&emsp;此处内容大量参考[此篇博文](https://blog.csdn.net/ichenwin/article/details/81039816)，希望大家可以参考这篇文章（如有不明白）。  

&emsp;&emsp;Android Studio emulator虚拟机需要开启CPU虚拟化，此处先排查主板是否开启虚拟化，开机按住`Delete`（不同的主板的BIOS加入方式不同）。进入BIOS后查找相关的设置（几乎在Advanced里面），名称大概为`VT-x、VT-i、SVM`之类的，调成Enable。  

&emsp;&emsp;之后调整系统相关的设置。使用`Win+R`输入`control`进入 `控制面板->程序->启用或关闭Windows功能`,之后勾选`Hyper-V`以及`Windows Hypervisor Plantform`（此处以Win10 1809版本显示的英文为准）。经过短时间的安装后重启电脑即可。<br/>
> 安卓模拟器在27.2.8之后的版本，还需要添加一个标志位。创建或打开以下文件`C:\Users\Your_Name\.android\advancedFeatures.ini`，然后在里面添加一行：`WindowsHypervisorPlatform = on`<br/>

 <img src="{{ site.baseurl }}/img/2019/09/04/1.gif">

# 将虚拟设备安装到非系统盘
&emsp;&emsp;Android Studio默认的虚拟设备会被安装到`C:\User\Your_Username\.android\`下面,这将会在你的电脑系统盘下占有大量的空间，每个设备的基础大小在2.5GB以上。<br/>
&emsp;&emsp;一下以将虚拟设备移动至D盘为例。<br/>
&emsp;&emsp;现在D盘建立一个文件夹名为AndroidSDK，之后在系统的环境变量（我的电脑->属性->高级系统设置->环境变量）里面加入一个环境变量
> ANDROID_SDK_HOME<br/>
> D:\AndroidSDK\

&emsp;&emsp;之后将在`C:\User\Your_Username\`下面的`.android`文件夹移动到刚刚新建的AndroidSDK下。<br/>
&emsp;&emsp;把`.android\avd\Your_Virtual_Device_Name.ini`打开，修改其中的内容为(注意虚拟设备名以及API参数的变化啊！！)：
> avd.ini.encoding=UTF-8<br/>
> path=D:\AndroidSDK\.android\avd\Your_Virtual_Device_Name_API_29.avd<br/>
> path.rel=avd\Your_Virtual_Device_Name_API_29.avd<br/>
> target=android-29<br/>


# 启动另一个 Activity
&emsp;&emsp;在这一章的示例代码中，[Android Developer Training](https://developer.android.com/training/)网页上处理加入了'import android.support.v7.app.AppCompatActivity;',这个错误会导致之后无法编译完成，网上给了很多的解决这个问题的方法，但是没有成功的，反而给自己的电脑带来一大堆的环境和不用的包。<br/>
&emsp;&emsp;此处给出一个简单的处理办法，就是在两个页面中都删除'import android.support.v7.app.AppCompatActivity;'语句即可！<br/>

`这次学习这个是因为学习人机交互，老师布置了一项作业：要求大家制作一个五子棋游戏，方式不限。于是我就想咱从来没有试过Android的开发，于是就突发奇想打算使用AndroidStudio编写一个五子棋程序。也会开发Unity版本。这部分内容大概在本笨博主学会写软件之后更新吧（大概一个月之后）`

<hr/>





## 阶段性学习总结

### 1. 布局

#### 1.1 View

> * View是最基本的视图，所有视图布局都由其派生  
> * 派生类具有父类的全部属性，不做描述
> * xml属性对应class里面的set方法，命名遵循`驼峰`

| 属性名 | 属性取值 | 备注 | 
| ------------------- | ------------------------------------- | ----------------------------- | 
| layoutwidth | wrapcontent / matchparent / number | 单位最好为dp |
| layoutheight | wrapcontent / matchparent / number | 单位最好为dp | 
| layoutmargin | number | 子属性：Top,Buttom,Right,Left |
| background | @drawable/* | 派生类需要button属性设为null | 
| layout_gravity | left/right/top/bottom/center/center_* | 设定自己相对父元素布局 |
| min/maxWidth/Height | number | | 
| padding | number | 子属性：Top,Buttom,Right,Left | 
| visibility | boolean | |

#### 1.2 LinearLayout

> * 超级方便的布局文件，咱超级喜欢

| 属性名        | 属性取值              | 备注           | 
| ------------- | --------------------- | -------------- | 
| orientation   | horizontal / vertical | 默认水平       | 
| gravity       | 同layout_gravity      | 设定子视图布局 | 
| layout_weight | number                | 水平布局比重   | 

#### 1.3 ScrollView

> * `HorizontalScrollView`为水平滚动布局
> * 取值按照以下：

> >| 视图                 | layout_width | layout_height |
> >| -------------------- | ------------ | ------------- |
> >| HorizontalScrollView | wrap_content | match_parent  |
> >| ScrollView           | match_parent | wrap_content  |

> * ScrollView只能有一个子布局节点

### 2. 控件

#### 2.1 TextView

> * 背景颜色使用八位颜色，不然可见度默认设置为0

| 属性名               | 属性取值                       | 备注                          |
| -------------------- | ------------------------------ | ----------------------------- |
| text                 | string                         |                               |
| textColor            |                                |                               |
| textSize             | number                         | 单位推荐sp                    |
| textAppearence       | @style.*                       |                               |
| singleLine           | boolean                        | 弃用，但是跑马灯必须，28+无用 |
| ellipsize            | start / middle / end / marquee |                               |
| foucusable           | boolean                        |                               |
| focusableInTouchMode | boolean                        |                               |
| maxLines             | number                         | 多余部分会被视图裁剪          |
| lines                | number                         |                               |
| scrollbars           | vertical / horizontal          | 方法：setMovementMethod       |

#### 2.2 Button

> * 有一个很重要的操作：setOnClickListener(class implements Button.OnClickListener)
> * 还有OnLongClickListener()
> * background是一个很好的美化属性，此处引入九点图
> * 派生自TextView

```
前一段的内容到此结束咯，不然这一段太长了，留着到第二篇咯
```