$(document).on("click", "#dialogVideoPreview > div.head > button", function () {
  // 비디오 미리보기 미리보기 종료시 제거
  $("#myvideo").empty();
});
// 모달 키보드 접근성 처리
var currentBtn = null;
$(document).on("click", ".photo-list__layer-top button", function () {
  currentBtn = $(this);
  console.log(currentBtn);
  console.log(currentBtn[0].dataset.value);
});
$(document).on("click", '[id^="audioButton_"]', function () {
  currentBtn = $(this);
  console.log(currentBtn);
  $(".sound-play__close").focus();
});
$(document).on("click", ".dialog-close,.sound-play__close", function () {
  console.log(currentBtn);
  if (currentBtn !== null) currentBtn.focus();
});

function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  return http.status != 404;
}
function isMobile() {
  var UserAgent = navigator.userAgent;
  if (
    UserAgent.match(
      /iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i
    ) != null ||
    UserAgent.match(/LG|SAMSUNG|Samsung/) != null
  ) {
    return true;
  } else {
    return false;
  }
}
var ismobile = false;
if (window.innerWidth < 1200) {
  ismobile = true;
}
$(window).resize(function () {
  if (window.innerWidth < 1200) {
    ismobile = true;
  } else {
    ismobile = false;
  }
});
// 스크롤 이벤트
var scrollEvent = {
  // top-button 메뉴
  topBtn: function () {
    $(window).on("scroll", function () {
      let scrTop = $(window).scrollTop();
      let scrlBottom =
        $(document).height() - $(window).height() - $(window).scrollTop();
      if (scrlBottom >= 300) {
        $(".top-button").addClass("fixed");
      } else {
        $(".top-button").removeClass("fixed");
      }
      if (scrTop < 150) {
        $(".top-button").removeClass("fixed");
      }
    });
  },
  // 오디오 미리듣기
  soundBtn: function () {
    $(window).on("scroll", function () {
      let scrlBottom =
        $(document).height() - $(window).height() - $(window).scrollTop();
      let mainFooter = $("#footer").height();
      if (scrlBottom - 30 >= mainFooter) {
        $(".sound-play").removeClass("on");
      } else {
        $(".sound-play").addClass("on");
      }
    });
  },
};

