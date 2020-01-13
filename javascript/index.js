var arrSection = [$("#home"), $("#about"), $('#skills'), $('#projects'), $('#contact')];
var current = 0;

$(function() {
  var $word = $('.word');
  let counter = 0;
  var bounceAnimation = setInterval(function(){
    $word.eq(counter++).addClass('bounce');
    if (counter>=$word.length) {
      clearInterval(bounceAnimation);
    };
  }, 80);
});

var $trigger_arr = $('.untriggered');
let $trigger=$trigger_arr.length>0?$trigger_arr.first():null;
$(document).scroll(function () {
  let newCurrent = arrSection.findIndex((element)=>element.offset().top+element.outerHeight()-1>$(this).scrollTop());
  if (newCurrent!==current && newCurrent!==-1) {
    $('a[href="#'+arrSection[current].attr('id')+'"]').removeClass('active');
    $('a[href="#'+arrSection[newCurrent].attr('id')+'"]').addClass('active');
    current=newCurrent;
  };
  var $nav = $(".nav");
  $nav.toggleClass('scrolled', $(this).scrollTop() > 0);
   
  while ($trigger?$(this).scrollTop()+window.innerHeight/2+200>=$trigger.first().offset().top:$trigger) {
    $trigger.removeClass('untriggered');
    $trigger.addClass('triggered');
    $trigger_arr=$trigger_arr.slice(1);
    $trigger=$trigger_arr.length>0?$trigger_arr.first():null;
  }
});

$(document).on('click', 'a[href^="#"]', function (event) {
  event.preventDefault();

  $('html, body').animate({
      scrollTop: $($.attr(this, 'href')).offset().top
  }, 1000);
});
