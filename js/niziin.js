function addInstalledSentinel() {
  var isInstalledElement = document.createElement('div');
  isInstalledElement.id = 'extension-is-installed';
  document.body.appendChild(isInstalledElement);
}

chrome.extension.sendRequest("setExtensionVersion", function(response) {
});

addInstalledSentinel();

