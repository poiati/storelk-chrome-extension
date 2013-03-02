// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var uri = '',
    currentTabId = null;

var UI = {
  show: function() {
    chrome.pageAction.show(currentTabId);
  },
  setPageBookmarkedIcon: function(icon) {
    var icon = icon || '../icons/icon19-heart.png';
    chrome.pageAction.setIcon(
      { tabId: currentTabId, path: icon } 
    );
  },
  setPopup: function(popup) {
    chrome.pageAction.setPopup({ tabId: currentTabId, popup: popup });
  },
  setNoPopup: function() {
    this.setPopup('');
  },
  setDisconnected: function() {
    this.setPageBookmarkedIcon('../icons/icon19-heart-disconnected.png');
    this.setPopup('src/page_action/page_action_disconnected.html');
    this.show();
  }
};

var RequestHandler = {
  handle: function(message) {
    this[message].call();
  },
  setExtensionVersion: function() {
    chrome.cookies.set({
      url: 'http://nizi.in/',
      name: 'extension_version',
      value: chrome.runtime.getManifest().version,
      httpOnly: true
    });
  }
};

function _refreshTabData(tab) {
  uri = tab.url;
  currentTabId = tab.id;
}

function _inspectPage(tabId, changeInfo, tab) {
  if (tab.url.match(/^chrome/)) {
    return;
  }
  _refreshTabData(tab);
  checkBookmarkExistense(tab.url);
};

function _sendRequest(method, params, endpoint, onSuccess, onError) {
  var onSuccessWrapper = function(response) {
    onSuccess(response);
  };

  var onErrorWrapper = function(xhr, textStatus, errorThrow) {
    UI.setDisconnected();
    onError();
  };

  $.ajax({
    type: method,
    url: 'http://nizi.in/a' + endpoint,
    dataType: 'json',
    data: params,
    success: onSuccessWrapper,
    error: onErrorWrapper,
  });
}

function updatePage(fn) {
  fn(uri);
}

function checkBookmarkExistense(href) {
  var onSuccess = function(response) {
    if (response.exists) {
      UI.setPageBookmarkedIcon();
      UI.setNoPopup();
    }
    UI.show();
  };

  var onError = function() {
  };

  _sendRequest('GET', { href: href }, '/bookmark/exists/', onSuccess, onError);
}

function addBookmark(expression, onSuccess, onError) {
  var onSuccessWrapper = function(response) {
    if (response.success) {
      onSuccess();
      UI.setPageBookmarkedIcon();
      UI.setNoPopup();
      return;
    } 
    onError(response.message);
  };

  _sendRequest('POST', { expression: expression }, '/bookmark/', onSuccessWrapper, onError);
}

chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
  chrome.tabs.get(tabId, _refreshTabData);
});

chrome.tabs.onUpdated.addListener(_inspectPage);

chrome.extension.onRequest.addListener(function(message, sender, sendResponse) {
  RequestHandler.handle(message);
});
