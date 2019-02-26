document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');



  $(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    console.log(scroll)
    $('.restaurant').css({backgroundSize:scroll+'px'})
    // Do something
  });

















}, false);
