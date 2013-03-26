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
