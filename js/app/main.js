define(
    [ "jquery"
    , "smoothscroll"
    , "app/blaa"
    ]
  , function ($, SmoothScroll, Blaa) {

    return {
      init: function() {
        //initialize sticky nav bar
        $('#main-navigation').fixedsticky();

        //Initialize smooth-scroll plugin
        SmoothScroll.init({speed: 300});

        // Our own js modules
        Blaa.blaa();
      }
    }
});