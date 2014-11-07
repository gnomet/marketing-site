// http://jsfiddle.net/mekwall/up4nu/
define(
  [ "jquery"
  , "lodash"
  ]
  , function ($, _) {
    var scrollBuffer = 145;
    var items; // array of {id, linkEl, anchorEl, top}
    var groups; // items grouped by 'top'

    var selectGroup = (function() {
      var selectedGroup; // keep reference to prev selected group in the closure
      var selectedItem;

      return function(newGroup) {
        if (!newGroup || selectedGroup === newGroup) { return; }

        if (selectedGroup) {
          _.first(selectedGroup).linkEl.parent().removeClass('current');
          _.first(newGroup).linkEl.parent().addClass('current');
        } else {
          _.first(newGroup).linkEl.parent().addClass('current');
        }
        selectedGroup = newGroup;
      };
    })();

    var handleScroll = function() {
      var scrollPos = $(window).scrollTop();

      var activeGroup = _.findLast(groups, function(items, top) {
        return Number(top) < scrollPos + scrollBuffer;
      });

      selectGroup(activeGroup);
    };

    var createItems = function(linkDomNodes) {
      return linkDomNodes.map(function(domNode) {
        var linkEl = $(domNode);
        var id = linkEl.attr('href');
        return {
          id: id,
          linkEl: linkEl,
          anchorEl: $(id),
          top: $(id).offset().top
        };
      });
    };

    var init = function(links) {
      items = createItems(links.toArray());
      groups = _.groupBy(items, 'top');


      $(window).scroll(handleScroll);
      // Run once on startup
      handleScroll();
    };

    return {
      init: init
    };
});
