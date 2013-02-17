$(function() {
  var CLOSE_POPUP_DELAY = 1500;

  var backgroundPage = chrome.extension.getBackgroundPage(),
      input = $('#expression'),
      help = $('.help');

  var _returnPressed = function(event) {
    return event.which == 13;
  };

  var _expression = function(event) {
    return input.val();
  };

  var _onSuccess = function() {
    input.hide();
    help
      .addClass('help-success')
      .find('p')
        .text('Bookmark added successfully!').parent()
      .find('a')
        .hide();

    setTimeout(window.close, CLOSE_POPUP_DELAY);
  };

  var _onError = function(message) {
    help
      .addClass('help-error')
      .find('p')
        .text(message);
  };

  backgroundPage.updatePage(function(uri) {
    setTimeout(function() {
      input.val(uri + ' ').focus();
    }, 50);
  });

  input.on('keypress', function(event) {
    if (_returnPressed(event)) {
      backgroundPage.addBookmark(_expression(), _onSuccess, _onError);
    }
  });
});
