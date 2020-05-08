/*
function resize(){
    window.alert("OK");
    var size = $(window).width();
    var newsize = 300;
    var canvas = document.getElementById("Live2D");
    if(canvas.getContext){
        newsize = size*0.15;
        canvas.width = newsize;
        canvas.height = newsize;
        var context = canvas.getContext("2d");
        var img = new Image();
        img.src = "{{ site.baseurl }}/img/Live2D.png";
        img.onload = function(){
            context.clearRect(0,0,canvas.width,canvas.height);
            context.drawImage(img, 0, 0,300,300,0,0,newsize,newsize);             
        };
    }
}

function load(){
    var doc_body = document.body;

    var fixed_div = document.createElement("div");
    fixed_div.class = "none fixed-left-bottom";

    var canvas_inner = document.createElement("canvas");
    canvas_inner.id = "Live2D";
    canvas_inner.style = "width: 300px; height: 300px;";
    canvas_inner.innerHTML = "Your browser does not support the video tag.";

    fixed_div.appendChild(canvas_inner);
    doc_body.appendChild(fixed_div);

    resize();
}

window.onresize= resize;
window.onload= load;
*/