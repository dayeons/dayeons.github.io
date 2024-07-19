var winScrollTop;
var section = $(".section");
var offsetTop = [];
var offsetBottom = [];
setTimeout(function () {
  $(".info h2").addClass("active");
}, 200);
function setValue() {
  winScrollTop = $(window).scrollTop();
  gap = -200;
  section.each(function (index, obj) {
    offsetTop[index] = $(obj).offset().top + gap;
    offsetBottom[index] = offsetTop[index] + $(obj).height();
  });
}

function checkInSection() {
  for (var i = 0; i < offsetTop.length; i++) {
    if (winScrollTop >= offsetTop[i] && offsetBottom[i] > winScrollTop) {
      sectionActive(i);
    }
  }
}

function sectionActive(index) {
  listActive(index);
}
function listActive(index) {
  var list = $(".nav-list li a");
  list.removeClass("active");
  list.eq(index).addClass("active");
}

function init() {
  setValue();
  listActive();
  checkInSection();
}

$(window).scroll(function () {
  winScrollTop = $(window).scrollTop();
  listActive();
  checkInSection();
});

$(window).resize(function () {
  setValue();
  listActive();
  checkInSection();
});

$(".nav-list li a").click(function (e) {
  if ($(this.hash).offset()) {
    $("html").animate(
      {
        scrollTop: $(this.hash).offset().top,
      },
      300
    );
  }
});

var ww = $(window).width();
var mySwiper = undefined;

function initSwiper() {
  if (ww < 1080 && mySwiper == undefined) {
    mySwiper = new Swiper(".swiperProject", {
      effect: "cards",
      grabCursor: true,
    });
  } else if (ww >= 1080 && mySwiper != undefined) {
    mySwiper.destroy();
    mySwiper = undefined;
  }
}

initSwiper();

$(window).on("resize", function () {
  ww = $(window).width();
  initSwiper();
});

$(function () {
  init();
  $(".skillSwiper").each(function (index) {
    const t = $(this);
    t.addClass("swiepr-" + index);

    const swiper = new Swiper(t[0], {
      touchRatio: 0,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      speed: 7000,
      loop: true,
      loopSlides: 1,
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 14,
    });
  });

  $(".project-list__item:first-child").addClass("active");
  $(".project-list__item").on("mouseenter", function () {
    var idx = $(this).index();
    var _this = $(".project-list__item");
    _this.removeClass("active");
    _this.eq(idx).addClass("active");
  });

  $('.modal-link').on('click', function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    
    // Load content into modal__inner
    $('.modal__inner').load(url, function() {
      // Show the modal
      $('.modal').addClass('active');
    });
  });

  // When modal__close is clicked
  $('.modal__close').on('click', function(e) {
    e.preventDefault();
    // Hide the modal
    $('.modal').removeClass('active');
    // Clear modal__inner content
    $('.modal__inner').empty();
  });
});
