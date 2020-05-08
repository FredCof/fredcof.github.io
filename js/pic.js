$(".post-container img").click(event => {
    let picpath = event.target.src;
    let back = $("<div></div>")
        .attr("id", "pic-display")
        .click(() => {
            $("#pic-display").remove();
        });
    let pic = $("<img/>").attr("src", picpath);
    back.append(pic);
    $("nav").before(back);
});
