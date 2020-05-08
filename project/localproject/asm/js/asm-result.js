//init
var page = '';

//cookie operator function
function getCookie(c_name){
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1){
            c_start=c_start + c_name.length+1
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1){
                c_end=document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return ""
}

function setCookie(c_name, value, expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

$(document).ready(function() {
    page = getCookie('page');
    if (page == '') {
        $(location).attr('href', 'index.html');
    }else{
        mail = $('#mail').attr('href');
        mail = mail.replace(/pagename/,page.toUpperCase());
        $('#mail').attr('href',mail);
    }
    $("#page").load("data/source/"+page+'.data',prepareSubpage);
});

function prepareSubpage(){
    createSub();
    $('footer').css('display','flex');
    //页面加载完成后的页面修改
}
