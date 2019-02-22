(() => {
  let pbsId = {};

  let setIcon = (dark) => {
    if (!dark) {
      localStorage.activated = false;
      chrome.browserAction.setIcon({
        path: 'images/lslack24.ico'
      });
    }
    else {
      localStorage.activated = true;
      chrome.browserAction.setIcon({
        path: 'images/dslack24.ico'
      });
    }

    sendMessage(localStorage.activated);
  };

  let update = () => {
    if (localStorage.activated) {
      localStorage.activated = false;
      chrome.browserAction.setIcon({
        path: 'images/lslack24.ico'
      });
    }
    else {
      localStorage.activated = true;
      chrome.browserAction.setIcon({
        path: 'images/dslack24.ico'
      });
    }

    sendMessage(localStorage.activated);
  };

  let sendMessage = (message) => {
    for (let contentScriptId in pbsId) {
      let port = pbsId[contentScriptId];

      try {
        port.postMessage(message);
      }
      catch (e) {
        delete pbsId[contentScriptId];
      }
    }
  };

  if (typeof(localStorage.activated) === 'undefined') {
    setIcon(true);
  }

  chrome.runtime.onConnect.addListener((port) => {
    pbsId[port.sender.id + port.name] = port;
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.method === 'isActivated') {
      sendResponse({
        status: localStorage.activated
      });
    }
    else if (request.method === 'getThemeData') {
      sendResponse({
        data: localStorage.themeData
      });
    }
    else if (request.method === 'setThemeData') {
      let data = request.themeData;

      if (typeof(date) === 'string') {
        data = JSON.parse(data);
      }

      sendResponse({});
    }
    else {
      sendResponse({});
    }
  });

  if (localStorage.activated) {
    chrome.browserAction.setIcon({
      path: 'images/dslack24.ico'
    });
  }
  else {
    chrome.browserAction.setIcon({
      path: 'images/lslack24.ico'
    });
  }

  chrome.browserAction.onClicked.addListener(update);
})();