var imgListSetting = {
  init: function () {
    var imglist = $(".photo-list__img .img img").attr("src");
    $(".photo-list__img .img img").each(function (
      indexInArray,
      valueOfElement
    ) {
      if (UrlExists(valueOfElement.src) == false) {
        $(this).attr("src", "/static/kogl/img/common/NO-IMG.jpg");
        $(this).one("load", function () {
          imgListSetting.complete(this);
        });
        return;
      }
      $(valueOfElement)
        .one("load", function () {
          if (valueOfElement.naturalWidth === 0) {
            $(this).attr("src", "/static/kogl/img/common/NO-IMG.jpg");
            imgListSetting.complete(this);
          }
          imgListSetting.complete(this);
        })
        .each(function () {
          if (this.complete) {
            $(this).trigger("load");
          }
        });
    });
  },
  complete: function (target) {
    w = $(target)[0].naturalWidth;
    h = $(target)[0].naturalHeight;
    fg = w / h;
    fb = 220 * fg;
    mw = fb * 1.5;
    paddingtop = (h / w) * 100 + "%";
    $(target).parents(".photo-list__img .img").css({
      "padding-top": paddingtop,
    });
    $(target)
      .parents(".photo-list__img")
      .parents(".photo-list__item")
      .attr(
        "style",
        `
			flex-basis : ${fb}px;
			flex-grow : ${fg};
			max-width : ${mw}px
		`
      )
      .addClass("loadcomplete");
  },
};
$(".photo-list__img").attr("tabindex", 0);
var HoverEvent = {
  photoList: function () {
    $(".photo-list__img").on("mouseenter focus keyup", function () {
      $(this).siblings(".photo-list__layer").addClass("on");
    });
    $(".photo-list__thumnail").on("mouseenter focus keyup", function () {
      $(this).siblings(".photo-list__layer").addClass("on").focus();
    });
    $(".photo-list__inner").on("mouseleave blur", function () {
      $(this).find(".photo-list__layer").removeClass("on");
    });
    $(".photo-list__layer").on("mouseleave blur", function () {
      $(this).removeClass("on");
    });
    $(".photo-list__layer .like").on("keydown", function () {
      $(this).parents(".photo-list__layer").removeClass("on");
    });
    $(".photo-list__button").on("mouseenter focus keyup", function () {
      $(this).siblings(".photo-list__layer").removeClass("on");
    });
    $(".photo-list__title a").on("mouseenter focus keyup", function () {
      $(this)
        .parent(".photo-list__title")
        .siblings(".photo-list__inner")
        .find(".photo-list__layer")
        .removeClass("on");
    });
  },
};
var ClickEvent = {
  //오디오 미리듣기
  audioPreview: function () {
    // $('.soundPlay').on('click', function(e){
    //     e.preventDefault()
    // })
    if ($(".soundPlay").length > 0) {
      $.ajax({
        url: "/static/html/layerPopup-audio.html",
        success: function (data) {
          $("#playerarea").html(data);
          playersAudio.initBtnEventAdd(); //오디오 미리보기 버튼 이벤트 추가
        },
        dataType: "html",
      });
    }
  },
};
$(function () {
  // 스크롤 이벤트
  scrollEvent.topBtn();
  scrollEvent.soundBtn();
  // 마우스 이벤트
  HoverEvent.photoList();
  //클릭이벤트
  //ClickEvent.dialogPreview();
  //ClickEvent.dialogPreview2();
  ClickEvent.audioPreview(); //오디오 영역 셋팅
});
$(document).on("focusout", "#startDate, #endDate", function (index, el) {
  if (!dateTypeCheck($(this).val()) && $(this).val() != "") {
    showtooltip();
    var title = $(this).attr("title");
    if ($(this)[0].id != "") {
      labelTitle = true;
    } else {
      labelTitle = false;
    }
    if (title != undefined) {
      alert(title + "형식이 올바르지 않습니다. 입력예 " + today());
    } else if (labelTitle) {
      alert(
        $("label[for=" + $(this)[0].id + "]").text() +
          "형식이 올바르지 않습니다. 입력예 " +
          today()
      );
    } else {
      alert("날짜형식이 올바르지 않습니다. 입력예 " + today());
    }
    $(this).val("");
    dateValidatorTarget = $(this);
  }
});
$(function () {
  //기간설정
  if ($.datepicker != undefined) {
    $.datepicker.regional["ko"] = {
      closeText: "닫기",
      prevText: "이전달",
      nextText: "다음달",
      currentText: "오늘",
      monthNames: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
      ],
      monthNamesShort: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
      ],
      dayNames: ["일", "월", "화", "수", "목", "금", "토"],
      dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
      dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
      weekHeader: "Wk",
      dateFormat: "yy-mm-dd",
      firstDay: 0,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: "년",
    };
    $.datepicker.setDefaults($.datepicker.regional["ko"]);
    $("input#startDate").datepicker({
      showOn: "button",
      buttonImage: "/static/commons/img/calendar.png",
      buttonImageOnly: true,
      changeMonth: true,
      changeYear: true,
      showMonthAfterYear: false,
    });
    $("input#endDate").datepicker({
      showOn: "button",
      buttonImage: "/static/commons/img/calendar.png",
      buttonImageOnly: true,
      changeMonth: true,
      changeYear: true,
      showMonthAfterYear: false,
    });
  }
  // 달력 언어설정
  if (typeof $.fn.datepicker != "undefined") {
    $.fn.datepicker.dates.ko = {
      days: [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
      ],
      daysShort: ["일", "월", "화", "수", "목", "금", "토"],
      daysMin: ["일", "월", "화", "수", "목", "금", "토"],
      months: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
      ],
      monthsShort: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
      ],
      today: "오늘",
      clear: "삭제",
      format: "yyyy-mm-dd",
      titleFormat: "yyyy년mm월",
      weekStart: 0,
    };
    // yyyy
    $("input.year")
      .datepicker({
        language: "ko",
        format: "yyyy",
        dateFormat: "yyyy",
        viewMode: "years",
        minViewMode: "years",
        autoclose: true,
        ignoreReadonly: true,
      })
      .attr("placeholder", "YYYY");
    // $('input.year').attr("readonly",true);
    $('input.year[name="startYear"]').attr("title", "조회시작연도");
    $('input.year[name="endYear"]').attr("title", "조회종료연도");
  }
  // 달력
  if (!isMobile() && typeof $.fn.datepicker != "undefined") {
    // yyyy-mm-dd
    $("input#startDate, input#endDate, input.date")
      .datepicker({
        format: "yyyy-mm-dd",
        language: "ko",
        todayHighlight: true,
        autoclose: true,
      })
      .attr("placeholder", "YYYY-MM-DD");
  }
  // 링크 접근성
  $("#content a").each(function () {
    if ($(this).attr("target") == "_blank" && $(this).attr("title") != "") {
      $(this).attr("title", "새창열림");
    }
  });
  // 공공누리 유형 모달  class="opencode-dialog-contents" load
  $("#content .opencode-dialog-contents").load("/static/html/opencode.html");
  // 이미지 미리보기 유형 모달  class="image-dialog-contents" load
  $(".image-dialog-contents").load("/static/html/layerPopup-image.html");
  // 동영상 미리보기 유형 모달  class="video-dialog-contents" load
  $(".video-dialog-contents").load("/static/html/layerPopup-video.html");
});
// top-menu 중복 복사
const topMenuClone = $("#top-menu .top-menu-left")
  .clone()
  .removeClass()
  .addClass("top-menu");
