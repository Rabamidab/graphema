'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SinglePage = function SinglePage() {
  var _this = this;
  var _self;
  _classCallCheck(this, SinglePage);

  $('.navbar').find('.navbar__link_category').on('click', function () {
    $('.navbar').find('.navbar__link_category').removeClass('navbar__link_active');
    $(this).addClass('navbar__link_active');
    $('section.web-page__item').addClass('hidden');
    $($(this).attr('href')).removeClass('hidden');
    if ($($(this).attr('href')).text() == "") {
      $.ajax({
        url: 'templates/'+ $(this).attr('href').slice(1) + '.html',
        success: function(data){
          alert(data);
        }
      });

    }

  });
};

$(window).on('load', function () {
  $('section.web-page__item').addClass('hidden');   
  var sp = new SinglePage();
});