$(document).ready(function() {

  // Scrolling changes active link on menu
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      if (scroll < $("div#home").height()) {
        $(".nav-item").removeClass("active");
        $(".nav-item:nth-child(1)").addClass("active");
      } else if (scroll < $("div#home").height() + $("div#demo").height()) {
        $(".nav-item").removeClass("active");
        $(".nav-item:nth-child(2)").addClass("active");
      } else if (scroll < $("div#home").height() + $("div#demo").height() + $("div#features").height()) {
        $(".nav-item").removeClass("active");
        $(".nav-item:nth-child(3)").addClass("active");
      } else if (scroll < $("div#home").height() + $("div#demo").height() + $("div#features").height() + $("div#usage").height()) {
        $(".nav-item").removeClass("active");
        $(".nav-item:nth-child(4)").addClass("active");
      } else {
        $(".nav-item").removeClass("active");
        $(".nav-item:nth-child(5)").addClass("active");
      }
    });

  // Smooth scroll
    $(".nav-link").click(function(event) {
      if (this.hash !== "") {
       event.preventDefault();
       $("html, body").animate({
         scrollTop: $(this.hash).offset().top - $(".navbar").height()
       }, 600);
      }
    });

  // Demo buttons
    $("#embedded-Gantt").hide(0);
    $("#external-Gantt").hide(0);

    $(".btn-demo").click(function() {
      if ($(this).html().indexOf("Embedded Code") != -1) {
        if ($("#external-Gantt").is(":visible")) {
          $("#external-Gantt").animate({
            height: "toggle",
            opacity: "toggle"}, 300
          );
          $(".btn-demo:nth-child(2)").removeClass("active");
        }
        $("#embedded-Gantt").animate({
          height: "toggle",
          opacity: "toggle"}, 600
        );
      } else {
        if ($("#embedded-Gantt").is(":visible")) {
          $("#embedded-Gantt").animate({
            height: "toggle",
            opacity: "toggle"}, 300
          );
          $(".btn-demo:nth-child(1)").removeClass("active");
        }
        $("#external-Gantt").animate({
          height: "toggle",
          opacity: "toggle"}, 600
        );
      }
    });
  });
