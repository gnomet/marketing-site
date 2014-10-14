requirejs.config(
  { paths:
      { 'jquery':       '../vendor/jquery-2.1.1.min'
      , 'sticky':       '../vendor/fixedsticky/fixedsticky'
      , 'bind':         '../vendor/smooth-scroll/bind-polyfill'
      , 'smoothscroll': '../vendor/smooth-scroll/smooth-scroll'
      , 'domReady':     '../vendor/domReady'
      }
  , shim:
    { sticky:
      { 'deps': ['jquery']
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
