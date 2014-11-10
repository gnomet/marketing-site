requirejs.config(
  { paths:
      { 'jquery':       '../vendor/jquery-2.1.1.min'
      , 'bind':         '../vendor/smooth-scroll/bind-polyfill'
      , 'chosen':       '../vendor/chosen/chosen.jquery.min'
      , 'odometer':     '../vendor/odometer/odometer.min'
      , 'domReady':     '../vendor/domReady'
      , 'smoothscroll': '../vendor/smooth-scroll/smooth-scroll'
      , 'sticky':       '../vendor/fixedsticky/fixedsticky'
      , 'swiper':       '../vendor/Swiper/dist/idangerous.swiper.min'
      , 'text':         '../vendor/text'
      , 'lodash':     '../vendor/lodash'
      }
  , shim:
    { sticky:
      {
        'deps': ['jquery']
      }
    , chosen:
      {
        deps: ['jquery']
      }
    , smoothscroll:
      {
        'deps': ['bind']
      }
    }
  }
);

// Start the main app logic.
requirejs(['domReady!', 'app/main', 'sticky'],
  function(domReady, App) {
    App.init();
  }
);
