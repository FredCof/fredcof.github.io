$(document).ready(function(){
    $('li').click(function(){
        frame = $(this).attr("iframe");
        $('iframe').attr('src',frame);
    })
});