const topMenuhtml = $("#all-menu h2").after(topMenuClone);
const topMenuLink = $("#top-menu .top-menu-right")
  .clone()
  .removeClass()
  .addClass("logo-link");
const topMenuLinkhtml = $("#all-menu #gnb-all-nav").after(topMenuLink);
const headerLogo = $("#header .logo > a").clone().addClass("logo");
const headerLogohtml = $("#all-menu .top-menu").prepend(headerLogo);
// 인기검색어 중복 복사
const rankingClone = $(
  ".popular-ranking__list.swiper > .swiper-wrapper > *"
).clone();
const rankinghtml = $(".popular-ranking__all .popular-ranking__list").html(
  rankingClone
);

$(".popular-ranking__all .swiper-slide")
  .removeClass("swiper-slide")
  .addClass("item");
$(".sub-search .popular-ranking .popular-ranking__title").on(
  "mouseenter keyup touchdown",
  function () {
    $(this)
      .siblings(".sub-search .popular-ranking__all")
      .addClass("on")
      .attr("tabindex", 0);
  }
);
$(".popular-ranking__all .popular-ranking__list >div:last-child a").on(
  "focusout",
  function () {
    $(this)
      .parents(".popular-ranking__all")
      .removeClass("on")
      .attr("tabindex", -1);
  }
);
$(".sub-search .popular-ranking").on("mouseleave blur", function () {
  $(".sub-search .popular-ranking__all").removeClass("on").attr("tabindex", -1);
});
// 전체메뉴
const navhtml = $("#gnb > .gnb-set > ul").clone();
const allnavhtml = $("#gnb-all-nav > ul > li").appendTo(navhtml);
$("#all-menu #gnb-all-nav").html(navhtml.clone()).parents("#all-menu");

