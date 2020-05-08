var system = new System();
system.init();

function System(){
    this.background = 'img/background-09.webp';
    this.appList = new Array();
}

System.prototype.init = function(){
    $('body').css('background-image', "url('"+this.background+"')");
}
