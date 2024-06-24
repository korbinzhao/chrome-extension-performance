let devtoolsPort: chrome.runtime.Port;
let contentPort: chrome.runtime.Port;

const onPort = function (port: chrome.runtime.Port) {
  console.log('--- onPort Connect in playground', port);

  if (port.name === 'devtools') {
    devtoolsPort = port;

    devtoolsPort.onMessage.addListener(function (msg) {
      console.log('recieve message in playground', msg);
      contentPort?.postMessage(msg);
      console.log('send message to content in playground', msg);
    });
  } else if (port.name === 'content') {
    contentPort = port;

    contentPort.onMessage.addListener(msg => {
      console.log('recieve message from content in playground', msg);
      devtoolsPort?.postMessage(msg);
      console.log('send message to devtools in playground', msg);
    });
  }
};

chrome.runtime.onConnect.addListener(onPort);
