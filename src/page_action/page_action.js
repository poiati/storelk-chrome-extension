$(function() {
  var CLOSE_POPUP_DELAY = 1500;

  var backgroundPage = chrome.extension.getBackgroundPage(),
      address = $('#address'),
      input = $('#expression'),
      help = $('.help');

  var _returnPressed = function(event) {
    return event.which == 13;
  };

  var _expression = function(event) {
    return address.text() + ' ' + input.val();
  };

  var _onSuccess = function() {
    $('.controls').hide();
    help
      .addClass('help-success')
      .text('Bookmark added successfully!');

    setTimeout(window.close, CLOSE_POPUP_DELAY);
  };

  var _onError = function(message) {
    help
      .addClass('help-error')
      .text(message);
  };

  var _addBookmark = function() {
    backgroundPage.addBookmark(_expression(), _onSuccess, _onError);
  };

  backgroundPage.updatePage(function(uri, keywords, tags) {
    address.text(uri);
    if (keywords) {
      input.attr('placeholder', keywords.map(function(tag) {
        return '#' + tag.replace(/\s+/g, '');
      }).join(' '));
    }
    input.focus();

    input.typeahead({
      source: tags,
      updater: function(item) {
        var currentValue = this.$element.val(),
            lastTagIndex = currentValue.search(lastTagRegex);
        return currentValue.substring(0, lastTagIndex) + "#" + item + " ";
      },
      matcher: function(item) {
        var taginference = this.query.match(lastTagRegex);
        if (taginference) {
          var fragment = taginference[0].substring(1);
          return item.match("^" + fragment);
        }
        return false;
      },
      items: 5
  });
  });

  input.on('keypress', function(event) {
    if (_returnPressed(event)) {
      _addBookmark();
    }
  });

  $('button').on('click', _addBookmark);


  // Tag Typeahed
  var lastTagRegex = /#[\w\-_]+$/;
});
