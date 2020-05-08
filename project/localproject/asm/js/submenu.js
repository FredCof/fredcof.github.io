function randomIDGenerate(length){
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

function createSub(){
    sub = $('#submenu');
    page = $('#page');
    headlist = $('#submenu .headlist');
    page.children('*').each(function(index, el) {
        h = $(this).get(0).tagName.match(/H[1-3]/g);
        if(h){
            name = $(this).text();
            id = randomIDGenerate(10);
            $(this).attr('id',id);
            if(h!='H1'){
                headlist.append('<li><a href="#'+id+'">'+name+'<a></li>');
            }else{
                $(this).addClass('pagetitle nonechose')
                $('#submenu .subtitle').html('<a href="#'+id+'">'+name+'<a>');
            }
        }
    });
    $('#submenu').append(sub);
}

function fixSubMenu(){
}

$(document).scroll(function(event) {
    a = $('#submenu').offset().top-$(document).scrollTop();
    b = $('#fixedlabel').offset().top-$(document).scrollTop();
    if (a < 0) {
        $('#submenu').css('position', 'fixed');
        $('#submenu').css('top', '0');
    }
    if(b > 0){
        $('#submenu').css('position', 'relative');
    }
});
