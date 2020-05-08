function Application(appid, name, icon){
    this.icon = icon ? icon : 'img/icon/cmd.webp';
    this.name = name ? name : 'app';
    this.appid = appid;
    this.windowList = new Array();
}

Application.prototype.init = function(){
    system.appList.push(this);
}
