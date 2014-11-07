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

    var renderSelectedEl = function(oldItem, newItem) {
      if (oldItem) {
        oldItem.linkEl.parent().removeClass('current');
      }

      newItem.linkEl.parent().addClass('current');
    };

    var selectItem = function(href) {
      var newItem = _.find(items, {href: href});
      var newGroup = _.find(groups, function(__, top) {
        return Number(top) === newItem.top;
      });

      renderSelectedEl(selectedItem, newItem);

      selectedGroup = newGroup;
      selectedItem = newItem;
    };

    var selectGroup = function(newGroup) {
      if (!newGroup || selectedGroup === newGroup) { return; }
      var newItem = _.first(newGroup);

      renderSelectedEl(selectedItem, newItem);

      selectedGroup = newGroup;
      selectedItem = newItem;
    };

    var handleScroll = function() {
      if (!spying) { return; }

      var scrollPos = $(window).scrollTop();

      var activeGroup = _.findLast(groups, function(items, top) {
        return Number(top) < scrollPos + scrollBuffer;
      }) || _.first(_.toArray(groups));
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
