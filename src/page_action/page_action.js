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

  backgroundPage.updatePage(function(uri) {
    address.text(uri);
    input.focus();
  });

  input.on('keypress', function(event) {
    if (_returnPressed(event)) {
      _addBookmark();
    }
  });

  $('button').on('click', _addBookmark);
});
