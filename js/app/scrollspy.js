// http://jsfiddle.net/mekwall/up4nu/
define(
  [ "jquery"
  ]
  , function ($) {
    var items; // array of {id, linkEl, anchorEl}

    var init = function(links) {
      debugger;
      items = links.toArray().map(function(domNode) {
        var linkEl = $(domNode);
        var id = linkEl.attr('href');
        return {
          id: id,
          linkEl: linkEl,
          anchorEl: $(id)
        };
      });

      $(window).scroll(function() {
        // Get container scroll position
        var fromTop = $(this).scrollTop();

        var current = items.filter(function(item) {
          return item.anchorEl.offset().top < fromTop;
        }).pop();
        console.log(current);
      });
    };

    return {
      init: init
    };
});
