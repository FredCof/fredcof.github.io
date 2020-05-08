var voteLink = "https://www.icourses.cn/web//sword/portal/courseVote/courseDetail?uuid="
var total = 0;
var rankList = new Array();
var uuidList = new Array();
var removeList = new Array();
var i = 0;
var time = new Date().getTime();

function Course(uuid, thumbs, course, teacher){
    this.uuid = uuid ? uuid : 'blank';
    this.thumbs = thumbs ? thumbs : 0;
    this.course = course ? course : 'default';
    this.teacher = teacher ? teacher : 'no teacher';
}

Course.prototype.toList = function () {
    let li = $("<li></li>").attr('id',this.uuid);
    let a = $('<a></a>').attr('href', voteLink+this.uuid);
    a.append($("<div></div>").addClass('thumb').text(this.thumbs));
    a.append($("<div></div>").addClass('name').text(this.course));
    a.append($("<div></div>").addClass('teacher').text(this.teacher));
    li.append(a);
    return li;
};

$(function(){
    $.ajax({
        url: "course.xml",
        dataType: 'xml',
        type: 'GET',
        timeout: 2000,
        async: true,
        error: function(xml)
        {
            alert("加载XML 文件出错！");
        },
        success: function(xml)
        {
            $(xml).find('uuid').each(function(index, el) {
                uuidList.push($(this).text());
            });
            total = uuidList.length;
            create();
        }
    });
});

function create(){
    $.ajax({
        url: voteLink+uuidList[i],
        dataType: 'html',
        type: 'POST',
        timeout: 2000,
        async: true,
        error: function(xml)
        {
            alert("加载html 文件出错！");
        },
        success: function(xml)
        {
            let page = $(xml);
            let thumb = parseInt(page.find('.fa-thumbs-up').text());
            let course = page.find('h5').text();
            let teacher = page.find('h6').text();
            let co = new Course(uuidList[i], thumb, course, teacher);
            let flag = true;
            let j = 0;
            for (j = 0; j < rankList.length && j < 100; j++) {
                if (rankList[j].thumbs < co.thumbs) {
                    $('#'+rankList[j].uuid).before(co.toList());
                    $('#'+co.uuid).animate({height: '1.7em'}, 1000);
                    $('#'+co.uuid+' div').animate({height: '1.7em'},1000);
                    rankList.splice(j, 0, co);
                    flag = false;
                    break;
                }
            }
            if (flag) {
                if (j < 100) {
                    $('ul').append(co.toList());
                    $('#'+co.uuid).animate({height: '1.7em'}, 1000);
                    $('#'+co.uuid+' div').animate({height: '1.7em'},1000);
                }
                rankList.push(co);
            }
            while ($('li').length > 100) {
                removeList.push($('li:last-child'));
                $('li:last-child').remove();
            }
            if (i < total) {
                $('#prog').val(i);
                let temp = new Date().getTime();
                let spare = (total-i)*(temp - time)/i;
                spare = spare/1000 - 0.05;
                $('.time span').text(spare.toFixed(1)+'s');
                i++;
                setTimeout(create,10);
            }else{
                showTips();
            }
        }
    });
}

function tipsRemove(){
    $('#show').remove();
}

function showTips(){
    $('.tips').html('完成数据爬取，提示栏十秒后消失。').css('text-align', 'center');
    setTimeout(tipsRemove,10000);
}
