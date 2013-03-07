(function() {

  DEFAULT_TAGS = ['tagone', 'tagtwo'];

  function _fetchTagsFromKeywords() {
    var tags = DEFAULT_TAGS,
        metaTags = document.getElementsByTagName('meta');
    for (var i = 0; i < metaTags.length; i++) {
      var meta = metaTags[i];
      if (meta.name === 'keywords' && meta.content) {
        tags = meta.content.split(/\s*,\s*/).map(function(tag) {
          return tag.toLowerCase();
        });
      }
    }

    return tags.length === 0 ? DEFAULT_TAGS : (tags.length > 2 ? tags.slice(0, 2) : tags);
  }

  var tags = _fetchTagsFromKeywords();

  chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    sendResponse(tags);
  });
}())
