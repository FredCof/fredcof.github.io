var TOP_WINDOW = 1000;

function randomID(length){
    chars="0123456789qwertyuioplkjhgfdsazxcvbnm";
    length = length;
	var maxPos = chars.length;
	var result = '';
	for(i = 0; i < length; i++) {
		//产生随机数方式
		result += chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return result;
}
// A subclass show write under line in its constructor:
// Window.call('ASM Editor' ,width_vw, height_vh, top_px, left_px);
// Then the follow lines get a new subclass:
// subclass.prototype = Object.create(Window.prototype);
// subclass.prototype.constructor = subclass;
function Window(name, width_px, height_px, top_px, left_px, background){
    this.id = randomID(10);
    this.body = null;
    this.frame = null;
    this.mini = false;
    this.initSuc = false;
    this.name = name ? name : 'Cofal';
    this.background = background ? background : 'black';
    this.max = {
        state: false,
        //width and height init with string visual unit
        width: width_px ? width_px : 40,
        height: height_px ? height_px : 50
    };
    this.position = {
        top: top_px ? top_px : 10,
        left: left_px ? left_px : 10
    };
    this.resize = {
        rX: false,
        rY: false
    };
    this.zindex = 0;

    //init window param
    {
        let body = $('<div></div>').addClass('window');
        let frame = $('<div></div>').addClass('frame');
        let bar = $('<div></div>').addClass('bar');
        let exit = $('<div></div>').addClass('exit');
        let mini = $('<div></div>').addClass('mini');
        let maxi = $('<div></div>').addClass('maxi');
        bar.append(exit).append(mini).append(maxi);
        let bartitle = $('<div></div>').addClass('bartitle').append($('<span></span>').text(this.name));
        bar.append(bartitle);
        body.append(bar);
        body.css('width', this.max.width+'px').css('height', this.max.height+'px');
        body.css('top', this.position.top+'px').css('left', this.position.left+'px');
        body.css('background',this.background);
        body.append(frame);
        body.attr('id', this.id);
        $('body').append(body);
        this.body = $('#'+this.id);
        this.frame = $('#'+this.id+' .frame');
        this.savePos();
        this.body.css('display', 'none');
        this.body.on('click', '.exit', function(event) { $this.Exit(); });
        this.body.on('click', '.maxi', function(event) { $this.Maxi(); });
        this.body.on('click', '.mini', function(event) {
            $('.icon').each(function(index, el) {
                if ($(this).attr('asid') == $this.id) {
                    $this.Mini($(this).offset().left);
                }
            });

        });
        this.body.on('dblclick', '.bar', function(event) { $this.Maxi(); });
        this.body.on('mousedown', '.bar', function(ev) {
            event.preventDefault();
            var oEvent=ev||event;
            $this.fnDown(oEvent);
            return false;
        });
        this.frame.mouseleave(function(event) { $this.widResize(event); });
    }
}

Window.prototype.Exit = function(){
    this.body.css('display', 'none');
    this.initSuc = false;
    return false;
}

Window.prototype.Maxi = function(){
    if (!this.max.state) {
        this.savePos();
        this.body.css('width', '100vw');
        this.body.css('height', 'calc(100vh - 4.6em)');
        this.body.css('top', '1.3em');
        this.body.css('left', '0px');
        this.max.state = true;
    }else{
        this.body.css('width', this.max.width+'px');
        this.body.css('height', this.max.height+'px');
        this.body.css('top', this.position.top+'px');
        this.body.css('left', this.position.left+'px');
        this.max.state = false;
    }
    return false;
}

Window.prototype.Mini = function(left){
    this.body.animate({
        top: '100vh',
        left: left+'px',
        opacity:0,
        width:'hide',
        height:'hide'
    }, {
        duration: 500,
        easing: 'swing',
    });
    this.mini = true;
    return false;
}
Window.prototype.miniCover = function(){
    this.body.animate({
        top: this.position.top+'px',
        left: this.position.left+'px',
        opacity:1,
        width: 'show',
        height: 'show'
    }, {
        duration: 500,
        easing: 'swing',
    });
    this.mini = false;
    return false;
}

Window.prototype.widResize = function(event){
}

Window.prototype.savePos = function(){
    this.position.top = parseInt(this.body.css('top').match(/[-]*[0-9]+/));
    this.position.left = parseInt(this.body.css('left').match(/[-]*[0-9]*/));
    this.max.width = parseInt(this.body.css('width').match(/[0-9]*/));
    this.max.height = parseInt(this.body.css('height').match(/[0-9]*/));
}

Window.prototype.fnDown=function(ev){
    let relX = ev.clientX - this.position.left;
    let relY = ev.clientY - this.position.top;
    var This = this;
    document.onmousemove=function(ev){
        var oEvent = ev||event;
        This.savePos();
        This.fnMove(oEvent, relX, relY);
    };
    document.onmouseup=function(){
        This.fnUp();
    };
}
Window.prototype.fnMove=function(ev, relX, relY){
    this.body.css('left', ev.clientX - relX + 'px');
    this.body.css('top', ev.clientY - relY + 'px');
}
Window.prototype.fnUp=function(){
    document.onmousemove=null;
    document.onmouseup=null;
}
