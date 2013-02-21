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
  setPageBookmarkedIcon: function() {
    chrome.pageAction.setIcon({tabId: currentTabId, path: '../icons/icon19-heart.png'});
  },
  setNoPopup: function() {
    chrome.pageAction.setPopup({tabId: currentTabId, popup: ''});
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
  var request = new XMLHttpRequest();

  if (method == 'POST') {
    request.open(method, 'http://nizi.in/a' + endpoint, true);
  } else {
    request.open(method, 'http://nizi.in/a' + endpoint + '?' + params, true);
  }

  request.setRequestHeader('Content-Type' , 'application/x-www-form-urlencoded');
  request.setRequestHeader('Accept' , 'application/json');
  if (method == 'POST') {
    request.send(params);
  } else {
    request.send();
  }
  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      response = JSON.parse(request.responseText);
      if (response.success) {
        onSuccess(response);
      } else {
        onError(response.message);
      }
    } else {
      console.log(request);
    }
  };
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

  _sendRequest('GET', 'href=' + escape(href), '/bookmark/exists/', onSuccess, onError);
}

function addBookmark(expression, onSuccess, onError) {
  var onSuccessWrapper = function() {
    onSuccess();
    UI.setPageBookmarkedIcon();
    UI.setNoPopup();
  };

  _sendRequest('POST', 'expression=' + expression, '/bookmark/', onSuccessWrapper, onError);
}

chrome.tabs.onSelectionChanged.addListener(function(tabId, info) {
  chrome.tabs.get(tabId, _refreshTabData);
});

chrome.tabs.onUpdated.addListener(_inspectPage);

chrome.extension.onRequest.addListener(function(message, sender, sendResponse) {
  RequestHandler.handle(message);
});
