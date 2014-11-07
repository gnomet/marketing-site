// http://jsfiddle.net/mekwall/up4nu/
define(
  [ "jquery"
  , "lodash"
  ]
  , function ($, _) {
    var spying = false;
    var scrollBuffer = 145;
    var items; // array of {href, linkEl, anchorEl, top}
    var groups; // items grouped by 'top'
    var selectedGroup; // keep reference to prev selected group in the closure
    var selectedItem;

    var selectItem = function(href) {
      var newItem = _.find(items, {href: href});
      var newGroup = _.find(groups, function(__, top) {
        return Number(top) === newItem.top;
      });

      if (selectedItem) {
        selectedItem.linkEl.parent().removeClass('current');
      }

      newItem.linkEl.parent().addClass('current');

      selectedGroup = newGroup;
      selectedItem = newItem;
    };

    var selectGroup = function(newGroup) {
      if (!newGroup || selectedGroup === newGroup) { return; }

      if (selectedItem) {
        selectedItem.linkEl.parent().removeClass('current');
      }

      _.first(newGroup).linkEl.parent().addClass('current');

      selectedGroup = newGroup;
      selectedItem = _.first(newGroup);
    };

    var handleScroll = function() {
      if (!spying) { return; }

      var scrollPos = $(window).scrollTop();

      var activeGroup = _.findLast(groups, function(items, top) {
        return Number(top) < scrollPos + scrollBuffer;
      });

      selectGroup(activeGroup);
    };

    var createItems = function(linkDomNodes) {
      return linkDomNodes.map(function(domNode) {
        var linkEl = $(domNode);
        var href = linkEl.attr('href');
        return {
          href: href,
          linkEl: linkEl,
          anchorEl: $(href),
          top: $(href).offset().top
        };
      });
    };

    var init = function(links) {
      items = createItems(links.toArray());
      groups = _.groupBy(items, 'top');
      spying = true;

      $(window).scroll(handleScroll);
      // Run once on startup
      handleScroll();
    };

    return {
      // Initialize the spy
      init: init,

      // Select one item as a result of link click
      select: selectItem,

      stop: function() { spying = false; },
      restart: function() { spying = true; }
    };
});