$(".all-menu-button").click(function (e) {
  e.preventDefault();
  $("#all-menu").addClass("active").attr({ title: "전체메뉴 열림" });
  // 모바일 메뉴
  if (ismobile == true) {
    $("#gnb-all-nav>ul")
      .find(".depth1 a")
      .on("click", function (e) {
        if ($(this).parent().find(">div,>ul").length > 0) {
          e.preventDefault();
          $(this).parent().toggleClass("active");
        }
      });
  }
});
$(".all-menu-close").click(function (e) {
  e.preventDefault();
  $("#all-menu")
    .removeClass("active")
    .attr({ tabindex: "-1", title: "전체메뉴 닫힘" });
});
// 배너 swiper
var footerSwiperLoop = false;
if (ismobile == false) {
  footerSwiperLoop = false;
} else {
  footerSwiperLoop = true;
}
var footerSwiper = new Swiper(".footer-banner__list", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: footerSwiperLoop,
  navigation: {
    nextEl: ".footer-banner__button-next",
    prevEl: ".footer-banner__button-prev",
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 6,
      spaceBetween: 20,
    },
  },
});
$(".footer-banner__button-stop").on("click", function () {
  $(this).addClass("dn");
  $(".footer-banner__button-play").removeClass("dn");
  footerSwiper.autoplay.stop();
});
$(".footer-banner__button-play").on("click", function () {
  $(this).addClass("dn");
  $(".footer-banner__button-stop").removeClass("dn");
  footerSwiper.autoplay.start();
});
// 첨부파일
$("#file").on("change", function () {
  /* var fileName = $("#file").val();
	$(".upload-name").val(fileName); */
  var path = this.value.replace(/^C:\\fakepath\\/i, "");
  var filename = path.replace(/^.*\\/, "");
  $(".upload-name").val(filename);
  //$objUploadName = $(this).parent().find(".upload-name");
  //$objUploadName.val(filename);
});
$(".depth2 li").has(".depth3").addClass("mobile");
// 모바일 카테고리 검색
$(".toggle-btn").on("click", function () {
  $(this).parent(".lnb-detail__form-mobile").toggleClass("active");
});
// 모바일 검색
$(window).bind("resize load", function () {
  if (ismobile == true) {
    $("#subSearch .sub-search__sh-input").attr("readonly", true);
    $(".sub-search__content .sub-search__sh").on("click", function (e) {
      e.preventDefault();
      $(".sub-search-mobile").addClass("active");
    });
    $(".sub-search-close").on("click", function () {
      $(".sub-search-mobile").removeClass("active");
    });
  } else if (ismobile == false) {
    $("#subSearch .sub-search__sh-input").attr("readonly", false);
  }
});
//푸터
const telClone = $(".footer-left address .hunting-line").clone();
const telhtml = $(".footer-menu__link").before(telClone);
// 클래스 추가
if ($(".badge.badge--end").length) {
  $(".badge.badge--end").parents(".competition__item").addClass("end");
}
// 게시판 모바일
$(function () {
  $(".bd-list").each(function (i, element) {
    _ = $(element);
    $(this)
      .find("tr")
      .each(function () {
        $(this)
          .find("td")
          .each(function (index) {
            //if ($(this).hasClass('title') || $(this).hasClass('no') || $(this).text().trim() == '') {
            if (
              $(this).hasClass("title") ||
              $(this).hasClass("no-head") ||
              $(this).hasClass("reple") ||
              $(this).parent().hasClass("nodata") ||
              $(this).hasClass("nodata") ||
              $(this).parent().hasClass("q") ||
              $(this).parent().hasClass("a") ||
              this.childNodes.length == 0
            ) {
            } else {
              var txt =
                '<span class="only-m">' +
                _.find("th").eq(index).text() +
                "</span>";
              $(this).prepend(txt);
            }
          });
      });
  });
  $(".board-list").each(function (i, element) {
    _ = $(element);
    $(this)
      .find("tr")
      .each(function () {
        $(this)
          .find("td")
          .each(function (index) {
            //if ($(this).hasClass('title') || $(this).hasClass('no') || $(this).text().trim() == '') {
            if (
              $(this).hasClass("subject") ||
              $(this).hasClass("no-head") ||
              $(this).parent().hasClass("nodata") ||
              this.childNodes.length == 0
            ) {
            } else {
              var txt =
                '<span class="only-m">' +
                _.find("th").eq(index).text() +
                "</span>";
              $(this).prepend(txt);
            }
          });
      });
  });
  // 설명 더보기
  $(".question-mark").each(function (i, element) {
    _this = $(element);
    _this.attr("tabindex", 0);
    $(_this)
      .find("i")
      .on("click", function () {
        //			$(this).siblings('.question-mark__answer').toggleClass('on')
      });
  });
});
///* 접근성 탭 포커스 스타일 */
var $fileBox = null;
$(function () {
  init();
});
function init() {
  $fileBox = $(".filebox");
  fileLoad();
}
function fileLoad() {
  $.each($fileBox, function (idx) {
    var $this = $fileBox.eq(idx),
      $btnUpload = $this.find('[type="file"]'),
      $label = $this.find('[for="file"], label');
    $btnUpload.on("focusin focusout", function (e) {
      e.type == "focusin"
        ? $label.addClass("file-focus")
        : $label.removeClass("file-focus");
    });
  });
}
