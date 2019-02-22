((document) => {
  // check if we're active already
  chrome.runtime.sendMessage({
    method: 'isActivated'
  }, response => {
    if (response.status) {
      activate();
    }
    else {
      deactivate();
    }
  });

  // when we are activated, toggle accordingly
  chrome.runtime.connect({
    name: "tab"
  }).onMessage.addListener(data => {
    if (data) {
      activate();
    }
    else {
      deactivate();
    }
  });

  let activate = () => {
    chrome.runtime.sendMessage({
      method: 'getThemeData'
    }, response => {
      applyStyle(response.data || {});

      document.body.classList.add('slack-theme--enabled');
      document.body.classList.add('slack-theme--transitioning');

      window.setTimeout(() => {
        document.body.classList.remove('slack-theme--transitioning');
      }, /* TODO: check when animations are all done, but for now... */600);
    });
  };

  let applyStyle = (themeData = {}) => {
    let element = document.querySelector('link#slack-theme');

    if (!element) {
      element = document.createElement('link');
      // get the base CSS file from the extension which changes colours to the variables set
      element.href = chrome.extension.getURL('slack-theme.css');
      element.id = 'slack-theme';
      element.rel = 'stylesheet';
      element.type = 'text/css';

      document.head.appendChild(element);
    }

    let data = Object.assign({}, {
      // defaults
      '--page-background': '#000',
      '--page-foreground': '#fff',
      '--page-background-highlight': 'rgba(255, 255, 255, .2)'
    }, themeData);

    Object.keys(data).forEach(key => {
      // set the variables on :root
      document.documentElement.style.setProperty(key, data[key]);
    });
  };

  let deactivate = () => {
    document.body.classList.remove('slack-theme--enabled');
    document.body.classList.add('slack-theme--transitioning');

    window.setTimeout(() => {
      document.body.classList.remove('slack-theme--transitioning');
    }, /* TODO: check when animations are all done, but for now... */600);
  };
})(document);
