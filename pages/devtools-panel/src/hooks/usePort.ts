import { useEffect } from 'react';

const port = chrome.runtime.connect({ name: 'matterPerf' });

const onMessage = function (msg: string) {
  console.log('recieved message from playground', msg);
};

const postMessage = function (msg: string) {
  if (port) {
    port.postMessage(msg);
    console.log('postMessage in usePort', msg);
  } else {
    console.warn('port not exists!');
  }
};

export default function usePort() {
  console.log('run usePort');

  useEffect(() => {
    // port.postMessage({ greeting: 'hello from panel' });

    port.onMessage.addListener(onMessage);

    console.log('use Port useEffect port', port);

    return port.onMessage.removeListener(onMessage);
  }, []);

  return { port, postMessage };
}
