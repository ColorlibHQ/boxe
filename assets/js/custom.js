/**
 * Boxe front-end behaviour, without jQuery.
 *
 * The plugin calls keep the options they always had; ColorlibUI provides
 * drop-in versions of Owl Carousel, Magnific Popup, AjaxChimp and the Gijgo
 * datepicker that build the same markup, so the theme's stylesheets apply
 * unchanged.
 */
(function () {
  'use strict';

  var UI = window.ColorlibUI;
  if (!UI) return;

  UI.datepicker('#datepicker');

  UI.magnific('.popup-youtube, .popup-vimeo', {
    // disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  UI.enhanceSelects('select');

  UI.owl('.deliveries_slider', {
    items: 3,
    loop: true,
    dots: false,
    autoplay: true,
    autoplayHoverPause: true,
    autoplayTimeout: 5000,
    nav: true,
    smartSpeed: 2000,
    margin: 30,
    navText: [
      '<i class="flaticon-left-arrow"></i>',
      '<i class="flaticon-right-arrow"></i>'
    ],
    responsive: {
      0: {
        nav: false,
        items: 1
      },
      768: {
        nav: true,
        items: 2
      },
      992: {
        nav: true,
        items: 3
      }
    }
  });

  UI.ready(function () {
    // menu fixed js code
    var menus = UI.toElements('.main_menu');
    if (menus.length) {
      window.addEventListener('scroll', function () {
        var windowTop = window.pageYOffset + 1;
        menus.forEach(function (menu) {
          if (windowTop > 50) {
            menu.classList.add('menu_fixed', 'animated', 'fadeInDown');
          } else {
            menu.classList.remove('menu_fixed', 'animated', 'fadeInDown');
          }
        });
      }, { passive: true });
    }

    // Search Toggle
    var box = document.getElementById('search_input_box');
    var open = document.getElementById('search_1');
    var close = document.getElementById('close_search');
    if (box) {
      box.style.display = 'none';
      if (open) {
        open.addEventListener('click', function () {
          UI.slide(box, 'toggle');
          var input = document.getElementById('search_input');
          if (input) input.focus();
        });
      }
      if (close) {
        close.addEventListener('click', function () {
          UI.slide(box, 'up', 500);
        });
      }
    }
  });

  //------- Mailchimp js --------//
  UI.ajaxChimp('#mc_embed_signup form');
}());
