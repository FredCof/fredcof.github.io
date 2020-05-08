$(document).ready(function() {
    var NeatseApp = new Application('neatse_music','Neatse Music','img/icon/neatse.png');
    var neatse = new Neatse();
    NeatseApp.windowList.push(neatse);
    NeatseApp.init();
    neatse.initEditor();
});

function Neatse(width_vw, height_vh, top_px, left_px){
    Window.call(this, 'Neatse', 650, 500, 100, 200);
}

Neatse.prototype = Object.create(Window.prototype);
Neatse.prototype.constructor = Neatse;

Neatse.prototype.initEditor = function(){
    $this = this;
    iframe = $('<iframe/>');
    iframe.attr('src','https://music.qq.com/').css('width', '100%').css('height', '100%');
    $this.frame.append(iframe);
    //$this.body.css('display', 'block');
    return false;
}
