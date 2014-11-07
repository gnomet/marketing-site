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

    var createQueue = function(timeout) {
      var q = [];
      var running = false;

      var run = function() {
        var fn = q.shift();

        if(fn) {
          fn.apply();
          running = true;
          setTimeout(run, timeout);
        } else {
          running = false;
        }
      };

      var purge = function() {
        if (!running) {
          run();
        }
      };

      var add = function(fn) {
        q.push(fn);
      };

      return function(fn) {
        add(fn);
        purge();
      };
    };

    var queue = createQueue(100);

    var elementsToChange = function(oldGroup, oldItem, newGroup, newItem) {
      var result;

      if (!oldItem) {
        result = [newItem];
      } else {

        var resultObject = _.reduce(items, function(memo, item) {
          var captured = memo.oldFound && memo.newFound;
          var capture = memo.oldFound !== memo.newFound;

          if (oldItem === item) {
            memo.oldFound = true;
            memo.reverse = memo.newFound;
            memo.items.push(item);
          } else if (newItem === item) {
            memo.newFound = true;
            memo.items.push(item);
          } else if (capture) {
            memo.items.push(item);
          }

          return memo;

        }, {oldFound: false, newFound: false, reverse: false, items: []});

        if(resultObject.reverse) {
          resultObject.items.reverse();
        }

        result = resultObject.items;
      }

      return result;
    };

    // xs = ['a', 'b', 'c', 'd']
    // partition(2, xs) => [['a', 'b'], ['b', 'c'], ['c', 'd']]
    var partition = function(n, xs) {
      return _.range(xs.length - (n - 1)).map(function(i) { return xs.slice(i, i + n); });
    };

    var renderSelectedEl = function(oldGroup, oldItem, newGroup, newItem) {
      var elements = elementsToChange(oldGroup, oldItem, newGroup, newItem);
      var first = _.first(elements);
      var middle = _.initial(_.rest(elements));
      var middleRenderFns = _(middle)
        .map(function(midItem) {
          var addFn = function() {
            midItem.linkEl.parent().addClass('current');
          };
          var removeFn = function() {
            midItem.linkEl.parent().removeClass('current');
          };
          return [addFn, removeFn];
        })
        .flatten()
        .value();
      var last = _.last(elements);

      if(elements.length === 1) {
        first.linkEl.parent().addClass('current');
      } else {
        partition(2, elements).map(function(itemPair) {
          var item1 = itemPair[0];
          var item2 = itemPair[1];

          return function() {
            item1.linkEl.parent().removeClass('current');
            item2.linkEl.parent().addClass('current');
          };
        }).forEach(queue);
      }
   };

    var selectItem = function(href) {
      var newItem = _.find(items, {href: href});
      var newGroup = _.find(groups, function(__, top) {
        return Number(top) === newItem.top;
      });

      if (newItem === selectedItem) { return; }

      renderSelectedEl(selectedGroup, selectedItem, newGroup, newItem);

      selectedGroup = newGroup;
      selectedItem = newItem;
    };

    var selectGroup = function(newGroup) {
      if (!newGroup || selectedGroup === newGroup) { return; }
      var newItem = _.first(newGroup);

      renderSelectedEl(selectedGroup, selectedItem, newGroup, newItem);

      selectedGroup = newGroup;
      selectedItem = newItem;
    };

    var handleScroll = function() {
      if (!spying) { return; }

      var scrollPos = $(window).scrollTop();

      var activeGroup = _.reduce(groups, function(memo, group, top) {
        top = Number(top);
        var prevTop = memo.top || 0;
        if (top < scrollPos + scrollBuffer && top > prevTop) {
          return {group: group, top: top};
        } else {
          return memo;
        }
      }, {}).group || _.first(_.toArray(groups));

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
