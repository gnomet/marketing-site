define(
  [ "jquery"
  , "smoothscroll"
  , "swiper"
  , "odometer"
  , "app/trial"
  ]
  , function ($, SmoothScroll, Swiper, Odometer, Trial) {
    return {
      init: function() {
        //initialize sticky nav bar
        $('#main-navigation').fixedsticky();
        $('#side-navigation').fixedsticky();

        //Initialize smooth-scroll plugin
        SmoothScroll.init({speed: 300});

        this.initializeOdometers();

        // Initialize trial to DOM element
        Trial.initializeTrialForm($('.trial'));

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
});
