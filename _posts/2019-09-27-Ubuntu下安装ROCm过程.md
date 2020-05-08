---
layout:     post
title:      Ubuntu下安装ROCm过程
subtitle:   AMD为了可以和Nvidia家的配合Windows环境的CUDA库PK，于是配合Linux开发ROMc内核！！！I Love You！！
date:       2019-09-27
author:     Cofal
header-img: img/2019/09/23/title-bg.webp
music:      {type: "0", id: "804408604"}
catalog:    true
related:    true
tags:
    - Linux
    - ROMc
    - 深度学习
---

# 安装过程
> 首先肯定要先去官网看一下[官网说明](https://rocm.github.io/ROCmInstall.html)，以及查看所支持的[GPU芯片型号](https://rocm.github.io/ROCmInstall.html#supported-gpus)，确认自己的电脑可以安装。当然在这之前还要确认一下你的电脑不是Windows系统咯。如果是Windows系统，此处建议安装使用Subsystem(Windows10的功能，Win10以下版本建议直接双系统，或者虚拟机)。  

之后的操作过程咱就直接汉化官网啦！

1. 更新系统到最新版本
    ```
    sudo apt update
    sudo apt dist-upgrade
    sudo apt install libnuma-dev
    sudo reboot
    ```
2. 添加Radeon安装源
    ```
    wget -qO - http://repo.radeon.com/rocm/apt/debian/rocm.gpg.key | sudo apt-key add -
    echo 'deb [arch=amd64] http://repo.radeon.com/rocm/apt/debian/ xenial main' | sudo tee /etc/apt/sources.list.d/rocm.list
    ```
3. 安装rocm-dkms
    ```
    sudo apt update
    sudo apt install rocm-dkms
    ```
    * 至于安装这个干嘛哒，可以参考官网提供的软件相关结构：

    ```
    rocm-dkms
    |-- rock-dkms
    \-- rocm-dev
        |--hsa-rocr-dev
        |--hsa-ext-rocr-dev
        |--rocm-device-libs
        |--rocm-utils
            |-- rocminfo
            |-- rocm-cmake
            \-- rocm-clang-ocl # This will cause OpenCL to be installed
        |--hcc
        |--hip_base
        |--hip_doc
        |--hip_hcc
        |--hip_samples
        |--rocm-smi
        |--hsakmt-roct
        |--hsakmt-roct-dev
        |--hsa-amd-aqlprofile
        |--comgr
        \--rocr_debug_agent

    rocm-libs
    |-- rocblas
    |-- rocfft
    |-- rocrand
    \-- hipblas
    ```

    😂<font color="gray">接下来国内玩家开始了自己的无尽等待之路，大概一个小时左右下载结束！</font>

4. 测试安装是否正确,输入`/opt/rocm/bin/rocminfo`

    > `ROCk module is NOT loaded, possibly no GPU devices`  
    > `Failed to get user name to check for video group membership`  
    > `hsa api call failure at: /data/jenkins_workspace/compute-rocm-rel-2.7/rocminfo/rocminfo.cc:1102`  
    > `Call returned HSA_STATUS_ERROR_OUT_OF_RESOURCES: The runtime failed to allocate the necessary resources. This error may also occur when the core runtime library needs to spawn threads or create internal OS-specific events.`  
    不出意外的报错，不然写这篇博文有何意义嘞！！

    再看另外一个的报错提示`/opt/rocm/opencl/bin/x86_64/clinfo`
    > Number of platforms: 1  
    > Platform Profile: FULL_PROFILE  
    > Platform Version: OpenCL 2.1 AMD-APP (2949.0)  
    > Platform Name: AMD Accelerated Parallel Processing  
    > Platform Vendor: Advanced Micro Devices, Inc.  
    > Platform Extensions: cl_khr_icd cl_amd_event_callback cl_amd_offline_devices  
    >   
    >   
    > Platform Name: AMD Accelerated Parallel   Processing  
    > ERROR: clGetDeviceIDs(-1)
    
## 检查出错位置
1. 首先发现的是找不到设备,于是怀疑是否是没有Linux的GPU驱动,于是去[AMD](https://amd.com)查找相关的Linux驱动程序,下载之后可以直接使用Windows解压,Windows的文件路径对应到Linux系统下为`/mnt/*`.CD到解压目录下,使用` sudo ./amdgpu-pro-install --opencl=legacy`安装驱动程序,结果一大堆的依赖文件没有安装！！Get 8之后就缺少依赖。
2. 相关依赖包是否安装：
    ```shell
    sudo apt update && sudo apt install -y build-essential clang clang-format clang-tidy cmake cmake-qt-gui ssh curl apt-utils pkg-config g++-multilib git libunwind-dev libfftw3-dev libelf-dev libncurses5-dev libpthread-stubs0-dev vim gfortran libboost-program-options-dev libssl-dev libboost-dev libboost-system-dev libboost-filesystem-dev rpm build-essential cdbs dh-make dkms execstack dh-modaliases
    ```
3. 还有一个比较麻烦的依赖项linux-headers;
    - 很多人直接使用`sudo apt-get linux-headers`,发现这个只是一个虚包,详细下载需要指定具体的版本,这里给一个验证之后可以使用的版本。
    ```
    sudo apt-get install linux-headers-4.15.0-20-generic
    ```
    😂<font color="gray">接下来国内玩家开始了自己的无尽等待之路，大概一个小时左右(或者更多，因为还要加上上面那些依赖包)下载结束！</font>
4. 依然还是不能建立依赖树！！
    ```
    amdgpu-lib32 : Depends: libdrm2-amdgpu:i386 (= 1:2.4.97-819430)
                Depends: libdrm-amdgpu-amdgpu1:i386 (= 1:2.4.97-819430)
                Depends: libllvm7.1-amdgpu:i386 (= 1:7.1-819430)
                Depends: libwayland-amdgpu-client0:i386 (= 1.15.0-819430)
                Depends: libwayland-amdgpu-server0:i386 (= 1.15.0-819430)
                Depends: libwayland-amdgpu-egl1:i386 (= 1.15.0-819430)
                Depends: libxatracker2-amdgpu:i386 (= 1:18.3.0-819430)
                Depends: libgbm1-amdgpu:i386 (= 1:18.3.0-819430)
                Depends: libegl1-amdgpu-mesa:i386 (= 1:18.3.0-819430)
                Depends: libegl1-amdgpu-mesa-drivers:i386 (= 1:18.3.0-819430)
                Depends: libgles1-amdgpu-mesa:i386 (= 1:18.3.0-819430)
                Depends: libgles2-amdgpu-mesa:i386 (= 1:18.3.0-819430)
                Depends: libglapi-amdgpu-mesa:i386 (= 1:18.3.0-819430)
                Depends: libgl1-amdgpu-mesa-glx:i386 (= 1:18.3.0-819430)
                Depends: libgl1-amdgpu-mesa-dri:i386 (= 1:18.3.0-819430)
                Depends: libosmesa6-amdgpu:i386 (= 1:18.3.0-819430)
                Depends: mesa-amdgpu-va-drivers:i386 (= 1:18.3.0-819430)
                Depends: mesa-amdgpu-vdpau-drivers:i386 (= 1:18.3.0-819430)
    amdgpu-pro-lib32 : Depends: libgl1-amdgpu-pro-glx:i386 (= 19.10-819430)
                        Depends: libegl1-amdgpu-pro:i386 (= 19.10-819430)
                        Depends: libgles2-amdgpu-pro:i386 (= 19.10-819430)
                        Depends: libglapi1-amdgpu-pro:i386 (= 19.10-819430)
                        Depends: libgl1-amdgpu-pro-dri:i386 (= 19.10-819430)
                        Depends: libgbm1-amdgpu-pro:i386 (= 19.10-819430)
    vulkan-amdgpu-pro:i386 : Depends: libc6:i386 (>= 2.17) but it is not installable
                            Depends: libgcc1:i386 (>= 1:3.3.1) but it is not installable
                            Depends: libstdc++6:i386 (>= 4.8) but it is not installable
                            Depends: wsa-amdgpu:i386 but it is not going to be installed
    ```
    之后就是开始继续安装相关的依赖包……我直接……
    ```
    sudo apt-get install libdrm2-amdgpu libdrm-amdgpu-amdgpu1 libllvm7.1-amdgpu libwayland-amdgpu-client0 libwayland-amdgpu-server0 libwayland-amdgpu-egl1 libxatracker2-amdgpu libgbm1-amdgpu libegl1-amdgpu-mesa libegl1-amdgpu-mesa-drivers libgles1-amdgpu-mesa libgles2-amdgpu-mesa libglapi-amdgpu-mesa libgl1-amdgpu-mesa-glx libgl1-amdgpu-mesa-dri libosmesa6-amdgpu mesa-amdgpu-va-drivers mesa-amdgpu-vdpau-drivers libgl1-amdgpu-pro-glx libegl1-amdgpu-pro libgles2-amdgpu-pro libglapi1-amdgpu-pro libgl1-amdgpu-pro-dri libgbm1-amdgpu-pro libc6 libgcc1 libstdc++6 wsa-amdgpu xserver-xorg-dev build-essential cdbs dh-make dkms execstack dh-modaliases libqtgui4 debhelper debconf libc++6 dkms libqtgui4
    ```
5. 好像问题还在！！
    ```
    sudo add-apt-repository ppa:oibaf/graphics-drivers
    sudo apt update
    sudo apt upgrade
    ```

# 转战VMware!!!!去他的WSL!!