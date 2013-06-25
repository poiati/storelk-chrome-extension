var NiziOmnibox = (function() {
  var _tags = [];

  function _suggestionsFromTags(criteria) {
    return _tags
      .filter(function(tag) {
        return tag.match(RegExp('^' + criteria));
      })
      .map(function(tag) {
        return { content: 'in:' + tag, description: tag };
      });
  }

  function _init() {
    chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
      var lastKey = text[text.length - 1];

      if (text.indexOf(':') >= 0) {
        var expression = text.split(':'),
            filter = expression[0],
            criteria = expression[1];

        if (filter === 'in') {
          suggest(_suggestionsFromTags(criteria));
        }
      }
    });

    chrome.omnibox.onInputEntered.addListener(function(text) {
      chrome.tabs.create({ url: 'https://nizi.in/a/tag/' + text.split(/:/)[1] });
    });
  }

  return function() {
    _init();

    return {
      refreshTags: function(tags) {
        _tags = tags;
      }
    };
  }
})();
