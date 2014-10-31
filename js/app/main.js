define(
  [ "jquery"
  , "smoothscroll"
  , "swiper"
  , "app/trial"
  ]
  , function ($, SmoothScroll, Swiper, Trial) {
    return {
      init: function() {
        //initialize sticky nav bar
        $('#main-navigation').fixedsticky();

        //Initialize smooth-scroll plugin
        SmoothScroll.init({speed: 300});

        // Our own js modules
        Trial.initializeTrialForm($('.trial'));

      }
    }
});