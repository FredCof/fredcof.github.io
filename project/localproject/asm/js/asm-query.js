//init para
var queryDom;
var condiArray = [];

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
    return "";
}

function setCookie(c_name, value, expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

//get query.xml store by queryDom
$(document).ready(function() {
    $.ajax({
        url: "data/query.xml",
        dataType: 'xml',
        type: 'GET',
        timeout: 2000,
        //async false !important
        async: false,
        error: function(xml)
        {
            alert("加载XML 文件出错！");
        },
        success: function(xml)
        {
            queryDom = xml;
            $(queryDom).find('item').each(function(index, el) {
                createTips($(this));
            });
            $('.notetips').click(function(event) {
                dest = $(this).children('.theme').text().toLowerCase();
                redirectPage(dest);
            });
        }
    });
});

function redirectPage(page){
    setCookie('page',page);
    $(location).attr('href', 'result.html');
}

//fixed footer position
function footerfixed(){
    obj = $('footer');//元素
    obj2bottom = $(window).height()-(obj.height()+obj.offset().top-$(document).scrollTop());//距离底部距离
    if(obj2bottom>0){
        obj.css('position','absolute');
        obj.css('bottom','0');
    }
}
$(document).scroll(function() {
    obj = $('footer');
    obj.css('position','relative');
    footerfixed();
});

//condidate open
function openCondi(){
    $('.condidate').css('display','block');
}
function closeCondi(){
    $('.condidate').css('display','none');
}

//append condidate for input
function appCondidate(text,keyword){
    if(condiArray.indexOf(text)==-1){
        condiArray.push(text);
        text = text.replace(new RegExp(keyword.toUpperCase(),'g'),"<span>$&</span>");
        item = $('<div></div>').addClass('item').html(text);
        item.attr('ref',id);
        $('#decra').before(item);
    }
}
//query keyword in query.xml
function createCondi(){
    condiArray.length = 0;
    keyword = $('#keyword').val().trim().toLowerCase();
    if (keyword == '') {
        closeCondi();
    }else{
        openCondi();
        $('.condidate .item').remove();
        $(queryDom).find('item').each(function(index, el) {
            id = $(this).attr('id');
            if(id.indexOf(keyword)!=-1){
                appCondidate(id.toUpperCase(),keyword);
            }
            $(this).children('keys').find('word').each(function(index, el) {
                word = $(this).text();
                if (word.indexOf(keyword)!=-1) {
                    appCondidate(word.toUpperCase(),keyword,id);
                }
            });
        });
        $('.condidate .item').mousedown(function(event) {
            key = $('#keyword').val();
            $('#keyword').val($(this).html().replace(new RegExp("<span>"+key.toUpperCase()+"</span>",'g'),key.toUpperCase()));
            queryasm($(this));
        });
    }
    if($('.condidate .item').length == 0){
        $('.condidate').css('display','none');
    }
}

//create tips
function createTips(item){
    notetips = $('<div></div>').addClass('notetips');
    notetips.append($('<div></div>').addClass('theme').text(item.attr('id').toUpperCase()));
    notetips.append($('<hr/>'));
    notetips.append($('<div></div>').addClass('descrip').text(item.children('des').text()));
    $('#resultboard').append(notetips);
}

//get page from web
function queryasm(item) {
    keyword = $('#keyword').val().trim().toLowerCase();
    ref = item.attr('ref');
    setCookie('page',ref);
    $(location).attr('href','result.html');
}

$(document).ready(function() {
    closeCondi();
    $('.bubble-loading').click(function(){
        $(location).attr('href','https://www.baidu.com/s?wd='+$('#keyword').val());
    });
    $('a.btn').mousedown(function(event) {
        queryasm();
    });
    $("#keyword").on('input',function(e){
       createCondi();
    });
    footerfixed();
});

/*
<div class="notetips">
    <div class="theme"></div>
    <hr/>
    <div class="descrip"></div>
</div>
*/

/*
$(document).scroll(function() {
    var scroH = $(document).scrollTop();  //滚动高度
    var viewH = $(window).height();  //可见高度
    var contentH = $(document).height();  //内容高度
    if(scroH >100){  //距离顶部大于100px时
    }
    if (contentH - (scroH + viewH) <= 100){  //距离底部高度小于100px
    }  
    if (contentH = (scroH + viewH)){  //滚动条滑到底部啦
    }
    alert("scroll");
});
*/
