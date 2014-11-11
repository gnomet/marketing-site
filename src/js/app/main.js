define(
  [ "jquery"
  , "smoothScroll"
  , "swiper"
  , "odometer"
  , "app/trial"
  , "app/scrollspy"
  , "fancybox"
  , "sticky"
  ]
  , function ($, SmoothScroll, Swiper, Odometer, Trial, scrollSpy, fancybox, sticky) {
    var app = {
      init: function() {
        //initialize sticky nav bar
        $('#main-navigation').fixedsticky();
        var sidenav = $('#side-navigation');
        sidenav.fixedsticky();

        //Initialize smooth-scroll plugin
        SmoothScroll.init({
          speed: 300,
          offset: 105,
          callbackBefore: function(toggle, anchor) {
            scrollSpy.stop();
            scrollSpy.select(anchor);
          },
          callbackAfter: function(toggle, anchor) {
            setTimeout(scrollSpy.restart, 0);
          }
        });

        this.initializeOdometers();

        // Initialize trial to DOM element
        Trial.initializeTrialForm($('.trial'));

        scrollSpy.init($('#side-navigation a'));

        $(".fancybox")
          .fancybox({
            width       : '100%',
            height      : '100%',
            type        : 'iframe',
            scrolling   : 'no',
            preload     : 'true'
          });

        $('.fancybox-media')
          .attr('rel', 'media-gallery')
          .fancybox({
            openEffect : 'none',
            closeEffect : 'none',
            prevEffect : 'none',
            nextEffect : 'none',

            arrows : false,
            helpers : {
              media : {},
              buttons : {}
            }
          });
      }


      , initializeOdometers: function() {
        //TODO magic numbers
        this.initializeOdometer($('.starter.price-container'), 39, 49);
        this.initializeOdometer($('.pro.price-container'), 19, 49);
        this.initializeOdometer($('.growth.price-container'), 59, 99);
        this.initializeOdometer($('.scale.price-container'), 39, 99);
      }

      , initializeOdometer: function($priceContainer, reducedPrice, monthlyPrice) {
        var $pricingTable = $priceContainer.parents('.pricing-table');
        var $deal = $pricingTable.find('.odometer');

        if($deal.length > 0) {

          var odometer = new Odometer(
            { el: $deal[0]
            , value: reducedPrice
            }
          );

          $pricingTable.find('.switch-price').on('click', function(e) {
            var switchPrice = $(e.currentTarget);

            var currentPrice = $deal.text().replace(/\s/g, "");
            if(currentPrice == reducedPrice) {
              $deal.text(monthlyPrice);
              switchPrice
                .removeClass('switch-monthly')
                .addClass('switch-biannually')
                .text('› Switch to semiannual billing and save up to 20%');

              $pricingTable.find('.billing-cycle').text('Billed monthly');

            } else {
              $deal.text(reducedPrice);
              switchPrice
                .removeClass('switch-biannually')
                .addClass('switch-monthly')
                .text('› Switch to monthly billing');

              $pricingTable.find('.billing-cycle').text('Billed every 6 months');
            }
          });
        }
      }
    }
    app.init();
    return app;
});
