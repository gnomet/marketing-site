requirejs.config(
  { paths:
      { 'jquery':       '../vendor/jquery-2.1.1.min'
      , 'bind':         '../vendor/smooth-scroll/bind-polyfill'
      , 'chosen':       '../vendor/chosen/chosen.jquery.min'
      , 'odometer':     '../vendor/odometer/odometer.min'
      , 'smoothScroll': '../vendor/smooth-scroll/smooth-scroll'
      , 'sticky':       '../vendor/fixedsticky/fixedsticky'
      , 'swiper':       '../vendor/Swiper/dist/idangerous.swiper.min'
      , 'text':         '../vendor/text'
      , 'fancybox':     '../vendor/fancybox/jquery.fancybox'
      , 'lodash':       '../vendor/lodash'
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
    , fancybox:
      {
        'deps': ['jquery']
      }
    }
  }
);

requirejs(['app/main']);
