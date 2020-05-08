$(document).ready(function() {
    var docker = new Docker();
    docker.init();
});

function Docker(background){
    this.panel = null;
    this.list = new Array();
    this.background = background ? background : 'rgba(154, 154, 154, 0.63)';
}

Docker.prototype.init = function(){
    let pan = $('<div></div>').addClass('docker');
    for (let i = 0; i < system.appList.length; i++) {
        let icon = $('<span></spna>').addClass('icon').css('content', 'url('+system.appList[i].icon+')');
        icon.attr('asid',system.appList[i].windowList[0].id);
        pan.append(icon);
    }
    $('body').append(pan);
    this.panel = $('.docker');
    let This = this;
    this.panel.on('click', '.icon', function(event) {
        for (let i = 0; i < system.appList.length; i++) {
            if($(this).attr('asid') == system.appList[i].windowList[0].id){
                let window = system.appList[i].windowList[0];
                if (!window.initSuc) {
                    window.body.css('display', 'block');
                    window.initSuc = true;
                }else{
                    if (window.mini) {
                        window.miniCover();
                    }else{
                        window.Mini($(this).offset().left);
                    }
                }
            }
        }
        event.preventDefault();
    });
}
