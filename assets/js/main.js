var winScrollTop;
var section = $(".section");
var offsetTop = [];
var offsetBottom = [];

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
function init() {
  setValue();
  listActive();
  checkInSection();
}
function listActive(index) {
  var list = $(".nav-list li a");
  list.removeClass("active");
  list.eq(index).addClass("active");
  list.parents().parents("header").removeClass("on");
}
$(".nav-list li a").click(function (e) {
  e.preventDefault();
  gap = -50;
  if ($(this.hash).offset()) {
    $("html").animate(
      {
        scrollTop: $(this.hash).offset().top + gap,
      },
      300
    );
  }
});
/* project */
var ww = $(window).width();
var mySwiper = undefined;
var pagingSwiper = undefined;

function initSwiper() {
  if (ww < 1080 && mySwiper == undefined && pagingSwiper == undefined) {
    pagingSwiper = new Swiper(".project-list__paging", {
      spaceBetween: 20,
      slidesPerView: "auto",
      freeMode: true,
      watchSlidesProgress: true,
      observer: true,
    });
    mySwiper = new Swiper(".swiperProject", {
      effect: "cards",
      grabCursor: true,
      loop: true,
      observer: true,
      navigation: {
        nextEl: ".button-next",
        prevEl: ".button-prev",
      },
      thumbs: {
        swiper: pagingSwiper,
      },
    });
  } else if (ww >= 1080 && mySwiper != undefined && pagingSwiper != undefined) {
    mySwiper.destroy();
    mySwiper = undefined;
    pagingSwiper.destroy();
    pagingSwiper = undefined;
  }
}

initSwiper();

function projectItemActive() {
  if (ww >= 1080) {
    $(".project-list__item:first-child").addClass("active");
    $(".project-list__item").on("mouseenter", function () {
      var idx = $(this).index();
      var _this = $(".project-list__item");
      _this.removeClass("active");
      _this.eq(idx).addClass("active");
    });
  } else {
    $(".project-list__item").off("mouseenter");
    $(".project-list__item").removeClass("active");
  }
}
projectItemActive();

$(window).on("resize", function () {
  /* resize */
  ww = $(window).width();
  initSwiper();
  projectItemActive();
  setValue();
  listActive();
  checkInSection();
});
$(window).on("scroll", function () {
  /* scroll */
  winScrollTop = $(window).scrollTop();
  listActive();
  checkInSection();
  /*  */
  var images = document.querySelectorAll(".img-area > img");
  var e = window.scrollY;
  var transformValue = "translateY(".concat(e / 25, "px)");
  images.forEach((img) => {
    img.style.transform = transformValue;
  });
});

$(function () {
  init();
  /* home */
  setTimeout(function () {
    $(".intro h2").addClass("active");
  }, 200);
  setTimeout(function () {
    $(".info .txt").addClass("active");
  }, 400);
  /* skill  */
  $(".skillSwiper").each(function (index) {
    const t = $(this);
    t.addClass("swiepr-" + index);

    skillSwiper = new Swiper(t[0], {
      touchRatio: 0,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
      },
      speed: 5000,
      loop: true,
      loopSlides: 1,
      slidesPerView: "auto",
      centeredSlides: true,
      spaceBetween: 14,
    });
  });

  $(".notice-title").attr("tabindex", 0).attr("title", "내용 보기");
  $(".notice-title").click(function () {
    if ($(this).attr("aria-expanded") === "false") {
      $(this).attr("aria-expanded", "true");
      $(this).parent(".notice-list").addClass("active");
      $(this).attr("title", "내용 닫기");
    } else {
      $(this).attr("aria-expanded", "false");
      $(this).parent(".notice-list").removeClass("active");
      $(this).attr("title", "내용 보기");
    }
  });

  /* 모달 */
  $(".modal-link").on("click", function (e) {
    e.preventDefault();
    var url = $(this).attr("href");

    // Load content into modal__inner
    $(".modal__inner").load(url, function () {
      // Show the modal
      $(".modal").addClass("active");
    });
  });

  $(".modal__close").on("click", function (e) {
    e.preventDefault();
    $(".modal").removeClass("active");
    $(".modal__inner").empty();
  });
  // 모바일 메뉴
  $(".nav-menu").on("click", function () {
    $(this).parent("header").addClass("on");
  });
  $(".nav-close").on("click", function () {
    $(this).parents("header").removeClass("on");
  });
});

function openPdf(pdfUrl) {
  var isAndroid = /Android/i.test(navigator.userAgent);
  var isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isAndroid) {
    window.open(
      "http://docs.google.com/gview?embedded=true&url=" +
        encodeURIComponent(pdfUrl)
    );
  } else if (isIOS) {
    window.open(pdfUrl, "_blank");
  } else {
    window.open("/ebook/openPdf?url=" + encodeURIComponent(pdfUrl));
  }
}
