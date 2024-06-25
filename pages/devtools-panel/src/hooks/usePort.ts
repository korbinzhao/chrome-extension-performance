import { useEffect } from 'react';

let port = chrome.runtime.connect({ name: 'devtools' });

port.onDisconnect.addListener(() => {
  console.warn('port devtools disconnected, retry');
  port = chrome.runtime.connect({ name: 'devtools' });
});

const onMessage = function (msg: string) {
  console.log('recieved message from playground', msg);
};

export default function usePort() {
  console.log('run usePort');

  useEffect(() => {
    port.onMessage.addListener(onMessage);

    console.log('use Port useEffect port', port);

    return port.onMessage.removeListener(onMessage);
  }, []);

  return port;
}
